# SentinelOS AI: The Enterprise Digital Twin Operating System
## Product Requirement Document (PRD) — Production-Grade Specification
**Version:** 1.0.0-PROD  
**Author:** Principal Enterprise Architect  
**Classification:** Proprietary / Investor & Executive Review  
**Target Funding Stage:** €10,000,000 Series Seed/A  

---

## Table of Contents
1. **Executive Summary & Investment Thesis**
   - 1.1 Product Vision & Paradigm Shift
   - 1.2 Core Value Proposition: The Living Enterprise Model
   - 1.3 VC Investment Rationale (€10M Series Seed/A)
   - 1.4 TAM, SAM, SOM, and Enterprise Pricing Models
   - 1.5 Executive Roadmap & Key Milestones
2. **Strategic Problem Statement: The Chatbot Fallacy**
   - 2.1 Why Chatbots Fail in Enterprise Environments
   - 2.2 Context Window Constraints & Semantic Drift
   - 2.3 The Statelessness Trap
   - 2.4 The Solution: Connected, Stateful Digital Representations
   - 2.5 Strategic Business Scenarios: Static vs. Twin-Driven Reasoning
3. **SentinelOS Architectural Topology**
   - 3.1 High-Level System Architecture
   - 3.2 Main Pipeline Loops: Ingest, Sync, Analyze, Visualize
   - 3.3 Core Performance SLAs & Latency Targets
   - 3.4 Microservice Definitions & Communication Protocols
   - 3.5 Consistency Models: Neo4j, PostgreSQL, and Qdrant

---

## 1. Executive Summary & Investment Thesis

### 1.1 Product Vision & Paradigm Shift
Enterprise software is currently choked by static, siloed database systems and superficial AI overlays. Traditional software requires human operators to act as context-switchers, copy-pasting data between CRM, ERP, HRIS, and project management tools. When AI is introduced, it is typically implemented as a "chatbot"—a stateless interface that query-searches documents or database records via basic retrieval-augmented generation (RAG) and returns text answers.

SentinelOS AI represents a complete paradigm shift. We do not build chatbots. We build an **Enterprise Digital Twin Operating System**.

```
+------------------------------------------------------------------------+
|                              SENTINELOS                                |
|  An Operating System that builds, maintains, and simulates a living,   |
|            state-synchronized knowledge graph of your company.         |
+------------------------------------------------------------------------+
              |                                            |
              v                                            v
  [ AI-Understandable Model ]                  [ Continuous Optimization ]
  - Org Structure & Financials                 - Predict Bottlenecks
  - Project Dependencies & Commits             - Simulate Strategy Outcomes
  - Customer Journeys & Churn Risks            - Auto-trigger Workflows
```

SentinelOS creates a living, AI-understandable model of the entire enterprise. Every employee, department, project, document, customer, meeting, ticket, software commit, financial transaction, and Key Performance Indicator (KPI) is mapped as a node in an interconnected, real-time knowledge graph. The system continuously ingests metadata, emails, calendar events, code repositories, database updates, and chat messages to keep the twin synchronized.

The AI does not merely search this data; it reasons over it. It simulates future organizational outcomes, predicts bottlenecks before they occur, automatically discovers compliance risks, and executes complex processes across multi-agent workflows.

### 1.2 Core Value Proposition: The Living Enterprise Model
The core value proposition of SentinelOS AI lies in its ability to synthesize unstructured context and structured corporate data into a unified, actionable graph that represents the current operational reality.

| Enterprise Asset | Traditional Software Representation | SentinelOS Digital Twin Representation |
| :--- | :--- | :--- |
| **Employees & Teams** | Static HR roster, org chart PDF, email aliases. | Dynamic node with skills matrix, communication frequency, calendar utilization, and direct linkage to active project commits. |
| **Projects & Tasks** | Jira board, Gantt charts, status updates. | Event-driven pipeline linking developer PRs, design docs, Slack sentiment, and customer impact scores. |
| **Business Processes** | Static SOP documents in Notion or Confluence. | Live executable graph (React Flow/n8n) with step-by-step latency tracking, failure rate analysis, and automated agent triggers. |
| **Customers & Sales** | CRM accounts, opportunity stages, support tickets. | Real-time sentiment metrics, contract compliance status, and deep dependency linking showing how engineering bugs affect churn. |
| **Financials & KPIs** | ERP ledgers, spreadsheet forecasts, monthly reports. | Live continuous calculations mapping operational actions (e.g., project delay) directly to cash flow impact and run-rate projections. |

By treating the entire company as a single, fully connected entity, SentinelOS unlocks capabilities that are impossible with point solutions:
1. **Root-Cause Analysis Across Boundaries:** Trace a drop in customer satisfaction scores directly to an engineering regression, a missing product documentation file, or a specific department's resource crunch.
2. **Predictive Simulation (What-If Analysis):** Run simulations to answer questions such as: *"If we reassign three senior engineers from Project Alpha to Project Beta, what is the exact impact on the delivery timeline of Project Alpha, and how will that affect our Q3 SaaS renewal pipeline?"*
3. **Autonomous Agent Execution:** Deploy AI agents that possess a complete understanding of company context, permissions, and history, allowing them to draft proposals, resolve support tickets, or coordinate project timelines with minimal human oversight.

### 1.3 VC Investment Rationale (€10M Series Seed/A)
To capitalize on this technical foundation and capture the emerging Enterprise Digital Twin market, we are raising a **€10,000,000 Series Seed/A** round. This capital will be deployed systematically across engineering, product development, security compliance, and initial enterprise go-to-market.

#### Use of Funds Breakdown
*   **Engineering & R&D (55% / €5.5M):**
    *   Development of the proprietary **Digital Twin Sync Engine** and multi-agent orchestration framework (LangGraph + PydanticAI).
    *   Hiring elite distributed systems engineers, graph database experts, and AI research engineers.
    *   Scaling local vector search capabilities and local LLM routing infrastructure (maximizing security and minimizing token costs via hybrid setups).
*   **Security, Compliance & Infrastructure (20% / €2.0M):**
    *   Achieving SOC2 Type II, ISO 27001, and GDPR certifications.
    *   Building the containerized enterprise-grade deployment stack (Kubernetes, MinIO, Keycloak).
    *   Setting up secure VPC instances and self-hosted private cloud clusters for target enterprise accounts that demand complete data sovereignty.
*   **Go-To-Market & Sales (15% / €1.5M):**
    *   Establishing the enterprise sales team targeting Mid-Market to Fortune 500 tech, manufacturing, and financial services companies.
    *   Establishing strategic partnerships with system integrators (e.g., Accenture, Deloitte) to deliver SentinelOS solutions to legacy companies.
*   **Operations & Legal (10% / €1.0M):**
    *   Managing patents around real-time graph synchronization, model context protocol execution safety, and agent role-based access control.
    *   General corporate overhead, legal council, and workspace management.

### 1.4 TAM, SAM, SOM, and Enterprise Pricing Models
The enterprise AI software market is expanding exponentially, but the traditional generic SaaS model is fragmenting. Large corporations are refusing to upload their core IP, strategies, and customer data to external, generic AI endpoints. They require a localized, sovereign operating system that sits on top of their own infrastructure.

```
+-----------------------------------------------------------------+
| Total Addressable Market (TAM): $150B                           |
| Global Enterprise AI & Business Process Modeling (2027)        |
+-----------------------------------------------------------------+
       |
       v
+-----------------------------------------------------------------+
| Serviceable Addressable Market (SAM): $45B                      |
| Enterprise-Grade Graph-Based Modeling & Sovereign AI Systems   |
+-----------------------------------------------------------------+
       |
       v
+-----------------------------------------------------------------+
| Serviceable Obtainable Market (SOM): $2.5B                      |
| Mid-to-Large Tech, Biotech, Finance, and Telecom Verticals     |
+-----------------------------------------------------------------+
```

#### Pricing Model Architecture
SentinelOS utilizes a three-tier hybrid pricing model that pairs predictable subscription pricing with consumption-based compute metrics:

1. **Mid-Market Scale (Growth Tier):**
   *   *Target:* Companies with 100 to 500 employees.
   *   *Pricing:* €15,000/month flat fee + €45/user/month.
   *   *Deployment:* Shared SaaS (isolated tenant database clusters, managed by SentinelOS).
   *   *Features:* Core digital twin graphs (Org, Project, Customer), standard MCP connectors (GitHub, Slack, Google Workspace), and basic RAG pipeline.
2. **Enterprise Scale (Unicorn/Enterprise Tier):**
   *   *Target:* Companies with 500 to 5,000 employees.
   *   *Pricing:* €65,000/month flat fee + €35/user/month.
   *   *Deployment:* Dedicated VPC (AWS/Azure/GCP) or private cloud.
   *   *Features:* Full graph synchronization engine (Neo4j, Postgres, Qdrant cluster), custom MCP connector frameworks, LangGraph visual editor, real-time file watchers, and dedicated CEO/Executive agent execution pods.
3. **Sovereign/Federal Tier (Strategic Governance Tier):**
   *   *Target:* Fortune 100, Defense, Biotech, Government agencies.
   *   *Pricing:* Custom contracts starting at €1.2M/year.
   *   *Deployment:* On-premise air-gapped hardware or private sovereign clouds (e.g., AWS Secret Region).
   *   *Features:* Self-hosted open-source model routing (Ollama with Llama-3-70B & DeepSeek-R1), local OCR pipelines (PaddleOCR), localized security policy evaluation engine, and strict role-based access controls integrated with Active Directory/Keycloak.

### 1.5 Executive Roadmap & Key Milestones
Our execution roadmap covers the transition from the Hackathon MVP to the Sovereign Enterprise Scale over an 18-month timeline.

```
       Month 0-3                     Month 4-6                    Month 7-12                   Month 13-18
+--------------------+       +--------------------+       +--------------------+       +--------------------+
|   HACKATHON MVP    |  ==>  |    ENTERPRISE MVP  |  ==>  |   VPC SCALE OUT    |  ==>  |   SOVEREIGN AIR-   |
| Single-node Docker |       | Multi-agent Engine |       | SOC2 Compliant GTM |       |  GAPPED PLATFORM   |
| Compose, Postgres, |       |   Visual Editor    |       | Kubernetes Helm    |       | Fully self-hosted  |
| Neo4j, Qdrant sync |       | n8n & GitHub MCPs  |       | Charts, Meilisearch|       | Ollama routing, GTM|
+--------------------+       +--------------------+       +--------------------+       +--------------------+
```

*   **Months 0–3: Core Engine & Single-Node Compose:**
    *   Build out core schemas for the Twin modules.
    *   Implement basic synchronization routines (n8n hooks, GitHub webhooks).
    *   Deliver interactive frontend visualization with Cytoscape.js and React Flow.
*   **Months 4–6: Multi-Agent Engine & Process Automation:**
    *   Deploy the full LangGraph + PydanticAI system.
    *   Integrate standard MCP servers for Gmail, Google Calendar, Slack, and Jira.
    *   Implement user authentication, RBAC authorization, and systemd resilient process managers.
*   **Months 7–12: Compliance, Scale-Out & Multi-Tenant Architecture:**
    *   Transition from Docker Compose to Kubernetes Helm Charts.
    *   Achieve SOC2 Type II compliance.
    *   Integrate Meilisearch for global hybrid search across all digital twin entities.
    *   Deploy executive-level forecasting models.
*   **Months 13–18: Sovereign Enterprise Deployment:**
    *   Package SentinelOS for completely air-gapped on-premise installations.
    *   Implement local LLM routing layer utilizing Ollama/VLLM.
    *   Sign first three Fortune 500 design partners.

---

## 2. Strategic Problem Statement: The Chatbot Fallacy

### 2.1 Why Chatbots Fail in Enterprise Environments
The current market is saturated with "Enterprise Copilots" and "Chatbots" that claim to automate business workflows. These systems fail when deployed inside actual organizations because they suffer from structural and conceptual limitations.

A chatbot operates under a **conversational paradigm**. It expects a human user to start a session, write a query, and wait for a response. In an enterprise, however, value is generated via continuous, asynchronous processes. An AI system cannot merely wait for a query; it must actively observe system states and autonomously execute tasks based on triggers, anomalies, or scheduled strategies.

```
Chatbot Paradigm (Passive & Fragmented):
[User Query] ----> [RAG Text Search] ----> [LLM Generation] ----> [Stateless Text Output]

SentinelOS Paradigm (Active & Graph-Connected):
[Event Ingress] --> [Digital Twin Sync Engine] --> [Neo4j Graph & Vector DB Update]
                                                           |
                                                           v
[Continuous Agents] <-- [State Machine Execution] <-- [LangGraph Reasoning]
```

Furthermore, traditional chatbots lack context. When a user asks: *"What is the status of our customer renewals?"*, a chatbot can search a vector store for documents matching "renewals" or write a SQL query to a CRM database. However, it cannot reason across multiple domains. It does not know that a critical renewal is blocked because a specific software engineer is behind schedule on a GitHub issue that resolves a bug for that customer. SentinelOS resolves this by organizing information as a graph, where relationships represent real-world dependencies.

### 2.2 Context Window Constraints & Semantic Drift
Even if enterprise data is loaded into modern Large Language Models (LLMs) with massive context windows (e.g., 1M+ tokens), LLMs suffer from three core operational issues:
1. **Lost in the Middle:** Models are skilled at retrieving facts from the absolute beginning or the end of a long context block, but they regularly fail to locate or reason over facts buried in the middle of hundreds of pages of text.
2. **Semantic Drift & Hallucination:** In a large context window containing disparate emails, code snippets, financial sheets, and meeting transcripts, the LLM struggle to resolve conflicting terms. For example, the term "Project Alpha" might refer to an internal infrastructure migration in engineering, a marketing campaign in sales, or a customer implementation project in customer success. Without an explicit knowledge graph defining these distinct entities and their namespaces, the model blends these contexts, leading to semantic drift and incorrect logic.
3. **Severe Cost & Latency Penalties:** Feeding an entire company's documentation base into a model for every single prompt creates massive token costs and incurs latency delays of up to 30–60 seconds per turn. This makes real-time agent execution and automated decision loops cost-prohibitive and structurally slow.

By maintaining a synchronized knowledge graph in Neo4j, SentinelOS selects only the exact subgraph relevant to the current problem, packaging it into a clean, compact, structured prompt context of less than 10,000 tokens. This results in execution speeds of under 2 seconds and dramatic cost reductions.

### 2.3 The Statelessness Trap
Standard RAG frameworks are stateless. They retrieve raw text fragments from a vector database based on semantic similarity, feed them to the LLM, and discard the context once the query is answered.
*   **No Memory of Strategic Intent:** If the CEO discusses a strategic priority to reduce infrastructure costs in Q1, a stateless chatbot cannot carry this goal forward to influence how it answers queries regarding software architecture or cloud provider configurations in Q2, unless that specific document is retrieved.
*   **No Operational Memory:** Stateless systems do not track which actions they previously recommended, which bugs they noticed, or which users they emailed. They cannot maintain a persistent audit trail or build on past reasoning.
*   **Inability to Simulate:** Because there is no persistent state machine representing the company, a chatbot cannot simulate changes. It cannot copy the current state, modify a variable (e.g., "Reduce marketing budget by 20%"), run a simulator over the system, and compare the outputs.

SentinelOS solves this by keeping the state in a unified graph database (Neo4j) alongside a relational audit log (PostgreSQL). The state is persistent, queryable, and versioned. The multi-agent system uses this state as its working memory, allowing for continuous, stateful execution.

### 2.4 The Solution: Connected, Stateful Digital Representations
SentinelOS models the enterprise as a set of defined entities and their real-time state relationships. When an event occurs in any connected system, it is captured, parsed, and recorded as a state transition.

```
       [ GitHub Commit ]
               | (triggers)
               v
+-------------------------------+
|  Digital Twin Sync Engine     |
|  - Relational Write (PG)      |
|  - Relationship Write (Neo4j) |
|  - Semantic Chunk Write (Qdrant)|
+-------------------------------+
               |
        +------+------+
        |             |
        v             v
   [ Neo4j Graph ]  [ PostgreSQL ]
   Update: Engineer Update: Commits
   -> AUTHOR_OF    Metadata & Logs
   -> Commit
   -> TOUCHES
   -> Component
```

Consider a code change pushed to a production branch. Instead of treating this as an isolated Git commit, SentinelOS parses the commit message and metadata to perform the following synchronized operations:
1. **Relational Record:** Writes the commit ID, author, date, and changes into the PostgreSQL transactional DB.
2. **Graph Connection:** Updates Neo4j to link the `(:Employee)` node of the developer to the `(:Commit)` node. It links the `(:Commit)` to the specific `(:SoftwareComponent)` it modifies, which is in turn linked to the `(:Project)` that utilizes it, and the `(:Customer)` using that module.
3. **Semantic Indexing:** Chunks the code modifications using our RAG pipeline and stores them in Qdrant, linking the vectors to the Postgres commit records.
4. **Agent Notification:** LangGraph agents check if this commit resolves a bug blocking a target milestone. If it does, the Project Agent updates the task status, and the Customer Success Agent flags the customer account as ready for communication.

### 2.5 Strategic Business Scenarios: Static vs. Twin-Driven Reasoning
The operational superiority of SentinelOS over traditional chatbots is clear when comparing how they handle common business inquiries:

#### Business Scenario A: Project Slippage Impact
*   *The Ingress Event:* Project Alpha’s lead developer submits a ticket indicating a 3-week delay on the SSO integration module due to third-party library issues.
*   *Chatbot Approach:*
    *   The user asks: *"What happens if SSO integration is delayed by 3 weeks?"*
    *   The chatbot searches Notion docs for "SSO integration" and "Project Alpha schedule".
    *   It replies: *"Project Alpha's roadmap says SSO is scheduled for this month. A 3-week delay means it will finish next month. You should update your Jira board."*
    *   *Result:* Zero strategic value, manual routing required, no downstream visibility.
*   *SentinelOS Approach:*
    *   The sync engine records the delay in PostgreSQL and updates the target dates in the project dependency tree in Neo4j.
    *   The **Risk Agent** executes a graph traversal query:
        ```cypher
        MATCH (p:Project {name: 'Project Alpha'})-[:DEPENDS_ON]->(m:Module {name: 'SSO'})
        MATCH (p)-[:REQUIRED_BY]->(c:Customer)-[:HAS_CONTRACT]->(cont:Contract)
        MATCH (c)-[:HAS_TICKET]->(t:Ticket {status: 'Escalated'})
        RETURN c.name, cont.value, t.id
        ```
    *   The **Strategy Agent** computes the downstream impacts:
        1. Identifies that Customer "Acme Corp" has a contract renewal on Sept 1st that is legally dependent on SSO availability.
        2. Calculates that the delay pushes delivery to Sept 10th, violating SLA clause 4.2 (resulting in a 10% penalty fee and severe churn risk).
        3. Identifies that Customer Success has an open escalation ticket with Acme Corp's director.
    *   The system generates a high-priority warning dashboard for the VP of Engineering and the CEO, proposing an alternative strategy: *"Reassign Engineer Jane (who has SSO expertise, currently on low-priority Project Gamma) to Project Alpha for 5 days. This reduces SSO delay to 2 days, securing the Acme Corp renewal (€250k ARR)."*

#### Business Scenario B: Incident Management & Root-Cause Analysis
*   *The Ingress Event:* Database CPU usage spikes to 99%, causing timeouts on customer dashboards.
*   *Chatbot Approach:*
    *   The engineer asks: *"Why is the database slow?"*
    *   The chatbot searches logs or returns general troubleshooting steps: *"A 99% CPU spike is usually caused by unindexed queries, high traffic, or lock contentions. Check your active queries."*
    *   *Result:* Generic support advice. The engineer still has to investigate manually.
*   *SentinelOS Approach:*
    *   The system monitors metrics via Prometheus.
    *   The **Ops Agent** queries the digital twin graph:
        *   Locates the CPU spike time.
        *   Cross-references with GitHub commits, finding that a query was deployed in a commit 10 minutes prior by the Marketing Analytics team.
        *   Cross-references with PostgreSQL schemas and Neo4j project nodes, finding that this query scans the massive raw audits table without an index.
    *   The system automatically executes a rollback recommendation, notifies the developer who wrote the query on Slack, and provides the exact SQL command to add the missing index.

---

## 3. SentinelOS Architectural Topology

### 3.1 High-Level System Architecture
SentinelOS is structured as a collection of independent, specialized microservices designed to scale horizontally. This ensures data isolation, secure boundary management, and robust failover procedures.

```
                                  [ CLIENTS ]
             (Next.js 15 UI / Cytoscape.js / React Flow / WebSockets)
                                       |
                                       v
                             [ REVERSE PROXY ]
                                  (NGINX)
                                  |      |
                 +----------------+      +----------------+
                 | (HTTP / REST)                          | (WebSockets)
                 v                                        v
       [ BACKEND SERVICES ]                     [ REAL-TIME ENGINE ]
     (FastAPI API Gateways)                     (WebSocket Server / Redis)
        |          |          |                            |
        |          |          +--------------+-------------+
        v          v                         v
   [ DB TIER ]  [ VECTOR STORE ]      [ AGENTIC EXECUTION ]
  (PG / Neo4j)      (Qdrant)         (LangGraph / PydanticAI)
        ^                                    ^
        |                                    |
        +----------[ SYNC ENGINE ]-----------+
              (n8n / Linux inotify)
```

The system components are organized into three primary layers:
1. **The Ingress & Synchronization Layer:** Continuous event collection, file watchers (`inotify` on Linux hosts), Webhook receivers, and MCP adapters that pull updates from external services.
2. **The Graph, State, and Search Storage Layer:** PostgreSQL (relational logs, operational state, permissions), Neo4j (relationship maps, dependency graphs), Redis (real-time session caching, rate-limiting, and short-term agent memory), and Qdrant (semantic embeddings of text chunks).
3. **The Cognitive & Execution Layer:** LangGraph workflow runners, PydanticAI schema executors, and the LLM Router. These services evaluate prompts, verify user permissions against PostgreSQL, and update system state across Neo4j and PostgreSQL.

### 3.2 Main Pipeline Loops: Ingest, Sync, Analyze, Visualize
To maintain a synchronized digital twin, SentinelOS executes three continuous pipelines:

#### Ingest & Sync Loop (Data Freshening)
*   *Step 1 (Ingress):* External systems emit events (e.g., Jira ticket updated, PDF contract dropped in directory).
*   *Step 2 (Linux Host Watcher):* A systemd-monitored Linux file watcher (`inotify`) detects new document uploads.
*   *Step 3 (Parsing):* Docling or PyMuPDF extracts metadata and structures the text.
*   *Step 4 (Database Sync):*
    *   The sync service writes the document entity to PostgreSQL.
    *   The sync service chunks the document and pushes the embeddings to Qdrant.
    *   The sync service writes relationship edges (e.g., `(Employee)-[:UPLOADED]->(Document)-[:ASSOCIATED_WITH]->(Project)`) to Neo4j.
*   *Step 5 (Cache Invalidation):* Redis cache entries for the associated project subgraphs are invalidated, forcing agents to pull the updated data on their next execution.

#### Analyze & Simulate Loop (Intelligence Pipeline)
*   *Step 1 (Trigger):* A scheduled cron job or a state transition (e.g., a critical KPI dropping below target) activates a LangGraph execution.
*   *Step 2 (Sub-graph Retrieval):* The Strategy Agent queries Neo4j to retrieve the localized subgraph of the affected department.
*   *Step 3 (Reasoning & Structured Validation):* PydanticAI structures the data and queries the LLM Router. The router selects the most efficient model (e.g., Gemini 1.5 Flash for high-speed classification, or GPT-4o for complex financial reasoning).
*   *Step 4 (Simulation):* The agent runs a simulation by copying the subgraph, modifying the variables (e.g., simulating a budget cut), and running predictive rules.
*   *Step 5 (Outcome Logging):* Simulation outcomes are stored in PostgreSQL and marked as pending human review if they indicate an operational anomaly.

#### Visualize & Push Loop (Frontend Real-time Sync)
*   *Step 1 (WebSocket Emission):* Any state change in the digital twin writes an event to a Redis Pub/Sub channel.
*   *Step 2 (Broadcast):* The WebSocket server broadcasts the state update to all active web clients authenticated for that tenant.
*   *Step 3 (Dynamic Render):* The Next.js frontend catches the event. Cytoscape.js updates the node values (e.g., changing a project node's color from green to orange to represent a new risk), React Flow adjusts the active process path, and Apache ECharts updates the dashboard KPIs in real-time without requiring a page refresh.

### 3.3 Core Performance SLAs & Latency Targets
For SentinelOS to act as a responsive operational layer, we enforce strict latency, synchronization, and query SLAs:

| Pipeline Phase | Metric | Target SLA | Peak Target | Monitoring Metric |
| :--- | :--- | :--- | :--- | :--- |
| **Document Ingestion** | Ingestion-to-Vector Ready | < 3,000 ms | < 5,000 ms | `rag_ingest_duration_seconds` |
| **Graph Synchronization** | Transaction to Neo4j edge sync | < 150 ms | < 500 ms | `graph_sync_latency_ms` |
| **Agent Reasoning Turn** | PydanticAI prompt round-trip | < 1,500 ms | < 3,000 ms | `agent_response_latency_seconds` |
| **WebSocket Delivery** | Server publish to client UI render | < 80 ms | < 200 ms | `websocket_propagation_delay_ms` |
| **Global Search** | Meilisearch hybrid query return | < 50 ms | < 120 ms | `search_query_execution_time_ms` |
| **Simulation Runtime** | 1000-node Monte Carlo projection | < 5,000 ms | < 10,000 ms | `sim_engine_runtime_seconds` |

If any latency metric exceeds the peak target, the alerting system (Prometheus + Sentry) flags the run, routes details to the Operations Agent, and notifies engineering via Slack.

### 3.4 Microservice Definitions & Communication Protocols
SentinelOS is built on a service-oriented framework. Communication protocols are selected to balance speed, structure, and reliability.

```
+-------------------------------------------------------------------------------+
|                            COMMUNICATION PROTOCOLS                            |
+-------------------------------------------------------------------------------+
       |                                |                             |
       v                                v                             v
  [ REST / JSON ]                [ WebSockets ]                [ gRPC / Protobuf ]
  - External API Integrations     - Live UI Status Streaming    - High-throughput Internal
  - UI Data Fetching              - Real-time Notifications      Microservices Communication
  - System Configuration          - Streaming Agent Responses   - Large Dataset Streaming
```

1. **API Gateway (FastAPI):**
   *   *Protocol:* REST over HTTPS / JSON.
   *   *Purpose:* Handles external integrations, user configurations, UI data fetching, and authentication.
2. **Real-time Event Broker (Redis + WebSockets):**
   *   *Protocol:* WebSockets (wss://).
   *   *Purpose:* Streams live agent thinking logs, status indicators, and immediate twin update graphics to client dashboards.
3. **Agent Orchestrator Service (LangGraph Node Runner):**
   *   *Protocol:* gRPC / Protobuf (internal) & REST (external).
   *   *Purpose:* Manages agent workspace state, schedules cron executions, handles agent-to-agent message passing, and maintains step-by-step audit trails.
4. **Data Sync Engine (Celery Workers + RabbitMQ):**
   *   *Protocol:* AMQP.
   *   *Purpose:* Asynchronous worker queues that perform heavy extraction tasks, image processing (OCR), PDF chunking, and database write operations.

### 3.5 Consistency Models: Neo4j, PostgreSQL, and Qdrant
Maintaining consistency across a relational database, a graph database, and a vector database is a major challenge in digital twin architectures. SentinelOS uses a **Write-Ahead Log (WAL) & Eventual Consistency Engine** to handle distributed state.

```
       [ Client / System Event ]
                   |
                   v
     +---------------------------+
     |   Write-Ahead Log (PG)    |  <-- Single source of truth (Strong Consistency)
     +---------------------------+
                   |
         +---------+---------+
         | (Async Workers)   |
         v                   v
   +-----------+       +-----------+
   |   Neo4j   |       |  Qdrant   |  <-- Eventual Consistency (Target: <500ms)
   +-----------+       +-----------+
```

1. **Primary Source of Truth (Strong Consistency):**
   PostgreSQL acts as the transactional log. Any state change (e.g., a ticket resolution status change) is first written to PostgreSQL inside a database transaction. The transaction logs are immediate and strongly consistent (`Read Committed`).
2. **Graph Synchronization (Eventual Consistency):**
   Once the PostgreSQL transaction succeeds, a background task is queued via RabbitMQ. This worker executes a Cypher transaction in Neo4j to replicate the state change. The target sync latency is less than 150ms. If the write fails, the worker retries using an exponential backoff strategy, preventing data drift.
3. **Semantic Vector Store (Eventual Consistency):**
   Documents are parsed and uploaded asynchronously. Text structures are mapped into PostgreSQL, and vector embeddings are pushed to Qdrant. The vector references use the corresponding PostgreSQL IDs. This ensures that any vector retrieved during a search query can be immediately joined with the correct PostgreSQL record to verify permissions and get the latest entity metadata.
4. **Graph-to-Vector Isolation:**
   Neo4j nodes representing documents store only metadata and their corresponding PostgreSQL/Qdrant IDs. If a document is updated, the vector is updated in Qdrant, the text metadata is updated in PostgreSQL, and the Neo4j edges are dynamically adjusted. This decoupled architecture prevents heavy document payloads from bogging down the graph database.

---

## 4. Twin Modules Specification

The Digital Twin Engine is the primary orchestrator that maintains the state of the enterprise. Rather than representing data as disconnected records in isolated databases, SentinelOS defines six core modules that are dynamically linked within the unified data fabric (PostgreSQL, Neo4j, and Qdrant).

```
                      +---------------------------------------+
                      |          DIGITAL TWIN ENGINE          |
                      +---------------------------------------+
                        /     |       |       |       \     \
                       /      |       |       |        \     \
                      v       v       v       v         v     v
                  [ Org ] [Employee] [Project] [Customer] [Process] [Financial]
```

---

### Module 4.1: Organization & Department Twin
This module maps the structural hierarchy, reporting lines, cost centers, and resource allocations of the entire enterprise. It defines the formal boundaries within which work occurs.

#### 4.1.1 Neo4j Graph Model: Node and Edge Specifications
The organization is represented as a tree structure of `Department` and `CostCenter` nodes, linked via directional management and reporting relationships.

```
(:Department {name: "Engineering"}) -[:REPORTS_TO]-> (:Department {name: "Executive Office"})
(:Department {name: "Engineering"}) -[:HAS_COST_CENTER]-> (:CostCenter {code: "CC-ENG-204"})
(:Employee {role: "VP"}) -[:HEADS]-> (:Department {name: "Engineering"})
```

##### Node: Department
*   **Properties:**
    *   `id` (UUID, String, Index): Unique identifier.
    *   `name` (String): e.g., "Engineering", "Sales", "Customer Success".
    *   `code` (String, Unique): e.g., "DEPT-ENG", "DEPT-SLS".
    *   `budget_limit_eur` (Float): Operational expense ceiling per fiscal year.
    *   `headcount_target` (Integer): Total headcount budget allocation.
    *   `last_modified_timestamp` (DateTime): Audit tracking.
*   **Relationships:**
    *   `[:REPORTS_TO]`: Directed edge pointing to the parent `Department` node.
    *   `[:HAS_COST_CENTER]`: Edge linking to one or more `CostCenter` nodes.
    *   `[:ALLOCATED_TO]`: Tracks resource dedication to specific corporate divisions.

##### Node: CostCenter
*   **Properties:**
    *   `code` (String, Unique, Index): e.g., "CC-ENG-RND", "CC-MKT-ADS".
    *   `name` (String): Friendly name.
    *   `allocated_funds` (Float): Current currency allocation.
    *   `spent_funds` (Float): Live expenditure drawn from PostgreSQL ledgers.
    *   `fiscal_year` (String): e.g., "FY26".
*   **Relationships:**
    *   `[:DRAWS_FROM]`: Connects expenditures to physical corporate bank accounts.

#### 4.1.2 PostgreSQL Relational Schema
The PostgreSQL relational layer enforces transactional consistency on budgets, cost tracking, and official metadata.

```sql
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    parent_id UUID REFERENCES departments(id),
    budget_limit_eur DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    headcount_target INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cost_centers (
    code VARCHAR(50) PRIMARY KEY,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    allocated_funds DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    spent_funds DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    fiscal_year VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.1.3 Synchronization Logic
*   **Source Systems:** Workday, BambooHR, ERP systems (SAP, NetSuite).
*   **Event Trigger:** A change in department composition, manager assignments, or budget limits pushes a webhook payload from the HRIS/ERP system to `/api/v1/sync/org`.
*   **Ingestion Pipeline:**
    1. The sync engine writes the modified record to PostgreSQL, acquiring a row lock on the affected department.
    2. A background Celery worker fetches the updated hierarchy tree.
    3. The worker executes a Cypher merge query in Neo4j to update nodes and recalculate the reporting paths:
       ```cypher
       MERGE (d:Department {code: $dept_code})
       SET d.name = $name, d.budget_limit_eur = $budget
       WITH d
       MATCH (parent:Department {code: $parent_code})
       MERGE (d)-[r:REPORTS_TO]->(parent)
       ```
    4. Cache updates: Clears any active Redis cache keys containing prefix `subgraph:org_structure:*`.

---

### Module 4.2: Employee Twin
The Employee Twin goes beyond static profiles to represent active skills, communication pathways, access logs, calendar schedules, and individual operational metrics.

```
                    +-----------------------+
                    |     EMPLOYEE TWIN     |
                    +-----------------------+
                     /    |     |      |    \
                    v     v     v      v     v
             [Profile] [Skills] [Comms] [Logs] [Access]
```

#### 4.2.1 Neo4j Graph Model: Node and Edge Specifications
The employee is positioned as the central execution node of the graph, connecting departments, files, projects, Slack channels, and code repositories.

```
(:Employee {email: "jane.doe@company.com"}) -[:MEMBER_OF]-> (:Department {code: "DEPT-ENG"})
(:Employee {email: "jane.doe@company.com"}) -[:HAS_SKILL {level: 5}]-> (:Skill {name: "Python"})
(:Employee {email: "jane.doe@company.com"}) -[:CONTRIBUTED_TO]-> (:Repository {name: "core-engine"})
```

##### Node: Employee
*   **Properties:**
    *   `id` (UUID, String, Index): Unique ID.
    *   `email` (String, Unique, Index): e.g., "jane.doe@company.com".
    *   `first_name` (String): Given name.
    *   `last_name` (String): Surname.
    *   `role_title` (String): e.g., "Principal Software Engineer".
    *   `status` (String): e.g., "Active", "Leave", "Terminated".
    *   `timezone` (String): e.g., "Europe/Berlin".
    *   `billable_rate_eur` (Float): Hourly internal resource cost calculation.
*   **Relationships:**
    *   `[:MEMBER_OF]`: Connects to `Department` nodes.
    *   `[:REPORTS_TO]`: Direct reporting edge pointing to another `Employee` node.
    *   `[:HAS_SKILL]`: Edge targeting a `Skill` node, carrying a `level` property (1-5 range) and `verified` flag.
    *   `[:INTERACTED_WITH]`: Weighted edge connecting to other `Employee` nodes, representing email/Slack contact frequency.
    *   `[:AUTHOR_OF]`: Links to documents, code commits, and project specifications.

##### Node: Skill
*   **Properties:**
    *   `name` (String, Unique, Index): e.g., "Rust", "SQLAlchemy", "Financial Modeling".
    *   `category` (String): e.g., "Programming Languages", "Domain Expertise".

#### 4.2.2 PostgreSQL Relational Schema
Ensures strict validation of employee attributes, login logs, security clearance flags, and resource billing accounts.

```sql
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_title VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
    billable_rate_eur DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    security_clearance_level VARCHAR(50) NOT NULL DEFAULT 'Level 1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_skills (
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    skill_level INT NOT NULL CHECK (skill_level BETWEEN 1 AND 5),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by UUID REFERENCES employees(id),
    PRIMARY KEY (employee_id, skill_name)
);

CREATE TABLE employee_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL, -- 'GitCommit', 'SlackMsg', 'CalendarMeet'
    source_system VARCHAR(100) NOT NULL, -- 'GitHub', 'Slack', 'GoogleCalendar'
    event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    payload JSONB NOT NULL
);
```

#### 4.2.3 Activity Feed & Communication Graph Aggregator
To build the dynamic `[:INTERACTED_WITH]` edge values, SentinelOS deploys a rolling window analysis script.
*   **Mechanism:**
    *   Every 4 hours, a cron job scans `employee_activity_logs` in PostgreSQL for the past 7 days.
    *   It calculates a weight score ($W$) between Employee $A$ and Employee $B$ using the formula:
        $$W = (1.0 \times S_{msg}) + (2.5 \times E_{mail}) + (5.0 \times M_{eet})$$
        where $S_{msg}$ is count of Slack DMs, $E_{mail}$ is direct emails exchanged, and $M_{eet}$ is number of shared calendar meetings.
    *   It updates the graph relationship database:
        ```cypher
        MERGE (a:Employee {id: $emp_a})
        MERGE (b:Employee {id: $emp_b})
        MERGE (a)-[r:INTERACTED_WITH]-(b)
        SET r.weight = $calculated_weight, r.last_updated = datetime()
        ```
    *   This communication graph allows the Strategy Agent to detect organizational silos, communication bottlenecks, and isolated teams.

---

### Module 4.3: Project & Dependency Twin
Tracks technical roadmap execution, issue management pipelines, developer progress, repository activity, and delivery timelines.

```
       [ Developer Commits ]
                 |
                 v
   +---------------------------+
   |   Project & Dependency    |
   |          Twin             |
   +---------------------------+
     /           |           \
    v            v            v
[Jira Tickets] [PRs/Commits] [Milestones]
```

#### 4.3.1 Neo4j Graph Model: Node and Edge Specifications
The project twin connects development tasks directly to physical architecture components, customer feedback, and delivery dependencies.

```
(:Project {name: "Core Gateway"}) -[:DEPENDS_ON]-> (:Project {name: "Auth Service"})
(:Project {name: "Core Gateway"}) -[:HAS_MILESTONE]-> (:Milestone {title: "Q3 Release"})
(:Milestone {title: "Q3 Release"}) -[:REQUIRES_TICKET]-> (:Ticket {key: "GATE-101"})
(:Employee {email: "jane.doe@company.com"}) -[:ASSIGNED_TO]-> (:Ticket {key: "GATE-101"})
```

##### Node: Project
*   **Properties:**
    *   `id` (UUID, String, Index): Unique ID.
    *   `name` (String, Index): Friendly name.
    *   `jira_project_key` (String, Unique): e.g., "GATE", "INFRA".
    *   `health_score` (Float): Dynamically calculated score from 0.0 (Failed) to 1.0 (Healthy).
    *   `target_completion_date` (Date): Planned delivery target.
*   **Relationships:**
    *   `[:DEPENDS_ON]`: Directed edge indicating dependencies between projects.
    *   `[:HAS_MILESTONE]`: Links to critical path targets (`Milestone` nodes).

##### Node: Ticket
*   **Properties:**
    *   `key` (String, Unique, Index): e.g., "GATE-101", "INFRA-4509".
    *   `title` (String): Brief summary.
    *   `status` (String): e.g., "To Do", "In Progress", "Code Review", "Done".
    *   `story_points` (Integer): Estimated complexity.
    *   `priority` (String): e.g., "Low", "Medium", "High", "Critical".
    *   `ticket_type` (String): e.g., "Bug", "Feature", "Technical Debt".
*   **Relationships:**
    *   `[:ASSIGNED_TO]`: Connects to target `Employee` node.
    *   `[:BLOCKS]`: Directed edge pointing to another `Ticket` node.
    *   `[:ASSOCIATED_WITH]`: Connects the ticket to a specific file or codebase module.

#### 4.3.2 PostgreSQL Relational Schema
Enforces constraints on development states, status tracking, sprints, and code commits.

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    jira_project_key VARCHAR(50) UNIQUE NOT NULL,
    health_score DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
    target_completion_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    ticket_key VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    story_points INT DEFAULT 0,
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
    ticket_type VARCHAR(50) NOT NULL DEFAULT 'Feature',
    assigned_employee_id UUID REFERENCES employees(id),
    target_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE git_commits (
    sha VARCHAR(40) PRIMARY KEY,
    author_email VARCHAR(255) NOT NULL,
    commit_message TEXT NOT NULL,
    branch VARCHAR(100) NOT NULL,
    files_changed JSONB NOT NULL, -- List of paths and change counts
    committed_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

#### 4.3.3 Project Slippage & Impact Predictor
SentinelOS utilizes a graph-based traversal algorithm to detect risk factors.
*   **Risk Engine Logic:**
    1. If a developer logs a delay, the sync engine updates the `target_date` of the specific ticket in PostgreSQL.
    2. A triggers task starts the **Forecast Agent**, which queries Neo4j for downstream impacts:
       ```cypher
       MATCH (t:Ticket {key: $ticket_key})-[:BLOCKS*1..5]->(blocked:Ticket)
       MATCH (blocked)-[:PART_OF]->(m:Milestone)<-[:HAS_MILESTONE]-(p:Project)
       MATCH (p)-[:REQUIRED_BY]->(c:Customer)
       RETURN blocked.key, blocked.status, m.title, p.name, c.name
       ```
    3. The Forecast Agent computes the risk probability using historical team velocity calculations stored in Postgres. If the delay pushes a ticket's projected delivery beyond its milestone target date, the engine calculates a **Milestone Risk Metric** ($RM_{score}$):
       $$RM_{score} = \text{Delay Days} \times \text{Story Points of Blocked Node} \times C_{weight}$$
       where $C_{weight}$ is the criticality coefficient based on the number of blocked downstream edges.
    4. High-risk exceptions ($RM_{score} > 15.0$) are recorded to the active PostgreSQL database, triggering a WebSocket notification to the team lead's dashboard.

---

### Module 4.4: Customer & Support Twin
Integrates CRM datasets, support desks, interaction histories, and churn threat matrix indicators.

```
                    +-----------------------+
                    | CUSTOMER SUPPORT TWIN |
                    +-----------------------+
                     /    |     |      |    \
                    v     v     v      v     v
             [CRM Data] [Tickets] [Chats] [Contracts] [Risk]
```

#### 4.4.1 Neo4j Graph Model: Node and Edge Specifications
Links customer accounts directly to contract documents, active CSM assignments, support tickets, and specific engineering platforms.

```
(:Customer {name: "Acme Corp"}) -[:HAS_CONTRACT]-> (:Contract {id: "CONT-902"})
(:Customer {name: "Acme Corp"}) -[:HAS_SUPPORT_TICKET]-> (:SupportTicket {id: "ST-889"})
(:SupportTicket {id: "ST-889"}) -[:REFERRED_TO]-> (:Ticket {key: "GATE-101"})
(:Employee {role: "CSM"}) -[:MANAGES]-> (:Customer {name: "Acme Corp"})
```

##### Node: Customer
*   **Properties:**
    *   `id` (UUID, String, Index): Unique ID.
    *   `name` (String, Index): Customer name.
    *   `domain` (String, Unique): e.g., "acme.com".
    *   `tier` (String): e.g., "Enterprise", "Mid-Market", "Strategic".
    *   `arr_eur` (Float): Annual Recurring Revenue value.
    *   `churn_risk_level` (String): "Low", "Medium", "High", "Critical".
*   **Relationships:**
    *   `[:HAS_CONTRACT]`: Links to specific document node representing terms.
    *   `[:MANAGES]`: Connects to `Employee` (Customer Success Manager).
    *   `[:HAS_SUPPORT_TICKET]`: Links to active support events (`SupportTicket` nodes).

##### Node: SupportTicket
*   **Properties:**
    *   `id` (String, Unique, Index): e.g., "ZENDESK-4560".
    *   `subject` (String): Ticket subject line.
    *   `sentiment_score` (Float): Value from -1.0 (Angry) to +1.0 (Positive).
    *   `status` (String): e.g., "Open", "Pending", "On Hold", "Closed".
    *   `created_at_timestamp` (DateTime): Creation timestamp.
*   **Relationships:**
    *   `[:REFERRED_TO]`: Connects support tickets to engineering bugs (`Ticket` nodes).

#### 4.4.2 PostgreSQL Relational Schema
Validates CRM transactions, contract limits, legal clauses, and SLA terms.

```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) UNIQUE NOT NULL,
    tier VARCHAR(50) NOT NULL DEFAULT 'Mid-Market',
    arr_eur DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    churn_risk_level VARCHAR(50) NOT NULL DEFAULT 'Low',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contracts (
    id VARCHAR(100) PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    document_hash VARCHAR(64) NOT NULL, -- Links to Qdrant/MinIO file reference
    signed_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    sla_response_time_hours INT NOT NULL DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE support_tickets (
    id VARCHAR(100) PRIMARY KEY, -- Source CRM ticket key
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    sentiment_score DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL,
    sla_due_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.4.3 Churn Warning Model
The Customer Success Agent monitors interaction patterns to flag accounts at risk of churning.
*   **Trigger Events:**
    *   A support ticket's `sentiment_score` drops below -0.5.
    *   The total number of open bugs linked to a strategic customer account via `[:REFERRED_TO]` exceeds 3.
    *   Activity logs show no communication (Slack, Email) between the CSM and the customer contact for more than 30 consecutive days.
*   **Dynamic Churn Score Formula:**
    $$Churn_{prob} = (S_{avg} \times -0.4) + (B_{count} \times 0.15) + (Days_{silent} \times 0.01) + (SLA_{breached} \times 0.2)$$
    where $S_{avg}$ is the rolling sentiment score, $B_{count}$ is the count of linked engineering bugs, $Days_{silent}$ is the time since last contact, and $SLA_{breached}$ is a binary flag (0 or 1) indicating if any SLA agreements have been violated in the past month.
*   **Remediation Loop:**
    *   If $Churn_{prob} > 0.65$, the Customer Success Agent flags the account as "High" churn risk in PostgreSQL.
    *   The agent queries Neo4j to find the exact engineering tickets blocking the customer:
        ```cypher
        MATCH (c:Customer {id: $customer_id})-[:HAS_SUPPORT_TICKET]->(st:SupportTicket)-[:REFERRED_TO]->(t:Ticket)
        WHERE t.status <> 'Done'
        RETURN t.key, t.title, t.assigned_employee_id
        ```
    *   The agent drafts a Slack alert to the account CSM containing the details of the blocking tickets, their current assignees, and a recommended resolution plan.

---

### Module 4.5: Process & Risk Twin
Maps standard operating procedures (SOPs), workflows, system bottlenecks, and compliance drifts.

```
       [ SOP Guidelines ]
               |
               v
  +-------------------------+
  |  Process & Risk Twin    |
  +-------------------------+
    /                     \
   v                       v
[Workflows]          [Compliance]
```

#### 4.5.1 Neo4j Graph Model: Node and Edge Specifications
Represents standard operating processes as sequences of steps, capturing execution latencies, owner assignments, and potential risk indicators.

```
(:SOP {title: "Employee Onboarding"}) -[:HAS_STEP {sequence: 1}]-> (:ProcessStep {name: "Create Keycloak Account"})
(:ProcessStep {name: "Create Keycloak Account"}) -[:NEXT_STEP]-> (:ProcessStep {name: "Provision Laptop"})
(:ProcessStep {name: "Provision Laptop"}) -[:EXHAUSTS_BUDGET]-> (:CostCenter {code: "CC-ENG-RND"})
(:ProcessStep {name: "Provision Laptop"}) -[:RISK_ASSOCIATED]-> (:RiskFactor {type: "Supply Chain Delay"})
```

##### Node: SOP (Standard Operating Procedure)
*   **Properties:**
    *   `id` (UUID, String, Index): Unique ID.
    *   `title` (String): e.g., "Customer Data Export Security Protocol".
    *   `version` (String): e.g., "v2.1".
    *   `regulatory_body` (String): e.g., "GDPR", "SOC2-CC6".
*   **Relationships:**
    *   `[:HAS_STEP]`: Links to the initial step in the workflow process.

##### Node: ProcessStep
*   **Properties:**
    *   `id` (UUID, String, Index): Unique ID.
    *   `name` (String): Action name.
    *   `avg_duration_seconds` (Float): Dynamic target duration calculated from historical execution runs.
    *   `failure_rate` (Float): Ratio of executions that failed or timed out.
*   **Relationships:**
    *   `[:NEXT_STEP]`: Points to the downstream action step in the workflow sequence.
    *   `[:RISK_ASSOCIATED]`: Connects to `RiskFactor` nodes.

##### Node: RiskFactor
*   **Properties:**
    *   `id` (UUID, String, Index): Unique ID.
    *   `type` (String): e.g., "Single Point of Failure", "Compliance Breach", "Cost Overrun".
    *   `impact_severity` (String): e.g., "Low", "Medium", "High", "Critical".
    *   `mitigation_strategy` (String): Structured textual mitigation instruction.

#### 4.5.2 PostgreSQL Relational Schema
Stores live execution tracking logs, showing who ran which step, when, and if any compliance rules were violated.

```sql
CREATE TABLE sops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL DEFAULT '1.0',
    regulatory_body VARCHAR(100) NOT NULL DEFAULT 'None',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE process_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sop_id UUID REFERENCES sops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sequence_order INT NOT NULL,
    avg_duration_seconds DOUBLE PRECISION DEFAULT 0.0,
    failure_rate DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE process_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sop_id UUID REFERENCES sops(id),
    executor_employee_id UUID REFERENCES employees(id),
    status VARCHAR(50) NOT NULL DEFAULT 'Running', -- 'Running', 'Completed', 'Failed'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE step_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID REFERENCES process_executions(id) ON DELETE CASCADE,
    step_id UUID REFERENCES process_steps(id),
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);
```

#### 4.5.3 Compliance Drift & SOP Violation Detection
The Legal & Operations Agents monitor process step executions against the graph definition of the SOP to detect deviations or bottlenecks.
*   **Compliance Violation Triggers:**
    *   **Out-of-Order Execution:** An execution records a `step_execution` transaction where $Step_C$ is completed before its predecessor $Step_B$ is started in the Neo4j sequential path.
    *   **Permission Mismatch:** A step marked as requiring a specific permission level is executed by an employee who does not possess that security clearance flag in PostgreSQL.
    *   **Duration SLA Breach:** A step's duration exceeds the defined maximum threshold ($avg\_duration \times 3$).
*   **Remediation Protocol:**
    *   When a violation occurs, the system flags the execution record as `Non-Compliant`.
    *   The Legal Agent performs a graph traversal to construct an audit trail:
        ```cypher
        MATCH (sop:SOP)-[:HAS_STEP]->(step:ProcessStep {id: $step_id})
        MATCH (step)-[:RISK_ASSOCIATED]->(r:RiskFactor)
        RETURN sop.title, sop.regulatory_body, r.type, r.impact_severity, r.mitigation_strategy
        ```
    *   The agent registers the compliance incident in the system, alerts the department head via email, and attaches the required mitigation instructions.

---

### Module 4.6: Financial Twin
Maintains records of budgets, operating expenditures (OpEx), cost of goods sold (COGS), margins, and projected run-rates.

```
                    +-----------------------+
                    |     FINANCIAL TWIN    |
                    +-----------------------+
                     /    |     |      |    \
                    v     v     v      v     v
             [Ledger] [OpEx] [COGS] [Runrate] [Forecast]
```

#### 4.6.1 Neo4j Graph Model: Node and Edge Specifications
Connects financial cost centers directly to team resources, software components, customer revenue accounts, and project development milestones.

```
(:CostCenter {code: "CC-ENG-RND"}) -[:CHARGED_BY]-> (:ExpenseRecord {id: "EXP-990"})
(:ExpenseRecord {id: "EXP-990"}) -[:FUNDED_PROJECT]-> (:Project {name: "Project Alpha"})
(:Customer {name: "Acme Corp"}) -[:GENERATES_REVENUE]-> (:RevenueStream {source: "SaaS Subscription"})
(:RevenueStream {source: "SaaS Subscription"}) -[:ALLOCATED_TO]-> (:CostCenter {code: "CC-CORP-FIN"})
```

##### Node: ExpenseRecord
*   **Properties:**
    *   `id` (String, Unique, Index): e.g., "EXP-990", "INVOICE-0034".
    *   `amount_eur` (Float): Absolute expense value.
    *   `category` (String): e.g., "Infrastructure Cloud", "Software License", "Contractor Fee".
    *   `effective_date` (Date): Transaction date.
*   **Relationships:**
    *   `[:CHARGED_BY]`: Links the expense record to a specific `CostCenter`.
    *   `[:FUNDED_PROJECT]`: Links the spending to the project that consumed the resources.

##### Node: RevenueStream
*   **Properties:**
    *   `id` (UUID, String, Index): Unique ID.
    *   `source` (String): e.g., "Strategic SaaS", "Professional Services".
    *   `monthly_value_eur` (Float): Current Monthly Recurring Revenue (MRR).
    *   `confidence_score` (Float): Value from 0.0 to 1.0 based on contract expiration and customer health.
*   **Relationships:**
    *   `[:ALLOCATED_TO]`: Connects revenue streams to corporate financial accounts.

#### 4.6.2 PostgreSQL Relational Schema
Stores transactional ledgers, general account budgets, and dynamic run-rate forecasts.

```sql
CREATE TABLE financial_ledgers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_reference VARCHAR(100) UNIQUE NOT NULL,
    cost_center_code VARCHAR(50) REFERENCES cost_centers(code),
    amount_eur DECIMAL(15, 2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'Credit' (Revenue), 'Debit' (Expense)
    category VARCHAR(150) NOT NULL,
    posted_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE monthly_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cost_center_code VARCHAR(50) REFERENCES cost_centers(code),
    forecast_month DATE NOT NULL,
    projected_opex DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    projected_revenue DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    actual_opex DECIMAL(15, 2) DEFAULT 0.00,
    actual_revenue DECIMAL(15, 2) DEFAULT 0.00,
    model_confidence_score DECIMAL(3, 2) NOT NULL DEFAULT 1.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.6.3 Financial Run-Rate Simulator & Forecast Module
The Finance Agent monitors monthly expenditures in the relational database to update cash flow projections.
*   **Forecasting Loop:**
    1. A cron job triggers the **Finance Agent** on the first day of each month.
    2. The agent queries PostgreSQL to calculate actual vs. projected OpEx and revenue for the previous month.
    3. The agent queries Neo4j to find projects that are delayed, mapping them to billing resources and associated customer revenue:
       ```cypher
       MATCH (p:Project {health_score: $low_score})-[:REQUIRED_BY]->(c:Customer)
       MATCH (c)-[:GENERATES_REVENUE]->(rev:RevenueStream)
       RETURN p.name, c.name, rev.monthly_value_eur
       ```
    4. The agent updates future projections using a rolling linear regression model:
       $$\text{Projected OpEx}_{t+1} = \text{Base OpEx} + \sum (\text{Delay Hours}_i \times \text{Resource Rate}_i) + \text{Cloud Burst Overrun}$$
    5. The resulting projections are written to `monthly_forecasts` in PostgreSQL, highlighting cost overruns or revenue drops for executive review.

---

## 5. Knowledge Graph (Neo4j) Deep-Dive

SentinelOS models the corporate structure inside Neo4j to allow AI agents to navigate relationships and trace dependencies across different divisions.

```
       [ Employee ] -------( AUTHOR_OF )-------> [ Document ]
            |                                         |
        (MEMBER_OF)                            (ASSOCIATED_WITH)
            |                                         |
            v                                         v
      [ Department ] <-----( ALLOCATED_TO )------ [ Project ]
```

---

### 5.1 Graph Schema and Node Properties
To maintain data structure consistency, we define strict constraints on nodes and their fields within the database:

| Node Label | Property Key | Data Type | Constraint / Index | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Employee** | `id` | String (UUID) | Unique Constraint | Unique system identifier |
| | `email` | String | Unique Constraint, Text Index | Corporate email address |
| | `role_title` | String | Text Index | Official job title |
| **Department** | `code` | String | Unique Constraint | e.g. "DEPT-ENG", "DEPT-FIN" |
| | `name` | String | None | Department name |
| **Project** | `id` | String (UUID) | Unique Constraint | Unique system identifier |
| | `jira_project_key`| String | Unique Constraint | Linked Jira project key |
| **Ticket** | `key` | String | Unique Constraint, Text Index | ticket identifier e.g. "GATE-101" |
| **Document** | `hash` | String (SHA256) | Unique Constraint | Content hash for deduplication |
| | `minio_uri` | String | None | S3 storage location |
| **Customer** | `domain` | String | Unique Constraint | Domain name for corporate identification |

---

### 5.2 Graph Edge Definitions and Semantics
Edges within SentinelOS carry directional relationships and custom properties to track state changes over time:

1. `(Employee)-[:MEMBER_OF {since: Date}]->(Department)`
   * *Semantic:* Represents an employee's organizational allocation.
2. `(Employee)-[:REPORTS_TO {type: "Direct"|"Indirect"}]->(Employee)`
   * *Semantic:* Maps the direct reporting structure.
3. `(Employee)-[:AUTHOR_OF {timestamp: DateTime}]->(Document)`
   * *Semantic:* Tracks who created or uploaded a document.
4. `(Employee)-[:INTERACTED_WITH {weight: Float, last_updated: DateTime}]->(Employee)`
   * *Semantic:* Captures the frequency and strength of communication channels.
5. `(Project)-[:DEPENDS_ON {criticality: "High"|"Medium"|"Low"}]->(Project)`
   * *Semantic:* Maps project delivery dependencies.
6. `(SupportTicket)-[:REFERRED_TO {sentiment: Float}]->(Ticket)`
   * *Semantic:* Links customer support issues to engineering tickets.
7. `(Document)-[:ASSOCIATED_WITH]->(Project)`
   * *Semantic:* Connects technical documents, contracts, or policies to specific projects.

---

### 5.3 Complex Query Scenarios and Impact Analysis
The power of Neo4j is showcased in multi-hop query analysis, which helps the CEO and department heads trace the downstream impact of unexpected delays.

#### Scenario 1: Tracing the impact of a project delay on customer churn
If an engineering team reports a delay on a core component, the CEO can use this query to identify which strategic customer contracts are at risk:
```cypher
MATCH (target_proj:Project {name: $delayed_project_name})
MATCH (target_proj)-[:REQUIRED_BY*1..3]->(downstream_proj:Project)
MATCH (downstream_proj)-[:REQUIRED_BY]->(cust:Customer)
MATCH (cust)-[:HAS_CONTRACT]->(cont:Contract)
RETURN DISTINCT 
    cust.name AS CustomerName, 
    cust.arr_eur AS RevenueAtRisk, 
    cont.expiration_date AS ContractExpiration,
    downstream_proj.name AS BlockedDeliverable
ORDER BY RevenueAtRisk DESC
```

#### Scenario 2: Identifying single points of failure in organizational communication
This query identifies employees who act as critical communication bridges between different departments, representing potential operational bottlenecks:
```cypher
MATCH (e1:Employee)-[r1:INTERACTED_WITH]->(bridge:Employee)-[r2:INTERACTED_WITH]->(e2:Employee)
MATCH (e1)-[:MEMBER_OF]->(d1:Department)
MATCH (e2)-[:MEMBER_OF]->(d2:Department)
WHERE d1.code <> d2.code AND bridge.status = "Active"
WITH bridge, count(DISTINCT d1.code) AS connecting_depts
WHERE connecting_depts >= 3
RETURN bridge.email AS ContactEmail, bridge.role_title AS Title, connecting_depts AS DepartmentsConnected
```

---

## 6. Database & RAG Architecture

```
        +-------------------------------------------------------------+
        |                    INGESTION PLATFORM                       |
        +-------------------------------------------------------------+
               |                                            |
               v                                            v
     [ Raw PDFs / Docx ]                            [ API Ingress ]
               |                                            |
               v (Docling / PyMuPDF)                        |
     [ Clean Markdown Chunks ]                              |
               |                                            |
               v (BAAI BGE-M3 Embedder)                     v
      +-----------------+                    +------------------------------+
      |  Qdrant Database|                    |    PostgreSQL Database       |
      |  Vector Records |                    |  Relational Audit & Security |
      +-----------------+                    +------------------------------+
```

---

### 6.1 Relational Database Design (PostgreSQL)
PostgreSQL handles transaction security, user credentials, relational metrics, activity history, and granular security role definitions.

#### Core Relational DDL with Optimization Indexes
To ensure fast retrieval and strict schema constraints, the core tables are defined as follows:
```sql
-- Enable extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Document Ingestion Metadata Tracker
CREATE TABLE document_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(512) NOT NULL,
    file_size_bytes INT NOT NULL,
    sha256_hash VARCHAR(64) UNIQUE NOT NULL,
    minio_path VARCHAR(1024) NOT NULL,
    security_clearance_level VARCHAR(50) NOT NULL DEFAULT 'Level 1',
    uploader_id UUID NOT NULL, -- references employees(id)
    ingested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast deduplication checks and permission validations
CREATE INDEX idx_doc_sha256 ON document_metadata(sha256_hash);
CREATE INDEX idx_doc_clearance ON document_metadata(security_clearance_level);

-- Global Search Entity Cache table (Meilisearch sync target)
CREATE TABLE global_search_entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(100) NOT NULL, -- 'Employee', 'Project', 'Customer', 'Ticket', 'Document'
    entity_ref_id UUID NOT NULL,
    title VARCHAR(512) NOT NULL,
    description TEXT,
    indexed_data JSONB NOT NULL,
    last_synchronized_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_entity_type ON global_search_entities(entity_type);
CREATE INDEX idx_search_jsonb_data ON global_search_entities USING gin (indexed_data);
```

---

### 6.2 Vector Database Design (Qdrant)
Qdrant is designed for sub-second vector search across multi-tenant contexts. We isolate data using metadata payload filters.

#### Collection Configuration
*   **Collection Name:** `sentinel_enterprise_knowledge`
*   **Vector Configuration:**
    *   `size`: 1024 dimensions (optimized for `text-embedding-3-large` or `BAAI/bge-m3`).
    *   `distance`: Cosine similarity.
*   **Indexing Strategy:**
    *   Payload indexes configured on fields: `tenant_id`, `security_clearance_level`, and `document_id`.

```json
{
  "vectors": {
    "size": 1024,
    "distance": "Cosine"
  },
  "hnsw_config": {
    "m": 16,
    "ef_construct": 100
  }
}
```

#### Payload Metadata Format
Each vector record written to Qdrant contains the following payload format:
```json
{
  "document_id": "8a7c9d2f-1234-5678-abcd-ef0123456789",
  "chunk_index": 14,
  "security_clearance_level": "Level 2",
  "text_content": "Section 4.1: The operational budget for Project Alpha is capped at EUR 450,000. Under no circumstances may development overhead exceed 65% of this allocation.",
  "associated_entities": {
    "projects": ["Project Alpha"],
    "cost_centers": ["CC-ENG-RND"]
  },
  "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

---

### 6.3 Ingestion Pipeline (RAG)
The ingestion pipeline converts unstructured files (PDF contracts, meeting transcripts, slide presentations) into search-ready vector structures.

```
                  +--------------------------------+
                  |      INGESTION PIPELINE        |
                  +--------------------------------+
                                   |
                                   v
             [ PDF File Uploaded (inotify / API Gateway) ]
                                   |
                                   v
               [ Structure Parser: Docling / PyMuPDF ]
                                   |
                     +-------------+-------------+
                     |                           |
                     v                           v
             [ Extract Images ]          [ Extract Hierarchy ]
                     |                           |
                     v                           v
              (PaddleOCR Engine)          (Headers, Tables)
                     |                           |
                     +-------------+-------------+
                                   |
                                   v
                      [ Semantic Chunking Engine ]
                                   |
                                   v
                     [ Vectorizer: BGE-M3 Embedder ]
                                   |
                                   v
                       [ Save to Qdrant & PG ]
```

1. **Host-Level File Watching:**
   On our deployment server, a systemd script runs a Linux `inotify` watcher that monitors directory folder path `/data/raw_ingress/`.
   When a new PDF file is dropped in:
   * It detects `IN_CLOSE_WRITE` event.
   * Invokes `/opt/sentinel/bin/parse_ingress.sh` passing the file path.
2. **Layout-Aware Extraction:**
   * **Docling & PyMuPDF** analyze the document's structure, identifying page breaks, structural headers, footnotes, and data tables.
   * If a document page contains embedded charts or images, **PaddleOCR** extracts text blocks, maintaining structural positioning.
3. **Semantic Chunking Strategy:**
   Instead of basic character-count chunking, SentinelOS splits documents based on structural changes. Chunks are broken at header boundaries (`#`, `##`, `###`), keeping sentences intact.
   * **Target Chunk Size:** 400 tokens.
   * **Overlapping Buffer:** 100 tokens.
   * **Metadata Inheritance:** Each chunk inherits the document's parent ID, security clearance tags, and creation dates.

---

### 6.4 Retrieval: Hybrid Search and Re-Ranking
To maximize retrieval accuracy, SentinelOS combines keyword matching with semantic vector search in a hybrid retrieval model:

```
                             [ User Prompt Query ]
                                       |
                     +-----------------+-----------------+
                     |                                   |
                     v                                   v
             [ Dense Retriever ]                 [ Sparse Retriever ]
             (Qdrant Vector Run)                 (PostgreSQL BM25)
                     |                                   |
                     +-----------------+-----------------+
                                       |
                                       v
                             [ Candidate Merging ]
                                       |
                                       v
                            [ Cohere Rerank Model ]
                                       |
                                       v
                          [ Top-5 Context Payload ]
```

1. **Retrieval Phase:**
   * **Dense Retrieval (Semantic Search):** Queries Qdrant using the user prompt vector to find the top 20 candidate chunks based on cosine similarity.
   * **Sparse Retrieval (Keyword Search):** Queries PostgreSQL utilizing `BM25` full-text search indices on matching text contents to retrieve another 20 candidate chunks.
2. **Candidate Merging:**
   * Candidates are merged and deduplicated based on text content hashes.
3. **Re-Ranking Pipeline:**
   * The combined candidates are sent to the **Cohere Rerank** model (`rerank-multilingual-v3.0`).
   * The reranker returns the top 5 chunks with the highest relevance scores.
   * **Filtering:** Chunks with relevance scores below 0.65 are discarded to prevent hallucination.

---

### 6.5 Redis Cache Architecture
SentinelOS utilizes Redis to manage session states, track active agent memory, and cache frequently executed graph paths.

```
       [ Request Client ]
               |
               v
     +-------------------+
     |   Redis Cache     |  -- (Hits returned in <2ms)
     +-------------------+
               |
               v (Miss)
     +-------------------+
     |  DB / Agent Tier  |
     +-------------------+
```

#### Key Layout Definitions
1. **User Sessions Cache:**
   * `session:user_id:<uuid>` -> JSON payload of user profile data and security roles (TTL: 1 hour).
2. **Graph Structure Cache:**
   * `subgraph:org_structure:dept_code:<code_string>` -> Compressed JSON representation of department hierarchies (TTL: 24 hours, invalidated on `/api/v1/sync/org` payload writes).
3. **Agent Conversation Workspace Memory:**
   * `agent_memory:conversation_id:<uuid>` -> Serialized LangGraph state updates and recent system message arrays (TTL: 72 hours).
4. **Rate Limiting Tracker:**
   * `rate_limit:user_id:<uuid>:minute` -> Request count integer (TTL: 60 seconds).

---

## 7. Agent Framework (LangGraph + PydanticAI)

SentinelOS runs its cognitive layer on a multi-agent system built using **LangGraph** (for stateful workflow management) and **PydanticAI** (for structured data interfaces).

```
  [ Input Prompt ] 
         |
         v
  [ LLM Router ] ---> (Routing Decisions: Task Type, Cost, Token Count)
         |
         +--------------+---------------+
         | (Fast/Cheap)                 | (Complex/Reasoning)
         v                              v
   [ Gemini 1.5 Flash ]          [ GPT-4o / Claude 3.5 Sonnet ]
         |                              |
         +--------------+---------------+
                        |
                        v
          [ LangGraph Stateful Loop ]
            - Memory Updates (Redis)
            - Tool Calls (MCP Connectors)
            - Human-in-the-Loop Interruption
```

---

### 7.1 LangGraph State Machines and Execution Loops
Every agent interaction in SentinelOS runs within a stateful graph where nodes represent computational steps or LLM calls, and edges determine the control flow.

#### State Schema Blueprint
The state object persists across graph transitions and is defined in Python using Pydantic:
```python
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class AgentState(BaseModel):
    conversation_id: str = Field(..., description="Unique thread identifier")
    current_agent: str = Field("CEOAgent", description="Active executor node")
    user_context: Dict[str, Any] = Field(default_factory=dict, description="User roles and permissions")
    query_text: str = Field(..., description="Original user prompt")
    retrieved_contexts: List[str] = Field(default_factory=list, description="Vector RAG chunks")
    extracted_graph_nodes: List[Dict[str, Any]] = Field(default_factory=list, description="Neo4j sub-graph nodes")
    plan_steps: List[str] = Field(default_factory=list, description="Dynamic execution plan steps")
    completed_steps: List[str] = Field(default_factory=list, description="Steps completed so far")
    intermediate_results: Dict[str, Any] = Field(default_factory=dict, description="Outputs from tool execution")
    agent_history: List[Dict[str, str]] = Field(default_factory=list, description="Conversation log history")
    pending_approvals: List[Dict[str, Any]] = Field(default_factory=list, description="Tasks awaiting human verification")
```

#### Graph Control Flow and Conditional Routing
1. **Node Evaluation:**
   * Nodes represent specific operations (e.g., `retrieve_rag_context`, `query_graph_engine`, `run_reasoning_loop`, `execute_tool`).
2. **Conditional Edges:**
   * After a node runs, a router function inspects the state. If tool execution is needed, it routes to `execute_tool`. If reasoning is complete, it routes to `format_final_response`.
   * **Cypher Router Logic:**
     ```python
     def router_decision_edge(state: AgentState) -> str:
         if len(state.pending_approvals) > 0:
             return "human_approval_gate"
         if not state.plan_steps:
             return "generate_plan"
         if len(state.completed_steps) < len(state.plan_steps):
             return "execute_next_step"
         return "finalize_output"
     ```

---

### 7.2 Human-in-the-Loop Validation Gateways
To prevent agents from executing unauthorized actions (e.g., deleting a database record, modifying a budget ledger, emailing a customer directly, merging a broken pull request), SentinelOS implements strict transaction gates.

```
       [ Tool Execution Requires Approval ]
                        |
                        v
            (State Interrupted / Paused)
                        |
            [ Save State to Postgres WAL ]
                        |
             (Emit WebSocket Alert)
                        |
               [ Await User Input ]
             /                      \
      [ Approved ]              [ Rejected ]
           |                         |
     (Resume Execution)        (Rollback & Cancel)
```

1. **State Interruption:**
   * Any tool decorated with `@action_gate_required` automatically pauses the LangGraph execution thread, preventing the next transition.
2. **State Serialization:**
   * The current `AgentState` object is written to the PostgreSQL audit log database as a pending transaction.
3. **Real-time Alerting:**
   * The system sends a WebSocket message containing the payload details to the user dashboard.
4. **Approval Processing:**
   * **If Approved:** The user clicks "Approve" in the UI. The API updates the state in PostgreSQL, signaling the thread to resume execution.
   * **If Rejected:** The thread is terminated. The **Operations Agent** executes rollbacks (e.g., reverting relational database writes or releasing locks) to ensure state integrity.

---

### 7.3 PydanticAI Interface Contracts
To guarantee type safety and prevent schema validation errors between agents, we define strict interface models using PydanticAI:

```python
from pydantic_ai import Agent
from pydantic import BaseModel, Field

# Define structured output schema for the Strategic Risk assessment tool
class StrategicAssessmentSchema(BaseModel):
    primary_risk_category: str = Field(..., description="e.g., Compliance, Financial, Operational")
    risk_level_score: float = Field(..., description="Calculated metric between 0.0 and 1.0")
    identified_bottlenecks: list[str] = Field(..., description="List of blocking elements or resources")
    financial_impact_estimate_eur: float = Field(..., description="Projected maximum financial loss")
    recommended_mitigations: list[str] = Field(..., description="Step-by-step mitigation plan")

assessment_agent = Agent(
    'openai:gpt-4o',
    result_type=StrategicAssessmentSchema,
    system_prompt="Analyze the company subgraph and return a structured risk report."
)
```

#### Validation Error Handling & Automatic Retries
If the model output fails schema validation:
1. PydanticAI catches the `ValidationError`.
2. The error message is appended to the prompt history.
3. The query is retried, prompting the model to correct the specific fields (maximum 3 retries before flagging an execution failure).

---

### 7.4 LLM Router Engine
Instead of hard-coding a single LLM provider, SentinelOS uses an intelligent router to select the optimal model for each step, balancing cost, speed, context size, and reasoning complexity.

| Model | Target Task Type | Context Limit | Input Cost / M | Output Cost / M | Selection Rule |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gemini 1.5 Flash** | Classification, simple extraction, routing | 1M tokens | $0.075 | $0.30 | Default model for routing and structured text parsing |
| **GPT-4o** | SQL Generation, complex RAG synthesis | 128k tokens | $2.50 | $10.00 | Selected for relational database query creation and multi-agent coordination |
| **Claude 3.5 Sonnet** | Code analysis, software architecture modeling | 200k tokens | $3.00 | $15.00 | Selected for codebase parsing and git commit assessments |
| **DeepSeek-R1** | Complex strategic planning, simulation logic | 128k tokens | $0.55 | $2.19 | Selected for Monte Carlo runs and multi-variable forecasting |
| **Local Llama-3-70B** | Sovereign deployments, offline compliance checks | 8k tokens | Self-hosted | Self-hosted | Default model for air-gapped on-premise configurations |

#### Routing Rule Engine
The router uses a rule engine to select the best model for each query:
```
IF (query requires complex mathematical reasoning OR multi-step logic simulation)
    THEN ROUTE to DeepSeek-R1
ELSE IF (query requires parsing a codebase OR multi-file diff assessment)
    THEN ROUTE to Claude 3.5 Sonnet
ELSE IF (token length of input files > 100,000)
    THEN ROUTE to Gemini 1.5 Flash
ELSE
    THEN ROUTE to GPT-4o
```

---

## 8. Multi-Agent Hierarchy

SentinelOS runs on a three-tier agent architecture, ensuring clean boundaries between high-level strategies, department actions, and specialist tool executions.

```
                         [ EXECUTIVE LAYER ]
                       (CEO & Strategy Agents)
                                  |
         +------------------------+------------------------+
         |                                                 |
         v                                                 v
 [ DEPARTMENT LAYER ]                             [ SPECIALIST LAYER ]
(Finance, HR, Eng, Sales, CSM)                 (SQL, Email, GitHub, Search)
```

---

### 8.1 Executive Layer

#### 8.1.1 CEO Agent
*   **Role:** Oversees the multi-agent system, translates strategic objectives into tasks, and coordinates cross-departmental operations.
*   **Allowed Tools:**
    *   `delegate_task_to_agent(target_agent, task_description)`
    *   `request_executive_summary()`
    *   `broadcast_system_announcement()`
*   **Memory Scope:** Full global read/write access to organizational records, financials, and project states.

#### 8.1.2 Strategy Agent
*   **Role:** Runs simulations, performs what-if analyses, and alerts stakeholders to operational risks.
*   **Allowed Tools:**
    *   `query_simulation_engine(variables, target_metrics)`
    *   `calculate_downstream_impacts(entity_id)`
*   **System Prompt Guidelines:** Focus on long-term implications, budget constraints, SLA compliance, and headcount efficiency.

---

### 8.2 Department Layer

#### 8.2.1 Finance Agent
*   **Role:** Monitors cost centers, reviews invoices, and maintains cash flow forecasts.
*   **Allowed Tools:**
    *   `query_ledgers(query_params)`
    *   `generate_financial_projection(month_offset)`
    *   `flag_budget_anomaly(cost_center_code)`

#### 8.2.2 HR Agent
*   **Role:** Manages team allocations, reviews skills matrices, and flags onboarding bottlenecks.
*   **Allowed Tools:**
    *   `retrieve_employee_profile(email)`
    *   `update_skills_matrix(employee_id, skill_name, level)`

#### 8.2.3 Sales Agent
*   **Role:** Monitors pipeline activity, analyzes CRM deals, and forecasts seasonal revenues.
*   **Allowed Tools:**
    *   `query_crm_pipeline(filters)`
    *   `calculate_deal_probability(deal_id)`

#### 8.2.4 Marketing Agent
*   **Role:** Evaluates advertising spend performance, parses lead metrics, and tracks campaign costs.
*   **Allowed Tools:**
    *   `get_campaign_performance(campaign_id)`

#### 8.2.5 Engineering Agent
*   **Role:** Tracks codebase quality, monitors releases, and reviews developer allocations.
*   **Allowed Tools:**
    *   `query_repository_metadata(repo_name)`
    *   `assess_developer_velocity(sprint_id)`

#### 8.2.6 Legal Agent
*   **Role:** Audits contract compliance, highlights regulatory risks, and maintains standard templates.
*   **Allowed Tools:**
    *   `scan_contract_for_risks(document_id)`
    *   `generate_compliance_report(standard_type)`

#### 8.2.7 Operations Agent
*   **Role:** Monitors process execution latencies and logs compliance drifts.
*   **Allowed Tools:**
    *   `query_process_logs(sop_id)`
    *   `register_compliance_incident(execution_id)`

#### 8.2.8 Customer Success Agent
*   **Role:** Tracks account health, evaluates NPS sentiment scores, and flags customer churn risks.
*   **Allowed Tools:**
    *   `query_account_health(customer_id)`
    *   `escalate_support_ticket(ticket_id)`

#### 8.2.9 Security Agent
*   **Role:** Monitors access logs, reviews clearance levels, and audits resource permissions.
*   **Allowed Tools:**
    *   `audit_security_clearance(employee_id)`
    *   `flag_suspicious_activity(event_payload)`

---

### 8.3 Specialist Layer

#### 8.3.1 SQL Agent
*   **Role:** Writes and executes optimized SQL queries against PostgreSQL databases.
*   **Allowed Tools:**
    *   `execute_read_only_query(sql_statement)`
    *   `explain_query_plan(sql_statement)`

#### 8.3.2 Search Agent
*   **Role:** Runs global search queries using Meilisearch to locate information across all corporate entities.
*   **Allowed Tools:**
    *   `search_global_entities(query_string)`

#### 8.3.3 GitHub Agent
*   **Role:** Interfaces with GitHub, monitors commit histories, parses PR diffs, and checks build statuses.
*   **Allowed Tools:**
    *   `fetch_pull_request_diff(pr_id)`
    *   `get_commit_details(sha)`

#### 8.3.4 Document Agent
*   **Role:** Indexes and retrieves documents from storage, converting unstructured files into vectors.
*   **Allowed Tools:**
    *   `ingest_raw_document(file_path)`
    *   `search_document_contents(query_vector)`

#### 8.3.5 Email Agent
*   **Role:** Interfaces with corporate mail systems, checking messages and drafting replies.
*   **Allowed Tools:**
    *   `retrieve_recent_emails(sender, limit)`
    *   `draft_proposed_email(to, subject, body)`

#### 8.3.6 Calendar Agent
*   **Role:** Manages meeting schedules and evaluates team availability.
*   **Allowed Tools:**
    *   `check_schedule_conflict(emails, target_time)`
    *   `schedule_calendar_event(emails, time_slot)`

#### 8.3.7 Analytics Agent
*   **Role:** Processes raw metrics to generate performance dashboards.
*   **Allowed Tools:**
    *   `calculate_rolling_average(metric_name, window_days)`

#### 8.3.8 Forecast Agent
*   **Role:** Runs predictive models to project strategic business trends.
*   **Allowed Tools:**
    *   `run_regression_projection(historical_values, steps)`

---

## 9. Interactive Visualization Engine

The SentinelOS user interface is designed to translate complex enterprise relationship data into an intuitive, interactive canvas, utilizing **Next.js 15**, **React 19**, **Cytoscape.js**, **React Flow**, and **Apache ECharts**.

```
                   +--------------------------------+
                   |          USER INTERFACE        |
                   +--------------------------------+
                                  |
         +------------------------+------------------------+
         |                        |                        |
         v                        v                        v
  [ Cytoscape.js ]          [ React Flow ]         [ Apache ECharts ]
  Enterprise Graph           Agent Chains &           Executive &
  Explorer Canvas            Business Pipelines      Department KPIs
```

---

### 9.1 Next.js 15 Architecture & Design Tokens
Our frontend follows a modular, client-side rendering layout for the active visual canvases, coupled with server-side page structures to maximize load performance.

#### Core Styling tokens (Vanilla CSS Variables)
To ensure a premium, modern design, we define our core styling tokens inside `index.css`:
```css
:root {
  /* System Harmony Palette */
  --background-canvas: #0a0c10;
  --panel-background: rgba(18, 22, 30, 0.85);
  --border-glow: rgba(56, 139, 253, 0.15);
  --grid-color: rgba(255, 255, 255, 0.03);

  /* Semantic State Colors */
  --color-active-node: #388bfd;    /* Bright electric blue */
  --color-success-node: #39d353;   /* Emerald green */
  --color-warning-node: #f1e05a;   /* Canary yellow */
  --color-danger-node: #f85149;    /* Crimson red */
  --color-neutral-node: #8b949e;   /* Slate gray */

  /* Typography */
  --font-family-primary: 'Outfit', sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;

  /* Interaction Durations */
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

### 9.2 Cytoscape.js: Enterprise Knowledge Graph Explorer
Cytoscape.js handles the rendering and user interaction of the global organization structure, document systems, and project dependencies.

```
       [ Custom Cytoscape.js Render Canvas ]
                         |
      +------------------+------------------+
      |                                     |
      v                                     v
[ Layout Algorithms ]               [ Event Listeners ]
- Cose-Bilkent Layout               - Node Click -> Details Panel
- Concentric Circle Layout          - Double Click -> Expand Node
                                    - Hover -> Edge Highlight
```

#### Canvas Rendering & Layout Configurations
*   **Target Capacity:** Standard rendering performance for up to 5,000 active nodes and 15,000 edges at 60 FPS.
*   **Layout Algorithm Selection:**
    *   *Default:* `cose-bilkent` (physics-based force-directed layout) for general organizational relationship maps.
    *   *Hierarchical:* `concentric` for circular department levels and direct reporting hierarchies.
*   **Performance Optimization Tuning:**
    *   `pixelRatio: 'auto'` to adjust resolution on high-DPI screens.
    *   `textureOnViewport: true` to display static textures during quick pans or zoom actions, reducing GPU stress.
    *   `hideEdgesOnViewport: true` to temporarily hide relationship lines when dragging the canvas, preventing CPU bottlenecks.

#### Visual Stylesheet JSON Structure
```javascript
const graphStyles = [
  {
    selector: 'node',
    style: {
      'label': 'data(label)',
      'font-family': 'var(--font-family-primary)',
      'font-size': '12px',
      'color': '#ffffff',
      'background-color': 'var(--color-neutral-node)',
      'width': '40px',
      'height': '40px',
      'border-width': '2px',
      'border-color': '#1f242c',
      'transition-property': 'background-color, border-color, width, height',
      'transition-duration': '0.2s'
    }
  },
  {
    selector: 'node[type="Employee"]',
    style: {
      'background-color': '#1f6feb',
      'shape': 'ellipse'
    }
  },
  {
    selector: 'node[type="Project"]',
    style: {
      'background-color': '#ff7b72',
      'shape': 'round-rectangle'
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 1.5,
      'line-color': 'rgba(139, 148, 158, 0.3)',
      'target-arrow-shape': 'triangle',
      'target-arrow-color': 'rgba(139, 148, 158, 0.3)',
      'curve-style': 'bezier'
    }
  },
  {
    selector: 'edge.highlighted',
    style: {
      'width': 3,
      'line-color': 'var(--color-active-node)',
      'target-arrow-color': 'var(--color-active-node)',
      'transition-property': 'width, line-color',
      'transition-duration': '0.15s'
    }
  }
];
```

#### Node Interactions and Detail Panels
*   **On Hover:** Highlights the hovered node and its immediate neighbors (1-degree connections), fading out the rest of the canvas by setting their opacity to 0.15.
*   **On Click:** Opens the **Entity Detail Panel** on the right side of the dashboard, pulling properties and metadata from PostgreSQL in real-time.
*   **On Double Click:** Triggers a graph expansion query, pulling secondary relationships (2-degree connections) from Neo4j and appending the new nodes to the active canvas with a smooth particle animation.

---

### 9.3 React Flow: Agent Workflow Canvas & Business Pipelines
React Flow is used to visualize active agent chains, execution runs, and automated business workflows.

```
       [ Custom React Flow Canvas ]
                     |
       +-------------+-------------+
       |                           |
       v                           v
[ Custom Node Types ]       [ Dynamic State Triggers ]
- AgentNode                 - Success: Node flashes Green
- ToolNode                  - Running: Border animates Blue
- HumanGateNode             - Failure: Node flashes Red
```

#### Custom Node Implementation (React Component)
React Flow nodes are styled as interactive glassmorphic cards:
```typescript
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface NodeData {
  agentName: string;
  status: 'Idle' | 'Running' | 'Success' | 'Failed' | 'AwaitingApproval';
  lastMessage: string;
}

export const AgentNode = memo(({ data }: { data: NodeData }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Running': return 'border-[#388bfd] shadow-[0_0_15px_rgba(56,139,253,0.3)] animate-pulse';
      case 'Success': return 'border-[#39d353] shadow-[0_0_10px_rgba(57,211,83,0.2)]';
      case 'Failed': return 'border-[#f85149] shadow-[0_0_10px_rgba(248,81,73,0.2)]';
      case 'AwaitingApproval': return 'border-[#f1e05a] shadow-[0_0_10px_rgba(241,224,90,0.3)]';
      default: return 'border-[#30363d]';
    }
  };

  return (
    <div className={`px-4 py-3 rounded-lg bg-[#0d1117]/85 border backdrop-blur-md text-white min-w-[200px] ${getStatusClass(data.status)} transition-all duration-300`}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-[#30363d]" />
      
      <div className="flex flex-col gap-1">
        <div className="text-xs font-mono text-gray-400">Agent Executor</div>
        <div className="text-sm font-semibold tracking-wide">{data.agentName}</div>
        <div className="text-xs text-gray-300 line-clamp-2 mt-1 italic">
          "{data.lastMessage || 'Waiting in queue...'}"
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-[#30363d]" />
    </div>
  );
});
```

---

### 9.4 Apache ECharts Dashboards
For real-time operational and financial metrics, SentinelOS uses Apache ECharts, which supports responsive layouts and high-frequency data streams.

```
       [ ECharts Live Stream Pipeline ]
                      |
                      v
             (WebSocket Payload)
                      |
                      v
          [ Update Chart Data Array ]
                      |
                      v
         (Trigger chart.setOption())
```

#### Department Performance Chart Option Blueprint
```javascript
const departmentKpiOption = {
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  grid: {
    top: '12%',
    left: '3%',
    right: '4%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['Engineering', 'Sales', 'CSM', 'Finance', 'Operations'],
    axisLine: { lineStyle: { color: '#30363d' } },
    axisLabel: { color: '#8b949e', fontFamily: 'Outfit' }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#21262d' } },
    axisLabel: { color: '#8b949e', fontFamily: 'Outfit' }
  },
  series: [
    {
      name: 'Budget Efficiency',
      type: 'bar',
      barWidth: '40%',
      data: [88, 92, 79, 95, 84],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#1f6feb' },
          { offset: 1, color: '#388bfd' }
        ]),
        borderRadius: [4, 4, 0, 0]
      }
    }
  ]
};
```

---

## 10. Real-time Synchronization & WebSockets

### 10.1 WebSocket Protocol and Payload Standards
SentinelOS establishes a persistent connection between client browsers and the backend engine using `FastAPI WebSockets` backed by a `Redis Pub/Sub` message broker.

```
 [ Client Browser ] <=========( WebSockets: wss:// )=========> [ FastAPI WS Handler ]
                                                                       |
                                                                       v
                                                              [ Redis Pub/Sub ]
                                                                       ^
                                                                       |
                                                              [ Celery Workers ]
```

#### Event Message Schema Definitions (JSON)
All message payloads follow a strict format containing the event type, namespace, and timestamp:

##### Message Type: Agent Thinking Log
```json
{
  "event_type": "agent_execution_step",
  "conversation_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "timestamp": "2026-07-13T16:13:30.450Z",
  "payload": {
    "source_agent": "CEOAgent",
    "target_agent": "SQLAgent",
    "action": "delegated_task",
    "reasoning_snippet": "To resolve the CEO's query regarding renewal impacts, I need to fetch the active tickets linked to customers with contracts expiring in the next 30 days. Routing this query to the SQLAgent for data retrieval."
  }
}
```

##### Message Type: Graph Node Status Update
```json
{
  "event_type": "graph_state_transition",
  "timestamp": "2026-07-13T16:13:30.455Z",
  "payload": {
    "node_id": "GATE-101",
    "node_type": "Ticket",
    "previous_state": "In Progress",
    "current_state": "Done",
    "modified_properties": {
      "health_impact": 0.95,
      "completed_timestamp": "2026-07-13T16:13:28.120Z"
    }
  }
}
```

---

### 10.2 Client-Side State Synchronization
To prevent rendering delays and network congestion from frequent screen refreshes, the Next.js frontend maintains a localized data store using **Zustand**:

1. **Local Graph Cache:**
   The frontend caches the active Cytoscape structure in memory.
2. **WebSocket State Updates:**
   When the client receives a `graph_state_transition` message:
   * It extracts the node ID and updated properties from the payload.
   * Updates the local cache with the new data.
   * Tells Cytoscape.js to redraw only the modified node, rather than reloading the entire dataset.
3. **Optimistic UI Updates:**
   If a user drags a node or updates a field, the change is applied locally instantly. The sync confirmation is sent to the backend in the background, keeping the interface snappy.

---

## 11. MCP (Model Context Protocol) & Integration Architecture

SentinelOS leverages the **Model Context Protocol (MCP)** to allow AI agents to securely query and interact with external systems using a standardized protocol.

```
                  +--------------------------------+
                  |       SENTINELOS AGENT         |
                  +--------------------------------+
                                  |
                        (Standardized Tool Calls)
                                  |
                                  v
                  +--------------------------------+
                  |        MCP HOST GATEWAY        |
                  +--------------------------------+
                     /    |     |      |    \
                    v     v     v      v     v
             [ Slack ] [ Jira ] [ GitHub ] [ Gmail ] [ Salesforce ]
```

---

### 11.1 Connector Specifications
Each external integration runs as a standalone MCP server, communicating with the agent gateway using JSON-RPC 2.0 over standard I/O or HTTP streams:

*   **Communications (Slack, MS Teams):**
    *   *Tools:* `send_message(channel, text)`, `list_channels()`, `read_history(channel, limit)`.
    *   *State Sync:* Real-time message streaming into `employee_activity_logs`.
*   **Version Control & Tracking (GitHub, GitLab, Jira):**
    *   *Tools:* `fetch_pull_request(id)`, `query_issues(project, status)`, `create_ticket(payload)`.
    *   *State Sync:* Webhooks synchronize PR merges and issue transitions directly to our project dependency models in Neo4j.
*   **Workspace & Storage (Notion, Google Drive, OneDrive):**
    *   *Tools:* `read_page(id)`, `download_file(path)`, `search_workspace(query)`.
    *   *State Sync:* Tracks file creations and modifications, triggering our Docling parser and Qdrant ingestion runs.
*   **Business Operations (Salesforce, HubSpot, Stripe, QuickBooks):**
    *   *Tools:* `get_opportunity(id)`, `retrieve_invoice(invoice_id)`, `query_customer_ledger(domain)`.
    *   *State Sync:* Synchronizes financial transactions and CRM stages to keep the customer health and financial twin modules accurate.

---

### 11.2 n8n Visual Automation Integration
For complex, multi-step actions that require structured execution, SentinelOS uses **n8n** webhook pipelines.

```
       [ Support Ticket Arrives ]
                   |
                   v
       (n8n Ingress Webhook)
                   |
                   v
       [ AI Classifies Priority ]
                   |
         +---------+---------+
         | (High Priority)   | (Low Priority)
         v                   v
   [ Slack Alert ]     [ Create Jira Issue ]
         |                   |
         +---------+---------+
                   |
                   v
       [ Schedule Follow-Up Meet ]
```

#### Standard Ticket Processing Pipeline
1. **Trigger:** A customer submits a high-severity ticket via Zendesk, triggering an n8n webhook.
2. **Classification:** The payload is sent to SentinelOS (`/api/v1/agents/classify`). The LLM Router assigns the query to the **Customer Success Agent** to compute the account's churn probability.
3. **Routing & Notification:**
   * If the account's churn risk is critical, the agent triggers a Slack notification to the Customer Success Manager.
   * Simultaneously, it triggers a Jira API call to create an engineering ticket, links the ticket to the support issue in Neo4j, and assigns it to a developer based on their current workload and skills matrix in PostgreSQL.
4. **Follow-Up:** n8n schedules a calendar follow-up for the CSM and the engineer 24 hours before the SLA deadline, ensuring accountability.

---

## 12. Deployment, Infrastructure, & Security

### 12.1 Production-Grade Ubuntu 24.04 LTS Stack
SentinelOS is designed to run on Ubuntu Server 24.04 LTS hosts, leveraging native security controls, system services, and process isolation.

```
+------------------------------------------------------------------------+
|                          UBUNTU SERVER 24.04                           |
+------------------------------------------------------------------------+
   | (AppArmor Policies)       | (systemd units)        | (Docker Engine)
   v                           v                        v
[ Restricted OS Access ]   [ Resilient Services ]   [ Microservice Pods ]
```

#### systemd Agent Service Manager
We manage the background LangGraph orchestrators using systemd unit files, ensuring automatic restarts and structured logging via journalctl:
```ini
[Unit]
Description=SentinelOS LangGraph Agent Orchestrator Pod
After=network.target redis-server.service postgresql.service

[Service]
Type=simple
User=sentinel-run
WorkingDirectory=/opt/sentinel/agents
ExecStart=/opt/sentinel/venv/bin/python run_graph_executor.py
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=sentinel-agent-pod
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

---

### 12.2 Containerization & Scaling Architecture

#### Docker Compose Config (Hackathon & Local Development)
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: sentinel-postgres
    environment:
      POSTGRES_DB: sentinel_db
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    networks:
      - sentinel-net

  neo4j:
    image: neo4j:5.18-community
    container_name: sentinel-neo4j
    environment:
      NEO4J_AUTH: neo4j/${NEO4J_PASSWORD}
      NEO4J_PLUGINS: '["apoc"]'
    ports:
      - "7474:7474"
      - "7687:7687"
    volumes:
      - neo4jdata:/data
    networks:
      - sentinel-net

  qdrant:
    image: qdrant/qdrant:v1.8.4
    container_name: sentinel-qdrant
    ports:
      - "6333:6333"
    volumes:
      - qdrantdata:/qdrant/storage
    networks:
      - sentinel-net

  redis:
    image: redis:7-alpine
    container_name: sentinel-redis
    ports:
      - "6379:6379"
    networks:
      - sentinel-net

volumes:
  pgdata:
  neo4jdata:
  qdrantdata:

networks:
  sentinel-net:
    driver: bridge
```

#### Kubernetes Multi-Node Transition Path
As the platform scales to handle enterprise loads, we transition the architecture from Docker Compose to a managed Kubernetes cluster using custom Helm Charts:
*   **StatefulSets** are configured for PostgreSQL (with pgpool-II for replication) and Neo4j (in a core-follower cluster topology).
*   **DaemonSets** run the layout parser workers, scaling up automatically during high-volume document ingestion.
*   **NetworkPolicies** isolate agent run containers, blocking outbound internet traffic unless explicitly allowed for specific MCP tools.

---

### 12.3 Reverse Proxy & WebSocket Routing (NGINX)
NGINX acts as our entry point reverse proxy, terminating SSL certificates, routing API requests, and managing WebSocket connections:

```nginx
upstream fastapi_backend {
    server 127.0.0.1:8000;
    keepalive 32;
}

server {
    listen 443 ssl http2;
    server_name sentinel.company.com;

    ssl_certificate /etc/letsencrypt/live/sentinel.company.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sentinel.company.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # REST API Route Handler
    location /api/ {
        proxy_pass http://fastapi_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Live WebSocket Connection Route Handler
    location /ws/ {
        proxy_pass http://fastapi_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

---

### 12.4 Enterprise Security & Access Controls (RBAC & Clearance Levels)
To prevent internal data leaks and enforce the principle of least privilege, SentinelOS combines Role-Based Access Control (RBAC) with hierarchical Clearance Levels.

#### Role-Permission Mapping Matrix
We define five core user roles, managing authorization access to databases and agent nodes:

| Role Title | Data Target Clearance | Neo4j Graph Scope | Allow Mutation Actions | Agent Access |
| :--- | :--- | :--- | :--- | :--- |
| **CEO** | Level 5 (Global) | Read & Write (Full Graph) | Yes (All Actions) | Full Access (Can run global strategy simulations) |
| **Admin** | Level 4 (System) | Read & Write (Metadata Only) | Yes (Configuration only) | System Configurations |
| **Manager** | Level 3 (Department) | Read & Write (Department Graph) | Yes (For assigned projects & tasks) | Departmental Agents |
| **Team Lead** | Level 2 (Team) | Read (Department Graph) | Yes (For assigned project tickets) | Team Specialist Agents |
| **Employee** | Level 1 (Individual) | Read (Assigned projects only) | Yes (For assigned tasks only) | Assigned Specialist Agents |
| **Viewer** | Level 1 (Individual) | Read (Assigned projects only) | No (Read-Only) | No direct agent interaction |

#### Security Clearance Evaluation Pipeline
Every database query and vector retrieval call must pass our Security Clearance Evaluator:
```
           [ User Query Request ]
                      |
                      v
      [ Retrieve User Identity (JWT) ]
                      |
                      v
        [ Fetch Role & Clearance Level ]
                      |
                      v
      [ Build Query Filters dynamically ]
  - Qdrant: Filter by user_clearance_level
  - Neo4j: Filter by allowed departments
  - Postgres: Row-level security (RLS) policies
                      |
                      v
       [ Return Filtered Datasets Only ]
```

---

## 13. Monitoring, Observability, & Resiliency

### 13.1 Observability Stack Integration
SentinelOS uses a comprehensive monitoring stack to ensure system health and simplify debugging.

```
                     +---------------------------------------+
                     |         OBSERVABILITY PLATFORM        |
                     +---------------------------------------+
                        /                |                \
                       /                 |                 \
                      v                  v                  v
               [ Prometheus ]         [ Loki ]       [ OpenTelemetry ]
               System Metrics         App Logs       Distributed Tracing
```

1. **System Metrics (Prometheus):**
   * Collects system metrics (database CPU usage, Celery queue delays, WebSocket active connections, model execution times).
   * **Custom Prometheus Query Rule:**
     ```prometheus
     # Alert if average agent reasoning latency exceeds 5 seconds for more than 5 minutes
     ALERT AgentReasoningDelay
       IF avg_over_time(agent_response_latency_seconds[5m]) > 5.0
       FOR 2m
       LABELS { severity = "warning" }
       ANNOTATIONS { summary = "Agent execution queue backing up" }
     ```
2. **Log Aggregation (Loki):**
   * Aggregates console output logs, database errors, and systemd outputs into a centralized index.
3. **Distributed Tracing (OpenTelemetry):**
   * Generates tracing spans for every query run, mapping the trace from the browser WebSocket message, through FastAPI routing, LangGraph execution turns, database queries, and LLM responses.
4. **Crash Reporting (Sentry):**
   * Catches unhandled runtime exceptions inside FastAPI routes and Celery tasks, alerting engineering via Slack with full stack traces.

---
## End of PRD Document
This marks the completion of the SentinelOS Product Requirement Document. All chapters have been populated with comprehensive technical details.





