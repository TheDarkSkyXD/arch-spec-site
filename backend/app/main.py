"""Main application module.

This module provides the main FastAPI application.
"""

import logging
import os
import sys
from typing import List
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

# Import API router
try:
    from .api.api import api_router
    HAS_API_ROUTER = True
except Exception as e:
    logger.error(f"Error importing API router: {str(e)}")
    HAS_API_ROUTER = False

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup logic
    if db.client is not None:
        try:
            logger.info("Connecting to MongoDB...")
            await db.connect_to_mongodb()
            logger.info("MongoDB connection established")
        except Exception as e:
            logger.error(f"Error during MongoDB initialization: {str(e)}")
    
    # Yield control back to FastAPI
    yield
    
    # Shutdown logic
    if db.client is not None:
        try:
            logger.info("Closing MongoDB connection...")
            await db.close_mongodb_connection()
            logger.info("MongoDB connection closed")
        except Exception as e:
            logger.error(f"Error during MongoDB shutdown: {str(e)}")

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description=settings.description,
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
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
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to ArchSpec API",
        "version": settings.version,
        "api_router_loaded": HAS_API_ROUTER
    }

@app.get("/debug")
async def debug_info():
    """Debug information endpoint."""
    return {
        "python_version": sys.version,
        "working_directory": os.getcwd(),
        "env_vars": {
            "MONGODB_URI": os.getenv("MONGODB_URI", "Not set"),
            "MONGODB_DB_NAME": os.getenv("MONGODB_DB_NAME", "Not set"),
            "ANTHROPIC_API_KEY": bool(os.getenv("ANTHROPIC_API_KEY")),
            "ANTHROPIC_MODEL": os.getenv("ANTHROPIC_MODEL", "Not set"),
        },
        "settings": {
            "app_name": settings.app_name,
            "version": settings.version,
            "mongo_uri": settings.mongo.uri,
            "has_anthropic_key": bool(settings.anthropic.api_key),
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    mongo_status = "available" if db.client is not None else "unavailable"
    api_status = "available" if HAS_API_ROUTER else "unavailable"
    
    return {
        "status": "healthy",
        "version": settings.version,
        "mongo": mongo_status,
        "api_router": api_status,
        "anthropic": "configured" if settings.anthropic.api_key else "not_configured"
    }

# Global error handler
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Handle generic exceptions."""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"An unexpected error occurred: {str(exc)}"}
    ) 