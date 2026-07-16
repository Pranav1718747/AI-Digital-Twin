from datetime import datetime, date, timezone
from uuid import uuid4
from typing import Optional, List
from sqlalchemy import String, ForeignKey, Integer, Numeric, Boolean, DateTime, Date, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from backend.app.database import Base

class Tenant(Base):
    __tablename__ = "tenants"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    license_tier: Mapped[str] = mapped_column(String(50), default="Enterprise")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    users: Mapped[List["User"]] = relationship(back_populates="tenant", cascade="all, delete-orphan")
    departments: Mapped[List["Department"]] = relationship(back_populates="tenant", cascade="all, delete-orphan")
    customers: Mapped[List["Customer"]] = relationship(back_populates="tenant", cascade="all, delete-orphan")
    sop_workflows: Mapped[List["SopWorkflow"]] = relationship(back_populates="tenant", cascade="all, delete-orphan")
    ledger_accounts: Mapped[List["LedgerAccount"]] = relationship(back_populates="tenant", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    system_role: Mapped[str] = mapped_column(String(50), nullable=False)
    security_clearance: Mapped[str] = mapped_column(String(50), default="Level 1")
    is_mfa_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    tenant: Mapped["Tenant"] = relationship(back_populates="users")
    employee: Mapped[Optional["Employee"]] = relationship(back_populates="user")


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    parent_department_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("departments.id"))
    budget_limit_eur: Mapped[float] = mapped_column(Numeric(15, 2), default=0.00)
    headcount_target: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    tenant: Mapped["Tenant"] = relationship(back_populates="departments")
    employees: Mapped[List["Employee"]] = relationship(back_populates="department")

    __table_args__ = (
        UniqueConstraint("tenant_id", "code", name="uq_tenant_department_code"),
    )


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    role_title: Mapped[str] = mapped_column(String(150), nullable=False)
    department_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="SET NULL"))
    manager_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("employees.id"))
    status: Mapped[str] = mapped_column(String(50), default="Active")
    billable_rate_eur: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00)

    # Relationships
    user: Mapped[Optional["User"]] = relationship(back_populates="employee")
    department: Mapped[Optional["Department"]] = relationship(back_populates="employees")
    tickets: Mapped[List["Ticket"]] = relationship(back_populates="assignee")


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    jira_project_key: Mapped[str] = mapped_column(String(50), nullable=False)
    health_score: Mapped[float] = mapped_column(Numeric(3, 2), default=1.00)
    target_completion_date: Mapped[date] = mapped_column(Date, nullable=False)

    # Relationships
    tickets: Mapped[List["Ticket"]] = relationship(back_populates="project", cascade="all, delete-orphan")


class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    project_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    ticket_key: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    story_points: Mapped[int] = mapped_column(Integer, default=0)
    assigned_employee_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("employees.id", ondelete="SET NULL"), nullable=True)
    target_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    # Relationships
    project: Mapped["Project"] = relationship(back_populates="tickets")
    assignee: Mapped[Optional["Employee"]] = relationship(back_populates="tickets")


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(100), nullable=False)
    contract_value_arr: Mapped[float] = mapped_column(Numeric(15, 2), default=0.00)
    health_score: Mapped[float] = mapped_column(Numeric(3, 2), default=1.00)
    assigned_csm_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("employees.id", ondelete="SET NULL"))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    tenant: Mapped["Tenant"] = relationship(back_populates="customers")


class SopWorkflow(Base):
    __tablename__ = "sop_workflows"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(1000))
    trigger_type: Mapped[str] = mapped_column(String(50), nullable=False)
    graph_payload: Mapped[dict] = mapped_column(JSONB, nullable=False) # Store React Flow JSON nodes and edges
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    tenant: Mapped["Tenant"] = relationship(back_populates="sop_workflows")


class LedgerAccount(Base):
    __tablename__ = "ledger_accounts"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    account_number: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    account_type: Mapped[str] = mapped_column(String(50), nullable=False) # Asset, Liability, Equity, Revenue, Expense
    balance_eur: Mapped[float] = mapped_column(Numeric(15, 2), default=0.00)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    tenant: Mapped["Tenant"] = relationship(back_populates="ledger_accounts")

    __table_args__ = (
        UniqueConstraint("tenant_id", "account_number", name="uq_tenant_ledger_account"),
    )


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    user_email: Mapped[str] = mapped_column(String(255), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    target_table: Mapped[str] = mapped_column(String(100), nullable=False)
    record_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    clearance_required: Mapped[str] = mapped_column(String(50), default="Level 1")
    raw_payload: Mapped[Optional[dict]] = mapped_column(JSONB)
