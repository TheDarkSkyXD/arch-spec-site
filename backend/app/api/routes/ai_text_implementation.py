"""
API routes for implementation prompts generation.
"""
import logging
import json
import re
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List, Optional

from app.ai.prompts.implementation_prompts import prepare_implementation_prompt
from app.schemas.ai_text import (
    ImplementationPromptGenerateRequest,
    ImplementationPromptResponse,
    ImplementationPromptsGenerateResponse,
)
from app.schemas.shared_schemas import ImplementationPromptType
from app.services.ai_service import FAST_MODEL, AnthropicClient
from app.services.project_specs_service import ProjectSpecsService
from app.core.firebase_auth import get_current_user
from app.db.base import db
from app.utils.llm_logging import DefaultLLMLogger
from app.utils.llm_logging import CustomEncoder
from app.services.db_usage_tracker import DatabaseUsageTracker

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

def convert_to_serializable(obj):
    """Convert objects to serializable format."""
    if isinstance(obj, dict):
        return {k: convert_to_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_serializable(item) for item in obj]
    elif hasattr(obj, "model_dump"):
        # For Pydantic models
        return obj.model_dump()
    elif hasattr(obj, "__dict__"):
        # For regular Python classes
        return obj.__dict__
    else:
        # Return as is for basic types
        return obj

def extract_project_specs(project_id: str, db):
    """Extract project specifications from the database."""
    return {}

def extract_prompts_from_response(response_text: str) -> Dict[str, str]:
    """
    Extract prompts from the LLM response using tags.
    
    Args:
        response_text: The raw LLM response text
        
    Returns:
        Dictionary mapping prompt types to extracted content
    """
    prompts = {}
    
    # Extract main prompt
    main_match = re.search(r'<MAIN>(.*?)</MAIN>', response_text, re.DOTALL)
    if main_match:
        prompts['main'] = main_match.group(1).strip()
    
    # Extract followup prompt 1
    followup1_match = re.search(r'<FOLLOWUP1>(.*?)</FOLLOWUP1>', response_text, re.DOTALL)
    if followup1_match:
        prompts['followup_1'] = followup1_match.group(1).strip()
    
    # Extract followup prompt 2
    followup2_match = re.search(r'<FOLLOWUP2>(.*?)</FOLLOWUP2>', response_text, re.DOTALL)
    if followup2_match:
        prompts['followup_2'] = followup2_match.group(1).strip()
    
    # If no tags found but there's content, assume it's a main prompt
    if not prompts and response_text.strip():
        prompts['main'] = response_text.strip()
    
    return prompts

@router.post("/generate-implementation-prompt", response_model=ImplementationPromptsGenerateResponse)
async def generate_implementation_prompt(
    request: ImplementationPromptGenerateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Generate implementation prompts for a specific category.
    
    This endpoint generates implementation prompts for a specific category of a project.
    It uses AI to generate prompts based on the project specifications.
    """
    try:
        # Create the service objects
        llm_logger = DefaultLLMLogger()
        usage_tracker = DatabaseUsageTracker(db.get_db())
        
        # Initialize the AI client with the logger and usage tracker
        client = AnthropicClient(llm_logger, usage_tracker)
        
        # Get the database
        database = db.get_db()
        if database is None:
            raise HTTPException(status_code=500, detail="Database connection not available")
            
        # Get project specifications
        tech_stack_spec = await ProjectSpecsService.get_tech_stack_spec(request.project_id, database)
        data_model_spec = await ProjectSpecsService.get_data_model_spec(request.project_id, database)
        api_spec = await ProjectSpecsService.get_api_spec(request.project_id, database)
        features_spec = await ProjectSpecsService.get_features_spec(request.project_id, database)
        requirements_spec = await ProjectSpecsService.get_requirements_spec(request.project_id, database)
        project = await database.projects.find_one({"id": request.project_id})
        
        # Extract relevant data from project specs
        project_description = project.get("description", "") if project else ""
        
        # Convert complex objects to serializable format
        serializable_tech_stack = convert_to_serializable(tech_stack_spec.data) if tech_stack_spec and tech_stack_spec.data else {}
        serializable_data_models = convert_to_serializable(data_model_spec.data) if data_model_spec and data_model_spec.data else {}
        serializable_api = convert_to_serializable(api_spec.data) if api_spec and api_spec.data else {}
        serializable_features = convert_to_serializable(features_spec.data) if features_spec and features_spec.data else {}
        
        # Now serialize to JSON
        tech_stack = json.dumps(serializable_tech_stack, cls=CustomEncoder) if serializable_tech_stack else ""
        data_models = json.dumps(serializable_data_models, cls=CustomEncoder) if serializable_data_models else ""
        api_endpoints = json.dumps(serializable_api, cls=CustomEncoder) if serializable_api else ""
        features = json.dumps(serializable_features, cls=CustomEncoder) if serializable_features else ""
        
        # Extract non-functional requirements from requirements spec
        nfr_spec = ""
        if requirements_spec and requirements_spec.non_functional:
            nfr_spec = "\n".join(requirements_spec.non_functional)
        
        # Extract security requirements (a subset of non-functional requirements)
        security_requirements = ""
        if requirements_spec and requirements_spec.non_functional:
            security_reqs = [req for req in requirements_spec.non_functional if "security" in req.lower() or "auth" in req.lower()]
            security_requirements = "\n".join(security_reqs)
        
        # Extract architecture-specific information
        architecture_spec = ""
        architecture_backend = ""
        architecture_frontend = ""
        architecture_data_layer = ""
        
        # Attempt to identify database technology from tech stack
        database_tech = ""
        if tech_stack_spec and tech_stack_spec.data:
            db_techs = []
            try:
                for category, techs in serializable_tech_stack.items():
                    if category.lower() in ["database", "data", "persistence", "storage"]:
                        if isinstance(techs, list):
                            db_techs.extend(techs)
                        else:
                            db_techs.append(str(techs))
                database_tech = ", ".join(db_techs)
            except Exception as e:
                logger.warning(f"Error extracting database tech: {str(e)}")
                # Continue anyway, this is not critical
        
        # Prepare the implementation prompt
        meta_prompt = prepare_implementation_prompt(
            category=request.category,
            project_description=project_description,
            architecture_spec=architecture_spec,
            tech_stack=tech_stack,
            data_models=data_models,
            api_endpoints=api_endpoints,
            features=features,
            security_requirements=security_requirements,
            architecture_backend=architecture_backend,
            architecture_frontend=architecture_frontend,
            architecture_data_layer=architecture_data_layer,
            nfr_spec=nfr_spec,
            nfr_data_related=nfr_spec,  # Use same NFRs for data-related
            database_tech=database_tech,
            additional_user_instruction=request.additional_user_instruction,
        )
        
        if not meta_prompt:
            raise HTTPException(status_code=400, detail=f"Invalid category: {request.category}")
        
        # Create a system message that instructs the model about the expected format
        system_message = """
        You are an expert AI systems architect and developer that specializes in generating implementation prompts.
        
        A user will provide you with specifications and you need to generate implementation prompts that will guide an AI assistant to implement the code.
        
        Generate three implementation prompts:
        1. A main prompt covering the core implementation steps
        2. A first follow-up prompt assuming the main prompt was partially implemented
        3. A second follow-up prompt for finishing the implementation
        
        Place the main prompt within the <MAIN></MAIN> tag.
        Place the first follow-up prompt within the <FOLLOWUP1></FOLLOWUP1> tag.
        Place the second follow-up prompt within the <FOLLOWUP2></FOLLOWUP2> tag.
        
        The implementation prompts should be clear, specific, and actionable.
        """
        
        # Generate the response with a single API call
        messages = [{"role": "user", "content": meta_prompt}]
        
        response = await client.generate_response(
            messages=messages,
            system=system_message,
            model=FAST_MODEL,
            log_metadata={
                "user_id": current_user.get("firebase_uid") if current_user else None,
                "project_id": request.project_id if hasattr(request, "project_id") else "unknown",
                "project_description": project_description,
                "category": request.category,
                "tech_stack": tech_stack,
                "data_models": data_models,
                "api_endpoints": api_endpoints,
                "features": features,
                "security_requirements": security_requirements,
                "architecture_spec": architecture_spec,
                "additional_user_instruction": request.additional_user_instruction
            },
            response_type="generate_implementation_prompt",
            check_credits=True
        )
        
        # Handle potential credit errors
        if response.startswith("Insufficient credits"):
            raise HTTPException(
                status_code=402,
                detail=response
            )
        
        # Parse the response to extract the different prompt types
        parsed_prompts = extract_prompts_from_response(response)
        
        # Convert the parsed prompts to the expected response format
        generated_prompts = []
        
        # Add the main prompt if it exists
        if 'main' in parsed_prompts:
            generated_prompts.append(ImplementationPromptResponse(
                type=ImplementationPromptType.MAIN,
                content=parsed_prompts['main']
            ))
        
        # Add the follow-up 1 prompt if it exists
        if 'followup_1' in parsed_prompts:
            generated_prompts.append(ImplementationPromptResponse(
                type=ImplementationPromptType.FOLLOWUP_1,
                content=parsed_prompts['followup_1']
            ))
        
        # Add the follow-up 2 prompt if it exists
        if 'followup_2' in parsed_prompts:
            generated_prompts.append(ImplementationPromptResponse(
                type=ImplementationPromptType.FOLLOWUP_2,
                content=parsed_prompts['followup_2']
            ))
        
        # If no prompts were extracted but there was a response, use the whole response as a main prompt
        if not generated_prompts and response.strip():
            generated_prompts.append(ImplementationPromptResponse(
                type=ImplementationPromptType.MAIN,
                content=response.strip()
            ))
        
        # Check if we need to filter results based on requested prompt type
        if request.prompt_type:
            generated_prompts = [p for p in generated_prompts if p.type == request.prompt_type]
        
        # Return the generated prompts
        return ImplementationPromptsGenerateResponse(prompts=generated_prompts)
    
    except Exception as e:
        logger.error(f"Error generating implementation prompts: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate implementation prompts: {str(e)}"
        ) 