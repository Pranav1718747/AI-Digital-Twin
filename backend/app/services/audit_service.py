"""
SentinelOS AI – Audit Logging Service

Production-grade audit trail recorder for SOC2 compliance.
Every state-modifying action is persisted with actor identity,
target resource, clearance level, and raw payload diff.
"""

import logging
from uuid import UUID
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.models import AuditLog
from backend.app.middleware.security import TokenPayload

logger = logging.getLogger("sentinel.audit")


async def record_audit_event(
    db: AsyncSession,
    user: TokenPayload,
    action: str,
    target_table: str,
    record_id: UUID,
    clearance_required: str = "Level 1",
    raw_payload: Optional[dict] = None,
) -> AuditLog:
    """
    Persist an audit log entry for a state-modifying operation.

    Args:
        db: Active database session.
        user: Authenticated user token payload.
        action: Verb describing the operation (CREATE, UPDATE, DELETE).
        target_table: The database table affected.
        record_id: The UUID of the affected record.
        clearance_required: Minimum clearance needed for this action.
        raw_payload: Optional JSON diff of the change.

    Returns:
        The created AuditLog instance.
    """
    entry = AuditLog(
        tenant_id=UUID(user.tenant_id),
        user_email=user.email,
        action=action,
        target_table=target_table,
        record_id=record_id,
        clearance_required=clearance_required,
        raw_payload=raw_payload,
    )
    db.add(entry)
    await db.flush()

    logger.info(
        f"AUDIT | action={action} table={target_table} "
        f"record={record_id} user={user.email} "
        f"clearance={clearance_required}"
    )
    return entry
