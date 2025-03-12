"""Export API routes.

This module provides API routes for exporting artifacts.
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Dict, Any

from ...db.base import db
from ...services.export_service import ExportService
from ...core.firebase_auth import get_current_user

router = APIRouter()

export_service = ExportService()


def get_db():
    """Get database instance."""
    return db.get_db()


@router.get("/projects/{project_id}/export")
async def export_project(
    project_id: str, 
    database: AsyncIOMotorDatabase = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Export a project artifacts.
    
    Args:
        project_id: The project ID.
        database: The database instance.
        current_user: The authenticated user.
        
    Returns:
        The exported artifacts as a ZIP file.
        
    Raises:
        HTTPException: If the project or artifacts is not found or doesn't belong to the user.
    """
    # Check if project belongs to user
    user_id = str(current_user["_id"])
    project = await database.projects.find_one({"id": project_id, "user_id": user_id})
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get projects
    project = await database.projects.find_one({"id": project_id})
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get artifacts
    artifacts = await database.artifacts.find({"project_id": project["id"]}).to_list(length=100)
    
    # Generate export
    export_data = await export_service.export_to_markdown(project, project, artifacts)
    
    # Create response with ZIP file
    filename = f"{project['name'].replace(' ', '_')}_artifacts.zip"
    headers = {
        "Content-Disposition": f"attachment; filename={filename}"
    }
    
    return Response(
        content=export_data,
        media_type="application/zip",
        headers=headers
    ) 