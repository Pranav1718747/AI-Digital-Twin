# SentinelOS AI: Technical Requirement Document
## Enterprise Digital Twin Operating System – Production Architecture Blueprint
**Version:** 2.0.0-ENTERPRISE-TRD  
**Classification:** Strictly Confidential / Board of Directors & Institutional Investors  
**Target Funding Stage:** €10,000,000 Series Seed/A  
**Document Revision Date:** July 2026  
**Prepared For:** Institutional Investors, Strategic Partners & Technical Due Diligence Committees  
**Prepared By:** SentinelOS AI Engineering Leadership  

---

## Legal Notice & Confidentiality Agreement

This document contains proprietary and confidential technical specifications belonging to SentinelOS AI GmbH (hereinafter "the Company"). Unauthorized reproduction, distribution, or disclosure of any material contained herein is strictly prohibited under applicable trade secret and intellectual property laws. This document is provided solely for the purpose of investor due diligence and technical evaluation in connection with a proposed equity investment of up to €10,000,000.

By accessing this document, the reader acknowledges that:
1. All information contained herein constitutes trade secrets of the Company.
2. The reader will maintain strict confidentiality and will not disclose any contents to third parties without prior written consent.
3. This document may not be copied, reproduced, or distributed in any form without explicit authorization from the Company's Board of Directors.
4. All architectural designs, algorithm specifications, database schemas, and system configurations described herein represent the intellectual property of the Company.

**© 2026 SentinelOS AI GmbH. All Rights Reserved.**

---

## Document Purpose & Intended Audience

This Technical Requirement Document (TRD) serves as the definitive, investor-grade technical specification for the SentinelOS AI Digital Twin Operating System. It provides exhaustive documentation of every architectural decision, database schema, API contract, algorithm implementation, security protocol, deployment topology, and operational procedure that comprises the SentinelOS platform.

### Primary Audience
| Audience | Purpose |
|---|---|
| **Institutional Investors & VCs** | Technical due diligence for Series Seed/A investment of €10M |
| **Strategic Technical Partners** | Integration feasibility assessment and API compatibility review |
| **Engineering Leadership** | Authoritative reference for implementation, testing, and deployment |
| **Security & Compliance Auditors** | SOC 2 Type II, GDPR, and ISO 27001 compliance verification |
| **DevOps & SRE Teams** | Infrastructure provisioning, monitoring, and incident response playbooks |

### Document Scope
This TRD covers the complete technical surface area of SentinelOS AI, including but not limited to:
- **System Architecture & Topology:** Microservice decomposition, inter-service communication patterns, and data flow diagrams
- **Data Fabric Architecture:** PostgreSQL relational layer, Neo4j knowledge graph, Qdrant vector store, and Redis caching tier
- **AI Cognitive Layer:** LangGraph multi-agent orchestration, tool-augmented reasoning, intent routing, and response synthesis
- **RAG Pipeline:** Document ingestion, layout-aware parsing, semantic chunking, embedding generation, and hybrid retrieval
- **Graph Synchronization Engine:** Event-driven PostgreSQL-to-Neo4j replication via Celery workers
- **Real-Time Communication:** WebSocket event broadcasting with Redis Pub/Sub cross-instance fanout
- **Security Architecture:** Keycloak SSO, JWT validation, RBAC with security clearance levels, and multi-tenant data isolation
- **API Gateway:** RESTful endpoint specifications, request/response schemas, and middleware pipeline
- **Infrastructure & Deployment:** Docker Compose orchestration, Kubernetes manifests, and CI/CD pipelines
- **Observability Stack:** Prometheus metrics, Grafana dashboards, OpenTelemetry tracing, and Sentry crash reporting
- **Frontend Architecture:** Next.js 15 App Router, Cytoscape.js graph visualization, React Flow process builder, and real-time dashboard design system
- **Testing Strategy:** Unit tests, integration tests, end-to-end tests, and chaos engineering protocols

---

## Table of Contents

### Part I: Architectural Foundation
1. **Executive Summary & Market Positioning**
   - 1.1 Product Vision Statement
   - 1.2 Total Addressable Market Analysis
   - 1.3 Competitive Differentiation Matrix
   - 1.4 Technology Moat & Defensibility
   - 1.5 Revenue Model & Unit Economics
2. **System Architecture Overview**
   - 2.1 High-Level System Topology Diagram
   - 2.2 Microservice Decomposition Strategy
   - 2.3 Inter-Service Communication Patterns
   - 2.4 Data Flow Architecture
   - 2.5 Event-Driven Architecture Patterns
   - 2.6 Concurrency & Thread Safety Model
3. **Technology Stack Specification**
   - 3.1 Backend Runtime & Framework Selection
   - 3.2 Database Technology Evaluation Matrix
   - 3.3 AI/ML Framework Selection Rationale
   - 3.4 Frontend Technology Stack
   - 3.5 Infrastructure & DevOps Tooling
   - 3.6 Dependency Management & Version Pinning

### Part II: Data Fabric Architecture
4. **PostgreSQL Relational Layer**
   - 4.1 Database Engine Configuration & Tuning
   - 4.2 Complete DDL Schema Specification
   - 4.3 SQLAlchemy 2.0 ORM Model Declarations
   - 4.4 Connection Pooling & Session Management
   - 4.5 Alembic Migration Pipeline
   - 4.6 Row-Level Security & Multi-Tenant Isolation
   - 4.7 Index Strategy & Query Optimization
   - 4.8 Backup, Recovery & Point-in-Time Restore
5. **Neo4j Knowledge Graph Layer**
   - 5.1 Graph Data Model & Ontology Design
   - 5.2 Node Label Specifications
   - 5.3 Relationship Type Specifications
   - 5.4 Neo4j Driver Connection Management
   - 5.5 Cypher Query Patterns & Anti-Patterns
   - 5.6 Graph Indexing Strategy
   - 5.7 Transaction Isolation & Deadlock Prevention
   - 5.8 Graph-Relational Consistency Guarantees
6. **Qdrant Vector Store Layer**
   - 6.1 Collection Architecture & Dimensionality
   - 6.2 Embedding Model Selection & Configuration
   - 6.3 Payload Index Strategy
   - 6.4 Multi-Tenant Vector Isolation
   - 6.5 Hybrid Search Implementation
   - 6.6 Vector Quantization & Performance Tuning
7. **Redis Caching & Message Broker Layer**
   - 7.1 Connection Configuration & Pool Management
   - 7.2 Pub/Sub Channel Architecture
   - 7.3 Cache Invalidation Strategies
   - 7.4 Session Store & Rate Limiting

### Part III: AI Cognitive Architecture
8. **LangGraph Multi-Agent Orchestration**
   - 8.1 Agent State Machine Design
   - 8.2 State Schema & Type Definitions
   - 8.3 Intent Router Node Implementation
   - 8.4 Tool Execution Planner Node
   - 8.5 Tool Node Registry & Execution
   - 8.6 Response Synthesis Node
   - 8.7 Conditional Edge Routing Logic
   - 8.8 Error Handling & Fallback Strategies
   - 8.9 LLM Provider Configuration (OpenRouter)
9. **Agentic Tool Architecture**
   - 9.1 Tool Design Principles & Contracts
   - 9.2 Vector Search Tool Implementation
   - 9.3 Knowledge Graph Query Tool Implementation
   - 9.4 Relational Database Query Tool Implementation
   - 9.5 Tool Security: Read-Only Enforcement & SQL Injection Prevention
   - 9.6 Tool Response Formatting & Context Window Management
10. **RAG Pipeline Architecture**
    - 10.1 Document Ingestion Workflow
    - 10.2 Layout-Aware PDF Parsing (PyMuPDF)
    - 10.3 Semantic Chunking Strategy
    - 10.4 Embedding Generation Pipeline
    - 10.5 Vector Upsert & Deduplication
    - 10.6 Hybrid Retrieval: Dense + Metadata Filtering
    - 10.7 Context Assembly & Prompt Engineering

### Part IV: Graph Synchronization Engine
11. **Event-Driven Replication Architecture**
    - 11.1 Celery Worker Configuration & Queue Topology
    - 11.2 Worker Lifecycle Hooks & Connection Management
    - 11.3 Node Synchronization Tasks
    - 11.4 Edge Synchronization Tasks
    - 11.5 Node Removal & Cascading Deletions
    - 11.6 Retry Policies & Exponential Backoff
    - 11.7 Idempotency Guarantees via MERGE Semantics
    - 11.8 Deadlock Prevention Strategies

### Part V: API Gateway & Security
12. **FastAPI REST Gateway**
    - 12.1 Application Factory & Lifespan Management
    - 12.2 Router Registration & URL Namespace
    - 12.3 CORS Configuration
    - 12.4 Pydantic v2 Request/Response Schemas
    - 12.5 Endpoint Specifications by Domain
    - 12.6 Health Check & Readiness Probes
13. **WebSocket Real-Time Event System**
    - 13.1 Connection Manager Architecture
    - 13.2 Tenant-Scoped Connection Groups
    - 13.3 Redis Pub/Sub Cross-Instance Fanout
    - 13.4 Heartbeat & Stale Connection Detection
    - 13.5 Event Publishing API
14. **Security Architecture**
    - 14.1 Keycloak SSO Realm Configuration
    - 14.2 JWT Token Validation Pipeline
    - 14.3 Security Clearance Level System
    - 14.4 Row-Level Security Policies
    - 14.5 API Rate Limiting & Throttling
    - 14.6 OWASP Top 10 Mitigation Strategies
    - 14.7 Data Encryption at Rest & in Transit

### Part VI: Infrastructure & Operations
15. **Docker Compose Development Environment**
    - 15.1 Service Definitions & Networking
    - 15.2 Volume Persistence Strategy
    - 15.3 Environment Variable Management
16. **Kubernetes Production Deployment**
    - 16.1 Namespace Architecture
    - 16.2 Deployment Manifests & Replica Strategies
    - 16.3 Service Mesh & Ingress Configuration
    - 16.4 Horizontal Pod Autoscaling
    - 16.5 Secret Management with Vault
17. **Observability & Monitoring**
    - 17.1 Prometheus Metrics Collection
    - 17.2 Grafana Dashboard Specifications
    - 17.3 OpenTelemetry Distributed Tracing
    - 17.4 Alert Rules & Escalation Policies
    - 17.5 Sentry Error Tracking & Crash Reporting
18. **CI/CD Pipeline**
    - 18.1 GitHub Actions Workflow Specifications
    - 18.2 Automated Testing Pipeline
    - 18.3 Container Image Build & Registry
    - 18.4 Blue-Green Deployment Strategy

### Part VII: Frontend Architecture
19. **Next.js 15 Application Shell**
    - 19.1 App Router Directory Structure
    - 19.2 Design System & Token Configuration
    - 19.3 Authentication Provider (Keycloak Integration)
    - 19.4 Global Layout & Navigation
20. **Dashboard & Visualization Components**
    - 20.1 Cytoscape.js Knowledge Graph Explorer
    - 20.2 React Flow Process Automation Builder
    - 20.3 Apache ECharts KPI Dashboards
    - 20.4 Simulation Sandbox Workspace
21. **Real-Time Client Architecture**
    - 21.1 WebSocket Hook Implementation
    - 21.2 Notification System & Alert Banners
    - 21.3 Optimistic UI Updates

### Part VIII: Testing, Compliance & Appendices
22. **Testing Strategy**
    - 22.1 Unit Test Framework & Coverage Targets
    - 22.2 Integration Test Suite
    - 22.3 End-to-End Test Scenarios
    - 22.4 Load Testing & Performance Benchmarks
23. **Compliance & Regulatory**
    - 23.1 GDPR Data Protection Compliance
    - 23.2 SOC 2 Type II Audit Readiness
    - 23.3 ISO 27001 Information Security
    - 23.4 Data Residency & Sovereignty
24. **Appendices**
    - A. Complete API Endpoint Reference
    - B. Database Schema Entity-Relationship Diagram
    - C. Glossary of Technical Terms
    - D. Risk Register & Mitigation Matrix
    - E. Capacity Planning & Scaling Projections
    - F. Keycloak Client OIDC Configuration Schema
    - G. Production High-Availability Clustering Specification
    - H. Disaster Recovery & Failover Runbook

---

# Part I: Architectural Foundation

---

## 1. Executive Summary & Market Positioning

### 1.1 Product Vision Statement

SentinelOS AI is an enterprise-grade **Digital Twin Operating System** that constructs a real-time, queryable, AI-native replica of an organization's entire operational fabric — its people, processes, projects, customers, financial instruments, and institutional knowledge. Unlike traditional business intelligence platforms that provide retrospective analytics on static data exports, SentinelOS maintains a living, breathing digital mirror that evolves in real-time as the organization changes.

The platform addresses a fundamental problem facing modern enterprises: **organizational opacity at scale**. As companies grow beyond 50 employees, decision-makers lose visibility into the complex interdependencies between teams, projects, customers, and resources. Critical questions like "If we reallocate Engineer X from Project A to Project B, what is the cascading impact on delivery timelines, customer SLAs, and department budgets?" become impossible to answer without weeks of manual analysis across disconnected spreadsheets, Jira boards, and Slack conversations.

SentinelOS solves this by maintaining a **multi-modal knowledge representation** of the organization across three complementary data paradigms:

1. **Relational Data Fabric (PostgreSQL 16):** Structured, transactional records of employees, departments, projects, tickets, customers, and financial ledger entries — the "ground truth" of the organization.
2. **Knowledge Graph (Neo4j 5):** A relationship-first representation that captures the complex web of dependencies — who reports to whom, which engineer is assigned to which ticket on which project, which CSM manages which customer account, and how departments cascade within the organizational hierarchy.
3. **Semantic Memory (Qdrant Vector Store):** An AI-native layer that indexes unstructured institutional knowledge — PDF contracts, policy documents, meeting notes, compliance reports — making them queryable through natural language with semantic understanding.

An AI cognitive layer powered by **LangGraph multi-agent orchestration** sits atop this tri-modal data fabric, enabling executives, managers, and operators to interrogate the organization through natural language conversations. The AI autonomously determines whether a user's question requires relational aggregation (SQL), relationship traversal (Cypher), or semantic retrieval (vector search), executes the appropriate queries, and synthesizes a coherent, contextual response.

### 1.2 Total Addressable Market Analysis

The SentinelOS platform operates at the intersection of three rapidly converging market categories:

| Market Segment | 2026 TAM (USD) | CAGR | SentinelOS Position |
|---|---|---|---|
| Digital Twin Technology | $73.5B | 42.6% | Core platform category |
| Enterprise AI Copilots | $35.2B | 38.1% | AI cognitive layer |
| Knowledge Management Software | $28.9B | 16.2% | Semantic memory layer |
| Business Intelligence & Analytics | $33.4B | 9.1% | Dashboard & visualization |
| **Combined Addressable Market** | **$171.0B** | **~26.5%** | **Multi-segment capture** |

**Market Timing Thesis:** The convergence of three technology waves — production-ready LLMs (GPT-4, Gemini), mature graph databases (Neo4j 5 with APOC), and efficient vector search engines (Qdrant, Pinecone) — creates a unique 18-month window where SentinelOS can establish first-mover advantage in the "Enterprise Digital Twin + AI" category before incumbents like Palantir, Databricks, or Salesforce assemble equivalent capabilities through M&A.

### 1.3 Competitive Differentiation Matrix

| Capability | SentinelOS | Palantir Foundry | Notion AI | Microsoft Copilot | Salesforce Einstein |
|---|---|---|---|---|---|
| Real-time Knowledge Graph | ✅ Native Neo4j | ✅ Proprietary | ❌ | ❌ | ❌ |
| Multi-Agent AI Orchestration | ✅ LangGraph | ❌ | ❌ | Partial | ❌ |
| Hybrid RAG (Dense + Sparse) | ✅ Qdrant | ❌ | Partial | Partial | ❌ |
| What-If Simulation Engine | ✅ Native | Partial | ❌ | ❌ | ❌ |
| Multi-Tenant Data Isolation | ✅ RLS + JWT | ✅ | ❌ | ✅ | ✅ |
| Visual Process Builder | ✅ React Flow | ❌ | ❌ | Partial | Partial |
| Sub-$50K Annual Contract | ✅ | ❌ ($500K+) | ✅ | ✅ | ❌ ($150K+) |
| Self-Hosted Deployment | ✅ Kubernetes | Partial | ❌ | ❌ | ❌ |

### 1.4 Technology Moat & Defensibility

SentinelOS's technical moat is constructed from four interlocking layers:

1. **Tri-Modal Data Synchronization Engine:** The real-time, event-driven synchronization between PostgreSQL (transactional truth), Neo4j (relationship graph), and Qdrant (semantic memory) creates a compounding data advantage. Each new data point enriches all three stores simultaneously, making the digital twin more accurate and valuable over time. This synchronization engine — with its deadlock prevention, idempotent MERGE operations, and exponential backoff retry policies — represents 18 months of engineering effort that is not easily replicated.

2. **LangGraph Cognitive Architecture:** The multi-agent reasoning loop — with its intent router, tool execution planner, conditional edge routing, and response synthesis nodes — is purpose-built for enterprise organizational queries. The agent autonomously selects between SQL, Cypher, and vector search based on semantic analysis of the user's question, a capability that requires deep integration with all three data stores and cannot be achieved by simply wrapping a generic chatbot around a single database.

3. **Enterprise Security Model:** The five-level security clearance system, combined with Keycloak SSO integration, Row-Level Security policies, and JWT-based tenant isolation, creates an enterprise-ready security posture that takes 6-12 months to properly implement and audit. This security infrastructure is a prerequisite for enterprise sales and cannot be retrofitted onto consumer-grade AI tools.

4. **Network Effects & Data Gravity:** As organizations ingest more documents, create more relationships, and run more simulations, the digital twin becomes exponentially more valuable and harder to replace. The graph-based representation of organizational knowledge creates switching costs that compound over time.

### 1.5 Revenue Model & Unit Economics

| Metric | Value | Notes |
|---|---|---|
| **Pricing Model** | Per-seat SaaS subscription | Tiered by clearance level |
| **Starter Tier** | €29/seat/month | Up to 50 seats, 1 agent |
| **Professional Tier** | €79/seat/month | Up to 500 seats, 5 agents |
| **Enterprise Tier** | €149/seat/month | Unlimited seats, custom agents |
| **Target ACV** | €50,000 - €500,000 | Mid-market to enterprise |
| **Gross Margin** | 78-82% | Cloud infrastructure + LLM API costs |
| **LTV:CAC Ratio** | 5:1 (target) | Based on 36-month retention |
| **Payback Period** | 12 months | Industry standard for B2B SaaS |

---

## 2. System Architecture Overview

### 2.1 High-Level System Topology Diagram

The SentinelOS platform is decomposed into five primary service layers, each running as an independent, containerized process communicating through well-defined interfaces:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              SENTINELOS SYSTEM TOPOLOGY                                 │
│                         Enterprise Digital Twin Operating System                        │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                        LAYER 1: CLIENT PRESENTATION TIER                         │  │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────────────────────┐     │  │
│  │  │   Next.js 15    │  │  Cytoscape.js    │  │     React Flow Builder       │     │  │
│  │  │   App Router    │  │  Graph Canvas    │  │     (Process Automation)     │     │  │
│  │  │   Dashboard     │  │  Explorer        │  │     Visual SOP Editor        │     │  │
│  │  └────────┬────────┘  └────────┬─────────┘  └──────────────┬───────────────┘     │  │
│  │           │                    │                            │                      │  │
│  │           └────────────────────┼────────────────────────────┘                      │  │
│  │                                │                                                   │  │
│  │                     ┌──────────▼───────────┐                                       │  │
│  │                     │   WebSocket Client   │                                       │  │
│  │                     │   (Real-time Events) │                                       │  │
│  │                     └──────────┬───────────┘                                       │  │
│  └────────────────────────────────┼───────────────────────────────────────────────────┘  │
│                                   │ HTTPS / WSS                                         │
│  ┌────────────────────────────────▼───────────────────────────────────────────────────┐  │
│  │                        LAYER 2: API GATEWAY & SECURITY                            │  │
│  │  ┌──────────────────────────────────────────────────────────────────────────────┐  │  │
│  │  │                        NGINX Ingress Controller                              │  │  │
│  │  │                    (TLS Termination, Rate Limiting)                           │  │  │
│  │  └──────────────────────────────────┬───────────────────────────────────────────┘  │  │
│  │                                     │                                              │  │
│  │  ┌──────────────────────────────────▼───────────────────────────────────────────┐  │  │
│  │  │                         FastAPI Gateway (uvicorn)                            │  │  │
│  │  │  ┌──────────────┐  ┌───────────────┐  ┌────────────────┐  ┌──────────────┐  │  │  │
│  │  │  │ JWT Validator │  │ CORS Manager  │  │ Clearance Gate │  │ Audit Logger │  │  │  │
│  │  │  └──────────────┘  └───────────────┘  └────────────────┘  └──────────────┘  │  │  │
│  │  │                                                                              │  │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │  │  │
│  │  │  │/employees│ │/projects │ │/customers│ │/documents│ │  /agent  │          │  │  │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │  │  │
│  │  └──────────────────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                                    │  │
│  │  ┌──────────────────────────┐                                                      │  │
│  │  │      Keycloak SSO        │  (OpenID Connect / RS256 JWT Issuer)                 │  │
│  │  │   Realm: sentinelos      │                                                      │  │
│  │  └──────────────────────────┘                                                      │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
│                                   │                                                     │
│  ┌────────────────────────────────▼───────────────────────────────────────────────────┐  │
│  │                        LAYER 3: AI COGNITIVE ENGINE                                │  │
│  │  ┌──────────────────────────────────────────────────────────────────────────────┐  │  │
│  │  │                    LangGraph State Machine Orchestrator                      │  │  │
│  │  │                                                                              │  │  │
│  │  │  ┌─────────────┐    ┌─────────────────┐    ┌─────────────┐                  │  │  │
│  │  │  │   Intent     │───▶│ Tool Execution  │───▶│  Tool Node  │                  │  │  │
│  │  │  │   Router     │    │ Planner         │    │  (Execute)  │                  │  │  │
│  │  │  └─────────────┘    └─────────────────┘    └──────┬──────┘                  │  │  │
│  │  │                                                    │                         │  │  │
│  │  │                         ┌───────────────────────────▼─────┐                  │  │  │
│  │  │                         │    Response Synthesizer         │                  │  │  │
│  │  │                         │    (Context + LLM → Answer)     │                  │  │  │
│  │  │                         └─────────────────────────────────┘                  │  │  │
│  │  └──────────────────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                                    │  │
│  │  ┌───────────────┐  ┌───────────────────┐  ┌──────────────────┐                   │  │
│  │  │  OpenRouter    │  │  Embedding Model  │  │  Cohere Reranker │                   │  │
│  │  │  LLM Gateway   │  │  (text-embed-3)   │  │  (Future Phase)  │                   │  │
│  │  └───────────────┘  └───────────────────┘  └──────────────────┘                   │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
│                                   │                                                     │
│  ┌────────────────────────────────▼───────────────────────────────────────────────────┐  │
│  │                     LAYER 4: DATA FABRIC & PERSISTENCE                            │  │
│  │                                                                                    │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │  │
│  │  │  PostgreSQL 16 │  │   Neo4j 5      │  │   Qdrant       │  │   Redis 7      │   │  │
│  │  │  (Relational)  │  │   (Graph)      │  │   (Vector)     │  │   (Cache/PubSub)│   │  │
│  │  │  ─────────     │  │   ─────────    │  │   ─────────    │  │   ─────────    │   │  │
│  │  │  Transactional │  │   Relationship │  │   Semantic      │  │   Session &    │   │  │
│  │  │  Ground Truth  │  │   Knowledge    │  │   Memory        │  │   Event Broker │   │  │
│  │  │                │  │   Graph        │  │   Store          │  │                │   │  │
│  │  │  10 Tables     │  │   5 Node Types │  │   1536-dim      │  │   Pub/Sub      │   │  │
│  │  │  ACID/RLS      │  │   6 Edge Types │  │   COSINE dist   │  │   Channels     │   │  │
│  │  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘   │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
│                                   │                                                     │
│  ┌────────────────────────────────▼───────────────────────────────────────────────────┐  │
│  │                     LAYER 5: ASYNC WORKERS & SYNC ENGINE                          │  │
│  │                                                                                    │  │
│  │  ┌──────────────────────────────────────────────────────────────────────────────┐  │  │
│  │  │                    Celery Worker Pool (graph_sync_queue)                     │  │  │
│  │  │                                                                              │  │  │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │  │  │
│  │  │  │ sync_employee│  │ sync_dept    │  │ sync_project │  │ sync_customer│     │  │  │
│  │  │  │ _node        │  │ _node        │  │ _node        │  │ _node        │     │  │  │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     │  │  │
│  │  │                                                                              │  │  │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │  │  │
│  │  │  │ sync_dept    │  │ sync_manager │  │ sync_ticket  │  │ remove_node  │     │  │  │
│  │  │  │ _edge        │  │ _edge        │  │ _edge        │  │              │     │  │  │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     │  │  │
│  │  └──────────────────────────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                          LAYER 6: OBSERVABILITY                                    │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │ │
│  │  │  Prometheus   │  │  Grafana     │  │ OpenTelemetry│  │   Sentry     │           │ │
│  │  │  (Metrics)    │  │  (Dashboards)│  │  (Tracing)   │  │  (Crashes)   │           │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘           │ │
│  └─────────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Microservice Decomposition Strategy

SentinelOS follows a **modular monolith** architecture for Phase 1 (Seed/A funding), with clear module boundaries that enable migration to full microservices as the team scales. This pragmatic approach balances development velocity against operational complexity:

| Service Module | Responsibility | Runtime | Port | Container |
|---|---|---|---|---|
| **backend** | FastAPI REST Gateway, CRUD operations, WebSocket server | Python 3.12 / uvicorn | 8000 | `sentinel-api` |
| **agents** | LangGraph orchestration, intent routing, tool execution | Python 3.12 (imported by backend) | N/A | Co-located |
| **digital_twin** | Celery workers, PostgreSQL→Neo4j synchronization | Python 3.12 / Celery | N/A | `sentinel-worker` |
| **rag** | Document parsing, chunking, embedding, vector ingestion | Python 3.12 (imported by backend) | N/A | Co-located |
| **frontend** | Next.js 15 App Router, dashboard, graph canvas | Node.js 20 | 3000 | `sentinel-frontend` |

**Module Boundary Contract:** Each module communicates through well-defined Python interfaces (imported classes and functions). The `backend` module imports `agents.graph.agent_executor`, `rag.pipeline.RAGPipeline`, and `rag.vector_store.VectorStoreManager` as direct Python imports. The `digital_twin` module communicates exclusively through Celery task dispatch (Redis-brokered message queue), ensuring loose coupling that enables future extraction into a separate microservice.

### 2.3 Inter-Service Communication Patterns

SentinelOS employs three distinct communication patterns, each selected for its optimal use case:

**Pattern 1: Synchronous Request-Response (HTTP/REST)**
```
Client → NGINX → FastAPI → Handler → Database → Response → Client
```
Used for: CRUD operations, health checks, document uploads, agent queries. All synchronous operations complete within a 30-second timeout boundary. The FastAPI server runs with `uvicorn` using 4 worker processes, each capable of handling concurrent async requests via Python's `asyncio` event loop.

**Pattern 2: Asynchronous Task Dispatch (Celery/Redis)**
```
FastAPI Handler → Celery .delay() → Redis Broker → Worker Pool → Neo4j Write
```
Used for: Graph synchronization tasks. When a CRUD operation modifies a relational record (e.g., creating an employee), the API handler dispatches an asynchronous Celery task to replicate the change to Neo4j. This decouples the API response time from graph database write latency, ensuring sub-200ms API responses regardless of Neo4j load.

**Pattern 3: Real-Time Event Broadcast (WebSocket + Redis Pub/Sub)**
```
Event Source → Redis PUBLISH → All API Instances SUBSCRIBE → WebSocket SEND → Client
```
Used for: Real-time dashboard updates, notification alerts, graph mutation events. When a graph synchronization task completes or a simulation produces results, the system publishes an event to a tenant-scoped Redis Pub/Sub channel. All API server instances subscribed to that channel broadcast the event to their locally connected WebSocket clients.

### 2.4 Data Flow Architecture

The following diagram illustrates the complete data flow for the most complex user interaction — an AI-powered natural language query that requires multi-source retrieval:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                     QUERY DATA FLOW: "Who reports to John in Engineering?"      │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  1. CLIENT → WebSocket Message                                                   │
│     {"type": "agent_query", "content": "Who reports to John in Engineering?"}    │
│                                                                                  │
│  2. FastAPI AGENT ROUTER → /api/v1/agent/query                                   │
│     Extract: tenant_id, user_id, security_clearance from JWT                     │
│     Validate: clearance >= Level 1 for read queries                              │
│                                                                                  │
│  3. LANGGRAPH STATE MACHINE INVOCATION                                           │
│     Initial State: {                                                             │
│       tenant_id: "703489c2-...",                                                 │
│       messages: [HumanMessage("Who reports to John in Engineering?")],           │
│       security_clearance: 3                                                      │
│     }                                                                            │
│                                                                                  │
│  4. NODE: tool_planner (LLM Call #1 via OpenRouter)                              │
│     System Prompt: "Analyze query, select appropriate tool..."                   │
│     LLM Decision: Call query_knowledge_graph_tool with Cypher query              │
│     Tool Call: {                                                                 │
│       "cypher_query": "MATCH (e:Employee)-[:REPORTS_TO]->(m:Employee             │
│         {first_name: 'John'}) WHERE e.tenant_id = $tenant_id RETURN e",          │
│       "tenant_id": "703489c2-..."                                                │
│     }                                                                            │
│                                                                                  │
│  5. NODE: tools (ToolNode Execution)                                             │
│     → Security Check: Verify no CREATE/MERGE/SET/DELETE keywords                 │
│     → Neo4j Session: Execute Cypher with tenant_id parameter                     │
│     → Result: [{"e.first_name": "Jane", "e.role_title": "Staff Engineer"},       │
│               {"e.first_name": "Alice", "e.role_title": "Senior Developer"},     │
│               {"e.first_name": "Bob", "e.role_title": "Developer"}]              │
│                                                                                  │
│  6. NODE: synthesize (LLM Call #2 via OpenRouter)                                │
│     System Prompt: "Synthesize tool results into a clear answer..."              │
│     Input: Original question + Tool results                                      │
│     Output: "Three engineers report to John in the Engineering department:        │
│              1. Jane Smith – Staff Engineer                                       │
│              2. Alice Johnson – Senior Developer                                  │
│              3. Bob Brown – Developer"                                            │
│                                                                                  │
│  7. RESPONSE → WebSocket Broadcast to Client                                     │
│     {"type": "agent_response", "content": "Three engineers report to John..."}   │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 2.5 Event-Driven Architecture Patterns

SentinelOS implements a **Command Query Responsibility Segregation (CQRS)** pattern where:
- **Commands** (writes) flow through the FastAPI REST endpoints, modify PostgreSQL, and dispatch Celery tasks for asynchronous graph replication.
- **Queries** (reads) are handled by the LangGraph agent, which directly queries PostgreSQL, Neo4j, and Qdrant based on the semantic intent of the user's question.

This separation ensures that write-heavy operations (bulk employee imports, document ingestion) do not contend with read-heavy operations (AI queries, dashboard refreshes) for database connection resources.

**Event Sourcing for Graph Sync:** Every CRUD mutation on a PostgreSQL record generates an implicit event (via Celery task dispatch) that captures the full state of the modified entity. The Celery task then applies this state to Neo4j using idempotent `MERGE` operations, ensuring that even if a task is retried multiple times (due to transient Neo4j errors), the graph state converges to the correct result.

### 2.6 Concurrency & Thread Safety Model

SentinelOS manages concurrency at three distinct levels:

**Level 1: API Server (uvicorn/asyncio)**
The FastAPI server runs on Python's `asyncio` event loop, handling thousands of concurrent HTTP requests and WebSocket connections within a single process. Database operations use `asyncpg` (async PostgreSQL driver) and `AsyncSessionLocal` (SQLAlchemy async session factory) to avoid blocking the event loop during database I/O.

**Level 2: Celery Worker Pool (Prefork)**
Celery workers run in `prefork` mode with `worker_concurrency=4`, spawning 4 child processes per worker node. Each child process maintains its own Neo4j session via the `Neo4jManager` singleton, which initializes its connection pool once per process via the `@worker_init.connect` signal handler.

**Level 3: Neo4j Transaction Isolation**
Neo4j writes use `MERGE` semantics, which are inherently idempotent and resolve concurrent writes by creating-or-updating a node/edge atomically. For operations that span multiple Cypher statements (e.g., removing an old department edge and creating a new one), each statement executes within its own implicit transaction. This trade-off accepts eventual consistency between the two Cypher operations in exchange for avoiding distributed locks.

---

## 3. Technology Stack Specification

### 3.1 Backend Runtime & Framework Selection

| Component | Technology | Version | Selection Rationale |
|---|---|---|---|
| **Language** | Python | 3.12 | Dominant AI/ML ecosystem, async/await native support, rich database driver availability |
| **Web Framework** | FastAPI | ≥0.115.0 | Native async support, automatic OpenAPI documentation, Pydantic v2 integration, type safety |
| **ASGI Server** | uvicorn | ≥0.34.0 | Production-grade ASGI server with HTTP/2 support, worker process management |
| **ORM** | SQLAlchemy | ≥2.0.36 | Industry-standard ORM with async support, declarative model syntax, Alembic migration ecosystem |
| **Async PG Driver** | asyncpg | ≥0.30.0 | Fastest PostgreSQL driver for Python, native async I/O, connection pooling |
| **Migration Tool** | Alembic | ≥1.14.1 | Schema versioning, auto-generation from SQLAlchemy models, rollback support |
| **Task Queue** | Celery | ≥5.4.0 | Mature distributed task queue, retry policies, worker lifecycle hooks |
| **Graph Driver** | neo4j-python | ≥5.27.0 | Official Neo4j driver, connection pooling, transaction management |
| **Vector Client** | qdrant-client | ≥1.12.1 | Official Qdrant SDK, batch upsert, filtered search, payload indexing |
| **AI Framework** | LangGraph | ≥0.2.14 | Graph-based agent orchestration, conditional routing, tool integration |
| **LLM Client** | openai-python | ≥1.65.1 | OpenAI-compatible client for OpenRouter API gateway |
| **Validation** | Pydantic | ≥2.10.6 | Schema validation, serialization, settings management |
| **Settings** | pydantic-settings | ≥2.7.1 | Environment variable loading, `.env` file support, type coercion |
| **Auth** | PyJWT[crypto] | ≥2.10.1 | JWT decoding, RS256 signature verification, Keycloak integration |
| **PDF Parser** | PyMuPDF (fitz) | ≥1.23.0 | Fast PDF text extraction, page-level metadata, memory-efficient streaming |
| **HTTP Client** | httpx | ≥0.28.1 | Async HTTP client for external API calls, connection pooling |
| **Email Validation** | email-validator | ≥2.2.0 | RFC-compliant email address validation for Pydantic schemas |

### 3.2 Database Technology Evaluation Matrix

The selection of PostgreSQL, Neo4j, Qdrant, and Redis as the four-tier data fabric was driven by a systematic evaluation of alternatives:

| Requirement | PostgreSQL 16 | Neo4j 5 | Qdrant | Redis 7 |
|---|---|---|---|---|
| **Primary Role** | Transactional OLTP | Relationship traversal | Semantic search | Cache & Pub/Sub |
| **Data Model** | Relational (tables) | Property graph (nodes/edges) | Vector space (embeddings) | Key-value + streams |
| **Consistency** | ACID (strong) | ACID per transaction | Eventual | Eventual |
| **Query Language** | SQL | Cypher | REST/gRPC | Redis commands |
| **Scalability** | Vertical + read replicas | Vertical (CE) / Sharding (EE) | Horizontal (sharding) | Horizontal (cluster) |
| **Multi-Tenancy** | RLS policies | Property filtering | Payload filtering | Key namespacing |
| **Latency (p99)** | <5ms (indexed queries) | <20ms (2-hop traversal) | <10ms (ANN search) | <1ms |

**Why Not a Single Database?**
A common due diligence question is: "Why not use PostgreSQL for everything?" The answer lies in the fundamental impedance mismatch between data access patterns:

1. **Relational queries** (e.g., "What is the total budget of all departments?") require table scans, JOINs, and aggregations — PostgreSQL excels at these.
2. **Relationship traversal** (e.g., "Who are all the employees 3 levels below the CEO?") requires recursive graph walks — Neo4j performs these 100-1000x faster than recursive CTEs in PostgreSQL because it stores relationships as first-class pointer structures rather than foreign key lookups.
3. **Semantic search** (e.g., "Find documents about our GDPR compliance policy") requires approximate nearest neighbor (ANN) search in high-dimensional vector space — Qdrant's HNSW index delivers sub-millisecond search across millions of vectors, a capability that PostgreSQL's `pgvector` extension cannot match at scale.

### 3.3 AI/ML Framework Selection Rationale

| Framework | Role | Alternatives Evaluated | Selection Rationale |
|---|---|---|---|
| **LangGraph** | Multi-agent orchestration | CrewAI, AutoGen, raw LangChain | Graph-based state machine enables deterministic control flow with conditional branching; superior debugging via step-by-step state inspection; native tool integration with LangChain ecosystem |
| **OpenRouter** | LLM API gateway | Direct OpenAI, Anthropic, self-hosted | Provider-agnostic routing; cost optimization across models; fallback redundancy; single API key for multiple providers |
| **OpenAI Embeddings** | Text vectorization | Cohere Embed, Sentence-BERT, E5 | 1536-dimensional embeddings; best-in-class semantic accuracy; OpenRouter-compatible API |
| **Pydantic AI** | Schema-validated tool calls | Custom parsing, Instructor | Type-safe tool argument validation; automatic error messages; integration with Pydantic v2 |

### 3.4 Frontend Technology Stack

| Component | Technology | Version | Rationale |
|---|---|---|---|
| **Framework** | Next.js | 15 | App Router for SSR/SSG, built-in API routes, React Server Components |
| **UI Library** | React | 18 | Component-based architecture, concurrent features, Suspense |
| **Styling** | Tailwind CSS | 3.x | Utility-first, dark mode support, custom design tokens |
| **Graph Visualization** | Cytoscape.js | 3.x | High-performance graph rendering, interactive canvas, layout algorithms |
| **Process Builder** | React Flow | 11.x | Drag-and-drop node editor, edge connections, custom node types |
| **Charts** | Apache ECharts | 5.x | Enterprise-grade charting, real-time updates, animation support |
| **Auth** | next-auth / Keycloak | 4.x | OIDC integration, JWT session management, SSO support |
| **Typography** | Outfit / Space Mono | - | Modern sans-serif + monospace fonts, Google Fonts CDN |

### 3.5 Infrastructure & DevOps Tooling

| Tool | Purpose | Configuration |
|---|---|---|
| **Docker** | Containerization | Multi-stage builds, Alpine base images |
| **Docker Compose** | Local development orchestration | 5-service stack (PG, Neo4j, Qdrant, Redis, Keycloak) |
| **Kubernetes** | Production container orchestration | 3-replica API deployment, HPA, rolling updates |
| **NGINX** | Reverse proxy & TLS termination | WebSocket upgrade support, rate limiting |
| **Prometheus** | Metrics collection | Custom alert rules, 15-second scrape interval |
| **Grafana** | Dashboard visualization | Pre-built SentinelOS monitoring dashboards |
| **OpenTelemetry** | Distributed tracing | FastAPI auto-instrumentation, OTLP export |
| **Sentry** | Error tracking | Unhandled exception capture, Slack integration |
| **GitHub Actions** | CI/CD pipeline | Lint → Test → Build → Deploy workflow |

### 3.6 Dependency Management & Version Pinning

All Python dependencies are specified in `requirements.txt` with minimum version constraints using the `>=` operator. This strategy balances reproducibility (minimum known-good versions) with flexibility (automatic minor/patch updates for security fixes):

```text
# SentinelOS AI – Production Dependencies
# All versions resolved to be mutually compatible

fastapi>=0.115.0
pydantic>=2.10.6
pydantic-settings>=2.7.1
SQLAlchemy>=2.0.36
asyncpg>=0.30.0
alembic>=1.14.1
neo4j>=5.27.0
celery>=5.4.0
redis>=5.2.1
pydantic-ai>=0.0.36
openai>=1.65.1
qdrant-client>=1.12.1
cohere>=5.13.11
PyJWT[crypto]>=2.10.1
cryptography>=44.0.0
python-multipart>=0.0.20
requests>=2.32.3
websockets>=14.1
uvicorn>=0.34.0
httpx>=0.28.1
email-validator>=2.2.0
pytest>=8.0.0
pytest-asyncio>=0.24.0
PyMuPDF>=1.23.0
langgraph>=0.2.14
langchain-core>=0.2.33
```

**Dependency Security Protocol:** All dependencies are scanned weekly using `pip-audit` and Snyk to detect known vulnerabilities. Critical CVEs trigger immediate patch releases, while moderate vulnerabilities are addressed within the next sprint cycle.

---

# Part II: Data Fabric Architecture

---

## 4. PostgreSQL Relational Layer

PostgreSQL 16 serves as the **transactional system of record** for SentinelOS. Every entity in the system — tenants, users, employees, departments, projects, tickets, customers, SOP workflows, ledger accounts, and audit logs — is first persisted as a relational record in PostgreSQL. This establishes an ACID-compliant, schema-enforced, query-optimizable ground truth from which the Neo4j graph and Qdrant vector stores are populated asynchronously.

### 4.1 Database Engine Configuration & Tuning

For production deployments, SentinelOS requires a tuned PostgreSQL 16 instance with the following `postgresql.conf` parameters optimized for mixed OLTP/OLAP workloads:

```ini
# /etc/postgresql/16/main/postgresql.conf
# SentinelOS Production Database Configuration

# ─────────────────────────────────────────────────
# Connection & Authentication
# ─────────────────────────────────────────────────
listen_addresses = '*'
port = 5432
max_connections = 200
superuser_reserved_connections = 5

# ─────────────────────────────────────────────────
# Memory Configuration (for 16GB RAM server)
# ─────────────────────────────────────────────────
shared_buffers = 4GB                    # 25% of total RAM
effective_cache_size = 12GB             # 75% of total RAM
work_mem = 64MB                         # Per-operation sort memory
maintenance_work_mem = 1GB              # For VACUUM, CREATE INDEX
wal_buffers = 64MB                      # WAL buffer size

# ─────────────────────────────────────────────────
# Write-Ahead Log (WAL) Configuration
# ─────────────────────────────────────────────────
wal_level = replica                     # Enable streaming replication
max_wal_size = 4GB
min_wal_size = 1GB
checkpoint_completion_target = 0.9      # Spread checkpoint I/O
archive_mode = on                       # Enable WAL archiving for PITR
archive_command = 'cp %p /var/lib/postgresql/wal_archive/%f'

# ─────────────────────────────────────────────────
# Query Planner Configuration
# ─────────────────────────────────────────────────
random_page_cost = 1.1                  # SSD-optimized (default 4.0 for HDD)
effective_io_concurrency = 200          # SSD concurrent I/O requests
default_statistics_target = 200         # Increase planner accuracy
jit = on                               # Enable JIT compilation for complex queries

# ─────────────────────────────────────────────────
# Logging & Monitoring
# ─────────────────────────────────────────────────
log_min_duration_statement = 500        # Log queries taking > 500ms
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on
log_temp_files = 0

# ─────────────────────────────────────────────────
# Autovacuum Tuning
# ─────────────────────────────────────────────────
autovacuum = on
autovacuum_max_workers = 4
autovacuum_vacuum_cost_delay = 10ms
autovacuum_vacuum_threshold = 50
autovacuum_analyze_threshold = 50
```

**Development Environment:** For local development via Docker Compose, PostgreSQL runs with default settings inside the `postgres:16-alpine` container, exposed on port `5433` (mapped from internal port `5432`) to avoid conflicts with any locally-installed PostgreSQL instance:

```yaml
# docker/docker-compose.yml (PostgreSQL service)
services:
  postgres:
    image: postgres:16-alpine
    container_name: sentinel-postgres-dev
    environment:
      POSTGRES_DB: sentinel_db
      POSTGRES_USER: sentinel_user
      POSTGRES_PASSWORD: secure_pass
    ports:
      - "5433:5432"
    volumes:
      - pgdata_volume:/var/lib/postgresql/data
    networks:
      - sentinel-bridge-net
```

### 4.2 Complete DDL Schema Specification

SentinelOS defines **10 relational tables** organized into four functional domains:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SENTINELOS DATABASE SCHEMA MAP                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  DOMAIN 1: Identity & Multi-Tenancy                                     │
│  ┌──────────┐     ┌──────────┐                                         │
│  │ tenants  │────▶│  users   │                                         │
│  └──────────┘     └──────────┘                                         │
│       │                │                                                │
│       │                │ (1:1 optional)                                  │
│       │                ▼                                                │
│  DOMAIN 2: Organizational Structure                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ departments  │◀─│  employees   │──│   tickets    │                  │
│  └──────────────┘  └──────────────┘  └──────┬───────┘                  │
│       │ (self-ref)       │ (self-ref)        │                          │
│       └─────────┘        └──────────┘        │                          │
│                                              ▼                          │
│  DOMAIN 3: Business Operations              ┌──────────────┐           │
│  ┌──────────────┐  ┌──────────────┐         │   projects   │           │
│  │  customers   │  │ sop_workflows│         └──────────────┘           │
│  └──────────────┘  └──────────────┘                                    │
│                                                                         │
│  DOMAIN 4: Finance & Compliance                                         │
│  ┌──────────────────┐  ┌──────────────┐                                │
│  │ ledger_accounts  │  │  audit_logs  │                                │
│  └──────────────────┘  └──────────────┘                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Table 1: `tenants` — Multi-Tenant Root Entity

Every record in the system belongs to exactly one tenant, enabling complete data isolation between different customer organizations.

```sql
CREATE TABLE tenants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name    VARCHAR(255) NOT NULL,
    domain          VARCHAR(100) UNIQUE NOT NULL,
    license_tier    VARCHAR(50) DEFAULT 'Enterprise',
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tenants_domain ON tenants (domain);
CREATE INDEX idx_tenants_active ON tenants (is_active) WHERE is_active = TRUE;
```

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PK, DEFAULT gen_random_uuid()` | Globally unique tenant identifier |
| `company_name` | `VARCHAR(255)` | `NOT NULL` | Legal entity name of the customer organization |
| `domain` | `VARCHAR(100)` | `UNIQUE, NOT NULL` | Primary email domain for tenant identification |
| `license_tier` | `VARCHAR(50)` | `DEFAULT 'Enterprise'` | Subscription level: Starter, Professional, Enterprise |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Soft-delete flag for tenant deactivation |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Tenant registration timestamp |

#### Table 2: `users` — Authentication & Identity Records

Maps Keycloak SSO identities to internal user profiles. Each user belongs to exactly one tenant and has a system role and security clearance level.

```sql
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email               VARCHAR(255) UNIQUE NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    system_role         VARCHAR(50) NOT NULL,
    security_clearance  VARCHAR(50) DEFAULT 'Level 1',
    is_mfa_enabled      BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_tenant ON users (tenant_id);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (system_role);
```

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PK` | User identity UUID |
| `tenant_id` | `UUID` | `FK → tenants.id, ON DELETE CASCADE` | Owning tenant |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | Corporate email address (login identifier) |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | bcrypt-hashed password (Keycloak manages in production) |
| `system_role` | `VARCHAR(50)` | `NOT NULL` | Platform role: `admin`, `manager`, `analyst`, `viewer` |
| `security_clearance` | `VARCHAR(50)` | `DEFAULT 'Level 1'` | Hierarchical clearance: Level 1 through Level 5 |
| `is_mfa_enabled` | `BOOLEAN` | `DEFAULT FALSE` | Multi-factor authentication enrollment status |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Account creation timestamp |

#### Table 3: `departments` — Organizational Hierarchy

Supports self-referencing hierarchies (e.g., "Engineering → Backend Team → Infrastructure Squad") through the `parent_department_id` foreign key.

```sql
CREATE TABLE departments (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name                    VARCHAR(255) NOT NULL,
    code                    VARCHAR(50) NOT NULL,
    parent_department_id    UUID REFERENCES departments(id),
    budget_limit_eur        NUMERIC(15, 2) DEFAULT 0.00,
    headcount_target        INTEGER DEFAULT 0,
    CONSTRAINT uq_tenant_department_code UNIQUE (tenant_id, code)
);

-- Indexes
CREATE INDEX idx_departments_tenant ON departments (tenant_id);
CREATE INDEX idx_departments_parent ON departments (parent_department_id);
CREATE INDEX idx_departments_code ON departments (tenant_id, code);
```

#### Table 4: `employees` — Workforce Records

The employee table captures the full workforce profile, including hierarchical reporting lines (self-referencing `manager_id`), department assignments, and billable rate information for financial planning.

```sql
CREATE TABLE employees (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id             UUID REFERENCES users(id) ON DELETE SET NULL,
    email               VARCHAR(255) UNIQUE NOT NULL,
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    role_title          VARCHAR(150) NOT NULL,
    department_id       UUID REFERENCES departments(id) ON DELETE SET NULL,
    manager_id          UUID REFERENCES employees(id),
    status              VARCHAR(50) DEFAULT 'Active',
    billable_rate_eur   NUMERIC(10, 2) DEFAULT 0.00
);

-- Indexes
CREATE INDEX idx_employees_tenant ON employees (tenant_id);
CREATE INDEX idx_employees_department ON employees (department_id);
CREATE INDEX idx_employees_manager ON employees (manager_id);
CREATE INDEX idx_employees_status ON employees (status);
CREATE INDEX idx_employees_email ON employees (email);
```

#### Table 5: `projects` — Project Portfolio

```sql
CREATE TABLE projects (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name                    VARCHAR(255) NOT NULL,
    jira_project_key        VARCHAR(50) NOT NULL,
    health_score            NUMERIC(3, 2) DEFAULT 1.00,
    target_completion_date  DATE NOT NULL
);

-- Indexes
CREATE INDEX idx_projects_tenant ON projects (tenant_id);
CREATE INDEX idx_projects_health ON projects (health_score);
CREATE INDEX idx_projects_jira_key ON projects (jira_project_key);
```

#### Table 6: `tickets` — Work Item Tracking

```sql
CREATE TABLE tickets (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id              UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    ticket_key              VARCHAR(50) UNIQUE NOT NULL,
    title                   VARCHAR(255) NOT NULL,
    status                  VARCHAR(50) NOT NULL,
    story_points            INTEGER DEFAULT 0,
    assigned_employee_id    UUID REFERENCES employees(id) ON DELETE SET NULL,
    target_date             DATE
);

-- Indexes
CREATE INDEX idx_tickets_project ON tickets (project_id);
CREATE INDEX idx_tickets_assignee ON tickets (assigned_employee_id);
CREATE INDEX idx_tickets_status ON tickets (status);
CREATE INDEX idx_tickets_key ON tickets (ticket_key);
```

#### Table 7: `customers` — CRM & Revenue Records

```sql
CREATE TABLE customers (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    company_name        VARCHAR(255) NOT NULL,
    domain              VARCHAR(100) NOT NULL,
    contract_value_arr  NUMERIC(15, 2) DEFAULT 0.00,
    health_score        NUMERIC(3, 2) DEFAULT 1.00,
    assigned_csm_id     UUID REFERENCES employees(id) ON DELETE SET NULL,
    is_active           BOOLEAN DEFAULT TRUE
);

-- Indexes
CREATE INDEX idx_customers_tenant ON customers (tenant_id);
CREATE INDEX idx_customers_health ON customers (health_score);
CREATE INDEX idx_customers_csm ON customers (assigned_csm_id);
CREATE INDEX idx_customers_active ON customers (is_active) WHERE is_active = TRUE;
```

#### Table 8: `sop_workflows` — Process Automation Definitions

Stores the visual SOP workflow definitions created in the React Flow builder as JSONB payloads containing node and edge arrays.

```sql
CREATE TABLE sop_workflows (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     VARCHAR(1000),
    trigger_type    VARCHAR(50) NOT NULL,
    graph_payload   JSONB NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sop_tenant ON sop_workflows (tenant_id);
CREATE INDEX idx_sop_active ON sop_workflows (is_active) WHERE is_active = TRUE;
CREATE INDEX idx_sop_trigger ON sop_workflows (trigger_type);
```

#### Table 9: `ledger_accounts` — Financial Chart of Accounts

```sql
CREATE TABLE ledger_accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    account_number  VARCHAR(50) NOT NULL,
    name            VARCHAR(255) NOT NULL,
    account_type    VARCHAR(50) NOT NULL,
    balance_eur     NUMERIC(15, 2) DEFAULT 0.00,
    is_active       BOOLEAN DEFAULT TRUE,
    CONSTRAINT uq_tenant_ledger_account UNIQUE (tenant_id, account_number)
);

-- Indexes
CREATE INDEX idx_ledger_tenant ON ledger_accounts (tenant_id);
CREATE INDEX idx_ledger_type ON ledger_accounts (account_type);
```

#### Table 10: `audit_logs` — Compliance Audit Trail

Every mutative operation on the system generates an immutable audit log entry for SOC 2 compliance.

```sql
CREATE TABLE audit_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    timestamp           TIMESTAMPTZ DEFAULT NOW(),
    user_email          VARCHAR(255) NOT NULL,
    action              VARCHAR(100) NOT NULL,
    target_table        VARCHAR(100) NOT NULL,
    record_id           UUID NOT NULL,
    clearance_required  VARCHAR(50) DEFAULT 'Level 1',
    raw_payload         JSONB
);

-- Indexes
CREATE INDEX idx_audit_tenant ON audit_logs (tenant_id);
CREATE INDEX idx_audit_timestamp ON audit_logs (timestamp DESC);
CREATE INDEX idx_audit_user ON audit_logs (user_email);
CREATE INDEX idx_audit_action ON audit_logs (action);
CREATE INDEX idx_audit_table ON audit_logs (target_table);
```

### 4.3 SQLAlchemy 2.0 ORM Model Declarations

SentinelOS uses SQLAlchemy 2.0's modern declarative syntax with `Mapped` type annotations, providing full type safety and IDE autocompletion. The ORM layer maps directly to the DDL schema above, adding Python-level relationship navigation and cascade behavior.

#### Base Declarative Model & Session Factory

```python
# /backend/app/database.py
# SQLAlchemy Async Database Connection Pool setup

import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from backend.app.config import settings

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
    pool_size=20,                     # Persistent connections in pool
    max_overflow=10,                  # Temporary overflow connections
    pool_recycle=1800,                # Recycle connections after 30 minutes
    pool_pre_ping=True                # Health-check connections before use
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

# Dependency injection helper for FastAPI route handlers
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Transaction aborted. Rolling back. Error: {str(e)}")
            raise e
```

**Connection Pool Architecture:**

| Parameter | Value | Rationale |
|---|---|---|
| `pool_size` | 20 | Maintains 20 persistent connections; sufficient for 3 uvicorn workers × ~7 concurrent queries each |
| `max_overflow` | 10 | Allows burst traffic to temporarily create up to 30 total connections before rejecting new requests |
| `pool_recycle` | 1800 | Recycles connections every 30 minutes to prevent stale TCP connections after network interruptions |
| `pool_pre_ping` | True | Issues a lightweight `SELECT 1` before returning a pooled connection, detecting broken connections proactively |

The `get_db()` dependency follows the **Unit of Work** pattern: it opens a session, yields it to the route handler, and commits on success or rolls back on exception. This guarantees that every API request operates within a single, atomic database transaction.

#### Complete ORM Model Registry

The following 10 SQLAlchemy models are registered on `Base.metadata`, enabling automatic schema generation and Alembic migration detection:

```python
# /backend/app/models.py
# Declarative Relational Model Mappings

from datetime import datetime, date, timezone
from uuid import uuid4
from typing import Optional, List
from sqlalchemy import (
    String, ForeignKey, Integer, Numeric, Boolean,
    DateTime, Date, UniqueConstraint
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from backend.app.database import Base


class Tenant(Base):
    __tablename__ = "tenants"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    license_tier: Mapped[str] = mapped_column(String(50), default="Enterprise")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    # Cascade relationships — deleting a tenant removes ALL child records
    users: Mapped[List["User"]] = relationship(
        back_populates="tenant", cascade="all, delete-orphan"
    )
    departments: Mapped[List["Department"]] = relationship(
        back_populates="tenant", cascade="all, delete-orphan"
    )
    customers: Mapped[List["Customer"]] = relationship(
        back_populates="tenant", cascade="all, delete-orphan"
    )
    sop_workflows: Mapped[List["SopWorkflow"]] = relationship(
        back_populates="tenant", cascade="all, delete-orphan"
    )
    ledger_accounts: Mapped[List["LedgerAccount"]] = relationship(
        back_populates="tenant", cascade="all, delete-orphan"
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    tenant_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    system_role: Mapped[str] = mapped_column(String(50), nullable=False)
    security_clearance: Mapped[str] = mapped_column(String(50), default="Level 1")
    is_mfa_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    tenant: Mapped["Tenant"] = relationship(back_populates="users")
    employee: Mapped[Optional["Employee"]] = relationship(back_populates="user")


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    tenant_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    parent_department_id: Mapped[Optional[UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("departments.id")
    )
    budget_limit_eur: Mapped[float] = mapped_column(Numeric(15, 2), default=0.00)
    headcount_target: Mapped[int] = mapped_column(Integer, default=0)

    tenant: Mapped["Tenant"] = relationship(back_populates="departments")
    employees: Mapped[List["Employee"]] = relationship(back_populates="department")

    __table_args__ = (
        UniqueConstraint("tenant_id", "code", name="uq_tenant_department_code"),
    )


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    tenant_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False
    )
    user_id: Mapped[Optional[UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL")
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    role_title: Mapped[str] = mapped_column(String(150), nullable=False)
    department_id: Mapped[Optional[UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("departments.id", ondelete="SET NULL")
    )
    manager_id: Mapped[Optional[UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("employees.id")
    )
    status: Mapped[str] = mapped_column(String(50), default="Active")
    billable_rate_eur: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00)

    user: Mapped[Optional["User"]] = relationship(back_populates="employee")
    department: Mapped[Optional["Department"]] = relationship(
        back_populates="employees"
    )
    tickets: Mapped[List["Ticket"]] = relationship(back_populates="assignee")


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    tenant_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    jira_project_key: Mapped[str] = mapped_column(String(50), nullable=False)
    health_score: Mapped[float] = mapped_column(Numeric(3, 2), default=1.00)
    target_completion_date: Mapped[date] = mapped_column(Date, nullable=False)

    tickets: Mapped[List["Ticket"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )


class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    project_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False
    )
    ticket_key: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    story_points: Mapped[int] = mapped_column(Integer, default=0)
    assigned_employee_id: Mapped[Optional[UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("employees.id", ondelete="SET NULL"),
        nullable=True
    )
    target_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    project: Mapped["Project"] = relationship(back_populates="tickets")
    assignee: Mapped[Optional["Employee"]] = relationship(back_populates="tickets")


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    tenant_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False
    )
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(100), nullable=False)
    contract_value_arr: Mapped[float] = mapped_column(Numeric(15, 2), default=0.00)
    health_score: Mapped[float] = mapped_column(Numeric(3, 2), default=1.00)
    assigned_csm_id: Mapped[Optional[UUID]] = mapped_column(
        UUID(as_uuid=True), ForeignKey("employees.id", ondelete="SET NULL")
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    tenant: Mapped["Tenant"] = relationship(back_populates="customers")


class SopWorkflow(Base):
    __tablename__ = "sop_workflows"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    tenant_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(1000))
    trigger_type: Mapped[str] = mapped_column(String(50), nullable=False)
    graph_payload: Mapped[dict] = mapped_column(JSONB, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    tenant: Mapped["Tenant"] = relationship(back_populates="sop_workflows")


class LedgerAccount(Base):
    __tablename__ = "ledger_accounts"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    tenant_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False
    )
    account_number: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    account_type: Mapped[str] = mapped_column(String(50), nullable=False)
    balance_eur: Mapped[float] = mapped_column(Numeric(15, 2), default=0.00)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    tenant: Mapped["Tenant"] = relationship(back_populates="ledger_accounts")

    __table_args__ = (
        UniqueConstraint(
            "tenant_id", "account_number", name="uq_tenant_ledger_account"
        ),
    )


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )
    tenant_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    user_email: Mapped[str] = mapped_column(String(255), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    target_table: Mapped[str] = mapped_column(String(100), nullable=False)
    record_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    clearance_required: Mapped[str] = mapped_column(String(50), default="Level 1")
    raw_payload: Mapped[Optional[dict]] = mapped_column(JSONB)
```

### 4.4 Connection Pooling & Session Management

The connection pooling strategy is designed for production workloads with the following lifecycle:

```
┌─────────────────────────────────────────────────────────────────┐
│                 CONNECTION POOL LIFECYCLE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Application Start                                              │
│      │                                                          │
│      ▼                                                          │
│  create_async_engine()                                          │
│      │  pool_size=20                                            │
│      │  max_overflow=10                                         │
│      │                                                          │
│      ▼                                                          │
│  ┌──────────────────────────────────────────────────┐          │
│  │           CONNECTION POOL (QueuePool)            │          │
│  │                                                  │          │
│  │  ┌─────┐ ┌─────┐ ┌─────┐      ┌─────┐         │          │
│  │  │Conn1│ │Conn2│ │Conn3│ ...  │Conn20│  (idle) │          │
│  │  └──┬──┘ └──┬──┘ └──┬──┘      └──┬──┘         │          │
│  │     │       │       │             │              │          │
│  │     ▼       ▼       ▼             ▼              │          │
│  │  ┌───────────────────────────────────────┐      │          │
│  │  │  pool_pre_ping=True                   │      │          │
│  │  │  "SELECT 1" before checkout           │      │          │
│  │  └───────────────────────────────────────┘      │          │
│  │                                                  │          │
│  │  Overflow Zone (temporary, up to 10 extra):     │          │
│  │  ┌─────┐ ┌─────┐      ┌──────┐                 │          │
│  │  │OvF1 │ │OvF2 │ ...  │OvF10 │  (burst)        │          │
│  │  └─────┘ └─────┘      └──────┘                 │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                 │
│  Every 1800s (pool_recycle):                                    │
│      Close and recreate idle connections                        │
│                                                                 │
│  Application Shutdown                                           │
│      ▼                                                          │
│  engine.dispose() — Close ALL pooled connections                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.5 Alembic Migration Pipeline

Database schema changes are tracked and applied through Alembic, configured for asynchronous migrations using the `asyncpg` driver:

#### `alembic.ini` Configuration
```ini
[alembic]
script_location = migrations
sqlalchemy.url = postgresql+asyncpg://sentinel_user:secure_pass@localhost:5433/sentinel_db

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic
```

#### `migrations/env.py` Async Migration Runner
```python
# Asynchronous Alembic Database Migration environment

import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

from backend.app.database import Base
from backend.app import models
target_metadata = Base.metadata

def run_migrations_offline() -> None:
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

**Migration Workflow:**
```bash
# 1. Generate migration from model changes
alembic revision --autogenerate -m "Add customer health_score index"

# 2. Review generated migration script (critical!)
cat migrations/versions/<hash>_add_customer_health_score_index.py

# 3. Apply migration to database
alembic upgrade head

# 4. Rollback if needed
alembic downgrade -1
```

### 4.6 Row-Level Security & Multi-Tenant Isolation

In production, SentinelOS enforces tenant data isolation at the database level using PostgreSQL Row-Level Security (RLS) policies. This provides defense-in-depth — even if a bug in the application code fails to filter by `tenant_id`, the database itself will prevent cross-tenant data access:

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sop_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policies
-- The application sets app.current_tenant_id per-session
CREATE POLICY tenant_isolation_employees ON employees
    USING (tenant_id::text = current_setting('app.current_tenant_id', TRUE));

CREATE POLICY tenant_isolation_departments ON departments
    USING (tenant_id::text = current_setting('app.current_tenant_id', TRUE));

CREATE POLICY tenant_isolation_customers ON customers
    USING (tenant_id::text = current_setting('app.current_tenant_id', TRUE));

-- Application-level session configuration:
-- SET LOCAL app.current_tenant_id = '<tenant_uuid>';
-- This is set at the beginning of every API request after JWT validation
```

### 4.7 Index Strategy & Query Optimization

SentinelOS's index strategy is designed for the top 20 most frequent query patterns identified during development:

| Query Pattern | Table | Index | Type |
|---|---|---|---|
| Authenticate user by email | `users` | `idx_users_email` | B-tree (unique) |
| List employees by tenant | `employees` | `idx_employees_tenant` | B-tree |
| Filter employees by department | `employees` | `idx_employees_department` | B-tree |
| Find manager's direct reports | `employees` | `idx_employees_manager` | B-tree |
| Filter active employees | `employees` | `idx_employees_status` | B-tree (partial) |
| List tickets by project | `tickets` | `idx_tickets_project` | B-tree |
| Find ticket by key | `tickets` | `idx_tickets_key` | B-tree (unique) |
| Filter tickets by assignee | `tickets` | `idx_tickets_assignee` | B-tree |
| List customers by health | `customers` | `idx_customers_health` | B-tree |
| Active customers only | `customers` | `idx_customers_active` | Partial (WHERE active) |
| Audit log time-range queries | `audit_logs` | `idx_audit_timestamp` | B-tree (DESC) |

### 4.8 Backup, Recovery & Point-in-Time Restore

**Backup Strategy:**
- **Continuous WAL Archiving:** All WAL segments are archived to cloud storage (S3-compatible) using `archive_command`, enabling Point-in-Time Recovery (PITR) to any moment within the retention window.
- **Daily Base Backups:** A `pg_basebackup` job runs nightly at 02:00 UTC, creating a full binary copy of the database cluster.
- **Retention Policy:** 30 days of WAL archives + 7 daily base backups.

**Recovery Procedure:**
```bash
# 1. Stop PostgreSQL
systemctl stop postgresql

# 2. Clear data directory
rm -rf /var/lib/postgresql/16/main/*

# 3. Restore latest base backup
pg_basebackup --checkpoint=fast --wal-method=stream \
    -D /var/lib/postgresql/16/main

# 4. Create recovery.conf for PITR
cat > /var/lib/postgresql/16/main/recovery.signal << EOF
restore_command = 'cp /var/lib/postgresql/wal_archive/%f %p'
recovery_target_time = '2026-07-15 14:30:00 UTC'
recovery_target_action = 'promote'
EOF

# 5. Start PostgreSQL — it will replay WAL to the target time
systemctl start postgresql
```

---

## 5. Neo4j Knowledge Graph Layer

Neo4j 5 Community Edition serves as the **relationship-first representation** of the organization, storing the same entities as PostgreSQL but optimized for traversal queries: "Who reports to whom?", "What tickets are assigned to engineers in the Engineering department?", "Which CSM manages the highest-value customer accounts?"

### 5.1 Graph Data Model & Ontology Design

The SentinelOS knowledge graph follows a **Property Graph** model where:
- **Nodes** represent organizational entities (employees, departments, projects, customers, tickets)
- **Edges** represent relationships between entities (BELONGS_TO, REPORTS_TO, ASSIGNED_TO, PART_OF, MANAGES_ACCOUNT)
- **Properties** store attributes on both nodes and edges (timestamps, metadata, computed values)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    NEO4J KNOWLEDGE GRAPH ONTOLOGY                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌──────────────┐                                    │
│                          │  Department  │                                    │
│                          │ ──────────── │                                    │
│                          │ id, name,    │                                    │
│                          │ code, budget │                                    │
│                          └──────┬───────┘                                    │
│                    BELONGS_TO ▲ │ REPORTS_TO (dept hierarchy)                │
│                               │ │                                            │
│               ┌───────────────┘ └────────────┐                               │
│               │                              │                               │
│        ┌──────┴───────┐              ┌───────┴──────┐                        │
│        │   Employee   │──REPORTS_TO─▶│   Employee   │                        │
│        │ ──────────── │  (manager)   │  (manager)   │                        │
│        │ id, email,   │              └──────────────┘                        │
│        │ first_name,  │                                                      │
│        │ role_title   │                                                      │
│        └──┬───────┬───┘                                                      │
│           │       │                                                          │
│   ASSIGNED_TO   MANAGES_ACCOUNT                                              │
│           │       │                                                          │
│           ▼       ▼                                                          │
│    ┌──────────┐  ┌──────────────┐                                           │
│    │  Ticket  │  │   Customer   │                                           │
│    │ ──────── │  │ ──────────── │                                           │
│    │ id, key, │  │ id, company, │                                           │
│    │ title    │  │ domain, ARR  │                                           │
│    └────┬─────┘  └──────────────┘                                           │
│         │                                                                    │
│     PART_OF                                                                  │
│         │                                                                    │
│         ▼                                                                    │
│    ┌──────────┐                                                              │
│    │ Project  │                                                              │
│    │ ──────── │                                                              │
│    │ id, name,│                                                              │
│    │ jira_key │                                                              │
│    └──────────┘                                                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Node Label Specifications

| Node Label | Properties | Tenant-Scoped | Description |
|---|---|---|---|
| `:Employee` | `id`, `tenant_id`, `email`, `first_name`, `last_name`, `role_title`, `status`, `billable_rate_eur`, `updated_at` | Yes | Workforce member |
| `:Department` | `id`, `tenant_id`, `name`, `code`, `budget_limit_eur`, `headcount_target`, `updated_at` | Yes | Organizational unit |
| `:Project` | `id`, `tenant_id`, `name`, `jira_project_key`, `health_score`, `target_completion_date`, `updated_at` | Yes | Project portfolio entry |
| `:Customer` | `id`, `tenant_id`, `company_name`, `domain`, `contract_value_arr`, `health_score`, `updated_at` | Yes | CRM account record |
| `:Ticket` | `id`, `tenant_id`, `updated_at` | Yes | Work item reference |

### 5.3 Relationship Type Specifications

| Relationship | Direction | Source | Target | Properties | Semantics |
|---|---|---|---|---|---|
| `BELONGS_TO` | Employee → Department | `:Employee` | `:Department` | `since: datetime()` | Department membership |
| `REPORTS_TO` | Employee → Manager | `:Employee` | `:Employee` | `since: datetime()` | Reporting hierarchy |
| `ASSIGNED_TO` | Employee → Ticket | `:Employee` | `:Ticket` | None | Ticket assignment |
| `PART_OF` | Ticket → Project | `:Ticket` | `:Project` | None | Project membership |
| `MANAGES_ACCOUNT` | Employee → Customer | `:Employee` | `:Customer` | None | CSM account ownership |
| `REPORTS_TO` (dept) | Department → Department | `:Department` | `:Department` | None | Department hierarchy |

### 5.4 Neo4j Driver Connection Management

The `Neo4jManager` class provides a singleton connection pool shared across all Celery workers and API server processes:

```python
# /digital_twin/app/neo4j_manager.py
# Production-grade Neo4j driver manager

import logging
from typing import Optional
from neo4j import GraphDatabase, Driver, Session
from backend.app.config import settings

logger = logging.getLogger("sentinel.neo4j")

class Neo4jManager:
    _driver: Optional[Driver] = None

    @classmethod
    def get_driver(cls) -> Driver:
        if cls._driver is None:
            cls._driver = GraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
                max_connection_lifetime=3600,     # Recycle after 1 hour
                max_connection_pool_size=50,       # Pool 50 connections
                connection_acquisition_timeout=30, # Wait up to 30s for conn
            )
            logger.info(f"Neo4j driver initialized: {settings.NEO4J_URI}")
        return cls._driver

    @classmethod
    def get_session(cls, database: str = "neo4j") -> Session:
        driver = cls.get_driver()
        return driver.session(database=database)

    @classmethod
    def verify_connectivity(cls) -> bool:
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
        if cls._driver is not None:
            cls._driver.close()
            cls._driver = None
            logger.info("Neo4j driver closed.")
```

**Docker Compose Configuration:**
```yaml
neo4j:
  image: neo4j:5-community
  container_name: sentinel-neo4j-dev
  environment:
    NEO4J_AUTH: neo4j/secure_neo_pass
    NEO4J_PLUGINS: '["apoc"]'
  ports:
    - "7474:7474"    # Neo4j Browser HTTP
    - "7687:7687"    # Bolt protocol
  volumes:
    - neo4jdata_volume:/data
  networks:
    - sentinel-bridge-net
```

### 5.5 Cypher Query Patterns & Anti-Patterns

**Recommended Patterns (used in SentinelOS tools):**

```cypher
// Pattern 1: Direct report lookup with tenant isolation
MATCH (e:Employee)-[:REPORTS_TO]->(m:Employee {first_name: 'John'})
WHERE e.tenant_id = $tenant_id
RETURN e.first_name, e.last_name, e.role_title

// Pattern 2: Multi-hop traversal (3 levels of management)
MATCH path = (e:Employee)-[:REPORTS_TO*1..3]->(ceo:Employee)
WHERE ceo.role_title = 'Chief Executive Officer'
  AND e.tenant_id = $tenant_id
RETURN e.first_name, length(path) AS levels_to_ceo

// Pattern 3: Department membership with project involvement
MATCH (e:Employee)-[:BELONGS_TO]->(d:Department {code: 'ENG'})
MATCH (e)-[:ASSIGNED_TO]->(t:Ticket)-[:PART_OF]->(p:Project)
WHERE e.tenant_id = $tenant_id
RETURN e.first_name, p.name, collect(t.ticket_key) AS tickets

// Pattern 4: Customer account manager chain
MATCH (csm:Employee)-[:MANAGES_ACCOUNT]->(c:Customer)
WHERE c.tenant_id = $tenant_id
RETURN csm.first_name + ' ' + csm.last_name AS manager,
       c.company_name, c.contract_value_arr
ORDER BY c.contract_value_arr DESC
```

**Anti-Patterns (blocked by security middleware):**
```cypher
// BLOCKED: Write operations via agent tools
CREATE (n:Employee {name: 'Hacker'})  // CREATE keyword detected
MERGE (e:Employee {id: '...'}) SET e.salary = 999999  // MERGE/SET detected
MATCH (n) DETACH DELETE n  // DELETE keyword detected
```

### 5.6 Graph Indexing Strategy

For optimal query performance, SentinelOS creates the following indexes on Neo4j startup:

```cypher
// Unique constraints (also create indexes)
CREATE CONSTRAINT IF NOT EXISTS FOR (e:Employee) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (d:Department) REQUIRE d.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (c:Customer) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (t:Ticket) REQUIRE t.id IS UNIQUE;

// Tenant filtering indexes
CREATE INDEX IF NOT EXISTS FOR (e:Employee) ON (e.tenant_id);
CREATE INDEX IF NOT EXISTS FOR (d:Department) ON (d.tenant_id);
CREATE INDEX IF NOT EXISTS FOR (p:Project) ON (p.tenant_id);
CREATE INDEX IF NOT EXISTS FOR (c:Customer) ON (c.tenant_id);

// Property lookup indexes
CREATE INDEX IF NOT EXISTS FOR (e:Employee) ON (e.email);
CREATE INDEX IF NOT EXISTS FOR (d:Department) ON (d.code);
CREATE INDEX IF NOT EXISTS FOR (p:Project) ON (p.jira_project_key);
```

### 5.7 Transaction Isolation & Deadlock Prevention

Neo4j writes in SentinelOS follow two key principles to prevent deadlocks:

1. **Idempotent MERGE Semantics:** All node creation tasks use `MERGE` instead of `CREATE`, which atomically creates-or-updates. This makes tasks safe for retry without duplicating data.

2. **Sequential Edge Operations:** When updating a relationship (e.g., transferring an employee to a new department), the task first `DELETE`s the old edge, then `MERGE`s the new one. Each operation executes in its own implicit transaction, accepting minimal eventual consistency risk in exchange for deadlock avoidance.

```python
# Example: Department transfer (from digital_twin/app/tasks.py)
def sync_employee_department_edge(self, employee_id, department_id, tenant_id):
    # Step 1: Remove old relationship (separate transaction)
    remove_cypher = """
    MATCH (e:Employee {id: $employee_id})-[r:BELONGS_TO]->(:Department)
    DELETE r
    """
    _execute_write(remove_cypher, {"employee_id": employee_id})

    # Step 2: Create new relationship (separate transaction)
    create_cypher = """
    MATCH (e:Employee {id: $employee_id})
    MATCH (d:Department {id: $department_id})
    MERGE (e)-[:BELONGS_TO {since: datetime()}]->(d)
    """
    _execute_write(create_cypher, {
        "employee_id": employee_id,
        "department_id": department_id,
    })
```

### 5.8 Graph-Relational Consistency Guarantees

SentinelOS provides **eventual consistency** between PostgreSQL and Neo4j with the following guarantees:

| Property | Guarantee | Mechanism |
|---|---|---|
| **Ordering** | FIFO per entity | Celery task queue with `worker_prefetch_multiplier=1` |
| **Delivery** | At-least-once | `task_acks_late=True` + `task_reject_on_worker_lost=True` |
| **Idempotency** | Guaranteed | `MERGE` semantics — safe for duplicate delivery |
| **Convergence** | Within 30 seconds | 10s default retry delay + exponential backoff |
| **Max Retries** | 5 attempts | `max_retries=5` with `retry_backoff_max=120` seconds |

**Consistency Window:** Under normal operating conditions, a PostgreSQL write is reflected in Neo4j within 1-5 seconds. Under high load or Neo4j unavailability, the Celery retry mechanism ensures convergence within the retry window (up to 5 retries with exponential backoff, maximum 120 seconds between retries).

---

## 6. Qdrant Vector Store Layer

Qdrant serves as the **semantic memory** of the SentinelOS digital twin, storing vector embeddings of unstructured documents (PDFs, policies, contracts, meeting notes) and enabling natural language retrieval through approximate nearest neighbor (ANN) search.

### 6.1 Collection Architecture & Dimensionality

SentinelOS uses a single Qdrant collection named `sentinel_knowledge_base` with the following configuration:

```python
# Collection creation (from rag/vector_store.py)
COLLECTION_NAME = "sentinel_knowledge_base"
EMBEDDING_DIM = 1536  # OpenAI text-embedding-3-small output dimension

client.create_collection(
    collection_name=COLLECTION_NAME,
    vectors_config=VectorParams(
        size=EMBEDDING_DIM,       # 1536-dimensional vectors
        distance=Distance.COSINE  # Cosine similarity metric
    ),
)
```

| Parameter | Value | Rationale |
|---|---|---|
| Collection Name | `sentinel_knowledge_base` | Single collection for all tenants, isolated by payload filter |
| Vector Dimension | 1536 | Matches `text-embedding-3-small` output dimension |
| Distance Metric | COSINE | Best for normalized text embeddings; range [0, 1] |
| Quantization | None (Phase 1) | Full-precision vectors for maximum accuracy |

### 6.2 Embedding Model Selection & Configuration

```python
# Embedding generation (from rag/vector_store.py)
EMBEDDING_MODEL = "openai/text-embedding-3-small"  # Via OpenRouter

async def generate_embeddings(cls, texts: List[str]) -> List[List[float]]:
    client = get_openai_client()
    response = await client.embeddings.create(
        input=texts,
        model=settings.EMBEDDING_MODEL
    )
    return [data.embedding for data in response.data]
```

| Model | Dimensions | Max Tokens | Cost per 1M tokens | Selection Rationale |
|---|---|---|---|---|
| `text-embedding-3-small` | 1536 | 8,191 | $0.02 | Best cost/quality ratio for enterprise document search; Matryoshka dimensionality reduction available |

### 6.3 Payload Index Strategy

Qdrant payload indexes enable fast pre-filtering before vector search, critical for multi-tenant isolation:

```python
# Payload indexing (from rag/vector_store.py)
client.create_payload_index(
    collection_name=COLLECTION_NAME,
    field_name="tenant_id",
    field_schema="keyword"    # Exact match on tenant_id string
)
```

Each vector point stores the following payload structure:
```json
{
    "text": "The full text content of this document chunk...",
    "tenant_id": "703489c2-45bd-443d-b31b-987a3d5d3e74",
    "file_name": "employee-handbook-2026.pdf",
    "uploaded_by": "b2f8a9e0-1234-5678-abcd-ef0123456789",
    "page_number": 5,
    "total_pages": 42,
    "author": "HR Department",
    "title": "Employee Handbook 2026",
    "chunk_index": 0
}
```

### 6.4 Multi-Tenant Vector Isolation

Tenant isolation in Qdrant is enforced at query time through mandatory `FieldCondition` filters:

```python
# Tenant-scoped vector search (from rag/vector_store.py)
must_conditions = [
    FieldCondition(
        key="tenant_id",
        match=MatchValue(value=str(tenant_id))
    )
]

# Additional metadata filters (optional)
if metadata_filters:
    for key, value in metadata_filters.items():
        must_conditions.append(
            FieldCondition(key=key, match=MatchValue(value=value))
        )

search_filter = Filter(must=must_conditions)

results = client.search(
    collection_name=COLLECTION_NAME,
    query_vector=query_vector,
    query_filter=search_filter,    # MANDATORY tenant filter
    limit=top_k,
    with_payload=True
)
```

**Security Guarantee:** The `tenant_id` filter is applied server-side by Qdrant before the ANN search, ensuring that vectors from other tenants are never considered — even in approximate results. The indexed `tenant_id` field enables O(1) partition pruning rather than O(n) post-filtering.

### 6.5 Hybrid Search Implementation

SentinelOS implements a **semantic + metadata** hybrid search pattern:

```
User Query: "What does our GDPR policy say about data retention?"
                    │
                    ▼
            ┌─────────────┐
            │  Embed Query │ ──→ 1536-dim vector
            └──────┬──────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │     QDRANT SEARCH ENGINE     │
    │                              │
    │  1. Pre-filter: tenant_id    │
    │  2. ANN Search: HNSW index   │
    │  3. Score: Cosine similarity  │
    │  4. Return: top-K + payloads │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │   Results (sorted by score)  │
    │                              │
    │  Doc 1 (0.94): "...data      │
    │    retention period of 5      │
    │    years for personal..."     │
    │                              │
    │  Doc 2 (0.87): "...GDPR      │
    │    Article 17 right to        │
    │    erasure procedures..."     │
    │                              │
    │  Doc 3 (0.81): "...data       │
    │    processing agreement       │
    │    with sub-processors..."    │
    └──────────────────────────────┘
```

### 6.6 Vector Quantization & Performance Tuning

**Phase 1 (Current):** Full-precision Float32 vectors for maximum retrieval accuracy. At the expected scale of 100K-1M vectors, Qdrant handles this without quantization.

**Phase 2 (Planned, Post Series A):** Scalar quantization to reduce memory footprint by 4x:
```python
# Future: Enable scalar quantization for scale
client.update_collection(
    collection_name=COLLECTION_NAME,
    quantization_config=ScalarQuantization(
        scalar=ScalarQuantizationConfig(
            type=ScalarType.INT8,
            quantile=0.99,
            always_ram=True
        )
    )
)
```

**Docker Compose Configuration:**
```yaml
qdrant:
  image: qdrant/qdrant:v1.8.4
  container_name: sentinel-qdrant-dev
  ports:
    - "6333:6333"
  volumes:
    - qdrant_volume:/qdrant/storage
  networks:
    - sentinel-bridge-net
```

---

## 7. Redis Caching & Message Broker Layer

Redis 7 serves dual purposes in the SentinelOS architecture: (1) as the Celery task queue broker/backend for graph synchronization, and (2) as the Pub/Sub transport for real-time WebSocket event broadcasting.

### 7.1 Connection Configuration & Pool Management

```python
# Redis configuration (from backend/app/config.py)
REDIS_URL = "redis://localhost:6380/0"  # DB 0 for general use

# Celery uses Redis as both broker AND result backend
celery_app = Celery(
    "sentinel_digital_twin",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)
```

**Docker Compose Configuration:**
```yaml
redis:
  image: redis:7-alpine
  container_name: sentinel-redis-dev
  ports:
    - "6380:6379"    # Mapped to 6380 to avoid host conflicts
  networks:
    - sentinel-bridge-net
```

### 7.2 Pub/Sub Channel Architecture

SentinelOS uses tenant-scoped Redis Pub/Sub channels for real-time event broadcasting:

```
Channel Pattern: sentinel:events:{tenant_id}

Example: sentinel:events:703489c2-45bd-443d-b31b-987a3d5d3e74
```

**Event Message Schema:**
```json
{
    "event_type": "employee_created",
    "tenant_id": "703489c2-45bd-443d-b31b-987a3d5d3e74",
    "data": {
        "employee_id": "b2f8a9e0-...",
        "first_name": "Alice",
        "last_name": "Johnson",
        "department": "Engineering"
    }
}
```

**Cross-Instance Fanout:** When SentinelOS runs multiple API server instances behind a load balancer, Redis Pub/Sub ensures that events published by one instance are received by all other instances and broadcast to their local WebSocket clients:

```
┌─────────────────────────────────────────────────────────────────┐
│              REDIS PUB/SUB CROSS-INSTANCE FANOUT                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  API Instance #1                    API Instance #2             │
│  ┌─────────────┐                   ┌─────────────┐            │
│  │ WS Client A │                   │ WS Client C │            │
│  │ WS Client B │                   │ WS Client D │            │
│  └──────┬──────┘                   └──────┬──────┘            │
│         │ SUBSCRIBE                       │ SUBSCRIBE          │
│         ▼                                 ▼                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    REDIS PUB/SUB                         │  │
│  │        Channel: sentinel:events:{tenant_id}              │  │
│  └──────────────────────────────────────────────────────────┘  │
│         ▲                                                      │
│         │ PUBLISH                                              │
│  ┌──────┴──────┐                                              │
│  │ Celery Task │ (graph sync completed event)                 │
│  └─────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Cache Invalidation Strategies

Redis caching for SentinelOS follows a **write-through invalidation** pattern:
1. On every CRUD write to PostgreSQL, the API handler invalidates any cached query results for the affected tenant.
2. Cache keys follow the convention: `sentinel:cache:{tenant_id}:{entity_type}:{query_hash}`
3. Cache TTL: 300 seconds (5 minutes) for dashboard aggregate queries.

### 7.4 Session Store & Rate Limiting

**Rate Limiting Configuration:**
```python
# Future: Redis-based sliding window rate limiter
# 100 requests per minute per tenant
RATE_LIMIT_KEY = f"sentinel:ratelimit:{tenant_id}:{minute_bucket}"
RATE_LIMIT_MAX = 100
RATE_LIMIT_WINDOW = 60  # seconds
```

---

# Part III: AI Cognitive Architecture

---

## 8. LangGraph Multi-Agent Orchestration

The SentinelOS AI cognitive layer is built on **LangGraph**, a graph-based framework for constructing stateful, multi-step agent workflows. Unlike linear chain-of-thought pipelines, LangGraph enables conditional branching, tool invocation loops, and graceful error recovery — all essential for enterprise-grade AI systems that must handle ambiguous queries, security-filtered responses, and multi-source data retrieval.

### 8.1 Agent State Machine Design

The SentinelOS agent operates as a directed acyclic graph (DAG) with four primary nodes and conditional edges:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                LANGGRAPH AGENT STATE MACHINE                              │
│                                                                           │
│  Entry Point                                                              │
│      │                                                                    │
│      ▼                                                                    │
│  ┌─────────────────────────────────────────┐                             │
│  │           NODE: tool_planner            │                             │
│  │  ─────────────────────────────────      │                             │
│  │  Input: User message + conversation     │                             │
│  │  LLM Call: Analyze intent, select tools │                             │
│  │  Output: Tool calls OR direct response  │                             │
│  └───────────────┬─────────────────────────┘                             │
│                  │                                                        │
│         ┌────────┴─────────┐                                             │
│         │  route_tools()   │ ◄── Conditional Edge                        │
│         └────────┬─────────┘                                             │
│                  │                                                        │
│     ┌────────────┼────────────┐                                          │
│     │ has_tool_calls          │ no_tool_calls                            │
│     ▼                         ▼                                          │
│  ┌──────────────┐    ┌──────────────┐                                   │
│  │ NODE: tools  │    │    END       │ (direct LLM response)             │
│  │ ──────────── │    └──────────────┘                                   │
│  │ Execute each │                                                        │
│  │ tool call:   │                                                        │
│  │ • search_kb  │                                                        │
│  │ • query_graph│                                                        │
│  │ • query_db   │                                                        │
│  └──────┬───────┘                                                        │
│         │                                                                │
│         ▼                                                                │
│  ┌──────────────────────────────────┐                                   │
│  │       NODE: synthesize          │                                    │
│  │  ──────────────────────────     │                                    │
│  │  Input: Tool results + query    │                                    │
│  │  LLM Call: Synthesize answer    │                                    │
│  │  Security: Apply clearance mask │                                    │
│  │  Output: Natural language answer│                                    │
│  └──────────────┬──────────────────┘                                   │
│                 │                                                        │
│                 ▼                                                        │
│            ┌─────────┐                                                   │
│            │   END   │                                                   │
│            └─────────┘                                                   │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 8.2 State Schema & Type Definitions

The agent state is defined using LangGraph's `TypedDict` pattern with annotated message lists:

```python
# /agents/graph.py
# LangGraph State Machine Definition

from typing import Annotated, TypedDict, Sequence
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    """
    Complete state container for the LangGraph cognitive loop.
    Messages accumulate through add_messages reducer, preserving
    full conversation history for context-aware responses.
    """
    messages: Annotated[Sequence[BaseMessage], add_messages]
    tenant_id: str
    security_clearance: int
```

**State Field Semantics:**

| Field | Type | Reducer | Purpose |
|---|---|---|---|
| `messages` | `Sequence[BaseMessage]` | `add_messages` | Accumulating conversation history; includes HumanMessage, AIMessage, ToolMessage |
| `tenant_id` | `str` | Replace | UUID of the calling user's tenant; injected from JWT claims |
| `security_clearance` | `int` | Replace | Numeric clearance level (1-5) from user profile; used for response filtering |

The `add_messages` reducer is critical — it **appends** new messages to the existing list rather than replacing it, enabling the agent to maintain full conversational context across multiple nodes.

### 8.3 Intent Router Node Implementation

The `tool_planner` node is the entry point of the agent graph. It receives the user's message and uses an LLM call to determine whether to invoke tools or respond directly:

```python
# /agents/graph.py — tool_planner node

from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI

# LLM configuration via OpenRouter
llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    base_url="https://openrouter.ai/api/v1",
    api_key=settings.OPENROUTER_API_KEY,
    temperature=0.1,  # Low temperature for deterministic tool selection
)

# Bind tools to enable function calling
llm_with_tools = llm.bind_tools([
    search_knowledge_base_tool,
    query_knowledge_graph_tool,
    query_relational_database_tool,
])

SYSTEM_PROMPT = """You are SentinelOS AI, an enterprise digital twin assistant.
You have access to three specialized data retrieval tools:

1. **search_knowledge_base**: Search the vector store for document-based knowledge
   (policies, contracts, handbooks, meeting notes). Use for questions about
   "what does our policy say about...", "find documents related to...", etc.

2. **query_knowledge_graph**: Execute Cypher queries against the Neo4j knowledge
   graph to explore organizational relationships. Use for questions about
   reporting hierarchies, team structures, project assignments, and customer
   account management chains.

3. **query_relational_database**: Execute read-only SQL queries against PostgreSQL
   for structured data aggregation. Use for questions about counts, sums,
   averages, budget totals, and tabular data exports.

CRITICAL RULES:
- Always include tenant_id filtering in your queries.
- Never generate CREATE, UPDATE, DELETE, DROP, or INSERT statements.
- If the user's clearance level is below 3, do not return financial data.
- If you are unsure which tool to use, use search_knowledge_base first.
"""

def tool_planner(state: AgentState) -> dict:
    """Analyze user intent and select appropriate tools."""
    messages = [SystemMessage(content=SYSTEM_PROMPT)] + list(state["messages"])
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}
```

### 8.4 Tool Execution Planner Node

The conditional edge `route_tools()` determines whether the LLM requested tool calls:

```python
# /agents/graph.py — Conditional routing

from langgraph.prebuilt import ToolNode

def route_tools(state: AgentState) -> str:
    """
    Check if the last AI message contains tool_calls.
    If yes, route to the 'tools' node for execution.
    If no, route to END (direct response).
    """
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END
```

### 8.5 Tool Node Registry & Execution

The `ToolNode` from LangGraph's prebuilt module automatically executes all tool calls requested by the LLM and appends `ToolMessage` results to the state:

```python
# /agents/graph.py — Tool node setup

from agents.tools import (
    search_knowledge_base_tool,
    query_knowledge_graph_tool,
    query_relational_database_tool,
)

tool_node = ToolNode(tools=[
    search_knowledge_base_tool,
    query_knowledge_graph_tool,
    query_relational_database_tool,
])
```

### 8.6 Response Synthesis Node

After tools execute, the `synthesize` node makes a second LLM call to convert raw tool outputs into a natural language response:

```python
# /agents/graph.py — Synthesis node

SYNTHESIS_PROMPT = """You are SentinelOS AI. You have just received results
from data retrieval tools. Synthesize these results into a clear, professional,
actionable response for the user. Include specific numbers, names, and details
from the tool results. If the tool returned no results, say so clearly and
suggest alternative queries. Format your response with bullet points or tables
where appropriate."""

def synthesize(state: AgentState) -> dict:
    """Convert tool results into a human-readable response."""
    messages = [SystemMessage(content=SYNTHESIS_PROMPT)] + list(state["messages"])
    response = llm.invoke(messages)
    return {"messages": [response]}
```

### 8.7 Conditional Edge Routing Logic

The complete graph is assembled with explicit node registrations and conditional edges:

```python
# /agents/graph.py — Complete graph assembly

from langgraph.graph import StateGraph, END

# Initialize the state graph
workflow = StateGraph(AgentState)

# Register nodes
workflow.add_node("tool_planner", tool_planner)
workflow.add_node("tools", tool_node)
workflow.add_node("synthesize", synthesize)

# Set entry point
workflow.set_entry_point("tool_planner")

# Add conditional edge from tool_planner
workflow.add_conditional_edges(
    "tool_planner",
    route_tools,
    {
        "tools": "tools",      # If tool calls exist, execute them
        END: END,               # If no tool calls, end with direct response
    },
)

# After tools execute, always go to synthesize
workflow.add_edge("tools", "synthesize")

# After synthesis, end the graph
workflow.add_edge("synthesize", END)

# Compile the graph into an executable agent
agent_executor = workflow.compile()
```

### 8.8 Error Handling & Fallback Strategies

SentinelOS implements multi-layer error handling within the agent:

| Error Type | Detection | Recovery Strategy |
|---|---|---|
| **LLM API Timeout** | `httpx.TimeoutError` in OpenRouter call | Retry up to 3 times with 2s exponential backoff |
| **Invalid Tool Call** | Pydantic validation failure | Return ToolMessage with error, let LLM self-correct |
| **Neo4j Connection Error** | `ServiceUnavailable` exception | Return error message, suggest retrying later |
| **SQL Injection Attempt** | Keyword detection in Cypher/SQL | Block query, return security violation message |
| **Empty Tool Results** | Zero results returned | Synthesizer acknowledges no results, suggests alternatives |
| **Clearance Violation** | `security_clearance < required_level` | Filter sensitive fields from response |

### 8.9 LLM Provider Configuration (OpenRouter)

SentinelOS routes all LLM calls through **OpenRouter**, a provider-agnostic API gateway:

```python
# /backend/app/config.py — LLM Configuration

class Settings(BaseSettings):
    OPENROUTER_API_KEY: str           # API key for OpenRouter
    LLM_MODEL: str = "openai/gpt-4o-mini"  # Default reasoning model
    EMBEDDING_MODEL: str = "openai/text-embedding-3-small"
    LLM_TEMPERATURE: float = 0.1     # Low temperature for deterministic output
    LLM_MAX_TOKENS: int = 4096       # Maximum response length
```

**Provider Fallback Chain:**
```
Primary:   openai/gpt-4o-mini (via OpenRouter)
Fallback:  anthropic/claude-3-haiku (if OpenAI unavailable)
Emergency: google/gemini-1.5-flash (last resort)
```

---

## 9. Agentic Tool Architecture

### 9.1 Tool Design Principles & Contracts

Every tool in the SentinelOS agent ecosystem adheres to four design principles:

1. **Read-Only Enforcement:** No tool may modify data. All tools execute read-only queries against their respective data stores.
2. **Tenant Isolation:** Every query must include a `tenant_id` filter. Tools that receive a `tenant_id` parameter must inject it into every database query.
3. **Result Truncation:** Tool results are truncated to 4000 characters to prevent context window overflow.
4. **Structured Return:** All tools return formatted string results that can be parsed by the synthesis LLM.

### 9.2 Vector Search Tool Implementation

```python
# /agents/tools.py — Knowledge Base Search Tool

from langchain_core.tools import tool

@tool
def search_knowledge_base_tool(
    query: str,
    tenant_id: str,
    top_k: int = 5
) -> str:
    """
    Search the SentinelOS knowledge base (Qdrant vector store) for documents
    matching the given natural language query. Returns the most relevant
    document chunks with their similarity scores.

    Args:
        query: Natural language search query
        tenant_id: UUID of the tenant to scope the search
        top_k: Number of results to return (default 5)

    Returns:
        Formatted string with matching document excerpts and metadata
    """
    try:
        results = VectorStoreManager.search(
            query_text=query,
            tenant_id=tenant_id,
            top_k=top_k,
        )

        if not results:
            return "No documents found matching your query."

        formatted_results = []
        for i, result in enumerate(results, 1):
            payload = result.payload
            formatted_results.append(
                f"Result {i} (Score: {result.score:.3f}):\n"
                f"  Source: {payload.get('file_name', 'Unknown')}\n"
                f"  Page: {payload.get('page_number', 'N/A')}\n"
                f"  Content: {payload.get('text', '')[:500]}\n"
            )

        return "\n".join(formatted_results)
    except Exception as e:
        return f"Error searching knowledge base: {str(e)}"
```

### 9.3 Knowledge Graph Query Tool Implementation

```python
# /agents/tools.py — Neo4j Graph Query Tool

@tool
def query_knowledge_graph_tool(
    cypher_query: str,
    tenant_id: str
) -> str:
    """
    Execute a read-only Cypher query against the Neo4j knowledge graph.
    Use this to explore organizational relationships, reporting hierarchies,
    team structures, and project assignments.

    CRITICAL: Only SELECT/MATCH/RETURN operations are allowed.
    CREATE, MERGE, SET, DELETE operations will be BLOCKED.

    Args:
        cypher_query: A valid Cypher query string (read-only)
        tenant_id: UUID of the tenant for data isolation

    Returns:
        Formatted string with query results
    """
    # SECURITY: Block write operations
    BLOCKED_KEYWORDS = ["CREATE", "MERGE", "SET ", "DELETE", "REMOVE",
                        "DROP", "DETACH"]
    upper_query = cypher_query.upper()
    for keyword in BLOCKED_KEYWORDS:
        if keyword in upper_query:
            return (
                f"SECURITY VIOLATION: Write operation '{keyword}' detected. "
                f"Only read-only queries are permitted via the agent."
            )

    try:
        with Neo4jManager.get_session() as session:
            result = session.run(cypher_query, tenant_id=tenant_id)
            records = [dict(record) for record in result]

        if not records:
            return "No results found in the knowledge graph."

        # Format results as a readable table
        formatted = f"Found {len(records)} result(s):\n\n"
        for i, record in enumerate(records[:20], 1):  # Cap at 20 results
            formatted += f"  Record {i}:\n"
            for key, value in record.items():
                formatted += f"    {key}: {value}\n"
            formatted += "\n"

        return formatted[:4000]  # Truncate to prevent context overflow
    except Exception as e:
        return f"Graph query error: {str(e)}"
```

### 9.4 Relational Database Query Tool Implementation

```python
# /agents/tools.py — PostgreSQL Query Tool

@tool
def query_relational_database_tool(
    sql_query: str,
    tenant_id: str
) -> str:
    """
    Execute a read-only SQL query against the PostgreSQL relational database.
    Use this for structured data aggregation: counts, sums, averages,
    budget totals, and tabular data exports.

    CRITICAL: Only SELECT operations are allowed.
    INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE will be BLOCKED.

    Args:
        sql_query: A valid SQL SELECT query string
        tenant_id: UUID of the tenant for data isolation

    Returns:
        Formatted string with query results
    """
    # SECURITY: Block write operations
    BLOCKED_SQL = ["INSERT", "UPDATE", "DELETE", "DROP", "ALTER",
                   "TRUNCATE", "GRANT", "REVOKE", "CREATE"]
    upper_query = sql_query.upper().strip()

    if not upper_query.startswith("SELECT"):
        return "SECURITY VIOLATION: Only SELECT queries are permitted."

    for keyword in BLOCKED_SQL:
        if keyword in upper_query:
            return (
                f"SECURITY VIOLATION: '{keyword}' operation detected. "
                f"Only SELECT queries are permitted via the agent."
            )

    try:
        # Execute query with tenant_id parameter binding
        with get_sync_session() as session:
            result = session.execute(text(sql_query), {"tenant_id": tenant_id})
            rows = result.fetchall()
            columns = result.keys()

        if not rows:
            return "No results found."

        # Format as table
        header = " | ".join(columns)
        separator = "-" * len(header)
        formatted = f"{header}\n{separator}\n"
        for row in rows[:50]:  # Cap at 50 rows
            formatted += " | ".join(str(val) for val in row) + "\n"

        return formatted[:4000]
    except Exception as e:
        return f"SQL query error: {str(e)}"
```

### 9.5 Tool Security: Read-Only Enforcement & SQL Injection Prevention

The tool security model implements **defense-in-depth** across four layers:

```
┌────────────────────────────────────────────────────────────────┐
│                TOOL SECURITY LAYERS                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Layer 1: LLM System Prompt                                    │
│  ─────────────────────────                                     │
│  The system prompt explicitly instructs the LLM to never       │
│  generate write operations. This prevents most write attempts  │
│  at the intent level.                                          │
│                                                                │
│  Layer 2: Tool-Level Keyword Blocking                          │
│  ────────────────────────────────────                          │
│  Each tool scans the generated query for blocked keywords      │
│  (CREATE, MERGE, SET, DELETE, INSERT, UPDATE, DROP, etc.)      │
│  before execution. Blocked queries return a security error.    │
│                                                                │
│  Layer 3: Parameterized Query Binding                          │
│  ────────────────────────────────────                          │
│  Tenant IDs and other parameters use parameterized binding     │
│  ($tenant_id in Cypher, :tenant_id in SQL) rather than         │
│  string interpolation, preventing SQL/Cypher injection.        │
│                                                                │
│  Layer 4: Database-Level Permissions                           │
│  ───────────────────────────────────                           │
│  The database user account used by agent tools has             │
│  READ-ONLY permissions (GRANT SELECT ON ALL TABLES).           │
│  Even if all application-level checks fail, the database       │
│  itself will reject write operations.                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 9.6 Tool Response Formatting & Context Window Management

All tool responses are truncated to **4,000 characters** to prevent exceeding the LLM's context window during synthesis. This limit was calibrated based on:
- GPT-4o-mini's 128K token context window
- Average tool result size of 500-2,000 characters
- System prompt overhead of ~1,000 tokens
- Maximum 3 concurrent tool calls per agent invocation
- Safety margin for synthesis prompt and response

---

## 10. RAG Pipeline Architecture

The Retrieval-Augmented Generation (RAG) pipeline enables SentinelOS to ingest, index, and retrieve enterprise documents through natural language queries.

### 10.1 Document Ingestion Workflow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   RAG DOCUMENT INGESTION PIPELINE                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. UPLOAD                                                               │
│     POST /api/v1/documents/upload                                        │
│     Content-Type: multipart/form-data                                    │
│     File: employee-handbook.pdf (12 MB)                                  │
│     Metadata: {"title": "Employee Handbook", "author": "HR"}             │
│                                                                          │
│  2. VALIDATION                                                           │
│     ✓ File type: PDF (supported)                                         │
│     ✓ File size: 12 MB (< 50 MB limit)                                   │
│     ✓ Tenant: Authenticated via JWT                                      │
│                                                                          │
│  3. PDF PARSING (PyMuPDF / fitz)                                         │
│     Extract text page-by-page                                            │
│     Preserve page numbers for citation                                   │
│     Handle multi-column layouts                                          │
│     Output: List[PageText] with metadata                                 │
│                                                                          │
│  4. SEMANTIC CHUNKING                                                    │
│     Split pages into 500-character chunks                                │
│     Overlap: 50 characters between chunks                                │
│     Preserve sentence boundaries where possible                          │
│     Output: List[Chunk] with page references                             │
│                                                                          │
│  5. EMBEDDING GENERATION                                                 │
│     Batch embed chunks via OpenAI text-embedding-3-small                 │
│     Batch size: 100 chunks per API call                                  │
│     Output: List[Vector(1536-dim)]                                       │
│                                                                          │
│  6. VECTOR UPSERT (Qdrant)                                               │
│     Generate UUID point IDs (deterministic hash of content)              │
│     Attach metadata payload (tenant_id, file_name, page, etc.)           │
│     Upsert to sentinel_knowledge_base collection                         │
│     Output: N vectors indexed                                            │
│                                                                          │
│  7. CONFIRMATION                                                         │
│     Return: {"status": "indexed", "chunks": 47, "pages": 12}            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Layout-Aware PDF Parsing (PyMuPDF)

```python
# /rag/pipeline.py — PDF Text Extraction

import fitz  # PyMuPDF
from typing import List, Dict

class PDFParser:
    """
    Extract text from PDF documents with page-level granularity.
    Uses PyMuPDF (fitz) for fast, memory-efficient extraction.
    """

    @staticmethod
    def extract_pages(file_bytes: bytes) -> List[Dict]:
        """
        Extract text from each page of a PDF document.

        Args:
            file_bytes: Raw PDF file content as bytes

        Returns:
            List of dicts with 'page_number', 'text', and 'char_count'
        """
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        pages = []

        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text("text")  # Plain text extraction

            if text.strip():  # Skip empty pages
                pages.append({
                    "page_number": page_num + 1,
                    "text": text.strip(),
                    "char_count": len(text.strip()),
                })

        doc.close()
        return pages
```

### 10.3 Semantic Chunking Strategy

SentinelOS uses a **fixed-size character chunking** strategy with overlap to maintain semantic coherence across chunk boundaries:

```python
# /rag/pipeline.py — Text Chunking

class TextChunker:
    """
    Split document text into overlapping chunks for embedding.
    """

    def __init__(self, chunk_size: int = 500, overlap: int = 50):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_text(self, text: str, page_number: int = 1) -> List[Dict]:
        """
        Split text into fixed-size chunks with overlap.

        Args:
            text: Full page or document text
            page_number: Source page number for citation

        Returns:
            List of chunk dicts with text, index, and page reference
        """
        chunks = []
        start = 0
        chunk_index = 0

        while start < len(text):
            end = start + self.chunk_size
            chunk_text = text[start:end]

            # Try to break at sentence boundary
            if end < len(text):
                last_period = chunk_text.rfind('.')
                last_newline = chunk_text.rfind('\n')
                break_point = max(last_period, last_newline)
                if break_point > self.chunk_size // 2:
                    chunk_text = chunk_text[:break_point + 1]
                    end = start + break_point + 1

            chunks.append({
                "text": chunk_text.strip(),
                "chunk_index": chunk_index,
                "page_number": page_number,
                "start_char": start,
                "end_char": end,
            })

            start = end - self.overlap
            chunk_index += 1

        return chunks
```

### 10.4 Embedding Generation Pipeline

```python
# /rag/vector_store.py — Batch Embedding Generation

class VectorStoreManager:
    BATCH_SIZE = 100  # Process 100 chunks per API call

    @classmethod
    async def generate_embeddings(
        cls, texts: List[str]
    ) -> List[List[float]]:
        """
        Generate embeddings for a list of texts using OpenAI API.
        Processes in batches to stay within API rate limits.

        Args:
            texts: List of text strings to embed

        Returns:
            List of 1536-dimensional float vectors
        """
        client = get_openai_client()
        all_embeddings = []

        for i in range(0, len(texts), cls.BATCH_SIZE):
            batch = texts[i:i + cls.BATCH_SIZE]
            response = await client.embeddings.create(
                input=batch,
                model=settings.EMBEDDING_MODEL
            )
            batch_embeddings = [
                data.embedding for data in response.data
            ]
            all_embeddings.extend(batch_embeddings)

        return all_embeddings
```

### 10.5 Vector Upsert & Deduplication

```python
# /rag/vector_store.py — Vector Upsert with Deduplication

import hashlib
from uuid import UUID as PyUUID

@classmethod
async def upsert_documents(
    cls,
    chunks: List[Dict],
    embeddings: List[List[float]],
    tenant_id: str,
    file_name: str,
    metadata: Dict = None,
) -> int:
    """
    Upsert document chunks with their embeddings into Qdrant.
    Uses content-based hashing for deduplication.

    Args:
        chunks: List of chunk dicts with text and metadata
        embeddings: Corresponding embedding vectors
        tenant_id: Tenant UUID for isolation
        file_name: Source document filename
        metadata: Additional document metadata

    Returns:
        Number of vectors successfully upserted
    """
    client = get_qdrant_client()
    points = []

    for chunk, embedding in zip(chunks, embeddings):
        # Generate deterministic UUID from content hash
        content_hash = hashlib.sha256(
            f"{tenant_id}:{file_name}:{chunk['text']}"
            .encode('utf-8')
        ).hexdigest()
        point_id = str(PyUUID(content_hash[:32]))

        payload = {
            "text": chunk["text"],
            "tenant_id": str(tenant_id),
            "file_name": file_name,
            "page_number": chunk.get("page_number", 0),
            "chunk_index": chunk.get("chunk_index", 0),
            **(metadata or {}),
        }

        points.append(PointStruct(
            id=point_id,
            vector=embedding,
            payload=payload,
        ))

    # Batch upsert to Qdrant
    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
    )

    return len(points)
```

### 10.6 Hybrid Retrieval: Dense + Metadata Filtering

The search method combines dense vector similarity with metadata pre-filtering:

```python
# /rag/vector_store.py — Hybrid Search

@classmethod
def search(
    cls,
    query_text: str,
    tenant_id: str,
    top_k: int = 5,
    metadata_filters: Dict = None,
) -> List:
    """
    Search the knowledge base using hybrid retrieval.

    Args:
        query_text: Natural language search query
        tenant_id: Mandatory tenant filter
        top_k: Number of results to return
        metadata_filters: Optional additional filters

    Returns:
        List of ScoredPoint results with payloads
    """
    client = get_qdrant_client()

    # Generate query embedding
    query_vector = cls.generate_embeddings([query_text])[0]

    # Build mandatory tenant filter
    must_conditions = [
        FieldCondition(
            key="tenant_id",
            match=MatchValue(value=str(tenant_id))
        )
    ]

    # Add optional metadata filters
    if metadata_filters:
        for key, value in metadata_filters.items():
            must_conditions.append(
                FieldCondition(
                    key=key,
                    match=MatchValue(value=value)
                )
            )

    search_filter = Filter(must=must_conditions)

    results = client.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_vector,
        query_filter=search_filter,
        limit=top_k,
        with_payload=True,
    )

    return results
```

### 10.7 Context Assembly & Prompt Engineering

Retrieved document chunks are assembled into a context block that is injected into the synthesis prompt:

```python
# Context assembly for LLM synthesis
def assemble_context(search_results: List) -> str:
    """
    Format search results into a context block for LLM consumption.
    Each result includes source attribution for citation.
    """
    context_parts = []
    for i, result in enumerate(search_results, 1):
        payload = result.payload
        context_parts.append(
            f"[Source {i}: {payload.get('file_name', 'Unknown')} "
            f"- Page {payload.get('page_number', 'N/A')} "
            f"(Relevance: {result.score:.2f})]\n"
            f"{payload.get('text', '')}\n"
        )
    return "\n---\n".join(context_parts)
```

---

# Part IV: Graph Synchronization Engine

---

## 11. Event-Driven Replication Architecture

The Graph Synchronization Engine is the component responsible for maintaining consistency between the PostgreSQL relational source of truth and the Neo4j knowledge graph. It operates as an asynchronous, event-driven pipeline using Celery workers backed by Redis as the message broker.

### 11.1 Celery Worker Configuration & Queue Topology

```python
# /digital_twin/app/celery_app.py — Production Configuration

celery_app = Celery(
    "sentinel_digital_twin",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    # Serialization
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,

    # Task execution reliability
    task_acks_late=True,              # ACK after completion, not receipt
    task_reject_on_worker_lost=True,  # Requeue if worker dies
    worker_prefetch_multiplier=1,     # Fetch one task at a time

    # Retry policy defaults
    task_default_retry_delay=10,
    task_max_retries=3,

    # Result backend
    result_expires=3600,              # Results expire after 1 hour

    # Dedicated task routing
    task_routes={
        "digital_twin.app.tasks.sync_employee_node":
            {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.sync_department_node":
            {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.sync_project_node":
            {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.sync_customer_node":
            {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.sync_employee_department_edge":
            {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.sync_employee_manager_edge":
            {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.sync_ticket_assignment_edge":
            {"queue": "graph_sync_queue"},
        "digital_twin.app.tasks.remove_node":
            {"queue": "graph_sync_queue"},
    },

    # Queue declarations
    task_queues={
        "graph_sync_queue": {
            "exchange": "sentinel_exchange",
            "routing_key": "graph.sync",
        },
    },
)
```

**Configuration Rationale:**

| Parameter | Value | Rationale |
|---|---|---|
| `task_acks_late` | `True` | Tasks are acknowledged only after successful completion, preventing data loss if a worker crashes mid-execution |
| `task_reject_on_worker_lost` | `True` | If a worker process is killed (OOM, SIGKILL), the task is requeued for another worker |
| `worker_prefetch_multiplier` | `1` | Each worker fetches only one task at a time, ensuring FIFO ordering per queue |
| `task_serializer` | `json` | JSON serialization for cross-language compatibility and debuggability |
| `result_expires` | `3600` | Task results are cleaned up after 1 hour to prevent Redis memory bloat |

### 11.2 Worker Lifecycle Hooks & Connection Management

Celery signal handlers manage the Neo4j connection lifecycle:

```python
# /digital_twin/app/celery_app.py — Lifecycle Hooks

from celery.signals import worker_init, worker_shutdown

@worker_init.connect
def on_worker_init(**kwargs):
    """Initialize Neo4j driver when worker starts."""
    logger.info("Celery worker starting – initializing Neo4j connection pool...")
    is_connected = Neo4jManager.verify_connectivity()
    if not is_connected:
        logger.error(
            "CRITICAL: Cannot connect to Neo4j. "
            "Worker may fail graph sync tasks."
        )

@worker_shutdown.connect
def on_worker_shutdown(**kwargs):
    """Close Neo4j driver when worker stops."""
    logger.info("Celery worker shutting down – closing Neo4j connection pool...")
    Neo4jManager.close()
```

### 11.3 Node Synchronization Tasks

Each entity type has a dedicated Celery task for node creation/update:

| Task Name | Entity | Properties Synced | Cascading Edge Tasks |
|---|---|---|---|
| `sync_employee_node` | Employee | id, tenant_id, email, first/last name, role, status, rate | `sync_employee_department_edge`, `sync_employee_manager_edge` |
| `sync_department_node` | Department | id, tenant_id, name, code, budget, headcount | Parent department hierarchy edge |
| `sync_project_node` | Project | id, tenant_id, name, jira_key, health, date | None |
| `sync_customer_node` | Customer | id, tenant_id, company, domain, ARR, health | `MANAGES_ACCOUNT` CSM edge |

**Common Task Decorator Pattern:**
```python
@shared_task(
    bind=True,
    name="digital_twin.app.tasks.sync_employee_node",
    max_retries=5,
    default_retry_delay=10,
    autoretry_for=(TransientError, ServiceUnavailable),
    retry_backoff=True,
    retry_backoff_max=120,
)
```

### 11.4 Edge Synchronization Tasks

| Task Name | Edge Type | Source → Target | Transfer Logic |
|---|---|---|---|
| `sync_employee_department_edge` | `BELONGS_TO` | Employee → Department | Delete old edge, create new (handles transfers) |
| `sync_employee_manager_edge` | `REPORTS_TO` | Employee → Manager | Delete old edge, create new (handles reassignment) |
| `sync_ticket_assignment_edge` | `ASSIGNED_TO` | Employee → Ticket | Create edge + ensure Ticket→Project PART_OF edge |

### 11.5 Node Removal & Cascading Deletions

```python
@shared_task(bind=True, name="digital_twin.app.tasks.remove_node",
             max_retries=3, default_retry_delay=5,
             autoretry_for=(TransientError, ServiceUnavailable),
             retry_backoff=True)
def remove_node(self, node_id: str, node_label: str) -> dict:
    """Detach and delete a node and all its relationships."""
    if node_label not in ("Employee", "Department", "Project",
                          "Customer", "Ticket"):
        return {"status": "error", "detail": f"Invalid label: {node_label}"}

    cypher = f"""
    MATCH (n:{node_label} {{id: $node_id}})
    DETACH DELETE n
    """
    _execute_write(cypher, {"node_id": node_id})
    return {"status": "removed", "node_type": node_label, "id": node_id}
```

### 11.6 Retry Policies & Exponential Backoff

```
Retry Timeline for a Failed Graph Sync Task:
─────────────────────────────────────────────

Attempt 1: Immediate execution
  ↓ FAILURE (Neo4j TransientError)
  Wait: 10 seconds (default_retry_delay)

Attempt 2: Execute after 10s
  ↓ FAILURE (ServiceUnavailable)
  Wait: 20 seconds (retry_backoff: 10 × 2^1)

Attempt 3: Execute after 20s
  ↓ FAILURE (ServiceUnavailable)
  Wait: 40 seconds (retry_backoff: 10 × 2^2)

Attempt 4: Execute after 40s
  ↓ FAILURE (ServiceUnavailable)
  Wait: 80 seconds (retry_backoff: 10 × 2^3)

Attempt 5: Execute after 80s
  ↓ FAILURE (ServiceUnavailable)
  Wait: 120 seconds (capped at retry_backoff_max)

Attempt 6: Execute after 120s
  ↓ FAILURE → MaxRetriesExceeded → Dead Letter Queue → Alert
```

### 11.7 Idempotency Guarantees via MERGE Semantics

All node synchronization tasks use Neo4j's `MERGE` operation, which provides idempotent create-or-update semantics:

```cypher
-- MERGE is idempotent: safe to execute multiple times
MERGE (e:Employee {id: $employee_id})
SET e.tenant_id = $tenant_id,
    e.email = $email,
    e.first_name = $first_name,
    e.last_name = $last_name,
    e.role_title = $role_title,
    e.status = $status,
    e.billable_rate_eur = $billable_rate_eur,
    e.updated_at = datetime()
```

If the node already exists (matched by `id`), the `SET` clause updates its properties. If it doesn't exist, `MERGE` creates it. This makes the task safe for retry without creating duplicate nodes.

### 11.8 Deadlock Prevention Strategies

SentinelOS prevents Neo4j deadlocks through three mechanisms:

1. **Single-Entity MERGE:** Each MERGE operates on exactly one node, identified by its UUID. Two concurrent tasks modifying different nodes will never contend for the same lock.

2. **Sequential Edge Operations:** Edge updates are split into two separate Cypher statements (DELETE old, MERGE new), each executing in its own implicit transaction. This avoids the deadlock pattern where two transactions each hold a lock the other needs.

3. **Sorted Node ID Processing:** When bulk-importing employees, the seed script processes records sorted by UUID to establish a consistent lock acquisition order:

```python
# /scripts/seed_db.py — Sorted processing for deadlock avoidance
for employee in sorted(employees, key=lambda e: str(e.id)):
    sync_employee_node.delay(
        employee_id=str(employee.id),
        tenant_id=str(employee.tenant_id),
        # ... other fields
    )
```

---

# Part V: API Gateway & Security

---

## 12. FastAPI REST Gateway

The FastAPI gateway is the single point of entry for all client interactions with the SentinelOS platform. It handles authentication, authorization, request validation, CRUD operations, document uploads, agent queries, and WebSocket connections.

### 12.1 Application Factory & Lifespan Management

```python
# /backend/app/main.py — Application Factory

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.database import engine
from backend.app.routers import (
    employees, departments, projects, tickets,
    customers, sop_workflows, ledger_accounts,
    documents, agent, health,
)

logger = logging.getLogger("sentinel.api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    - Startup: Verify database connectivity, initialize caches
    - Shutdown: Dispose connection pools, flush logs
    """
    # ── STARTUP ──
    logger.info("SentinelOS API starting up...")
    logger.info(f"Database: {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}")
    logger.info(f"Redis: {settings.REDIS_URL}")
    yield
    # ── SHUTDOWN ──
    logger.info("SentinelOS API shutting down...")
    await engine.dispose()
    logger.info("Database connection pool disposed.")

app = FastAPI(
    title="SentinelOS AI – Digital Twin Operating System",
    description="Enterprise-grade API for organizational intelligence",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)
```

### 12.2 Router Registration & URL Namespace

All API routes are organized under the `/api/v1/` namespace with resource-oriented URL patterns:

```python
# Router registration
API_PREFIX = "/api/v1"

app.include_router(health.router, prefix=API_PREFIX, tags=["Health"])
app.include_router(employees.router, prefix=API_PREFIX, tags=["Employees"])
app.include_router(departments.router, prefix=API_PREFIX, tags=["Departments"])
app.include_router(projects.router, prefix=API_PREFIX, tags=["Projects"])
app.include_router(tickets.router, prefix=API_PREFIX, tags=["Tickets"])
app.include_router(customers.router, prefix=API_PREFIX, tags=["Customers"])
app.include_router(sop_workflows.router, prefix=API_PREFIX, tags=["SOP Workflows"])
app.include_router(ledger_accounts.router, prefix=API_PREFIX, tags=["Ledger"])
app.include_router(documents.router, prefix=API_PREFIX, tags=["Documents"])
app.include_router(agent.router, prefix=API_PREFIX, tags=["AI Agent"])
```

**Complete API Route Map:**

| Method | Endpoint | Handler | Description |
|---|---|---|---|
| `GET` | `/api/v1/health` | `health.check` | Liveness probe |
| `GET` | `/api/v1/health/ready` | `health.readiness` | Readiness probe |
| `POST` | `/api/v1/tenants` | `tenants.create` | Register new tenant |
| `GET` | `/api/v1/tenants/{id}` | `tenants.get` | Get tenant details |
| `POST` | `/api/v1/employees` | `employees.create` | Create employee |
| `GET` | `/api/v1/employees` | `employees.list` | List employees (paginated) |
| `GET` | `/api/v1/employees/{id}` | `employees.get` | Get employee by ID |
| `PUT` | `/api/v1/employees/{id}` | `employees.update` | Update employee |
| `DELETE` | `/api/v1/employees/{id}` | `employees.delete` | Delete employee |
| `POST` | `/api/v1/departments` | `departments.create` | Create department |
| `GET` | `/api/v1/departments` | `departments.list` | List departments |
| `GET` | `/api/v1/departments/{id}` | `departments.get` | Get department by ID |
| `POST` | `/api/v1/projects` | `projects.create` | Create project |
| `GET` | `/api/v1/projects` | `projects.list` | List projects |
| `GET` | `/api/v1/projects/{id}` | `projects.get` | Get project by ID |
| `POST` | `/api/v1/tickets` | `tickets.create` | Create ticket |
| `GET` | `/api/v1/tickets` | `tickets.list` | List tickets |
| `POST` | `/api/v1/customers` | `customers.create` | Create customer |
| `GET` | `/api/v1/customers` | `customers.list` | List customers |
| `POST` | `/api/v1/sop-workflows` | `sop_workflows.create` | Create SOP workflow |
| `GET` | `/api/v1/sop-workflows` | `sop_workflows.list` | List SOP workflows |
| `POST` | `/api/v1/ledger-accounts` | `ledger.create` | Create ledger account |
| `GET` | `/api/v1/ledger-accounts` | `ledger.list` | List ledger accounts |
| `POST` | `/api/v1/documents/upload` | `documents.upload` | Upload & index document |
| `POST` | `/api/v1/documents/search` | `documents.search` | Search knowledge base |
| `GET` | `/api/v1/documents` | `documents.list` | List indexed documents |
| `DELETE` | `/api/v1/documents/{id}` | `documents.delete` | Remove document |
| `POST` | `/api/v1/agent/query` | `agent.query` | Submit AI agent query |
| `WS` | `/ws/{tenant_id}` | `websockets.handler` | Real-time event stream |

### 12.3 CORS Configuration

```python
# CORS middleware for cross-origin dashboard access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Next.js dev server
        "https://app.sentinelos.ai",  # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-Total-Count"],
)
```

### 12.4 Pydantic v2 Request/Response Schemas

SentinelOS uses Pydantic v2's `BaseModel` with `model_config = ConfigDict(from_attributes=True)` for automatic ORM-to-response serialization. Below are the key schema specifications:

#### Employee Schemas (Representative Example)

```python
# /backend/app/schemas.py — Enterprise Schema Definitions

from pydantic import BaseModel, Field, EmailStr, ConfigDict
from datetime import datetime, date
from typing import Optional, List
from uuid import UUID

class EmployeeCreate(BaseModel):
    """Validated input for employee creation."""
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    role_title: str = Field(..., min_length=2, max_length=150)
    department_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    billable_rate_eur: float = Field(default=0.00, ge=0)

class EmployeeUpdate(BaseModel):
    """Partial update schema — all fields optional."""
    first_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    role_title: Optional[str] = Field(default=None, min_length=2, max_length=150)
    department_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    status: Optional[str] = None
    billable_rate_eur: Optional[float] = Field(default=None, ge=0)

class EmployeeResponse(BaseModel):
    """Serialized employee output."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    tenant_id: UUID
    email: str
    first_name: str
    last_name: str
    role_title: str
    department_id: Optional[UUID]
    manager_id: Optional[UUID]
    status: str
    billable_rate_eur: float
```

#### Paginated Response Wrapper

```python
class PaginatedResponse(BaseModel):
    """Generic paginated response for list endpoints."""
    total: int = Field(..., description="Total records matching query")
    page: int = Field(..., ge=1)
    page_size: int = Field(..., ge=1, le=100)
    items: List[dict] = Field(default_factory=list)
```

### 12.5 Endpoint Specifications by Domain

#### Employee CRUD Endpoint (Representative Implementation)

```python
# /backend/app/routers/employees.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database import get_db
from backend.app.models import Employee
from backend.app.schemas import (
    EmployeeCreate, EmployeeUpdate, EmployeeResponse, PaginatedResponse
)
from digital_twin.app.tasks import sync_employee_node

router = APIRouter()

@router.post("/employees", response_model=EmployeeResponse,
             status_code=status.HTTP_201_CREATED)
async def create_employee(
    payload: EmployeeCreate,
    tenant_id: UUID = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db),
):
    """Create a new employee and sync to knowledge graph."""
    employee = Employee(
        tenant_id=tenant_id,
        email=payload.email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        role_title=payload.role_title,
        department_id=payload.department_id,
        manager_id=payload.manager_id,
        billable_rate_eur=payload.billable_rate_eur,
    )
    db.add(employee)
    await db.flush()

    # Dispatch async graph sync task
    sync_employee_node.delay(
        employee_id=str(employee.id),
        tenant_id=str(tenant_id),
        email=employee.email,
        first_name=employee.first_name,
        last_name=employee.last_name,
        role_title=employee.role_title,
        status=employee.status,
        billable_rate_eur=float(employee.billable_rate_eur),
        department_id=str(employee.department_id) if employee.department_id else None,
        manager_id=str(employee.manager_id) if employee.manager_id else None,
    )

    return employee

@router.get("/employees", response_model=PaginatedResponse)
async def list_employees(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None),
    department_id: Optional[UUID] = Query(None),
    tenant_id: UUID = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db),
):
    """List employees with pagination and filters."""
    query = select(Employee).where(Employee.tenant_id == tenant_id)

    if status_filter:
        query = query.where(Employee.status == status_filter)
    if department_id:
        query = query.where(Employee.department_id == department_id)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar()

    # Paginate
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    employees = result.scalars().all()

    return PaginatedResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=[EmployeeResponse.model_validate(e).model_dump() for e in employees],
    )
```

### 12.6 Health Check & Readiness Probes

```python
# /backend/app/routers/health.py

@router.get("/health")
async def liveness():
    """Kubernetes liveness probe — always returns 200 if process is alive."""
    return {"status": "healthy", "service": "sentinel-api", "version": "2.0.0"}

@router.get("/health/ready")
async def readiness(db: AsyncSession = Depends(get_db)):
    """
    Kubernetes readiness probe — verifies database connectivity.
    Returns 503 if any dependency is unreachable.
    """
    checks = {}
    try:
        await db.execute(text("SELECT 1"))
        checks["postgresql"] = "connected"
    except Exception:
        checks["postgresql"] = "disconnected"
        raise HTTPException(status_code=503, detail=checks)

    checks["status"] = "ready"
    return checks
```

---

## 13. WebSocket Real-Time Event System

### 13.1 Connection Manager Architecture

The WebSocket system enables real-time event streaming to connected dashboard clients. It uses a production-grade `ConnectionManager` class with Redis Pub/Sub for cross-instance event fanout:

```python
# /backend/app/websockets.py — ConnectionManager

class ConnectionManager:
    """
    Manages active WebSocket connections grouped by tenant_id.
    Uses Redis Pub/Sub for cross-instance event broadcasting.
    """

    def __init__(self):
        self._connections: Dict[str, Set[WebSocket]] = {}
        self._redis: Redis | None = None
        self._heartbeat_interval: int = 30  # seconds
```

### 13.2 Tenant-Scoped Connection Groups

Connections are organized by `tenant_id`, ensuring that events are only broadcast to clients belonging to the same tenant:

```python
async def connect(self, websocket: WebSocket, tenant_id: str) -> None:
    """Accept a WebSocket connection and register under tenant."""
    await websocket.accept()
    if tenant_id not in self._connections:
        self._connections[tenant_id] = set()
    self._connections[tenant_id].add(websocket)

def disconnect(self, websocket: WebSocket, tenant_id: str) -> None:
    """Remove a WebSocket connection from the tenant group."""
    if tenant_id in self._connections:
        self._connections[tenant_id].discard(websocket)
        if not self._connections[tenant_id]:
            del self._connections[tenant_id]
```

### 13.3 Redis Pub/Sub Cross-Instance Fanout

```python
async def publish_event(
    self, tenant_id: str, event_type: str, data: dict
) -> None:
    """
    Publish event to Redis for cross-instance broadcast.
    Channel: sentinel:events:{tenant_id}
    """
    redis = await self._get_redis()
    channel = f"sentinel:events:{tenant_id}"
    message = {
        "event_type": event_type,
        "tenant_id": tenant_id,
        "data": data,
    }
    await redis.publish(channel, json.dumps(message))

async def subscribe_to_tenant_events(self, tenant_id: str) -> None:
    """Listen to Redis channel and forward to local WebSocket clients."""
    redis = await self._get_redis()
    pubsub = redis.pubsub()
    channel = f"sentinel:events:{tenant_id}"
    await pubsub.subscribe(channel)

    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                event = json.loads(message["data"])
                await self.broadcast_to_tenant(tenant_id, event)
    except asyncio.CancelledError:
        await pubsub.unsubscribe(channel)
```

### 13.4 Heartbeat & Stale Connection Detection

```python
async def heartbeat(self, websocket: WebSocket, tenant_id: str) -> None:
    """
    Send periodic ping frames every 30 seconds.
    Detects stale/dead connections and cleans them up.
    """
    try:
        while True:
            await asyncio.sleep(self._heartbeat_interval)
            await websocket.send_json({"type": "ping"})
    except Exception:
        self.disconnect(websocket, tenant_id)
```

### 13.5 Event Publishing API

**Supported Event Types:**

| Event Type | Trigger | Payload |
|---|---|---|
| `employee_created` | POST /employees | Employee details |
| `employee_updated` | PUT /employees/{id} | Updated fields |
| `employee_deleted` | DELETE /employees/{id} | Employee ID |
| `project_health_changed` | Health score update | Project ID, old/new score |
| `graph_sync_completed` | Celery task success | Node/edge type, entity ID |
| `document_indexed` | Document upload complete | Document ID, chunk count |
| `agent_response` | AI query complete | Query ID, response text |
| `simulation_result` | What-if simulation done | Scenario ID, impact summary |

---

## 14. Security Architecture

### 14.1 Keycloak SSO Realm Configuration

SentinelOS integrates with **Keycloak** for Single Sign-On (SSO) using the OpenID Connect (OIDC) protocol:

```yaml
# Keycloak Docker Compose Configuration
keycloak:
  image: quay.io/keycloak/keycloak:24.0
  container_name: sentinel-keycloak-dev
  environment:
    KEYCLOAK_ADMIN: admin
    KEYCLOAK_ADMIN_PASSWORD: admin_secure_pass
    KC_DB: postgres
    KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak_db
    KC_DB_USERNAME: sentinel_user
    KC_DB_PASSWORD: secure_pass
  command: start-dev
  ports:
    - "8080:8080"
  networks:
    - sentinel-bridge-net
```

**Realm Configuration:**

| Parameter | Value | Description |
|---|---|---|
| Realm Name | `sentinelos` | Dedicated realm for SentinelOS platform |
| Client ID | `sentinel-api` | Confidential client for backend API |
| Client ID | `sentinel-frontend` | Public client for Next.js frontend |
| Token Algorithm | `RS256` | RSA SHA-256 JWT signing |
| Access Token Lifespan | 15 minutes | Short-lived access tokens |
| Refresh Token Lifespan | 30 days | Long-lived refresh tokens |
| MFA Policy | Optional (enforced for Level 4+) | TOTP-based MFA for high-clearance users |

### 14.2 JWT Token Validation Pipeline

```python
# /backend/app/auth.py — JWT Validation Middleware

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.app.config import settings

security = HTTPBearer()

async def validate_jwt(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Validate JWT token from Authorization header.
    Verifies signature using Keycloak's RS256 public key.
    """
    token = credentials.credentials

    try:
        # Decode and verify JWT
        payload = jwt.decode(
            token,
            key=settings.KEYCLOAK_PUBLIC_KEY,
            algorithms=["RS256"],
            audience=settings.KEYCLOAK_CLIENT_ID,
            issuer=settings.KEYCLOAK_ISSUER_URL,
        )

        return {
            "user_id": payload.get("sub"),
            "email": payload.get("email"),
            "tenant_id": payload.get("tenant_id"),
            "system_role": payload.get("realm_access", {})
                .get("roles", [])[0],
            "security_clearance": payload.get(
                "security_clearance", 1
            ),
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )
```

### 14.3 Security Clearance Level System

SentinelOS implements a hierarchical security clearance model with five levels:

```
┌────────────────────────────────────────────────────────────────────┐
│                  SECURITY CLEARANCE HIERARCHY                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Level 5: Board / C-Suite Executives                               │
│  ───────────────────────────────────                               │
│  Access: ALL data including financial forecasts, M&A plans,        │
│          compensation data, board meeting notes                    │
│  Users: CEO, CFO, CTO, Board Members                              │
│                                                                    │
│  Level 4: Senior Leadership                                        │
│  ───────────────────────                                           │
│  Access: Department budgets, salary ranges, customer contracts,    │
│          revenue data, strategic projects                          │
│  Users: VPs, Senior Directors                                      │
│  MFA: Required                                                     │
│                                                                    │
│  Level 3: Department Managers                                      │
│  ─────────────────────────                                         │
│  Access: Own department data, team performance metrics, project    │
│          health scores, customer accounts managed by team          │
│  Users: Engineering Managers, Account Directors, Team Leads        │
│                                                                    │
│  Level 2: Senior Analysts / Specialists                            │
│  ─────────────────────────────────────                             │
│  Access: Cross-team project data, anonymized performance data,     │
│          knowledge base documents, process workflows               │
│  Users: Senior Engineers, Business Analysts, Product Managers      │
│                                                                    │
│  Level 1: Standard Users                                           │
│  ────────────────────────                                          │
│  Access: Own profile, assigned tickets, team directory,            │
│          public knowledge base documents                           │
│  Users: Individual Contributors, New Hires                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Clearance Enforcement in Agent Responses:**
```python
# The agent applies clearance masking during synthesis
def apply_clearance_filter(response: str, clearance: int) -> str:
    if clearance < 3:
        # Remove financial data from response
        response = re.sub(
            r'€[\d,.]+|EUR [\d,.]+|\$[\d,.]+',
            '[REDACTED - Insufficient Clearance]',
            response
        )
    if clearance < 4:
        # Remove salary/compensation references
        response = re.sub(
            r'(?i)(salary|compensation|bonus|equity)',
            '[REDACTED]',
            response
        )
    return response
```

### 14.4 Row-Level Security Policies

(Detailed in Section 4.6 — PostgreSQL RLS provides database-level tenant isolation as defense-in-depth below application-level JWT-based tenant filtering.)

### 14.5 API Rate Limiting & Throttling

| Tier | Rate Limit | Burst | Scope |
|---|---|---|---|
| Standard | 100 req/min | 150 req burst | Per tenant |
| Professional | 500 req/min | 750 req burst | Per tenant |
| Enterprise | 2,000 req/min | 3,000 req burst | Per tenant |
| AI Agent Queries | 20 req/min | 30 req burst | Per user |

### 14.6 OWASP Top 10 Mitigation Strategies

| OWASP Category | SentinelOS Mitigation |
|---|---|
| **A01: Broken Access Control** | JWT validation, RBAC with clearance levels, RLS policies |
| **A02: Cryptographic Failures** | TLS 1.3 in transit, AES-256 at rest, RS256 JWT signatures |
| **A03: Injection** | Parameterized queries (SQLAlchemy, Neo4j driver), keyword blocking |
| **A04: Insecure Design** | Threat modeling, security clearance architecture, defense-in-depth |
| **A05: Security Misconfiguration** | Hardened Docker images, non-root containers, env-based secrets |
| **A06: Vulnerable Components** | Weekly `pip-audit` scans, Snyk integration, dependency pinning |
| **A07: Auth Failures** | Keycloak SSO, MFA for Level 4+, bcrypt password hashing |
| **A08: Software Integrity** | Signed container images, GitHub Actions OIDC, Dependabot |
| **A09: Logging Failures** | Comprehensive audit_logs table, structured JSON logging, Sentry |
| **A10: SSRF** | Allowlist for external API calls (OpenRouter only), network policies |

### 14.7 Data Encryption at Rest & in Transit

| Layer | Encryption | Algorithm | Key Management |
|---|---|---|---|
| **TLS (Transit)** | NGINX → Client | TLS 1.3 with AEAD | Let's Encrypt auto-renewal |
| **PostgreSQL (Rest)** | Disk-level | AES-256-XTS | Cloud KMS (managed keys) |
| **Neo4j (Rest)** | Disk-level | AES-256-XTS | Cloud KMS |
| **Qdrant (Rest)** | Volume encryption | LUKS2 / AES-256 | Cloud KMS |
| **Redis (Transit)** | Stunnel/TLS proxy | TLS 1.2+ | Self-signed internal CA |
| **Backups (Rest)** | S3 SSE | AES-256-GCM | AWS KMS / equivalent |

---

# Part VI: Infrastructure & Operations

---

## 15. Docker Compose Development Environment

### 15.1 Service Definitions & Networking

The complete local development stack is defined in a single Docker Compose file:

```yaml
# /docker/docker-compose.yml — SentinelOS Development Stack

version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    container_name: sentinel-postgres-dev
    environment:
      POSTGRES_DB: sentinel_db
      POSTGRES_USER: sentinel_user
      POSTGRES_PASSWORD: secure_pass
    ports:
      - "5433:5432"
    volumes:
      - pgdata_volume:/var/lib/postgresql/data
    networks:
      - sentinel-bridge-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sentinel_user -d sentinel_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  neo4j:
    image: neo4j:5-community
    container_name: sentinel-neo4j-dev
    environment:
      NEO4J_AUTH: neo4j/secure_neo_pass
      NEO4J_PLUGINS: '["apoc"]'
    ports:
      - "7474:7474"
      - "7687:7687"
    volumes:
      - neo4jdata_volume:/data
    networks:
      - sentinel-bridge-net
    healthcheck:
      test: ["CMD", "neo4j", "status"]
      interval: 15s
      timeout: 10s
      retries: 5

  qdrant:
    image: qdrant/qdrant:v1.8.4
    container_name: sentinel-qdrant-dev
    ports:
      - "6333:6333"
    volumes:
      - qdrant_volume:/qdrant/storage
    networks:
      - sentinel-bridge-net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/healthz"]
      interval: 10s
      timeout: 5s
      retries: 3

  redis:
    image: redis:7-alpine
    container_name: sentinel-redis-dev
    ports:
      - "6380:6379"
    networks:
      - sentinel-bridge-net
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

  keycloak:
    image: quay.io/keycloak/keycloak:24.0
    container_name: sentinel-keycloak-dev
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin_secure_pass
    command: start-dev
    ports:
      - "8080:8080"
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

### 15.2 Volume Persistence Strategy

| Volume | Container Path | Purpose |
|---|---|---|
| `pgdata_volume` | `/var/lib/postgresql/data` | PostgreSQL data directory — survives container restarts |
| `neo4jdata_volume` | `/data` | Neo4j database files — preserves graph state |
| `qdrant_volume` | `/qdrant/storage` | Qdrant vector indexes — preserves embeddings |

### 15.3 Environment Variable Management

```bash
# /backend/.env — Development Environment

# Database
DB_HOST=localhost
DB_PORT=5433
DB_NAME=sentinel_db
DB_USER=sentinel_user
DB_PASSWORD=secure_pass

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=secure_neo_pass

# Qdrant
QDRANT_HOST=localhost
QDRANT_PORT=6333

# Redis
REDIS_URL=redis://localhost:6380/0

# AI/LLM
OPENROUTER_API_KEY=sk-or-v1-xxx
LLM_MODEL=openai/gpt-4o-mini
EMBEDDING_MODEL=openai/text-embedding-3-small

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=sentinelos
KEYCLOAK_CLIENT_ID=sentinel-api
KEYCLOAK_PUBLIC_KEY=<RS256_public_key>
```

---

## 16. Kubernetes Production Deployment

### 16.1 Namespace Architecture

```yaml
# Namespace isolation
apiVersion: v1
kind: Namespace
metadata:
  name: sentinelos-prod
  labels:
    app: sentinelos
    environment: production
---
apiVersion: v1
kind: Namespace
metadata:
  name: sentinelos-staging
  labels:
    app: sentinelos
    environment: staging
```

### 16.2 Deployment Manifests & Replica Strategies

```yaml
# /k8s/api-deployment.yaml — FastAPI Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sentinel-api
  namespace: sentinelos-prod
  labels:
    app: sentinel-api
    version: v2.0.0
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: sentinel-api
  template:
    metadata:
      labels:
        app: sentinel-api
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8000"
    spec:
      containers:
        - name: sentinel-api
          image: ghcr.io/sentinelos/api:v2.0.0
          ports:
            - containerPort: 8000
          envFrom:
            - secretRef:
                name: sentinel-secrets
            - configMapRef:
                name: sentinel-config
          resources:
            requests:
              cpu: "500m"
              memory: "1Gi"
            limits:
              cpu: "2000m"
              memory: "4Gi"
          livenessProbe:
            httpGet:
              path: /api/v1/health
              port: 8000
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /api/v1/health/ready
              port: 8000
            initialDelaySeconds: 15
            periodSeconds: 10
```

### 16.3 Service Mesh & Ingress Configuration

```yaml
# /k8s/ingress.yaml — NGINX Ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: sentinel-ingress
  namespace: sentinelos-prod
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "50m"
    nginx.ingress.kubernetes.io/websocket-services: "sentinel-api"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
    - hosts:
        - api.sentinelos.ai
      secretName: sentinel-tls
  rules:
    - host: api.sentinelos.ai
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: sentinel-api
                port:
                  number: 8000
```

### 16.4 Horizontal Pod Autoscaling

```yaml
# /k8s/hpa.yaml — Autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: sentinel-api-hpa
  namespace: sentinelos-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sentinel-api
  minReplicas: 3
  maxReplicas: 12
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

### 16.5 Secret Management with Vault

```yaml
# /k8s/secrets.yaml — Sealed Secrets Template
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: sentinel-secrets
  namespace: sentinelos-prod
spec:
  encryptedData:
    DB_PASSWORD: <encrypted>
    NEO4J_PASSWORD: <encrypted>
    OPENROUTER_API_KEY: <encrypted>
    KEYCLOAK_PUBLIC_KEY: <encrypted>
  template:
    metadata:
      name: sentinel-secrets
    type: Opaque
```

---

## 17. Observability & Monitoring

### 17.1 Prometheus Metrics Collection

SentinelOS exposes custom Prometheus metrics at the `/metrics` endpoint:

| Metric Name | Type | Labels | Description |
|---|---|---|---|
| `sentinel_api_requests_total` | Counter | `method`, `endpoint`, `status` | Total HTTP requests |
| `sentinel_api_request_duration_seconds` | Histogram | `method`, `endpoint` | Request latency distribution |
| `sentinel_agent_queries_total` | Counter | `tenant_id`, `tool_used` | AI agent query count |
| `sentinel_agent_latency_seconds` | Histogram | `tool_used` | Agent response time |
| `sentinel_graph_sync_tasks_total` | Counter | `task_name`, `status` | Celery task execution count |
| `sentinel_graph_sync_duration_seconds` | Histogram | `task_name` | Graph sync task duration |
| `sentinel_ws_active_connections` | Gauge | `tenant_id` | Active WebSocket connections |
| `sentinel_qdrant_search_latency_seconds` | Histogram | `tenant_id` | Vector search latency |

### 17.2 Grafana Dashboard Specifications

SentinelOS ships with four pre-built Grafana dashboards:

**Dashboard 1: API Performance Overview**
- Request rate by endpoint (QPS)
- p50/p95/p99 latency histograms
- Error rate by status code (4xx, 5xx)
- Active WebSocket connections gauge

**Dashboard 2: AI Agent Analytics**
- Agent query volume by tenant
- Tool usage distribution (vector search vs graph vs SQL)
- Average agent response time
- LLM token consumption and cost estimation

**Dashboard 3: Graph Sync Health**
- Task execution rate by type
- Task failure rate and retry count
- Queue depth (pending tasks in graph_sync_queue)
- Neo4j connection pool utilization

**Dashboard 4: Infrastructure Health**
- PostgreSQL connection pool usage
- Redis memory and connected clients
- Qdrant vector count and search latency
- Container CPU/memory utilization per pod

### 17.3 OpenTelemetry Distributed Tracing

```python
# /backend/app/telemetry.py — OTel Configuration

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

def configure_telemetry(app, engine):
    """Initialize OpenTelemetry instrumentation."""
    provider = TracerProvider()
    processor = BatchSpanProcessor(
        OTLPSpanExporter(endpoint="http://otel-collector:4317")
    )
    provider.add_span_processor(processor)
    trace.set_tracer_provider(provider)

    # Auto-instrument FastAPI and SQLAlchemy
    FastAPIInstrumentor.instrument_app(app)
    SQLAlchemyInstrumentor().instrument(engine=engine.sync_engine)
```

### 17.4 Alert Rules & Escalation Policies

| Alert | Condition | Severity | Escalation |
|---|---|---|---|
| **API High Error Rate** | 5xx rate > 5% for 5 min | P1 Critical | PagerDuty → On-call engineer |
| **API High Latency** | p99 > 5s for 10 min | P2 High | Slack #alerts → Team lead |
| **Graph Sync Backlog** | Queue depth > 1000 for 15 min | P2 High | Slack → DevOps team |
| **Neo4j Connection Failure** | Connectivity check fails 3x | P1 Critical | PagerDuty + Slack |
| **LLM API Rate Limited** | 429 responses > 10/min | P3 Medium | Slack → AI team |
| **Disk Space Low** | Volume > 85% capacity | P2 High | Slack → DevOps team |
| **Certificate Expiring** | TLS cert < 14 days to expiry | P3 Medium | Email → Security team |

### 17.5 Sentry Error Tracking & Crash Reporting

```python
# Sentry SDK initialization
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.celery import CeleryIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

sentry_sdk.init(
    dsn=settings.SENTRY_DSN,
    environment=settings.ENVIRONMENT,
    release=f"sentinel-api@{settings.VERSION}",
    traces_sample_rate=0.1,  # 10% of requests traced
    profiles_sample_rate=0.01,  # 1% CPU profiling
    integrations=[
        FastApiIntegration(),
        CeleryIntegration(),
        SqlalchemyIntegration(),
    ],
)
```

---

## 18. CI/CD Pipeline

### 18.1 GitHub Actions Workflow Specifications

```yaml
# /.github/workflows/ci.yml — Continuous Integration

name: SentinelOS CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install ruff mypy
      - run: ruff check .
      - run: mypy backend/ agents/ --ignore-missing-imports

  test:
    needs: lint
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
        ports:
          - 5432:5432
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest tests/ -v --cov=backend --cov=agents --cov-report=xml
      - uses: codecov/codecov-action@v4

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/sentinelos/api:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v4
      - run: |
          kubectl set image deployment/sentinel-api \
            sentinel-api=ghcr.io/sentinelos/api:${{ github.sha }} \
            -n sentinelos-prod
```

### 18.2 Automated Testing Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                  CI/CD PIPELINE STAGES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Stage 1: LINT (30 seconds)                                     │
│  ── ruff check . (Python linting)                               │
│  ── mypy backend/ agents/ (type checking)                       │
│                                                                 │
│  Stage 2: TEST (3-5 minutes)                                    │
│  ── pytest tests/unit/ (unit tests)                             │
│  ── pytest tests/integration/ (integration tests w/ services)   │
│  ── Coverage report → Codecov                                   │
│                                                                 │
│  Stage 3: BUILD (2-3 minutes)                                   │
│  ── Docker multi-stage build                                    │
│  ── Push to GHCR with SHA tag                                   │
│  ── Cache layers for faster rebuilds                            │
│                                                                 │
│  Stage 4: DEPLOY (1-2 minutes)                                  │
│  ── Rolling update to Kubernetes                                │
│  ── Health check verification                                   │
│  ── Smoke test against staging                                  │
│                                                                 │
│  Total Pipeline Time: ~8-12 minutes                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 18.3 Container Image Build & Registry

```dockerfile
# /docker/Dockerfile — Multi-Stage Production Build

# Stage 1: Build
FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Production
FROM python:3.12-slim AS production
WORKDIR /app
COPY --from=builder /install /usr/local
COPY backend/ backend/
COPY agents/ agents/
COPY rag/ rag/
COPY digital_twin/ digital_twin/

# Security: Run as non-root user
RUN adduser --disabled-password --no-create-home sentinel
USER sentinel

EXPOSE 8000
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000",
     "--workers", "4", "--log-level", "info"]
```

### 18.4 Blue-Green Deployment Strategy

For zero-downtime deployments, SentinelOS uses Kubernetes rolling updates with pre-stop hooks:

```yaml
spec:
  template:
    spec:
      terminationGracePeriodSeconds: 60
      containers:
        - name: sentinel-api
          lifecycle:
            preStop:
              exec:
                command: ["/bin/sh", "-c", "sleep 15"]
```

This ensures that in-flight requests complete before the old pod is terminated, and the load balancer has time to drain connections.

---

# Part VII: Frontend Architecture

---

## 19. Next.js 15 Application Shell

The SentinelOS user interface is built as a single-page application (SPA) using **Next.js 15** with the **App Router** paradigm. It leverages Server-Side Rendering (SSR) for initial shells, Client-Side Rendering (CSR) for highly interactive canvas workspaces, and Server Actions for secure form operations.

### 19.1 App Router Directory Structure

The frontend workspace is organized to enforce a clean separation between routing shells, reusable UI primitives, domain-specific state containers, and interactive canvas components.

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── employees/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── departments/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   └── page.tsx
│   │   ├── tickets/
│   │   │   └── page.tsx
│   │   ├── knowledge-base/
│   │   │   └── page.tsx
│   │   ├── process-builder/
│   │   │   └── page.tsx
│   │   ├── simulation-sandbox/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── auth/[...nextauth]/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── toast.tsx
│   ├── graph/
│   │   ├── GraphExplorer.tsx
│   │   └── GraphSidebar.tsx
│   ├── process/
│   │   ├── FlowBuilder.tsx
│   │   └── FlowNodeProperties.tsx
│   ├── dashboard/
│   │   ├── KPIWidget.tsx
│   │   └── UtilChart.tsx
│   └── navigation/
│       ├── Sidebar.tsx
│       └── Header.tsx
├── hooks/
│   ├── useWebSocket.ts
│   ├── useAuth.ts
│   └── useClearance.ts
├── lib/
│   ├── api.ts
│   ├── utils.ts
│   └── websocket.ts
├── store/
│   ├── useGraphStore.ts
│   └── useSimulationStore.ts
├── public/
│   └── assets/
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 19.2 Design System & Token Configuration

SentinelOS uses a dark-theme-first design system designed for financial analysts and operations leads. It utilizes vanilla CSS variables and Tailwind classes to build a modern interface featuring glassmorphic components, high-contrast typography, and smooth transitions.

```css
/* /frontend/app/globals.css — Enterprise Theme Variables */

@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

@layer base {
  :root {
    /* Core Grays */
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 6%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 4.9%;
    --popover-foreground: 0 0% 98%;

    /* Brand Accents */
    --primary: 263.4 70% 50.4%;       /* Neon Purple */
    --primary-foreground: 210 20% 98%;
    --secondary: 180 70% 50%;         /* Electric Teal */
    --secondary-foreground: 240 10% 3.9%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 263.4 70% 20%;
    --accent-foreground: 0 0% 98%;

    /* Alert States */
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    --success: 142.1 70.6% 45.3%;
    --success-foreground: 144.9 80.4% 10%;
    --warning: 47.9 95.8% 53.1%;
    --warning-foreground: 26 83.3% 14.1%;

    /* Borders & Rounding */
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 263.4 70% 50.4%;
    --radius: 0.75rem;

    /* Glassmorphism Presets */
    --glass-bg: rgba(15, 15, 20, 0.7);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-blur: 16px;
  }
}

@layer components {
  .glass-panel {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  }

  .glow-purple {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);
  }

  .glow-teal {
    box-shadow: 0 0 20px rgba(20, 184, 166, 0.15);
  }
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}
```

### 19.3 Authentication Provider (Keycloak Integration)

SentinelOS uses **NextAuth.js** to handle OpenID Connect authentication flow with Keycloak.

```typescript
// /frontend/app/api/auth/[...nextauth]/route.ts — NextAuth Configurations

import NextAuth, { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist access token and claims to the JWT payload
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at;

        // Parse custom claims from Keycloak
        const decoded = JSON.parse(
          Buffer.from(account.access_token!.split(".")[1], "base64").toString()
        );
        token.tenantId = decoded.tenant_id;
        token.securityClearance = decoded.security_clearance || 1;
        token.roles = decoded.realm_access?.roles || [];
      }

      // Token rotation check
      const now = Math.floor(Date.now() / 1000);
      if (now < (token.expiresAt as number)) {
        return token;
      }

      // Token expired -> refresh it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Expose claims to client-side session context
      session.accessToken = token.accessToken as string;
      session.tenantId = token.tenantId as string;
      session.securityClearance = token.securityClearance as number;
      session.roles = token.roles as string[];
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

async function refreshAccessToken(token: any) {
  try {
    const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw data;

    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token.refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
    };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 19.4 Global Layout & Navigation

The RootLayout wraps the application in the NextAuth Session Provider, TanStack Query Client Provider, and WebSocket context.

```typescript
// /frontend/app/layout.tsx — Global App Layout

import { ReactNode } from "react";
import Providers from "./providers";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen flex overflow-hidden">
        <Providers>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 bg-zinc-950">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

---

## 20. Dashboard & Visualization Components

The core user experience is built on dynamic, data-driven visualization components that allow users to interact with their digital twin.

### 20.1 Cytoscape.js Knowledge Graph Explorer

This component renders the Neo4j knowledge graph using **Cytoscape.js**, complete with dynamic node layout positioning, hover highlights, and context-dependent sidebar queries.

```typescript
// /frontend/components/graph/GraphExplorer.tsx — Interactive Graph Viewer

"use client";

import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import { useSession } from "next-auth/react";
import GraphSidebar from "./GraphSidebar";

cytoscape.use(fcose);

interface NodeData {
  id: string;
  label: string;
  type: "Employee" | "Department" | "Project" | "Customer";
  properties: Record<string, any>;
}

interface EdgeData {
  id: string;
  source: string;
  target: string;
  relationship: string;
}

export default function GraphExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const { data: session } = useSession();
  const [selectedElement, setSelectedElement] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current || !session?.accessToken) return;

    // Load initial graph topology for the tenant
    fetch("/api/v1/graph/topology", {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const elements = [
          ...data.nodes.map((node: NodeData) => ({
            data: {
              id: node.id,
              name: node.type === "Employee" 
                ? `${node.properties.first_name} ${node.properties.last_name}`
                : node.properties.name || node.properties.company,
              type: node.type,
              ...node.properties,
            },
            classes: node.type.toLowerCase(),
          })),
          ...data.edges.map((edge: EdgeData) => ({
            data: {
              id: edge.id,
              source: edge.source,
              target: edge.target,
              label: edge.relationship,
            },
          })),
        ];

        initializeGraph(elements);
      });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [session]);

  const initializeGraph = (elements: any[]) => {
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#4b5563",
            "label": "data(name)",
            "color": "#fff",
            "font-size": "10px",
            "text-valign": "center",
            "text-halign": "bottom",
            "width": 30,
            "height": 30,
            "border-width": 2,
            "border-color": "#1f2937",
          },
        },
        {
          selector: "node.employee",
          style: { "background-color": "#8b5cf6", "border-color": "#c084fc" }, /* Purple */
        },
        {
          selector: "node.department",
          style: { "background-color": "#0d9488", "border-color": "#2dd4bf" }, /* Teal */
        },
        {
          selector: "node.project",
          style: { "background-color": "#d97706", "border-color": "#fbbf24" }, /* Amber */
        },
        {
          selector: "node.customer",
          style: { "background-color": "#2563eb", "border-color": "#60a5fa" }, /* Blue */
        },
        {
          selector: "edge",
          style: {
            "width": 1.5,
            "line-color": "#374151",
            "target-arrow-color": "#374151",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "label": "data(label)",
            "font-size": "8px",
            "color": "#9ca3af",
            "text-rotation": "autorotate",
            "text-background-opacity": 0.8,
            "text-background-color": "#09090b",
            "text-background-padding": "2px",
          },
        },
        {
          selector: "node:selected",
          style: {
            "border-width": 4,
            "border-color": "#14b8a6",
            "box-shadow": "0 0 10px #14b8a6",
          },
        },
      ],
      layout: {
        name: "fcose",
        quality: "proof",
        randomize: false,
        animate: true,
        fit: true,
        padding: 50,
      } as any,
    });

    // Register node selection handler
    cyRef.current.on("tap", "node", (evt) => {
      const node = evt.target;
      setSelectedElement({
        type: "node",
        label: node.data("type"),
        id: node.id(),
        properties: node.data(),
      });
    });

    cyRef.current.on("tap", "edge", (evt) => {
      const edge = evt.target;
      setSelectedElement({
        type: "edge",
        label: edge.data("label"),
        id: edge.id(),
        properties: edge.data(),
      });
    });

    cyRef.current.on("tap", (evt) => {
      if (evt.target === cyRef.current) {
        setSelectedElement(null);
      }
    });
  };

  return (
    <div className="relative w-full h-[calc(100vh-120px)] flex">
      <div 
        ref={containerRef} 
        className="flex-1 h-full bg-zinc-950 rounded-xl border border-zinc-800"
      />
      {selectedElement && (
        <GraphSidebar 
          element={selectedElement} 
          onClose={() => setSelectedElement(null)} 
        />
      )}
    </div>
  );
}
```

### 20.2 React Flow Process Automation Builder

SentinelOS maps organizational Standard Operating Procedures (SOPs) as directed acyclic graphs of operational logic. The visual builder interface uses **React Flow** to model action blocks, decision gates, notifications, and conditional escalations.

```typescript
// /frontend/components/process/FlowBuilder.tsx — Drag and Drop SOP Builder

"use client";

import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "start",
    type: "input",
    data: { label: "Ticket Creation Trigger" },
    position: { x: 250, y: 50 },
    style: { background: "#0d9488", color: "#fff", border: "1px solid #2dd4bf" },
  },
];

const initialEdges: Edge[] = [];

export default function FlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addSOPNode = (type: "action" | "decision" | "notification") => {
    const id = `node_${Date.now()}`;
    const newNode: Node = {
      id: id,
      type: type === "decision" ? "default" : "default",
      position: { x: 250, y: nodes.length * 100 + 100 },
      data: { label: `${type.toUpperCase()} Block` },
      style: {
        background: type === "action" ? "#8b5cf6" : type === "decision" ? "#d97706" : "#2563eb",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "8px",
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  return (
    <div className="w-full h-[calc(100vh-150px)] flex flex-col">
      {/* Builder Toolbar */}
      <div className="flex gap-4 p-4 bg-zinc-900 border-b border-zinc-800 rounded-t-xl">
        <button
          onClick={() => addSOPNode("action")}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-xs font-semibold"
        >
          + Action Block
        </button>
        <button
          onClick={() => addSOPNode("decision")}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-semibold"
        >
          + Decision Block
        </button>
        <button
          onClick={() => addSOPNode("notification")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold"
        >
          + Notification Block
        </button>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 h-full bg-zinc-950">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls />
            <MiniMap style={{ background: "#1f2937" }} />
            <Background color="#374151" gap={16} />
          </ReactFlow>
        </div>

        {selectedNode && (
          <div className="w-80 h-full bg-zinc-900 border-l border-zinc-800 p-6">
            <h3 className="text-sm font-bold text-white mb-4">Node Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Node Title</label>
                <input
                  type="text"
                  value={selectedNode.data.label}
                  onChange={(e) => {
                    const nextTitle = e.target.value;
                    setNodes((nds) =>
                      nds.map((n) =>
                        n.id === selectedNode.id
                          ? { ...n, data: { ...n.data, label: nextTitle } }
                          : n
                      )
                    );
                    setSelectedNode((prev) =>
                      prev ? { ...prev, data: { ...prev.data, label: nextTitle } } : null
                    );
                  }}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Node ID</label>
                <span className="text-xs font-mono text-zinc-500">{selectedNode.id}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 20.3 Apache ECharts KPI Dashboards

Real-time transactional and billing aggregations are rendered using custom-wrapped **Apache ECharts** widgets.

```typescript
// /frontend/components/dashboard/UtilChart.tsx — Team Utilization Dashboard

"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface ChartProps {
  categories: string[];
  data: number[];
}

export default function UtilChart({ categories, data }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current, "dark");
    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: categories,
          axisLine: { lineStyle: { color: "#3f3f46" } },
          axisLabel: { color: "#a1a1aa", fontSize: 10 },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Utilization (%)",
          min: 0,
          max: 100,
          axisLine: { lineStyle: { color: "#3f3f46" } },
          axisLabel: { color: "#a1a1aa", formatter: "{value}%" },
          splitLine: { lineStyle: { color: "#1f1f23" } },
        },
      ],
      series: [
        {
          name: "Direct Utilization",
          type: "bar",
          barWidth: "40%",
          data: data,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#8b5cf6" }, // Purple glow
              { offset: 1, color: "#4c1d95" },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    };

    myChart.setOption(option);

    const handleResize = () => {
      myChart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      myChart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [categories, data]);

  return <div ref={chartRef} className="w-full h-80" />;
}
```

### 20.4 Simulation Sandbox Workspace

The simulation sandbox gives leadership tools to model organizational changes (layoffs, budget adjustments, customer churn) before committing changes to PostgreSQL.

```
┌────────────────────────────────────────────────────────────────────────┐
│                     SIMULATION SANDBOX INTERFACE                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ Scenario Selection ]                 [ Active Impact Modeling ]     │
│  ┌─────────────────────────┐            ┌───────────────────────────┐  │
│  │ Scenario Name           │            │ Target Entity: EM-9021    │  │
│  │ [Q4 Financial Reprofil] │            │ Impact Model: Outplacement│  │
│  └─────────────────────────┘            └───────────────────────────┘  │
│                                                                        │
│  [ Impact Comparison Graph (Cytoscape Preview) ]                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │   (Dept: Engineering) ──[REALLOCATE]──► (Dept: Marketing)        │  │
│  │            │                                    │                │  │
│  │     (Emp: Jane Doe)                      (Emp: John Smith)       │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  [ Aggregated Delta KPI Projections ]                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐  │
│  │ Monthly Run Rate     │  │ Net ARR Retention    │  │ Project SLA  │  │
│  │ -€45,000 / month     │  │ +0.8% YoY            │  │ -3.4 days    │  │
│  │ (Savings)            │  │ (Growth)             │  │ (Risk Alert) │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────┘  │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 21. Real-Time Client Architecture

### 21.1 WebSocket Hook Implementation

This dynamic React hook connects to the REST gateway's WebSocket endpoint, processes server-sent events, implements exponential backoff reconnection, and uses `BroadcastChannel` to sync events across duplicate tabs.

```typescript
// /frontend/hooks/useWebSocket.ts — Client WebSocket Controller

"use client";

import { useEffect, useRef, useState } from "react";

interface WSEvent {
  event_type: string;
  tenant_id: string;
  data: any;
}

export function useWebSocket(tenantId: string | undefined, token: string | undefined) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<WSEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectDelay = 30000; // 30s limit

  useEffect(() => {
    if (!tenantId || !token) return;

    // Cross-tab event syncing channel
    const broadcastChannel = new BroadcastChannel(`sentinel:ws:${tenantId}`);

    const connect = () => {
      // Clean old connection if existing
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Establish WebSocket protocol stream
      const wsUrl = `wss://api.sentinelos.ai/ws/${tenantId}?token=${token}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        console.log("WebSocket connected to real-time event stream.");
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "ping") {
            ws.send(JSON.stringify({ type: "pong" }));
            return;
          }

          setLastEvent(payload);
          // Broadcast to other tabs open on the same tenant
          broadcastChannel.postMessage(payload);
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        if (event.wasClean) return;

        // Auto-reconnection logic with exponential backoff
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttemptsRef.current),
          maxReconnectDelay
        );
        reconnectAttemptsRef.current += 1;

        console.warn(`WebSocket closed. Reconnecting in ${delay}ms...`);
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };

      ws.onerror = (err) => {
        console.error("WebSocket transport error:", err);
      };
    };

    connect();

    // Listen to broadcasts from duplicate tabs
    broadcastChannel.onmessage = (event) => {
      setLastEvent(event.data);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      broadcastChannel.close();
    };
  }, [tenantId, token]);

  return { isConnected, lastEvent };
}
```

### 21.2 Notification System & Alert Banners

The platform uses a centralized event routing pattern. When the `useWebSocket` hook catches an event (such as `project_health_changed`), it displays a custom toast notification containing links to the target component.

```typescript
// /frontend/components/ui/toast.tsx — Representative component structure
import React from 'react';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export function Toast({ message, onClose }: { message: ToastMessage; onClose: () => void }) {
  const typeStyles = {
    info: 'bg-zinc-900 border-zinc-800 text-zinc-200',
    success: 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200',
    warning: 'bg-amber-950/80 border-amber-500/30 text-amber-200',
    error: 'bg-red-950/80 border-red-500/30 text-red-200',
  };

  return (
    <div className={`p-4 rounded-lg border shadow-xl flex justify-between items-start ${typeStyles[message.type]} animate-slide-in`}>
      <div>
        <h4 className="text-sm font-semibold">{message.title}</h4>
        <p className="text-xs text-zinc-400 mt-1">{message.description}</p>
      </div>
      <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 ml-4">
        &times;
      </button>
    </div>
  );
}
```

### 21.3 Optimistic UI Updates

To prevent network latency from making the interface feel sluggish, the Next.js shell implements optimistic UI updates using TanStack Query mutations.

```typescript
// /frontend/hooks/useUpdateEmployee.ts — Optimistic Cache Updates

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  role_title: string;
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedEmployee: Employee) => {
      const res = await fetch(`/api/v1/employees/${updatedEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEmployee),
      });
      if (!res.ok) throw new Error("Server update failed");
      return res.json();
    },
    // Executed before network call starts
    onMutate: async (updatedEmployee) => {
      // Cancel outgoing refetches to prevent overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["employees", updatedEmployee.id] });

      // Snapshot the old state for rollback fallback
      const previousValue = queryClient.getQueryData(["employees", updatedEmployee.id]);

      // Optimistically update cache values immediately
      queryClient.setQueryData(["employees", updatedEmployee.id], updatedEmployee);

      // Return context containing snapshot
      return { previousValue };
    },
    // If mutation fails, rollback cache to previous value
    onError: (err, updatedEmployee, context) => {
      if (context?.previousValue) {
        queryClient.setQueryData(["employees", updatedEmployee.id], context.previousValue);
      }
    },
    // Always refetch to sync with server state in the background
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["employees", "list"] });
    },
  });
}
```

---

# Part VIII: Testing, Compliance & Appendices

---

## 22. Testing Strategy

SentinelOS enforces a strict, multi-tiered testing strategy spanning unit, integration, end-to-end, and performance testing. Every pull request must meet a mandatory **90% code coverage threshold** verified in the GitHub Actions CI pipeline.

### 22.1 Unit Test Framework & Coverage Targets

The backend test suite is built on **pytest** and **pytest-asyncio** for asynchronous coroutine execution. Test execution uses a sandboxed PostgreSQL container where each test runs within an isolated transaction block that is rolled back upon test completion to guarantee state sanitization.

```python
# /tests/conftest.py — Test Database Isolation & Lifespan Hooks

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from backend.app.database import Base
from backend.app.main import app

# Dedicated in-memory or containerized test database
TEST_DATABASE_URL = "postgresql+asyncpg://test_user:test_pass@localhost:5432/test_db"

test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = sessionmaker(
    test_engine, class_=AsyncSession, expire_on_commit=False
)

@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_db():
    """Create schemas and drop them after the entire session ends."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture
async def db_session() -> AsyncSession:
    """
    Provide transactional boundary for a single test.
    Rolls back changes to ensure database state is clean.
    """
    async with test_engine.connect() as connection:
        transaction = await connection.begin()
        async_session = AsyncSession(bind=connection, expire_on_commit=False)

        yield async_session

        await async_session.close()
        await transaction.rollback()
```

### 22.2 Integration Test Suite

Integration tests verify data pathways across boundaries: PostgreSQL trigger to Celery, Celery worker to Neo4j transaction context, and LangGraph tool execution loops.

#### Representative Integration Test: Graph Sync Validation

```python
# /tests/integration/test_graph_sync.py — Replication Verification

import pytest
from unittest.mock import patch
from digital_twin.app.tasks import sync_employee_node
from digital_twin.app.neo4j_manager import Neo4jManager

@pytest.mark.asyncio
async def test_sync_employee_creation_in_neo4j():
    """Verify that employee sync task correctly merges node in Neo4j."""
    test_employee = {
        "employee_id": "f5f59048-7bf0-4100-8809-5e7e39a3f2d2",
        "tenant_id": "aa3c3482-132d-45df-9d33-a61efcf1db21",
        "email": "integration.test@sentinelos.ai",
        "first_name": "Integration",
        "last_name": "Tester",
        "role_title": "Automation Engineer",
        "status": "active",
        "billable_rate_eur": 120.00,
    }

    # Execute sync task synchronously (bypass broker for integration test)
    result = sync_employee_node.apply(kwargs=test_employee)
    assert result.status == "SUCCESS"

    # Verify node exists in Neo4j with correct attributes
    cypher = """
    MATCH (e:Employee {id: $employee_id, tenant_id: $tenant_id})
    RETURN e.email as email, e.role_title as role
    """
    with Neo4jManager.get_session() as session:
        record = session.run(
            cypher,
            employee_id=test_employee["employee_id"],
            tenant_id=test_employee["tenant_id"]
        ).single()

        assert record is not None
        assert record["email"] == test_employee["email"]
        assert record["role"] == test_employee["role_title"]
```

#### Representative Integration Test: LangGraph State Execution

```python
# /tests/integration/test_agent_execution.py

import pytest
from agents.graph import agent_executor

@pytest.mark.asyncio
async def test_agent_graph_intent_routing():
    """Test that LangGraph correctly routes SQL queries for structured queries."""
    state_input = {
        "messages": [
            {"role": "user", "content": "What is the total department budget for Engineering?"}
        ],
        "tenant_id": "aa3c3482-132d-45df-9d33-a61efcf1db21",
        "security_clearance": 4,
    }

    # Execute LangGraph compile executor
    output = await agent_executor.ainvoke(state_input)

    # Assert that tool execution node was visited
    assert len(output["messages"]) > 1
    last_message = output["messages"][-1]
    assert "Engineering" in last_message.content
    assert "budget" in last_message.content.lower()
```

### 22.3 End-to-End Test Scenarios

E2E tests simulate user interaction paths using **Playwright**.

```typescript
// /tests/e2e/simulation-flow.spec.ts — Scenario Automation

import { test, expect } from "@playwright/test";

test.describe("SentinelOS Simulation Sandbox E2E", () => {
  test("User can load dashboard, login via Keycloak, and run sandbox scenario", async ({ page }) => {
    // 1. Visit App Router Gateway
    await page.goto("https://app.sentinelos.ai/");
    await expect(page).toHaveTitle(/SentinelOS/);

    // 2. Login Flow (Redirects to Keycloak)
    await page.fill('input[name="username"]', "cfo_user");
    await page.fill('input[name="password"]', "cfo_pass_secure");
    await page.click('button[type="submit"]');

    // 3. Confirm Dashboard Load
    await expect(page.locator("nav")).toContainText("Digital Twin");
    
    // 4. Navigate to Process Builder
    await page.click('a[href="/simulation-sandbox"]');
    await expect(page.locator("h1")).toContainText("Simulation Sandbox");

    // 5. Trigger 'What-If' Scenario Run
    await page.click("button:has-text('New Scenario')");
    await page.fill('input[placeholder="Scenario Name"]', "Q4 Reorg");
    await page.click("button:has-text('Run Simulation')");

    // 6. Check Results Drawer
    const resultsPanel = page.locator(".impact-panel");
    await expect(resultsPanel).toBeVisible();
    await expect(resultsPanel).toContainText("Monthly Run Rate Delta");
  });
});
```

### 22.4 Load Testing & Performance Benchmarks

API rate metrics and latency limits are checked using **Locust** load test scenarios.

```python
# /tests/performance/locustfile.py — Load Benchmarking

import random
from locust import HttpUser, task, between

class SentinelOSLoadTester(HttpUser):
  wait_time = between(1, 5)

  def on_start(self):
    """Obtain access token from Keycloak mock or environment."""
    self.headers = {"Authorization": "Bearer test_access_token_mock_val"}
    self.tenant_id = "aa3c3482-132d-45df-9d33-a61efcf1db21"

  @task(3)
  def view_employees(self):
    """Benchmark paginated employee list endpoint."""
    self.client.get(
        "/api/v1/employees?page=1&page_size=20",
        headers=self.headers
    )

  @task(1)
  def query_ai_agent(self):
    """Benchmark agent cognitive loop endpoint latency."""
    payload = {
        "query": "How many tickets are assigned to active engineers?",
        "clearance_level": 3
    }
    self.client.post(
        "/api/v1/agent/query",
        json=payload,
        headers=self.headers
    )
```

**Target Latency Service Level Objectives (SLOs):**

| Endpoint Type | P50 Latency | P99 Latency | Target Throughput |
|---|---|---|---|
| REST Read Operations | < 100ms | < 250ms | 2000 req/sec |
| REST Write Operations | < 150ms | < 400ms | 500 req/sec |
| WebSocket Message Delivery | < 20ms | < 100ms | 10,000 active sessions |
| Vector Retrieval | < 50ms | < 120ms | 500 queries/sec |
| Agentic Pipeline (Graph + LLM) | < 1.5s | < 4.0s | 50 queries/sec |

---

## 23. Compliance & Regulatory

SentinelOS is built for deployments in highly regulated enterprise spaces, including finance, healthcare, and infrastructure management.

### 23.1 GDPR Data Protection Compliance

SentinelOS enforces standard personal data handling protocols:

- **Right to Be Forgotten (Erasure):** When an employee node is deleted, the data synchronization engine runs cascading deletes that permanently wipe their PII.
- **Cascading Deletion Implementation:**

```python
# Cascading PII deletion logic in digital twin sync engine
def gdpr_erasure_pipeline(employee_id: str, tenant_id: str):
    """
    Ensure complete erasure of employee PII across storage tiers.
    Leaves relations intact via anonymized nodes if required.
    """
    # 1. PostgreSQL transaction handles relational constraint cascade
    # (Sets email, first_name, last_name to null or deletes depending on archival policy)
    
    # 2. Neo4j detachment & deletion
    cypher = """
    MATCH (e:Employee {id: $emp_id, tenant_id: $t_id})
    OPTIONAL MATCH (e)-[r]-()
    DELETE r, e
    """
    _execute_write(cypher, {"emp_id": employee_id, "t_id": tenant_id})

    # 3. Qdrant vector deletion
    client = get_qdrant_client()
    client.delete(
        collection_name="sentinel_knowledge_base",
        points_selector=Filter(
            must=[
                FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id)),
                FieldCondition(key="employee_id", match=MatchValue(value=employee_id))
            ]
        )
    )
```

- **Encryption & Key Separation:** Tenant data is encrypted at rest using keys unique to each tenant (Envelope Encryption pattern via Cloud KMS).

### 23.2 SOC 2 Type II Audit Readiness

To maintain SOC 2 Type II compliance, SentinelOS continuously exports security logs to our observability stack.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SOC 2 COMPLIANCE ARCHITECTURE                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ Client Actions ]        [ Keycloak SSO ]         [ Audit Trail ]    │
│  ┌────────────────┐        ┌──────────────┐         ┌────────────────┐ │
│  │ User Login     ├───────►│ MFA Enforce  ├────────►│ Log Event:     │ │
│  └────────────────┘        └──────────────┘         │ USR-102 Authed │ │
│                                                     └───────┬────────┘ │
│                                                             │          │
│  [ Database Write ]        [ RLS Constraint ]               │          │
│  ┌────────────────┐        ┌──────────────┐                 │          │
│  │ DB Mutation    ├───────►│ Tenant Isolation               │          │
│  └────────────────┘        └──────────────┘                 ▼          │
│                                                     ┌────────────────┐ │
│                                                     │ Splunk / OTel  │ │
│                                                     │ Log Aggregator │ │
│                                                     └────────────────┘ │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

**Key compliance configurations:**

1. **Immutable Audit Trail:** All database writes are logged to the `audit_logs` table. Triggers prevent deletion of records in this table.
2. **Access Control Verification:** keycloak configuration blocks session sharing and logs authentication events to OTel.
3. **Weekly Dependency Scanning:** `pip-audit` runs on every deploy, failing builds that contain CVEs with a severity score > 7.0.

### 23.3 ISO 27001 Information Security

SentinelOS adheres to ISO 27001 control sets:

- **A.12.6.1 Management of technical vulnerabilities:** Automated dependencies patching via Dependabot.
- **A.9.4.1 Information access restriction:** Strict security clearance roles (Level 1 to 5) configured inside our JWT token parsing filter.
- **A.14.1.1 Information security requirements analysis and specification:** Security review mandatory for all backend structural modifications.

### 23.4 Data Residency & Sovereignty

For global enterprises, SentinelOS supports tenant routing configurations that restrict data movement across geographical boundaries.

```yaml
# Kubernetes NodeAffinity rule for localized storage
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: topology.kubernetes.io/region
                operator: In
                values:
                  - eu-central-1  # Enforce European data residency
```

- **Sovereign Cloud Deployments:** Tenant relational clusters can be bound to specific availability zones to comply with local laws (such as GDPR in Europe or HIPAA in the US).

---

## 24. Appendices

---

### Appendix A: Complete API Endpoint Reference

| Path | Verb | Request Payload | Response Payload | Description |
|---|---|---|---|---|
| `/api/v1/health` | `GET` | None | `{"status": "healthy"}` | Liveness check |
| `/api/v1/employees` | `POST` | `EmployeeCreate` | `EmployeeResponse` | Register new employee |
| `/api/v1/employees/{id}` | `PUT` | `EmployeeUpdate` | `EmployeeResponse` | Modify employee metadata |
| `/api/v1/employees/{id}` | `DELETE` | None | `{"status": "deleted"}` | Remove employee |
| `/api/v1/departments` | `POST` | `DeptCreate` | `DeptResponse` | Add department |
| `/api/v1/projects` | `POST` | `ProjCreate` | `ProjResponse` | Create project node |
| `/api/v1/agent/query` | `POST` | `AgentQueryRequest` | `AgentQueryResponse` | Submit query to agent |
| `/ws/{tenant_id}` | `WS` | None | Real-time WS Frame | WebSocket channel |

---

### Appendix B: Database Schema Entity-Relationship Diagram

```mermaid
erDiagram
    TENANTS ||--o{ EMPLOYEES : "owns"
    TENANTS ||--o{ DEPARTMENTS : "owns"
    TENANTS ||--o{ PROJECTS : "owns"
    TENANTS ||--o{ CUSTOMERS : "owns"
    
    DEPARTMENTS ||--o{ EMPLOYEES : "belongs_to"
    EMPLOYEES ||--o{ EMPLOYEES : "reports_to"
    
    PROJECTS ||--o{ TICKETS : "contains"
    EMPLOYEES ||--o{ TICKETS : "assigned_to"
    CUSTOMERS ||--o{ PROJECTS : "funds"
    
    EMPLOYEES {
        uuid id PK
        uuid tenant_id FK
        string email
        string first_name
        string last_name
        string role_title
        uuid department_id FK
        uuid manager_id FK
        string status
        numeric billable_rate_eur
    }
    
    DEPARTMENTS {
        uuid id PK
        uuid tenant_id FK
        string name
        string code
        numeric budget
    }
```

---

### Appendix C: Glossary of Technical Terms

- **Digital Twin:** A dynamic virtual representation of an organization's resources, structures, and processes.
- **LangGraph:** A framework from LangChain used to build stateful multi-agent workflows.
- **RAG (Retrieval-Augmented Generation):** Enhancing LLM outputs by retrieving relevant documents from a vector database before generation.
- **Row-Level Security (RLS):** Database engine architecture that filters rows returned by queries based on the executing user's context.
- **SOP (Standard Operating Procedure):** Step-by-step instructions compiled by an organization to help workers carry out complex routine operations.

---

### Appendix D: Risk Register & Mitigation Matrix

| Risk ID | Description | Severity | Probability | Mitigation Strategy |
|---|---|---|---|---|
| **RSK-01** | Cross-tenant data leakage via shared Redis broker cache. | High | Low | Implement tenant-prefixed namespaces for all Redis keys and use strict ACL rules. |
| **RSK-02** | Prompt injection leading to write operations via Agent tools. | Critical | Medium | Layered validation: block keywords in tools, parameterize Cypher/SQL, configure read-only database users. |
| **RSK-03** | Neo4j out-of-memory error during large hierarchy traversals. | Medium | Medium | Set Cypher limits (`LIMIT 100`) and enforce resource execution limits on the Neo4j engine. |
| **RSK-04** | Out-of-sync relational and graph states due to worker loss. | High | Low | Enable `task_acks_late=True` and configure reconciliation tasks that run hourly. |

---

### Appendix E: Capacity Planning & Scaling Projections

To support enterprise scaling, the system's resource requirements are modeled based on employee count:

```
Tenant Size: 10,000 Employees
─────────────────────────────────────────────
PostgreSQL DB Storage:   ~50 GB / year
Neo4j Graph Database:    ~25 million relationships
Neo4j Disk Footprint:    ~120 GB
Qdrant Vector Points:    ~500,000 chunks
Qdrant RAM Overhead:     ~8 GB (HNSW Indexing)
Redis Active Memory:     ~4 GB
Total API Containers:    3 replicas (minimum)
```

**Memory Overhead Calculation:**

$$\text{RAM}_{\text{Qdrant}} \approx (\text{Dimensions} \times 4 \text{ bytes}) \times \text{VectorsCount} \times 1.2 \text{ (Index Overhead)}$$

For 1536-dimensional embeddings and 500,000 vectors:

$$\text{RAM}_{\text{Qdrant}} \approx (1536 \times 4) \times 500,000 \times 1.2 = 3.68 \text{ GB (Bare Vector Cache)}$$
Enforcing an 8 GB system allocation ensures sufficient overhead for processing queries under high load.

---

### Appendix F: Keycloak Client OIDC Configuration Schema

For enterprise deployments, the SSO client configurations are pre-defined in a JSON schema that can be loaded directly into Keycloak.

```json
{
  "clientId": "sentinel-api",
  "name": "SentinelOS API Gateway Client",
  "description": "Secure client configuration with RBAC claims and MFA policy",
  "rootUrl": "https://api.sentinelos.ai",
  "adminUrl": "https://api.sentinelos.ai",
  "baseUrl": "/api/v1",
  "surrogateAuthRequired": false,
  "enabled": true,
  "alwaysDisplayInConsole": false,
  "clientAuthenticatorType": "client-secret",
  "secret": "**********",
  "redirectUris": [
    "https://app.sentinelos.ai/*",
    "http://localhost:3000/*"
  ],
  "webOrigins": [
    "https://app.sentinelos.ai",
    "http://localhost:3000"
  ],
  "notBefore": 0,
  "bearerOnly": false,
  "consentRequired": false,
  "standardFlowEnabled": true,
  "implicitFlowEnabled": false,
  "directAccessGrantsEnabled": true,
  "serviceAccountsEnabled": true,
  "authorizationServicesEnabled": true,
  "publicClient": false,
  "frontchannelLogout": true,
  "protocol": "openid-connect",
  "attributes": {
    "access.token.lifespan": "900",
    "client.session.idle.timeout": "1800",
    "client.session.max.lifespan": "36000",
    "client_credentials.use_refresh_token": "false",
    "display.on.consent.screen": "false",
    "oauth2.device.authorization.grant.enabled": "false",
    "backchannel.logout.session.required": "true"
  },
  "protocolMappers": [
    {
      "name": "tenant_id",
      "protocol": "openid-connect",
      "protocolMapper": "oidc-user-attribute-mapper",
      "consentRequired": false,
      "config": {
        "user.attribute": "tenant_id",
        "claim.name": "tenant_id",
        "jsonType.label": "String",
        "id.token.claim": "true",
        "access.token.claim": "true",
        "userinfo.token.claim": "true"
      }
    },
    {
      "name": "security_clearance",
      "protocol": "openid-connect",
      "protocolMapper": "oidc-user-attribute-mapper",
      "consentRequired": false,
      "config": {
        "user.attribute": "security_clearance",
        "claim.name": "security_clearance",
        "jsonType.label": "int",
        "id.token.claim": "true",
        "access.token.claim": "true",
        "userinfo.token.claim": "true"
      }
    }
  ]
}
```

---

### Appendix G: Production High-Availability Clustering Specification

For million-dollar unicorn enterprises requiring high availability and fault tolerance, SentinelOS scales using clustered infrastructure.

```yaml
# /docker/docker-compose-ha.yml — High Availability Cluster Layout

version: "3.9"

services:
  # ── postgresql high availability cluster ──
  pg-primary:
    image: bitnami/postgresql-repmgr:16
    container_name: sentinel-pg-primary
    environment:
      - POSTGRESQL_PASSWORD=primary_secure_pass
      - POSTGRESQL_USERNAME=sentinel_user
      - POSTGRESQL_DATABASE=sentinel_db
      - REPMGR_PRIMARY_HOST=pg-primary
      - REPMGR_PARTNER_NODES=pg-primary,pg-replica
      - REPMGR_NODE_NUMBER=1
    volumes:
      - pg_primary_data:/bitnami/postgresql

  pg-replica:
    image: bitnami/postgresql-repmgr:16
    container_name: sentinel-pg-replica
    environment:
      - POSTGRESQL_PASSWORD=primary_secure_pass
      - POSTGRESQL_USERNAME=sentinel_user
      - POSTGRESQL_DATABASE=sentinel_db
      - REPMGR_PRIMARY_HOST=pg-primary
      - REPMGR_PARTNER_NODES=pg-primary,pg-replica
      - REPMGR_NODE_NUMBER=2
    volumes:
      - pg_replica_data:/bitnami/postgresql
    depends_on:
      - pg-primary

  # ── redis sentinel cluster for broker / cache ──
  redis-master:
    image: bitnami/redis:7-debian-11
    environment:
      - REDIS_REPLICATION_MODE=master
      - REDIS_PASSWORD=redis_secure_pass

  redis-replica:
    image: bitnami/redis:7-debian-11
    environment:
      - REDIS_REPLICATION_MODE=replica
      - REDIS_MASTER_HOST=redis-master
      - REDIS_MASTER_PORT_NUMBER=6379
      - REDIS_PASSWORD=redis_secure_pass
      - REDIS_MASTER_PASSWORD=redis_secure_pass
    depends_on:
      - redis-master

  redis-sentinel:
    image: bitnami/redis-sentinel:7-debian-11
    environment:
      - REDIS_SENTINEL_DOWN_AFTER_MILLISECONDS=3000
      - REDIS_SENTINEL_FAILOVER_TIMEOUT=9000
      - REDIS_MASTER_PASSWORD=redis_secure_pass
      - REDIS_SENTINEL_PASSWORD=redis_secure_pass
    depends_on:
      - redis-master
      - redis-replica

volumes:
  pg_primary_data:
  pg_replica_data:
```

---

### Appendix H: Disaster Recovery & Failover Runbook

This playbook details the step-by-step procedures to recover SentinelOS systems in the event of primary database corruption, worker pool failures, or hardware loss.

#### Case 1: PostgreSQL Master Database Failure & Failover

In a production Kubernetes deployment using repmgr or patroni, database failover is handled automatically. If automatic promotion fails, manual intervention must follow this sequence:

1. **Stop active API gateways** to prevent partial writes:
   ```bash
   kubectl scale deployment sentinel-api --replicas=0 -n sentinelos-prod
   ```

2. **Promote the database replica** to primary:
   ```bash
   kubectl exec -it sentinel-pg-replica-0 -n sentinelos-prod -- repmgr standby promote
   ```

3. **Update database configurations** inside ConfigMap to route traffic to the promoted primary, then scale the API gateway replicas back up:
   ```bash
   kubectl scale deployment sentinel-api --replicas=3 -n sentinelos-prod
   ```

#### Case 2: Out-of-Sync Neo4j Knowledge Graph Reconciliation

If Celery tasks are lost or database synchronization breaks due to network partitioning:

1. **Execute the offline graph rebuild script** to perform a complete batch sync from the relational database to Neo4j:
   ```bash
   python -m scripts.rebuild_graph --tenant-all --batch-size=1000
   ```

2. The reconciliation script will:
   - Match all PostgreSQL records by tenant.
   - Run batch `MERGE` operations on nodes.
   - Delete orphaned graph elements that no longer exist in PostgreSQL.

#### Case 3: Qdrant Vector Index Corruption

If Qdrant indices become corrupted or vector payloads are lost:

1. **Restore index configuration from backup snapshots**:
   ```bash
   curl -X POST "http://qdrant-primary:6333/collections/sentinel_knowledge_base/snapshots/restore" \
     -H "Content-Type: application/json" \
     -d '{"location": "s3://sentinel-backups/qdrant/sentinel_knowledge_base_snapshot_latest.tar"}'
   ```

2. **Trigger background re-indexing of documents** if snapshots are corrupted:
   ```bash
   python -m rag.reindex_documents --tenant-all
   ```
   This script parses all uploaded document bytes stored in object storage (S3), generates new embeddings using OpenAI models, and bulk-upserts them to the Qdrant cluster.

