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
from app.services.ai_service import FAST_MODEL, AnthropicClient
from app.core.firebase_auth import get_current_user
from app.utils.llm_logging import log_llm_response

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
        # Initialize the AI client
        client = AnthropicClient()
        
        # Create the system message and user message
        system_prompt = project_description_system_prompt()
        
        # Create the user message with the project description
        user_message = f"Original description: {request.user_description}"
        
        # Generate the response
        messages = [{"role": "user", "content": user_message}]
        response = client.generate_response(messages, system_prompt, FAST_MODEL)
        
        # Log the LLM response
        log_llm_response(
            project_id=request.project_id if hasattr(request, "project_id") else "unknown",
            response_type="enhance_description",
            response=response,
            parsed_data={"enhanced_description": response},
            metadata={
                "user_id": current_user.get("uid") if current_user else None,
                "model": FAST_MODEL,
                "system_message": system_prompt,
                "user_message": user_message,
                "original_description": request.user_description
            }
        )
        
        # Return the enhanced description
        return DescriptionEnhanceResponse(enhanced_description=response)
    except Exception as e:
        logger.error(f"Error enhancing project description: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance project description: {str(e)}"
        )