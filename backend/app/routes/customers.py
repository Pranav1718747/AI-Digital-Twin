"""
SentinelOS AI – Customer CRUD API Routes

Enterprise-grade REST endpoints for customer account management.
Tracks contract ARR values, health scores, and CSM assignments
with tenant isolation and audit compliance.
"""

import logging
from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models import Customer, Employee
from backend.app.schemas import CustomerCreate, CustomerResponse, PaginatedResponse
from backend.app.middleware.security import TokenPayload, get_current_user, require_clearance
from backend.app.services.audit_service import record_audit_event

logger = logging.getLogger("sentinel.routes.customers")
router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("", response_model=PaginatedResponse)
async def list_customers(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    csm_id: Optional[UUID] = Query(default=None, description="Filter by assigned CSM"),
    active_only: bool = Query(default=True),
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(get_current_user),
):
    """List all customer accounts within the user's tenant."""
    tenant_id = UUID(user.tenant_id)
    query = select(Customer).where(Customer.tenant_id == tenant_id)

    if active_only:
        query = query.where(Customer.is_active == True)  # noqa: E712
    if csm_id:
        query = query.where(Customer.assigned_csm_id == csm_id)

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar_one()

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size).order_by(Customer.company_name)
    customers = (await db.execute(query)).scalars().all()

    return PaginatedResponse(
        total=total, page=page, page_size=page_size,
        items=[CustomerResponse.model_validate(c).model_dump(mode="json") for c in customers],
    )


@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(get_current_user),
):
    """Retrieve a single customer account by ID."""
    tenant_id = UUID(user.tenant_id)
    result = await db.execute(
        select(Customer).where(Customer.id == customer_id, Customer.tenant_id == tenant_id)
    )
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found.")
    return CustomerResponse.model_validate(customer)


@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
async def create_customer(
    payload: CustomerCreate,
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(require_clearance("Level 2")),
):
    """Create a new customer account. Requires Level 2+ clearance (CSM)."""
    tenant_id = UUID(user.tenant_id)

    # Validate assigned CSM exists if specified
    if payload.assigned_csm_id:
        csm_result = await db.execute(
            select(Employee).where(
                Employee.id == payload.assigned_csm_id,
                Employee.tenant_id == tenant_id,
            )
        )
        if not csm_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assigned CSM employee not found in tenant.",
            )

    customer = Customer(
        tenant_id=tenant_id,
        company_name=payload.company_name,
        domain=payload.domain,
        contract_value_arr=payload.contract_value_arr,
        assigned_csm_id=payload.assigned_csm_id,
    )
    db.add(customer)
    await db.flush()

    await record_audit_event(
        db=db, user=user, action="CREATE", target_table="customers",
        record_id=customer.id, clearance_required="Level 2",
        raw_payload=payload.model_dump(mode="json"),
    )

    logger.info(f"Customer created: id={customer.id} domain={payload.domain}")
    return CustomerResponse.model_validate(customer)
