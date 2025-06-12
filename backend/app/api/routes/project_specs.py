"""Project specs API routes.

This module provides API routes for managing project specs.
"""

from fastapi import APIRouter, HTTPException, Depends, Path, Body
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Dict, Any, Type
import logging

from ...schemas.templates import UIDesign

from ...db.base import db
from ...schemas.project_specs import (
    TimelineSpec,
    BudgetSpec,
    RequirementsSpec,
    MetadataSpec,
    TimelineSpecUpdate,
    BudgetSpecUpdate,
    RequirementsSpecUpdate,
    MetadataSpecUpdate,
    TechStackSpec,
    FeaturesSpec,
    PagesSpec,
    UIDesignSpec,
    DataModelSpec,
    ApiSpec,
    TestingSpec,
    TestCasesSpec,
    ProjectStructureSpec,
    DeploymentSpec,
    DocumentationSpec,
    TechStackSpecUpdate,
    FeaturesSpecUpdate,
    PagesSpecUpdate,
    UIDesignSpecUpdate,
    DataModelSpecUpdate,
    ApiSpecUpdate,
    TestingSpecUpdate,
    TestCasesSpecUpdate,
    ProjectStructureSpecUpdate,
    DeploymentSpecUpdate,
    DocumentationSpecUpdate,
    ImplementationPromptsSpec,
    ImplementationPromptsSpecUpdate,
)
from ...services.project_specs_service import ProjectSpecsService
from ...schemas.shared_schemas import Features
from ...core.firebase_auth import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


def get_db():
    """Get database instance."""
    return db.get_db()


# Debug endpoint to help diagnose issues
@router.get("/debug/{project_id}")
async def debug_project_lookup(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
):
    """Debug endpoint to check project existence."""
    # Try different lookup methods
    project1 = await database.projects.find_one({"id": project_id})
    project2 = await database.projects.find_one({"_id": project_id})

    return {
        "project_id": project_id,
        "lookup_by_id": {
            "exists": project1 is not None,
            "fields": list(project1.keys()) if project1 else None,
        },
        "lookup_by__id": {
            "exists": project2 is not None,
            "fields": list(project2.keys()) if project2 else None,
        },
        "collection_names": await database.list_collection_names(),
    }


async def validate_project_exists_and_owned(
    project_id: str, database: AsyncIOMotorDatabase, current_user: Dict[str, Any]
):
    """
    Validate that a project exists and is owned by the user.

    Args:
        project_id: The project ID
        database: The database instance
        current_user: The authenticated user

    Returns:
        The project if it exists and is owned by the user

    Raises:
        HTTPException: If the project doesn't exist or isn't owned by the user
    """
    user_id = str(current_user["_id"])
    logger.debug(f"Validating project {project_id} for user {user_id}")
    project = await database.projects.find_one({"id": project_id, "user_id": user_id})
    logger.debug(f"Project lookup result: {project is not None}")
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# Timeline spec routes
@router.get("/{project_id}/timeline", response_model=TimelineSpec)
async def get_timeline_spec(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get the timeline spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    spec = await ProjectSpecsService.get_timeline_spec(project_id, database)
    if spec is None:
        # Return an empty spec structure instead of 404
        spec = TimelineSpec(project_id=project_id, items={})

    return spec


@router.put("/{project_id}/timeline", response_model=TimelineSpec)
async def update_timeline_spec(
    update_data: TimelineSpecUpdate = Body(..., description="The timeline spec update data"),
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Update the timeline spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    user_id = str(current_user["_id"])
    spec = await ProjectSpecsService.create_or_update_timeline_spec(
        project_id, update_data, user_id, database
    )

    return spec


# Budget spec routes
@router.get("/{project_id}/budget", response_model=BudgetSpec)
async def get_budget_spec(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get the budget spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    spec = await ProjectSpecsService.get_budget_spec(project_id, database)
    if spec is None:
        # Return an empty spec structure instead of 404
        spec = BudgetSpec(project_id=project_id, items={})

    return spec


@router.put("/{project_id}/budget", response_model=BudgetSpec)
async def update_budget_spec(
    update_data: BudgetSpecUpdate = Body(..., description="The budget spec update data"),
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Update the budget spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    user_id = str(current_user["_id"])
    spec = await ProjectSpecsService.create_or_update_budget_spec(
        project_id, update_data, user_id, database
    )

    return spec


# Requirements spec routes
@router.get("/{project_id}/requirements", response_model=RequirementsSpec)
async def get_requirements_spec(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get the requirements spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    spec = await ProjectSpecsService.get_requirements_spec(project_id, database)
    if spec is None:
        # Return an empty spec structure instead of 404
        spec = RequirementsSpec(project_id=project_id, functional=[], non_functional=[])

    return spec


@router.put("/{project_id}/requirements", response_model=RequirementsSpec)
async def update_requirements_spec(
    update_data: RequirementsSpecUpdate = Body(
        ..., description="The requirements spec update data"
    ),
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Update the requirements spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    user_id = str(current_user["_id"])
    spec = await ProjectSpecsService.create_or_update_requirements_spec(
        project_id, update_data, user_id, database
    )

    return spec


# Metadata spec routes
@router.get("/{project_id}/metadata", response_model=MetadataSpec)
async def get_metadata_spec(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get the metadata spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    spec = await ProjectSpecsService.get_metadata_spec(project_id, database)
    if spec is None:
        # Return an empty spec structure instead of 404
        spec = MetadataSpec(project_id=project_id, data={})

    return spec


@router.put("/{project_id}/metadata", response_model=MetadataSpec)
async def update_metadata_spec(
    update_data: MetadataSpecUpdate = Body(..., description="The metadata spec update data"),
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Update the metadata spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    user_id = str(current_user["_id"])
    spec = await ProjectSpecsService.create_or_update_metadata_spec(
        project_id, update_data, user_id, database
    )

    return spec


# Architecture specs routes


# Tech stack specs
@router.get("/{project_id}/tech-stack", response_model=TechStackSpec)
async def get_tech_stack_spec(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get the tech stack spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    spec = await ProjectSpecsService.get_tech_stack_spec(project_id, database)
    if spec is None:
        # Return an empty spec structure instead of 404
        spec = TechStackSpec(project_id=project_id, data=None)

    return spec


@router.put("/{project_id}/tech-stack", response_model=TechStackSpec)
async def update_tech_stack_spec(
    update_data: TechStackSpecUpdate = Body(..., description="The tech stack spec update data"),
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Update the tech stack spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    user_id = str(current_user["_id"])
    spec = await ProjectSpecsService.create_or_update_tech_stack_spec(
        project_id, update_data, user_id, database
    )

    return spec


# Features spec
@router.get("/{project_id}/features", response_model=FeaturesSpec)
async def get_features_spec(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get the features spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    spec = await ProjectSpecsService.get_features_spec(project_id, database)
    if spec is None:
        # Return an empty spec structure instead of 404
        empty_data = Features(core_modules=[], optional_modules=[])
        spec = FeaturesSpec(project_id=project_id, data=empty_data)

    return spec


@router.put("/{project_id}/features", response_model=FeaturesSpec)
async def update_features_spec(
    update_data: FeaturesSpecUpdate = Body(..., description="The features spec update data"),
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Update the features spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    user_id = str(current_user["_id"])
    spec = await ProjectSpecsService.create_or_update_features_spec(
        project_id, update_data, user_id, database
    )

    return spec


# Helper function to add spec routes with less repetition
def add_spec_routes(
    spec_name: str,
    route_path: str,
    spec_class: Type,
    update_class: Type,
    get_method,
    update_method,
    description: str,
):
    """Add routes for a project spec."""

    @router.get(f"/{{project_id}}/{route_path}", response_model=spec_class)
    async def get_spec(
        project_id: str = Path(..., description="The project ID"),
        database: AsyncIOMotorDatabase = Depends(get_db),
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        f"""Get the {description} spec for a project."""
        await validate_project_exists_and_owned(project_id, database, current_user)

        spec = await get_method(project_id, database)
        if spec is None:
            # For UI design specs, return a default spec
            if spec_class.__name__ == "UIDesignSpec":
                spec = spec_class(project_id=project_id, data=UIDesign())
            # For other specs, return an empty structure
            spec = spec_class(project_id=project_id, data={})

        return spec

    @router.put(f"/{{project_id}}/{route_path}", response_model=spec_class)
    async def update_spec(
        update_data: update_class = Body(..., description=f"The {description} spec update data"),
        project_id: str = Path(..., description="The project ID"),
        database: AsyncIOMotorDatabase = Depends(get_db),
        current_user: Dict[str, Any] = Depends(get_current_user),
    ):
        f"""Update the {description} spec for a project."""
        await validate_project_exists_and_owned(project_id, database, current_user)

        user_id = str(current_user["_id"])
        spec = await update_method(project_id, update_data, user_id, database)

        return spec

    # Set function names for better API docs
    get_spec.__name__ = f"get_{spec_name}_spec"
    update_spec.__name__ = f"update_{spec_name}_spec"


# Add routes for the remaining architecture specs
add_spec_routes(
    "pages",
    "pages",
    PagesSpec,
    PagesSpecUpdate,
    ProjectSpecsService.get_pages_spec,
    ProjectSpecsService.create_or_update_pages_spec,
    "pages",
)

add_spec_routes(
    "ui_design",
    "ui-design",
    UIDesignSpec,
    UIDesignSpecUpdate,
    ProjectSpecsService.get_ui_design_spec,
    ProjectSpecsService.create_or_update_ui_design_spec,
    "UI design",
)

add_spec_routes(
    "data_model",
    "data-model",
    DataModelSpec,
    DataModelSpecUpdate,
    ProjectSpecsService.get_data_model_spec,
    ProjectSpecsService.create_or_update_data_model_spec,
    "data model",
)

add_spec_routes(
    "api",
    "api",
    ApiSpec,
    ApiSpecUpdate,
    ProjectSpecsService.get_api_spec,
    ProjectSpecsService.create_or_update_api_spec,
    "API",
)

add_spec_routes(
    "testing",
    "testing",
    TestingSpec,
    TestingSpecUpdate,
    ProjectSpecsService.get_testing_spec,
    ProjectSpecsService.create_or_update_testing_spec,
    "testing",
)

add_spec_routes(
    "project_structure",
    "project-structure",
    ProjectStructureSpec,
    ProjectStructureSpecUpdate,
    ProjectSpecsService.get_project_structure_spec,
    ProjectSpecsService.create_or_update_project_structure_spec,
    "project structure",
)

add_spec_routes(
    "deployment",
    "deployment",
    DeploymentSpec,
    DeploymentSpecUpdate,
    ProjectSpecsService.get_deployment_spec,
    ProjectSpecsService.create_or_update_deployment_spec,
    "deployment",
)

add_spec_routes(
    "documentation",
    "documentation",
    DocumentationSpec,
    DocumentationSpecUpdate,
    ProjectSpecsService.get_documentation_spec,
    ProjectSpecsService.create_or_update_documentation_spec,
    "documentation",
)

# Add routes for the test cases spec
add_spec_routes(
    "test_cases",
    "test-cases",
    TestCasesSpec,
    TestCasesSpecUpdate,
    ProjectSpecsService.get_test_cases_spec,
    ProjectSpecsService.create_or_update_test_cases_spec,
    "test cases",
)


# Implementation Prompts routes
@router.get("/{project_id}/implementation-prompts", response_model=ImplementationPromptsSpec)
async def get_implementation_prompts_spec(
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get the implementation prompts spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    spec = await ProjectSpecsService.get_implementation_prompts_spec(project_id, database)
    if spec is None:
        # Return an empty spec structure instead of 404
        spec = ImplementationPromptsSpec(project_id=project_id, data={})

    return spec


@router.put("/{project_id}/implementation-prompts", response_model=ImplementationPromptsSpec)
async def update_implementation_prompts_spec(
    update_data: ImplementationPromptsSpecUpdate = Body(
        ..., description="The implementation prompts spec update data"
    ),
    project_id: str = Path(..., description="The project ID"),
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Update the implementation prompts spec for a project."""
    await validate_project_exists_and_owned(project_id, database, current_user)

    user_id = str(current_user["_id"])
    spec = await ProjectSpecsService.create_or_update_implementation_prompts_spec(
        project_id, update_data, user_id, database
    )

    return spec
