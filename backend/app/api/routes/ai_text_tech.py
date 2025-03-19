"""
API routes for tech stack recommendations using AI.
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.tools.print_tech_stack import print_tech_stack_input_schema
from app.ai.prompts.tech_stack import get_tech_stack_user_prompt
from app.schemas.ai_text import (
    TechStackEnhanceRequest,
    TechStackEnhanceResponse,
    TechStackRecommendation,
)
from app.services.ai_service import AnthropicClient
from app.core.firebase_auth import get_current_user
from app.api.routes.ai_text_utils import extract_data_from_response

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

@router.post("/enhance-tech-stack", response_model=TechStackEnhanceResponse)
async def enhance_tech_stack(
    request: TechStackEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance technology stack recommendations.
    """
    try:
        client = AnthropicClient()
        
        # Format the input
        user_prompt = get_tech_stack_user_prompt(
            request.project_description, 
            request.project_requirements,
            request.user_preferences
        )
        
        messages = [{"role": "user", "content": user_prompt}]
        
        # Call the AI service
        response = client.get_tool_use_response(
            system_prompt="You are an expert software architect specializing in tech stack selection.",
            tools=[print_tech_stack_input_schema()],
            messages=messages
        )
        
        # Extract the response data
        tech_stack_data = extract_data_from_response(response, TechStackRecommendation, logger)
        
        return {"data": tech_stack_data}
    except Exception as e:
        logger.error(f"Error enhancing tech stack: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error enhancing tech stack: {str(e)}")