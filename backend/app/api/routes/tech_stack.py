"""
API routes for tech stack compatibility.
"""
import logging
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List, Any

from ...schemas.tech_stack import (
    TechStackSelection, 
    CompatibilityResult, 
    CompatibleOptionsRequest,
    CompatibleOptionsResponse,
    AllTechOptionsResponse
)
from ...services.tech_stack_service import TechStackService

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/compatibility/check", response_model=CompatibilityResult)
async def check_compatibility(selection: TechStackSelection):
    """
    Check compatibility between selected technologies.
    """
    try:
        result = await TechStackService.check_compatibility(selection)
        return result
    except Exception as e:
        logger.error(f"Error checking tech stack compatibility: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error checking compatibility: {str(e)}"
        )


@router.post("/compatibility/options", response_model=CompatibleOptionsResponse)
async def get_compatible_options(request: CompatibleOptionsRequest):
    """
    Get compatible options for a given technology in a specific category.
    """
    try:
        result = await TechStackService.get_compatible_options(
            request.category, request.technology
        )
        return result
    except Exception as e:
        logger.error(f"Error getting compatible options: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error getting compatible options: {str(e)}"
        )


@router.get("/options", response_model=AllTechOptionsResponse)
async def get_all_technology_options():
    """
    Get all available technology options.
    """
    try:
        return await TechStackService.get_all_technology_options()
    except Exception as e:
        logger.error(f"Error getting technology options: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error getting technology options: {str(e)}"
        ) 