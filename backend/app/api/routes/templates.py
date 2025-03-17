"""
API routes for project templates.
"""
import logging
from fastapi import APIRouter, HTTPException, Path, Depends
from typing import Dict, Any

from ...schemas.templates import ProjectTemplateResponse, ProjectTemplateList
from ...services.templates_service import TemplatesService
from ...core.firebase_auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("", response_model=ProjectTemplateList)
async def get_templates(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get all project templates.
    """
    try:
        templates = await TemplatesService.get_templates()
        return {"templates": templates}
    except Exception as e:
        logger.error(f"Error retrieving templates: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve templates: {str(e)}"
        )


@router.get("/{template_id}", response_model=ProjectTemplateResponse)
async def get_template_by_id(
    template_id: str = Path(..., title="The ID of the template to get"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get a project template by ID.
    
    Args:
        template_id: The ID of the template to get
    """
    try:
        template_data = await TemplatesService.get_template_by_id(template_id)
        
        if not template_data:
            raise HTTPException(status_code=404, detail=f"Template with ID {template_id} not found")
            
        return template_data
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error retrieving template {template_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve template: {str(e)}"
        )
