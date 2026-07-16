"""
SentinelOS AI – Agent State Definition

Defines the state schema for the LangGraph orchestrator.
Tracks user messages, extracted intent, retrieved context, and tool calls
across the execution graph for multi-agent reasoning.
"""

from typing import Annotated, TypedDict, List, Dict, Any, Optional
from uuid import UUID
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    """
    State payload that gets passed through the LangGraph node executions.
    """
    # Core attributes
    tenant_id: str
    user_id: str
    security_clearance: int
    
    # Conversation history (appends new messages)
    messages: Annotated[List[BaseMessage], add_messages]
    
    # Internal agent scratchpad / tracking
    current_intent: Optional[str]            # e.g., "query_employee", "analyze_project_health", "rag_search"
    extracted_entities: Dict[str, Any]       # e.g., {"employee_name": "Alice", "project_id": "P-123"}
    
    # Context retrieved from various sources
    retrieved_graph_context: List[Dict[str, Any]]
    retrieved_vector_context: List[Dict[str, Any]]
    retrieved_sql_context: List[Dict[str, Any]]
    
    # Final synthesized answer
    final_answer: Optional[str]
    
    # Error tracking
    errors: List[str]
