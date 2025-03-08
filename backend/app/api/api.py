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
    
    try:
        from .routes import tech_stack
        api_router.include_router(tech_stack.router, prefix="/tech-stack", tags=["tech-stack"])
        logger.info("Tech Stack router loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load tech stack router: {str(e)}")
    
    try:
        from .routes import templates
        api_router.include_router(templates.router, prefix="/templates", tags=["templates"])
        logger.info("Templates router loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load templates router: {str(e)}")
        
    try:
        from .routes import tech_registry
        api_router.include_router(tech_registry.router)
        logger.info("Tech Registry router loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load tech registry router: {str(e)}")
    
    try:
        from .routes import project_sections
        api_router.include_router(project_sections.router, tags=["project-sections"])
        logger.info("Project Sections router loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load project sections router: {str(e)}")
    
    try:
        from .routes import users
        api_router.include_router(users.router, prefix="/users", tags=["users"])
        logger.info(f"Users router loaded successfully with routes: {[route.path for route in users.router.routes]}")
    except Exception as e:
        logger.error(f"Failed to load users router: {str(e)}")
    
    logger.info("API routes imported successfully")
except Exception as e:
    logger.error(f"Failed to import API routes: {str(e)}") 