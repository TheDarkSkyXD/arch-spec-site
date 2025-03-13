"""
API routes for AI text generation.
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List

from ...schemas.ai_text import (
    DescriptionEnhanceRequest, 
    DescriptionEnhanceResponse,
    BusinessGoalsEnhanceRequest,
    BusinessGoalsEnhanceResponse
)
from ...services.ai_service import AnthropicClient
from ...core.firebase_auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


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
        system_message = (
            "You are a technical writing assistant helping to improve project descriptions. "
            "You'll be given a user's project description that may be rough, informal, or incomplete. "
            "\n\nYour task:"
            "\n- Enhance clarity and professionalism while maintaining the original meaning"
            "\n- Fix grammar, spelling, and structure issues"
            "\n- Add technical precision where appropriate"
            "\n- Ensure the description clearly communicates what the project is about"
            "\n- Keep the length similar to the original (no more than 25% longer)"
            "\n- Do not add major new concepts not implied in the original"
            "\n\nReturn only the improved description without explanations or comments."
        )
        
        # Create the user message with the project description
        user_message = f"Original description: {request.user_description}"
        
        # Generate the response
        messages = [{"role": "user", "content": user_message}]
        response = client.generate_response(messages, system_message)
        
        # Return the enhanced description
        return DescriptionEnhanceResponse(enhanced_description=response)
    except Exception as e:
        logger.error(f"Error enhancing project description: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance project description: {str(e)}"
        )


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
        # Initialize the AI client
        client = AnthropicClient()
        
        # Create the system message, adjusting based on whether goals were provided
        if request.user_goals and len(request.user_goals) > 0:
            system_message = (
                "You are a business analyst helping to refine project goals. Review the project description "
                "and the user's initial business goals to provide more focused, actionable goals."
                "\n\nYour task:"
                "\n- Ensure the goals align with and support the project description"
                "\n- Restructure the goals to be clearer and more actionable"
                "\n- Make each goal specific, measurable, achievable, relevant, and time-bound (SMART) where possible"
                "\n- Use professional business terminology appropriately"
                "\n- Maintain the original intent and priorities"
                "\n- Format as a concise, bulleted list"
                "\n- Limit to 3-5 clear goals (combine related goals if needed)"
                "\n- Do not introduce goals that weren't implied in the original text or project description"
                "\n\nReturn only the improved business goals as a bulleted list without explanations or comments."
            )
        else:
            system_message = (
                "You are a business analyst helping to create project goals. Review the project description "
                "and generate appropriate business goals for this project."
                "\n\nYour task:"
                "\n- Create 3-5 focused, actionable business goals that align with the project description"
                "\n- Make each goal specific, measurable, achievable, relevant, and time-bound (SMART) where possible"
                "\n- Use professional business terminology appropriately"
                "\n- Cover different aspects of the business value (e.g., user acquisition, revenue, user satisfaction)"
                "\n- Format as a concise, bulleted list"
                "\n- Only include goals that are reasonable based on the project description"
                "\n\nReturn only the business goals as a bulleted list without explanations or comments."
            )
        
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
        response = client.generate_response(messages, system_message)
        
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