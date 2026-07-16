# SentinelOS AI: Backend Implementation Plan
## Production-Grade Codebase Blueprint
**Version:** 1.0.0-PROD-BACKEND  
**Classification:** Proprietary / Engineering Leadership & VCs  
**Target Funding Stage:** €10,000,000 Series Seed/A  

---

## Table of Contents
1. **Directory Setup & Relational Initialization**
   - 1.1 Project Directory Tree Architecture
   - 1.2 Core Python Dependency Specification (`requirements.txt`)
   - 1.3 Local Environment Variables Setup (`.env.example`)
2. **SQLAlchemy 2.0 & Alembic Database Setup**
   - 2.1 Async Database Session Connection Manager (`database.py`)
   - 2.2 Relational Model Class Declarations (`models.py`)
   - 2.3 Alembic Setup Configuration (`alembic.ini` & `env.py`)
   - 2.4 Database Migration Pipeline Scripts

---

## 1. Directory Setup & Relational Initialization

### 1.1 Project Directory Tree Architecture
To build a scalable codebase, SentinelOS is structured as a collection of modular subdirectories. Each module has clear boundaries and is designed to run in isolated Docker containers.

```
sentinelos-ai/
├── backend/                             # FastAPI API Services Gateways
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                      # ASGI Application Init
│   │   ├── database.py                  # SQLAlchemy Connection pooling
│   │   ├── models.py                    # Relational Declarative Models
│   │   ├── schemas.py                   # Pydantic v2 validation contracts
│   │   ├── config.py                    # Environment parser settings
│   │   ├── routes/                      # REST Route modules
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── projects.py
│   │   │   ├── employees.py
│   │   │   └── finance.py
│   │   └── middleware/                  # Request filters & handlers
│   │       ├── __init__.py
│   │       └── security.py
│   ├── migrations/                      # Alembic schema tracking scripts
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   ├── alembic.ini                      # Alembic config profile
│   └── Dockerfile.backend
│
├── agents/                              # LangGraph Agent Core engines
│   ├── app/
│   │   ├── __init__.py
│   │   ├── graph_compiler.py            # LangGraph node transitions compiler
│   │   ├── router.py                    # LLM dynamic Router engine
│   │   ├── tools/                       # PydanticAI tool helpers
│   │   │   ├── __init__.py
│   │   │   ├── db_tools.py
│   │   │   ├── git_tools.py
│   │   │   └── comms_tools.py
│   │   └── profiles/                    # Agent system prompts
│   │       ├── __init__.py
│   │       ├── ceo.py
│   │       └── forecast.py
│   └── Dockerfile.agents
│
├── digital-twin/                        # Graph Synchronization engine
│   ├── app/
│   │   ├── __init__.py
│   │   ├── celery_app.py                # Background task queue initialization
│   │   ├── graph_sync.py                # PostgreSQL-to-Neo4j sync handlers
│   │   └── risk_engine.py               # Cascadic dependency evaluation runs
│   └── Dockerfile.twin
│
├── rag/                                 # Vector Ingestion Pipelines
│   ├── app/
│   │   ├── __init__.py
│   │   ├── parser.py                    # Docling / PaddleOCR layout extraction
│   │   ├── splitter.py                  # Semantic markdown splitters
│   │   └── hybrid_retriever.py          # Dense + Sparse fusion retrieval
│   └── Dockerfile.rag
│
├── shared/                              # Shared Pydantic schemas and models
│   ├── __init__.py
│   └── schemas.py
│
├── docker/                              # Local services orchestrator compose config
│   └── docker-compose.yml
│
└── scripts/                             # Host automation scripts
    ├── parse_ingress.sh
    └── bootstrap_databases.sh
```

---

### 1.2 Core Python Dependency Specification (`requirements.txt`)
All backend services run on Python 3.12. We lock key packages in `requirements.txt` to prevent dependency conflicts during container builds:

```text
# =========================================================================
# Core FastAPI REST Framework & ASGI Webserver
# =========================================================================
fastapi==0.110.0
uvicorn[standard]==0.28.0
pydantic==2.6.4
pydantic-settings==2.2.1

# =========================================================================
# Database Connections, ORM & Database Migration Tier
# =========================================================================
SQLAlchemy==2.0.28
asyncpg==0.29.0
alembic==1.13.1
psycopg-pool==3.2.1
neo4j==5.18.0

# =========================================================================
# Asynchronous Work Queue Broker (Celery & RabbitMQ bindings)
# =========================================================================
celery==5.3.6
pika==1.3.2
redis==5.0.3

# =========================================================================
# AI Layer & Cognitive Orchestration Frameworks
# =========================================================================
langgraph==0.0.30
pydantic-ai==0.0.12
openai==1.14.1
google-generativeai==0.4.0
qdrant-client==1.8.1
cohere==5.0.2

# =========================================================================
# Document Extraction, OCR & Text Parsers
# =========================================================================
docling==0.1.2
PyMuPDF==1.23.26
paddleocr==2.7.3
numpy==1.26.4

# =========================================================================
# Security, Auth & Web Utilities
# =========================================================================
PyJWT[crypto]==2.8.0
cryptography==42.0.5
python-multipart==0.0.9
requests==2.31.0
websockets==12.0
```

---

### 1.3 Local Environment Variables Setup (`.env.example`)
This example environment file defines the configurations needed to connect to databases, API backends, and system services. Rename this file to `.env` in your local development workspace:

```bash
# =========================================================================
# SentinelOS Environment Variables Example Configuration
# =========================================================================

# 1. Core Service Configurations
APP_ENV=development # 'development', 'staging', 'production'
SECRET_KEY=9478f10ea82b450c9dc8a10bcdef56a7984cd12345e67890f1e2d3c4b5a6d7e8
TOKEN_EXPIRE_MINUTES=15

# 2. Relational Database Credentials (PostgreSQL 16)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sentinel_db
DB_USER=sentinel_user
DB_PASSWORD=secure_pass

# 3. Graph Database Credentials (Neo4j 5 Enterprise)
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=secure_neo_pass

# 4. Vector Database Credentials (Qdrant)
QDRANT_HOST=localhost
QDRANT_PORT=6333

# 5. Caching and Message Brokers (Redis & RabbitMQ)
REDIS_URL=redis://localhost:6379/0
RABBITMQ_URL=amqp://guest:guest@localhost:5672//

# 6. External API Gateways (LLM Providers & Cohere)
OPENAI_API_KEY=sk-proj-placeholderkey1234567890abcdef
GEMINI_API_KEY=AIzaSyPlaceholderGeminiKey-abcd1234
COHERE_API_KEY=co_placeholderCohereKey-1234abcd

# 7. Enterprise SSO Identity Provider (Keycloak)
KEYCLOAK_REALM_URL=https://sso.company.com/realms/sentinel-enterprise
KEYCLOAK_AUDIENCE=sentinel-gateway-api
```

---

## 2. SQLAlchemy 2.0 & Alembic Database Setup

### 2.1 Async Database Session Connection Manager (`database.py`)
This database connector module initializes our connection pool, handles transaction lifecycles, and exposes async session dependencies:

```python
# /opt/sentinel/backend/app/database.py
# SQLAlchemy Async Database Connection Pool setup

import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from backend.app.config import settings # Config loader referencing env configs

logger = logging.getLogger("sentinel.database")

# Build async database connection URL
DB_URL = (
    f"postgresql+asyncpg://{settings.DB_USER}:{settings.DB_PASSWORD}"
    f"@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
)

# Initialize asynchronous database engine with connection pooling
engine = create_async_engine(
    DB_URL,
    echo=False,                       # Set to True for query debugging in dev
    pool_size=20,                     # Size of connection pool
    max_overflow=10,                  # Allow temporary overflow connections
    pool_recycle=1800,                # Recycle connections after 30 minutes
    pool_pre_ping=True                # Ping database to detect stale connections
)

# Async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base declarative model class for SQLAlchemy mapping
class Base(DeclarativeBase):
    pass

# Dependency helper injection to retrieve db session
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Transaction aborted. Rolling back changes. Error: {str(e)}")
            raise e
```

---

### 2.2 Relational Model Class Declarations (`models.py`)
This file defines our database models, mapping columns, constraints, and relationships in SQLAlchemy 2.0 declarative syntax:

```python
# /opt/sentinel/backend/app/models.py
# Declarative Relational Models mappings

from datetime import datetime, date
from uuid import uuid4
from sqlalchemy import String, ForeignKey, Integer, Numeric, Boolean, DateTime, Date, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from backend.app.database import Base

# =========================================================================
# SECTION 2.2.1: TENANTS, USERS, AND EMPLOYEES MAPS
# =========================================================================

class Tenant(Base):
    __tablename__ = "tenants"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    license_tier: Mapped[str] = mapped_column(String(50), default="Enterprise")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    users: Mapped[list["User"]] = relationship(back_populates="tenant", cascade="all, delete-orphan")
    departments: Mapped[list["Department"]] = relationship(back_populates="tenant", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    system_role: Mapped[str] = mapped_column(String(50), nullable=False)
    security_clearance: Mapped[str] = mapped_column(String(50), default="Level 1")
    is_mfa_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

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
    employees: Mapped[list["Employee"]] = relationship(back_populates="department")

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
    tickets: Mapped[list["Ticket"]] = relationship(back_populates="assignee")


class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    project_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    ticket_key: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    story_points: Mapped[int] = mapped_column(Integer, default=0)
    assigned_employee_id: Mapped[Optional[UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("employees.id", ondelete="SET NULL"))
    target_date: Mapped[Optional[date]] = mapped_column(Date)

    # Relationships
    project: Mapped["Project"] = relationship(back_populates="tickets")
    assignee: Mapped[Optional["Employee"]] = relationship(back_populates="tickets")


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    tenant_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    jira_project_key: Mapped[str] = mapped_column(String(50), nullable=False)
    health_score: Mapped[float] = mapped_column(Numeric(3, 2), default=1.00)
    target_completion_date: Mapped[date] = mapped_column(Date, nullable=False)

    # Relationships
    tickets: Mapped[list["Ticket"]] = relationship(back_populates="project", cascade="all, delete-orphan")
```

---

### 2.3 Alembic Setup Configuration (`alembic.ini` & `env.py`)
Alembic manages database schema upgrades and schema tracking. To enable asynchronous migrations, we configure the database driver and connection helper script:

#### `alembic.ini` Database Config
Set the migration script location and target database URL:
```ini
# /opt/sentinel/backend/alembic.ini
# Alembic Database Migration configuration file

[alembic]
script_location = migrations
# Connection URL pointing to asyncpg driver
sqlalchemy.url = postgresql+asyncpg://sentinel_user:secure_pass@localhost:5432/sentinel_db

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic
```

#### `migrations/env.py` Migration Runner
Configure Alembic to import our declarative models and run migrations asynchronously:
```python
# /opt/sentinel/backend/migrations/env.py
# Asynchronous Alembic Database Migration environment run context

import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context

# 1. Load the database configurations from alembic.ini
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 2. Import Base models class to compile target metadata schemas
from backend.app.database import Base
from backend.app import models
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run database migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    """Run database migrations in 'online' mode using async connections."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
```

---

### 2.4 Database Migration Pipeline Scripts
To apply database migrations during deployment, we use an automated migration shell script:

```bash
#!/bin/bash
# /opt/sentinel/scripts/bootstrap_databases.sh
# Relational Database Bootstrapper and Schema Upgrade script

set -e # Exit immediately if any command returns a non-zero status

echo "Starting SentinelOS database bootstrap pipeline..."

# 1. Export database environment configurations
export PGPASSWORD="secure_pass"

# 2. Wait for PostgreSQL service port to accept connections
echo "Waiting for PostgreSQL service port at 5432..."
until pg_isready -h "localhost" -p 5432 -U "sentinel_user"; do
  sleep 1
done
echo "PostgreSQL database engine is online."

# 3. Change directory to API codebase target folder
cd /opt/sentinel/backend

# 4. Generate the initial database migration script
echo "Checking and generating database migration revisions..."
alembic revision --autogenerate -m "Bootstrap initial schemas"

# 5. Apply migrations to upgrade the database schema
echo "Applying database schema upgrades..."
alembic upgrade head

echo "Relational database bootstrap pipeline complete."
```

---

## 3. Event Synchronization Workers

SentinelOS updates the graph database asynchronously using a background Celery worker queue that processes events published by the API gateway.

```
       [ FastAPI Database Commit ]
                    |
                    v
      (Publish RabbitMQ JSON Event)
                    |
                    v
         [ RabbitMQ Broker Queue ]
                    |
                    v
       [ Celery Worker Process ]
                    |
         +----------+----------+
         |                     |
         v                     v
   [ Write to Neo4j ]    [ Log to Audits ]
```

---

### 3.1 Celery Broker & Work Queue Setup
The Celery application is configured to connect to RabbitMQ for message brokers and uses Redis to store task results.

#### `celery_app.py` Configuration Setup
This script configures serialization formats, concurrent worker threads, and queue routing parameters:
```python
# /opt/sentinel/digital-twin/app/celery_app.py
# Background Celery Application Configuration setup

import os
from celery import Celery
from kombu import Queue, Exchange

# Load broker credentials from environment variables
RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672//")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/1")

# Initialize Celery app context
app = Celery(
    "sentinel_twin_workers",
    broker=RABBITMQ_URL,
    backend=REDIS_URL,
    include=["digital-twin.app.tasks"] # Import tasks package
)

# Configure Celery execution settings
app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    
    # Task scheduling and worker settings
    worker_concurrency=4,             # Limit concurrent worker processes per node
    worker_prefetch_multiplier=1,      # Prevent workers from pulling excessive tasks
    task_acks_late=True,               # Acknowledge task only after execution completes
    task_reject_on_worker_lost=True,   # Reject and requeue task if worker crashes
    
    # Custom queue routing topologies
    task_queues=(
        Queue(
            "graph_sync_queue",
            exchange=Exchange("sentinel_sync", type="direct"),
            routing_key="sync.graph"
        ),
        Queue(
            "risk_analysis_queue",
            exchange=Exchange("sentinel_analysis", type="direct"),
            routing_key="analysis.risk"
        )
    ),
    task_default_queue="graph_sync_queue",
    task_default_exchange="sentinel_sync",
    task_default_routing_key="sync.graph"
)

if __name__ == "__main__":
    app.start()
```

---

### 3.2 Task Declarations & Database Synchronization Scripts
This module contains the background task definitions that process database changes and replicate them as nodes and relationships inside Neo4j:

```python
# /opt/sentinel/digital-twin/app/tasks.py
# Asynchronous Database Mirroring & Graph Tasks

import logging
from neo4j import GraphDatabase
from celery.exceptions import Retry
from digital-twin.app.celery_app import app
import os

logger = logging.getLogger("sentinel.tasks")

# Initialize Neo4j Driver Connection pool
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "secure_neo_pass")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

# =========================================================================
# SECTION 3.2.1: NODE CREATION SYNCHRONIZATION TASKS
# =========================================================================

@app.task(
    name="sentinel.tasks.graph.create_project_node",
    bind=True,
    max_retries=5,
    default_retry_delay=5
)
def create_project_node(self, project_id: str, name: str, key: str):
    logger.info(f"Syncing Project node to Neo4j. ID: {project_id}, Key: {key}")
    
    query = """
    MERGE (p:Project {id: $project_id})
    SET p.name = $name,
        p.jira_project_key = $key,
        p.sync_timestamp = datetime()
    """
    
    try:
        with driver.session(database="neo4j") as session:
            session.run(query, project_id=project_id, name=name, key=key)
    except Exception as e:
        logger.error(f"Failed to sync project node: {str(e)}. Retrying...")
        # Re-queue task using exponential backoff retry parameters
        raise self.retry(exc=e, countdown=2 ** self.request.retries * 5)


@app.task(
    name="sentinel.tasks.graph.create_employee_node",
    bind=True,
    max_retries=5,
    default_retry_delay=5
)
def create_employee_node(self, employee_id: str, email: str, first_name: str, last_name: str, role_title: str):
    logger.info(f"Syncing Employee node to Neo4j. ID: {employee_id}, Email: {email}")
    
    query = """
    MERGE (e:Employee {id: $employee_id})
    SET e.email = $email,
        e.name = $name,
        e.role_title = $role_title,
        e.status = 'Active',
        e.sync_timestamp = datetime()
    """
    name = f"{first_name} {last_name}"
    
    try:
        with driver.session(database="neo4j") as session:
            session.run(query, employee_id=employee_id, email=email, name=name, role_title=role_title)
    except Exception as e:
        logger.error(f"Failed to sync employee node: {str(e)}. Retrying...")
        raise self.retry(exc=e, countdown=2 ** self.request.retries * 5)

# =========================================================================
# SECTION 3.2.2: RELATIONSHIP CREATION SYNCHRONIZATION TASKS
# =========================================================================

@app.task(
    name="sentinel.tasks.graph.assign_employee_department",
    bind=True,
    max_retries=5,
    default_retry_delay=5
)
def assign_employee_department(self, employee_id: str, dept_code: str, assigned_at: str):
    logger.info(f"Mapping relationship (Employee {employee_id})-[:MEMBER_OF]->(Department {dept_code})")
    
    query = """
    MATCH (e:Employee {id: $employee_id})
    MATCH (d:Department {code: $dept_code})
    MERGE (e)-[r:MEMBER_OF]->(d)
    SET r.since = datetime($assigned_at)
    """
    
    try:
        with driver.session(database="neo4j") as session:
            result = session.run(query, employee_id=employee_id, dept_code=dept_code, assigned_at=assigned_at)
            summary = result.consume()
            if summary.counters.relationships_created == 0:
                logger.warning("Relationship sync executed but zero edges were modified. Verify source keys exist.")
    except Exception as e:
        logger.error(f"Failed to sync relationship edge: {str(e)}. Retrying...")
        raise self.retry(exc=e, countdown=2 ** self.request.retries * 5)
```

---

### 3.3 Graph Transaction Deadlock Prevention
To prevent database deadlocks when writing to Neo4j from concurrent worker threads, we apply the following locking patterns in our tasks:

1. **Deterministic Edge Creation:** We always matching nodes alphabetically by their labels before creating a relationship:
   ```cypher
   // Always match parent nodes first, then child elements:
   MATCH (p:Project {id: $proj_id})
   MATCH (t:Ticket {id: $t_id})
   MERGE (t)-[:PART_OF_PROJECT]->(p)
   ```
2. **Explicit Locks:** For critical, multi-step updates, we acquire an explicit lock on a dummy node before running Cypher updates:
   ```cypher
   MATCH (lock:WriteLock {target: 'organizational_structure'})
   SET lock.active_writer = $worker_id
   // Perform updates below...
   ```

---

## 4. Vector Indexing & RAG Pipelines

SentinelOS uses a hybrid RAG pipeline to ingest unstructured documents, parse layouts, chunk sections semantically, and index vectors inside **Qdrant**.

```
             [ PDF Upload API Endpoint ]
                          |
                          v
         (Execute Async Parsing Task in Celery)
                          |
         +----------------+----------------+
         |                                 |
         v                                 v
   [ Extract Text ]                [ Run PaddleOCR ]
   (PyMuPDF Reader)                (Table Image OCR)
         |                                 |
         +----------------+----------------+
                          |
                          v
              [ Markdown Layout Buffer ]
                          |
                          v
             [ Semantic Markdown Splitter ]
                          |
                          v
           (Vectorize & Upsert to Qdrant)
```

---

### 4.1 Layout-Aware Document Ingestion & Parser Implementation
This module extracts selectable text using PyMuPDF. If pages contain scanned images or tables, it falls back to PaddleOCR:

```python
# /opt/sentinel/rag/app/parser.py
# Layout-Aware Document Ingestion Parser

import fitz  # PyMuPDF
from paddleocr import PaddleOCR
import os
import logging
from typing import Dict, Any

logger = logging.getLogger("sentinel.rag.parser")

class DocumentParser:
    def __init__(self):
        # Initialize PaddleOCR engine
        self.ocr = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)

    def extract_pdf_layout(self, pdf_path: str) -> str:
        logger.info(f"Analyzing PDF document: {pdf_path}")
        doc = fitz.open(pdf_path)
        markdown_buffer = []

        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # 1. Attempt standard digital text extraction
            text = page.get_text("blocks") # Returns list of text blocks with coords
            
            # If the extracted page contains negligible text, treat it as a scanned page
            if len(" ".join([b[4] for b in text]).strip()) < 50:
                logger.info(f"Page {page_num + 1} appears scanned. Invoking PaddleOCR...")
                ocr_text = self._ocr_page(page, page_num)
                markdown_buffer.append(f"## Page {page_num + 1} (OCR Mode)\n{ocr_text}")
            else:
                # Arrange text blocks vertically
                sorted_blocks = sorted(text, key=lambda b: (b[1], b[0]))
                page_markdown = f"## Page {page_num + 1}\n"
                for b in sorted_blocks:
                    block_text = b[4]
                    if block_text.strip():
                        page_markdown += f"\n{block_text}"
                markdown_buffer.append(page_markdown)
                
        return "\n\n".join(markdown_buffer)

    def _ocr_page(self, page, page_num: int) -> str:
        # Convert page to image for OCR processing
        pix = page.get_pixmap(dpi=150)
        img_temp_path = f"/tmp/ocr_temp_p{page_num}.png"
        pix.save(img_temp_path)
        
        try:
            result = self.ocr.ocr(img_temp_path, cls=True)
            ocr_lines = []
            if result and result[0]:
                for line in result[0]:
                    text_value = line[1][0]
                    confidence = line[1][1]
                    if confidence > 0.60: # Filter out low-confidence OCR noise
                        ocr_lines.append(text_value)
            return "\n".join(ocr_lines)
        finally:
            if os.path.exists(img_temp_path):
                os.remove(img_temp_path)
```

---

### 4.2 Semantic Splitting Implementation
We chunk text along logical markdown headers (`##`, `###`) to preserve context boundaries:

```python
# /opt/sentinel/rag/app/splitter.py
# Semantic Markdown Splitting Engine

import re
from typing import List, Dict, Any

class SemanticSplitter:
    def __init__(self, max_words: int = 400, overlap_words: int = 80):
        self.max_words = max_words
        self.overlap_words = overlap_words

    def split_document(self, markdown_text: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        # Split document by headers
        sections = re.split(r'(?=\n#{2,3}\s)', markdown_text)
        chunks = []
        chunk_idx = 0

        for section in sections:
            if not section.strip():
                continue
            
            words = section.split()
            if len(words) > self.max_words:
                # If a section is too long, split it by sentence while maintaining overlap
                sentences = re.split(r'(?<=[.!?])\s+', section)
                current_chunk_words = []
                for sentence in sentences:
                    sentence_words = sentence.split()
                    if len(current_chunk_words) + len(sentence_words) > self.max_words:
                        text_payload = " ".join(current_chunk_words)
                        chunks.append(self._build_chunk(text_payload, chunk_idx, metadata))
                        chunk_idx += 1
                        
                        # Retain overlap words
                        current_chunk_words = current_chunk_words[-self.overlap_words:] + sentence_words
                    else:
                        current_chunk_words.extend(sentence_words)
                
                if current_chunk_words:
                    text_payload = " ".join(current_chunk_words)
                    chunks.append(self._build_chunk(text_payload, chunk_idx, metadata))
                    chunk_idx += 1
            else:
                chunks.append(self._build_chunk(section, chunk_idx, metadata))
                chunk_idx += 1
                
        return chunks

    def _build_chunk(self, text: str, index: int, meta: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "document_id": meta["document_id"],
            "chunk_index": index,
            "tenant_id": meta["tenant_id"],
            "clearance_level": meta.get("clearance_level", "Level 1"),
            "text_content": text.strip(),
            "projects": meta.get("projects", [])
        }
```

---

### 4.3 Hybrid Retriever & Cohere Rerank Module
To maximize retrieval accuracy, we use a hybrid search pipeline that combines PostgreSQL BM25 keyword matching and Qdrant dense vector search, rank-merging the results before re-ranking:

```python
# /opt/sentinel/rag/app/hybrid_retriever.py
# Hybrid Search Retrieval and Reranking Pipeline

from qdrant_client import QdrantClient
from cohere import Client as CohereClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import List, Dict, Any

class HybridRetriever:
    def __init__(self, qdrant_host: str, qdrant_port: int, cohere_api_key: str):
        self.qdrant = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.cohere = CohereClient(api_key=cohere_api_key)

    async def retrieve_contexts(self, query: str, query_vector: List[float], tenant_id: str, db: AsyncSession, top_k: int = 5) -> List[str]:
        # 1. Retrieve Dense Candidates from Qdrant
        dense_candidates = self._search_qdrant(query_vector, tenant_id, limit=20)
        
        # 2. Retrieve Sparse Candidates from PostgreSQL BM25 Index
        sparse_candidates = await self._search_postgres_bm25(query, tenant_id, db, limit=20)
        
        # 3. Merge candidates using Reciprocal Rank Fusion (RRF)
        candidates = self._merge_candidates_rrf(dense_candidates, sparse_candidates, k=60)
        if not candidates:
            return []
            
        # 4. Format inputs for Cohere Reranker
        doc_texts = [c["text_content"] for c in candidates]
        
        # 5. Execute Reranking
        response = self.cohere.rerank(
            model="rerank-english-v3.0",
            query=query,
            documents=doc_texts,
            top_n=top_k
        )
        
        # 6. Return top-ranked chunks with relevance scores above 0.65
        final_contexts = []
        for result in response.results:
            if result.relevance_score >= 0.65:
                final_contexts.append(doc_texts[result.index])
                
        return final_contexts

    def _search_qdrant(self, vector: List[float], tenant_id: str, limit: int) -> List[Dict[str, Any]]:
        results = self.qdrant.search(
            collection_name="sentinel_knowledge_base",
            query_vector=vector,
            query_filter={
                "must": [
                    {"key": "tenant_id", "match": {"value": tenant_id}}
                ]
            },
            limit=limit
        )
        return [
            {
                "document_id": r.payload["document_id"],
                "text_content": r.payload["text_content"]
            }
            for r in results
        ]

    async def _search_postgres_bm25(self, query: str, tenant_id: str, db: AsyncSession, limit: int) -> List[Dict[str, Any]]:
        # Query BM25 index on global search entities table
        sql = text("""
            SELECT entity_ref_id, description
            FROM global_search_entities
            WHERE tenant_id = :tenant_id AND entity_type = 'Document'
            AND to_tsvector('english', description) @@ plainto_tsquery('english', :query)
            LIMIT :limit
        """)
        
        result = await db.execute(sql, {"tenant_id": tenant_id, "query": query, "limit": limit})
        return [
            {
                "document_id": str(row[0]),
                "text_content": row[1]
            }
            for row in result.fetchall()
        ]

    def _merge_candidates_rrf(self, dense: List[Dict[str, Any]], sparse: List[Dict[str, Any]], k: int) -> List[Dict[str, Any]]:
        scores = {}
        for rank, item in enumerate(dense):
            doc_id = item["document_id"]
            scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (rank + 1 + k))
            
        for rank, item in enumerate(sparse):
            doc_id = item["document_id"]
            scores[doc_id] = scores.get(doc_id, 0.0) + (1.0 / (rank + 1 + k))
            
        sorted_ids = sorted(scores, key=scores.get, reverse=True)
        all_candidates = {c["document_id"]: c for c in dense + sparse}
        return [all_candidates[doc_id] for doc_id in sorted_ids]
```

---

## 5. REST Controllers & Authorization Security

SentinelOS manages external HTTP routes and secures them using Keycloak OpenID Connect token validations.

```
       [ Request Client ]
               |
               v
     (Security Middleware)  -- Parse JWT, Check Signatures via RS256 JWKS
               |
               v
     (Clearance Evaluator)  -- Validate User Level >= Route Clearance Target
               |
               v
  [ FastAPI Route Controller ]
```

---

### 5.1 Keycloak Authentication Middleware & Token Verification Setup
This middleware intercepts incoming HTTP requests, decodes the bearer token, verifies signatures, and injects user context:

```python
# /opt/sentinel/backend/app/middleware/security.py
# OIDC Token Signature Verification Middleware

import logging
from fastapi import Request, HTTPException, status
import jwt
from jwt.exceptions import InvalidTokenError
from backend.app.config import settings

logger = logging.getLogger("sentinel.middleware")

class TokenSecurityValidator:
    def __init__(self):
        self.jwks_url = f"{settings.KEYCLOAK_REALM_URL}/protocol/openid-connect/certs"
        # Load JWKS client context to compile active verification keys
        self.jwks_client = jwt.PyJWKClient(self.jwks_url)

    async def get_current_user_context(self, request: Request) -> dict:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Bearer token missing or invalid"
            )
            
        token = auth_header.split(" ")[1]
        try:
            # Match signing keys dynamically from the Keycloak certificates cache
            signing_key = self.jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience=settings.KEYCLOAK_AUDIENCE
            )
            return payload
        except InvalidTokenError as e:
            logger.error(f"OIDC validation exception encountered: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Security token verification failed"
            )

    @staticmethod
    def enforce_clearance(user_context: dict, required_clearance: int):
        user_clearance = user_context.get("security_clearance_level", "Level 1")
        # Map string (e.g. 'Level 3') to numeric weight score
        user_level = int(user_clearance.split(" ")[1])
        
        if user_level < required_clearance:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Insufficient clearance level"
            )
```

---

### 5.2 Endpoint Routing Blueprint Controllers
This module manages REST API requests for projects and employees, applying security filters and database transaction scopes:

```python
# /opt/sentinel/backend/app/routes/employees.py
# Asynchronous REST Employees Endpoint controller

from fastapi import APIRouter, Depends, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from backend.app.database import get_db
from backend.app.schemas import EmployeeCreateSchema
from backend.app.models import Employee
from backend.app.middleware.security import TokenSecurityValidator

router = APIRouter(prefix="/api/v1/employees", tags=["employees"])
security = TokenSecurityValidator()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def onboard_new_employee(
    request: Request,
    payload: EmployeeCreateSchema,
    db: AsyncSession = Depends(get_db)
):
    # 1. Validate caller credentials and enforce Level 3 clearance (Managers)
    user_ctx = await security.get_current_user_context(request)
    security.enforce_clearance(user_ctx, required_clearance=3)
    
    # 2. Map and write employee details to PostgreSQL
    new_employee = Employee(
        tenant_id=payload.tenant_id,
        email=payload.email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        role_title=payload.role_title,
        billable_rate_eur=payload.billable_rate_eur
    )
    db.add(new_employee)
    await db.flush() # Flush to retrieve new_employee.id UUID
    
    # 3. Apply Row-Level Security (RLS) parameter mapping
    await db.execute(text("SET LOCAL app.current_tenant_id = :tid"), {"tid": payload.tenant_id})
    
    # 4. Return success metadata payload
    return {
        "status": "success",
        "employee_id": str(new_employee.id),
        "message": "Employee onboarded successfully."
    }
```

---

## 6. Redis WebSocket Event Broadcasting

To support real-time state updates on the client UI, SentinelOS runs a WebSocket server backed by Redis Pub/Sub:

```python
# /opt/sentinel/backend/app/websockets.py
# Real-Time WebSocket Broadcaster Connection Broker

import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import redis.asyncio as aioredis
import logging

router = APIRouter()
logger = logging.getLogger("sentinel.websockets")

class ClientConnectionPool:
    def __init__(self):
        # Maps active connections by tenant ID: {tenant_id: [WebSocket]}
        self.connections: dict[str, list[WebSocket]] = {}

    async def register_client(self, websocket: WebSocket, tenant_id: str):
        await websocket.accept()
        if tenant_id not in self.connections:
            self.connections[tenant_id] = []
        self.connections[tenant_id].append(websocket)
        logger.info(f"New client registered for tenant: {tenant_id}")

    def deregister_client(self, websocket: WebSocket, tenant_id: str):
        if tenant_id in self.connections:
            self.connections[tenant_id].remove(websocket)
            if not self.connections[tenant_id]:
                del self.connections[tenant_id]
        logger.info(f"Client disconnected from tenant: {tenant_id}")

    async def broadcast_event(self, tenant_id: str, event_json: str):
        if tenant_id in self.connections:
            for connection in self.connections[tenant_id]:
                try:
                    await connection.send_text(event_json)
                except Exception:
                    self.deregister_client(connection, tenant_id)

connection_pool = ClientConnectionPool()

@router.websocket("/ws/events/{tenant_id}")
async def event_websocket_route(websocket: WebSocket, tenant_id: str):
    await connection_pool.register_client(websocket, tenant_id)
    
    # Connect to Redis Pub/Sub channel
    redis_client = aioredis.from_url("redis://localhost:6379/0")
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(f"channel:tenant:{tenant_id}")
    
    async def listen_redis_events():
        try:
            while True:
                # Poll Redis for updates in the background
                message = await pubsub.get_message(ignore_subscribe_messages=True)
                if message and message["data"]:
                    event_payload = message["data"].decode("utf-8")
                    await connection_pool.broadcast_event(tenant_id, event_payload)
                await asyncio.sleep(0.02)
        except asyncio.CancelledError:
            pass

    # Start the Redis listener task in the background
    listener_task = asyncio.create_task(listen_redis_events())
    
    try:
        while True:
            # Keep connection open and check for incoming messages
            data = await websocket.receive_text()
            logger.info(f"Message received from client: {data}")
    except WebSocketDisconnect:
        connection_pool.deregister_client(websocket, tenant_id)
        listener_task.cancel()
        await pubsub.unsubscribe(f"channel:tenant:{tenant_id}")
        await redis_client.close()
```

---

## 7. LangGraph Stateful Orchestration

SentinelOS uses **LangGraph** to manage multi-agent workflows, persisting conversation history and execution state inside PostgreSQL.

```
                  +--------------------------------+
                  |         INCOMING PROMPT        |
                  +--------------------------------+
                                   |
                                   v
                      [ LLM Router Selector ]
                                   |
         +-------------------------+-------------------------+
         | (Code / Repo Query)                               | (Strategic / General Query)
         v                                                   v
   [ Claude 3.5 Sonnet ]                              [ GPT-4o Agent ]
         |                                                   |
         +-------------------------+-------------------------+
                                   |
                                   v
                     [ LangGraph Execution Loop ]
                       - Retrieve Vector RAG
                       - Traverse Neo4j Relationships
                       - Pause for Human Approval Gate
```

---

### 7.1 LangGraph Compiler & Execution State Setup
This module compiles our state graph and manages node transitions using a PostgreSQL database checkpointer:

```python
# /opt/sentinel/agents/app/graph_compiler.py
# Stateful Agentic Graph Compiler

from typing import Dict, Any, Literal
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.postgres import PostgresSaver
from psycopg_pool import ConnectionPool
from pydantic import BaseModel, Field
from openai import AsyncOpenAI
import os

# Initialize database pool for state saving checkpoints
pool = ConnectionPool(
    conninfo="postgresql://sentinel_user:secure_pass@localhost:5432/sentinel_db",
    max_size=10
)
checkpointer = PostgresSaver(pool)

# Define structured state schema using Pydantic
class AgentState(BaseModel):
    conversation_id: str = Field(..., description="Unique thread identifier")
    current_agent: str = Field("CEOAgent", description="Active executor node")
    user_context: Dict[str, Any] = Field(default_factory=dict, description="User roles and permissions")
    query_text: str = Field(..., description="Original user prompt")
    retrieved_contexts: list[str] = Field(default_factory=list, description="Vector RAG chunks")
    extracted_graph_nodes: list[str] = Field(default_factory=list, description="Neo4j sub-graph nodes")
    plan_steps: list[str] = Field(default_factory=list, description="Dynamic execution plan steps")
    completed_steps: list[str] = Field(default_factory=list, description="Steps completed so far")
    intermediate_results: Dict[str, Any] = Field(default_factory=dict, description="Outputs from tool execution")
    agent_history: list[Dict[str, str]] = Field(default_factory=list, description="Conversation log history")
    pending_approvals: list[Dict[str, Any]] = Field(default_factory=list, description="Tasks awaiting human verification")

# -------------------------------------------------------------------------
# GRAPH NODE DEFINITIONS
# -------------------------------------------------------------------------

async def fetch_rag_context(state: AgentState) -> Dict[str, Any]:
    # Invoke our hybrid retriever module
    query = state.query_text
    tenant_id = state.user_context["tenant_id"]
    clearance = state.user_context["clearance_level"]
    
    # We pass a placeholder vector; in production, compute embeddings using BGE-M3
    dummy_vector = [0.0] * 1024
    contexts = await hybrid_retriever.retrieve_contexts(
        query=query,
        query_vector=dummy_vector,
        tenant_id=tenant_id,
        clearance_level=clearance
    )
    return {"retrieved_contexts": contexts}

async def query_neo4j_graph(state: AgentState) -> Dict[str, Any]:
    # Extract entities and query Neo4j
    query = state.query_text
    # Dummy extraction; in production, use PydanticAI entity classifier
    entity_name = "Project Alpha"
    
    graph_context = []
    cypher = """
    MATCH (n {name: $name})-[r*1..2]-(neighbors)
    RETURN n.name, type(r[0]), neighbors.name LIMIT 10
    """
    with neo4j_driver.session() as session:
        result = session.run(cypher, name=entity_name)
        for record in result:
            graph_context.append(f"{record[0]} - {record[1]} -> {record[2]}")
            
    return {"extracted_graph_nodes": graph_context}

async def execute_ceo_reasoning(state: AgentState) -> Dict[str, Any]:
    # Invoke CEO Reasoning loop using prompt definitions
    prompt = f"""
    Context RAG details: {state.retrieved_contexts}
    Context Graph relationships: {state.extracted_graph_nodes}
    User Query: {state.query_text}
    """
    
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are the CEO Agent. Review corporate twin data and propose strategy solutions."},
            {"role": "user", "content": prompt}
        ]
    )
    
    content = response.choices[0].message.content
    return {
        "intermediate_results": {"ceo_response": content},
        "agent_history": state.agent_history + [{"role": "assistant", "content": content}]
    }

# -------------------------------------------------------------------------
# CONDITIONAL EDGES AND GRAPH COMPILATION
# -------------------------------------------------------------------------

def check_kpi_breaches(state: AgentState) -> Literal["retrieve_context", "end"]:
    # Route logic: if RAG context is empty, retrieve data, otherwise terminate
    if not state.retrieved_contexts:
        return "retrieve_context"
    return "end"

# Initialize stateful compiler
workflow = StateGraph(AgentState)

# Add processing nodes
workflow.add_node("retrieve_context", fetch_rag_context)
workflow.add_node("query_graph", query_neo4j_graph)
workflow.add_node("ceo_reasoning", execute_ceo_reasoning)

# Define execution path flow
workflow.set_entry_point("retrieve_context")
workflow.add_edge("retrieve_context", "query_graph")
workflow.add_edge("query_graph", "ceo_reasoning")
workflow.add_edge("ceo_reasoning", END)

# Compile graph with Postgres checkpointer savers
compiled_agent_flow = workflow.compile(checkpointer=checkpointer)
```

---

### 7.2 PydanticAI Validation Interfaces
We define structured models to validate tool parameters and agent outputs:

```python
# /opt/sentinel/agents/app/tools/db_tools.py
# PydanticAI Structured Database Query Tools

from pydantic_ai import Agent, RunContext
from pydantic import BaseModel, Field
from typing import List, Optional
import os

# Output validation schema for SQL queries
class DatabaseQueryResult(BaseModel):
    query_executed: str = Field(..., description="The raw SQL statement run against the database")
    columns_returned: List[str] = Field(..., description="List of columns included in the result set")
    rows_data: List[List[str]] = Field(..., description="Structured rows containing text representations of records")
    row_count: int = Field(..., description="Total number of records returned")

sql_execution_agent = Agent(
    model="openai:gpt-4o",
    result_type=DatabaseQueryResult,
    system_prompt=(
        "You are the SQL Specialist Agent. Translate user requests into optimized, read-only PostgreSQL queries. "
        "Run the query and return the results in the required schema. Under no circumstances should you "
        "execute modifying statements (INSERT, UPDATE, DELETE, DROP)."
    )
)

# Run context dependencies interface
class SQLConnectionDeps(BaseModel):
    db_session: Any

@sql_execution_agent.tool
async def run_postgres_query(ctx: RunContext[SQLConnectionDeps], sql_statement: str) -> str:
    # Verify statement is read-only
    clean_sql = sql_statement.strip().lower()
    if clean_sql.startswith("insert") or clean_sql.startswith("update") or clean_sql.startswith("delete"):
        return "Error: Statement must be read-only."
        
    result = await ctx.deps.db_session.execute(sql_statement)
    return str(result.fetchall())
```

---

### 7.3 Model Context Routing Engine
The model router selects the best LLM provider based on the type of query and payload size:

```python
# /opt/sentinel/agents/app/router.py
# Dynamic Model Context Router

from pydantic import BaseModel
from typing import Literal

class RouterOutput(BaseModel):
    provider: Literal["openai", "google", "anthropic"]
    model_name: str
    rationale: str

class LLMRouter:
    @staticmethod
    def route_request(prompt: str, payload_size_kb: int) -> RouterOutput:
        clean_prompt = prompt.lower()
        
        # 1. Route coding and codebase queries to Claude 3.5 Sonnet
        if any(keyword in clean_prompt for keyword in ["git", "repository", "code", "pull request"]):
            return RouterOutput(
                provider="anthropic",
                model_name="claude-3.5-sonnet",
                rationale="Query contains development keywords. Routing to Claude 3.5 Sonnet for code parsing."
            )
            
        # 2. Route large payloads (>100KB) to the configured Gemini model
        if payload_size_kb > 100:
            return RouterOutput(
                provider="google",
                model_name=settings.MODEL_NAME,
                rationale="Payload size exceeds 100KB. Routing to the configured Gemini model for high-capacity parsing."
            )
            
        # 3. Route general queries to GPT-4o
        return RouterOutput(
            provider="openai",
            model_name="gpt-4o",
            rationale="Standard query. Routing to GPT-4o for general strategy reasoning."
        )
```

---

## 8. MCP Tool Integrations

SentinelOS uses the **Model Context Protocol (MCP)** to register external tools (e.g., Slack, Jira) and execute actions using standard JSON-RPC 2.0.

```
       [ Multi-Agent System ]
                 |
         (JSON-RPC Method)
                 v
   +---------------------------+
   |   MCP Client Gateway      |
   +---------------------------+
     /                       \
    v                         v
[ Slack MCP Tool ]      [ Jira MCP Tool ]
```

---

### 8.1 Python MCP Server Tool Registration
This script implements an MCP server endpoint that registers Jira and Slack integration tools:

```python
# /opt/sentinel/agents/app/tools/mcp_server.py
# Model Context Protocol Server Endpoint

import asyncio
import json
import sys
import logging
from typing import Dict, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sentinel.mcp_server")

class MCPServer:
    def __init__(self):
        self.tools = {}
        # Register available tools
        self._register_default_tools()

    def _register_default_tools(self):
        self.tools["jira_create_task"] = {
            "description": "Creates an engineering ticket in Jira",
            "handler": self._jira_create_task_handler,
            "schema": {
                "type": "object",
                "properties": {
                    "project_key": { "type": "string" },
                    "summary": { "type": "string" },
                    "assignee": { "type": "string" }
                },
                "required": ["project_key", "summary"]
            }
        }

    async def run_server_loop(self):
        logger.info("Initializing MCP Server I/O Stream...")
        # Read from stdin, process commands, write to stdout
        while True:
            line = await asyncio.get_event_loop().run_in_executor(None, sys.stdin.readline)
            if not line:
                break
                
            try:
                request = json.loads(line)
                response = await self._handle_json_rpc(request)
                sys.stdout.write(json.dumps(response) + "\n")
                sys.stdout.flush()
            except Exception as e:
                logger.error(f"Error processing RPC request: {str(e)}")

    async def _handle_json_rpc(self, req: Dict[str, Any]) -> Dict[str, Any]:
        method = req.get("method")
        rpc_id = req.get("id")
        
        if method == "tools/list":
            return {
                "jsonrpc": "2.0",
                "result": {
                    "tools": [
                        {"name": k, "description": v["description"], "inputSchema": v["schema"]}
                        for k, v in self.tools.items()
                    ]
                },
                "id": rpc_id
            }
            
        elif method == "tools/call":
            params = req.get("params", {})
            name = params.get("name")
            arguments = params.get("arguments", {})
            
            if name in self.tools:
                try:
                    result = await self.tools[name]["handler"](arguments)
                    return {
                        "jsonrpc": "2.0",
                        "result": {"content": [{"type": "text", "text": str(result)}]},
                        "id": rpc_id
                    }
                except Exception as e:
                    return {
                        "jsonrpc": "2.0",
                        "error": {"code": -32000, "message": f"Execution error: {str(e)}"},
                        "id": rpc_id
                    }
            return {
                "jsonrpc": "2.0",
                "error": {"code": -32601, "message": f"Tool {name} not found"},
                "id": rpc_id
            }

    async def _jira_create_task_handler(self, args: Dict[str, Any]) -> str:
        # Mock payload processing
        project = args["project_key"]
        summary = args["summary"]
        logger.info(f"Creating Jira ticket in project: {project} - {summary}")
        return f"Success: Jira ticket created for project {project}."

if __name__ == "__main__":
    server = MCPServer()
    asyncio.run(server.run_server_loop())
```

---

## 9. Deployment & Orchestration Setup

### 9.1 Local Services Compose Blueprint Configuration
We use a Docker Compose file to orchestrate database, message queue, and memory cache dependencies during local development:

```yaml
# /opt/sentinel/docker/docker-compose.yml
# Local Services Orchestration Blueprint

version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: sentinel-postgres-dev
    environment:
      POSTGRES_DB: sentinel_db
      POSTGRES_USER: sentinel_user
      POSTGRES_PASSWORD: secure_pass
    ports:
      - "5432:5432"
    volumes:
      - pgdata_volume:/var/lib/postgresql/data
    networks:
      - sentinel-bridge-net

  neo4j:
    image: neo4j:5.18-community
    container_name: sentinel-neo4j-dev
    environment:
      NEO4J_AUTH: neo4j/secure_neo_pass
      NEO4J_PLUGINS: '["apoc"]'
    ports:
      - "7474:7474" # Browser interface HTTP Port
      - "7687:7687" # Bolt connection Port
    volumes:
      - neo4jdata_volume:/data
    networks:
      - sentinel-bridge-net

  qdrant:
    image: qdrant/qdrant:v1.8.4
    container_name: sentinel-qdrant-dev
    ports:
      - "6333:6333"
    volumes:
      - qdrant_volume:/qdrant/storage
    networks:
      - sentinel-bridge-net

  redis:
    image: redis:7-alpine
    container_name: sentinel-redis-dev
    ports:
      - "6379:6379"
    networks:
      - sentinel-bridge-net

volumes:
  pgdata_volume:
  neo4jdata_volume:
  qdrant_volume:

networks:
  sentinel-bridge-net:
    driver: bridge
```

---

### 9.2 Ingress NGINX Configuration File Setup
This NGINX configuration block acts as our reverse proxy, terminating SSL certificates and routing HTTP/WebSocket connections:

```nginx
# /etc/nginx/sites-available/sentinel-gateway.conf
# NGINX Reverse Proxy and WebSocket Routing configurations

upstream backend_cluster {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name api.sentinel.company.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.sentinel.company.com;

    ssl_certificate /etc/letsencrypt/live/api.sentinel.company.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.sentinel.company.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    client_max_body_size 25M; # Limit large document uploads

    location /api/ {
        proxy_pass http://backend_cluster;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Route WebSocket connections
    location /ws/ {
        proxy_pass http://backend_cluster;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
    }
}
```

---

## 10. Observability Configurations

### 10.1 Prometheus Custom Alert Configurations
This Prometheus alerts file triggers alerts when system performance degrades or queue latency rises:

```yaml
# /etc/prometheus/alert.rules.yml
# Prometheus System Alerts Configuration

groups:
- name: sentinel-operational-alerts
  rules:
  - alert: CeleryQueueDelay
    expr: celery_queue_length{queue="graph_sync_queue"} > 1000
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Celery synchronization queue length has exceeded 1,000 pending tasks for over 5 minutes."

  - alert: WebSocketDisconnectRates
    expr: rate(websocket_disconnect_events_total[5m]) > 25
    for: 2m
    labels:
      severity: page
    annotations:
      summary: "WebSocket disconnect rates are spiking. Check client heartbeat logs and Nginx configs."
```

---

### 10.2 OpenTelemetry Setup
This script instruments our FastAPI application, exporting traces to an OpenTelemetry collector:

```python
# /opt/sentinel/api/app/telemetry.py
# OpenTelemetry Instrumentation Helper

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

def configure_opentelemetry(app):
    # Setup Tracer provider
    provider = TracerProvider()
    
    # Configure the OTLP exporter to send traces to our collector endpoint
    otlp_exporter = OTLPSpanExporter(
        endpoint="http://otel-collector.monitoring.svc.cluster.local:4317",
        insecure=True
    )
    
    processor = BatchSpanProcessor(otlp_exporter)
    provider.add_span_processor(processor)
    trace.set_tracer_provider(provider)
    
    # Instrument FastAPI application instance
    FastAPIInstrumentor.instrument_app(app)
```

---
## End of Backend Implementation Plan Document
This marks the completion of the SentinelOS Backend Implementation Plan. All chapters have been populated with technical details.




