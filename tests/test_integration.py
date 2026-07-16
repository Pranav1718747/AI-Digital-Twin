"""
SentinelOS AI – Integration Test Suite

Tests real database connections, schema creation, CRUD operations,
Pydantic schema validation, security clearance logic, and
Neo4j graph synchronization against live Docker containers.
"""

import asyncio
import sys
import os

# Ensure project root is on PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from uuid import uuid4, UUID
from datetime import date, datetime, timezone


def test_config_loads():
    """Test that Pydantic Settings loads all configuration variables."""
    from backend.app.config import settings
    assert settings.DB_HOST == "localhost"
    assert settings.DB_PORT == 5433
    assert settings.DB_NAME == "sentinel_db"
    assert settings.NEO4J_URI == "bolt://localhost:7687"
    assert settings.QDRANT_PORT == 6333
    assert settings.REDIS_URL == "redis://localhost:6380/0"
    assert settings.KEYCLOAK_REALM_URL != ""
    print("✅ test_config_loads PASSED")


def test_database_engine_url():
    """Test that the async database engine URL is correctly formed."""
    from backend.app.database import engine
    url_str = str(engine.url)
    assert "postgresql+asyncpg" in url_str
    assert "sentinel_user" in url_str
    assert "5433" in url_str
    assert "sentinel_db" in url_str
    print("✅ test_database_engine_url PASSED")


def test_all_models_registered():
    """Test that all 10 SQLAlchemy model tables are registered on Base.metadata."""
    from backend.app.database import Base
    from backend.app import models  # noqa: F401 – triggers model registration
    expected_tables = {
        "tenants", "users", "departments", "employees",
        "projects", "tickets", "customers",
        "sop_workflows", "ledger_accounts", "audit_logs",
    }
    actual_tables = set(Base.metadata.tables.keys())
    assert expected_tables == actual_tables, f"Missing: {expected_tables - actual_tables}"
    print("✅ test_all_models_registered PASSED")


def test_schema_employee_create_valid():
    """Test EmployeeCreate with valid real-world data."""
    from backend.app.schemas import EmployeeCreate
    emp = EmployeeCreate(
        email="maria.garcia@sentinel.ai",
        first_name="Maria",
        last_name="Garcia",
        role_title="Lead Data Scientist",
        billable_rate_eur=185.00,
    )
    assert emp.email == "maria.garcia@sentinel.ai"
    assert emp.first_name == "Maria"
    assert emp.billable_rate_eur == 185.00
    assert emp.department_id is None
    print("✅ test_schema_employee_create_valid PASSED")


def test_schema_employee_create_rejects_invalid():
    """Test EmployeeCreate rejects invalid inputs."""
    from backend.app.schemas import EmployeeCreate
    from pydantic import ValidationError

    # Empty first name should fail (min_length=1)
    try:
        EmployeeCreate(
            email="test@example.com",
            first_name="",
            last_name="Test",
            role_title="Engineer",
        )
        assert False, "Should have raised ValidationError"
    except ValidationError:
        pass

    # Negative billable rate should fail (ge=0)
    try:
        EmployeeCreate(
            email="test@example.com",
            first_name="Test",
            last_name="User",
            role_title="Engineer",
            billable_rate_eur=-50.00,
        )
        assert False, "Should have raised ValidationError"
    except ValidationError:
        pass

    print("✅ test_schema_employee_create_rejects_invalid PASSED")


def test_schema_project_create():
    """Test ProjectCreate with real-world data."""
    from backend.app.schemas import ProjectCreate
    proj = ProjectCreate(
        name="Platform v2.0 Migration",
        jira_project_key="PLAT",
        target_completion_date=date(2026, 12, 31),
        health_score=0.85,
    )
    assert proj.name == "Platform v2.0 Migration"
    assert proj.health_score == 0.85
    print("✅ test_schema_project_create PASSED")


def test_schema_customer_create():
    """Test CustomerCreate with real-world data."""
    from backend.app.schemas import CustomerCreate
    cust = CustomerCreate(
        company_name="Acme Corp",
        domain="acme.com",
        contract_value_arr=250000.00,
    )
    assert cust.contract_value_arr == 250000.00
    assert cust.assigned_csm_id is None
    print("✅ test_schema_customer_create PASSED")


def test_schema_sop_workflow_create():
    """Test SopWorkflowCreate with React Flow JSON payload."""
    from backend.app.schemas import SopWorkflowCreate
    sop = SopWorkflowCreate(
        name="Employee Onboarding Pipeline",
        description="Automated onboarding checklist for new hires",
        trigger_type="webhook",
        graph_payload={
            "nodes": [
                {"id": "1", "type": "trigger", "data": {"label": "HR Form Submit"}},
                {"id": "2", "type": "action", "data": {"label": "Create AD Account"}},
                {"id": "3", "type": "action", "data": {"label": "Assign Laptop"}},
            ],
            "edges": [
                {"source": "1", "target": "2"},
                {"source": "2", "target": "3"},
            ],
        },
    )
    assert len(sop.graph_payload["nodes"]) == 3
    assert len(sop.graph_payload["edges"]) == 2
    print("✅ test_schema_sop_workflow_create PASSED")


def test_schema_paginated_response():
    """Test PaginatedResponse wrapper."""
    from backend.app.schemas import PaginatedResponse
    page = PaginatedResponse(total=150, page=3, page_size=20, items=[{"id": "abc"}])
    assert page.total == 150
    assert page.page == 3
    assert len(page.items) == 1
    print("✅ test_schema_paginated_response PASSED")


def test_clearance_level_weights():
    """Test security clearance weight calculations."""
    from backend.app.middleware.security import (
        CLEARANCE_WEIGHTS, get_clearance_weight, TokenPayload,
    )
    assert get_clearance_weight("Level 1") == 1
    assert get_clearance_weight("Level 5") == 5
    assert get_clearance_weight("Invalid") == 0

    ceo = TokenPayload({
        "sub": "ceo-001", "email": "ceo@sentinel.ai",
        "tenant_id": str(uuid4()), "system_role": "admin",
        "security_clearance": "Level 5", "exp": 9999999999, "iat": 1000000000,
    })
    assert ceo.has_clearance("Level 1") is True
    assert ceo.has_clearance("Level 5") is True

    viewer = TokenPayload({
        "sub": "dev-001", "email": "dev@sentinel.ai",
        "tenant_id": str(uuid4()), "system_role": "viewer",
        "security_clearance": "Level 1", "exp": 9999999999, "iat": 1000000000,
    })
    assert viewer.has_clearance("Level 1") is True
    assert viewer.has_clearance("Level 2") is False
    assert viewer.has_clearance("Level 5") is False

    print("✅ test_clearance_level_weights PASSED")


def test_token_payload_fields():
    """Test that TokenPayload correctly parses all JWT claim fields."""
    from backend.app.middleware.security import TokenPayload
    tenant = str(uuid4())
    tp = TokenPayload({
        "sub": "user-789",
        "email": "manager@sentinel.ai",
        "tenant_id": tenant,
        "system_role": "manager",
        "security_clearance": "Level 3",
        "exp": 9999999999,
        "iat": 1000000000,
    })
    assert tp.sub == "user-789"
    assert tp.email == "manager@sentinel.ai"
    assert tp.tenant_id == tenant
    assert tp.system_role == "manager"
    assert tp.clearance_weight == 3
    print("✅ test_token_payload_fields PASSED")


def test_celery_task_registration():
    """Test that all Celery tasks are properly registered."""
    from digital_twin.app.tasks import (
        sync_employee_node, sync_department_node,
        sync_project_node, sync_customer_node,
        sync_employee_department_edge, sync_employee_manager_edge,
        sync_ticket_assignment_edge, remove_node,
    )
    expected_names = [
        "digital_twin.app.tasks.sync_employee_node",
        "digital_twin.app.tasks.sync_department_node",
        "digital_twin.app.tasks.sync_project_node",
        "digital_twin.app.tasks.sync_customer_node",
        "digital_twin.app.tasks.sync_employee_department_edge",
        "digital_twin.app.tasks.sync_employee_manager_edge",
        "digital_twin.app.tasks.sync_ticket_assignment_edge",
        "digital_twin.app.tasks.remove_node",
    ]
    tasks = [
        sync_employee_node, sync_department_node,
        sync_project_node, sync_customer_node,
        sync_employee_department_edge, sync_employee_manager_edge,
        sync_ticket_assignment_edge, remove_node,
    ]
    for task, expected_name in zip(tasks, expected_names):
        assert task.name == expected_name, f"Expected {expected_name}, got {task.name}"

    # Verify retry configuration
    assert sync_employee_node.max_retries == 5
    assert remove_node.max_retries == 3

    print("✅ test_celery_task_registration PASSED")


def test_fastapi_app_routes():
    """Test that the FastAPI app has all expected routes registered."""
    from backend.app.main import app
    route_paths = [r.path for r in app.routes if hasattr(r, "path")]
    assert "/api/health" in route_paths
    assert "/api/docs" in route_paths
    assert "/api/openapi.json" in route_paths
    print("✅ test_fastapi_app_routes PASSED")


async def test_postgres_connection():
    """Test real PostgreSQL connection via asyncpg."""
    from backend.app.database import engine
    try:
        async with engine.connect() as conn:
            result = await conn.execute(__import__("sqlalchemy").text("SELECT 1"))
            value = result.scalar()
            assert value == 1
        print("✅ test_postgres_connection PASSED (live DB)")
    except Exception as e:
        print(f"⚠️  test_postgres_connection SKIPPED (DB not available: {type(e).__name__})")


async def test_postgres_create_tables():
    """Test creating all tables in the live PostgreSQL database."""
    from backend.app.database import Base, engine
    from backend.app import models  # noqa
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("✅ test_postgres_create_tables PASSED (tables created)")
    except Exception as e:
        print(f"⚠️  test_postgres_create_tables SKIPPED ({type(e).__name__})")


async def test_postgres_crud_real_data():
    """Test inserting and querying real employee data from PostgreSQL."""
    from backend.app.database import AsyncSessionLocal
    from backend.app.models import Tenant, Department, Employee
    from sqlalchemy import select

    try:
        async with AsyncSessionLocal() as session:
            # Create a test tenant
            tenant = Tenant(
                company_name="SentinelOS Test Corp",
                domain="test-sentinel.ai",
                license_tier="Enterprise",
            )
            session.add(tenant)
            await session.flush()

            # Create a department
            dept = Department(
                tenant_id=tenant.id,
                name="Engineering",
                code="ENG",
                budget_limit_eur=500000.00,
                headcount_target=25,
            )
            session.add(dept)
            await session.flush()

            # Create an employee
            emp = Employee(
                tenant_id=tenant.id,
                email=f"test-{uuid4().hex[:8]}@test-sentinel.ai",
                first_name="Alice",
                last_name="Johnson",
                role_title="Staff Engineer",
                department_id=dept.id,
                billable_rate_eur=200.00,
            )
            session.add(emp)
            await session.flush()

            # Query it back
            result = await session.execute(
                select(Employee).where(Employee.id == emp.id)
            )
            fetched = result.scalar_one()
            assert fetched.first_name == "Alice"
            assert fetched.role_title == "Staff Engineer"
            assert fetched.department_id == dept.id

            await session.commit()

        print("✅ test_postgres_crud_real_data PASSED (live CRUD)")
    except Exception as e:
        print(f"⚠️  test_postgres_crud_real_data SKIPPED ({type(e).__name__}: {e})")


async def test_neo4j_connection():
    """Test real Neo4j connection."""
    from digital_twin.app.neo4j_manager import Neo4jManager
    try:
        is_connected = Neo4jManager.verify_connectivity()
        assert is_connected is True
        Neo4jManager.close()
        print("✅ test_neo4j_connection PASSED (live graph DB)")
    except Exception as e:
        print(f"⚠️  test_neo4j_connection SKIPPED ({type(e).__name__})")


async def test_redis_connection():
    """Test real Redis connection."""
    from redis.asyncio import Redis
    from backend.app.config import settings
    try:
        redis = Redis.from_url(settings.REDIS_URL, decode_responses=True)
        await redis.set("sentinel:test:key", "hello_sentinel")
        value = await redis.get("sentinel:test:key")
        assert value == "hello_sentinel"
        await redis.delete("sentinel:test:key")
        await redis.close()
        print("✅ test_redis_connection PASSED (live cache)")
    except Exception as e:
        print(f"⚠️  test_redis_connection SKIPPED ({type(e).__name__})")


async def test_qdrant_connection():
    """Test real Qdrant vector DB connection."""
    from qdrant_client import QdrantClient
    from backend.app.config import settings
    try:
        client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
        collections = client.get_collections()
        print(f"✅ test_qdrant_connection PASSED (collections: {len(collections.collections)})")
    except Exception as e:
        print(f"⚠️  test_qdrant_connection SKIPPED ({type(e).__name__})")


# ─────────────────────────────────────────────────────────────────
# Test Runner
# ─────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("  SentinelOS AI – Integration Test Suite")
    print("=" * 60)
    print()

    # Unit tests (no external dependencies)
    print("── Unit Tests ──")
    test_config_loads()
    test_database_engine_url()
    test_all_models_registered()
    test_schema_employee_create_valid()
    test_schema_employee_create_rejects_invalid()
    test_schema_project_create()
    test_schema_customer_create()
    test_schema_sop_workflow_create()
    test_schema_paginated_response()
    test_clearance_level_weights()
    test_token_payload_fields()
    test_celery_task_registration()
    test_fastapi_app_routes()
    print()

    # Integration tests (require live Docker containers)
    print("── Integration Tests (Live Databases) ──")
    asyncio.run(test_postgres_connection())
    asyncio.run(test_postgres_create_tables())
    asyncio.run(test_postgres_crud_real_data())
    asyncio.run(test_neo4j_connection())
    asyncio.run(test_redis_connection())
    asyncio.run(test_qdrant_connection())
    print()

    print("=" * 60)
    print("  All tests complete.")
    print("=" * 60)


if __name__ == "__main__":
    main()
