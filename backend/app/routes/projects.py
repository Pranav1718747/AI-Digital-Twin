"""
SentinelOS AI – Project & Ticket CRUD API Routes

Enterprise-grade REST endpoints for project lifecycle management
and Jira-linked ticket tracking with health score aggregation.
"""

import logging
from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database import get_db
from backend.app.models import Project, Ticket
from backend.app.schemas import (
    ProjectCreate, ProjectResponse,
    TicketCreate, TicketResponse,
    PaginatedResponse,
)
from backend.app.middleware.security import TokenPayload, get_current_user, require_clearance
from backend.app.services.audit_service import record_audit_event

logger = logging.getLogger("sentinel.routes.projects")
router = APIRouter(prefix="/projects", tags=["Projects"])


# ─────────────────────────────────────────────────────────────────
# Project Endpoints
# ─────────────────────────────────────────────────────────────────

@router.get("", response_model=PaginatedResponse)
async def list_projects(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(get_current_user),
):
    """List all projects within the user's tenant."""
    tenant_id = UUID(user.tenant_id)
    query = select(Project).where(Project.tenant_id == tenant_id)

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar_one()

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size).order_by(Project.name)
    projects = (await db.execute(query)).scalars().all()

    return PaginatedResponse(
        total=total, page=page, page_size=page_size,
        items=[ProjectResponse.model_validate(p).model_dump(mode="json") for p in projects],
    )


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(get_current_user),
):
    """Retrieve a single project by ID."""
    tenant_id = UUID(user.tenant_id)
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.tenant_id == tenant_id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
    return ProjectResponse.model_validate(project)


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(require_clearance("Level 3")),
):
    """Create a new project. Requires Level 3+ clearance."""
    tenant_id = UUID(user.tenant_id)
    project = Project(
        tenant_id=tenant_id,
        name=payload.name,
        jira_project_key=payload.jira_project_key,
        health_score=payload.health_score,
        target_completion_date=payload.target_completion_date,
    )
    db.add(project)
    await db.flush()

    await record_audit_event(
        db=db, user=user, action="CREATE", target_table="projects",
        record_id=project.id, clearance_required="Level 3",
        raw_payload=payload.model_dump(mode="json"),
    )

    logger.info(f"Project created: id={project.id} key={payload.jira_project_key}")
    return ProjectResponse.model_validate(project)


# ─────────────────────────────────────────────────────────────────
# Ticket Endpoints (nested under projects)
# ─────────────────────────────────────────────────────────────────

@router.get("/{project_id}/tickets", response_model=PaginatedResponse)
async def list_tickets(
    project_id: UUID,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, ge=1, le=100),
    status_filter: Optional[str] = Query(default=None, alias="status"),
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(get_current_user),
):
    """List all tickets for a project, with optional status filtering."""
    tenant_id = UUID(user.tenant_id)

    # Verify project belongs to tenant
    proj_result = await db.execute(
        select(Project).where(Project.id == project_id, Project.tenant_id == tenant_id)
    )
    if not proj_result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    query = select(Ticket).where(Ticket.project_id == project_id)
    if status_filter:
        query = query.where(Ticket.status == status_filter)

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar_one()

    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size).order_by(Ticket.ticket_key)
    tickets = (await db.execute(query)).scalars().all()

    return PaginatedResponse(
        total=total, page=page, page_size=page_size,
        items=[TicketResponse.model_validate(t).model_dump(mode="json") for t in tickets],
    )


@router.post("/{project_id}/tickets", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(
    project_id: UUID,
    payload: TicketCreate,
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(get_current_user),
):
    """Create a new ticket within a project."""
    tenant_id = UUID(user.tenant_id)

    # Verify project belongs to tenant
    proj_result = await db.execute(
        select(Project).where(Project.id == project_id, Project.tenant_id == tenant_id)
    )
    if not proj_result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    # Check duplicate ticket key
    existing = await db.execute(select(Ticket).where(Ticket.ticket_key == payload.ticket_key))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ticket key '{payload.ticket_key}' already exists.",
        )

    ticket = Ticket(
        project_id=project_id,
        ticket_key=payload.ticket_key,
        title=payload.title,
        status=payload.status,
        story_points=payload.story_points,
        assigned_employee_id=payload.assigned_employee_id,
        target_date=payload.target_date,
    )
    db.add(ticket)
    await db.flush()

    await record_audit_event(
        db=db, user=user, action="CREATE", target_table="tickets",
        record_id=ticket.id, raw_payload=payload.model_dump(mode="json"),
    )

    logger.info(f"Ticket created: id={ticket.id} key={payload.ticket_key}")
    return TicketResponse.model_validate(ticket)
