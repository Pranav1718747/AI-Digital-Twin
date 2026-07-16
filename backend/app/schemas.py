"""
SentinelOS AI – Pydantic Request/Response Schemas

Enterprise-grade schema definitions for API request validation
and response serialization. All schemas enforce strict validation
with proper field constraints, descriptions, and examples.
"""

from datetime import datetime, date
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# ─────────────────────────────────────────────────────────────────
# Tenant Schemas
# ─────────────────────────────────────────────────────────────────

class TenantCreate(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=255, description="Legal entity name")
    domain: str = Field(..., min_length=3, max_length=100, description="Primary email domain")
    license_tier: str = Field(default="Enterprise", description="Subscription tier")


class TenantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    company_name: str
    domain: str
    license_tier: str
    is_active: bool
    created_at: datetime


# ─────────────────────────────────────────────────────────────────
# User Schemas
# ─────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr = Field(..., description="Corporate email address")
    password: str = Field(..., min_length=12, max_length=128, description="Must be at least 12 characters")
    system_role: str = Field(..., description="Platform role: admin, manager, analyst, viewer")
    security_clearance: str = Field(default="Level 1", description="Security clearance level (1-5)")


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    email: str
    system_role: str
    security_clearance: str
    is_mfa_enabled: bool
    created_at: datetime


# ─────────────────────────────────────────────────────────────────
# Department Schemas
# ─────────────────────────────────────────────────────────────────

class DepartmentCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    code: str = Field(..., min_length=2, max_length=50, description="Unique department code within tenant")
    parent_department_id: Optional[UUID] = Field(default=None, description="Parent department for hierarchy")
    budget_limit_eur: float = Field(default=0.00, ge=0, description="Annual budget allocation in EUR")
    headcount_target: int = Field(default=0, ge=0)


class DepartmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    name: str
    code: str
    parent_department_id: Optional[UUID]
    budget_limit_eur: float
    headcount_target: int


# ─────────────────────────────────────────────────────────────────
# Employee Schemas
# ─────────────────────────────────────────────────────────────────

class EmployeeCreate(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    role_title: str = Field(..., min_length=2, max_length=150)
    department_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    billable_rate_eur: float = Field(default=0.00, ge=0)


class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    role_title: Optional[str] = Field(default=None, min_length=2, max_length=150)
    department_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    status: Optional[str] = None
    billable_rate_eur: Optional[float] = Field(default=None, ge=0)


class EmployeeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    email: str
    first_name: str
    last_name: str
    role_title: str
    department_id: Optional[UUID]
    manager_id: Optional[UUID]
    status: str
    billable_rate_eur: float


# ─────────────────────────────────────────────────────────────────
# Project Schemas
# ─────────────────────────────────────────────────────────────────

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    jira_project_key: str = Field(..., min_length=2, max_length=50)
    target_completion_date: date
    health_score: float = Field(default=1.00, ge=0, le=1)


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    name: str
    jira_project_key: str
    health_score: float
    target_completion_date: date


# ─────────────────────────────────────────────────────────────────
# Ticket Schemas
# ─────────────────────────────────────────────────────────────────

class TicketCreate(BaseModel):
    project_id: UUID
    ticket_key: str = Field(..., min_length=3, max_length=50)
    title: str = Field(..., min_length=3, max_length=255)
    status: str = Field(default="Open")
    story_points: int = Field(default=0, ge=0)
    assigned_employee_id: Optional[UUID] = None
    target_date: Optional[date] = None


class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    project_id: UUID
    ticket_key: str
    title: str
    status: str
    story_points: int
    assigned_employee_id: Optional[UUID]
    target_date: Optional[date]


# ─────────────────────────────────────────────────────────────────
# Customer Schemas
# ─────────────────────────────────────────────────────────────────

class CustomerCreate(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=255)
    domain: str = Field(..., min_length=3, max_length=100)
    contract_value_arr: float = Field(default=0.00, ge=0)
    assigned_csm_id: Optional[UUID] = None


class CustomerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    company_name: str
    domain: str
    contract_value_arr: float
    health_score: float
    assigned_csm_id: Optional[UUID]
    is_active: bool


# ─────────────────────────────────────────────────────────────────
# SOP Workflow Schemas
# ─────────────────────────────────────────────────────────────────

class SopWorkflowCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    trigger_type: str = Field(..., description="webhook, cron, manual, file_drop")
    graph_payload: dict = Field(..., description="React Flow JSON nodes and edges")


class SopWorkflowResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    name: str
    description: Optional[str]
    trigger_type: str
    graph_payload: dict
    is_active: bool
    created_at: datetime


# ─────────────────────────────────────────────────────────────────
# Ledger Account Schemas
# ─────────────────────────────────────────────────────────────────

class LedgerAccountCreate(BaseModel):
    account_number: str = Field(..., min_length=3, max_length=50)
    name: str = Field(..., min_length=2, max_length=255)
    account_type: str = Field(..., description="Asset, Liability, Equity, Revenue, Expense")
    balance_eur: float = Field(default=0.00)


class LedgerAccountResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    account_number: str
    name: str
    account_type: str
    balance_eur: float
    is_active: bool


# ─────────────────────────────────────────────────────────────────
# Audit Log Schema (read-only)
# ─────────────────────────────────────────────────────────────────

class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    timestamp: datetime
    user_email: str
    action: str
    target_table: str
    record_id: UUID
    clearance_required: str
    raw_payload: Optional[dict]


# ─────────────────────────────────────────────────────────────────
# Paginated Response Wrapper
# ─────────────────────────────────────────────────────────────────

class PaginatedResponse(BaseModel):
    """Generic paginated response wrapper for list endpoints."""
    total: int = Field(..., description="Total number of records matching the query")
    page: int = Field(..., ge=1)
    page_size: int = Field(..., ge=1, le=100)
    items: List[dict] = Field(default_factory=list)
