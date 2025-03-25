"""
API routes for data model enhancement using AI.
"""
import logging
import json
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.tools.print_data_model import print_data_model_input_schema
from app.ai.prompts.data_model import get_data_model_user_prompt
from app.schemas.ai_text import (
    DataModelEnhanceRequest,
    DataModelEnhanceResponse,
    DataModel,
)
from app.services.ai_service import AIService, INTELLIGENT_MODEL
from app.core.firebase_auth import get_current_user
from app.api.routes.ai_text_utils import extract_data_from_response
from app.utils.llm_logging import DefaultLLMLogger
from app.services.db_usage_tracker import DatabaseUsageTracker
from app.db.base import db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

@router.post("/enhance-data-model", response_model=DataModelEnhanceResponse)
async def enhance_data_model(
    request: DataModelEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance data model using AI with function calling.
    
    This endpoint takes a project description, business goals, features, requirements, and optionally
    an existing data model, and returns an improved, structured data model with entities and relationships.
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
            "You are a database architect designing data models for a software project. "
            "Based on the project details, create comprehensive data models that support all the features and requirements."
        )
        
        # Format the business goals, features, and requirements as strings
        formatted_goals = "\n".join([f"- {goal}" for goal in request.business_goals])
        formatted_features = json.dumps(request.features, indent=2)
        formatted_requirements = "\n".join([f"- {req}" for req in request.requirements])
        
        # Format the original data model if provided
        formatted_data_model = "None provided"
        if request.existing_data_model and (
            "entities" in request.existing_data_model and 
            len(request.existing_data_model["entities"]) > 0
        ):
            formatted_data_model = json.dumps(request.existing_data_model, indent=2)
        
        user_prompt = get_data_model_user_prompt(
            request.project_description, 
            formatted_features, 
            formatted_requirements, 
            formatted_data_model,
            request.additional_user_instruction
        )

        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        tools = [print_data_model_input_schema()]
        response = await client.get_tool_use_response(system_message, tools, messages, model=INTELLIGENT_MODEL,
            log_metadata={
                "project_id": request.project_id if hasattr(request, "project_id") else "unknown",
                "user_id": current_user.get("firebase_uid") if current_user else None,
                "project_description": request.project_description,
                "business_goals": request.business_goals,
                "features": request.features,
                "requirements": request.requirements,
                "existing_data_model": request.existing_data_model,
                "additional_user_instruction": request.additional_user_instruction
            },
            response_type="enhance_data_model",
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
                detail=f"Failed to generate data model: {response['error']}"
            )
            
        # Extract data model with fallback mechanisms
        data_model = extract_data_from_response(response, DataModel, logger)
            
        # Return the enhanced data model
        return DataModelEnhanceResponse(data=data_model)
    except Exception as e:
        logger.error(f"Error enhancing data model: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance data model: {str(e)}"
        )