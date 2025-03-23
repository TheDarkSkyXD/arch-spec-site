"""
API routes for tech stack recommendations using AI.
"""
import logging
import json
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.tools.print_tech_stack import print_tech_stack_input_schema
from app.ai.prompts.tech_stack import get_tech_stack_user_prompt
from app.schemas.ai_text import (
    TechStackEnhanceRequest,
    TechStackEnhanceResponse,
    TechStackRecommendation,
)
from app.services.ai_service import AnthropicClient, INTELLIGENT_MODEL
from app.core.firebase_auth import get_current_user
from app.api.routes.ai_text_utils import extract_data_from_response
from app.utils.llm_logging import log_llm_response

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
        
        # Create system message
        system_message = "You are an expert software architect specializing in tech stack selection."
        
        # Format the input
        user_prompt = get_tech_stack_user_prompt(
            request.project_description, 
            request.project_requirements,
            request.user_preferences,
            request.additional_user_instruction
        )
        
        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        tools = [print_tech_stack_input_schema()]
        response = client.get_tool_use_response(system_message, tools, messages, model=INTELLIGENT_MODEL)
        
        # Log the LLM response
        log_llm_response(
            project_id=request.project_id if hasattr(request, "project_id") else "unknown",
            response_type="enhance_tech_stack",
            response=json.dumps(response),  # Convert response object to string for logging
            parsed_data=response,  # Store the structured response directly
            metadata={
                "user_id": current_user.get("uid") if current_user else None,
                "model": INTELLIGENT_MODEL,
                "system_message": system_message,
                "user_message": user_prompt,
                "tools": tools,
                "project_description": request.project_description,
                "project_requirements": request.project_requirements,
                "user_preferences": request.user_preferences,
                "additional_user_instruction": request.additional_user_instruction
            }
        )
        
        # Extract the response data
        tech_stack_data = extract_data_from_response(response, TechStackRecommendation, logger)
        
        return {"data": tech_stack_data}
    except Exception as e:
        logger.error(f"Error enhancing tech stack: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error enhancing tech stack: {str(e)}")