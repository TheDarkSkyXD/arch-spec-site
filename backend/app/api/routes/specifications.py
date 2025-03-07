"""Specifications API routes.

This module provides API routes for managing specifications.
"""

from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Dict, Any
import uuid
from datetime import datetime
import logging

from ...db.base import db
from ...schemas.specification import Specification, SpecificationCreate, SpecificationUpdate
from ...schemas.artifact import Artifact
from ...services.generator_service import GeneratorService

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize services with error handling
generator_service = GeneratorService()

# Initialize AI service with careful error handling
try:
    from ...services.ai_service import AnthropicClient
    ai_service = AnthropicClient()
    logger.info("AnthropicClient initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize AnthropicClient: {str(e)}")
    # Create a dummy AI service for development
    from ...services.llm_adapter import LLMAdapter
    
    class DummyAIService(LLMAdapter):
        def generate_response(self, messages, system=None):
            return "AI service unavailable in development mode"
            
        def stream_response(self, messages, system=None):
            yield "AI service unavailable in development mode"
            
        async def process_specification(self, spec_data):
            logger.warning("Using dummy AI service - no AI processing applied")
            return spec_data
    
    ai_service = DummyAIService()
    logger.info("Using DummyAIService as fallback")


def get_db():
    """Get database instance."""
    return db.get_db()


@router.get("/projects/{project_id}/specification", response_model=Specification)
async def get_specification(project_id: str, database: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a project's specification.
    
    Args:
        project_id: The project ID.
        database: The database instance.
        
    Returns:
        The project's specification.
        
    Raises:
        HTTPException: If the specification is not found.
    """
    specification = await database.specifications.find_one({"project_id": project_id})
    if specification is None:
        raise HTTPException(status_code=404, detail="Specification not found")
    return specification


@router.post("/projects/{project_id}/specification", response_model=Specification)
async def create_or_update_specification(
    project_id: str,
    specification_data: SpecificationCreate,
    database: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create or update a project's specification.
    
    Args:
        project_id: The project ID.
        specification_data: The specification data.
        database: The database instance.
        
    Returns:
        The created or updated specification.
        
    Raises:
        HTTPException: If the project is not found.
    """
    # Check if project exists
    project = await database.projects.find_one({"id": project_id})
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if specification already exists
    existing_spec = await database.specifications.find_one({"project_id": project_id})
    
    if existing_spec:
        # Update existing specification
        spec_dict = specification_data.model_dump()
        spec_dict["updated_at"] = datetime.utcnow()
        
        await database.specifications.update_one(
            {"id": existing_spec["id"]},
            {"$set": spec_dict}
        )
        
        updated_spec = await database.specifications.find_one({"id": existing_spec["id"]})
        return updated_spec
    else:
        # Create new specification
        spec_dict = specification_data.model_dump()
        spec_dict.update({
            "id": str(uuid.uuid4()),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
        
        await database.specifications.insert_one(spec_dict)
        
        # Update project status
        await database.projects.update_one(
            {"id": project_id},
            {"$set": {"status": "in_progress", "updated_at": datetime.utcnow()}}
        )
        
        return spec_dict


@router.post("/projects/{project_id}/specification/generate", response_model=List[Artifact])
async def generate_artifacts(project_id: str, database: AsyncIOMotorDatabase = Depends(get_db)):
    """Generate artifacts from a project's specification.
    
    Args:
        project_id: The project ID.
        database: The database instance.
        
    Returns:
        The generated artifacts.
        
    Raises:
        HTTPException: If the specification is not found.
    """
    # Get specification
    specification = await database.specifications.find_one({"project_id": project_id})
    if specification is None:
        raise HTTPException(status_code=404, detail="Specification not found")
    
    # Process specification with AI
    enhanced_spec = await ai_service.process_specification(specification)
    
    # Update specification with AI enhancements
    await database.specifications.update_one(
        {"id": specification["id"]},
        {"$set": {
            "architecture": enhanced_spec.get("architecture", specification.get("architecture", {})),
            "api_endpoints": enhanced_spec.get("api_endpoints", specification.get("api_endpoints", [])),
            "data_model": enhanced_spec.get("data_model", specification.get("data_model", {})),
            "implementation": enhanced_spec.get("implementation", specification.get("implementation", {})),
            "updated_at": datetime.utcnow()
        }}
    )
    
    # Get updated specification
    updated_spec = await database.specifications.find_one({"id": specification["id"]})
    
    # Generate artifacts
    artifacts = await generator_service.generate_artifacts(updated_spec)
    
    # Save artifacts to database
    for artifact in artifacts:
        await database.artifacts.insert_one(artifact)
    
    # Update project status
    await database.projects.update_one(
        {"id": project_id},
        {"$set": {"status": "completed", "updated_at": datetime.utcnow()}}
    )
    
    # Retrieve all artifacts for this specification
    saved_artifacts = await database.artifacts.find({"specification_id": updated_spec["id"]}).to_list(length=100)
    
    return saved_artifacts 