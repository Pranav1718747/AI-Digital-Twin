import asyncio
from uuid import uuid4
from langchain_core.messages import HumanMessage
from backend.app.config import settings
from agents.graph import agent_executor

async def test_conversational_route():
    """
    Tests the LangGraph multi-agent reasoning loop on a conversational query.
    Bypasses databases via the GENERAL intent fast-path.
    """
    if not settings.OPENROUTER_API_KEY:
        print("❌ ERROR: OPENROUTER_API_KEY is not set in your .env file.")
        return

    print("🚀 Running SentinelOS Conversational Routing Test...")
    
    tenant_id = str(uuid4())
    user_id = str(uuid4())
    
    # Simple greeting to trigger fast-path GENERAL routing
    query = "Hello SentinelOS! What are you and how can you help me today?"
    
    initial_state = {
        "tenant_id": tenant_id,
        "user_id": user_id,
        "security_clearance": 3,
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
    print("⏳ Invoking LangGraph Agent...\n")
    
    try:
        final_state = await agent_executor.ainvoke(initial_state)
        
        print("✅ Executed Successfully!")
        print("🧠 Classified Intent:", final_state.get("current_intent"))
        print("💬 Final Agent Response:")
        print("-" * 60)
        print(final_state.get("final_answer"))
        print("-" * 60)
        
        if final_state.get("errors"):
            print("\n⚠️ Warnings/Errors:")
            for err in final_state.get("errors"):
                print(f" - {err}")
                
    except Exception as e:
        print(f"\n❌ Pipeline failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_conversational_route())
