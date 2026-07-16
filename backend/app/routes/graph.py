"""
SentinelOS AI – Graph Query API Route

Enterprise-grade endpoint that queries Neo4j to return the
digital twin knowledge graph for Cytoscape.js visualization.
Supports filtering by node labels, depth traversal limits,
and tenant-scoped isolation.
"""

import logging
from uuid import UUID
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from backend.app.middleware.security import TokenPayload, get_current_user
from digital_twin.app.neo4j_manager import Neo4jManager

logger = logging.getLogger("sentinel.routes.graph")
router = APIRouter(prefix="/graph", tags=["Knowledge Graph"])


# ─────────────────────────────────────────────────────────────────
# Response Schemas
# ─────────────────────────────────────────────────────────────────

class GraphNode(BaseModel):
    id: str
    label: str = Field(description="Node label (Employee, Department, Project, etc.)")
    properties: dict = Field(default_factory=dict)


class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: str
    properties: dict = Field(default_factory=dict)


class GraphSnapshot(BaseModel):
    nodes: List[GraphNode] = Field(default_factory=list)
    edges: List[GraphEdge] = Field(default_factory=list)
    total_nodes: int = 0
    total_edges: int = 0


# ─────────────────────────────────────────────────────────────────
# Graph Snapshot Endpoint
# ─────────────────────────────────────────────────────────────────

@router.get("/snapshot", response_model=GraphSnapshot)
async def get_graph_snapshot(
    labels: Optional[str] = Query(
        default=None,
        description="Comma-separated node labels to filter (e.g., 'Employee,Department,Project')",
    ),
    depth: int = Query(default=2, ge=1, le=5, description="Max relationship traversal depth"),
    limit: int = Query(default=500, ge=1, le=2000, description="Max nodes to return"),
    user: TokenPayload = Depends(get_current_user),
):
    """
    Query the Neo4j knowledge graph and return a snapshot of nodes
    and edges for the Cytoscape.js frontend canvas.

    Filters results by the authenticated user's tenant_id.
    """
    tenant_id = user.tenant_id

    # Build label filter clause
    label_filter = ""
    if labels:
        label_list = [lbl.strip() for lbl in labels.split(",") if lbl.strip()]
        allowed_labels = {"Employee", "Department", "Project", "Customer", "Ticket"}
        invalid = set(label_list) - allowed_labels
        if invalid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid node labels: {invalid}. Allowed: {allowed_labels}",
            )
        label_conditions = " OR ".join([f"n:{lbl}" for lbl in label_list])
        label_filter = f"AND ({label_conditions})"

    # Cypher query: fetch tenant-scoped nodes and their relationships
    cypher = f"""
    MATCH (n)
    WHERE n.tenant_id = $tenant_id {label_filter}
    WITH n LIMIT $limit
    OPTIONAL MATCH (n)-[r]-(m)
    WHERE m.tenant_id = $tenant_id
    RETURN
        collect(DISTINCT {{
            id: n.id,
            label: labels(n)[0],
            properties: properties(n)
        }}) AS nodes,
        collect(DISTINCT {{
            source: startNode(r).id,
            target: endNode(r).id,
            relationship: type(r),
            properties: properties(r)
        }}) AS edges
    """

    try:
        with Neo4jManager.get_session() as session:
            result = session.run(cypher, {"tenant_id": tenant_id, "limit": limit})
            record = result.single()

            if not record:
                return GraphSnapshot()

            raw_nodes = record["nodes"] or []
            raw_edges = record["edges"] or []

            # Deduplicate and filter null entries
            seen_node_ids = set()
            nodes = []
            for n in raw_nodes:
                if n and n.get("id") and n["id"] not in seen_node_ids:
                    seen_node_ids.add(n["id"])
                    nodes.append(GraphNode(
                        id=n["id"],
                        label=n.get("label", "Unknown"),
                        properties={k: v for k, v in n.get("properties", {}).items()
                                    if k not in ("tenant_id",)},  # Strip tenant_id from output
                    ))

            seen_edges = set()
            edges = []
            for e in raw_edges:
                if e and e.get("source") and e.get("target"):
                    edge_key = (e["source"], e["target"], e.get("relationship", ""))
                    if edge_key not in seen_edges:
                        seen_edges.add(edge_key)
                        edges.append(GraphEdge(
                            source=e["source"],
                            target=e["target"],
                            relationship=e.get("relationship", "RELATED"),
                            properties=e.get("properties", {}),
                        ))

            return GraphSnapshot(
                nodes=nodes,
                edges=edges,
                total_nodes=len(nodes),
                total_edges=len(edges),
            )

    except Exception as e:
        logger.error(f"Graph query failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Knowledge graph service temporarily unavailable.",
        )
