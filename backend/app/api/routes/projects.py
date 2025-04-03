"""Projects API routes.

This module provides API routes for managing projects.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Dict, Any, List
import uuid
from datetime import datetime, timezone

from ...db.base import db
from ...core.firebase_auth import get_current_user
from ...schemas.project import (
    ProjectBase,
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectListResponse,
)

router = APIRouter()


def get_db():
    """Get database instance."""
    return db.get_db()


@router.post("", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Create a new project.

    Args:
        project: The project data.
        database: The database instance.
        current_user: The authenticated user.

    Returns:
        The created project.
    """
    project_dict = project.model_dump()

    # Set the user ID
    user_id = str(current_user["_id"])
    project_dict["user_id"] = user_id

    # Create a basic project
    now = datetime.now(timezone.utc)
    project_dict.update(
        {
            "id": str(uuid.uuid4()),
            "created_at": now,
            "updated_at": now,
        }
    )

    # Insert the core project
    await database.projects.insert_one(project_dict)

    # Return the created project
    # Remove the MongoDB _id field which is not JSON serializable
    if "_id" in project_dict:
        del project_dict["_id"]

    return project_dict


@router.put("/{id}", response_model=ProjectResponse)
async def update_project(
    id: str,
    project: ProjectUpdate,
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Update an existing project.

    Args:
        id: The project ID.
        project: The updated project data.
        database: The database instance.
        current_user: The authenticated user.

    Returns:
        The updated project.

    Raises:
        HTTPException: If the project is not found or doesn't belong to the user.
    """
    user_id = str(current_user["_id"])

    # Check if project exists and belongs to the user
    existing_project = await database.projects.find_one({"id": id, "user_id": user_id})
    if existing_project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    # Get the project data
    project_dict = project.model_dump(exclude_unset=True)

    # Maintain user_id and creation timestamp
    project_dict["user_id"] = user_id
    project_dict["updated_at"] = datetime.now(timezone.utc)

    # Update the project
    await database.projects.update_one({"id": id, "user_id": user_id}, {"$set": project_dict})

    # Get the updated project
    updated_project = await database.projects.find_one({"id": id, "user_id": user_id})

    # Remove the MongoDB _id field which is not JSON serializable
    if "_id" in updated_project:
        del updated_project["_id"]

    return updated_project


@router.get("", response_model=List[ProjectResponse])
async def get_projects(
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
):
    """Get all projects for the current user.

    Args:
        database: The database instance.
        current_user: The authenticated user.
        skip: Number of projects to skip.
        limit: Maximum number of projects to return.

    Returns:
        List of projects.
    """
    user_id = str(current_user["_id"])

    # Get all projects for the user
    cursor = database.projects.find({"user_id": user_id}).skip(skip).limit(limit)
    projects = await cursor.to_list(length=limit)

    # Remove MongoDB _id field from each project
    for project in projects:
        if "_id" in project:
            del project["_id"]

    return projects


@router.get("/{id}", response_model=ProjectResponse)
async def get_project_detail(
    id: str,
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get a project by ID with all details.

    Args:
        id: The project ID.
        database: The database instance.
        current_user: The authenticated user.

    Returns:
        The project details.

    Raises:
        HTTPException: If the project is not found or doesn't belong to the user.
    """
    user_id = str(current_user["_id"])
    project = await database.projects.find_one({"id": id, "user_id": user_id})
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    # Remove the MongoDB _id field which is not JSON serializable
    if "_id" in project:
        del project["_id"]

    return project


@router.delete("/{id}", status_code=204)
async def delete_project(
    id: str,
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Delete a project by ID and all its associated specs.

    Args:
        id: The project ID.
        database: The database instance.
        current_user: The authenticated user.

    Raises:
        HTTPException: If the project is not found or doesn't belong to the user.
    """
    user_id = str(current_user["_id"])

    # Check if project exists and belongs to the user
    existing_project = await database.projects.find_one({"id": id, "user_id": user_id})
    if existing_project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    # Define collections that store project specs
    spec_collections = [
        "timeline_specs",
        "budget_specs",
        "requirements_specs",
        "metadata_specs",
        "tech_stack_specs",
        "features_specs",
        "ui_design_specs",
        "pages_specs",
        "data_model_specs",
        "api_specs",
        "testing_specs",
        "test_cases_specs",
        "project_structure_specs",
        "deployment_specs",
        "documentation_specs" "implementation_prompts_specs",
    ]

    # Delete all specs associated with the project
    for collection_name in spec_collections:
        if hasattr(database, collection_name):
            collection = getattr(database, collection_name)
            await collection.delete_many({"project_id": id})

    # Delete the project itself
    await database.projects.delete_one({"id": id, "user_id": user_id})

    # No content to return
    return None
