import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from backend.app.middleware.security import TokenPayload, get_current_user
from backend.app.config import settings

logger = logging.getLogger("sentinel.routes.simulation")
router = APIRouter(prefix="/simulation", tags=["Business Simulation"])


class SimulationInsightsRequest(BaseModel):
    initial_metrics: dict = Field(..., description="Map of current business metrics before sandbox changes.")
    simulated_metrics: dict = Field(..., description="Map of forecasted metrics after sandbox adjustments.")


class SimulationInsightsResponse(BaseModel):
    insights: str = Field(..., description="Narrative analysis explaining the cascading trade-offs.")


@router.post("/insights", response_model=SimulationInsightsResponse)
async def generate_simulation_insights(
    payload: SimulationInsightsRequest,
    user: TokenPayload = Depends(get_current_user),
):
    """
    Generate contextual AI insights explaining the cascading trade-offs of simulated business choices.
    """
    initial = payload.initial_metrics
    simulated = payload.simulated_metrics

    # Compose the executive prompt detailing baseline vs simulated states
    prompt = (
        "You are an executive business analyst for SentinelOS Digital Twin. "
        "Analyze the following simulated corporate changes and provide a professional, executive-level summary of the cascading business consequences.\n\n"
        "Initial State:\n"
        f"- Total Employees: {initial.get('total_employees', 'N/A')}\n"
        f"- Annual Recurring Revenue (ARR): EUR {initial.get('total_revenue_arr', 'N/A'):,}\n"
        f"- Monthly Operating Expenses (OpEx): EUR {initial.get('total_opex_monthly', 'N/A'):,}\n"
        f"- Monthly Profit: EUR {initial.get('total_profit_monthly', 'N/A'):,}\n"
        f"- Company Health Score: {initial.get('company_health_score', 'N/A')}/100\n"
        f"- Employee Satisfaction: {initial.get('employee_satisfaction', 'N/A')}%\n"
        f"- Customer Satisfaction: {initial.get('customer_satisfaction', 'N/A')}%\n"
        f"- Security Risk Score: {initial.get('risk_score', 'N/A')}%\n"
        f"- Engineering Productivity: {initial.get('productivity', 'N/A')}%\n"
        f"- Project Delivery Speed: {initial.get('delivery_speed', 'N/A')}%\n\n"
        "Simulated State (Forecasted):\n"
        f"- Total Employees: {simulated.get('total_employees', 'N/A')}\n"
        f"- Annual Recurring Revenue (ARR): EUR {simulated.get('total_revenue_arr', 'N/A'):,}\n"
        f"- Monthly Operating Expenses (OpEx): EUR {simulated.get('total_opex_monthly', 'N/A'):,}\n"
        f"- Monthly Profit: EUR {simulated.get('total_profit_monthly', 'N/A'):,}\n"
        f"- Company Health Score: {simulated.get('company_health_score', 'N/A')}/100\n"
        f"- Employee Satisfaction: {simulated.get('employee_satisfaction', 'N/A')}%\n"
        f"- Customer Satisfaction: {simulated.get('customer_satisfaction', 'N/A')}%\n"
        f"- Security Risk Score: {simulated.get('risk_score', 'N/A')}%\n"
        f"- Engineering Productivity: {simulated.get('productivity', 'N/A')}%\n"
        f"- Project Delivery Speed: {simulated.get('delivery_speed', 'N/A')}%\n\n"
        "Explain the exact causal chain links of the simulated actions in exactly 3 clear, impact-focused, bulleted sentences. "
        "Be concise and write in a professional executive tone. Output ONLY the 3 bullet points."
    )

    try:
        logger.info(f"Generating AI simulation insights for tenant {user.tenant_id}")
        
        # We reuse the chat model configured for OpenRouter
        from agents.graph import get_chat_model
        from langchain_core.messages import HumanMessage
        
        chat_model = get_chat_model()
        response = await chat_model.ainvoke([HumanMessage(content=prompt)])
        
        insights_text = response.content.strip()
        logger.info(f"Successfully generated insights text: {insights_text[:80]}...")
        
        return SimulationInsightsResponse(insights=insights_text)
        
    except Exception as e:
        logger.error(f"Error generating simulation insights: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate simulation insights: {str(e)}"
        )
