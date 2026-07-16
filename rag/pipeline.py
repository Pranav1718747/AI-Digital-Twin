"""
SentinelOS AI – RAG Ingestion Pipeline

Orchestrates the flow from document extraction to semantic chunking,
embedding generation, and vector database ingestion.
"""

import logging
from typing import List, Dict, Any, Optional
from uuid import UUID

from rag.extractor import DocumentExtractor
from rag.vector_store import VectorStoreManager

logger = logging.getLogger("sentinel.rag.pipeline")


class RAGPipeline:
    """Orchestrates document ingestion and hybrid retrieval."""

    @classmethod
    async def ingest_document(
        cls, 
        file_bytes: bytes, 
        file_name: str, 
        tenant_id: UUID, 
        uploaded_by: UUID
    ) -> Dict[str, Any]:
        """
        Process a PDF document:
        1. Extract text and metadata
        2. Chunk text if necessary
        3. Embed and upsert to Qdrant
        """
        logger.info(f"Starting RAG ingestion for document: {file_name}")
        
        # 1. Extract text and metadata
        try:
            document_chunks = DocumentExtractor.extract_pdf(
                file_bytes=file_bytes,
                file_name=file_name,
                tenant_id=tenant_id,
                uploaded_by=uploaded_by
            )
        except Exception as e:
            logger.error(f"Extraction failed for {file_name}: {e}")
            return {"status": "error", "detail": f"Extraction failed: {str(e)}"}
            
        if not document_chunks:
            return {"status": "skipped", "detail": "No text could be extracted."}

        # 2. Re-chunk if pages are too large (naive approach for now)
        final_chunks = []
        for chunk in document_chunks:
            # If a page has more than 1500 words, split it further
            if len(chunk.text.split()) > 1500:
                sub_texts = DocumentExtractor.chunk_text(chunk.text, max_chunk_size=1000)
                for i, sub_text in enumerate(sub_texts):
                    sub_metadata = chunk.metadata.copy()
                    sub_metadata["chunk_index"] = i
                    final_chunks.append({"text": sub_text, "metadata": sub_metadata})
            else:
                final_chunks.append(chunk.to_dict())

        # 3. Embed and Upsert
        try:
            await VectorStoreManager.upsert_documents(final_chunks)
            logger.info(f"Successfully ingested {len(final_chunks)} chunks for {file_name}")
            return {
                "status": "success",
                "file_name": file_name,
                "chunks_processed": len(final_chunks)
            }
        except Exception as e:
            logger.error(f"Vector upsert failed for {file_name}: {e}")
            return {"status": "error", "detail": f"Vector storage failed: {str(e)}"}

    @classmethod
    async def retrieve_context(
        cls, 
        query: str, 
        tenant_id: UUID, 
        top_k: int = 5,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Retrieve relevant context for a given query."""
        logger.info(f"Retrieving context for query: '{query}' (tenant: {tenant_id})")
        return await VectorStoreManager.hybrid_search(
            query=query,
            tenant_id=tenant_id,
            limit=top_k,
            metadata_filters=filters
        )
