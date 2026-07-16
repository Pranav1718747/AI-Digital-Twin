# SentinelOS AI: User Workflow Plan
## Enterprise Interface & User Experience (UI/UX) Specifications
**Version:** 1.0.0-PROD-WORKFLOW  
**Classification:** Proprietary / Product Management & VCs  
**Target Funding Stage:** €10,000,000 Series Seed/A  

---

## Table of Contents
1. **Dashboard Personas & Graph Exploration**
   - 1.1 Enterprise User Personas
   - 1.2 Persona Dashboard Layout Specifications
   - 1.3 Interactive Knowledge Graph Canvas (Cytoscape.js)
   - 1.4 Global Graph Search & Filter Workflows
2. **Strategic Simulations & What-If Planning**
   - 2.1 Simulation Workspace Interface
   - 2.2 Reallocating Budgets & Resources
   - 2.3 Simulating Organizational Structural Changes
   - 2.4 Impact Analysis Reports & Database Commits
3. **Process Automation & Visual Builders**
   - 3.1 React Flow Process Automation Canvas
   - 3.2 Setting Webhook & File Ingress Triggers
   - 3.3 Execution Tracking & SLA Monitoring
4. **Incident Triage & CSM Workflows**
   - 4.1 Support Ticket & Escalation Routing
   - 4.2 Angry Client Alert Triaging
   - 4.3 CSM Agent Email Draft Review Loops
5. **Security Authorizations & Clearance Gates**
   - 5.1 Hierarchical Role-Based Access Control
   - 5.2 Human-in-the-Loop Approval Interruption Gates
   - 5.3 Security Clearance Mutation Workflows
6. **Developer Sync, Audits & Administration**
   - 6.1 GitHub Commit & Edge Synchronization
   - 6.2 Keycloak & SSO Realm Integration Provisioning
   - 6.3 SOC2 Compliance Log Generation

---

## 1. Dashboard Personas & Graph Exploration

### 1.1 Enterprise User Personas
SentinelOS tailors its interface to four primary roles within the organization, ensuring users see the data and controls relevant to their responsibilities:

```
+------------------+     +------------------+     +------------------+     +------------------+
|    CEO / EXEC    |     | DEPT MANAGER     |     |  SUPPORT / CSM   |     |    DEVELOPER     |
|   Clearance: 5   |     |   Clearance: 3   |     |   Clearance: 2   |     |   Clearance: 1   |
| Global Strategy, |     | Budgets, Teams,  |     | Customer Health, |     | Git, Jira, Tasks |
| Simulations      |     | Department KPIs  |     | Churn Mitigation |     | & Pipelines      |
+------------------+     +------------------+     +------------------+     +------------------+
```

1. **CEO / Executive (Persona: "Strategic Executive"):**
   * *Clearance Level:* Level 5 (Global).
   * *Core Goals:* Wants to run simulations to assess strategic risks, forecast run-rates, evaluate department budgets, and review customer satisfaction trends.
2. **Department Manager (Persona: "Operational Manager"):**
   * *Clearance Level:* Level 3 (Departmental).
   * *Core Goals:* Wants to manage team allocations, review skill matrices, track project budgets, identify team bottlenecks, and approve resource reassignments.
3. **Support / Customer Success Manager (Persona: "CS Specialist"):**
   * *Clearance Level:* Level 2 (Team).
   * *Core Goals:* Wants to monitor customer health scores, review support ticket sentiment trends, track SLA compliance, and resolve customer escalations.
4. **Engineer / Software Developer (Persona: "Technical Builder"):**
   * *Clearance Level:* Level 1 (Individual).
   * *Core Goals:* Wants to update Jira tasks, link commits to open tickets, review PR builds, and resolve technical blockers.

---

### 1.2 Persona Dashboard Layout Specifications

#### 1.2.1 CEO / Executive Dashboard Layout
The Executive Dashboard presents a high-level view of company health, focused on strategy, risk, and financial trends.

```
+-----------------------------------------------------------------------------------------+
|                                    SENTINELOS SYSTEM                                    |
+-----------------------------------------------------------------------------------------+
| [Global Navigation]  Enterprise Graph Explorer  |  Simulation Sandbox  |  Audits  |  SSO|
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  +-------------------------------------+       +-------------------------------------+  |
|  |     WIDGET A: STRATEGIC FORECAST    |       |     WIDGET B: SYSTEM HEALTH RISK    |  |
|  |  [Cash Runway: 14 Months]           |       |  [Critical Risk: Churn Alert]       |  |
|  |  - Projected OpEx: EUR 1.2M/mo      |       |  - strategic SaaS: €250k ARR        |  |
|  |  - Active Runrate: EUR 12.5M ARR    |       |  - Downstream delay: SSO module     |  |
|  |  - Confidence Score: 94.2%          |       |  - Assigned CSM: Jane Doe           |  |
|  +-------------------------------------+       +-------------------------------------+  |
|                                                                                         |
|  +-----------------------------------------------------------------------------------+  |
|  |                          WIDGET C: CYTOSCAPE KNOWLEDGE GRAPH                      |  |
|  |  [Render Canvas: Node & Edge Network Explorer]                                    |  |
|  |  - Centers: CEO node, Department Nodes, Core Projects                             |  |
|  |  - Interaction: Left-click displays properties, double-click expands nodes        |  |
|  +-----------------------------------------------------------------------------------+  |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

*   **Widget A: Strategic Financial Forecast:**
    *   *Metrics:* Cash runway (months), projected OpEx (EUR), active run-rate (ARR), confidence scores.
    *   *Visualization:* ECharts area chart showing projected vs. actual revenue.
*   **Widget B: System Health & Risk Alerts:**
    *   *Metrics:* Active SLA breaches, customer churn alerts, critical project delays.
    *   *Action:* Clicking an alert opens the Neo4j path explorer to show the root cause.
*   **Widget C: Cytoscape Knowledge Graph Canvas:**
    *   *Metrics:* Rendering of the company structure. Shows nodes for departments, projects, and employees, with edge paths representing reporting lines and dependencies.

#### 1.2.2 Support / CSM Dashboard Layout
The Support Dashboard displays real-time customer feedback, focusing on sentiment analysis and SLA tracking.

```
+-----------------------------------------------------------------------------------------+
|                                 CUSTOMER SUCCESS PORTAL                                 |
+-----------------------------------------------------------------------------------------+
|  +-------------------------------------+       +-------------------------------------+  |
|  |     WIDGET A: CHURN THREAT METER    |       |     WIDGET B: SLA COMPLIANCE TRACE  |  |
|  |  - Acme Corp Risk Score: 82%        |       |  - Zendesk Ticket #4509 Status: Open |  |
|  |  - Sentiment score: -0.68           |       |  - Time Remaining: 1h 14m           |  |
|  |  - Blocked by: Bug GATE-102         |       |  - Linked Engineer: John Smith      |  |
|  +-------------------------------------+       +-------------------------------------+  |
|                                                                                         |
|  +-----------------------------------------------------------------------------------+  |
|  |                         WIDGET C: SUPPORT EMAIL DRAFT EDITOR                      |  |
|  |  "Draft proposed response to Acme Corp regarding ticket SLA..."                     |  |
|  |  [Draft text: AI proposed response]                                               |  |
|  |  [Button: Review & Send via Gmail]   [Button: Edit Draft]                         |  |
|  +-----------------------------------------------------------------------------------+  |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

*   **Widget A: Churn Threat Meter:**
    *   *Metrics:* Client churn probability scores, active sentiment, number of linked engineering bugs.
    *   *Visualization:* Gauge charts showing risk levels (Green: Low, Orange: Medium, Red: High).
*   **Widget B: SLA Compliance Tracker:**
    *   *Metrics:* Time remaining until SLA breach, assigned engineer, linked Jira issue.
*   **Widget C: Agent Response Draft Panel:**
    *   *Features:* Automatically drafts email replies based on details from the linked Jira bug, allowing CSMs to review and send updates directly.

---

### 1.3 Interactive Knowledge Graph Canvas (Cytoscape.js)
The Knowledge Graph Canvas provides an interactive view of the organization. Users can explore nodes and relationships using the following interaction flows:

```
[ Canvas Load ] ---> Rendering of Core Nodes (Departments, Cost Centers)
                           |
                           v
[ Node Click ] ----> Highlight Selected Node & Immediate Neighbors (Fade Others)
                           |
                           v
[ Node Hover ] ----> Display Property Tooltip (JSON Metadata)
                           |
                           v
[ Double Click ] --> Query Neo4j for 2-Degree Neighbor Nodes & Animate Expansion
```

1. **Left-Click (Node Selection):**
   * *Action:* Highlights the selected node and its immediate neighbors (1-degree connections), setting the opacity of the rest of the canvas to 0.15.
   * *Sidebar Action:* Displays the node's properties (metadata, contacts, active tasks) in the details panel on the right.
2. **Hover (Tooltip Preview):**
   * *Action:* Displays a popover tooltip containing key metadata (e.g., email, role title, health scores).
3. **Double-Click (Node Expansion):**
   * *Action:* Queries Neo4j for secondary relationships (2-degree connections) and adds the new nodes to the active canvas with a smooth transition.
4. **Right-Click (Action Menu):**
   * *Action:* Opens a context menu based on the node type (e.g., "Run simulation from node" for cost centers, "Assign task" for employees).

---

### 1.4 Global Graph Search & Filter Workflows
To locate entities inside large graphs, the canvas features a global search bar powered by Meilisearch:

```
[ Search Input ]
       | (Queries Meilisearch Index)
       v
[ JSON Matches Returned ]
       | (Filter matches by user clearance)
       v
[ Render Search Results Dropdown ]
       | (Select target record)
       v
[ Canvas Centers on Selected Node & Highlights Neighbors ]
```

1. **Query Entry:** The user types a query (e.g., "Jira bug delayed Acme Corp") into the search bar.
2. **Dynamic Filtering:** The search service queries Meilisearch and filters the results based on the user's tenant ID and security clearance.
3. **Result Highlighting:** Selecting a search result pans and zooms the canvas to center on the target node, applying a pulsing glow animation.
4. **Properties Sidebar:** The details panel updates to display the properties and metadata of the selected entity.

---

## 2. Strategic Simulations & What-If Planning

SentinelOS allows executives to run predictive simulations by copying the current company state into a sandboxed environment where they can safely test changes.

```
       [ Enter Simulation Workspace ]
                     |
                     v
       [ Clone Current Neo4j Graph ]
       (Create sandboxed write workspace)
                     |
         +-----------+-----------+
         |                       |
         v                       v
 [ Reallocate Budgets ]   [ Reassign Teams ]
         |                       |
         +-----------+-----------+
                     |
                     v
         [ Execute Forecast Run ]
         - Recalculate cash runway
         - Trace milestone delay risks
                     |
         +-----------+-----------+
         | (Strategy Accepted)   | (Strategy Aborted)
         v                       v
   [ CEO Approval Gate ]    [ Discard Sandbox ]
         |
  [ Commit to Prod ]
```

---

### 2.1 Entering and Initializing the Simulation Sandbox
To run a what-if simulation, the user follows these steps to create an isolated sandbox environment:

1. **Accessing the Workspace:**
   * Open the global navigation header and select **Simulation Sandbox**.
   * The system presents the **Simulation Sandbox Directory**, listing active sandboxes and historical simulation records.
2. **Creating a Sandbox:**
   * Click **New Sandbox Environment**.
   * In the configuration modal, enter a name (e.g., "Q3 Reorg and R&D Budget Cut") and select the target clone depth:
     * *Standard:* Clones the core organizational hierarchy and project graph.
     * *Deep:* Clones all nodes and relationships, including customer contracts, active support tickets, and email interaction metadata.
3. **Execution Pipeline:**
   * Click **Create Sandbox**.
   * The backend generates a unique `sandbox_id` (UUID) and creates an isolated copy of the Neo4j graph database:
     ```cypher
     // Copying nodes into a sandboxed namespace
     MATCH (n)
     WHERE n.tenant_id = $tenant_id
     COPY n TO sandbox { id: $sandbox_id }
     ```
   * The UI updates, showing the sandbox canvas with a yellow header warning: `SANDBOX MODE ACTIVE — CHANGES WILL NOT AFFECT PRODUCTION`.

---

### 2.2 Reallocating Budgets and Rescheduling Resources
Once in the sandbox, users can test resource changes by dragging elements on the canvas:

1. **Adjusting Department Budgets:**
   * Select a **Department** or **CostCenter** node on the canvas.
   * In the properties panel, click **Edit Budget Allocations**.
   * Adjust the budget slider (e.g., reducing the Marketing Cost Center by 20%).
   * The UI highlights the modified nodes in yellow to indicate pending changes.
2. **Reassigning Employee Resources:**
   * Select an **Employee** node (e.g., "John Doe - Principal SSO Developer") on the canvas.
   * Drag the connector line from John Doe's current project (`[:ASSIGNED_TO] -> Project Alpha`) and drop it onto a new target project (`Project Beta`).
   * The system updates the sandboxed Neo4j database:
     ```cypher
     MATCH (e:Employee {id: $emp_id})-[r:ASSIGNED_TO]->(p:Project {name: 'Project Alpha'})
     DELETE r
     WITH e
     MATCH (new_p:Project {name: 'Project Beta'})
     MERGE (e)-[r2:ASSIGNED_TO]->(new_p)
     SET r2.assigned_at = datetime()
     ```

---

### 2.3 Simulating Organizational Structural Changes
Users can test structural changes (e.g., mergers, team reorganizations) on the canvas:

1. **Merging Departments:**
   * Click **Merge Entities** in the canvas toolbar.
   * Click on the source department node (`DEPT-QA`) and then the target department node (`DEPT-ENG`).
   * In the confirmation panel, select how to merge the teams:
     * *Consolidate:* Relocates all employee nodes to report to the target department head.
     * *Layered:* Links the source department as a sub-division under the target department.
2. **Deleting Department Nodes:**
   * Right-click the target department node and select **Delete Entity**.
   * The system highlights affected downstream nodes in orange, showing that reporting lines are now broken.
   * The **HR Specialist Agent** runs a check and displays a list of required fixes (e.g., reassigning 5 employees who no longer have reporting paths).

---

### 2.4 Analyzing Impact and Committing Changes to Production
Before applying changes, the user runs an impact analysis to evaluate the proposed strategy:

```
[ Click Run Strategy Forecast ]
               |
               v
 [ Execute Simulation Pipeline ]
 - Recalculate cost center spent limits
 - Run regression analysis on cash runway
 - Trace delayed milestones to customer contracts
               |
               v
  [ Render Impact Comparison ]
 - Current Runway vs. Simulated Runway
 - Churn Risks identified
 - SLA breaches flagged
               |
        +------+------+
        |             |
        v             v
  [ Approve ]     [ Decline ]
  - Send to CEO   - Discard sandbox
  - Save to Prod
```

1. **Running the Analysis:**
   * Click **Run Strategy Forecast** in the sandbox toolbar.
   * The **Forecast Agent** runs simulations across the sandboxed graph database, evaluating project delivery risks and cash runway impacts.
2. **Reviewing the Comparison:**
   * The system displays a dashboard comparing the current state with the simulated scenario:
     * *Current State:* Cash runway of 14 months, 1 high-severity SLA risk on Project Alpha.
     * *Simulated State:* Cash runway extended to 18 months, Project Alpha SLA risk resolved, but Project Gamma is delayed by 4 weeks, introducing a low-priority SLA risk on Customer Acme Corp.
3. **Committing Changes to Production:**
   * If the simulation results are acceptable, click **Apply Strategy to Production**.
   * Because this is a high-risk operation, the system triggers the **Human-in-the-Loop Approval Gate**:
     * The sandbox changes are locked, and the transaction is written to the PostgreSQL Write-Ahead Log as a pending change.
     * A Slack alert and email notification are sent to the CEO.
     * Once the CEO clicks **Approve** on their dashboard, the backend applies the sandbox modifications to the production databases (PostgreSQL and Neo4j).
   * **If Aborted:** Click **Discard Sandbox** to delete the temporary database state and return to the production dashboard.

---

## 3. Process Automation & Visual Builders

SentinelOS provides a visual builder powered by **React Flow**, allowing operational teams to map, monitor, and automate business processes (SOPs).

```
         [ Open Process Automation Builder ]
                         |
                         v
       [ Drag & Drop SOP Steps onto Canvas ]
       (Define sequence paths, inputs, & owners)
                         |
         +---------------+---------------+
         |                               |
         v                               v
 [ Map to Cost Center ]        [ Set Ingress Triggers ]
 (Assign budget draw)          (Jira, GitHub, inotify)
         |                               |
         +---------------+---------------+
                         |
                         v
         [ Deploy Workflow Pipeline ]
                         |
                         v
          (Live Execution Monitoring Dashboard)
         - Green: Step Completed (Latency score logged)
         - Blue: Step Active (Borders animate pulse)
         - Red: Step Failure (Send alerting webhook)
```

---

### 3.1 React Flow Process Canvas & Step Mapping
Operational managers can configure Standard Operating Procedures (SOPs) visually on a node-based editor:

1. **Accessing the Builder:**
   * Open the navigation menu and click **Process Automation**.
   * Click **Create Custom Workflow** to open the blank React Flow canvas.
2. **Dragging and Arranging Steps:**
   * The sidebar displays a list of pre-configured **Process Nodes** (e.g., API Webhook, Slack Alert, Jira Ticket, Database Write, AI Classification, Human Gate).
   * Drag a node from the sidebar and drop it onto the canvas.
   * Drag a connector line from the source node's right handle and connect it to the target node's left handle to establish execution sequence paths.
3. **Configuring Node Properties:**
   * Select a node on the canvas to display its configurations in the properties sidebar:
     * *Label:* Customize the display name.
     * *Owner:* Assign the team or employee responsible for the step.
     * *Clearance Level:* Set the required security clearance level (Level 1–5).
     * *SLA Target:* Specify the maximum allowed duration (e.g., 2 hours) before flagging a delay.
     * *Resource Cost:* Map the step to a corporate **CostCenter** to track budget allocations.

---

### 3.2 Setting Up Webhook & File Ingress Triggers
Workflows can be triggered by external systems or system events:

1. **Setting an External Webhook Trigger:**
   * Drag the **Webhook Ingress** node onto the canvas and position it as the entry node.
   * The properties panel generates a unique REST endpoint: `/api/v1/workflows/trigger/{workflow_id}`.
   * Copy this URL and paste it into the webhook settings of your external service (e.g., Jira, Zendesk, Salesforce).
   * In the payload editor, map incoming JSON fields to workflow variables (e.g., mapping `ticket.id` to `JiraTicketID`).
2. **Setting a File System Ingress Trigger:**
   * Drag the **File Ingress** node onto the canvas.
   * In the configurations panel, select the target folder path (e.g., `/data/raw_ingress/contracts/`).
   * Choose the layout parser to execute on detection (e.g., *Docling Markdown Parser*).
   * When a file is dropped into the directory, the host's `inotify` watcher automatically triggers the workflow.

---

### 3.3 Execution Tracking & SLA Monitoring Dashboards
Once deployed, managers can monitor active process runs in real-time:

1. **Accessing the Monitoring View:**
   * Open the workflow directory and select the active pipeline to display the **Execution Tracking Dashboard**.
   * The canvas displays a read-only view of the active process, using colors to indicate step status:
     * *Green:* Step completed successfully. Hovering displays execution duration and resource cost logs.
     * *Animated Blue:* Step is currently running.
     * *Crimson Red:* Step failed. The error logs are displayed in the panel, and an alert is sent to the owner's Slack.
2. **Reviewing Process KPI Metrics:**
   * The sidebar displays aggregate metrics for the active pipeline:
     * *Total Latency:* Average end-to-end execution time.
     * *SLA Compliance Rate:* Percentage of runs completed within their target SLA thresholds.
     * *Failure Rate:* Ratio of failed vs. successful execution runs.
     * *OpEx Impact:* Live cost metrics calculated from step allocations.
   * If the failure rate of a step exceeds 10%, the system flags the node on the canvas, alerting operations to a potential bottleneck.

---

## 4. Incident Triage & CSM Workflows

SentinelOS automates the triage of customer support issues by linking tickets to engineering resources and draft responses.

```
       [ Urgent Customer Zendesk Ticket ]
                       |
                       v
         (n8n Ingests & Parses Ticket)
                       |
                       v
       [ CS Agent Sentiment Assessment ]
  - Calculate sentiment score (angry = -0.75)
  - Map ticket to Customer node in Neo4j
                       |
         +-------------+-------------+
         | (High Risk / Low Sentiment)| (Standard Ticket)
         v                           v
   [ CSM Alert Dashboard ]     [ Support Queue ]
   - Visual pulse on Node
   - Slack alert broadcast
         |
         v
 [ AI Drafts Email Update ]
 (Retrieves details from linked Jira issue)
         |
         v
 [ CSM Reviews & Sends Draft via Gmail ]
```

---

### 4.1 Support Ticket & Escalation Routing
When a customer submits an urgent ticket, the system parses it and routes it to the appropriate team:

1. **Ticket Ingress & Parsing:**
   * A customer submits a ticket in Zendesk (e.g., "Timeout errors on dashboard access").
   * n8n captures the event and routes the payload to the API gateway: `/api/v1/support/tickets`.
   * The **Customer Success Agent** processes the ticket, extracting key metadata:
     * *Customer Domain:* `acme.com` (queries PostgreSQL to map to Customer "Acme Corp").
     * *Sentiment Score:* Evaluates the body text sentiment. If the customer uses words like "critical," "broken," or "billing impact," the agent sets a low sentiment score (e.g., -0.75) and flags the ticket as urgent.
2. **Graph Enrichment:**
   * The sync engine writes the support ticket to PostgreSQL and updates Neo4j:
     ```cypher
     MATCH (c:Customer {domain: 'acme.com'})
     CREATE (st:SupportTicket {id: $ticket_id})
     SET st.subject = $subject,
         st.sentiment = $sentiment,
         st.status = 'Open'
     MERGE (c)-[:HAS_SUPPORT_TICKET]->(st)
     ```

---

### 4.2 Triaging Angry Client Alerts
If a strategic customer's account health drops, the system triggers alerts for the CSM:

1. **Identifying Churn Risks:**
   * If a support ticket's sentiment score drops below -0.5, the background worker recalculates the customer's churn risk.
   * If the churn risk level crosses the threshold from "Medium" to "High," the database updates the customer record in PostgreSQL.
2. **WebSocket Notifications:**
   * The update publishes an event to the Redis Pub/Sub channel: `channel:tenant:{tenant_id}`.
   * The WebSocket server broadcasts the event to active client sessions.
3. **CSM Dashboard Alert:**
   * The CSM Dashboard receives the update. The Customer node on the Cytoscape.js canvas flashes red, indicating an active alert.
   * Simultaneously, the system sends an automated Slack alert to the assigned CSM: `Alert: Customer Acme Corp Health Score dropped to 42% due to active SLA ticket #4509. Direct engineering blocker identified: GATE-102.`

---

### 4.3 CSM Agent Email Draft Review Loops
The system assists the CSM by automatically drafting email updates based on technical logs:

1. **Gathering Context:**
   * The CSM opens the active support ticket in their dashboard.
   * In the details sidebar, click **Request Resolution Plan**.
   * The **Customer Success Agent** queries Neo4j to find the linked engineering bug:
     ```cypher
     MATCH (st:SupportTicket {id: $ticket_id})-[:REFERRED_TO]->(t:Ticket)
     RETURN t.key, t.title, t.status, t.assigned_employee_id
     ```
   * The agent retrieves the status of the linked Jira issue (e.g., `GATE-102` status is "In Review") and reads the latest Git commit log messages from Qdrant.
2. **Drafting the Response:**
   * The agent calls PydanticAI to generate an email draft, using the gathered details to explain the fix:
     ```text
     Subject: Technical Update: SSO Login Issue Resolved (Zendesk Ticket #4509)
     
     Hi Team,
     
     Our engineering team has identified the cause of the SSO login issues you reported on the dashboard. The fix was committed to code review (GATE-102) 20 minutes ago.
     
     We are currently running integration tests and plan to deploy the update to production at 2:00 PM UTC. We will monitor the release and confirm when services are fully restored.
     
     Best regards,
     CS Team
     ```
3. **Review & Send:**
   * The email draft is displayed in the **Zendesk Triage Panel** for review.
   * The CSM can edit the draft to customize the messaging.
   * Click **Send Update via Gmail**. The system sends the email using the Gmail MCP connector and updates the ticket status to `Pending Client Confirmation` in both Zendesk and PostgreSQL.

---

## 5. Security Authorizations & Clearance Gates

SentinelOS secures corporate data using a multi-level clearance system that intercepts queries and halts execution if access limits are exceeded.

```
                  [ User Submits Query ]
                            |
                            v
            (Check Node Clearance Weight)
                            |
         +------------------+------------------+
         | (Clearance >= Node Clearance)       | (Clearance < Node Clearance)
         v                                     v
   [ Execute Node ]                    [ Trigger Interruption Gate ]
   (Return data result)                - Pause execution workflow
                                       - Prompt UI for confirmation / override
                                       - Alert admin for elevation
                                               |
                                     +---------+---------+
                                     | (Approved)        | (Declined)
                                     v                   v
                               [ Resume Graph ]   [ Terminate Query ]
```

---

### 5.1 Hierarchical Security Tiers
The system uses five security levels to protect sensitive data:

1. **Level 1 (Public / Team Contributor):**
   * *Target Access:* Standard project boards, user directories, public wiki pages, and assigned task tickets.
   * *Restricted:* Cannot view financial transactions, salary data, organizational strategy notes, or system configurations.
2. **Level 2 (Customer Support / CSM Triage):**
   * *Target Access:* Customer health metrics, client contract lists, active support tickets, and system error logs.
   * *Restricted:* Cannot view financial ledger accounts or executive reorg sandboxes.
3. **Level 3 (Department Manager):**
   * *Target Access:* Team headcount planning tools, department OpEx ledgers, project milestones, and employee performance files.
   * *Restricted:* Cannot view company-wide financial accounts or executive strategy plans.
4. **Level 4 (Finance & HR Admins):**
   * *Target Access:* Global payroll data, general ledger tables, cash flow projections, and employee contracts.
   * *Restricted:* Cannot run strategic organization-wide simulations.
5. **Level 5 (Strategic Executive / CEO):**
   * *Target Access:* Full access, including strategic sandboxes, organization mergers, and global system configurations.

---

### 5.2 Human-in-the-Loop Interruption Gates
If a user's request requires access to resources above their clearance level, the state machine triggers an approval workflow:

1. **Detecting Security Breaches:**
   * A Level 1 Developer requests an update from the AI agent: "Provide a summary of Project Alpha's budget status."
   * The **LLM Specialist Agent** builds an execution path.
   * During graph traversal, the agent attempts to read the `Project Alpha Cost Center` node, which has a clearance requirement of **Level 3**.
   * The security middleware detects that the user's clearance (Level 1) is less than the required Level 3.
2. **Triggering the Interruption Gate:**
   * The backend halts the LangGraph execution loop and sets the state to `PENDING_APPROVAL`.
   * The transaction is written to the PostgreSQL audit log as an active interruption.
3. **User Prompt and Notification:**
   * The WebSocket server broadcasts an event to the developer's dashboard, displaying a lock modal:
     `Security Gate Triggered: Access to Cost Center details requires Level 3 clearance. Requesting temporary elevation from manager Jane Doe...`
   * Simultaneously, the system sends a Slack notification to their manager:
     `Elevation Request: Developer John Smith has requested temporary Level 3 access to Project Alpha's Cost Center to resolve budget calculations. [Approve Access] [Decline Request]`

---

### 5.3 Security Clearance Modification Workflows
Managers can view and manage active access requests from their team:

1. **Accessing the Approvals Queue:**
   * The manager opens their dashboard and clicks **Approvals Queue** in the navigation sidebar.
   * The screen displays active access requests, detailing the requester, target resource, required clearance level, and request reason.
2. **Reviewing and Granting Temporary Access:**
   * Click **Review Request** on John Smith's request.
   * The properties panel displays details about the target node (`Project Alpha Cost Center`) and the query that triggered the gate.
   * Click **Approve Access**.
   * In the confirmation dialog, select the duration for the temporary access:
     * *Single Query:* Access is granted only for the active query execution.
     * *Time-Bounded:* Access is granted for a specific duration (e.g., 2 hours, 24 hours).
   * Click **Confirm Grant**.
3. **Resuming Execution:**
   * The system updates the transaction log in PostgreSQL, marking the request as approved.
   * The LangGraph state machine reads the approval and resumes execution, returning the requested data to the developer.
   * After the time limit expires, a background Celery worker automatically revokes the temporary access.

---

## 6. Developer Sync, Audits & Administration

SentinelOS connects developer activities and admin configurations directly to the company's organizational graph.

```
                  [ Developer Pushes Code Commit ]
                                 |
                                 v
               (GitHub Webhook Intercepts Event)
                                 |
                                 v
               [ Sync Worker Action Pipeline ]
               - Extract issue key: 'GATE-102'
               - Locate ticket and repository nodes in Neo4j
               - Merge relationship link: (Commit)-[:RESOLVES]->(Ticket)
                                 |
                                 v
               [ UI Updates WebSocket Event ]
               - Ticket status transitions on Developer Dashboard
```

---

### 6.1 GitHub Commit & Edge Synchronization Workflow
The system automatically tracks development progress and maps it to project status:

1. **Pushing Code:**
   * An engineer commits code locally and pushes the branch to GitHub: `git push origin feature/sso-login`.
   * The commit message format includes the target ticket key: `[GATE-102] Resolve JWT signature validation exception`.
2. **Webhook Processing:**
   * GitHub triggers a webhook event, sending a payload to the backend endpoint: `/api/v1/integrations/github/webhook`.
   * The sync service extracts details from the payload: the repository name, commit hash, author email, and commit message.
3. **Graph Synchronization:**
   * The service searches the commit message for ticket keys (e.g., matching `GATE-102`).
   * The worker updates the Neo4j graph, linking the commit to the employee and the ticket:
     ```cypher
     MATCH (e:Employee {email: $author_email})
     MATCH (t:Ticket {ticket_key: 'GATE-102'})
     MERGE (c:Commit {hash: $commit_hash})
     SET c.message = $commit_msg,
         c.timestamp = datetime($timestamp)
     MERGE (e)-[:COMMITTED]->(c)
     MERGE (c)-[:RESOLVES]->(t)
     ```
4. **Real-Time Status Update:**
   * The database updates the ticket status to `In Code Review` in PostgreSQL.
   * The WebSocket server broadcasts the status change to the tenant channel.
   * The Developer and Project dashboards update instantly, showing the new commit linked to the ticket on the project board.

---

### 6.2 Keycloak & SSO Integration Provisioning
Administrators configure single sign-on (SSO) and map user permissions using the Admin Panel:

1. **Accessing SSO Settings:**
   * Log in to the dashboard with Level 5 (Admin) credentials.
   * Click **System Configurations** in the navigation bar, and select **SSO Identity Provider**.
2. **Configuring Keycloak Connections:**
   * Enter the Keycloak Realm URL (e.g., `https://sso.company.com/realms/sentinel-enterprise`).
   * Enter the Client ID and Client Secret values.
   * Click **Test Identity Connection**. The backend verifies the connection by fetching the JWKS certificates directory.
3. **Mapping Security Attributes:**
   * In the **Attribute Mapping Table**, map token claims to database fields:
     * Map `email` to user email values.
     * Map Keycloak roles (e.g., `exec_role`) to system clearance levels (e.g., `Level 5`).
   * Click **Save Configurations**. New users logging in via Keycloak are now automatically assigned the correct clearance level and tenant ID.

---

### 6.3 SOC2 Compliance Log Generation
Compliance officers can generate audit trails to track security changes and database modifications:

1. **Accessing the Compliance Dashboard:**
   * Open the **Audits and Compliance** tab from the global navigation menu.
   * The dashboard displays active system configurations, database integrity metrics, and compliance logs.
2. **Configuring Audit Parameters:**
   * Click **Generate Compliance Report**.
   * In the configuration modal, set the report parameters:
     * *Date Range:* Select the target period (e.g., last 30 days).
     * *Scope:* Select the tables and databases to include (e.g., *Access Control changes*, *Financial Ledgers*, *Reorg Sandboxes*).
     * *Format:* Choose the output format (CSV or PDF).
3. **Generating and Reviewing the Report:**
   * Click **Run Compliance Compile**.
   * The backend queries the database logs, collecting audit records:
     ```sql
     SELECT timestamp, user_email, action, target_table, record_id, clearance_required
     FROM security_audit_logs
     WHERE timestamp >= :start_date AND timestamp <= :end_date
     ORDER BY timestamp DESC
     ```
   * The system generates a formatted report listing every security clearance elevation, strategic simulation commit, and database change.
   * Click **Download Audit Package** to retrieve the files for compliance reviews.

---

## 7. Screen-by-Screen User Interface Action Catalog

To ensure a seamless implementation by frontend developers, this section catalogues every interactive screen, including its state mutations, input validations, and error handlers.

### 7.1 Global Navigation & Shell layout
*   **Persistent Shell Components:**
    *   *Left Sidebar:* Displays collapsible navigation links (Explorer, Sandbox, Automation, Triage, Audits, Settings).
    *   *Top Header:* Displays the current Tenant switcher dropdown, the active user profile badge, and the Global Search bar.
    *   *Active State Banner:* Displays a warning bar when running in simulation mode (Yellow) or when there is an active tenant-wide critical alert (Red).
*   **Search Bar Actions:**
    *   *Focus (Hotkey: `Cmd+K` / `Ctrl+K`):* Opens a modal overlay with a search input.
    *   *Input Validation:* Restricts characters to alphanumeric characters and standard punctuation. Displays a "Searching..." spinner after a 150ms debounce threshold.
    *   *No Results State:* Displays "No entities found matching search filters."
    *   *Selection Action:* Closes the modal and pans the active canvas to focus on the selected node.

---

### 7.2 Graph Explorer Screen (`/explorer`)
*   **Interactive Canvas Area:**
    *   *Layout:* Uses Cytoscape.js with a force-directed layout algorithm.
    *   *Controls:* Floating zoom toolbar in the bottom-left corner with Zoom In (+), Zoom Out (-), Fit to Screen, and Lock Node Positions toggles.
*   **Properties Detail Panel (Right Sidebar):**
    *   *Collapsible Behavior:* Slides in from the right edge when a node is selected, pushing the main canvas to the left.
    *   *Content Sections:*
      *   *Header:* Displays the node's title, label, ID, and status badge.
      *   *Properties Tab:* Displays a key-value grid of metadata fields.
      *   *Relationships Tab:* Displays a list of connected nodes grouped by relationship type (e.g., Reports To, Assigned To, Owner). Clicking a link centers the canvas on that node.
      *   *Logs Tab:* Displays an audit log of recent updates to the selected entity.

---

### 7.3 Simulation Sandbox Screen (`/sandbox`)
*   **Sandbox Workspace:**
    *   *Warning Banner:* Displays a persistent top banner: `SANDBOX ACTIVE: Cloned from Production on [Timestamp].`
    *   *Toolbar Options:* Contains action buttons: **Reset Sandbox**, **Run Impact Analysis**, and **Commit to Production**.
*   **Impact Analysis Modal:**
    *   *Calculation Stage:* Displays a progress bar detailing the active analysis phases:
      1. Evaluating organizational structure dependencies (0-30%).
      2. Projecting cost allocations and general ledger impacts (31-60%).
      3. Recalculating team headcount metrics and task delivery run-rates (61-90%).
      4. Compiling the final strategic risk evaluation report (91-100%).
    *   *Report Interface:* Displays a split-screen view comparing production metrics on the left with sandbox projections on the right. Highlight negative impacts (e.g., budget overruns or SLA risks) in red.

---

### 7.4 Process Automation Screen (`/automation`)
*   **Workflow Directory Table:**
    *   *Columns:* Name, Trigger, Active Runs, Success Rate (%), SLA Compliance (%), Owner, Actions (Edit, Run, Delete).
    *   *Pagination:* Displays 10 records per page.
*   **Visual Workflow Builder (`/automation/builder/[id]`):**
    *   *Left Sidebar:* Drag-and-drop panel containing workflow nodes (Webhook, Cron, Slack Alert, Jira Ticket, Database Action, Approval Gate).
    *   *Canvas Area:* React Flow grid layout supporting zoom, pan, and box-selection actions.
    *   *Validation Rules:*
      *   The workflow must start with a trigger node (Webhook, Cron, or File Watcher).
      *   All connected edges must have defined source and target handles.
      *   Node configurations must pass validation checks (e.g., API Webhooks require a target URL, and Jira nodes require a project key).
      *   Clicking **Save Workflow** triggers validation. If checks fail, the system highlights the invalid nodes in red and displays an alert listing the errors.

---

## 8. Diagnostic and Troubleshooting User Workflows

To support operational teams, SentinelOS includes diagnostic workflows for identifying and resolving system issues.

### 8.1 Troubleshooting Sync Failures
When database synchronization tasks fail, administrators can use these steps to resolve the issue:

1. **Accessing System Health Logs:**
   * Open the **Audits and Compliance** tab and click **System Health**.
   * The dashboard displays status metrics for database services, memory caches, and worker threads.
   * If a sync failure occurs, the **Relational-to-Graph Sync Status** widget displays a red alert: `Sync Lag Detected: 125 Pending Messages in RabbitMQ`.
2. **Identifying the Blocked Task:**
   * Click **Review Queue Latency** to view details about the active queue.
   * Locate the failing task in the table (e.g., `sentinel.tasks.graph.assign_employee_department` returning a `NodeNotFoundException` error).
   * Click **Diagnose Task** to inspect the payload details:
     ```json
     {
       "task_id": "8f9a0c1e-3b5d-4f7a-9c2e-1d3b5f7a9c2e",
       "args": ["emp_019a2b3c", "DEPT-RND-NEW", "2026-07-13T12:00:00Z"],
       "error": "Node matching filter 'Department {code: DEPT-RND-NEW}' not found in Neo4j."
     }
     ```
3. **Resolving the Missing Entity:**
   * Click **Resolve Target** in the diagnostics panel.
   * The system checks the database state and identifies that the department code `DEPT-RND-NEW` exists in PostgreSQL but has not been mirrored to Neo4j.
   * Click **Run Manual Mirror**. The worker runs a transaction to write the missing department node to Neo4j, then retries the blocked assignment task.
   * The status widget transitions to Green, and the queue latency logs return to normal.

---

### 8.2 Resolving Security Authorization Errors
When a user encounters a security clearance block, administrators can review the access logs to resolve the issue:

1. **Opening the Security Incidents Board:**
   * Open the **Audits and Compliance** tab and click **Security Incidents**.
   * Locate the blocked query record in the table (e.g., `User John Smith blocked from accessing general ledger node`).
2. **Diagnosing the Authorization Failure:**
   * Click **Inspect Security Scope** to view details about the request.
   * The interface displays a visual diagram comparing the user's role mapping and clearance level on the left with the target node's clearance requirements on the right.
3. **Resolving the Authorization Block:**
   * If the access is valid, click **Modify Access Scope**.
   * In the configuration panel, select the target user or resource:
     * *Update Resource Clearance:* Lower the required clearance level of the node.
     * *Assign Temporary Override:* Grant the user a temporary clearance level boost for a specific duration.
   * Click **Confirm Access Adjustments**. The update is logged in the PostgreSQL audit trail, and the user's blocked query resumes execution.

---
## End of User Workflow Plan Document
This marks the completion of the SentinelOS User Workflow Plan. All chapters have been populated with technical details.






