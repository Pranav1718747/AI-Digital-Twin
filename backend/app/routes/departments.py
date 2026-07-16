"""
SentinelOS AI – Department CRUD API Routes

Enterprise-grade REST endpoints for org hierarchy management.
Supports nested parent-child department trees, budget tracking,
and headcount targets with tenant isolation and audit trails.
"""

import logging
from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models import Department
from backend.app.schemas import DepartmentCreate, DepartmentResponse, PaginatedResponse
from backend.app.middleware.security import TokenPayload, get_current_user, require_clearance
from backend.app.services.audit_service import record_audit_event

logger = logging.getLogger("sentinel.routes.departments")
router = APIRouter(prefix="/departments", tags=["Departments"])


@router.get("", response_model=PaginatedResponse)
async def list_departments(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    parent_id: Optional[UUID] = Query(default=None, description="Filter by parent department"),
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(get_current_user),
):
    """List all departments within the user's tenant, optionally filtered by parent."""
    tenant_id = UUID(user.tenant_id)
    query = select(Department).where(Department.tenant_id == tenant_id)

    if parent_id is not None:
        query = query.where(Department.parent_department_id == parent_id)

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar_one()

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size).order_by(Department.name)
    departments = (await db.execute(query)).scalars().all()

    return PaginatedResponse(
        total=total, page=page, page_size=page_size,
        items=[DepartmentResponse.model_validate(d).model_dump(mode="json") for d in departments],
    )


@router.get("/{department_id}", response_model=DepartmentResponse)
async def get_department(
    department_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(get_current_user),
):
    """Retrieve a single department by ID."""
    tenant_id = UUID(user.tenant_id)
    result = await db.execute(
        select(Department).where(Department.id == department_id, Department.tenant_id == tenant_id)
    )
    dept = result.scalar_one_or_none()
    if not dept:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found.")
    return DepartmentResponse.model_validate(dept)


@router.post("", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
async def create_department(
    payload: DepartmentCreate,
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(require_clearance("Level 4")),
):
    """Create a new department. Requires Level 4+ clearance (VP/Director)."""
    tenant_id = UUID(user.tenant_id)

    # Validate unique code within tenant
    existing = await db.execute(
        select(Department).where(Department.tenant_id == tenant_id, Department.code == payload.code)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Department code '{payload.code}' already exists in this tenant.",
        )

    # Validate parent exists if specified
    if payload.parent_department_id:
        parent = await db.execute(
            select(Department).where(
                Department.id == payload.parent_department_id,
                Department.tenant_id == tenant_id,
            )
        )
        if not parent.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent department not found in tenant.",
            )

    dept = Department(
        tenant_id=tenant_id,
        name=payload.name,
        code=payload.code,
        parent_department_id=payload.parent_department_id,
        budget_limit_eur=payload.budget_limit_eur,
        headcount_target=payload.headcount_target,
    )
    db.add(dept)
    await db.flush()

    await record_audit_event(
        db=db, user=user, action="CREATE", target_table="departments",
        record_id=dept.id, clearance_required="Level 4",
        raw_payload=payload.model_dump(mode="json"),
    )

    logger.info(f"Department created: id={dept.id} code={payload.code}")
    return DepartmentResponse.model_validate(dept)


@router.delete("/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_department(
    department_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(require_clearance("Level 5")),
):
    """Delete a department. Requires Level 5 clearance (C-Suite)."""
    tenant_id = UUID(user.tenant_id)
    result = await db.execute(
        select(Department).where(Department.id == department_id, Department.tenant_id == tenant_id)
    )
    dept = result.scalar_one_or_none()
    if not dept:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found.")

    await db.delete(dept)
    await db.flush()

    await record_audit_event(
        db=db, user=user, action="DELETE", target_table="departments",
        record_id=department_id, clearance_required="Level 5",
    )
    logger.info(f"Department deleted: id={department_id}")
