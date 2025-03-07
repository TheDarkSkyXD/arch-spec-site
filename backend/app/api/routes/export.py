"""Export API routes.

This module provides API routes for exporting specifications.
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from ...db.base import db
from ...services.export_service import ExportService

router = APIRouter()

export_service = ExportService()


def get_db():
    """Get database instance."""
    return db.get_db()


@router.get("/projects/{project_id}/export")
async def export_project(project_id: str, database: AsyncIOMotorDatabase = Depends(get_db)):
    """Export a project specification.
    
    Args:
        project_id: The project ID.
        database: The database instance.
        
    Returns:
        The exported specification as a ZIP file.
        
    Raises:
        HTTPException: If the project or specification is not found.
    """
    # Get project
    project = await database.projects.find_one({"id": project_id})
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get specification
    specification = await database.specifications.find_one({"project_id": project_id})
    if specification is None:
        raise HTTPException(status_code=404, detail="Specification not found")
    
    # Get artifacts
    artifacts = await database.artifacts.find({"specification_id": specification["id"]}).to_list(length=100)
    
    # Generate export
    export_data = await export_service.export_to_markdown(project, specification, artifacts)
    
    # Create response with ZIP file
    filename = f"{project['name'].replace(' ', '_')}_specification.zip"
    headers = {
        "Content-Disposition": f"attachment; filename={filename}"
    }
    
    return Response(
        content=export_data,
        media_type="application/zip",
        headers=headers
    ) 