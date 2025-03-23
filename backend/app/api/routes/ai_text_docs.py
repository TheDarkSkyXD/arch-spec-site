"""
API routes for documentation generation using AI.
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.prompts.readme import readme_system_prompt, get_readme_user_prompt
from app.schemas.ai_text import (
    EnhanceReadmeRequest,
    EnhanceReadmeResponse,
)
from app.services.ai_service import FAST_MODEL, AnthropicClient
from app.core.firebase_auth import get_current_user
from app.utils.llm_logging import log_llm_response

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

@router.post("/enhance-readme", response_model=EnhanceReadmeResponse)
async def enhance_readme(
    request: EnhanceReadmeRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance project README using AI.
    
    This endpoint takes project information including name, description, business goals,
    requirements, features, and tech stack, and generates a comprehensive README markdown file.
    """
    try:
        # Initialize the AI client
        client = AnthropicClient()
        
        # Create the system message
        system_message = readme_system_prompt(request.additional_user_instruction)
        
        # Create the user message
        user_message = get_readme_user_prompt(
            request.project_name,
            request.project_description,
            request.business_goals,
            request.requirements,
            request.features,
            request.tech_stack,
            request.additional_user_instruction
        )
        
        # Generate the response
        messages = [{"role": "user", "content": user_message}]
        response = client.generate_response(messages, system_message, FAST_MODEL)
        
        # Log the LLM response
        log_llm_response(
            project_id=request.project_id if hasattr(request, "project_id") else "unknown",
            response_type="generate_readme",
            response=response,
            parsed_data={"enhanced_readme": response.strip()},
            metadata={
                "user_id": current_user.get("uid") if current_user else None,
                "model": FAST_MODEL,
                "system_message": system_message,
                "user_message": user_message,
                "project_name": request.project_name,
                "project_description": request.project_description,
                "business_goals": request.business_goals,
                "requirements": request.requirements,
                "features": request.features,
                "tech_stack": request.tech_stack,
                "additional_user_instruction": request.additional_user_instruction
            }
        )
        
        # Return the enhanced README
        return EnhanceReadmeResponse(enhanced_readme=response.strip())
    except Exception as e:
        logger.error(f"Error generating README: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate README: {str(e)}"
        )