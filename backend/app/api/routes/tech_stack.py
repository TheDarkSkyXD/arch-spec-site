"""
API routes for tech stack compatibility.
"""
import logging
from fastapi import APIRouter, HTTPException, Query

from ...schemas.tech_stack import (
    TechStackSelection, 
    CompatibilityResult, 
    CompatibleOptionsResponse,
    AllTechOptionsResponse
)
from ...services.tech_stack_service import TechStackService

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/compatibility/check", response_model=CompatibilityResult)
async def check_compatibility(selection: TechStackSelection):
    """
    Check compatibility between selected technology choices.
    
    Returns which technologies are compatible with the current selections.
    """
    try:
        result = await TechStackService.check_compatibility(selection)
        return result
    except Exception as e:
        logger.error(f"Error checking compatibility: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error checking compatibility: {str(e)}")


@router.get("/compatibility/options", response_model=CompatibleOptionsResponse)
async def get_compatible_options(
    category: str = Query(..., description="Technology category (e.g. 'frontend', 'backend')"),
    technology: str = Query(..., description="Technology name to get compatible options for")
):
    """
    Get compatible options for a given technology.
    
    Returns a list of technologies that are compatible with the specified technology.
    """
    try:
        result = await TechStackService.get_compatible_options(category, technology)
        return result
    except Exception as e:
        logger.error(f"Error getting compatible options: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting compatible options: {str(e)}")


@router.get("/options", response_model=AllTechOptionsResponse)
async def get_all_technology_options():
    """
    Get all available technology options from all categories.
    
    Returns a comprehensive list of all technologies grouped by category.
    """
    try:
        result = await TechStackService.get_all_technology_options()
        return result
    except Exception as e:
        logger.error(f"Error getting all technology options: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting all technology options: {str(e)}") 