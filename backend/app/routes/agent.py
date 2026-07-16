"""
SentinelOS AI – Agent Query Route

Enterprise REST endpoint to interact with the LangGraph multi-agent orchestrator.
Handles user questions, delegates to the agent logic, and returns the synthesized response.
"""

import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage

from backend.app.middleware.security import TokenPayload, get_current_user
from agents.graph import agent_executor
from agents.state import AgentState

logger = logging.getLogger("sentinel.routes.agent")
router = APIRouter(prefix="/agent", tags=["AI Agent"])


class AgentQueryRequest(BaseModel):
    query: str = Field(..., description="The question or command for the Digital Twin AI.")
    session_id: str = Field(..., description="Optional session ID for memory tracking (not fully implemented).")


class AgentQueryResponse(BaseModel):
    answer: str
    intent_detected: str
    errors: list[str] = []


@router.post("/query", response_model=AgentQueryResponse)
async def query_agent(
    payload: AgentQueryRequest,
    user: TokenPayload = Depends(get_current_user),
):
    """
    Send a query to the SentinelOS AI agent.
    The agent will autonomously decide whether to search documents (RAG),
    query the knowledge graph (Neo4j), or look up exact metrics (PostgreSQL)
    based on the user's intent.
    """
    tenant_id = user.tenant_id
    
    # Initialize the LangGraph state
    initial_state = {
        "tenant_id": tenant_id,
        "user_id": user.sub,
        "security_clearance": user.clearance_weight,
        "messages": [HumanMessage(content=payload.query)],
        "current_intent": None,
        "extracted_entities": {},
        "retrieved_graph_context": [],
        "retrieved_vector_context": [],
        "retrieved_sql_context": [],
        "final_answer": None,
        "errors": []
    }
    
    try:
        logger.info(f"Invoking LangGraph agent for tenant {tenant_id} with query: '{payload.query}'")
        
        # Invoke the compiled LangGraph workflow
        final_state = await agent_executor.ainvoke(initial_state)
        logger.info(f"LangGraph execution finished. Keys in final state: {list(final_state.keys())}")
        
        final_answer = final_state.get("final_answer")
        if not final_answer and final_state.get("messages"):
            final_answer = final_state["messages"][-1].content
            
        logger.info(f"Final answer generated: {final_answer}")
        
        return AgentQueryResponse(
            answer=final_answer or "No answer generated.",
            intent_detected=final_state.get("current_intent") or "GENERAL",
            errors=final_state.get("errors", [])
        )
        
    except Exception as e:
        logger.error(f"Agent execution failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI Agent encountered an error: {str(e)}"
        )
