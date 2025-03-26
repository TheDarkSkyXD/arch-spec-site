"""
API routes for project description enhancement.
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.prompts.project_description import project_description_system_prompt
from app.schemas.ai_text import (
    DescriptionEnhanceRequest, 
    DescriptionEnhanceResponse,
)
from app.services.ai_service import INTELLIGENT_MODEL, AIService
from app.core.firebase_auth import get_current_user
from app.utils.llm_logging import DefaultLLMLogger
from app.db.base import db
from app.services.db_usage_tracker import DatabaseUsageTracker

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

@router.post("/enhance-description", response_model=DescriptionEnhanceResponse)
async def enhance_project_description(
    request: DescriptionEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance a project description using AI.
    
    This endpoint takes a rough, informal, or incomplete project description
    and returns an improved version with better clarity, grammar, and
    technical precision.
    """
    try:
        # Create the service objects
        llm_logger = DefaultLLMLogger() 
        usage_tracker = DatabaseUsageTracker(db.get_db())
        
        # Initialize the AI client with the logger and usage tracker
        client = AIService(llm_logger, usage_tracker)
        
        # Create the system message and user message
        system_prompt = project_description_system_prompt(request.additional_user_instruction)
        
        # Create the user message with the project description
        user_message = f"Original description: {request.user_description}"
        
        # Generate the response
        messages = [{"role": "user", "content": user_message}]
        response = await client.generate_response(
            messages,
            system_prompt,
            INTELLIGENT_MODEL,
            log_metadata={
                "user_id": current_user.get("firebase_uid") if current_user else None,
                "project_id": request.project_id if hasattr(request, "project_id") else "unknown",
                "original_description": request.user_description,
                "additional_user_instruction": request.additional_user_instruction
            },
            response_type="enhance_description",
            check_credits=True,
            use_token_api_for_estimation=True
        )
        
        # Handle potential credit errors - check the response content if it's a dict
        if isinstance(response, dict) and isinstance(response.get('content'), str) and response['content'].startswith("Insufficient credits"):
            raise HTTPException(
                status_code=402,
                detail=response['content']
            )
        elif isinstance(response, str) and response.startswith("Insufficient credits"):
            raise HTTPException(
                status_code=402,
                detail=response
            )
        
        # Return the enhanced description
        return DescriptionEnhanceResponse(enhanced_description=response)
    except Exception as e:
        logger.error(f"Error enhancing project description: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance project description: {str(e)}"
        )