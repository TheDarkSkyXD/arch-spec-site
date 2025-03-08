"""Projects API routes.

This module provides API routes for managing projects.
"""

from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import uuid
from datetime import datetime

from ...db.base import db
from ...schemas.project import Project, ProjectCreate, ProjectUpdate, ProjectResponse, ProjectDetailResponse, ProjectInDB
from ...schemas.templates import ProjectTemplate

router = APIRouter()


def get_db():
    """Get database instance."""
    return db.get_db()


@router.get("", response_model=List[ProjectResponse])
async def get_projects(database: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all projects.
    
    Args:
        database: The database instance.
        
    Returns:
        A list of all projects.
    """
    projects = await database.projects.find().to_list(length=100)
    return projects


@router.post("", response_model=ProjectDetailResponse)
async def create_project(project: ProjectCreate, database: AsyncIOMotorDatabase = Depends(get_db)):
    """Create a new project.
    
    Args:
        project: The project data.
        database: The database instance.
        
    Returns:
        The created project.
    """
    project_dict = project.model_dump()
    
    # If template_id is provided, fetch the template and use it
    template = None
    if project.template_id:
        template_doc = await database.templates.find_one({"id": project.template_id})
        if template_doc:
            template = ProjectTemplate(**template_doc["template"])
    elif project.template_data:
        template = project.template_data
    
    # Create project from template if available
    if template:
        project_obj = ProjectInDB.from_template(template, project)
        project_dict = project_obj.model_dump()
    else:
        # No template, create a basic project
        project_dict.update({
            "id": str(uuid.uuid4()),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "status": "draft",
            "metadata": {},
            "team_members": [],
            "version": 1,
            "revision_history": []
        })
    
    await database.projects.insert_one(project_dict)
    
    return project_dict


@router.get("/{id}", response_model=ProjectDetailResponse)
async def get_project(id: str, database: AsyncIOMotorDatabase = Depends(get_db)):
    """Get a project by ID.
    
    Args:
        id: The project ID.
        database: The database instance.
        
    Returns:
        The project with the specified ID.
        
    Raises:
        HTTPException: If the project is not found.
    """
    project = await database.projects.find_one({"id": id})
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{id}", response_model=ProjectDetailResponse)
async def update_project(id: str, project_update: ProjectUpdate, database: AsyncIOMotorDatabase = Depends(get_db)):
    """Update a project.
    
    Args:
        id: The project ID.
        project_update: The project update data.
        database: The database instance.
        
    Returns:
        The updated project.
        
    Raises:
        HTTPException: If the project is not found.
    """
    project = await database.projects.find_one({"id": id})
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_update.model_dump(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        
        # If updating version-tracked fields, add to revision history
        if any(key in update_data for key in ["functional_requirements", "non_functional_requirements", "template_data"]):
            # Increment version
            update_data["version"] = project.get("version", 1) + 1
            
            # Add revision record
            revision = {
                "version": update_data["version"],
                "timestamp": update_data["updated_at"],
                "changes": list(update_data.keys())
            }
            
            # Add to revision history
            result = await database.projects.update_one(
                {"id": id},
                {"$set": update_data, "$push": {"revision_history": revision}}
            )
        else:
            # Regular update without version tracking
            result = await database.projects.update_one(
                {"id": id},
                {"$set": update_data}
            )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Project update failed")
    
    return await database.projects.find_one({"id": id})


@router.delete("/{id}")
async def delete_project(id: str, database: AsyncIOMotorDatabase = Depends(get_db)):
    """Delete a project.
    
    Args:
        id: The project ID.
        database: The database instance.
        
    Returns:
        A success message.
        
    Raises:
        HTTPException: If the project is not found or the deletion fails.
    """
    project = await database.projects.find_one({"id": id})
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    result = await database.projects.delete_one({"id": id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=400, detail="Project deletion failed")
    
    # Also delete related specification and artifacts
    await database.specifications.delete_many({"project_id": id})
    
    return {"message": "Project deleted successfully"} 