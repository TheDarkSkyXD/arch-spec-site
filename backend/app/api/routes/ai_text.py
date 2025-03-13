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
    BusinessGoalsEnhanceResponse,
    TargetUsersEnhanceRequest,
    TargetUsersEnhanceResponse,
    RequirementsEnhanceRequest,
    RequirementsEnhanceResponse
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
        # Initialize the AI client
        client = AnthropicClient()
        
        # Create the system message
        if request.target_users and len(request.target_users.strip()) > 0:
            system_message = (
                "You are a UX researcher helping to refine target user personas for a project. "
                "You'll be given a project description and an initial description of target users. "
                "\n\nYour task:"
                "\n- Enhance the target users description with more detail and clarity"
                "\n- Identify key demographics, needs, goals, and pain points of the users"
                "\n- Make the description specific and actionable for design and marketing"
                "\n- Keep the tone professional while making the personas feel real and relatable"
                "\n- Format as a coherent paragraph (not a bulleted list)"
                "\n- Only include details that are reasonable given the project description"
                "\n- Keep the description concise (3-5 sentences)"
                "\n\nReturn only the improved target users description without explanations or comments."
            )
        else:
            system_message = (
                "You are a UX researcher helping to create target user personas for a project. "
                "You'll be given a project description and need to generate appropriate target users. "
                "\n\nYour task:"
                "\n- Create a clear description of the target users based on the project description"
                "\n- Identify likely demographics, needs, goals, and pain points of the users"
                "\n- Make the description specific and actionable for design and marketing"
                "\n- Keep the tone professional while making the personas feel real and relatable"
                "\n- Format as a coherent paragraph (not a bulleted list)"
                "\n- Only include details that are reasonable given the project description"
                "\n- Keep the description concise (3-5 sentences)"
                "\n\nReturn only the target users description without explanations or comments."
            )
        
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
        response = client.generate_response(messages, system_message)
        
        # Return the enhanced target users description
        return TargetUsersEnhanceResponse(enhanced_target_users=response.strip())
    except Exception as e:
        logger.error(f"Error enhancing target users description: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance target users description: {str(e)}"
        )


@router.post("/enhance-requirements", response_model=RequirementsEnhanceResponse)
async def enhance_requirements(
    request: RequirementsEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance project requirements using AI.
    
    This endpoint takes a project description, business goals and the user's initial requirements
    and returns improved, more focused, and actionable requirements. The AI will ensure the
    requirements align with the project description and business goals.
    """
    try:
        # Initialize the AI client
        client = AnthropicClient()
        
        # Create the system message
        system_message = (
            "You are a requirements analyst refining project requirements. "
            "You'll be given a project description, business goals, and the user's initial requirements."
            "\n\nYour task:"
            "\n- Ensure each requirement directly supports the project description and business goals"
            "\n- Convert vague statements into specific, testable requirements"
            "\n- Use the format \"The system shall...\" for functional requirements"
            "\n- Categorize requirements (functional, non-functional)"
            "\n- Remove duplicates and merge similar requirements"
            "\n- Identify and add any critical requirements that are missing but implied"
            "\n- If existing requirements are provided, generate complementary new requirements rather than just refining existing ones"
            "\n- Avoid duplicating functionality already covered by existing requirements"
            "\n- Prioritize requirements (High/Medium/Low) based on their importance to the business goals"
            "\n- Keep the language clear, precise, and unambiguous"
            "\n- Format each requirement as:"
            "\n  [Category] The system shall... (description)"
            "\n  where Category is either 'Functional' or 'Non-Functional'"
            "\n- IMPORTANT: Every requirement MUST start with the category prefix '[Functional]' or '[Non-Functional]'"
            "\n\nReturn only the improved requirements list without explanations or comments."
        )
        
        # Format the business goals and requirements as strings
        formatted_goals = "\n".join([f"- {goal}" for goal in request.business_goals])
        formatted_requirements = "\n".join([f"- {req}" for req in request.user_requirements])
        
        # Create the user message
        user_message = (
            f"Project description: {request.project_description}\n"
            f"Business goals:\n{formatted_goals}\n"
            f"Original requirements:\n{formatted_requirements}"
        )
        
        # Generate the response
        messages = [{"role": "user", "content": user_message}]
        response = client.generate_response(messages, system_message)
        
        # Parse the response into an array of requirements
        enhanced_requirements = []
        for line in response.split("\n"):
            # Remove leading/trailing whitespace
            line = line.strip()
            # Check if line is not empty
            if line:
                # Check if the line starts with a category prefix
                if line.lower().startswith("[functional]") or line.lower().startswith("[non-functional]"):
                    enhanced_requirements.append(line)
                # Handle both bulleted and non-bulleted formats
                elif line.startswith("-") or line.startswith("•"):
                    # Remove the bullet point and any leading/trailing whitespace
                    req = line[1:].strip()
                    if req:  # Only add non-empty requirements
                        enhanced_requirements.append(req)
                # Also handle numbered lists (1., 2., etc.)
                elif line and line[0].isdigit() and line[1:].startswith(". "):
                    req = line[line.find(".")+1:].strip()
                    if req:  # Only add non-empty requirements
                        enhanced_requirements.append(req)
                # Handle non-bulleted requirements
                else:
                    enhanced_requirements.append(line)
        
        # If no requirements were extracted, try to split by newlines
        if not enhanced_requirements and response.strip():
            response_parts = response.split("\n\n")
            candidate_reqs = []
            for part in response_parts:
                candidate_reqs.extend(part.split("\n"))
            enhanced_requirements = [req.strip() for req in candidate_reqs if req.strip()]
            
            # If still no requirements, just use the entire response
            if not enhanced_requirements:
                enhanced_requirements = [response.strip()]
        
        # Return the enhanced requirements
        return RequirementsEnhanceResponse(enhanced_requirements=enhanced_requirements)
    except Exception as e:
        logger.error(f"Error enhancing requirements: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance requirements: {str(e)}"
        ) 