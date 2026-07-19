"""
SentinelOS AI – FastAPI Application Entry Point

Production-grade application factory with structured logging,
CORS configuration, lifespan management, and router registration.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config import settings
from backend.app.routes.employees import router as employees_router
from backend.app.routes.departments import router as departments_router
from backend.app.routes.projects import router as projects_router
from backend.app.routes.customers import router as customers_router
from backend.app.routes.graph import router as graph_router
from backend.app.routes.documents import router as documents_router
from backend.app.routes.agent import router as agent_router
from backend.app.routes.simulation import router as simulation_router
from backend.app.websockets import ws_manager

# ─────────────────────────────────────────────────────────────────
# Structured Logging Configuration
# ─────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("sentinel.main")


# ─────────────────────────────────────────────────────────────────
# Application Lifespan – Startup & Shutdown Hooks
# ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle: startup and shutdown events."""
    logger.info("SentinelOS API starting up...")
    logger.info(f"Environment: {settings.APP_ENV}")
    
    # Initialize Qdrant collection with the correct dimensions
    try:
        from rag.vector_store import VectorStoreManager
        VectorStoreManager.initialize_collection()
        logger.info("Qdrant collection initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize Qdrant collection: {e}")
        
    yield
    logger.info("SentinelOS API shutting down...")
    await ws_manager.shutdown()


# ─────────────────────────────────────────────────────────────────
# Application Factory
# ─────────────────────────────────────────────────────────────────

app = FastAPI(
    title="SentinelOS AI – Digital Twin API",
    description="Enterprise Digital Twin Operating System API Gateway",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────────
# Router Registration
# ─────────────────────────────────────────────────────────────────

app.include_router(employees_router, prefix="/api/v1")
app.include_router(departments_router, prefix="/api/v1")
app.include_router(projects_router, prefix="/api/v1")
app.include_router(customers_router, prefix="/api/v1")
app.include_router(graph_router, prefix="/api/v1")
app.include_router(documents_router, prefix="/api/v1")
app.include_router(agent_router, prefix="/api/v1")
app.include_router(simulation_router, prefix="/api/v1")


# ─────────────────────────────────────────────────────────────────
# Health Check Endpoint
# ─────────────────────────────────────────────────────────────────

@app.get("/api/health", tags=["System"])
async def health_check():
    """Basic liveness probe for Kubernetes/Docker health checks."""
    return {
        "status": "healthy",
        "service": "sentinel-api",
        "version": "1.0.0",
    }

