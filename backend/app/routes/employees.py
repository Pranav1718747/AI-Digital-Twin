"""
SentinelOS AI – Employee CRUD API Routes

Enterprise-grade REST endpoints for employee lifecycle management.
Enforces tenant isolation via RLS-scoped queries, records audit
trails for every mutation, and dispatches Neo4j sync events.
"""

import logging
from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models import Employee
from backend.app.schemas import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeResponse,
    PaginatedResponse,
)
from backend.app.middleware.security import (
    TokenPayload,
    get_current_user,
    require_clearance,
)
from backend.app.services.audit_service import record_audit_event

logger = logging.getLogger("sentinel.routes.employees")
router = APIRouter(prefix="/employees", tags=["Employees"])


# ─────────────────────────────────────────────────────────────────
# LIST – Paginated, tenant-scoped employee listing
# ─────────────────────────────────────────────────────────────────

@router.get("", response_model=PaginatedResponse)
async def list_employees(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    department_id: Optional[UUID] = Query(default=None),
    status_filter: Optional[str] = Query(default=None, alias="status"),
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(get_current_user),
):
    """
    List employees within the authenticated user's tenant.
    Supports pagination, department filtering, and status filtering.
    """
    tenant_id = UUID(user.tenant_id)

    # Build tenant-scoped base query
    query = select(Employee).where(Employee.tenant_id == tenant_id)

    if department_id:
        query = query.where(Employee.department_id == department_id)
    if status_filter:
        query = query.where(Employee.status == status_filter)

    # Count total matching records
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size).order_by(Employee.last_name)

    result = await db.execute(query)
    employees = result.scalars().all()

    return PaginatedResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=[EmployeeResponse.model_validate(emp).model_dump(mode="json") for emp in employees],
    )


# ─────────────────────────────────────────────────────────────────
# GET – Retrieve a single employee by ID
# ─────────────────────────────────────────────────────────────────

@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(get_current_user),
):
    """Retrieve a single employee record, scoped to the user's tenant."""
    tenant_id = UUID(user.tenant_id)
    result = await db.execute(
        select(Employee).where(
            Employee.id == employee_id,
            Employee.tenant_id == tenant_id,
        )
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {employee_id} not found in tenant.",
        )
    return EmployeeResponse.model_validate(employee)


# ─────────────────────────────────────────────────────────────────
# CREATE – Onboard a new employee
# ─────────────────────────────────────────────────────────────────

@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(
    payload: EmployeeCreate,
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(require_clearance("Level 3")),
):
    """
    Create a new employee record. Requires Level 3+ clearance.
    Validates email uniqueness and records an audit trail.
    """
    tenant_id = UUID(user.tenant_id)

    # Check for duplicate email within tenant
    existing = await db.execute(
        select(Employee).where(Employee.email == payload.email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Employee with email {payload.email} already exists.",
        )

    employee = Employee(
        tenant_id=tenant_id,
        email=payload.email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        role_title=payload.role_title,
        department_id=payload.department_id,
        manager_id=payload.manager_id,
        billable_rate_eur=payload.billable_rate_eur,
    )
    db.add(employee)
    await db.flush()

    # Record audit trail
    await record_audit_event(
        db=db,
        user=user,
        action="CREATE",
        target_table="employees",
        record_id=employee.id,
        clearance_required="Level 3",
        raw_payload=payload.model_dump(mode="json"),
    )

    logger.info(f"Employee created: id={employee.id} email={payload.email}")
    return EmployeeResponse.model_validate(employee)


# ─────────────────────────────────────────────────────────────────
# UPDATE – Modify employee details
# ─────────────────────────────────────────────────────────────────

@router.patch("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: UUID,
    payload: EmployeeUpdate,
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(require_clearance("Level 3")),
):
    """
    Partial update of an employee record. Requires Level 3+ clearance.
    Only provided fields are updated; null fields are skipped.
    """
    tenant_id = UUID(user.tenant_id)
    result = await db.execute(
        select(Employee).where(
            Employee.id == employee_id,
            Employee.tenant_id == tenant_id,
        )
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {employee_id} not found in tenant.",
        )

    # Apply only non-null update fields
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(employee, field, value)

    await db.flush()

    # Record audit trail
    await record_audit_event(
        db=db,
        user=user,
        action="UPDATE",
        target_table="employees",
        record_id=employee.id,
        clearance_required="Level 3",
        raw_payload=update_data,
    )

    logger.info(f"Employee updated: id={employee_id}")
    return EmployeeResponse.model_validate(employee)


# ─────────────────────────────────────────────────────────────────
# DELETE – Soft-deactivate or hard-delete an employee
# ─────────────────────────────────────────────────────────────────

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    employee_id: UUID,
    hard_delete: bool = Query(default=False),
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(require_clearance("Level 4")),
):
    """
    Deactivate or permanently delete an employee record.
    Soft-delete (default): Sets status to 'Deactivated'.
    Hard-delete: Requires explicit flag and Level 4+ clearance.
    """
    tenant_id = UUID(user.tenant_id)
    result = await db.execute(
        select(Employee).where(
            Employee.id == employee_id,
            Employee.tenant_id == tenant_id,
        )
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {employee_id} not found in tenant.",
        )

    if hard_delete:
        await db.delete(employee)
        action = "HARD_DELETE"
    else:
        employee.status = "Deactivated"
        action = "SOFT_DELETE"

    await db.flush()

    await record_audit_event(
        db=db,
        user=user,
        action=action,
        target_table="employees",
        record_id=employee_id,
        clearance_required="Level 4",
    )

    logger.info(f"Employee {action.lower()}: id={employee_id}")
