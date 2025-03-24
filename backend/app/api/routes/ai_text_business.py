"""
API routes for business goals and target users enhancement.
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.prompts.business_goals import business_goals_system_prompt_create, business_goals_system_prompt_enhance
from app.ai.prompts.target_users import target_users_system_prompt_create, target_users_system_prompt_enhance
from app.schemas.ai_text import (
    BusinessGoalsEnhanceRequest,
    BusinessGoalsEnhanceResponse,
    TargetUsersEnhanceRequest,
    TargetUsersEnhanceResponse,
)
from app.services.ai_service import FAST_MODEL, AnthropicClient
from app.core.firebase_auth import get_current_user
from app.utils.llm_logging import DefaultLLMLogger
from app.services.db_usage_tracker import DatabaseUsageTracker
from app.db.base import db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

@router.post("/enhance-business-goals", response_model=BusinessGoalsEnhanceResponse)
async def enhance_business_goals(
    request: BusinessGoalsEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance business goals using AI.
    
    This endpoint takes a project description and optionally the user's initial business goals
    and returns improved, more focused, and actionable business goals. If no initial goals are 
    provided, the system will generate appropriate goals based on the project description.
    """
    try:
        # Create the service objects
        llm_logger = DefaultLLMLogger()
        usage_tracker = DatabaseUsageTracker(db.get_db())
        
        # Initialize the AI client with the logger and usage tracker
        client = AnthropicClient(llm_logger, usage_tracker)
        
        # Create the system message, adjusting based on whether goals were provided
        if request.user_goals and len(request.user_goals) > 0:
            system_message = business_goals_system_prompt_enhance(request.additional_user_instruction)
            operation_type = "enhance_business_goals"
        else:
            system_message = business_goals_system_prompt_create(request.additional_user_instruction)
            operation_type = "create_business_goals"
        
        # Create the user message, adjusting based on whether goals were provided
        if request.user_goals and len(request.user_goals) > 0:
            # Format the user goals as a string
            formatted_goals = "\n".join([f"- {goal}" for goal in request.user_goals])
            
            # Create the user message with the project description and business goals
            user_message = (
                f"Project description: {request.project_description}\n"
                f"Original business goals:\n{formatted_goals}"
            )
        else:
            # Create the user message with just the project description
            user_message = f"Project description: {request.project_description}"
        
        # Generate the response
        messages = [{"role": "user", "content": user_message}]
        response = await client.generate_response(
            messages, 
            system_message, 
            FAST_MODEL,
            log_metadata={
                "user_id": current_user.get("firebase_uid") if current_user else None,
                "project_id": request.project_id if hasattr(request, "project_id") else "unknown",
                "project_description": request.project_description,
                "original_goals": request.user_goals if hasattr(request, "user_goals") else None,
                "additional_user_instruction": request.additional_user_instruction
            },
            response_type=operation_type,
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
        
        # Parse the bulleted list response into an array of goals
        enhanced_goals = []
        for line in response.split("\n"):
            # Remove leading/trailing whitespace
            line = line.strip()
            # Check if line is a bullet point (starts with - or •)
            if line.startswith("-") or line.startswith("•"):
                # Remove the bullet point and any leading/trailing whitespace
                goal = line[1:].strip()
                if goal:  # Only add non-empty goals
                    enhanced_goals.append(goal)
            # Also handle numbered lists (1., 2., etc.)
            elif line and line[0].isdigit() and line[1:].startswith(". "):
                goal = line[line.find(".")+1:].strip()
                if goal:  # Only add non-empty goals
                    enhanced_goals.append(goal)
        
        # If no goals were extracted, the response may not be in a bulleted format
        # In this case, try to split by newlines or just return the entire response as one goal
        if not enhanced_goals and response.strip():
            # Remove any explanatory text that might be at the beginning
            response_parts = response.split("\n\n")
            candidate_goals = response_parts[-1].split("\n")  # Take the last paragraph and split by lines
            enhanced_goals = [g.strip() for g in candidate_goals if g.strip()]
            
            # If still no goals, just use the entire response
            if not enhanced_goals:
                enhanced_goals = [response.strip()]
        
        # Return the enhanced business goals
        return BusinessGoalsEnhanceResponse(enhanced_goals=enhanced_goals)
    except Exception as e:
        logger.error(f"Error enhancing business goals: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance business goals: {str(e)}"
        )


@router.post("/enhance-target-users", response_model=TargetUsersEnhanceResponse)
async def enhance_target_users(
    request: TargetUsersEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance target users description using AI.
    
    This endpoint takes a project description and the user's initial target users description
    and returns an improved, more comprehensive user persona definition. If the target users
    description is empty, it will generate one based on the project description.
    """
    try:
        # Create the logger implementation
        llm_logger = DefaultLLMLogger()
        usage_tracker = DatabaseUsageTracker(db.get_db())   
        
        # Initialize the AI client with the logger and usage tracker
        client = AnthropicClient(llm_logger, usage_tracker)
        
        # Create the system message
        if request.target_users and len(request.target_users.strip()) > 0:
            system_message = target_users_system_prompt_enhance(request.additional_user_instruction)
            operation_type = "enhance_target_users"
        else:
            system_message = target_users_system_prompt_create(request.additional_user_instruction)
            operation_type = "create_target_users"
        
        # Create the user message
        if request.target_users and len(request.target_users.strip()) > 0:
            user_message = (
                f"Project description: {request.project_description}\n"
                f"Original target users: {request.target_users}"
            )
        else:
            user_message = f"Project description: {request.project_description}"
        
        # Generate the response
        messages = [{"role": "user", "content": user_message}]
        response = await client.generate_response(
            messages, 
            system_message, 
            FAST_MODEL,
            log_metadata={
                "user_id": current_user.get("firebase_uid") if current_user else None,
                "project_id": request.project_id if hasattr(request, "project_id") else "unknown",
                "project_description": request.project_description,
                "original_target_users": request.target_users if hasattr(request, "target_users") else None,
                "additional_user_instruction": request.additional_user_instruction
            },
            response_type=operation_type,
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
        
        # Return the enhanced target users description
        return TargetUsersEnhanceResponse(enhanced_target_users=response.strip())
    except Exception as e:
        logger.error(f"Error enhancing target users description: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance target users description: {str(e)}"
        )