"""
API routes for AI text generation.
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List, Optional, Type, TypeVar, Generic, Union
import json
import re

from app.ai.tools.print_features import print_features_input_schema
from app.ai.tools.print_pages import print_pages_input_schema
from app.ai.tools.print_data_model import print_data_model_input_schema
from app.ai.tools.print_api_endpoints import print_api_endpoints_input_schema
from app.ai.tools.print_tech_stack import print_tech_stack_input_schema
from app.ai.tools.print_test_cases import print_test_cases_input_schema
from app.ai.prompts.project_description import project_description_system_prompt
from app.ai.prompts.business_goals import business_goals_system_prompt_create, business_goals_system_prompt_enhance
from app.ai.prompts.target_users import target_users_system_prompt_create, target_users_system_prompt_enhance
from app.ai.prompts.requirements import requirements_system_prompt_enhance
from app.ai.prompts.features import get_features_user_prompt
from app.ai.prompts.pages import get_pages_user_prompt
from app.ai.prompts.data_model import get_data_model_user_prompt
from app.ai.prompts.api_endpoints import get_api_endpoints_user_prompt
from app.ai.prompts.tech_stack import get_tech_stack_user_prompt
from app.ai.prompts.test_cases import get_test_cases_user_prompt

from ...schemas.ai_text import (
    DescriptionEnhanceRequest, 
    DescriptionEnhanceResponse,
    BusinessGoalsEnhanceRequest,
    BusinessGoalsEnhanceResponse,
    TargetUsersEnhanceRequest,
    TargetUsersEnhanceResponse,
    RequirementsEnhanceRequest,
    RequirementsEnhanceResponse,
    FeaturesEnhanceRequest,
    FeaturesEnhanceResponse,
    FeaturesData,
    PagesEnhanceRequest,
    PagesEnhanceResponse,
    PagesData,
    DataModelEnhanceRequest,
    DataModelEnhanceResponse,
    DataModel,
    ApiEndpointsEnhanceRequest,
    ApiEndpointsEnhanceResponse,
    ApiData,
    TechStackEnhanceRequest,
    TechStackEnhanceResponse,
    TechStackRecommendation,
    TestCasesEnhanceRequest,
    TestCasesEnhanceResponse,
    TestCasesData
)
from ...services.ai_service import AnthropicClient
from ...core.firebase_auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()

# Type variable for generic response types
T = TypeVar('T')

def extract_data_from_response(response: Dict[str, Any], schema_class: Type[T], logger: logging.Logger) -> T:
    """
    Extract data from an AI response with multiple fallback mechanisms.
    
    Args:
        response: The response from the AI service
        schema_class: The Pydantic schema class to convert the data to
        logger: Logger instance for logging errors
    
    Returns:
        An instance of the schema_class with the extracted data
        
    Raises:
        HTTPException: If data cannot be extracted after all fallback attempts
    """
    
    logger.info(f"Response: {response}")
    
    # Attempt 1: Standard extraction from "data" field
    if "data" in response:
        try:
            return schema_class(**response["data"])
        except Exception as e:
            logger.warning(f"Failed to parse standard 'data' field: {str(e)}")
    
    # Attempt 2: Check if the entire response is the data structure
    if isinstance(response, dict) and not any(k in response for k in ["data", "error"]):
        try:
            return schema_class(**response)
        except Exception as e:
            logger.warning(f"Failed to parse entire response as data: {str(e)}")
    
    # Attempt 3: Check if there's a JSON string in the response
    if "content" in response and isinstance(response["content"], str):
        try:
            # Look for JSON objects in the content
            content = response["content"]
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                json_data = json.loads(json_str)
                return schema_class(**json_data)
        except Exception as e:
            logger.warning(f"Failed to extract JSON from content: {str(e)}")
    
    # Attempt 4: Check if response contains raw text that could be parsed as JSON
    if isinstance(response, str):
        try:
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                json_data = json.loads(json_str)
                return schema_class(**json_data)
        except Exception as e:
            logger.warning(f"Failed to extract JSON from string response: {str(e)}")
    
    # Attempt 5: For TestCasesData, provide empty default structure if response is empty
    if schema_class.__name__ == "TestCasesData" and (
        isinstance(response, dict) and len(response) == 0 or 
        isinstance(response, dict) and "data" in response and len(response["data"]) == 0
    ):
        logger.warning("Empty response detected for TestCasesData. Creating default empty structure.")
        try:
            return schema_class(testCases=[])
        except Exception as e:
            logger.warning(f"Failed to create default TestCasesData structure: {str(e)}")
    
    # If we've reached this point, log details about the response for debugging
    logger.error(f"Failed to extract data after all fallback attempts. Response structure: {type(response)}")
    if isinstance(response, dict):
        logger.error(f"Response keys: {list(response.keys())}")
    
    # All attempts failed, raise exception
    raise HTTPException(
        status_code=500,
        detail="Failed to extract valid data from AI response after multiple attempts"
    )

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
        response = client.generate_response(messages, system_prompt)
        
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
            system_message = business_goals_system_prompt_enhance()
        else:
            system_message = business_goals_system_prompt_create()
        
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
            system_message = target_users_system_prompt_enhance()
        else:
            system_message = target_users_system_prompt_create()
        
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
        system_message = requirements_system_prompt_enhance()
        
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
        # Initialize the AI client
        client = AnthropicClient()
        
        # Create the system message
        system_message = (
            "You are a product manager refining or generating features for a software project. "
            "Based on the project description, business goals, and requirements, create a comprehensive feature list."
        )
        
        # Create the user message
        # Format the business goals and requirements as strings
        formatted_goals = "\n".join([f"- {goal}" for goal in request.business_goals])
        formatted_requirements = "\n".join([f"- {req}" for req in request.requirements])
        
        # Format the original features if provided
        formatted_features = "None provided"
        if request.user_features and len(request.user_features) > 0:
            formatted_features = json.dumps(request.user_features, indent=2)
        
        user_prompt = get_features_user_prompt(request.project_description, formatted_goals, formatted_requirements, formatted_features)
        
        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        response = client.get_tool_use_response(system_message, [print_features_input_schema()], messages)
        
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
        # Initialize the AI client
        client = AnthropicClient()
        
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
        user_prompt = get_pages_user_prompt(request.project_description, formatted_features, formatted_requirements, formatted_existing_pages)
        
        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        response = client.get_tool_use_response(system_message, [print_pages_input_schema()], messages)
        
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
        # Initialize the AI client
        client = AnthropicClient()
        
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
        
        user_prompt = get_data_model_user_prompt(request.project_description, formatted_features, formatted_requirements, formatted_data_model)

        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        response = client.get_tool_use_response(system_message, [print_data_model_input_schema()], messages)
        
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

@router.post("/enhance-api-endpoints", response_model=ApiEndpointsEnhanceResponse)
async def enhance_api_endpoints(
    request: ApiEndpointsEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance API endpoints using AI with function calling.
    
    This endpoint takes a project description, features, data models, requirements, and optionally
    existing API endpoints, and returns an improved, structured API endpoints specification.
    It uses Anthropic's tool use feature to ensure a structured response.
    """
    try:
        # Initialize the AI client
        client = AnthropicClient()
        
        # Create the system message
        system_message = (
            "You are an API designer creating RESTful endpoints for a software project. "
            "Design a comprehensive API based on the project specifications."
        )
        
        # Format the features, data models, and requirements as strings
        formatted_features = json.dumps(request.features, indent=2)
        formatted_data_models = json.dumps(request.data_models, indent=2)
        formatted_requirements = "\n".join([f"- {req}" for req in request.requirements])
        
        # Create the user message
        user_prompt = get_api_endpoints_user_prompt(
            request.project_description, 
            formatted_features, 
            formatted_data_models, 
            formatted_requirements
        )

        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        response = client.get_tool_use_response(system_message, [print_api_endpoints_input_schema()], messages)
        
        if "error" in response:
            logger.error(f"Error in AI tool use: {response['error']}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate API endpoints: {response['error']}"
            )
            
        # Extract API endpoints data with fallback mechanisms
        api_endpoints_data = extract_data_from_response(response, ApiData, logger)
            
        # Return the enhanced API endpoints
        return ApiEndpointsEnhanceResponse(data=api_endpoints_data)
    except Exception as e:
        logger.error(f"Error enhancing API endpoints: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to enhance API endpoints: {str(e)}"
        )

@router.post("/enhance-tech-stack", response_model=TechStackEnhanceResponse)
async def enhance_tech_stack(
    request: TechStackEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance technology stack recommendations.
    """
    try:
        client = AnthropicClient()
        
        # Format the input
        user_prompt = get_tech_stack_user_prompt(
            request.project_description, 
            request.project_requirements,
            request.user_preferences
        )
        
        messages = [{"role": "user", "content": user_prompt}]
        
        # Call the AI service
        response = client.get_tool_use_response(
            system_prompt="You are an expert software architect specializing in tech stack selection.",
            tools=[print_tech_stack_input_schema()],
            messages=messages
        )
        
        # Extract the response data
        tech_stack_data = extract_data_from_response(response, TechStackRecommendation, logger)
        
        return {"data": tech_stack_data}
    except Exception as e:
        logger.error(f"Error enhancing tech stack: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error enhancing tech stack: {str(e)}")


@router.post("/enhance-test-cases", response_model=TestCasesEnhanceResponse)
async def enhance_test_cases(
    request: TestCasesEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance or generate test cases in Gherkin format.
    """
    try:
        client = AnthropicClient()
        
        # Format requirements as string
        formatted_requirements = "\n".join(f"- {req}" for req in request.requirements)
        
        # Format features as JSON string
        formatted_features = json.dumps(request.features, indent=2)
        
        # Format existing test cases if any
        formatted_test_cases = None
        if request.existing_test_cases:
            formatted_test_cases = json.dumps(request.existing_test_cases, indent=2)
        
        # Create the user prompt
        user_prompt = get_test_cases_user_prompt(
            formatted_requirements,
            formatted_features,
            formatted_test_cases
        )

        messages = [{"role": "user", "content": user_prompt}]
        
        # Call the AI service
        response = client.get_tool_use_response(
            system_prompt="You are an expert QA engineer specializing in writing Gherkin test cases for software applications.",
            tools=[print_test_cases_input_schema()],
            messages=messages
        )
        
        # Extract the response data
        test_cases_data = extract_data_from_response(response, TestCasesData, logger)
        
        return {"data": test_cases_data}
    except Exception as e:
        logger.error(f"Error enhancing test cases: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error enhancing test cases: {str(e)}")


# Add a dedicated endpoint for generating test cases from scratch
@router.post("/generate-test-cases", response_model=TestCasesEnhanceResponse)
async def generate_test_cases(
    request: TestCasesEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Generate new test cases in Gherkin format based on project requirements and features.
    This is a dedicated endpoint for creating test cases from scratch.
    """
    try:
        client = AnthropicClient()
        
        # Format requirements as string
        formatted_requirements = "\n".join(f"- {req}" for req in request.requirements)
        
        # Format features as JSON string
        formatted_features = json.dumps(request.features, indent=2)
        
        # Create the user prompt - we don't pass existing test cases
        user_prompt = get_test_cases_user_prompt(
            formatted_requirements,
            formatted_features,
            None  # No existing test cases for generation from scratch
        )
        
        messages = [{"role": "user", "content": user_prompt}]
        
        # Call the AI service
        response = client.get_tool_use_response(
            system_prompt="You are an expert QA engineer specializing in writing comprehensive Gherkin test cases for software applications. Focus on creating test cases that cover all functional requirements and important edge cases.",
            tools=[print_test_cases_input_schema()],
            messages=messages
        )
        
        # Extract the response data
        test_cases_data = extract_data_from_response(response, TestCasesData, logger)
        
        return {"data": test_cases_data}
    except Exception as e:
        logger.error(f"Error generating test cases: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating test cases: {str(e)}") 