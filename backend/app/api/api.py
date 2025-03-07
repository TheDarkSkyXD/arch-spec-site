"""API router.

This module provides the API router for the application.
"""

import logging
from fastapi import APIRouter

logger = logging.getLogger(__name__)

# Create API router
api_router = APIRouter()

# Import API routes with error handling
try:
    logger.info("Attempting to import API routes...")
    
    # Import routes one by one with error handling
    try:
        from .routes import projects
        api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
        logger.info("Projects router loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load projects router: {str(e)}")
    
    try:
        from .routes import specifications
        api_router.include_router(specifications.router, tags=["specifications"])
        logger.info("Specifications router loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load specifications router: {str(e)}")
    
    try:
        from .routes import export
        api_router.include_router(export.router, tags=["export"])
        logger.info("Export router loaded successfully") 
    except Exception as e:
        logger.error(f"Failed to load export router: {str(e)}")
    
    logger.info("API routes imported successfully")
except Exception as e:
    logger.error(f"Failed to import API routes: {str(e)}") 