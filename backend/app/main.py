"""Main application module.

This module provides the main FastAPI application.
"""

import logging
import os
import sys
from typing import List, Any, Dict
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Import configuration and database
from .core.config import settings
from .db.base import db

# Import API router and seed data modules
from .api.api import api_router
from .seed.templates import seed_templates

HAS_API_ROUTER = True

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    
    This handles setup and teardown for the application.
    """
    # Setup
    try:
        # Connect to MongoDB
        logger.info("Connecting to MongoDB...")
        try:
            await db.connect_to_mongodb()
            logger.info("MongoDB connection established")
            
            # Seed database with sample data if needed
            database = db.get_db()
            if database is not None:
                # Seed template data
                await seed_templates(database)
        except Exception as e:
            logger.error(f"Error during MongoDB initialization: {str(e)}")
        
        logger.info("Application startup complete")
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")
    
    yield
    
    # Teardown
    try:
        # Close MongoDB connection
        logger.info("Closing MongoDB connection...")
        await db.close_mongodb_connection()
        logger.info("MongoDB connection closed")
    except Exception as e:
        logger.error(f"Error during shutdown: {str(e)}")
    
    logger.info("Application shutdown complete")

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description=settings.description,
    lifespan=lifespan,
)

# Setup CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://localhost:3000",
    "https://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router if available
if HAS_API_ROUTER:
    app.include_router(api_router, prefix="/api")
    logger.info("API router included")
else:
    logger.warning("API router not available - only basic endpoints will work")

# Debug endpoints
@app.get("/", tags=["debug"])
async def root() -> Dict[str, Any]:
    """Root endpoint for debugging."""
    return {
        "message": "ArchSpec API is running",
        "version": settings.version,
        "environment": settings.environment
    }

@app.get("/health", tags=["debug"])
async def health() -> Dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}

# Global error handler
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Handle generic exceptions."""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"An unexpected error occurred: {str(exc)}"}
    ) 