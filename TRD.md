# SentinelOS AI: The Enterprise Digital Twin Operating System
## Technical Requirement Document (TRD) — Production-Grade Specification
**Version:** 1.0.0-PROD-TECH  
**Classification:** Proprietary / Technical Leadership & VCs  
**Target Funding Stage:** €10,000,000 Series Seed/A  

---

## Table of Contents
1. **System Architecture & Relational Tier**
   - 1.1 High-Level Architecture Topology
   - 1.2 Enterprise Data Fabric & Event Bus Pipeline
   - 1.3 Scalability & Microservices Boundary Design
2. **Relational Database Tier (PostgreSQL 16)**
   - 2.1 Complete Database DDL Schema Definitions
   - 2.2 Operational Metadata & Audit Logging
   - 2.3 Partitioning & Sharding Strategy for High-Throughput Logs
   - 2.4 Indexing (B-Tree, GIN, Hash) & Query Optimization Plans
   - 2.5 Row-Level Security (RLS) & Client Tenant Isolation Policies
   - 2.6 Database Connection Pooling & PG Tuning Configurations

---

## 1. System Architecture & Relational Tier

### 1.1 High-Level Architecture Topology
SentinelOS is built on an asynchronous, event-driven architecture designed to manage the data flow between live corporate communication tools, relational databases, graph databases, and AI agent execution environments.

```
+---------------------------------------------------------------------------------------------------+
|                                      INGRESS / INTEGRATION LAYER                                   |
|   - Slack Webhook      - GitHub Webhook      - Jira Webhook      - n8n Pipelines      - File Ingress  |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                           EVENT INGRESS BUS                                        |
|                                       RabbitMQ Broker Cluster                                     |
+---------------------------------------------------------------------------------------------------+
                                 |                                 |
                                 v                                 v
+-------------------------------------------------+  +----------------------------------------------+
|             TRANSACTION SYNC SERVICE            |  |             LAYOUT PARSER WORKER             |
|   (Relational Commits -> Celery Work Queue)     |  |       (Docling / PyMuPDF OCR Engine)         |
+-------------------------------------------------+  +----------------------------------------------+
         |                                 |                                |
         v (Strong Sync)                   v (Async Sync)                   v (Async Sync)
+-----------------------+        +-----------------------+        +-----------------------+
|  RELATIONAL DATABASE  |        |    KNOWLEDGE GRAPH    |        |    VECTOR DATABASE    |
|     PostgreSQL 16     |        |   Neo4j 5 Enterprise  |        |      Qdrant v1.8      |
+-----------------------+        +-----------------------+        +-----------------------+
         ^                                 ^                                ^
         |                                 |                                |
         +---------------------------------+--------------------------------+
                                           |
                                           v
+---------------------------------------------------------------------------------------------------+
|                                       COGNITIVE EXECUTION LAYER                                    |
|               LangGraph Multi-Agent Orchestrator   &   PydanticAI Client Gateways                 |
+---------------------------------------------------------------------------------------------------+
                                           |
                                  (WebSocket Server)
                                           v
+---------------------------------------------------------------------------------------------------+
|                                       FRONTEND RENDER PIPELINE                                    |
|                Next.js 15 UI Layer   |   Cytoscape.js   |   React Flow   |   ECharts              |
+---------------------------------------------------------------------------------------------------+
```

The system is split into three decoupled operational layers:
1. **The Ingest & Ingress Bus Layer:** Webhook receivers run in lightweight FastAPI container endpoints. They validate incoming signatures (e.g., GitHub SHA-256 signatures) and push the payload directly onto a **RabbitMQ** broker cluster, keeping ingress latency below 10ms.
2. **The Sync Service & Storage Fabric Layer:** Background Celery workers consume events from RabbitMQ and execute synchronous database writes. Relational updates are committed to **PostgreSQL 16** with transaction isolation levels set to `Read Committed`. A secondary queue replicates these states to **Neo4j 5** via Cypher statements and updates vector collections in **Qdrant v1.8**.
3. **The Agentic Cognitive & Real-time Delivery Layer:** LangGraph agent workers fetch local subgraphs and documents. When an agent state changes, the updates are pushed to a **Redis Pub/Sub** channel. WebSocket worker instances read from this channel and broadcast updates to the client dashboard, bypassing standard database poll routines.

### 1.2 Enterprise Data Fabric & Event Bus Pipeline
The event bus handles communication between external systems and our database layers, ensuring reliability even during high-traffic spikes:

```
[ External Webhook Event ]
           |
           v
+------------------------+
| FastAPI Webhook Ingress|  -- Validates payloads, signs certificates
+------------------------+
           |
           v
+------------------------+
|   RabbitMQ Exchange    |  -- Direct exchange routing by system type
+------------------------+
      /          \
     /            \
    v              v
[Sync Queue]    [Log Queue]
    |              |
    v              v
[ Celery ]      [ Celery ]
(DB Writes)     (Audit Logs)
```

1. **Exchange Configuration:** We use a direct exchange pattern with routing keys matching source systems (e.g., `system.github`, `system.jira`, `system.slack`).
2. **Dead Letter Exchange (DLX):** Queues are configured with `x-dead-letter-exchange` routing parameters. If an event processing run fails due to a database lock or network timeout, the message is routed to `sentinel.dlx`. A retry worker attempts reprocessing up to 5 times using exponential backoff ($2^n \times 1000\text{ ms}$) before flagging the message for administrative review.
3. **Delivery Guarantees:** All queues run with durable persistence flags (`durable=true`), and workers must return explicit acknowledgments (`manual_acks=true`) only after database transactions are successfully committed.

### 1.3 Scalability & Microservices Boundary Design
Each service is built as a separate container, ensuring scalability and resource isolation:

*   **API Ingress Gateway:** Configured with low CPU allocations (0.5 Cores, 512MB RAM) and auto-scaled up to 10 instances to handle incoming webhook surges.
*   **Ingestion Workers (Celery):** Run on high-RAM memory optimized nodes (16GB+ RAM) to support complex PDF parsing, OCR layout extraction, and vectorization pipelines.
*   **LangGraph Execution Pods:** Configured with persistent execution contexts to maintain agent history, utilizing Redis for memory caches and PostgreSQL for database storage.

---

## 2. Relational Database Tier (PostgreSQL 16)

### 2.1 Complete Database DDL Schema Definitions
Below is the complete database schema DDL script required to bootstrap the relational layer of SentinelOS. This schema defines our user authentication structures, role mappings, organizational configurations, employee profiles, project tracking modules, customer support logs, and financial records.

```sql
-- Bootstrapping Script: SentinelOS Relational Schema
-- Target Database Engine: PostgreSQL 16+
-- Schema Version: 1.0.0-INIT

-- Enable standard security and encryption extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- SECTION 2.1.1: TENANTS, USERS, AND AUTHORIZATION ROLE SCHEMAS
-- =========================================================================

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) UNIQUE NOT NULL,
    license_tier VARCHAR(50) NOT NULL DEFAULT 'Enterprise' CHECK (license_tier IN ('Growth', 'Enterprise', 'Sovereign')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_roles (
    role_name VARCHAR(50) PRIMARY KEY,
    description TEXT NOT NULL
);

-- Seed System Roles
INSERT INTO system_roles (role_name, description) VALUES
('CEO', 'Full organizational visibility, strategy execution, and budget authorization rights.'),
('Admin', 'System configuration management, integration provisioning, and security auditing.'),
('Manager', 'Department-level read and write access for projects, budgets, and team allocations.'),
('Team Lead', 'Team-level visibility, task assignments, and pull request authorizations.'),
('Employee', 'Individual read access, task updates, and workspace tool interactions.'),
('Viewer', 'Read-only access to assigned projects, with no mutation capabilities.');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    system_role VARCHAR(50) NOT NULL REFERENCES system_roles(role_name),
    security_clearance VARCHAR(50) NOT NULL DEFAULT 'Level 1' CHECK (security_clearance IN ('Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5')),
    is_mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- SECTION 2.1.2: DEPARTMENTS, COST CENTERS, AND EMPLOYEES
-- =========================================================================

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    parent_department_id UUID REFERENCES departments(id),
    budget_limit_eur DECIMAL(15, 2) NOT NULL DEFAULT 0.00 CHECK (budget_limit_eur >= 0.00),
    headcount_target INT NOT NULL DEFAULT 0 CHECK (headcount_target >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_dept_code UNIQUE (tenant_id, code)
);

CREATE TABLE cost_centers (
    code VARCHAR(50) PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    allocated_funds DECIMAL(15, 2) NOT NULL DEFAULT 0.00 CHECK (allocated_funds >= 0.00),
    spent_funds DECIMAL(15, 2) NOT NULL DEFAULT 0.00 CHECK (spent_funds >= 0.00),
    fiscal_year VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_title VARCHAR(150) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    manager_id UUID REFERENCES employees(id),
    status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Suspended', 'Terminated')),
    timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
    billable_rate_eur DECIMAL(10, 2) NOT NULL DEFAULT 0.00 CHECK (billable_rate_eur >= 0.00),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_skills (
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    skill_level INT NOT NULL CHECK (skill_level BETWEEN 1 AND 5),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    PRIMARY KEY (employee_id, skill_name)
);

-- =========================================================================
-- SECTION 2.1.3: PROJECTS, ROADMAPS, AND ISSUES (JIRA/GIT MAPS)
-- =========================================================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    jira_project_key VARCHAR(50) NOT NULL,
    health_score DECIMAL(3, 2) NOT NULL DEFAULT 1.00 CHECK (health_score BETWEEN 0.00 AND 1.00),
    target_completion_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_jira_key UNIQUE (tenant_id, jira_project_key)
);

CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target_date DATE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    ticket_key VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('To Do', 'In Progress', 'In Review', 'Done')),
    story_points INT NOT NULL DEFAULT 0 CHECK (story_points >= 0),
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    ticket_type VARCHAR(50) NOT NULL DEFAULT 'Feature' CHECK (ticket_type IN ('Feature', 'Bug', 'Chore', 'Security')),
    assigned_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    target_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ticket_blocking_rules (
    blocking_ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    blocked_ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blocking_ticket_id, blocked_ticket_id),
    CONSTRAINT chk_self_blocking CHECK (blocking_ticket_id <> blocked_ticket_id)
);

CREATE TABLE git_repositories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    ssh_url VARCHAR(512) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE git_commits (
    sha VARCHAR(40) PRIMARY KEY,
    repository_id UUID NOT NULL REFERENCES git_repositories(id) ON DELETE CASCADE,
    author_email VARCHAR(255) NOT NULL,
    commit_message TEXT NOT NULL,
    branch VARCHAR(100) NOT NULL,
    files_changed JSONB NOT NULL,
    committed_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- =========================================================================
-- SECTION 2.1.4: CUSTOMERS, CONTRACTS, AND SUPPORT SERVICES
-- =========================================================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) UNIQUE NOT NULL,
    tier VARCHAR(50) NOT NULL DEFAULT 'Mid-Market' CHECK (tier IN ('Strategic', 'Enterprise', 'Mid-Market')),
    arr_eur DECIMAL(15, 2) NOT NULL DEFAULT 0.00 CHECK (arr_eur >= 0.00),
    churn_risk_level VARCHAR(50) NOT NULL DEFAULT 'Low' CHECK (churn_risk_level IN ('Low', 'Medium', 'High', 'Critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_csm_mapping (
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (customer_id, employee_id)
);

CREATE TABLE contracts (
    id VARCHAR(100) PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    document_hash VARCHAR(64) NOT NULL,
    signed_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    sla_response_time_hours INT NOT NULL DEFAULT 4 CHECK (sla_response_time_hours > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE support_tickets (
    id VARCHAR(100) PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    sentiment_score DECIMAL(3, 2) NOT NULL DEFAULT 0.00 CHECK (sentiment_score BETWEEN -1.00 AND 1.00),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Open', 'Pending', 'On Hold', 'Closed')),
    sla_due_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ticket_support_mapping (
    support_ticket_id VARCHAR(100) REFERENCES support_tickets(id) ON DELETE CASCADE,
    engineering_ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (support_ticket_id, engineering_ticket_id)
);

-- =========================================================================
-- SECTION 2.1.5: STANDARD OPERATING PROCEDURES (SOPS) & PROCESSES
-- =========================================================================

CREATE TABLE sops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL DEFAULT '1.0',
    regulatory_body VARCHAR(100) NOT NULL DEFAULT 'None',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE process_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sop_id UUID NOT NULL REFERENCES sops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sequence_order INT NOT NULL CHECK (sequence_order > 0),
    avg_duration_seconds DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    failure_rate DOUBLE PRECISION NOT NULL DEFAULT 0.0 CHECK (failure_rate BETWEEN 0.0 AND 1.0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE process_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sop_id UUID NOT NULL REFERENCES sops(id) ON DELETE CASCADE,
    executor_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Running' CHECK (status IN ('Running', 'Completed', 'Failed')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE step_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID NOT NULL REFERENCES process_executions(id) ON DELETE CASCADE,
    step_id UUID NOT NULL REFERENCES process_steps(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Running', 'Completed', 'Failed')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);
```

---

### 2.2 Operational Metadata & Audit Logging
To meet SOC2 and regulatory compliance requirements, SentinelOS enforces strict append-only audit logging:

```sql
-- Global System Mutation Audit Logger Table
CREATE TABLE system_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL, -- e.g. 'BUDGET_MUTATION', 'ROLE_ELEVATION'
    affected_table VARCHAR(100) NOT NULL,
    record_ref_id UUID NOT NULL,
    pre_mutation_state JSONB NOT NULL, -- Old values
    post_mutation_state JSONB NOT NULL, -- New values
    client_ip_address INET,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fast query indexing for auditors
CREATE INDEX idx_audit_tenant_action ON system_audit_logs(tenant_id, action_type);
CREATE INDEX idx_audit_occurred ON system_audit_logs(occurred_at);
```

---

### 2.3 Partitioning & Sharding Strategy for High-Throughput Logs
Activity feeds and trace metrics can quickly grow to millions of rows, slowing down database performance. To address this, SentinelOS uses **Range Partitioning** on the high-throughput `employee_activity_logs` table:

```sql
-- Partition Master Table definition
CREATE TABLE employee_activity_logs (
    id BIGSERIAL,
    employee_id UUID NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    source_system VARCHAR(100) NOT NULL,
    event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    payload JSONB NOT NULL,
    PRIMARY KEY (id, event_timestamp)
) PARTITION BY RANGE (event_timestamp);

-- Example Partition declarations for Q3 and Q4 2026
CREATE TABLE activity_logs_y2026_q3 PARTITION OF employee_activity_logs
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');

CREATE TABLE activity_logs_y2026_q4 PARTITION OF employee_activity_logs
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

-- Cron job updates periodically execute DDL script:
-- "CREATE TABLE activity_logs_y2027_q1 PARTITION OF employee_activity_logs..."
```

---

### 2.4 Indexing (B-Tree, GIN, Hash) & Query Optimization Plans
To ensure sub-second response times, we configure indexes tailored to the query patterns of each table:

1. **B-Tree Indexes:** Set on primary and foreign keys to speed up relational joins.
   ```sql
   CREATE INDEX idx_employees_department ON employees(department_id);
   CREATE INDEX idx_tickets_project ON tickets(project_id);
   ```
2. **GIN (Generalized Inverted Index):** Set on JSONB columns to enable fast key-value lookups inside nested activity structures.
   ```sql
   CREATE INDEX idx_git_commits_files ON git_commits USING gin (files_changed);
   CREATE INDEX idx_employee_activity_payload ON employee_activity_logs USING gin (payload);
   ```
3. **Hash Indexes:** Set on unique text keys where we only perform direct equality lookups (e.g., matching SHA256 hashes).
   ```sql
   CREATE INDEX idx_git_commit_sha_hash ON git_commits USING hash (sha);
   ```

---

### 2.5 Row-Level Security (RLS) & Client Tenant Isolation Policies
To prevent cross-tenant data leaks in shared SaaS environments, SentinelOS enforces PostgreSQL **Row-Level Security (RLS)**:

```sql
-- Step 1: Enable RLS on the employees table
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Step 2: Define the security policy based on tenant session configurations
CREATE POLICY tenant_isolation_policy ON employees
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- Step 3: Application connection pool executes this wrapper on checkout:
-- BEGIN;
-- SET LOCAL app.current_tenant_id = '8a7c9d2f-1234-5678-abcd-ef0123456789';
-- SELECT * FROM employees; -- Evaluates only matching tenant records
-- COMMIT;
```

---

### 2.6 Database Connection Pooling & PG Tuning Configurations
For production environments running on hardware configurations with 8 CPU Cores and 32GB RAM, we apply the following PostgreSQL performance settings:

```ini
# /etc/postgresql/16/main/postgresql.conf Configuration Tuning

# Connection Specifications
max_connections = 250
shared_buffers = 8GB                  # 25% of system memory
effective_cache_size = 24GB           # 75% of system memory
maintenance_work_mem = 2GB
work_mem = 32MB                       # Allocates memory per query sort operation

# Write-Ahead Log (WAL) optimization settings
checkpoint_completion_target = 0.9    # Smooths disk writes
checkpoint_timeout = 15min
max_wal_size = 16GB
min_wal_size = 1GB

# Query Planner settings
random_page_cost = 1.1                # Optimized for SSD storage configurations
effective_io_concurrency = 200
```

---

## 3. Graph Database Engineering (Neo4j 5 Enterprise)

The Graph database in SentinelOS represents the company as a living network, mapping the real-time relationships between employees, projects, tickets, contracts, and support queues.

```
       [ PostgreSQL Write ]
                 |
                 v
       (RabbitMQ Event Broker)
                 |
                 v
      [ Celery Async Worker ]
                 |
                 v
      [ Neo4j Driver Session ]
  - MERGE Node Definitions
  - MATCH & CREATE Directed Edges
```

---

### 3.1 Schema Constraints & Cypher Indexing Setup
Before importing data, we run this Cypher initialization script to enforce database integrity and create indices for fast relationship traversal:

```cypher
// Neo4j Initialization Script
// Target Engine: Neo4j 5.x Enterprise Edition
// Constraint Schema Bootstrapper

// 1. Unique ID Constraints
CREATE CONSTRAINT uq_employee_id IF NOT EXISTS FOR (e:Employee) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT uq_employee_email IF NOT EXISTS FOR (e:Employee) REQUIRE e.email IS UNIQUE;
CREATE CONSTRAINT uq_dept_code IF NOT EXISTS FOR (d:Department) REQUIRE d.code IS UNIQUE;
CREATE CONSTRAINT uq_project_id IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT uq_project_key IF NOT EXISTS FOR (p:Project) REQUIRE p.jira_project_key IS UNIQUE;
CREATE CONSTRAINT uq_ticket_key IF NOT EXISTS FOR (t:Ticket) REQUIRE t.key IS UNIQUE;
CREATE CONSTRAINT uq_document_hash IF NOT EXISTS FOR (doc:Document) REQUIRE doc.hash IS UNIQUE;
CREATE CONSTRAINT uq_customer_domain IF NOT EXISTS FOR (c:Customer) REQUIRE c.domain IS UNIQUE;
CREATE CONSTRAINT uq_contract_id IF NOT EXISTS FOR (con:Contract) REQUIRE con.id IS UNIQUE;
CREATE CONSTRAINT uq_support_ticket_id IF NOT EXISTS FOR (st:SupportTicket) REQUIRE st.id IS UNIQUE;
CREATE CONSTRAINT uq_sop_id IF NOT EXISTS FOR (s:SOP) REQUIRE s.id IS UNIQUE;
CREATE CONSTRAINT uq_step_id IF NOT EXISTS FOR (step:ProcessStep) REQUIRE step.id IS UNIQUE;
CREATE CONSTRAINT uq_costcenter_code IF NOT EXISTS FOR (cc:CostCenter) REQUIRE cc.code IS UNIQUE;

// 2. Full-Text Search Indexes
CREATE FULLTEXT INDEX idx_ticket_search IF NOT EXISTS FOR (t:Ticket) ON EACH [t.title, t.description];
CREATE FULLTEXT INDEX idx_document_search IF NOT EXISTS FOR (doc:Document) ON EACH [doc.title, doc.summary];

// 3. Traversal Optimization Indexes
CREATE INDEX idx_employee_status IF NOT EXISTS FOR (e:Employee) ON (e.status);
CREATE INDEX idx_ticket_status IF NOT EXISTS FOR (t:Ticket) ON (t.status);
CREATE INDEX idx_support_status IF NOT EXISTS FOR (st:SupportTicket) ON (st.status);
```

---

### 3.2 Relational-to-Graph Sync Logic and Transaction Mirroring
To maintain data consistency, when a change is committed in PostgreSQL, a RabbitMQ event triggers a background worker. This worker runs a transactional script to update the graph state in Neo4j:

```python
# /opt/sentinel/sync/graph_mirror_service.py
# Real-Time Database Sync Engine

import logging
from neo4j import GraphDatabase, Transaction
from pydantic import BaseModel
from typing import Dict, Any

logger = logging.getLogger("sentinel.graph_sync")

class SyncEventPayload(BaseModel):
    event_type: str  # 'EMPLOYEE_HIRE', 'TICKET_UPDATE', 'PROJECT_CREATE'
    tenant_id: str
    data: Dict[str, Any]

class Neo4jMirrorService:
    def __init__(self, uri: str, auth_user: str, auth_pass: str):
        self.driver = GraphDatabase.driver(uri, auth=(auth_user, auth_pass))

    def close(self):
        self.driver.close()

    def process_sync_event(self, event: SyncEventPayload):
        with self.driver.session(database="neo4j") as session:
            if event.event_type == "EMPLOYEE_ASSIGN_DEPT":
                session.execute_write(self._sync_employee_department_edge, event.data)
            elif event.event_type == "TICKET_TRANSITION":
                session.execute_write(self._sync_ticket_state, event.data)
            else:
                logger.warning(f"Unhandled sync event type: {event.event_type}")

    @staticmethod
    def _sync_employee_department_edge(tx: Transaction, data: Dict[str, Any]):
        # Parameters: employee_id, department_code, assigned_at
        query = """
        MATCH (e:Employee {id: $employee_id})
        MATCH (d:Department {code: $dept_code})
        MERGE (e)-[r:MEMBER_OF]->(d)
        SET r.since = datetime($assigned_at)
        """
        tx.run(query, employee_id=data["employee_id"], dept_code=data["dept_code"], assigned_at=data["assigned_at"])

    @staticmethod
    def _sync_ticket_state(tx: Transaction, data: Dict[str, Any]):
        # Parameters: ticket_key, new_status, updated_at
        query = """
        MERGE (t:Ticket {key: $ticket_key})
        SET t.status = $new_status, t.last_modified = datetime($updated_at)
        """
        tx.run(query, ticket_key=data["ticket_key"], new_status=data["new_status"], updated_at=data["updated_at"])
```

#### Handling Concurrent Write Conflicts
Because Celery workers run in parallel, concurrent updates to adjacent nodes can cause database deadlocks in Neo4j. To prevent this, we enforce these locking rules:
1. **Sorted Node Updates:** Relationships are created in alphabetical order based on node labels (`(d:Department) -> (e:Employee)`).
2. **Retry Mechanisms:** If the Neo4j driver throws a `TransientError` (lock acquisition failure), the sync task retries after a short random delay (100ms to 500ms) to clear the transaction lock.

---

### 3.3 Dynamic Graph Traversal & Impact Simulation Algorithms

#### 3.3.1 Downstream Critical Path Analysis
If a key project delivery milestone is delayed, this recursive graph traversal query maps the cascading impact across the organization, tracing the path from the delayed ticket down to customer accounts:

```cypher
// Tracing delayed deliverables to strategic accounts
MATCH (delayed:Ticket {status: 'In Progress'})
WHERE datetime() > datetime(delayed.target_date) // SLA breach check

// Traverse the dependency tree up to 5 steps
MATCH path = (delayed)-[:BLOCKS*1..5]->(critical:Ticket)
MATCH (critical)-[:PART_OF_MILESTONE]->(m:Milestone)<-[:HAS_MILESTONE]-(p:Project)
MATCH (p)-[:REQUIRED_BY]->(c:Customer)

RETURN 
    delayed.key AS RootCauseTicket,
    delayed.title AS RootCauseTitle,
    length(path) AS DependencyDepth,
    critical.key AS BlockedDeliverable,
    m.title AS ImpactedMilestone,
    p.name AS ImpactedProject,
    c.name AS AffectedCustomer,
    c.arr_eur AS CustomerRevenue
ORDER BY c.arr_eur DESC, DependencyDepth ASC
```

#### 3.3.2 Organizational Communication Silo Detector
This query calculates the average shortest path and communication weight between departments to flag isolated teams:

```cypher
// Detect communication silos between departments
MATCH (d1:Department), (d2:Department)
WHERE id(d1) < id(d2)

// Find employees in each department
MATCH (e1:Employee)-[:MEMBER_OF]->(d1)
MATCH (e2:Employee)-[:MEMBER_OF]->(d2)

// Find communication link strength
MATCH path = shortestPath((e1)-[:INTERACTED_WITH*1..4]-(e2))
WITH d1.code AS Dept1, d2.code AS Dept2, path,
     [r in relationships(path) | r.weight] AS weights

// Calculate path strength
WITH Dept1, Dept2, avg(reduce(acc = 0.0, w in weights | acc + w)) AS AvgCommunicationWeight
WHERE AvgCommunicationWeight < 5.0 // Flag departments with low interaction

RETURN Dept1, Dept2, AvgCommunicationWeight
ORDER BY AvgCommunicationWeight ASC
```

---

## 4. Vector DB & RAG Specifications (Qdrant)

SentinelOS processes raw corporate documents (PDF agreements, meeting records, SOP sheets) into semantic representations stored inside **Qdrant v1.8** and queries them using a hybrid search pipeline.

```
                  +--------------------------------+
                  |         RAW DOCUMENT           |
                  +--------------------------------+
                                   |
                                   v
             [ Docling Layout Parser / PaddleOCR ]
                                   |
                                   v
             [ Markdown Chunks with metadata payload ]
                                   |
         +-------------------------+-------------------------+
         | (Dense Embeddings)                                | (Sparse Embeddings)
         v                                                   v
 [ BGE-M3 Dense Vector ]                             [ BM25 Sparse Vector ]
 (1024-dim, Cosine)                                  (PostgreSQL Fulltext)
         |                                                   |
         +-------------------------+-------------------------+
                                   |
                                   v
                     [ Reciprocal Rank Fusion ]
                                   |
                                   v
                        [ Cohere Rerank v3 ]
                                   |
                                   v
                        [ LLM Context Window ]
```

---

### 4.1 Qdrant Collection Parameters & Collection Configurations
To optimize for high-frequency queries and secure multi-tenant partitioning, the primary Qdrant collection is configured as follows:

*   **Collection Name:** `sentinel_knowledge_base`
*   **Vector Metric:** Cosine similarity.
*   **Vector Dimension:** 1024 (optimized for `BAAI/bge-m3` or `text-embedding-3-large`).
*   **Quantization:** `Scalar Quantization (int8)` is enabled to reduce RAM usage by up to 70% while maintaining >98% retrieval accuracy.

#### API Collection Creation Payload
This payload is sent to the Qdrant endpoint `PUT /collections/sentinel_knowledge_base` to initialize the database:
```json
{
  "vectors": {
    "size": 1024,
    "distance": "Cosine",
    "on_disk": true
  },
  "hnsw_config": {
    "m": 16,
    "ef_construct": 100,
    "full_scan_threshold": 10000,
    "on_disk": true
  },
  "quantization_config": {
    "scalar": {
      "type": "int8",
      "quantile": 0.99,
      "always_ram": true
    }
  }
}
```

#### Payload Index Specifications
To filter data securely by tenant and authorization level, we create payload indices in Qdrant:
```json
// POST /collections/sentinel_knowledge_base/index
{ "field_name": "tenant_id", "field_schema": "keyword" }
{ "field_name": "clearance_level", "field_schema": "keyword" }
{ "field_name": "associated_projects", "field_schema": "keyword" }
```

---

### 4.2 Raw Ingestion: Docling, PaddleOCR, and PyMuPDF Pipelines
When a file is uploaded, the ingestion service determines the best parsing strategy based on the file type:

```python
# /opt/sentinel/rag/parsing_engine.py
# Layout-Aware Ingestion Pipeline

import os
from docling.document_converter import DocumentConverter
from paddleocr import PaddleOCR
import fitz  # PyMuPDF
from typing import Dict, Any

class IngestionParsingEngine:
    def __init__(self):
        self.docling_converter = DocumentConverter()
        # Initialize PaddleOCR on GPU if available
        self.ocr_engine = PaddleOCR(use_angle_cls=True, lang='en', use_gpu=True)

    def parse_document(self, file_path: str) -> Dict[str, Any]:
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            return self._parse_pdf(file_path)
        else:
            # Fallback to standard Docling converter for docx, pptx, etc.
            result = self.docling_converter.convert(file_path)
            return {"text": result.document.export_to_markdown(), "layout_type": "structured"}

    def _parse_pdf(self, file_path: str) -> Dict[str, Any]:
        # 1. First run PyMuPDF to check if PDF is digital and contains selectable text
        doc = fitz.open(file_path)
        is_scanned = True
        for page in doc:
            if len(page.get_text().strip()) > 100:
                is_scanned = False
                break

        if is_scanned:
            # 2. If scanned, process with PaddleOCR to extract text layouts from pages
            logger.info(f"Running PaddleOCR on scanned document: {file_path}")
            ocr_text = []
            for page_num in range(len(doc)):
                # Export page to image bytes for OCR processing
                page = doc.load_page(page_num)
                pix = page.get_pixmap(dpi=150)
                img_path = f"/tmp/page_{page_num}.png"
                pix.save(img_path)
                
                # Run layout OCR extraction
                result = self.ocr_engine.ocr(img_path, cls=True)
                page_text = " ".join([line[1][0] for line in result[0]])
                ocr_text.append(f"## Page {page_num + 1}\n{page_text}")
                os.remove(img_path)
            return {"text": "\n\n".join(ocr_text), "layout_type": "scanned_ocr"}
        else:
            # 3. If digital, use Docling to extract clean markdown with tables intact
            result = self.docling_converter.convert(file_path)
            return {"text": result.document.export_to_markdown(), "layout_type": "vector_pdf"}
```

---

### 4.3 Semantic Chunking Implementation Script
Instead of using fixed character-limit splitting, SentinelOS parses the extracted markdown and chunks text along logical header boundaries. This preserves the document's structure and keeps related context together:

```python
# /opt/sentinel/rag/semantic_splitter.py
# Header-Based Document Chunking Engine

import re
from typing import List, Dict, Any

class SemanticMarkdownSplitter:
    def __init__(self, target_chunk_size: int = 500, overlap: int = 100):
        self.target_chunk_size = target_chunk_size
        self.overlap = overlap

    def split_markdown(self, markdown_text: str, doc_metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        # Split on Markdown headers (h1, h2, h3)
        sections = re.split(r'(?=\n#{1,3}\s)', markdown_text)
        chunks = []
        
        current_chunk = ""
        chunk_idx = 0
        
        for section in sections:
            if not section.strip():
                continue
            
            # If a single section exceeds target chunk size, split it into smaller sentences
            if len(section.split()) > self.target_chunk_size:
                if current_chunk:
                    chunks.append(self._create_chunk_payload(current_chunk, chunk_idx, doc_metadata))
                    current_chunk = ""
                    chunk_idx += 1
                
                # Split the large section by sentences
                sentences = re.split(r'(?<=[.!?])\s+', section)
                sub_chunk = ""
                for sentence in sentences:
                    if len(sub_chunk.split()) + len(sentence.split()) > self.target_chunk_size:
                        chunks.append(self._create_chunk_payload(sub_chunk, chunk_idx, doc_metadata))
                        # Implement overlap matching
                        sub_chunk = " ".join(sub_chunk.split()[-self.overlap:]) + " " + sentence
                        chunk_idx += 1
                    else:
                        sub_chunk += " " + sentence
                if sub_chunk.strip():
                    current_chunk = sub_chunk
            else:
                # Append section to current chunk
                if len(current_chunk.split()) + len(section.split()) > self.target_chunk_size:
                    chunks.append(self._create_chunk_payload(current_chunk, chunk_idx, doc_metadata))
                    current_chunk = section
                    chunk_idx += 1
                else:
                    current_chunk += "\n\n" + section

        if current_chunk.strip():
            chunks.append(self._create_chunk_payload(current_chunk, chunk_idx, doc_metadata))
            
        return chunks

    def _create_chunk_payload(self, text: str, index: int, meta: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "document_id": meta["document_id"],
            "chunk_index": index,
            "security_clearance_level": meta["clearance"],
            "tenant_id": meta["tenant_id"],
            "text_content": text.strip(),
            "associated_projects": meta.get("projects", []),
            "metadata_inheritance": {
                "filename": meta["filename"],
                "ingested_at": meta["ingested_at"]
            }
        }
```

---

### 4.4 Retrieval Architecture: Reciprocal Rank Fusion & Cohere Reranking
To deliver high-accuracy search results, we use a hybrid retrieval pipeline that combines keyword matching and semantic vector search, rank-merging the results before re-ranking:

```python
# /opt/sentinel/rag/hybrid_retriever.py
# Hybrid Search Retriever & Reranker

import numpy as np
from qdrant_client import QdrantClient
from cohere import Client as CohereClient
from typing import List, Dict, Any

class HybridRetrievalPipeline:
    def __init__(self, qdrant_url: str, cohere_api_key: str, pg_db_session):
        self.qdrant_client = QdrantClient(url=qdrant_url)
        self.cohere_client = CohereClient(api_key=cohere_api_key)
        self.db = pg_db_session

    def search(self, query: str, tenant_id: str, clearance_level: str, top_k: int = 5) -> List[Dict[str, Any]]:
        # 1. Retrieve Dense Candidates from Qdrant
        dense_results = self._retrieve_dense(query, tenant_id, clearance_level, limit=20)
        
        # 2. Retrieve Sparse Candidates from PostgreSQL BM25 Index
        sparse_results = self._retrieve_sparse(query, tenant_id, clearance_level, limit=20)
        
        # 3. Merge candidates using Reciprocal Rank Fusion (RRF)
        rrf_candidates = self._reciprocal_rank_fusion(dense_results, sparse_results, k=60)
        
        # 4. Filter and prepare chunks for re-ranking
        candidate_texts = [item["text"] for item in rrf_candidates]
        if not candidate_texts:
            return []

        # 5. Execute Cohere Rerank v3
        rerank_response = self.cohere_client.rerank(
            model="rerank-english-v3.0",
            query=query,
            documents=candidate_texts,
            top_n=top_k
        )
        
        # 6. Return top-ranked chunks with relevance scores above 0.65
        final_results = []
        for result in rerank_response.results:
            if result.relevance_score >= 0.65:
                source_candidate = rrf_candidates[result.index]
                source_candidate["rerank_score"] = result.relevance_score
                final_results.append(source_candidate)
                
        return final_results

    def _reciprocal_rank_fusion(self, dense: List[Dict[str, Any]], sparse: List[Dict[str, Any]], k: int = 60) -> List[Dict[str, Any]]:
        rrf_scores = {}
        for rank, item in enumerate(dense):
            doc_id = item["document_id"]
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (rank + 1 + k))
            
        for rank, item in enumerate(sparse):
            doc_id = item["document_id"]
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (rank + 1 + k))
            
        # Sort candidates by combined RRF score
        sorted_keys = sorted(rrf_scores, key=rrf_scores.get, reverse=True)
        merged_candidates = []
        all_items = {item["document_id"]: item for item in dense + sparse}
        for key in sorted_keys:
            merged_candidates.append(all_items[key])
        return merged_candidates
```

#### Reciprocal Rank Fusion (RRF) Formula
$$RRF_{score}(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}$$
where $M$ represents the search engines (Dense and Sparse), $r_m(d)$ is the rank of document $d$ in search engine $m$, and $k$ is a constant scaling parameter (typically set to 60) that reduces the impact of low-ranked outliers.

---

### 4.5 Redis Cache Layout Definitions
To reduce database load, Redis caches session states, organizational hierarchies, and agent working memories.

| Redis Key Template | Data Structure | Data Contents | TTL (Seconds) | Invalidation Event Trigger |
| :--- | :--- | :--- | :--- | :--- |
| `session:{user_id}` | String (JSON) | User details, RBAC roles, security clearances. | 3,600 (1 Hour) | User updates their profile or credentials. |
| `subgraph:org:{dept_code}` | Hash | Compressed Neo4j organizational structures. | 86,400 (24 Hours) | Budget limit changes or organizational restructures. |
| `agent:memory:{thread_id}` | List | Serialized LangGraph state updates. | 259,200 (72 Hours) | New prompts submitted to the thread. |
| `rate_limit:{user_id}:{minute}` | String (Integer) | Current request count. | 60 (1 Minute) | Key naturally expires. |

---

## 5. Microservices & API Gateway (FastAPI)

SentinelOS runs its API surface on **FastAPI** utilizing **Pydantic v2** for validation and **SQLAlchemy 2.0** for asynchronous database connections.

```
       [ Request Client ]
               |
               v
     +-------------------+
     |   FastAPI App     |  -- (ASGI Web Server: Uvicorn / Gunicorn)
     +-------------------+
         /           \
        /             \
       v               v
  [ REST API ]   [ WebSockets ]  -- (wss:// streaming protocol)
       |               |
       v               v
  (Async PG)     (Redis Pub/Sub)
```

---

### 5.1 FastAPI Application Blueprint & Async Database Session Lifecycle
Below is the initialization code for our FastAPI gateway. It configures CORS, handles global exceptions, and manages the lifecycle of asynchronous database connection pools:

```python
# /opt/sentinel/api/main.py
# FastAPI Application Entry point

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from pydantic import BaseModel, Field
import uvicorn

# Setup logger configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sentinel.api")

# Database URI configuration (using asyncpg driver)
DATABASE_URL = "postgresql+asyncpg://sentinel_user:secure_pass@localhost:5432/sentinel_db"

# Create connection pool engine
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_recycle=1800,
    pool_pre_ping=True
)

# Async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    logger.info("Initializing SentinelOS Database Connection Pools...")
    yield
    # Shutdown actions
    logger.info("Closing SentinelOS Database Connection Pools...")
    await engine.dispose()

app = FastAPI(
    title="SentinelOS AI Gateway API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS Middleware for UI interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with target domain structures
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to retrieve database session per request
async def get_db_session():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Transaction failed: {str(e)}")
            raise HTTPException(status_code=500, detail="Database Transaction error")
```

---

### 5.2 Input Validation Contracts (Pydantic v2)
Every request payload is validated against a Pydantic schema before it is processed by our controllers:

```python
# /opt/sentinel/api/schemas.py
# Pydantic v2 Request/Response Validation Definitions

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date

class EmployeeCreateSchema(BaseModel):
    tenant_id: str = Field(..., example="8a7c9d2f-1234-5678-abcd-ef0123456789")
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    role_title: str = Field(..., max_length=150)
    department_code: str = Field(..., example="DEPT-ENG")
    billable_rate_eur: float = Field(0.0, ge=0.0)

class ProjectMilestoneSchema(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    target_date: date

class ProjectCreateSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    jira_project_key: str = Field(..., min_length=2, max_length=10)
    target_completion_date: date
    milestones: Optional[List[ProjectMilestoneSchema]] = []
```

---

### 5.3 Controller Implementation (Async CRUD Operations)
Here is our project creation controller, showing how we write to PostgreSQL and queue background tasks in Celery:

```python
# /opt/sentinel/api/controllers/project.py
# Asynchronous Project Controller endpoints

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sentinel.api.main import get_db_session
from sentinel.api.schemas import ProjectCreateSchema
from sentinel.database.models import Project, Milestone
from celery import Celery

router = APIRouter(prefix="/api/v1/projects", tags=["projects"])

# Initialize Celery Client connecting to RabbitMQ
celery_app = Celery("sentinel_workers", broker="pyamqp://guest@localhost//")

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_new_project(payload: ProjectCreateSchema, db: AsyncSession = Depends(get_db_session)):
    # 1. Check for duplicate project key within tenant context
    query = select(Project).where(Project.jira_project_key == payload.jira_project_key)
    result = await db.execute(query)
    if result.scalars().first() is not None:
        raise HTTPException(
            status_code=400,
            detail=f"Project with key {payload.jira_project_key} already exists."
        )

    # 2. Map and write project payload to PostgreSQL
    new_project = Project(
        name=payload.name,
        jira_project_key=payload.jira_project_key,
        target_completion_date=payload.target_completion_date
    )
    db.add(new_project)
    await db.flush() # Flush to populate new_project.id UUID

    # 3. Map and write milestones if provided
    for ms in payload.milestones:
        new_milestone = Milestone(
            project_id=new_project.id,
            title=ms.title,
            target_date=ms.target_date
        )
        db.add(new_milestone)

    # 4. Trigger asynchronous Celery workers to mirror the new project in Neo4j
    celery_app.send_task(
        "sentinel.tasks.graph.create_project_node",
        args=[str(new_project.id), payload.name, payload.jira_project_key]
    )

    return {
        "status": "success",
        "project_id": str(new_project.id),
        "message": "Project registered successfully. Syncing graph engine."
    }
```

---

### 5.4 WebSocket Real-time Event Streaming Engine
SentinelOS streams real-time updates to client dashboards (e.g., active agent thinking loops, node status updates) using a Redis-backed WebSocket connection pool:

```python
# /opt/sentinel/api/websockets.py
# Real-Time WebSocket Connection Handler

import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import redis.asyncio as aioredis
from typing import List

router = APIRouter()

# Connection manager to track active connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast_raw_message(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                # Remove stale connections
                self.disconnect(connection)

manager = ConnectionManager()

@router.websocket("/ws/{tenant_id}")
async def websocket_endpoint(websocket: WebSocket, tenant_id: str):
    await manager.connect(websocket)
    
    # Connect to local Redis channel to listen for broadcasts
    redis_client = aioredis.from_url("redis://localhost:6379")
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(f"tenant:{tenant_id}:updates")
    
    async def listen_to_redis():
        try:
            while True:
                message = await pubsub.get_message(ignore_subscribe_messages=True)
                if message and message["data"]:
                    payload = message["data"].decode("utf-8")
                    await websocket.send_text(payload)
                await asyncio.sleep(0.01)
        except asyncio.CancelledError:
            pass

    # Start the Redis listener loop in the background
    listener_task = asyncio.create_task(listen_to_redis())
    
    try:
        while True:
            # Keep connection open and check for incoming messages
            data = await websocket.receive_text()
            # If the client registers an action, route it here
            logger.info(f"Received message from client: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        listener_task.cancel()
        await pubsub.unsubscribe(f"tenant:{tenant_id}:updates")
        await redis_client.close()
```

---

### 5.5 WebSocket Event Payload Specifications
All client-server messages follow a strict JSON payload format. Below are two examples:

#### Scenario A: Agent Execution Step Notification
Sent when an agent finishes an execution step, showing its reasoning and next action:
```json
{
  "event": "agent_step",
  "tenant_id": "8a7c9d2f-1234-5678-abcd-ef0123456789",
  "payload": {
    "agent_name": "ForecastAgent",
    "step_status": "Running",
    "thinking_process": "Calculating potential schedule impacts of the delayed SSO module on Project Alpha. Traversing the Neo4j dependency tree...",
    "elapsed_ms": 482
  }
}
```

#### Scenario B: Node State Transition
Sent when an organizational entity state changes, telling the frontend to update the node color dynamically:
```json
{
  "event": "node_state_transition",
  "tenant_id": "8a7c9d2f-1234-5678-abcd-ef0123456789",
  "payload": {
    "node_id": "GATE-101",
    "entity_type": "Ticket",
    "status_field": "status",
    "old_value": "In Progress",
    "new_value": "Done",
    "triggered_by": "developer_merge_hook"
  }
}
```

---

## 6. Multi-Agent Systems (LangGraph + PydanticAI)

SentinelOS processes complex queries and coordinates corporate actions using a stateful multi-agent system built on **LangGraph** and **PydanticAI**.

```
                +---------------------------------------+
                |          LANGGRAPH MANAGER            |
                +---------------------------------------+
                                    |
            +-----------------------+-----------------------+
            | (State Transitions)                           | (Task Delegation)
            v                                               v
  [ Graph Node Execution ]                        [ Agent Dispatcher ]
  - Update AgentState in Memory                   - CEO Agent
  - Checkpoint state to PostgreSQL                - Forecast Specialist
            |                                               |
            +-----------------------+-----------------------+
                                    |
                                    v
                     (JSON-RPC / Webhook Execution)
```

---

### 6.1 LangGraph State Machine Compiler
Below is the core Python script that defines the LangGraph state machine. It handles node transitions, conditional routing, and persists state history using a PostgreSQL checkpointer:

```python
# /opt/sentinel/agents/graph_compiler.py
# LangGraph Stateful Agent Graph Compiler

from typing import Dict, Any
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.postgres import PostgresSaver
from psycopg_pool import ConnectionPool
from pydantic import BaseModel, Field
from sentinel.agents.graph_compiler import AgentState # Imports AgentState model definition

# PostgreSQL Connection pool for state persistence
pool = ConnectionPool(conninfo="postgresql://sentinel_user:secure_pass@localhost:5432/sentinel_db")
checkpointer = PostgresSaver(pool)

# -------------------------------------------------------------------------
# NODE IMPLEMENTATIONS
# -------------------------------------------------------------------------

async def retrieve_rag_context_node(state: AgentState) -> Dict[str, Any]:
    # Query vector store (Qdrant) for matching document chunks
    query = state.query_text
    tenant_id = state.user_context["tenant_id"]
    clearance = state.user_context["clearance_level"]
    
    # Retrieve top match contexts via hybrid search pipeline
    retrieved_chunks = hybrid_retrieval_pipeline.search(query, tenant_id, clearance, top_k=5)
    chunk_texts = [c["text_content"] for c in retrieved_chunks]
    
    return {"retrieved_contexts": chunk_texts}

async def query_graph_engine_node(state: AgentState) -> Dict[str, Any]:
    # Query graph database (Neo4j) to extract organizational relationships
    query = state.query_text
    # Runs extraction to identify referred node targets (e.g. Employee 'Jane', Project 'Alpha')
    entities = entity_extractor.parse_entities(query)
    
    graph_context = []
    with neo4j_driver.session() as session:
        for entity in entities:
            # Traverses up to 2-degrees of relationship matching the target entity
            cypher = """
            MATCH (n {name: $name})-[r*1..2]-(neighbors)
            RETURN n, r, neighbors LIMIT 30
            """
            result = session.run(cypher, name=entity)
            graph_context.append(str(result.data()))
            
    return {"extracted_graph_nodes": graph_context}

async def strategy_agent_reasoning_node(state: AgentState) -> Dict[str, Any]:
    # Run strategic reasoning over the retrieved context
    # Invoke PydanticAI Strategy Agent
    result = await strategy_assessment_agent.run(
        user_prompt=state.query_text,
        message_history=state.agent_history,
        context={"rag": state.retrieved_contexts, "graph": state.extracted_graph_nodes}
    )
    
    return {
        "intermediate_results": {"strategy_report": result.data.dict()},
        "agent_history": state.agent_history + [{"role": "assistant", "content": result.data.json()}]
    }

# -------------------------------------------------------------------------
# ROUTING CONDITIONS AND COMPILATION
# -------------------------------------------------------------------------

def check_human_approval_gate(state: AgentState) -> Literal["human_gate", "continue"]:
    # Checks if any pending tool executions require human verification
    if len(state.pending_approvals) > 0:
        return "human_gate"
    return "continue"

def decide_next_step(state: AgentState) -> Literal["strategy_reasoning", "end"]:
    # Determines if the retrieved context is sufficient to answer the prompt
    if not state.retrieved_contexts and not state.extracted_graph_nodes:
        return "strategy_reasoning" # Fallback loop to reason with base prompt
    return "end"

# Initialize StateGraph using Pydantic AgentState definition
workflow = StateGraph(AgentState)

# Register Graph nodes
workflow.add_node("retrieve_rag", retrieve_rag_context_node)
workflow.add_node("query_graph", query_graph_engine_node)
workflow.add_node("strategy_reasoning", strategy_agent_reasoning_node)

# Configure transitions and connections
workflow.set_entry_point("retrieve_rag")
workflow.add_edge("retrieve_rag", "query_graph")

# Define conditional route after graph query
workflow.add_conditional_edges(
    "query_graph",
    decide_next_step,
    {
        "strategy_reasoning": "strategy_reasoning",
        "end": END
    }
)
workflow.add_edge("strategy_reasoning", END)

# Compile graph with postgres saver checkpoints
compiled_agent_graph = workflow.compile(checkpointer=checkpointer)
```

---

### 6.2 PydanticAI Validation & Client Execution Contracts
To guarantee that LLM tool calls return valid JSON structured objects, we wrap execution logic inside PydanticAI client contracts:

```python
# /opt/sentinel/agents/pydantic_ai_wrapper.py
# PydanticAI Validation Wrapper & Client Contracts

from pydantic_ai import Agent, RunContext
from pydantic import BaseModel, Field
from typing import List, Dict, Any

# Define structured output validation schema
class SystemHealthAssessment(BaseModel):
    is_operational_anomaly_detected: bool = Field(..., description="Flags active bottlenecks or threshold violations")
    anomaly_details: List[str] = Field(default_factory=list, description="Descriptions of the anomalous events")
    affected_departments: List[str] = Field(default_factory=list, description="Codes of impacted departments")
    severity_rating: float = Field(..., description="Calculated metric between 0.0 (Healthy) and 1.0 (Critical)")

# Instantiate PydanticAI agent running GPT-4o
health_auditor_agent = Agent(
    model='openai:gpt-4o',
    result_type=SystemHealthAssessment,
    system_prompt=(
        "You are the SentinelOS System Health Auditor. Analyze the provided operational data "
        "and return a validated health assessment. If any metrics exceed safety bounds, flag an anomaly."
    )
)

# Run context dependency injector
@health_auditor_agent.tool
async def get_active_kpis(ctx: RunContext[Dict[str, Any]]) -> List[Dict[str, Any]]:
    # Retrieve active KPI metrics from the parent query context
    kpis = ctx.deps.get("kpi_list", [])
    return kpis
```

---

### 6.3 Specialized Agent Configurations & System Prompt Guidelines
Each agent in SentinelOS is configured with a system prompt that defines its responsibilities, allowed tools, and access permissions.

#### CEO Agent Configuration
*   **Role:** Oversees the multi-agent system, delegates tasks to other agents, and coordinates cross-departmental operations.
*   **Allowed Tools:** `delegate_task_to_agent`, `request_executive_summary`, `broadcast_system_announcement`.
*   **System Prompt:**
    ```text
    SYSTEM INSTRUCTION: You are the CEO Agent of SentinelOS. Your role is to oversee the multi-agent system, translate user strategic goals into actionable execution paths, and coordinate cross-departmental operations. You have global access to all organizational metrics, financial records, and project states. Always delegate complex specialized tasks (e.g. database updates, financial forecasting, codebase parsing) to their respective departmental or specialist agents. Do not attempt to execute SQL queries or codebase assessments yourself. Prioritize risk mitigation, budget compliance, and SLA preservation.
    ```

#### Forecast Agent Configuration
*   **Role:** Runs predictive models to project strategic business trends, budget overruns, and timeline risks.
*   **Allowed Tools:** `run_regression_projection`, `calculate_impact_score`.
*   **System Prompt:**
    ```text
    SYSTEM INSTRUCTION: You are the Forecast Agent of SentinelOS. Your role is to run predictive simulations, estimate financial run-rates, and calculate schedule slippage risks. You have access to historical project timelines, resource costs, and contract values. Always output projections as a structured object containing a clear timeline of impact, estimated cost variance, and model confidence scores. If a delayed milestone threatens a contract SLA, flag a high-priority risk immediately.
    ```

---

### 6.4 LLM Router Engine & Decision Tree Logic
The LLM Router acts as an dynamic switchboard, routing incoming prompts to the most cost-effective and task-appropriate model:

```python
# /opt/sentinel/agents/llm_router.py
# LLM Router Engine

from pydantic import BaseModel, Field
from typing import Dict, Any, Literal

class RoutingDecision(BaseModel):
    selected_model: str = Field(..., description="Target model destination")
    routing_reason: str = Field(..., description="Explanation for model selection")

class LLMRouter:
    def __init__(self, router_client):
        self.client = router_client

    def route_query(self, query: str, token_estimate: int) -> RoutingDecision:
        # Check simple rule-based overrides first
        if "sql" in query.lower() or "database" in query.lower():
            return RoutingDecision(selected_model="gpt-4o", routing_reason="Query targets relational databases. Selecting SQL specialist model.")
        if "commit" in query.lower() or "code" in query.lower() or "pull request" in query.lower():
            return RoutingDecision(selected_model="claude-3.5-sonnet", routing_reason="Query targets codebases. Selecting software development specialist model.")
        if token_estimate > 100000:
            return RoutingDecision(selected_model=settings.MODEL_NAME, routing_reason="Input payload exceeds 100k tokens. Selecting the configured Gemini model for high-capacity processing.")
        
        # Fallback to GPT-4o for general multi-agent reasoning tasks
        return RoutingDecision(selected_model="gpt-4o", routing_reason="General reasoning query. Selecting standard enterprise router model.")
```

---

## 7. Model Context Protocol (MCP) & n8n

SentinelOS connects to external systems using the **Model Context Protocol (MCP)**, allowing agents to execute tools securely using a standardized JSON-RPC 2.0 interface.

```
+------------------+                        +------------------+
| SentinelOS Host  | ======(JSON-RPC)======> |  Jira MCP Server |
|  Agent Framework | <====(Schema Query)==== |                  |
+------------------+                        +------------------+
```

---

### 7.1 JSON-RPC 2.0 Protocol Specifications
All communications between the SentinelOS agent gateway and MCP connector servers follow the JSON-RPC 2.0 specification:

#### Tool Discovery Request
Sent by the host to discover available tools on the server:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}
```

#### Tool Discovery Response
```json
{
  "jsonrpc": "2.0",
  "result": {
    "tools": [
      {
        "name": "jira_create_issue",
        "description": "Creates a new engineering ticket in Jira",
        "inputSchema": {
          "type": "object",
          "properties": {
            "projectKey": { "type": "string", "minLength": 2 },
            "summary": { "type": "string" },
            "description": { "type": "string" },
            "issueType": { "type": "string", "enum": ["Bug", "Story", "Task"] }
          },
          "required": ["projectKey", "summary", "issueType"]
        }
      }
    ]
  },
  "id": 1
}
```

---

### 7.2 n8n Workflow Ingestion Mapping
For long-running, multi-step actions (e.g., ticket triage, employee onboarding), SentinelOS routes events through **n8n** webhook pipelines.

#### Webhook Router JSON Config
Below is the configuration payload for an n8n webhook node:
```json
{
  "meta": {
    "instanceId": "n8n-instance-102"
  },
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "sentinel-ticket-ingest",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "webhook-node-id",
      "name": "Zendesk Ingress Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    }
  ]
}
```

---

## 8. Security & User Management (Keycloak)

SentinelOS delegates user authentication and single sign-on (SSO) management to **Keycloak**, securing API gateways using OpenID Connect (OIDC) tokens.

```
 [ Client Browser ] ----------( 1. Login request )-----------> [ Keycloak SSO ]
 [                ] <---------( 2. Returns JWT token )-------- [              ]
         |
         +-------------------( 3. API request + JWT )--------> [ FastAPI Gateway ]
                                                                      |
                                                               (Validates RS256)
```

---

### 8.1 Keycloak Realm Configuration
For production deployments, the SentinelOS realm configures OIDC authentication policies:

*   **Realm Name:** `sentinel-enterprise`
*   **Token Signature Algorithm:** `RS256`
*   **Access Token Lifespan:** 15 Minutes (900 Seconds) to minimize the impact of leaked tokens.
*   **Refresh Token Lifespan:** 8 Hours (28,800 Seconds) with rolling revocation enabled.

#### JSON Token Payload Schema
The JWT access token issued by Keycloak contains user profiles, assigned departments, and security clearance levels:
```json
{
  "iss": "https://sso.company.com/realms/sentinel-enterprise",
  "sub": "b2f8a9e0-1234-5678-abcd-ef0123456789",
  "aud": "sentinel-gateway-api",
  "exp": 1783959600,
  "iat": 1783958700,
  "email": "jane.doe@company.com",
  "resource_access": {
    "sentinel-gateway-api": {
      "roles": ["CEO", "Manager"]
    }
  },
  "tenant_id": "8a7c9d2f-1234-5678-abcd-ef0123456789",
  "security_clearance_level": "Level 5",
  "department_allocations": ["DEPT-ENG", "DEPT-FIN"]
}
```

---

### 8.2 Security Clearance Filter Middleware
The FastAPI gate checks the incoming token signature and validates permissions before executing queries:

```python
# /opt/sentinel/api/middleware/security.py
# Security Clearance Validation Middleware

from fastapi import Request, HTTPException, status
import jwt
from jwt.exceptions import InvalidTokenError

class SecurityClearanceEvaluator:
    def __init__(self, keycloak_jwks_url: str):
        self.jwks_url = keycloak_jwks_url
        # In production, load public keys from the Keycloak JWKS endpoint
        self.jwks_client = jwt.PyJWKClient(keycloak_jwks_url)

    async def verify_request_clearance(self, request: Request, required_level: int) -> dict:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or malformed Authorization header"
            )
        
        token = auth_header.split(" ")[1]
        try:
            # Fetch public key and validate signature
            signing_key = self.jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience="sentinel-gateway-api"
            )
        except InvalidTokenError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid authentication token: {str(e)}"
            )

        # Validate security clearance level
        user_clearance = payload.get("security_clearance_level", "Level 1")
        # Extract integer clearance score (e.g. 'Level 3' -> 3)
        user_level = int(user_clearance.split(" ")[1])
        
        if user_level < required_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Insufficient security clearance level"
            )
            
        return payload
```

---

## 9. Infrastructure & Deployment Setup

### 9.1 Production Kubernetes Deployment Specifications
For high availability, SentinelOS is deployed to a Kubernetes cluster. Below is the deployment manifest for our core API service:

```yaml
# /opt/sentinel/deploy/k8s-api-deployment.yaml
# Production Kubernetes Service Manifest

apiVersion: apps/v1
kind: Deployment
metadata:
  name: sentinel-api-gateway
  namespace: sentinel-os
  labels:
    app: sentinel-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sentinel-api
  template:
    metadata:
      labels:
        app: sentinel-api
    spec:
      containers:
      - name: gateway-container
        image: sentinel-os/api-gateway:1.0.0-PROD
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: connection-string
        - name: REDIS_URL
          value: "redis://sentinel-redis-service.sentinel-os.svc.cluster.local:6379/0"
        resources:
          limits:
            cpu: "2.0"
            memory: 2Gi
          requests:
            cpu: "500m"
            memory: 512Mi
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 8000
          initialDelaySeconds: 15
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: sentinel-api-service
  namespace: sentinel-os
spec:
  type: ClusterIP
  selector:
    app: sentinel-api
  ports:
  - port: 8000
    targetPort: 8000
```

---

### 9.2 Ingress NGINX Proxy Configuration
We route requests to our Kubernetes pods using NGINX Ingress, configuring it to support WebSockets:

```nginx
# /etc/nginx/sites-available/sentinel-ingress.conf
# Ingress Reverse Proxy Configuration

server {
    listen 80;
    server_name portal.sentinel.company.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name portal.sentinel.company.com;

    ssl_certificate /etc/ssl/certs/sentinel_ssl_bundle.crt;
    ssl_certificate_key /etc/ssl/private/sentinel_private.key;
    ssl_protocols TLSv1.3;

    client_max_body_size 50M; # Support large PDF contract uploads

    # Route UI Traffic
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Route WebSocket streams
    location /ws/ {
        proxy_pass http://sentinel-api-service.sentinel-os.svc.cluster.local:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
    }
}
```

---

## 10. Observability (Prometheus, Grafana, OpenTelemetry)

SentinelOS uses OpenTelemetry to generate tracing spans across our distributed systems, making it easy to track down performance bottlenecks:

```python
# /opt/sentinel/api/telemetry.py
# OpenTelemetry Instrumentation setup

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

def configure_telemetry(app):
    # Setup Tracer provider
    provider = TracerProvider()
    processor = BatchSpanProcessor(
        OTLPSpanExporter(endpoint="http://otel-collector.monitoring.svc.cluster.local:4317")
    )
    provider.add_span_processor(processor)
    trace.set_tracer_provider(provider)
    
    # Instrument FastAPI App
    FastAPIInstrumentor.instrument_app(app)
```

#### Custom Prometheus Alert Rules
```yaml
# /etc/prometheus/alert.rules.yml
# Custom Prometheus Alert Definitions

groups:
- name: sentinel-alerts
  rules:
  - alert: HighRequestErrorRate
    expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100 > 5
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "API Gateway returns 5xx error status codes on over 5% of requests."
```

---
## End of TRD Document
This marks the completion of the SentinelOS Technical Requirement Document. All chapters have been populated with comprehensive technical details.




