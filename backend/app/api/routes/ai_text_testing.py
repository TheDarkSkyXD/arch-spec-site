"""
API routes for test cases generation using AI.
"""
import logging
import json
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from app.ai.tools.print_test_cases import print_test_cases_input_schema
from app.ai.prompts.test_cases import get_test_cases_user_prompt
from app.schemas.ai_text import (
    TestCasesEnhanceRequest,
    TestCasesEnhanceResponse,
    TestCasesData,
)
from app.services.ai_service import AnthropicClient
from app.core.firebase_auth import get_current_user
from app.api.routes.ai_text_utils import extract_data_from_response

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/ai-text", tags=["AI Text"])

@router.post("/enhance-test-cases", response_model=TestCasesEnhanceResponse)
async def enhance_test_cases(
    request: TestCasesEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Enhance or generate test cases in Gherkin format.
    """
    try:
        client = AnthropicClient()
        
        # Format requirements as string
        formatted_requirements = "\n".join(f"- {req}" for req in request.requirements)
        
        # Format features as JSON string
        formatted_features = json.dumps(request.features, indent=2)
        
        # Format existing test cases if any
        formatted_test_cases = None
        if request.existing_test_cases:
            formatted_test_cases = json.dumps(request.existing_test_cases, indent=2)
        
        # Create the user prompt
        user_prompt = get_test_cases_user_prompt(
            formatted_requirements,
            formatted_features,
            formatted_test_cases
        )

        messages = [{"role": "user", "content": user_prompt}]
        
        # Call the AI service
        response = client.get_tool_use_response(
            system_prompt="You are an expert QA engineer specializing in writing Gherkin test cases for software applications.",
            tools=[print_test_cases_input_schema()],
            messages=messages
        )
        
        # Extract the response data
        test_cases_data = extract_data_from_response(response, TestCasesData, logger)
        
        return {"data": test_cases_data}
    except Exception as e:
        logger.error(f"Error enhancing test cases: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error enhancing test cases: {str(e)}")


@router.post("/generate-test-cases", response_model=TestCasesEnhanceResponse)
async def generate_test_cases(
    request: TestCasesEnhanceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Generate new test cases in Gherkin format based on project requirements and features.
    This is a dedicated endpoint for creating test cases from scratch.
    """
    try:
        client = AnthropicClient()
        
        # Format requirements as string
        formatted_requirements = "\n".join(f"- {req}" for req in request.requirements)
        
        # Format features as JSON string
        formatted_features = json.dumps(request.features, indent=2)
        
        # Create the user prompt - we don't pass existing test cases
        user_prompt = get_test_cases_user_prompt(
            formatted_requirements,
            formatted_features,
            None  # No existing test cases for generation from scratch
        )
        
        messages = [{"role": "user", "content": user_prompt}]
        
        # Call the AI service
        response = client.get_tool_use_response(
            system_prompt="You are an expert QA engineer specializing in writing comprehensive Gherkin test cases for software applications. Focus on creating test cases that cover all functional requirements and important edge cases.",
            tools=[print_test_cases_input_schema()],
            messages=messages
        )
        
        # Extract the response data
        test_cases_data = extract_data_from_response(response, TestCasesData, logger)
        
        return {"data": test_cases_data}
    except Exception as e:
        logger.error(f"Error generating test cases: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating test cases: {str(e)}")