"""
Utility functions for AI text generation endpoints.
"""
import logging
import json
import re
from typing import Type, TypeVar, Any, Dict

from fastapi import HTTPException

# Type variable for generic response types
T = TypeVar('T')

def extract_data_from_response(response: Dict[str, Any], schema_class: Type[T], logger: logging.Logger) -> T:
    """
    Extract data from an AI response with multiple fallback mechanisms.
    
    Args:
        response: The response from the AI service
        schema_class: The Pydantic schema class to convert the data to
        logger: Logger instance for logging errors
    
    Returns:
        An instance of the schema_class with the extracted data
        
    Raises:
        HTTPException: If data cannot be extracted after all fallback attempts
    """
    
    logger.info(f"Response: {response}")
    
    # Attempt 1: Standard extraction from "data" field
    if "data" in response:
        try:
            return schema_class(**response["data"])
        except Exception as e:
            logger.warning(f"Failed to parse standard 'data' field: {str(e)}")
    
    # Attempt 2: Check if the entire response is the data structure
    if isinstance(response, dict) and not any(k in response for k in ["data", "error"]):
        try:
            return schema_class(**response)
        except Exception as e:
            logger.warning(f"Failed to parse entire response as data: {str(e)}")
    
    # Attempt 3: Check if there's a JSON string in the response
    if "content" in response and isinstance(response["content"], str):
        try:
            # Look for JSON objects in the content
            content = response["content"]
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                json_data = json.loads(json_str)
                return schema_class(**json_data)
        except Exception as e:
            logger.warning(f"Failed to extract JSON from content: {str(e)}")
    
    # Attempt 4: Check if response contains raw text that could be parsed as JSON
    if isinstance(response, str):
        try:
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                json_data = json.loads(json_str)
                return schema_class(**json_data)
        except Exception as e:
            logger.warning(f"Failed to extract JSON from string response: {str(e)}")
    
    # Attempt 5: For TestCasesData, provide empty default structure if response is empty
    if schema_class.__name__ == "TestCasesData" and (
        isinstance(response, dict) and len(response) == 0 or 
        isinstance(response, dict) and "data" in response and len(response["data"]) == 0
    ):
        logger.warning("Empty response detected for TestCasesData. Creating default empty structure.")
        try:
            return schema_class(testCases=[])
        except Exception as e:
            logger.warning(f"Failed to create default TestCasesData structure: {str(e)}")
    
    # If we've reached this point, log details about the response for debugging
    logger.error(f"Failed to extract data after all fallback attempts. Response structure: {type(response)}")
    if isinstance(response, dict):
        logger.error(f"Response keys: {list(response.keys())}")
    
    # All attempts failed, raise exception
    raise HTTPException(
        status_code=500,
        detail="Failed to extract valid data from AI response after multiple attempts"
    )