"""
SentinelOS AI – Graph Synchronization Tasks

Production-grade Celery tasks that replicate relational data
changes from PostgreSQL to the Neo4j graph database. Each task
handles node creation/update and edge relationship management
with proper transaction isolation and retry logic.
"""

import logging
from typing import Optional, Dict, Any
from celery import shared_task
from neo4j.exceptions import (
    TransientError,
    ServiceUnavailable,
    ClientError,
)

from digital_twin.app.neo4j_manager import Neo4jManager

logger = logging.getLogger("sentinel.tasks.graph_sync")


# ─────────────────────────────────────────────────────────────────
# Helper: Execute a write transaction with retry semantics
# ─────────────────────────────────────────────────────────────────

def _execute_write(cypher: str, parameters: Dict[str, Any]) -> None:
    """
    Execute a Cypher write query within a Neo4j transaction.
    Handles driver session lifecycle and logs execution details.
    """
    with Neo4jManager.get_session() as session:
        session.run(cypher, parameters)
    logger.debug(f"Cypher executed: {cypher[:80]}... params={list(parameters.keys())}")


# ─────────────────────────────────────────────────────────────────
# Node Sync: Employee
# ─────────────────────────────────────────────────────────────────

@shared_task(
    bind=True,
    name="digital_twin.app.tasks.sync_employee_node",
    max_retries=5,
    default_retry_delay=10,
    autoretry_for=(TransientError, ServiceUnavailable),
    retry_backoff=True,
    retry_backoff_max=120,
)
def sync_employee_node(
    self,
    employee_id: str,
    tenant_id: str,
    email: str,
    first_name: str,
    last_name: str,
    role_title: str,
    status: str,
    billable_rate_eur: float,
    department_id: Optional[str] = None,
    manager_id: Optional[str] = None,
) -> dict:
    """
    Create or update an Employee node in Neo4j.
    Uses MERGE to be idempotent – safe for retries.
    """
    cypher = """
    MERGE (e:Employee {id: $employee_id})
    SET e.tenant_id = $tenant_id,
        e.email = $email,
        e.first_name = $first_name,
        e.last_name = $last_name,
        e.role_title = $role_title,
        e.status = $status,
        e.billable_rate_eur = $billable_rate_eur,
        e.updated_at = datetime()
    """
    _execute_write(cypher, {
        "employee_id": employee_id,
        "tenant_id": tenant_id,
        "email": email,
        "first_name": first_name,
        "last_name": last_name,
        "role_title": role_title,
        "status": status,
        "billable_rate_eur": billable_rate_eur,
    })

    # Sync department edge if department_id is provided
    if department_id:
        sync_employee_department_edge.delay(employee_id, department_id, tenant_id)

    # Sync manager reporting edge if manager_id is provided
    if manager_id:
        sync_employee_manager_edge.delay(employee_id, manager_id, tenant_id)

    logger.info(f"Employee node synced: id={employee_id}")
    return {"status": "synced", "node_type": "Employee", "id": employee_id}


# ─────────────────────────────────────────────────────────────────
# Node Sync: Department
# ─────────────────────────────────────────────────────────────────

@shared_task(
    bind=True,
    name="digital_twin.app.tasks.sync_department_node",
    max_retries=5,
    default_retry_delay=10,
    autoretry_for=(TransientError, ServiceUnavailable),
    retry_backoff=True,
    retry_backoff_max=120,
)
def sync_department_node(
    self,
    department_id: str,
    tenant_id: str,
    name: str,
    code: str,
    budget_limit_eur: float,
    headcount_target: int,
    parent_department_id: Optional[str] = None,
) -> dict:
    """Create or update a Department node in Neo4j."""
    cypher = """
    MERGE (d:Department {id: $department_id})
    SET d.tenant_id = $tenant_id,
        d.name = $name,
        d.code = $code,
        d.budget_limit_eur = $budget_limit_eur,
        d.headcount_target = $headcount_target,
        d.updated_at = datetime()
    """
    _execute_write(cypher, {
        "department_id": department_id,
        "tenant_id": tenant_id,
        "name": name,
        "code": code,
        "budget_limit_eur": budget_limit_eur,
        "headcount_target": headcount_target,
    })

    # Sync parent department hierarchy edge
    if parent_department_id:
        parent_cypher = """
        MATCH (child:Department {id: $child_id})
        MATCH (parent:Department {id: $parent_id})
        MERGE (child)-[:REPORTS_TO]->(parent)
        """
        _execute_write(parent_cypher, {
            "child_id": department_id,
            "parent_id": parent_department_id,
        })

    logger.info(f"Department node synced: id={department_id}")
    return {"status": "synced", "node_type": "Department", "id": department_id}


# ─────────────────────────────────────────────────────────────────
# Node Sync: Project
# ─────────────────────────────────────────────────────────────────

@shared_task(
    bind=True,
    name="digital_twin.app.tasks.sync_project_node",
    max_retries=5,
    default_retry_delay=10,
    autoretry_for=(TransientError, ServiceUnavailable),
    retry_backoff=True,
    retry_backoff_max=120,
)
def sync_project_node(
    self,
    project_id: str,
    tenant_id: str,
    name: str,
    jira_project_key: str,
    health_score: float,
    target_completion_date: str,
) -> dict:
    """Create or update a Project node in Neo4j."""
    cypher = """
    MERGE (p:Project {id: $project_id})
    SET p.tenant_id = $tenant_id,
        p.name = $name,
        p.jira_project_key = $jira_project_key,
        p.health_score = $health_score,
        p.target_completion_date = $target_completion_date,
        p.updated_at = datetime()
    """
    _execute_write(cypher, {
        "project_id": project_id,
        "tenant_id": tenant_id,
        "name": name,
        "jira_project_key": jira_project_key,
        "health_score": health_score,
        "target_completion_date": target_completion_date,
    })

    logger.info(f"Project node synced: id={project_id}")
    return {"status": "synced", "node_type": "Project", "id": project_id}


# ─────────────────────────────────────────────────────────────────
# Node Sync: Customer
# ─────────────────────────────────────────────────────────────────

@shared_task(
    bind=True,
    name="digital_twin.app.tasks.sync_customer_node",
    max_retries=5,
    default_retry_delay=10,
    autoretry_for=(TransientError, ServiceUnavailable),
    retry_backoff=True,
    retry_backoff_max=120,
)
def sync_customer_node(
    self,
    customer_id: str,
    tenant_id: str,
    company_name: str,
    domain: str,
    contract_value_arr: float,
    health_score: float,
    assigned_csm_id: Optional[str] = None,
) -> dict:
    """Create or update a Customer node in Neo4j."""
    cypher = """
    MERGE (c:Customer {id: $customer_id})
    SET c.tenant_id = $tenant_id,
        c.company_name = $company_name,
        c.domain = $domain,
        c.contract_value_arr = $contract_value_arr,
        c.health_score = $health_score,
        c.updated_at = datetime()
    """
    _execute_write(cypher, {
        "customer_id": customer_id,
        "tenant_id": tenant_id,
        "company_name": company_name,
        "domain": domain,
        "contract_value_arr": contract_value_arr,
        "health_score": health_score,
    })

    # Link CSM relationship
    if assigned_csm_id:
        csm_cypher = """
        MATCH (c:Customer {id: $customer_id})
        MATCH (e:Employee {id: $csm_id})
        MERGE (e)-[:MANAGES_ACCOUNT]->(c)
        """
        _execute_write(csm_cypher, {
            "customer_id": customer_id,
            "csm_id": assigned_csm_id,
        })

    logger.info(f"Customer node synced: id={customer_id}")
    return {"status": "synced", "node_type": "Customer", "id": customer_id}


# ─────────────────────────────────────────────────────────────────
# Edge Sync: Employee → Department (BELONGS_TO)
# ─────────────────────────────────────────────────────────────────

@shared_task(
    bind=True,
    name="digital_twin.app.tasks.sync_employee_department_edge",
    max_retries=5,
    default_retry_delay=10,
    autoretry_for=(TransientError, ServiceUnavailable),
    retry_backoff=True,
    retry_backoff_max=120,
)
def sync_employee_department_edge(
    self,
    employee_id: str,
    department_id: str,
    tenant_id: str,
) -> dict:
    """
    Create the BELONGS_TO relationship between Employee and Department.
    First removes any existing department edge to handle transfers,
    then creates the new one.
    """
    # Remove old department relationship
    remove_cypher = """
    MATCH (e:Employee {id: $employee_id})-[r:BELONGS_TO]->(:Department)
    DELETE r
    """
    _execute_write(remove_cypher, {"employee_id": employee_id})

    # Create new relationship
    create_cypher = """
    MATCH (e:Employee {id: $employee_id})
    MATCH (d:Department {id: $department_id})
    MERGE (e)-[:BELONGS_TO {since: datetime()}]->(d)
    """
    _execute_write(create_cypher, {
        "employee_id": employee_id,
        "department_id": department_id,
    })

    logger.info(f"Edge synced: Employee({employee_id})-[:BELONGS_TO]->Department({department_id})")
    return {"status": "synced", "edge": "BELONGS_TO", "from": employee_id, "to": department_id}


# ─────────────────────────────────────────────────────────────────
# Edge Sync: Employee → Manager (REPORTS_TO)
# ─────────────────────────────────────────────────────────────────

@shared_task(
    bind=True,
    name="digital_twin.app.tasks.sync_employee_manager_edge",
    max_retries=5,
    default_retry_delay=10,
    autoretry_for=(TransientError, ServiceUnavailable),
    retry_backoff=True,
    retry_backoff_max=120,
)
def sync_employee_manager_edge(
    self,
    employee_id: str,
    manager_id: str,
    tenant_id: str,
) -> dict:
    """
    Create the REPORTS_TO relationship between an Employee and their Manager.
    Handles manager reassignment by removing old edges first.
    """
    # Remove old manager relationship
    remove_cypher = """
    MATCH (e:Employee {id: $employee_id})-[r:REPORTS_TO]->(:Employee)
    DELETE r
    """
    _execute_write(remove_cypher, {"employee_id": employee_id})

    # Create new relationship
    create_cypher = """
    MATCH (e:Employee {id: $employee_id})
    MATCH (m:Employee {id: $manager_id})
    MERGE (e)-[:REPORTS_TO {since: datetime()}]->(m)
    """
    _execute_write(create_cypher, {
        "employee_id": employee_id,
        "manager_id": manager_id,
    })

    logger.info(f"Edge synced: Employee({employee_id})-[:REPORTS_TO]->Employee({manager_id})")
    return {"status": "synced", "edge": "REPORTS_TO", "from": employee_id, "to": manager_id}


# ─────────────────────────────────────────────────────────────────
# Edge Sync: Employee → Ticket (ASSIGNED_TO)
# ─────────────────────────────────────────────────────────────────

@shared_task(
    bind=True,
    name="digital_twin.app.tasks.sync_ticket_assignment_edge",
    max_retries=5,
    default_retry_delay=10,
    autoretry_for=(TransientError, ServiceUnavailable),
    retry_backoff=True,
    retry_backoff_max=120,
)
def sync_ticket_assignment_edge(
    self,
    ticket_id: str,
    employee_id: str,
    project_id: str,
    tenant_id: str,
) -> dict:
    """
    Create the ASSIGNED_TO relationship between Employee and Ticket,
    and ensure the Ticket → Project edge exists.
    """
    # Link employee to ticket
    assign_cypher = """
    MERGE (t:Ticket {id: $ticket_id})
    SET t.tenant_id = $tenant_id, t.updated_at = datetime()
    WITH t
    MATCH (e:Employee {id: $employee_id})
    MERGE (e)-[:ASSIGNED_TO]->(t)
    """
    _execute_write(assign_cypher, {
        "ticket_id": ticket_id,
        "employee_id": employee_id,
        "tenant_id": tenant_id,
    })

    # Link ticket to project
    project_cypher = """
    MATCH (t:Ticket {id: $ticket_id})
    MATCH (p:Project {id: $project_id})
    MERGE (t)-[:PART_OF]->(p)
    """
    _execute_write(project_cypher, {
        "ticket_id": ticket_id,
        "project_id": project_id,
    })

    logger.info(f"Edge synced: Employee({employee_id})-[:ASSIGNED_TO]->Ticket({ticket_id})")
    return {"status": "synced", "edge": "ASSIGNED_TO", "from": employee_id, "to": ticket_id}


# ─────────────────────────────────────────────────────────────────
# Node Removal
# ─────────────────────────────────────────────────────────────────

@shared_task(
    bind=True,
    name="digital_twin.app.tasks.remove_node",
    max_retries=3,
    default_retry_delay=5,
    autoretry_for=(TransientError, ServiceUnavailable),
    retry_backoff=True,
)
def remove_node(
    self,
    node_id: str,
    node_label: str,
) -> dict:
    """
    Detach and delete a node and all its relationships from Neo4j.
    Used when a record is hard-deleted from PostgreSQL.
    """
    if node_label not in ("Employee", "Department", "Project", "Customer", "Ticket"):
        logger.error(f"Invalid node label for deletion: {node_label}")
        return {"status": "error", "detail": f"Invalid label: {node_label}"}

    cypher = f"""
    MATCH (n:{node_label} {{id: $node_id}})
    DETACH DELETE n
    """
    _execute_write(cypher, {"node_id": node_id})

    logger.info(f"Node removed: {node_label}({node_id})")
    return {"status": "removed", "node_type": node_label, "id": node_id}
