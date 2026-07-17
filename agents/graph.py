"""
SentinelOS AI – LangGraph Agent Orchestrator

Compiles the multi-agent reasoning loop. It routes user intents,
selects the appropriate tool (Neo4j, Qdrant, Postgres),
synthesizes retrieved context, and generates the final response.
"""

import logging
from typing import Literal
import openai

from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from langgraph.prebuilt import ToolNode
from langchain_openai import ChatOpenAI

from agents.state import AgentState
from agents.tools import search_documents_tool, query_knowledge_graph_tool, query_relational_db_tool
from backend.app.config import settings

logger = logging.getLogger("sentinel.agents.graph")

# Define the set of tools available to the agent
agent_tools = [search_documents_tool, query_knowledge_graph_tool, query_relational_db_tool]
tool_node = ToolNode(agent_tools)


def get_chat_model() -> ChatOpenAI:
    """Create a ChatOpenAI model configured for OpenRouter using official client guidelines."""
    return ChatOpenAI(
        model=settings.OPENROUTER_MODEL,
        openai_api_key=settings.OPENROUTER_API_KEY,
        openai_api_base="https://openrouter.ai/api/v1",
        max_retries=1,
        default_headers={
            "HTTP-Referer": "https://sentinelos.com",
            "X-Title": "SentinelOS"
        }
    )


async def intent_router(state: AgentState) -> dict:
    """
    Analyzes the latest user message and determines the primary intent.
    Uses OpenRouter with precise error handling.
    """
    messages = state["messages"]
    last_user_msg = [m for m in messages if isinstance(m, HumanMessage)][-1].content
    
    sys_prompt = """
    You are the SentinelOS Digital Twin Router. 
    Analyze the user's query and categorize their intent into exactly one of:
    - RAG_SEARCH: Questions about documents, policies, notes, unstructured data.
    - GRAPH_QUERY: Questions about relationships (who reports to who, ticket assignments, dependencies).
    - SQL_QUERY: Questions about exact numbers (ARR, budgets, headcount) or tabular data.
    - GENERAL: General conversational questions (greetings, off-topic chat).
    Reply with ONLY the category string.
    """
    
    try:
        llm = get_chat_model()
        response = await llm.ainvoke([
            SystemMessage(content=sys_prompt),
            HumanMessage(content=last_user_msg)
        ])
        
        if not response or not response.content:
            raise ValueError("Empty response received from the AI model.")
            
        intent = response.content.strip().upper()
        # Fallback to GENERAL if returned intent is unexpected
        if intent not in ["RAG_SEARCH", "GRAPH_QUERY", "SQL_QUERY", "GENERAL"]:
            intent = "GENERAL"
            
        return {"current_intent": intent}
    except openai.AuthenticationError as e:
        logger.error(f"OpenRouter Authentication Error in router: {e}")
        return {"current_intent": "GENERAL", "errors": ["Invalid OpenRouter API Key."]}
    except openai.RateLimitError as e:
        logger.error(f"OpenRouter Rate Limit in router: {e}")
        return {"current_intent": "GENERAL", "errors": ["Rate limit exceeded. Please try again shortly."]}
    except (openai.APIConnectionError, openai.InternalServerError) as e:
        logger.error(f"OpenRouter Network/Server Error in router: {e}")
        return {"current_intent": "GENERAL", "errors": ["Network error connecting to OpenRouter."]}
    except Exception as e:
        logger.error(f"Error in intent_router: {e}")
        return {"current_intent": "GENERAL", "errors": [str(e)]}


def route_intent(state: AgentState) -> Literal["tool_planner", "synthesize"]:
    """Fast-path routing based on intent router decision."""
    intent = state.get("current_intent")
    if intent == "GENERAL":
        return "synthesize"
    return "tool_planner"


async def tool_execution_planner(state: AgentState) -> dict:
    """
    Constructs the appropriate tool call if needed, or replies directly.
    Uses OpenRouter to autonomously decide with error handling.
    """
    tenant_id = state["tenant_id"]
    messages = state["messages"]
    errors = list(state.get("errors") or [])
    
    # Detect if the last message was a tool error and log it
    if messages and isinstance(messages[-1], ToolMessage) and messages[-1].content.startswith("Error"):
        errors.append("Self-Correction Retry")
        logger.info(f"Self-correction loop triggered for tenant {tenant_id}. Last error: {messages[-1].content}")
    
    sys_prompt = f"""
    You are SentinelOS, an enterprise digital twin assistant. 
    Tenant ID: {tenant_id}
    
    Analyze the user's query and decide if you need to fetch data:
    - If the query is about employees, departments, projects, customers, or tickets, use the appropriate tool:
      - `query_relational_db_tool` for exact numbers, salaries, counts, budgets, or simple lists.
      - `query_knowledge_graph_tool` for relationships, reporting lines, dependencies, and complex connections.
      - `search_documents_tool` for document content, policies, compliance questions, or text search.
    - If the query is a simple greeting (e.g. "hii", "hello") or a general question, reply directly and DO NOT call any tools.

    If you previously made a tool call and received an error, analyze the error message and correct your query (e.g. ensure SQL/Cypher syntax is valid and includes the correct tenant_id parameter).
    """
    
    try:
        llm = get_chat_model()
        llm_with_tools = llm.bind_tools(agent_tools)
        
        # Pass full message history so the model sees past tool calls and errors
        response = await llm_with_tools.ainvoke([
            SystemMessage(content=sys_prompt)
        ] + list(messages))
        
        if not response or (not response.content and not response.tool_calls):
            raise ValueError("Empty response received from the AI model.")
            
        return {"messages": [response], "errors": errors}
    except openai.AuthenticationError as e:
        logger.error(f"OpenRouter Authentication Error in tool planner: {e}")
        return {"messages": [AIMessage(content="Error: Invalid OpenRouter API Key.")], "errors": ["Invalid OpenRouter API Key."]}
    except openai.RateLimitError as e:
        logger.error(f"OpenRouter Rate Limit in tool planner: {e}")
        return {"messages": [AIMessage(content="Error: OpenRouter rate limit exceeded. Please try again shortly.")], "errors": ["Rate limit exceeded."]}
    except (openai.APIConnectionError, openai.InternalServerError) as e:
        logger.error(f"OpenRouter Network/Server Error in tool planner: {e}")
        return {"messages": [AIMessage(content="Error: Network error. Failed to connect to OpenRouter.")], "errors": ["Network/API connection error."]}
    except Exception as e:
        logger.error(f"Tool planner failed: {e}")
        return {"messages": [AIMessage(content=f"Error processing request: {str(e)}")], "errors": [str(e)]}


def should_continue(state: AgentState) -> Literal["tools", "__end__"]:
    """Determine whether to route to the ToolNode or end the workflow immediately."""
    messages = state["messages"]
    last_message = messages[-1]
    # If the LLM generated a tool call, we execute it
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    # Otherwise, it replied directly (greeting or simple answer), so we stop
    return "__end__"


def check_tool_errors(state: AgentState) -> Literal["tool_planner", "synthesize"]:
    """
    Check if the last tool execution failed.
    If yes, and we haven't retried yet, route back to 'tool_planner' to self-correct.
    Otherwise, proceed to 'synthesize'.
    """
    messages = state["messages"]
    errors = state.get("errors") or []
    
    if messages and isinstance(messages[-1], ToolMessage):
        if messages[-1].content.startswith("Error"):
            retry_count = sum(1 for err in errors if "Self-Correction" in err)
            if retry_count < 1:
                return "tool_planner"
                
    return "synthesize"


async def synthesize_response(state: AgentState) -> dict:
    """
    Synthesize the final answer using the retrieved tool outputs with error handling.
    """
    formatted_messages = []
    formatted_messages.append(
        SystemMessage(content="You are SentinelOS, an enterprise digital twin assistant. Synthesize the provided tool results to answer the user's question clearly, concisely, and professionally. Only use the facts retrieved.")
    )
    
    for msg in state["messages"]:
        if isinstance(msg, HumanMessage):
            formatted_messages.append(HumanMessage(content=msg.content))
        elif isinstance(msg, AIMessage):
            content = msg.content or "(Executed Tool)"
            formatted_messages.append(AIMessage(content=content))
        elif isinstance(msg, ToolMessage):
            formatted_messages.append(SystemMessage(content=f"Tool Result: {msg.content}"))
            
    try:
        llm = get_chat_model()
        response = await llm.ainvoke(formatted_messages)
        
        if not response or not response.content:
            raise ValueError("Empty response received from the AI model.")
            
        final_answer = response.content
        return {"final_answer": final_answer, "messages": [AIMessage(content=final_answer)]}
    except openai.AuthenticationError as e:
        logger.error(f"OpenRouter Authentication Error in synthesis: {e}")
        return {"final_answer": "Error: Invalid OpenRouter API Key.", "errors": ["Invalid OpenRouter API Key."]}
    except openai.RateLimitError as e:
        logger.error(f"OpenRouter Rate Limit in synthesis: {e}")
        return {"final_answer": "Error: OpenRouter rate limit exceeded. Please try again shortly.", "errors": ["Rate limit exceeded."]}
    except (openai.APIConnectionError, openai.InternalServerError) as e:
        logger.error(f"OpenRouter Network/Server Error in synthesis: {e}")
        return {"final_answer": "Error: Network connection failure.", "errors": ["Network error."]}
    except Exception as e:
        logger.error(f"Synthesis failed: {e}")
        return {"final_answer": f"Error formulation response: {str(e)}", "errors": [str(e)]}


# ─────────────────────────────────────────────────────────────────
# Build LangGraph State Machine
# ─────────────────────────────────────────────────────────────────

def build_agent_graph() -> StateGraph:
    """Compile and return the LangGraph executable application."""
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("router", intent_router)
    workflow.add_node("tool_planner", tool_execution_planner)
    workflow.add_node("tools", tool_node)
    workflow.add_node("synthesize", synthesize_response)
    
    # Set entry point
    workflow.add_edge(START, "router")
    
    # Conditional edge from router: fast-path for conversational queries
    workflow.add_conditional_edges(
        "router",
        route_intent,
        {
            "synthesize": "synthesize",
            "tool_planner": "tool_planner"
        }
    )
    
    # Routing from tool planner
    workflow.add_conditional_edges(
        "tool_planner",
        should_continue,
        {
            "tools": "tools",
            "__end__": END
        }
    )
    
    # Routing from tools: retry self-correction loop on errors
    workflow.add_conditional_edges(
        "tools",
        check_tool_errors,
        {
            "tool_planner": "tool_planner",
            "synthesize": "synthesize"
        }
    )
    
    workflow.add_edge("synthesize", END)
    
    return workflow.compile()

# Singleton instance of the compiled graph
agent_executor = build_agent_graph()
