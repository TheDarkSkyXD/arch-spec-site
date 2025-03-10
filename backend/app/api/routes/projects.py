"""Projects API routes.

This module provides API routes for managing projects.
"""

from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Dict, Any
import uuid
from datetime import datetime

from ...db.base import db
from ...schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectDetailResponse, ProjectInDB
from ...schemas.templates import ProjectTemplate
from ...services.project_sections_service import ProjectSectionsService
from ...core.firebase_auth import get_current_user

router = APIRouter()


def get_db():
    """Get database instance."""
    return db.get_db()


@router.get("", response_model=List[ProjectResponse])
async def get_projects(
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get all projects for the current user.
    
    Args:
        database: The database instance.
        current_user: The authenticated user.
        
    Returns:
        A list of projects belonging to the current user.
    """
    user_id = str(current_user["_id"])
    projects = await database.projects.find({"user_id": user_id}).to_list(length=100)
    return projects


@router.post("", response_model=ProjectDetailResponse)
async def create_project(
    project: ProjectCreate, 
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
        "status": "draft",
        "team_members": [],
        "version": 1,
        "revision_history": [],
        "has_timeline": False,
        "has_budget": False,
        "has_requirements": False,
        "has_metadata": False,
        "has_tech_stack": False,
        "has_features": False,
        "has_pages": False,
        "has_data_model": False,
        "has_api": False,
        "has_testing": False,
        "has_project_structure": False,
        "has_deployment": False,
        "has_documentation": False
    })
    
    # Extract section data before inserting the core project
    # Basic sections
    timeline_data = project_dict.pop("timeline", None)
    budget_data = project_dict.pop("budget", None)
    functional_requirements = project_dict.pop("functional_requirements", [])
    non_functional_requirements = project_dict.pop("non_functional_requirements", [])
    metadata = project_dict.pop("metadata", {})
    
    # Insert the core project
    await database.projects.insert_one(project_dict)
    
    # Get the project ID for section creation
    project_id = project_dict["id"]
    
    # Handle basic sections if provided
    if timeline_data:
        await ProjectSectionsService.create_or_update_timeline_section(
            project_id, timeline_data, None, database
        )
        # Update the flag
        project_dict["has_timeline"] = True
    
    if budget_data:
        await ProjectSectionsService.create_or_update_budget_section(
            project_id, budget_data, None, database
        )
        # Update the flag
        project_dict["has_budget"] = True
    
    if functional_requirements or non_functional_requirements:
        from ...schemas.project_sections import RequirementsSectionUpdate
        
        requirements_update = RequirementsSectionUpdate(
            functional=functional_requirements,
            non_functional=non_functional_requirements
        )
        
        await ProjectSectionsService.create_or_update_requirements_section(
            project_id, requirements_update, None, database
        )
        # Update the flag
        project_dict["has_requirements"] = True
    
    if metadata:
        await ProjectSectionsService.create_or_update_metadata_section(
            project_id, metadata, None, database
        )
        # Update the flag
        project_dict["has_metadata"] = True
    
    # Update flags if needed
    flags_to_update = {
        "has_timeline": project_dict.get("has_timeline", False),
        "has_budget": project_dict.get("has_budget", False),
        "has_requirements": project_dict.get("has_requirements", False),
        "has_metadata": project_dict.get("has_metadata", False),
        "has_tech_stack": project_dict.get("has_tech_stack", False),
        "has_features": project_dict.get("has_features", False),
        "has_pages": project_dict.get("has_pages", False),
        "has_data_model": project_dict.get("has_data_model", False),
        "has_api": project_dict.get("has_api", False),
        "has_testing": project_dict.get("has_testing", False),
        "has_project_structure": project_dict.get("has_project_structure", False),
        "has_deployment": project_dict.get("has_deployment", False),
        "has_documentation": project_dict.get("has_documentation", False)
    }
    
    await database.projects.update_one(
        {"id": project_id},
        {"$set": flags_to_update}
    )
    
    # Format the response with sections included
    project_response = await get_project_detail(project_id, database)
    return project_response


@router.get("/{id}", response_model=ProjectDetailResponse)
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
    
    # Populate sections from their respective collections if they exist
    project_response = ProjectDetailResponse(**project)
    
    # Load basic sections if they exist
    if project.get("has_timeline", False):
        timeline_section = await ProjectSectionsService.get_timeline_section(id, database)
        if timeline_section:
            project_response.timeline = timeline_section.items
    
    if project.get("has_budget", False):
        budget_section = await ProjectSectionsService.get_budget_section(id, database)
        if budget_section:
            project_response.budget = budget_section.items
    
    if project.get("has_requirements", False):
        requirements_section = await ProjectSectionsService.get_requirements_section(id, database)
        if requirements_section:
            project_response.functional_requirements = requirements_section.functional
            project_response.non_functional_requirements = requirements_section.non_functional
    
    if project.get("has_metadata", False):
        metadata_section = await ProjectSectionsService.get_metadata_section(id, database)
        if metadata_section:
            project_response.metadata = metadata_section.data
    
    # Load architecture sections if they exist
    if project.get("has_tech_stack", False):
        tech_stack_section = await ProjectSectionsService.get_tech_stack_section(id, database)
        if tech_stack_section:
            project_response.tech_stack = tech_stack_section.data
    
    if project.get("has_features", False):
        features_section = await ProjectSectionsService.get_features_section(id, database)
        if features_section:
            project_response.features = features_section.data
    
    if project.get("has_pages", False):
        pages_section = await ProjectSectionsService.get_pages_section(id, database)
        if pages_section:
            project_response.pages = pages_section.data
    
    if project.get("has_data_model", False):
        data_model_section = await ProjectSectionsService.get_data_model_section(id, database)
        if data_model_section:
            project_response.data_model = data_model_section.data
    
    if project.get("has_api", False):
        api_section = await ProjectSectionsService.get_api_section(id, database)
        if api_section:
            project_response.api = api_section.data
    
    if project.get("has_testing", False):
        testing_section = await ProjectSectionsService.get_testing_section(id, database)
        if testing_section:
            project_response.testing = testing_section.data
    
    if project.get("has_project_structure", False):
        project_structure_section = await ProjectSectionsService.get_project_structure_section(id, database)
        if project_structure_section:
            project_response.project_structure = project_structure_section.data
    
    if project.get("has_deployment", False):
        deployment_section = await ProjectSectionsService.get_deployment_section(id, database)
        if deployment_section:
            project_response.deployment = deployment_section.data
    
    if project.get("has_documentation", False):
        documentation_section = await ProjectSectionsService.get_documentation_section(id, database)
        if documentation_section:
            project_response.documentation = documentation_section.data
    
    return project_response


@router.put("/{id}", response_model=ProjectDetailResponse)
async def update_project(
    id: str, 
    project_update: ProjectUpdate, 
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update a project.
    
    Args:
        id: The project ID.
        project_update: The project update data.
        database: The database instance.
        current_user: The authenticated user.
        
    Returns:
        The updated project.
        
    Raises:
        HTTPException: If the project is not found or doesn't belong to the user.
    """
    user_id = str(current_user["_id"])
    
    # Check if project exists and belongs to user
    existing_project = await database.projects.find_one({"id": id, "user_id": user_id})
    if existing_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Extract section updates (for backward compatibility)
    timeline_update = project_update.timeline
    budget_update = project_update.budget
    functional_requirements_update = project_update.functional_requirements
    non_functional_requirements_update = project_update.non_functional_requirements
    metadata_update = project_update.metadata
    
    # Remove section data from the update
    update_data = project_update.model_dump(exclude_unset=True)
    update_data.pop("timeline", None)
    update_data.pop("budget", None)
    update_data.pop("functional_requirements", None)
    update_data.pop("non_functional_requirements", None)
    update_data.pop("metadata", None)
    
    # Update core project if needed
    if update_data:
        update_data["updated_at"] = datetime.now(datetime.UTC)
        
        # Update version if needed
        if "template_data" in update_data:
            # Increment version
            update_data["version"] = existing_project.get("version", 1) + 1
            
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
        
        if result.modified_count == 0 and len(update_data) > 0:
            raise HTTPException(status_code=400, detail="Project update failed")
    
    # Handle section updates
    from ...services.project_sections_service import ProjectSectionsService
    
    # Update timeline section if provided
    if timeline_update is not None:
        await ProjectSectionsService.create_or_update_timeline_section(
            id, timeline_update, None, database
        )
        
        # Update the flag if needed
        if not existing_project.get("has_timeline", False):
            await database.projects.update_one(
                {"id": id},
                {"$set": {"has_timeline": True, "updated_at": datetime.now(datetime.UTC)}}
            )
    
    # Update budget section if provided
    if budget_update is not None:
        await ProjectSectionsService.create_or_update_budget_section(
            id, budget_update, None, database
        )
        
        # Update the flag if needed
        if not existing_project.get("has_budget", False):
            await database.projects.update_one(
                {"id": id},
                {"$set": {"has_budget": True, "updated_at": datetime.now(datetime.UTC)}}
            )
    
    # Update requirements section if provided
    if functional_requirements_update is not None or non_functional_requirements_update is not None:
        from ...schemas.project_sections import RequirementsSectionUpdate
        
        # Get current values for any field not being updated
        requirements_section = None
        if existing_project.get("has_requirements", False):
            requirements_section = await database.requirements_sections.find_one({"project_id": id})
        
        # Default to empty lists if not found or missing keys
        current_functional = []
        current_non_functional = []
        if requirements_section:
            current_functional = requirements_section.get("functional", [])
            current_non_functional = requirements_section.get("non_functional", [])
        
        # Create update with any provided values or fall back to current values
        requirements_update = RequirementsSectionUpdate(
            functional=functional_requirements_update if functional_requirements_update is not None else current_functional,
            non_functional=non_functional_requirements_update if non_functional_requirements_update is not None else current_non_functional
        )
        
        await ProjectSectionsService.create_or_update_requirements_section(
            id, requirements_update, None, database
        )
        
        # Update the flag if needed
        if not existing_project.get("has_requirements", False):
            await database.projects.update_one(
                {"id": id},
                {"$set": {"has_requirements": True, "updated_at": datetime.now(datetime.UTC)}}
            )
    
    # Update metadata section if provided
    if metadata_update is not None:
        await ProjectSectionsService.create_or_update_metadata_section(
            id, metadata_update, None, database
        )
        
        # Update the flag if needed
        if not existing_project.get("has_metadata", False):
            await database.projects.update_one(
                {"id": id},
                {"$set": {"has_metadata": True, "updated_at": datetime.now(datetime.UTC)}}
            )
    
    # Return the updated project with all sections
    return await get_project_detail(id, database)


@router.delete("/{id}")
async def delete_project(
    id: str, 
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Delete a project.
    
    Args:
        id: The project ID.
        database: The database instance.
        current_user: The authenticated user.
        
    Returns:
        A success message.
        
    Raises:
        HTTPException: If the project is not found or doesn't belong to the user.
    """
    user_id = str(current_user["_id"])
    
    # Check if project exists and belongs to user
    project = await database.projects.find_one({"id": id, "user_id": user_id})
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Delete the project
    await database.projects.delete_one({"id": id, "user_id": user_id})
    
    # Delete all related sections
    if project.get("has_timeline", False):
        await database.timeline_sections.delete_one({"project_id": id})
    
    if project.get("has_budget", False):
        await database.budget_sections.delete_one({"project_id": id})
    
    if project.get("has_requirements", False):
        await database.requirements_sections.delete_one({"project_id": id})
    
    if project.get("has_metadata", False):
        await database.metadata_sections.delete_one({"project_id": id})
    
    if project.get("has_tech_stack", False):
        await database.tech_stack_sections.delete_one({"project_id": id})
    
    if project.get("has_features", False):
        await database.features_sections.delete_one({"project_id": id})
    
    if project.get("has_pages", False):
        await database.pages_sections.delete_one({"project_id": id})
    
    if project.get("has_data_model", False):
        await database.data_model_sections.delete_one({"project_id": id})
    
    if project.get("has_api", False):
        await database.api_sections.delete_one({"project_id": id})
    
    if project.get("has_testing", False):
        await database.testing_sections.delete_one({"project_id": id})
    
    if project.get("has_project_structure", False):
        await database.project_structure_sections.delete_one({"project_id": id})
    
    if project.get("has_deployment", False):
        await database.deployment_sections.delete_one({"project_id": id})
    
    if project.get("has_documentation", False):
        await database.documentation_sections.delete_one({"project_id": id})
    
    return {"message": "Project deleted successfully"} 