"""
API routes for UI pages enhancement using AI.
"""
import logging
import json
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.tools.print_pages import print_pages_input_schema
from app.ai.prompts.pages import get_pages_user_prompt
from app.schemas.ai_text import (
    PagesEnhanceRequest,
    PagesEnhanceResponse,
    PagesData,
)
from app.services.ai_service import AnthropicClient, INTELLIGENT_MODEL
from app.core.firebase_auth import get_current_user
from app.api.routes.ai_text_utils import extract_data_from_response
from app.utils.llm_logging import DefaultLLMLogger

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

@router.post("/enhance-pages", response_model=PagesEnhanceResponse)
async def enhance_pages(
    request: PagesEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance application pages using AI with function calling.
    
    This endpoint takes a project description, features, requirements, and optionally
    existing pages, and returns an improved, structured set of pages organized by access level.
    It uses Anthropic's tool use feature to ensure a structured response.
    """
    try:
        # Create the logger implementation
        llm_logger = DefaultLLMLogger()
        
        # Initialize the AI client with the logger
        client = AnthropicClient(llm_logger)
        
        # Create the system message
        system_message = (
            "You are a UX designer generating screen recommendations for a software project. "
            "Based on the project description, features, and requirements, recommend key UI screens."
        )
        
        # Format features and requirements as strings
        formatted_features = "None provided"
        if request.features and len(request.features) > 0:
            formatted_features = json.dumps(request.features, indent=2)
            
        formatted_requirements = "\n".join([f"- {req}" for req in request.requirements])
        
        # Format existing pages if provided
        formatted_existing_pages = "None provided"
        if request.existing_pages:
            formatted_existing_pages = json.dumps(request.existing_pages.dict(), indent=2)
        
        # Create the user message
        user_prompt = get_pages_user_prompt(
            request.project_description,
            formatted_features,
            formatted_requirements,
            formatted_existing_pages,
            request.additional_user_instruction
        )
        
        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        tools = [print_pages_input_schema()]
        response = client.get_tool_use_response(system_message, tools, messages, model=INTELLIGENT_MODEL,
            log_metadata={
                "user_id": current_user.get("uid") if current_user else None,
                "project_id": request.project_id if hasattr(request, "project_id") else "unknown",
                "project_description": request.project_description,
                "features": request.features,
                "requirements": request.requirements,
                "existing_pages": request.existing_pages.dict() if request.existing_pages else None,
                "additional_user_instruction": request.additional_user_instruction
            },
            response_type="enhance_pages"
        )
        
        if "error" in response:
            logger.error(f"Error in AI tool use: {response['error']}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate pages: {response['error']}"
            )
            
        # Extract pages data with fallback mechanisms
        pages_data = extract_data_from_response(response, PagesData, logger)
            
        # Return the enhanced pages
        return PagesEnhanceResponse(data=pages_data)
    except Exception as e:
        logger.error(f"Error enhancing pages: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance pages: {str(e)}"
        )