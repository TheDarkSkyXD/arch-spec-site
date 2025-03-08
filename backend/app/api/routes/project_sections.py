"""Project sections API routes.

This module provides API routes for managing project sections.
"""

from fastapi import APIRouter, HTTPException, Depends, Path, Body
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Dict, Any, Optional, Type

from ...db.base import db
from ...schemas.project_sections import (
    TimelineSection,
    BudgetSection,
    RequirementsSection,
    MetadataSection,
    TimelineSectionUpdate,
    BudgetSectionUpdate,
    RequirementsSectionUpdate,
    MetadataSectionUpdate,
    TechStackSection,
    FeaturesSection,
    PagesSection,
    DataModelSection,
    ApiSection,
    TestingSection,
    ProjectStructureSection,
    DeploymentSection,
    DocumentationSection,
    TechStackSectionUpdate,
    FeaturesSectionUpdate,
    PagesSectionUpdate,
    DataModelSectionUpdate,
    ApiSectionUpdate,
    TestingSectionUpdate,
    ProjectStructureSectionUpdate,
    DeploymentSectionUpdate,
    DocumentationSectionUpdate
)
from ...services.project_sections_service import ProjectSectionsService
from ...schemas.shared_schemas import (
    TechStackData, Features, Pages, DataModel, Api,
    Testing, ProjectStructure, Deployment, Documentation
)

router = APIRouter()


def get_db():
    """Get database instance."""
    return db.get_db()


async def validate_project_exists(project_id: str, database: AsyncIOMotorDatabase):
    """Validate that a project exists."""
    project = await database.projects.find_one({"id": project_id})
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# Timeline section routes
@router.get("/projects/{project_id}/timeline", response_model=TimelineSection)
async def get_timeline_section(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get the timeline section for a project."""
    await validate_project_exists(project_id, database)
    
    section = await ProjectSectionsService.get_timeline_section(project_id, database)
    if section is None:
        # Return an empty section structure instead of 404
        section = TimelineSection(project_id=project_id, items={})
    
    return section


@router.put("/projects/{project_id}/timeline", response_model=TimelineSection)
async def update_timeline_section(
    update_data: TimelineSectionUpdate = Body(..., description="The timeline section update data"),
    project_id: str = Path(..., description="The project ID"),
    user_id: Optional[str] = None,  # Would come from auth middleware in a real app
    database: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update the timeline section for a project."""
    await validate_project_exists(project_id, database)
    
    section = await ProjectSectionsService.create_or_update_timeline_section(
        project_id, update_data, user_id, database
    )
    
    return section


# Budget section routes
@router.get("/projects/{project_id}/budget", response_model=BudgetSection)
async def get_budget_section(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get the budget section for a project."""
    await validate_project_exists(project_id, database)
    
    section = await ProjectSectionsService.get_budget_section(project_id, database)
    if section is None:
        # Return an empty section structure instead of 404
        section = BudgetSection(project_id=project_id, items={})
    
    return section


@router.put("/projects/{project_id}/budget", response_model=BudgetSection)
async def update_budget_section(
    update_data: BudgetSectionUpdate = Body(..., description="The budget section update data"),
    project_id: str = Path(..., description="The project ID"),
    user_id: Optional[str] = None,  # Would come from auth middleware in a real app
    database: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update the budget section for a project."""
    await validate_project_exists(project_id, database)
    
    section = await ProjectSectionsService.create_or_update_budget_section(
        project_id, update_data, user_id, database
    )
    
    return section


# Requirements section routes
@router.get("/projects/{project_id}/requirements", response_model=RequirementsSection)
async def get_requirements_section(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get the requirements section for a project."""
    await validate_project_exists(project_id, database)
    
    section = await ProjectSectionsService.get_requirements_section(project_id, database)
    if section is None:
        # Return an empty section structure instead of 404
        section = RequirementsSection(project_id=project_id, functional=[], non_functional=[])
    
    return section


@router.put("/projects/{project_id}/requirements", response_model=RequirementsSection)
async def update_requirements_section(
    update_data: RequirementsSectionUpdate = Body(..., description="The requirements section update data"),
    project_id: str = Path(..., description="The project ID"),
    user_id: Optional[str] = None,  # Would come from auth middleware in a real app
    database: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update the requirements section for a project."""
    await validate_project_exists(project_id, database)
    
    section = await ProjectSectionsService.create_or_update_requirements_section(
        project_id, update_data, user_id, database
    )
    
    return section


# Metadata section routes
@router.get("/projects/{project_id}/metadata", response_model=MetadataSection)
async def get_metadata_section(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get the metadata section for a project."""
    await validate_project_exists(project_id, database)
    
    section = await ProjectSectionsService.get_metadata_section(project_id, database)
    if section is None:
        # Return an empty section structure instead of 404
        section = MetadataSection(project_id=project_id, data={})
    
    return section


@router.put("/projects/{project_id}/metadata", response_model=MetadataSection)
async def update_metadata_section(
    update_data: MetadataSectionUpdate = Body(..., description="The metadata section update data"),
    project_id: str = Path(..., description="The project ID"),
    user_id: Optional[str] = None,  # Would come from auth middleware in a real app
    database: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update the metadata section for a project."""
    await validate_project_exists(project_id, database)
    
    section = await ProjectSectionsService.create_or_update_metadata_section(
        project_id, update_data, user_id, database
    )
    
    return section


# Architecture sections routes

# Tech stack section
@router.get("/projects/{project_id}/tech-stack", response_model=TechStackSection)
async def get_tech_stack_section(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get the tech stack section for a project."""
    await validate_project_exists(project_id, database)
    
    section = await ProjectSectionsService.get_tech_stack_section(project_id, database)
    if section is None:
        # Return an empty section structure instead of 404
        section = TechStackSection(project_id=project_id, data={})
    
    return section


@router.put("/projects/{project_id}/tech-stack", response_model=TechStackSection)
async def update_tech_stack_section(
    update_data: TechStackSectionUpdate = Body(..., description="The tech stack section update data"),
    project_id: str = Path(..., description="The project ID"),
    user_id: Optional[str] = None,  # Would come from auth middleware in a real app
    database: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update the tech stack section for a project."""
    await validate_project_exists(project_id, database)
    
    section = await ProjectSectionsService.create_or_update_tech_stack_section(
        project_id, update_data, user_id, database
    )
    
    return section


# Features section
@router.get("/projects/{project_id}/features", response_model=FeaturesSection)
async def get_features_section(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get the features section for a project."""
    await validate_project_exists(project_id, database)
    
    section = await ProjectSectionsService.get_features_section(project_id, database)
    if section is None:
        # Return an empty section structure instead of 404
        section = FeaturesSection(project_id=project_id, data={})
    
    return section


@router.put("/projects/{project_id}/features", response_model=FeaturesSection)
async def update_features_section(
    update_data: FeaturesSectionUpdate = Body(..., description="The features section update data"),
    project_id: str = Path(..., description="The project ID"),
    user_id: Optional[str] = None,  # Would come from auth middleware in a real app
    database: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update the features section for a project."""
    await validate_project_exists(project_id, database)
    
    section = await ProjectSectionsService.create_or_update_features_section(
        project_id, update_data, user_id, database
    )
    
    return section


# Define a generic route builder function for the remaining sections
def add_section_routes(
    section_name: str, 
    route_path: str,
    section_class: Type,
    update_class: Type,
    get_method,
    update_method,
    description: str
):
    """Add GET and PUT routes for a section."""
    
    @router.get(f"/projects/{{project_id}}/{route_path}", response_model=section_class)
    async def get_section(
        project_id: str = Path(..., description="The project ID"),
        database: AsyncIOMotorDatabase = Depends(get_db)
    ):
        """Get the section for a project."""
        await validate_project_exists(project_id, database)
        
        section = await get_method(project_id, database)
        if section is None:
            # Return an empty section structure instead of 404
            section = section_class(project_id=project_id, data={})
        
        return section
    
    @router.put(f"/projects/{{project_id}}/{route_path}", response_model=section_class)
    async def update_section(
        update_data: update_class = Body(..., description=f"The {description} section update data"),
        project_id: str = Path(..., description="The project ID"),
        user_id: Optional[str] = None,  # Would come from auth middleware in a real app
        database: AsyncIOMotorDatabase = Depends(get_db)
    ):
        """Update the section for a project."""
        await validate_project_exists(project_id, database)
        
        section = await update_method(
            project_id, update_data, user_id, database
        )
        
        return section
    
    # Rename the functions to avoid name conflicts
    get_section.__name__ = f"get_{section_name}_section"
    update_section.__name__ = f"update_{section_name}_section"
    
    return get_section, update_section


# Add routes for the remaining architecture sections
add_section_routes(
    "pages", "pages", PagesSection, PagesSectionUpdate,
    ProjectSectionsService.get_pages_section,
    ProjectSectionsService.create_or_update_pages_section,
    "pages"
)

add_section_routes(
    "data_model", "data-model", DataModelSection, DataModelSectionUpdate,
    ProjectSectionsService.get_data_model_section,
    ProjectSectionsService.create_or_update_data_model_section,
    "data model"
)

add_section_routes(
    "api", "api", ApiSection, ApiSectionUpdate,
    ProjectSectionsService.get_api_section,
    ProjectSectionsService.create_or_update_api_section,
    "API"
)

add_section_routes(
    "testing", "testing", TestingSection, TestingSectionUpdate,
    ProjectSectionsService.get_testing_section,
    ProjectSectionsService.create_or_update_testing_section,
    "testing"
)

add_section_routes(
    "project_structure", "project-structure", ProjectStructureSection, ProjectStructureSectionUpdate,
    ProjectSectionsService.get_project_structure_section,
    ProjectSectionsService.create_or_update_project_structure_section,
    "project structure"
)

add_section_routes(
    "deployment", "deployment", DeploymentSection, DeploymentSectionUpdate,
    ProjectSectionsService.get_deployment_section,
    ProjectSectionsService.create_or_update_deployment_section,
    "deployment"
)

add_section_routes(
    "documentation", "documentation", DocumentationSection, DocumentationSectionUpdate,
    ProjectSectionsService.get_documentation_section,
    ProjectSectionsService.create_or_update_documentation_section,
    "documentation"
) 