"""API routes for managing artifacts.

This module provides API routes for managing artifacts, including generating
and retrieving artifacts for projects.
"""

from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Depends, Response
from motor.motor_asyncio import AsyncIOMotorDatabase

from ...services.artifact_service import ArtifactService
from ...schemas.artifact_schema import Artifact
from ...dependencies.services import get_artifact_service
from ...db.base import db
from ...core.firebase_auth import get_current_user

router = APIRouter(prefix="/artifacts", tags=["artifacts"])


def get_db():
    """Get database instance."""
    return db.get_db()


@router.post("/projects/{project_id}/generate", response_model=List[Dict[str, Any]])
async def generate_artifacts_for_project(
    project_id: str,
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
    artifact_service: ArtifactService = Depends(get_artifact_service)
):
    """Generate artifacts for a project based on its specfications.
    
    Args:
        project_id: The ID of the project to generate artifacts for.
        database: The database instance.
        current_user: The authenticated user.
        
    Returns:
        A list of generated artifacts.
    """
    # Check if project belongs to user
    user_id = str(current_user["_id"])
    project = await database.projects.find_one({"id": project_id, "user_id": user_id})
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Fetch the project specfications
    try:
        # Get all relevant specfications for the project
        tech_stack_spec = await database.tech_stack_specs.find_one({"project_id": project_id})
        requirements_spec = await database.requirements_specs.find_one({"project_id": project_id})
        data_model_spec = await database.data_model_specs.find_one({"project_id": project_id})
        api_spec = await database.api_specs.find_one({"project_id": project_id})
        documentation_spec = await database.documentation_specs.find_one({"project_id": project_id})
        features_spec = await database.features_specs.find_one({"project_id": project_id})
        testing_spec = await database.testing_specs.find_one({"project_id": project_id})
        project_structure_spec = await database.project_structure_specs.find_one({"project_id": project_id})
        
        # Generate artifacts using all the project specs
        artifacts = await artifact_service.generator_service.generate_artifacts_from_project_specs(
            project_id=project_id,
            project=project,
            tech_stack_spec=tech_stack_spec,
            requirements_spec=requirements_spec,
            data_model_spec=data_model_spec,
            api_spec=api_spec,
            documentation_spec=documentation_spec,
            features_spec=features_spec,
            testing_spec=testing_spec,
            project_structure_spec=project_structure_spec
        )
        
        # Store the artifacts
        for artifact in artifacts:
            # Skip MongoDB _id field if present
            if "_id" in artifact:
                del artifact["_id"]
            await database.artifacts.insert_one(artifact)
        
        return artifacts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate artifacts: {str(e)}")


@router.get("/projects/{project_id}")
async def get_artifacts_by_project(
    project_id: str,
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get all artifacts for a project.
    
    Args:
        project_id: The project ID.
        database: The database instance.
        current_user: The authenticated user.
        
    Returns:
        A list of artifacts for the project.
    """
    # Check if project belongs to user
    user_id = str(current_user["_id"])
    project = await database.projects.find_one({"id": project_id, "user_id": user_id})
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        # Find all artifacts for this project
        cursor = database.artifacts.find({"project_id": project_id})
        artifacts = await cursor.to_list(length=100)
        
        # Remove MongoDB _id field
        for artifact in artifacts:
            if "_id" in artifact:
                del artifact["_id"]
        
        return artifacts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get artifacts: {str(e)}")


@router.get("/item/{artifact_id}")
async def get_artifact(
    artifact_id: str,
    artifact_service: ArtifactService = Depends(get_artifact_service)
):
    """Get an artifact by ID.
    
    Args:
        artifact_id: The ID of the artifact to get.
        
    Returns:
        The artifact content with appropriate content type.
    """
    try:
        content, content_type = await artifact_service.get_artifact(artifact_id)
        return Response(content=content, media_type=content_type)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get artifact: {str(e)}")


@router.post("/generate")
async def generate_artifact(
    request: Dict[str, Any],
    artifact_service: ArtifactService = Depends(get_artifact_service)
):
    """Generate a specific artifact.
    
    Args:
        request: The request body containing:
            - project_id: The ID of the project.
            - spec: The spec of the project.
            - type: The type of artifact to generate.
            - name: The name of the artifact.
            - options: Optional generation options.
        
    Returns:
        The generated artifact.
    """
    try:
        artifact = await artifact_service.generate_artifact(
            project_id=request.get("project_id"),
            spec=request.get("spec"),
            artifact_type=request.get("type"),
            name=request.get("name"),
            options=request.get("options")
        )
        return artifact
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate artifact: {str(e)}")


@router.delete("/{artifact_id}")
async def delete_artifact(
    artifact_id: str,
    artifact_service: ArtifactService = Depends(get_artifact_service)
):
    """Delete an artifact.
    
    Args:
        artifact_id: The ID of the artifact to delete.
        
    Returns:
        A success message.
    """
    try:
        await artifact_service.delete_artifact(artifact_id)
        return {"message": f"Artifact {artifact_id} deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete artifact: {str(e)}") 