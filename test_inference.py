import asyncio
import os
from uuid import uuid4
from langchain_core.messages import HumanMessage

# We must ensure environment variables are loaded
from backend.app.config import settings
from agents.graph import agent_executor

async def run_real_world_inference():
    """
    Tests the LangGraph multi-agent reasoning loop with a real-world query.
    Requires a valid OPENAI_API_KEY.
    """
    if not settings.OPENROUTER_API_KEY:
        print("❌ ERROR: OPENROUTER_API_KEY is not set. Cannot run real-world inference.")
        return

    print("🚀 Starting SentinelOS Real-World Inference Test...")
    
    # 1. Setup a dummy tenant and user context for the test
    tenant_id = str(uuid4())
    user_id = str(uuid4())
    
    # 2. Define a real-world query that requires routing to the Knowledge Graph
    query = "Who is the manager of the Engineering department, and what projects are they currently overseeing?"
    
    initial_state = {
        "tenant_id": tenant_id,
        "user_id": user_id,
        "security_clearance": 5, # Admin level
        "messages": [HumanMessage(content=query)],
        "current_intent": None,
        "extracted_entities": {},
        "retrieved_graph_context": [],
        "retrieved_vector_context": [],
        "retrieved_sql_context": [],
        "final_answer": None,
        "errors": []
    }
    
    print(f"\n🗣️  User Query: '{query}'")
    print("⏳ Invoking LangGraph Agent Orchestrator...\n")
    
    try:
        final_state = await agent_executor.ainvoke(initial_state)
        
        print("✅ Inference Complete!\n")
        print("🧠 Detected Intent:", final_state.get("current_intent"))
        print("💬 Final Agent Response:")
        print("-" * 50)
        print(final_state.get("final_answer"))
        print("-" * 50)
        
        if final_state.get("errors"):
            print("\n⚠️ Errors encountered during execution:")
            for err in final_state.get("errors"):
                print(f" - {err}")
                
    except Exception as e:
        print(f"\n❌ Pipeline failed during execution: {e}")

if __name__ == "__main__":
    asyncio.run(run_real_world_inference())
