"""
API routes for implementation prompts generation.
"""
import logging
import json
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

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

# Custom encoder to handle non-serializable objects
class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        # Handle any objects that need custom serialization
        if hasattr(obj, "model_dump"):
            # For Pydantic models
            return obj.model_dump()
        elif hasattr(obj, "__dict__"):
            # For regular Python classes
            return obj.__dict__
        # Let the base class handle the rest or fail
        return super().default(obj)

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
        # Initialize the AI client
        client = AnthropicClient()
        
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
        )
        
        if not meta_prompt:
            raise HTTPException(status_code=400, detail=f"Invalid category: {request.category}")
        
        # Define the prompt types to generate
        prompt_types = [request.prompt_type] if request.prompt_type else [
            ImplementationPromptType.MAIN,
            ImplementationPromptType.FOLLOWUP_1,
            ImplementationPromptType.FOLLOWUP_2
        ]
        
        # Generate prompts for each type
        generated_prompts = []
        for prompt_type in prompt_types:
            # Create a system message that instructs which type of prompt to generate
            system_message = f"""
            You are an expert AI systems architect and developer that specializes in generating implementation prompts.
            
            A user will provide you with specifications and you need to generate an implementation prompt that will guide an AI assistant to implement the code.
            
            You are generating a {prompt_type.value} implementation prompt for the category {request.category}.
            
            If this is a MAIN prompt, focus on the core implementation steps.
            If this is a FOLLOWUP_1 prompt, assume the main prompt was partially implemented and focus on continuing the implementation.
            If this is a FOLLOWUP_2 prompt, assume both main and followup_1 prompts were executed, and focus on finalizing the implementation.
            
            The implementation prompt should be clear, specific, and actionable.
            """
            
            # Generate the response
            messages = [{"role": "user", "content": meta_prompt}]
            
            response = client.generate_response(
                messages=messages,
                system=system_message,
                model=FAST_MODEL
            )
            
            # Add the generated prompt to the list
            generated_prompts.append(ImplementationPromptResponse(
                type=prompt_type,
                content=response.strip()
            ))
        
        # Return the generated prompts
        return ImplementationPromptsGenerateResponse(prompts=generated_prompts)
    
    except Exception as e:
        logger.error(f"Error generating implementation prompts: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate implementation prompts: {str(e)}"
        ) 