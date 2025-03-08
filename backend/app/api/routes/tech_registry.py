"""
API routes for technology registry data.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Dict, List, Optional, Any

from app.seed.tech_registry import (
    TECH_REGISTRY,
    is_valid_tech,
    get_category_for_tech,
    get_technologies_in_category
)
from app.utils.tech_validation import (
    validate_project_tech_stack,
    get_tech_suggestions
)
from app.db.base import db
from app.seed.tech_registry_db import get_registry_from_db
from app.core.firebase_auth import get_current_user

router = APIRouter(
    prefix="/tech-registry",
    tags=["tech-registry"],
    responses={404: {"description": "Not found"}},
)


def get_db():
    """Get database instance."""
    return db.get_db()


@router.get("/")
async def get_tech_registry(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get the full technology registry.
    Tries to get it from the database first, falls back to in-memory data.
    """
    database = get_db()
    if database is not None:
        # Try to get from database first
        registry = await get_registry_from_db(database)
        if registry:
            return {"data": registry, "source": "database"}
    
    # Fallback to in-memory data
    return {"data": TECH_REGISTRY, "source": "memory"}


@router.get("/memory")
async def get_tech_registry_from_memory(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get the technology registry directly from memory (not database).
    """
    return {"data": TECH_REGISTRY}


@router.get("/db")
async def get_tech_registry_from_db_endpoint(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get the technology registry from the database.
    """
    database = get_db()
    if database is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    registry = await get_registry_from_db(database)
    
    if not registry:
        raise HTTPException(status_code=404, detail="Tech registry not found in database")
    
    return {"data": registry}


@router.get("/validate-tech")
async def validate_technology(
    tech_name: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Validate if a technology name exists in the registry.
    Checks both database and in-memory data.
    
    Args:
        tech_name: Name of the technology to validate
        current_user: The authenticated user
    """
    # Try to validate against database first
    database = get_db()
    if database is not None:
        registry = await get_registry_from_db(database)
        if registry and "all_technologies" in registry:
            valid_in_db = tech_name in registry["all_technologies"]
            if valid_in_db:
                # Find category info
                for cat in registry["categories"]:
                    for subcat in cat["subcategories"]:
                        if tech_name in subcat["technologies"]:
                            return {
                                "valid": True,
                                "category_info": {
                                    "category": cat["name"],
                                    "subcategory": subcat["name"]
                                },
                                "source": "database"
                            }
    
    # Fallback to in-memory validation
    valid = is_valid_tech(tech_name)
    category_info = get_category_for_tech(tech_name) if valid else None
    
    return {
        "valid": valid,
        "category_info": category_info,
        "source": "memory"
    }


@router.post("/validate-tech-stack")
async def validate_tech_stack(
    tech_stack: Dict[str, Any],
    template_tech_stack: Optional[Dict[str, Any]] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Validate a project's tech stack against the registry and optional template.
    Uses in-memory validation functions as they already handle all the logic.
    
    Args:
        tech_stack: The tech stack to validate
        template_tech_stack: Optional template tech stack to check compatibility with
        current_user: The authenticated user
    """
    validation_result = validate_project_tech_stack(tech_stack, template_tech_stack)
    return validation_result


@router.post("/get-suggestions")
async def tech_suggestions(
    partial_tech_stack: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get technology suggestions based on a partial tech stack.
    Uses in-memory suggestion function as it already handles all the logic.
    
    Args:
        partial_tech_stack: The partially completed tech stack
        current_user: The authenticated user
    """
    suggestions = get_tech_suggestions(partial_tech_stack)
    return {"suggestions": suggestions} 