"""
SentinelOS AI – Agentic Tools

Provides tool functions for the LLM agents to query the hybrid database architecture.
Agents can dynamically choose to search the knowledge graph (Neo4j),
vector space (Qdrant), or relational store (Postgres) based on the user's intent.
"""

import logging
from typing import Dict, Any, List, Optional
from langchain_core.tools import tool

from rag.pipeline import RAGPipeline
from digital_twin.app.neo4j_manager import Neo4jManager
from backend.app.database import AsyncSessionLocal
from sqlalchemy import text

logger = logging.getLogger("sentinel.agents.tools")


@tool
async def search_documents_tool(query: str, tenant_id: str, top_k: int = 3) -> str:
    """
    Search the vector database for unstructured information found in company documents,
    PDFs, policies, and historical notes.
    """
    import uuid
    try:
        tenant_uuid = uuid.UUID(tenant_id)
        results = await RAGPipeline.retrieve_context(query, tenant_uuid, top_k)
        if not results:
            return "No relevant documents found."
            
        formatted = ""
        for i, res in enumerate(results):
            formatted += f"--- Document {i+1} (Score: {res['score']:.2f}) ---\n"
            formatted += f"Text: {res['text']}\n"
            metadata = res.get('metadata', {})
            if 'file_name' in metadata:
                formatted += f"Source: {metadata['file_name']}\n"
            formatted += "\n"
        return formatted
    except Exception as e:
        logger.error(f"Error in search_documents_tool: {e}")
        return f"Error executing document search: {e}"


@tool
def query_knowledge_graph_tool(cypher_query: str, tenant_id: str) -> str:
    """
    Execute a read-only Cypher query against the Neo4j knowledge graph.
    Use this to find relationships between employees, departments, projects, and tickets.
    IMPORTANT: The cypher query MUST include `tenant_id = $tenant_id` in its WHERE clause
    for security isolation. Do not attempt to write or mutate data.

    Knowledge Graph Schema:
    - Nodes:
      - (d:Department {id: str, tenant_id: str, name: str, code: str})
      - (e:Employee {id: str, tenant_id: str, email: str, first_name: str, last_name: str, role_title: str})
      - (p:Project {id: str, tenant_id: str, name: str, jira_project_key: str})
      - (c:Customer {id: str, tenant_id: str, company_name: str, domain: str})
      - (t:Ticket {id: str, tenant_id: str, ticket_key: str, title: str, status: str})
    - Relationships:
      - (e)-[:BELONGS_TO]->(d)
      - (e)-[:REPORTS_TO]->(e) (manager line)
      - (e)-[:ASSIGNED_TO]->(t)
      - (t)-[:PART_OF]->(p)
      - (e)-[:MANAGES_ACCOUNT]->(c)
    """
    try:
        # Basic safeguard against malicious writes
        if any(keyword in cypher_query.upper() for keyword in ["CREATE", "MERGE", "SET", "DELETE", "REMOVE", "DROP"]):
            return "Error: Only read-only (MATCH/RETURN) queries are permitted."
            
        with Neo4jManager.get_session() as session:
            result = session.run(cypher_query, {"tenant_id": tenant_id})
            records = [record.data() for record in result]
            
            if not records:
                return "No matching relationships found in the knowledge graph."
                
            return str(records)
    except Exception as e:
        logger.error(f"Error in query_knowledge_graph_tool: {e}")
        return f"Error executing graph query: {e}"


@tool
async def query_relational_db_tool(sql_query: str, tenant_id: str) -> str:
    """
    Execute a read-only SQL query against the PostgreSQL database.
    Use this for aggregations, exact financial metrics (ARR, budgets), and strict entity lookups.
    IMPORTANT: You MUST ensure the query filters by `tenant_id` using parameterized queries.
    The parameter name is :tenant_id.

    PostgreSQL Relational Schema:
    - departments (id UUID PRIMARY KEY, tenant_id UUID, name VARCHAR, code VARCHAR, parent_department_id UUID, budget_limit_eur NUMERIC, headcount_target INTEGER)
    - employees (id UUID PRIMARY KEY, tenant_id UUID, user_id UUID, email VARCHAR, first_name VARCHAR, last_name VARCHAR, role_title VARCHAR, department_id UUID FOREIGN KEY departments.id, manager_id UUID FOREIGN KEY employees.id, status VARCHAR, billable_rate_eur NUMERIC)
    - projects (id UUID PRIMARY KEY, tenant_id UUID, name VARCHAR, jira_project_key VARCHAR, health_score NUMERIC, target_completion_date DATE)
    - tickets (id UUID PRIMARY KEY, project_id UUID FOREIGN KEY projects.id, ticket_key VARCHAR, title VARCHAR, status VARCHAR, story_points INTEGER, assigned_employee_id UUID FOREIGN KEY employees.id, target_date DATE)
    - customers (id UUID PRIMARY KEY, tenant_id UUID, company_name VARCHAR, domain VARCHAR, contract_value_arr NUMERIC, health_score NUMERIC, assigned_csm_id UUID FOREIGN KEY employees.id, is_active BOOLEAN)
    """
    try:
        if any(keyword in sql_query.upper() for keyword in ["INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "GRANT"]):
            return "Error: Only read-only (SELECT) queries are permitted."

        async with AsyncSessionLocal() as session:
            # We inject tenant_id as a bind parameter to prevent cross-tenant access.
            # The LLM is expected to use :tenant_id in its query string.
            result = await session.execute(text(sql_query), {"tenant_id": tenant_id})
            rows = result.mappings().all()
            
            if not rows:
                return "No matching records found in the database."
                
            return str([dict(row) for row in rows])
    except Exception as e:
        logger.error(f"Error in query_relational_db_tool: {e}")
        return f"Error executing SQL query: {e}"
