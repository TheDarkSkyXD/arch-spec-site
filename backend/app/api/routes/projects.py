"""Projects API routes.

This module provides API routes for managing projects.
"""

from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Dict, Any
import uuid
from datetime import datetime

from ...db.base import db
from ...core.firebase_auth import get_current_user
from ...schemas.project import ProjectBase
router = APIRouter()


def get_db():
    """Get database instance."""
    return db.get_db()


@router.post("")
async def create_project(
    project: ProjectBase, 
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
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
    project_dict.update({
        "id": str(uuid.uuid4()),
        "created_at": datetime.now(datetime.UTC),
        "updated_at": datetime.now(datetime.UTC),
    })
    
    # Insert the core project
    await database.projects.insert_one(project_dict)
    
    # Get the project ID for section creation
    project_id = project_dict["id"]
    
    # Format the response with sections included
    project_response = await get_project_detail(project_id, database)
    return project_response


@router.get("/{id}")
async def get_project_detail(
    id: str, 
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
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
    