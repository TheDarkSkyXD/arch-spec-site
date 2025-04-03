"""Main application module.

This module provides the main FastAPI application.
"""

import logging
from typing import Any, Dict
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

# Set logging level to DEBUG for our app modules
for logger_name in ["app.seed.templates"]:
    logging.getLogger(logger_name).setLevel(logging.DEBUG)

# Import configuration and database
from .core.config import settings
from .db.base import db

# Import API router and seed data modules
from .api.api import api_router
from .seed.templates import seed_templates
from .seed.tech_stack import seed_tech_stack
from .seed.implementation_prompts import seed_sample_implementation_prompts

HAS_API_ROUTER = True


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.

    This handles setup and teardown for the application.

    During startup, it:
    1. Connects to MongoDB
    2. Seeds the tech stack to the database (creates or updates)
       - The tech stack is the central source of truth for all technology names
       - See /app/seed/README.md for more information
    3. Seeds project templates to the database (creates, updates, or marks deprecated)
       - Templates are validated against the tech stack for consistency
    4. Seeds sample implementation prompts to the database (creates or updates)
       - These are example prompts that users can import into their projects

    During shutdown, it:
    1. Closes MongoDB connection
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
                print("Database connection available, proceeding with seeding")

                # Seed tech stack data
                await seed_tech_stack(database, clean_all=False)

                # Seed template data
                await seed_templates(database, clean_all=False)

                # Seed sample implementation prompts
                await seed_sample_implementation_prompts(database, clean_all=False)
            else:
                print("Database connection not available, skipping seeding")
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
    "https://archspec.dev",
    "https://www.archspec.dev",
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
        "environment": settings.environment,
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
        status_code=500, content={"detail": f"An unexpected error occurred: {str(exc)}"}
    )
