"""
SentinelOS AI – Neo4j Connection Manager

Production-grade async-compatible Neo4j driver manager with
connection pooling, health checks, and graceful shutdown.
"""

import logging
from typing import Optional

from neo4j import GraphDatabase, Driver, Session

from backend.app.config import settings

logger = logging.getLogger("sentinel.neo4j")


class Neo4jManager:
    """
    Manages the Neo4j driver lifecycle with connection pooling.
    Designed as a singleton to be shared across Celery workers.
    """

    _driver: Optional[Driver] = None

    @classmethod
    def get_driver(cls) -> Driver:
        """Get or create the Neo4j driver instance."""
        if cls._driver is None:
            cls._driver = GraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
                max_connection_lifetime=3600,
                max_connection_pool_size=50,
                connection_acquisition_timeout=30,
            )
            logger.info(f"Neo4j driver initialized: {settings.NEO4J_URI}")
        return cls._driver

    @classmethod
    def get_session(cls, database: str = "neo4j") -> Session:
        """Create a new Neo4j session from the pooled driver."""
        driver = cls.get_driver()
        return driver.session(database=database)

    @classmethod
    def verify_connectivity(cls) -> bool:
        """Test that the Neo4j database is reachable."""
        try:
            driver = cls.get_driver()
            driver.verify_connectivity()
            logger.info("Neo4j connectivity verified.")
            return True
        except Exception as e:
            logger.error(f"Neo4j connectivity check failed: {e}")
            return False

    @classmethod
    def close(cls) -> None:
        """Gracefully close the Neo4j driver."""
        if cls._driver is not None:
            cls._driver.close()
            cls._driver = None
            logger.info("Neo4j driver closed.")
