"""
API routes for feature enhancement using AI.
"""
import logging
import json
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.tools.print_features import print_features_input_schema
from app.ai.prompts.features import get_features_user_prompt
from app.schemas.ai_text import (
    FeaturesEnhanceRequest,
    FeaturesEnhanceResponse,
    FeaturesData,
)
from app.services.ai_service import AIService, INTELLIGENT_MODEL
from app.core.firebase_auth import get_current_user
from app.api.routes.ai_text_utils import extract_data_from_response
from app.utils.llm_logging import DefaultLLMLogger
from app.db.base import db
from app.services.db_usage_tracker import DatabaseUsageTracker

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

@router.post("/enhance-features", response_model=FeaturesEnhanceResponse)
async def enhance_features(
    request: FeaturesEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance project features using AI with function calling.
    
    This endpoint takes a project description, business goals, requirements, and optionally
    existing features, and returns an improved, structured feature set with core and optional modules.
    It uses Anthropic's tool use feature to ensure a structured response.
    """
    try:
        # Create the service objects
        llm_logger = DefaultLLMLogger()
        usage_tracker = DatabaseUsageTracker(db.get_db())
        
        # Initialize the AI client with the logger and usage tracker
        client = AIService(llm_logger, usage_tracker)
        
        # Create the system message
        system_message = (
            "You are a product manager refining or generating features for a software project. "
            "Based on the project description, business goals, and requirements, create a comprehensive feature list."
        )
        
        # Format the business goals and requirements as strings
        formatted_goals = "\n".join([f"- {goal}" for goal in request.business_goals])
        formatted_requirements = "\n".join([f"- {req}" for req in request.requirements])
        
        # Format the original features if provided
        formatted_features = "None provided"
        if request.user_features and len(request.user_features) > 0:
            formatted_features = json.dumps(request.user_features, indent=2)
        
        user_prompt = get_features_user_prompt(
            request.project_description, 
            formatted_goals, 
            formatted_requirements, 
            formatted_features,
            request.additional_user_instruction
        )
        
        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        tools = [print_features_input_schema()]
        response = await client.get_tool_use_response(system_message, tools, messages, model=INTELLIGENT_MODEL,
            log_metadata={
                "user_id": current_user.get("firebase_uid") if current_user else None,
                "project_id": request.project_id if hasattr(request, "project_id") else "unknown",
                "project_description": request.project_description,
                "business_goals": request.business_goals,
                "requirements": request.requirements,
                "user_features": request.user_features,
                "additional_user_instruction": request.additional_user_instruction
            },
            response_type="enhance_features",
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
        
        if "error" in response:
            logger.error(f"Error in AI tool use: {response['error']}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate features: {response['error']}"
            )
            
        # Extract features data with fallback mechanisms
        features_data = extract_data_from_response(response, FeaturesData, logger)
            
        # Return the enhanced features
        return FeaturesEnhanceResponse(data=features_data)
    except Exception as e:
        logger.error(f"Error enhancing features: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance features: {str(e)}"
        )