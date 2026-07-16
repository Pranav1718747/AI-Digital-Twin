"""
SentinelOS AI – Celery Application Configuration

Production-grade Celery worker broker configuration with
dedicated task queues, retry policies, serialization settings,
and worker signal handlers for Neo4j connection lifecycle.
"""

import logging
from celery import Celery
from celery.signals import worker_init, worker_shutdown

from backend.app.config import settings
from digital_twin.app.neo4j_manager import Neo4jManager

logger = logging.getLogger("sentinel.celery")

# ─────────────────────────────────────────────────────────────────
# Celery Application Instance
# ─────────────────────────────────────────────────────────────────

celery_app = Celery(
    "sentinel_digital_twin",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

# ─────────────────────────────────────────────────────────────────
# Celery Configuration
# ─────────────────────────────────────────────────────────────────

celery_app.conf.update(
    # Serialization
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,

    # Task execution
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    worker_prefetch_multiplier=1,

    # Retry policy defaults
    task_default_retry_delay=10,
    task_max_retries=3,

    # Result backend
    result_expires=3600,

    # Dedicated task routing
    task_routes={
        "digital_twin.app.tasks.sync_employee_node": {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.sync_department_node": {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.sync_project_node": {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.sync_customer_node": {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.sync_employee_department_edge": {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.sync_employee_manager_edge": {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.sync_ticket_assignment_edge": {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.remove_node": {"queue": "graph_sync_queue"},
    },

    # Queue declarations
    task_queues={
        "graph_sync_queue": {
            "exchange": "sentinel_exchange",
            "routing_key": "graph.sync",
        },
    },
)

# ─────────────────────────────────────────────────────────────────
# Worker Lifecycle Hooks
# ─────────────────────────────────────────────────────────────────

@worker_init.connect
def on_worker_init(**kwargs):
    """Initialize the Neo4j driver when a Celery worker starts."""
    logger.info("Celery worker starting – initializing Neo4j connection pool...")
    is_connected = Neo4jManager.verify_connectivity()
    if not is_connected:
        logger.error("CRITICAL: Cannot connect to Neo4j. Worker may fail graph sync tasks.")


@worker_shutdown.connect
def on_worker_shutdown(**kwargs):
    """Close the Neo4j driver when a Celery worker shuts down."""
    logger.info("Celery worker shutting down – closing Neo4j connection pool...")
    Neo4jManager.close()


# ─────────────────────────────────────────────────────────────────
# Auto-discover tasks
# ─────────────────────────────────────────────────────────────────

celery_app.autodiscover_tasks(["digital_twin.app"])
