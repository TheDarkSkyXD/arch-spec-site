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
from app.services.ai_service import AIService, INTELLIGENT_MODEL
from app.core.firebase_auth import get_current_user
from app.api.routes.ai_text_utils import extract_data_from_response
from app.utils.llm_logging import DefaultLLMLogger
from app.db.base import db
from app.services.db_usage_tracker import DatabaseUsageTracker

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])


@router.post("/enhance-tech-stack", response_model=TechStackEnhanceResponse)
async def enhance_tech_stack(
    request: TechStackEnhanceRequest, current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance technology stack recommendations.
    """
    try:
        # Create the service objects
        llm_logger = DefaultLLMLogger()
        usage_tracker = DatabaseUsageTracker(db.get_db())

        # Initialize the AI client with the logger and usage tracker
        client = AIService(llm_logger, usage_tracker)

        # Create system message
        system_message = (
            "You are an expert software architect specializing in tech stack selection."
        )

        # Format the input
        user_prompt = get_tech_stack_user_prompt(
            request.project_description,
            request.project_requirements,
            request.user_preferences,
            request.additional_user_instruction,
        )

        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        tools = [print_tech_stack_input_schema()]
        response = await client.get_tool_use_response(
            system_message,
            tools,
            messages,
            model=INTELLIGENT_MODEL,
            log_metadata={
                "user_id": current_user.get("firebase_uid") if current_user else None,
                "project_id": request.project_id if hasattr(request, "project_id") else "unknown",
                "project_description": request.project_description,
                "project_requirements": request.project_requirements,
                "user_preferences": request.user_preferences,
                "additional_user_instruction": request.additional_user_instruction,
            },
            response_type="enhance_tech_stack",
            check_credits=True,
            use_token_api_for_estimation=True,
        )

        # Handle potential credit errors - check the response content if it's a dict
        if (
            isinstance(response, dict)
            and isinstance(response.get("content"), str)
            and response["content"].startswith("Insufficient credits")
        ):
            raise HTTPException(status_code=402, detail=response["content"])
        elif isinstance(response, str) and response.startswith("Insufficient credits"):
            raise HTTPException(status_code=402, detail=response)

        # Extract the response data
        tech_stack_data = extract_data_from_response(response, TechStackRecommendation, logger)

        return {"data": tech_stack_data}
    except Exception as e:
        logger.error(f"Error enhancing tech stack: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error enhancing tech stack: {str(e)}")
