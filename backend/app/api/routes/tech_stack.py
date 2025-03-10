"""
API routes for tech stack compatibility.
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from ...schemas.tech_stack import (
    AllTechOptionsResponse
)
from ...services.tech_stack_service import TechStackService
from ...core.firebase_auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/options", response_model=AllTechOptionsResponse)
async def get_all_technology_options(current_user: Dict[str, Any] = Depends(get_current_user)):
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