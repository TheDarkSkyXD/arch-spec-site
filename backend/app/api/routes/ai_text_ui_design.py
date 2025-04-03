"""
API routes for UI design enhancement using AI.
"""

import logging
import json
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.tools.print_ui_design import print_ui_design_input_schema
from app.ai.prompts.ui_design import get_ui_design_user_prompt
from app.schemas.ai_text import (
    UIDesignEnhanceRequest,
    UIDesignEnhanceResponse,
    UIDesignData,
)
from app.services.ai_service import AIService, INTELLIGENT_MODEL
from app.core.firebase_auth import get_current_user
from app.api.routes.ai_text_utils import extract_data_from_response
from app.utils.llm_logging import DefaultLLMLogger
from app.db.base import db
from app.services.db_usage_tracker import DatabaseUsageTracker

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])


@router.post("/enhance-ui-design", response_model=UIDesignEnhanceResponse)
async def enhance_ui_design(
    request: UIDesignEnhanceRequest, current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance UI design using AI with function calling.

    This endpoint takes a project description, features, requirements, and optionally
    existing UI design, and returns an improved, structured UI design system.
    It uses Anthropic's tool use feature to ensure a structured response.
    """
    try:
        # Create the service objects
        llm_logger = DefaultLLMLogger()
        usage_tracker = DatabaseUsageTracker(db.get_db())

        # Initialize the AI client with the logger and usage tracker
        client = AIService(llm_logger, usage_tracker)

        # Create the system message
        system_message = (
            "You are a UI/UX designer generating UI design system recommendations for a software project. "
            "Based on the project description, features, and requirements, recommend a cohesive UI design system "
            "with colors, typography, spacing, and other visual elements."
        )

        # Format features and requirements as strings
        formatted_features = "None provided"
        if request.features and len(request.features) > 0:
            formatted_features = json.dumps(request.features, indent=2)

        formatted_requirements = "\n".join([f"- {req}" for req in request.requirements])

        # Format existing UI design if provided
        formatted_existing_ui_design = "None provided"
        if request.existing_ui_design:
            formatted_existing_ui_design = json.dumps(request.existing_ui_design.dict(), indent=2)

        # Create the user message
        user_prompt = get_ui_design_user_prompt(
            request.project_description,
            formatted_features,
            formatted_requirements,
            formatted_existing_ui_design,
            request.additional_user_instruction,
        )

        # Generate the tool use response
        messages = [{"role": "user", "content": user_prompt}]
        tools = [print_ui_design_input_schema()]
        response = await client.get_tool_use_response(
            system_message,
            tools,
            messages,
            model=INTELLIGENT_MODEL,
            log_metadata={
                "user_id": current_user.get("firebase_uid") if current_user else None,
                "project_id": request.project_id if hasattr(request, "project_id") else "unknown",
                "project_description": request.project_description,
                "features": request.features,
                "requirements": request.requirements,
                "existing_ui_design": (
                    request.existing_ui_design.dict() if request.existing_ui_design else None
                ),
                "additional_user_instruction": request.additional_user_instruction,
            },
            response_type="enhance_ui_design",
            check_credits=True,
            use_token_api_for_estimation=True,
        )

        # Handle potential credit errors - check the response content if it's a dict
        if (
            isinstance(response, dict)
            and isinstance(response.get("content"), str)
            and response["content"].startswith("Insufficient credits")
        ):
            raise HTTPException(status_code=402, detail=response["content"])
        elif isinstance(response, str) and response.startswith("Insufficient credits"):
            raise HTTPException(status_code=402, detail=response)

        if "error" in response:
            logger.error(f"Error in AI tool use: {response['error']}")
            raise HTTPException(
                status_code=500, detail=f"Failed to generate UI design: {response['error']}"
            )

        # Extract UI design data with fallback mechanisms
        ui_design_data = extract_data_from_response(response, UIDesignData, logger)

        # Return the enhanced UI design
        return UIDesignEnhanceResponse(data=ui_design_data)
    except Exception as e:
        logger.error(f"Error enhancing UI design: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to enhance UI design: {str(e)}")
