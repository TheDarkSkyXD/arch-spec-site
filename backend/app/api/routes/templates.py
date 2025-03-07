"""
API routes for project templates.
"""
import logging
from fastapi import APIRouter, HTTPException, Path
from typing import Dict, List, Any

from ...schemas.templates import ProjectTemplateResponse, ProjectTemplateListResponse
from ...services.templates_service import TemplatesService

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/", response_model=ProjectTemplateListResponse)
async def get_templates():
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
    template_id: str = Path(..., description="The ID of the template to retrieve")
):
    """
    Get a project template by ID.
    """
    try:
        template = await TemplatesService.get_template_by_id(template_id)
        if not template:
            raise HTTPException(
                status_code=404,
                detail=f"Template with ID {template_id} not found"
            )
        return template
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving template {template_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve template: {str(e)}"
        ) 