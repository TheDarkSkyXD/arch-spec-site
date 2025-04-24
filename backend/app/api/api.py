"""API router.

This module provides the API router for the application.
"""

import logging
import sys
from fastapi import APIRouter

logger = logging.getLogger(__name__)

# Create API router
api_router = APIRouter()


# Helper function to print visible errors
def print_error(message, error):
    """Print error message in red color to stderr"""
    error_detail = f"{message}: {str(error)}"
    logger.error(error_detail)
    print(f"\n\033[91mERROR: {error_detail}\033[0m", file=sys.stderr)

    # If this is a missing dependency, suggest installation
    if "No module named" in str(error):
        missing_pkg = str(error).split("'")[1]
        print(f"\033[93mFix: pip install {missing_pkg}\033[0m\n", file=sys.stderr)


# Import API routes with error handling
try:
    logger.info("Attempting to import API routes...")

    # Import routes one by one with error handling
    try:
        from .routes import projects

        api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
        logger.info("Projects router loaded successfully")
    except Exception as e:
        print_error("Failed to load projects router", e)

    try:
        from .routes import tech_stack

        api_router.include_router(tech_stack.router, prefix="/tech-stack", tags=["tech-stack"])
        logger.info("Tech Stack router loaded successfully")
    except Exception as e:
        print_error("Failed to load tech stack router", e)

    try:
        from .routes import templates

        api_router.include_router(templates.router, prefix="/templates", tags=["templates"])
        logger.info("Templates router loaded successfully")
    except Exception as e:
        print_error("Failed to load templates router", e)

    try:
        from .routes import project_specs

        api_router.include_router(
            project_specs.router, prefix="/project-specs", tags=["project-specs"]
        )
        logger.info("Project Specs router loaded successfully")
    except Exception as e:
        print_error("Failed to load project specs router", e)

    try:
        from .routes import users

        api_router.include_router(users.router, prefix="/users", tags=["users"])
        logger.info(
            f"Users router loaded successfully with routes: {[route.path for route in users.router.routes]}"
        )
    except Exception as e:
        print_error("Failed to load users router", e)

    # Replace the single ai_text import with the individual route modules
    try:
        from .routes.ai_text_description import router as ai_text_description_router

        api_router.include_router(ai_text_description_router)
        logger.info("AI Text Description router loaded successfully")
    except Exception as e:
        print_error("Failed to load AI Text Description router", e)

    try:
        from .routes.ai_text_business import router as ai_text_business_router

        api_router.include_router(ai_text_business_router)
        logger.info("AI Text Business router loaded successfully")
    except Exception as e:
        print_error("Failed to load AI Text Business router", e)

    try:
        from .routes.ai_text_requirements import router as ai_text_requirements_router

        api_router.include_router(ai_text_requirements_router)
        logger.info("AI Text Requirements router loaded successfully")
    except Exception as e:
        print_error("Failed to load AI Text Requirements router", e)

    try:
        from .routes.ai_text_features import router as ai_text_features_router

        api_router.include_router(ai_text_features_router)
        logger.info("AI Text Features router loaded successfully")
    except Exception as e:
        print_error("Failed to load AI Text Features router", e)

    try:
        from .routes.ai_text_pages import router as ai_text_pages_router

        api_router.include_router(ai_text_pages_router)
        logger.info("AI Text Pages router loaded successfully")
    except Exception as e:
        print_error("Failed to load AI Text Pages router", e)

    try:
        from .routes.ai_text_ui_design import router as ai_text_ui_design_router

        api_router.include_router(ai_text_ui_design_router)
        logger.info("AI Text UI Design router loaded successfully")
    except Exception as e:
        print_error("Failed to load AI Text UI Design router", e)

    try:
        from .routes.ai_text_data_model import router as ai_text_data_model_router

        api_router.include_router(ai_text_data_model_router)
        logger.info("AI Text Data Model router loaded successfully")
    except Exception as e:
        print_error("Failed to load AI Text Data Model router", e)

    try:
        from .routes.ai_text_api_endpoints import router as ai_text_api_endpoints_router

        api_router.include_router(ai_text_api_endpoints_router)
        logger.info("AI Text API Endpoints router loaded successfully")
    except Exception as e:
        print_error("Failed to load AI Text API Endpoints router", e)

    try:
        from .routes.ai_text_tech import router as ai_text_tech_router

        api_router.include_router(ai_text_tech_router)
        logger.info("AI Text Tech router loaded successfully")
    except Exception as e:
        print_error("Failed to load AI Text Tech router", e)

    try:
        from .routes.ai_text_testing import router as ai_text_testing_router

        api_router.include_router(ai_text_testing_router)
        logger.info("AI Text Testing router loaded successfully")
    except Exception as e:
        print_error("Failed to load AI Text Testing router", e)

    try:
        from .routes.ai_text_docs import router as ai_text_docs_router

        api_router.include_router(ai_text_docs_router)
        logger.info("AI Text Docs router loaded successfully")
    except Exception as e:
        print_error("Failed to load AI Text Docs router", e)

    try:
        from .routes import ai_text_implementation

        api_router.include_router(ai_text_implementation.router)
        logger.info("AI Text Implementation router loaded successfully")
    except Exception as e:
        print_error("Failed to load AI Text Implementation router", e)

    try:
        from .endpoints import payments

        api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
        logger.info("Payments router loaded successfully")
    except Exception as e:
        print_error("Failed to load Payments router", e)

    try:
        from .routes import implementation_prompts

        api_router.include_router(
            implementation_prompts.router,
            prefix="/implementation-prompts",
            tags=["implementation-prompts"],
        )
        logger.info("Implementation Prompts router loaded successfully")
    except Exception as e:
        print_error("Failed to load Implementation Prompts router", e)

    logger.info("API routes imported successfully")
except Exception as e:
    print_error("Failed to import API routes", e)
