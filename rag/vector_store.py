"""
SentinelOS AI – Vector Store & Embeddings Manager

Enterprise-grade interface to Qdrant vector database and
OpenAI embeddings model. Handles hybrid search (semantic + metadata),
collection management, and multi-tenant isolation.
"""

import logging
from typing import List, Dict, Any, Optional
from uuid import UUID

from qdrant_client import QdrantClient
from qdrant_client.models import (
    VectorParams, Distance, PointStruct, Filter, FieldCondition, MatchValue
)
from openai import AsyncOpenAI
from backend.app.config import settings

logger = logging.getLogger("sentinel.rag.vector_store")

# Global singleton clients
_qdrant_client: Optional[QdrantClient] = None
_openai_client: Optional[AsyncOpenAI] = None

COLLECTION_NAME = "sentinel_knowledge_base"
EMBEDDING_DIM = 1536


def get_qdrant_client() -> QdrantClient:
    """Get or initialize the Qdrant client."""
    global _qdrant_client
    if _qdrant_client is None:
        _qdrant_client = QdrantClient(
            host=settings.QDRANT_HOST,
            port=settings.QDRANT_PORT,
            timeout=30.0
        )
        logger.info(f"Initialized Qdrant client at {settings.QDRANT_HOST}:{settings.QDRANT_PORT}")
    return _qdrant_client


def get_openai_client() -> AsyncOpenAI:
    """Get or initialize the OpenAI client pointing to OpenRouter."""
    global _openai_client
    if _openai_client is None:
        _openai_client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY
        )
    return _openai_client


class VectorStoreManager:
    """Manages collections, embeddings, and retrieval in Qdrant."""

    @classmethod
    def initialize_collection(cls):
        """Create the Qdrant collection if it doesn't exist."""
        client = get_qdrant_client()
        collections = client.get_collections()
        
        if any(c.name == COLLECTION_NAME for c in collections.collections):
            client.delete_collection(COLLECTION_NAME) # We recreate it to update dimension to 1536
            logger.info("Deleted existing collection to update dimensions.")
            
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE),
        )
        # Create payload indices for fast tenant filtering
        client.create_payload_index(
            collection_name=COLLECTION_NAME,
            field_name="tenant_id",
            field_schema="keyword"
        )
        logger.info(f"Created Qdrant collection: {COLLECTION_NAME}")


    @classmethod
    async def generate_embeddings(cls, texts: List[str]) -> List[List[float]]:
        """Generate vector embeddings for a list of texts using OpenRouter."""
        if not texts:
            return []
            
        client = get_openai_client()
        try:
            response = await client.embeddings.create(
                input=texts,
                model=settings.EMBEDDING_MODEL
            )
            return [data.embedding for data in response.data]
        except Exception as e:
            logger.error(f"Failed to generate embeddings: {e}")
            raise

    @classmethod
    async def upsert_documents(cls, chunks: List[Dict[str, Any]]) -> bool:
        """
        Embed and upsert document chunks into Qdrant.
        Expected chunk format: {"text": "...", "metadata": {"tenant_id": "...", ...}}
        """
        if not chunks:
            return True

        import uuid
        client = get_qdrant_client()
        
        texts = [chunk["text"] for chunk in chunks]
        embeddings = await cls.generate_embeddings(texts)
        
        points = []
        for i, chunk in enumerate(chunks):
            point_id = str(uuid.uuid4())
            payload = chunk["metadata"].copy()
            payload["text"] = chunk["text"]  # Store text in payload for retrieval
            
            points.append(
                PointStruct(
                    id=point_id,
                    vector=embeddings[i],
                    payload=payload
                )
            )
            
        client.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )
        logger.info(f"Upserted {len(points)} vectors into Qdrant.")
        return True

    @classmethod
    async def hybrid_search(
        cls, 
        query: str, 
        tenant_id: UUID, 
        limit: int = 5,
        metadata_filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Perform a semantic search in Qdrant, strictly filtered by tenant_id
        and any additional metadata filters.
        """
        client = get_qdrant_client()
        
        # Generate query embedding
        query_embeddings = await cls.generate_embeddings([query])
        query_vector = query_embeddings[0]
        
        # Build tenant isolation filter
        must_conditions = [
            FieldCondition(key="tenant_id", match=MatchValue(value=str(tenant_id)))
        ]
        
        # Add additional metadata filters if provided
        if metadata_filters:
            for key, value in metadata_filters.items():
                must_conditions.append(
                    FieldCondition(key=key, match=MatchValue(value=value))
                )
                
        search_filter = Filter(must=must_conditions)
        
        # Execute search
        results = client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vector,
            query_filter=search_filter,
            limit=limit,
            with_payload=True
        )
        
        # Format results
        formatted_results = []
        for result in results:
            formatted_results.append({
                "score": result.score,
                "text": result.payload.get("text", ""),
                "metadata": {k: v for k, v in result.payload.items() if k != "text"}
            })
            
        return formatted_results
