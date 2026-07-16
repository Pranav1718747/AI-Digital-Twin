import asyncio
from uuid import UUID, uuid4
from datetime import date, datetime, timezone
from sqlalchemy import select
from backend.app.database import AsyncSessionLocal, engine, Base
from backend.app.models import (
    Tenant,
    Department,
    Employee,
    Project,
    Ticket,
    Customer,
    SopWorkflow,
    User,
    AuditLog,
    LedgerAccount,
)
from digital_twin.app.tasks import (
    sync_employee_node,
    sync_department_node,
    sync_project_node,
    sync_customer_node,
    sync_ticket_assignment_edge,
)
from digital_twin.app.celery_app import celery_app
celery_app.set_current()

# Constants
TENANT_ID = UUID("703489c2-45bd-443d-b31b-987a3d5d3e74")

async def seed():
    print("Starting database seeding...")
    async with AsyncSessionLocal() as session:
        # 1. Clean existing data in dependency order
        print("Cleaning existing database records...")
        for table in reversed(Base.metadata.sorted_tables):
            print(f"Deleting from {table.name}...")
            await session.execute(table.delete())
        await session.commit()
        print("Database clean up complete.")

        # 2. Re-create Tenant
        tenant = Tenant(
            id=TENANT_ID,
            company_name="SentinelOS Digital Twin",
            domain="sentinelos.com",
            license_tier="Enterprise",
        )
        session.add(tenant)
        await session.flush()
        print(f"Created Tenant: {tenant.company_name} ({tenant.id})")

        # 3. Add Departments
        print("Creating departments...")
        eng_dept = Department(
            id=uuid4(),
            tenant_id=TENANT_ID,
            name="Engineering",
            code="ENG",
            budget_limit_eur=1500000.00,
            headcount_target=20,
        )
        prod_dept = Department(
            id=uuid4(),
            tenant_id=TENANT_ID,
            name="Product Management",
            code="PROD",
            budget_limit_eur=500000.00,
            headcount_target=5,
        )
        sales_dept = Department(
            id=uuid4(),
            tenant_id=TENANT_ID,
            name="Sales & Success",
            code="SALE",
            budget_limit_eur=800000.00,
            headcount_target=10,
        )
        hr_dept = Department(
            id=uuid4(),
            tenant_id=TENANT_ID,
            name="Human Resources",
            code="HR",
            budget_limit_eur=300000.00,
            headcount_target=3,
        )
        session.add_all([eng_dept, prod_dept, sales_dept, hr_dept])
        await session.flush()

        # 4. Add Employees
        print("Creating employees...")
        sarah = Employee(
            id=uuid4(),
            tenant_id=TENANT_ID,
            email="sarah@sentinelos.com",
            first_name="Sarah",
            last_name="Connor",
            role_title="Chief Executive Officer",
            department_id=hr_dept.id,
            manager_id=None,
            status="Active",
            billable_rate_eur=500.00,
        )
        session.add(sarah)
        await session.flush()

        john = Employee(
            id=uuid4(),
            tenant_id=TENANT_ID,
            email="john@sentinelos.com",
            first_name="John",
            last_name="Doe",
            role_title="VP of Engineering",
            department_id=eng_dept.id,
            manager_id=sarah.id,
            status="Active",
            billable_rate_eur=250.00,
        )
        charlie = Employee(
            id=uuid4(),
            tenant_id=TENANT_ID,
            email="charlie@sentinelos.com",
            first_name="Charlie",
            last_name="Davis",
            role_title="Director of Product",
            department_id=prod_dept.id,
            manager_id=sarah.id,
            status="Active",
            billable_rate_eur=200.00,
        )
        david = Employee(
            id=uuid4(),
            tenant_id=TENANT_ID,
            email="david@sentinelos.com",
            first_name="David",
            last_name="Evans",
            role_title="Sales Director",
            department_id=sales_dept.id,
            manager_id=sarah.id,
            status="Active",
            billable_rate_eur=220.00,
        )
        session.add_all([john, charlie, david])
        await session.flush()

        jane = Employee(
            id=uuid4(),
            tenant_id=TENANT_ID,
            email="jane@sentinelos.com",
            first_name="Jane",
            last_name="Smith",
            role_title="Staff Engineer",
            department_id=eng_dept.id,
            manager_id=john.id,
            status="Active",
            billable_rate_eur=180.00,
        )
        alice = Employee(
            id=uuid4(),
            tenant_id=TENANT_ID,
            email="alice@sentinelos.com",
            first_name="Alice",
            last_name="Johnson",
            role_title="Senior Developer",
            department_id=eng_dept.id,
            manager_id=john.id,
            status="Active",
            billable_rate_eur=150.00,
        )
        bob = Employee(
            id=uuid4(),
            tenant_id=TENANT_ID,
            email="bob@sentinelos.com",
            first_name="Bob",
            last_name="Brown",
            role_title="Developer",
            department_id=eng_dept.id,
            manager_id=john.id,
            status="Active",
            billable_rate_eur=120.00,
        )
        emma = Employee(
            id=uuid4(),
            tenant_id=TENANT_ID,
            email="emma@sentinelos.com",
            first_name="Emma",
            last_name="Watson",
            role_title="Customer Success Manager",
            department_id=sales_dept.id,
            manager_id=david.id,
            status="Active",
            billable_rate_eur=130.00,
        )
        session.add_all([jane, alice, bob, emma])
        await session.flush()

        # 5. Add Projects
        print("Creating projects...")
        genesis = Project(
            id=uuid4(),
            tenant_id=TENANT_ID,
            name="Project Genesis",
            jira_project_key="GEN",
            health_score=0.95,
            target_completion_date=date(2026, 12, 31),
        )
        apollo = Project(
            id=uuid4(),
            tenant_id=TENANT_ID,
            name="Project Apollo",
            jira_project_key="APOL",
            health_score=0.72,
            target_completion_date=date(2027, 6, 30),
        )
        session.add_all([genesis, apollo])
        await session.flush()

        # 6. Add Tickets
        print("Creating tickets...")
        t1 = Ticket(
            id=uuid4(),
            project_id=genesis.id,
            ticket_key="GEN-1",
            title="Setup Core Infrastructure",
            status="Done",
            story_points=8,
            assigned_employee_id=jane.id,
            target_date=date(2026, 8, 15),
        )
        t2 = Ticket(
            id=uuid4(),
            project_id=genesis.id,
            ticket_key="GEN-2",
            title="Implement GraphQL API Gateway",
            status="In Progress",
            story_points=5,
            assigned_employee_id=alice.id,
            target_date=date(2026, 9, 30),
        )
        t3 = Ticket(
            id=uuid4(),
            project_id=genesis.id,
            ticket_key="GEN-3",
            title="Integrate Keycloak SSO Security",
            status="To Do",
            story_points=3,
            assigned_employee_id=bob.id,
            target_date=date(2026, 10, 15),
        )
        t4 = Ticket(
            id=uuid4(),
            project_id=apollo.id,
            ticket_key="APOL-1",
            title="Design System Component Overhaul",
            status="Done",
            story_points=5,
            assigned_employee_id=bob.id,
            target_date=date(2026, 11, 30),
        )
        t5 = Ticket(
            id=uuid4(),
            project_id=apollo.id,
            ticket_key="APOL-2",
            title="Knowledge Graph D3.js Visualization",
            status="In Progress",
            story_points=8,
            assigned_employee_id=alice.id,
            target_date=date(2026, 12, 15),
        )
        session.add_all([t1, t2, t3, t4, t5])
        await session.flush()

        # 7. Add Customers
        print("Creating customers...")
        wayne = Customer(
            id=uuid4(),
            tenant_id=TENANT_ID,
            company_name="Wayne Enterprises",
            domain="wayne.com",
            contract_value_arr=450000.00,
            health_score=0.92,
            assigned_csm_id=emma.id,
            is_active=True,
        )
        stark = Customer(
            id=uuid4(),
            tenant_id=TENANT_ID,
            company_name="Stark Industries",
            domain="stark.com",
            contract_value_arr=650000.00,
            health_score=0.88,
            assigned_csm_id=emma.id,
            is_active=True,
        )
        session.add_all([wayne, stark])
        await session.flush()

        # 8. Add SOP Workflow
        print("Creating SOP Workflows...")
        sop = SopWorkflow(
            id=uuid4(),
            tenant_id=TENANT_ID,
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
            is_active=True,
        )
        session.add(sop)
        
        await session.commit()
        print("PostgreSQL data successfully committed!")

        # 9. Trigger Celery graph synchronization for Neo4j
        print("Triggering Celery graph synchronization for Neo4j...")
        
        # Sync Departments
        for dept in [eng_dept, prod_dept, sales_dept, hr_dept]:
            sync_department_node.delay(
                department_id=str(dept.id),
                tenant_id=str(TENANT_ID),
                name=dept.name,
                code=dept.code,
                budget_limit_eur=float(dept.budget_limit_eur),
                headcount_target=dept.headcount_target,
                parent_department_id=None
            )
            
        # Sync Employees
        for emp in [sarah, john, charlie, david, jane, alice, bob, emma]:
            sync_employee_node.delay(
                employee_id=str(emp.id),
                tenant_id=str(TENANT_ID),
                email=emp.email,
                first_name=emp.first_name,
                last_name=emp.last_name,
                role_title=emp.role_title,
                status=emp.status,
                billable_rate_eur=float(emp.billable_rate_eur),
                department_id=str(emp.department_id) if emp.department_id else None,
                manager_id=str(emp.manager_id) if emp.manager_id else None
            )

        # Sync Projects
        for proj in [genesis, apollo]:
            sync_project_node.delay(
                project_id=str(proj.id),
                tenant_id=str(TENANT_ID),
                name=proj.name,
                jira_project_key=proj.jira_project_key,
                health_score=float(proj.health_score),
                target_completion_date=proj.target_completion_date.isoformat()
            )

        # Sync Customers
        for cust in [wayne, stark]:
            sync_customer_node.delay(
                customer_id=str(cust.id),
                tenant_id=str(TENANT_ID),
                company_name=cust.company_name,
                domain=cust.domain,
                contract_value_arr=float(cust.contract_value_arr),
                health_score=float(cust.health_score),
                assigned_csm_id=str(cust.assigned_csm_id) if cust.assigned_csm_id else None
            )

        # Sync Tickets
        for t in [t1, t2, t3, t4, t5]:
            sync_ticket_assignment_edge.delay(
                ticket_id=str(t.id),
                employee_id=str(t.assigned_employee_id) if t.assigned_employee_id else None,
                project_id=str(t.project_id),
                tenant_id=str(TENANT_ID)
            )

        print("All sync tasks successfully dispatched to Celery worker!")
        print("Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed())
