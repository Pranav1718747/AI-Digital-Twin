"""
SentinelOS AI – Document Management & RAG API Routes

Enterprise-grade REST endpoints for uploading documents,
triggering RAG ingestion, and performing semantic search.
"""

import logging
from uuid import UUID
from typing import Optional, List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File, Form
from pydantic import BaseModel

from backend.app.middleware.security import TokenPayload, get_current_user, require_clearance
from backend.app.services.audit_service import record_audit_event
from backend.app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from rag.pipeline import RAGPipeline

logger = logging.getLogger("sentinel.routes.documents")
router = APIRouter(prefix="/documents", tags=["Documents & Knowledge Base"])


class SearchResponse(BaseModel):
    results: List[Dict[str, Any]]


@router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: TokenPayload = Depends(require_clearance("Level 2")),
):
    """
    Upload a document (PDF) for RAG ingestion.
    Requires Level 2+ clearance.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF documents are supported for ingestion at this time."
        )

    tenant_id = UUID(user.tenant_id)
    user_id = UUID(user.sub)
    file_bytes = await file.read()

    # Trigger ingestion pipeline
    # In a fully production environment, this would be pushed to a Celery task.
    # For now, we await it directly as an async operation.
    result = await RAGPipeline.ingest_document(
        file_bytes=file_bytes,
        file_name=file.filename,
        tenant_id=tenant_id,
        uploaded_by=user_id
    )

    if result.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result.get("detail", "Unknown error during ingestion.")
        )

    await record_audit_event(
        db=db, user=user, action="UPLOAD_DOCUMENT", target_table="knowledge_base",
        record_id=user_id, clearance_required="Level 2",
        raw_payload={"file_name": file.filename, "status": result.get("status")}
    )

    return {
        "message": "Document ingested successfully.",
        "details": result
    }


@router.get("/search", response_model=SearchResponse)
async def search_documents(
    query: str = Query(..., min_length=3),
    top_k: int = Query(default=5, ge=1, le=20),
    user: TokenPayload = Depends(get_current_user),
):
    """
    Perform a semantic search against the tenant's knowledge base.
    """
    tenant_id = UUID(user.tenant_id)
    
    try:
        results = await RAGPipeline.retrieve_context(
            query=query,
            tenant_id=tenant_id,
            top_k=top_k
        )
        return SearchResponse(results=results)
    except Exception as e:
        logger.error(f"Search failed for query '{query}': {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Vector search is temporarily unavailable."
        )
