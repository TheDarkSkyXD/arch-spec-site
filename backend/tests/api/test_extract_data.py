"""Tests for data extraction functions in AI text routes."""

import json
import logging
import pytest
from fastapi import HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional

from app.api.routes.ai_text import extract_data_from_response
from app.schemas.ai_text import TestCasesData, TestCase


# Create a simple schema for testing
class SimpleTestModel(BaseModel):
    name: str
    value: int


# Create a test logger
@pytest.fixture
def test_logger():
    return logging.getLogger("test_logger")


class TestExtractDataFromResponse:
    """Tests for the extract_data_from_response function."""

    def test_extract_from_data_field(self, test_logger):
        """Test extraction from the 'data' field of a response."""
        response = {"data": {"name": "test", "value": 123}}
        result = extract_data_from_response(response, SimpleTestModel, test_logger)
        assert result.name == "test"
        assert result.value == 123

    def test_extract_from_whole_response(self, test_logger):
        """Test extraction from the entire response."""
        response = {"name": "test", "value": 123}
        result = extract_data_from_response(response, SimpleTestModel, test_logger)
        assert result.name == "test"
        assert result.value == 123

    def test_extract_from_json_in_content(self, test_logger):
        """Test extraction from JSON in a 'content' field."""
        response = {"content": 'Here is the result: {"name": "test", "value": 123}'}
        result = extract_data_from_response(response, SimpleTestModel, test_logger)
        assert result.name == "test"
        assert result.value == 123

    def test_extract_from_string_response(self, test_logger):
        """Test extraction from a string response containing JSON."""
        response = 'The answer is {"name": "test", "value": 123}'
        result = extract_data_from_response(response, SimpleTestModel, test_logger)
        assert result.name == "test"
        assert result.value == 123

    def test_extract_with_test_cases_data(self, test_logger):
        """Test extraction with the TestCasesData schema."""
        # Create a valid TestCasesData structure
        test_case = {
            "feature": "Login",
            "title": "User logs in successfully",
            "scenarios": [
                {
                    "name": "Valid login",
                    "steps": [
                        {"type": "given", "text": "User is on login page"},
                        {"type": "when", "text": "User enters valid credentials"},
                        {"type": "then", "text": "User is logged in"}
                    ]
                }
            ]
        }
        
        # Test extraction from data field
        response = {"data": {"testCases": [test_case]}}
        result = extract_data_from_response(response, TestCasesData, test_logger)
        assert len(result.testCases) == 1
        assert result.testCases[0].feature == "Login"
        
        # Test extraction from whole response
        response = {"testCases": [test_case]}
        result = extract_data_from_response(response, TestCasesData, test_logger)
        assert len(result.testCases) == 1
        
        # Test extraction from content field with JSON
        response = {"content": json.dumps({"testCases": [test_case]})}
        result = extract_data_from_response(response, TestCasesData, test_logger)
        assert len(result.testCases) == 1

    def test_handles_empty_response(self, test_logger):
        """Test handling of empty response for TestCasesData."""
        response = {}
        # Our function now returns a default empty structure instead of raising an exception
        result = extract_data_from_response(response, TestCasesData, test_logger)
        assert isinstance(result, TestCasesData)
        assert len(result.testCases) == 0
        
    def test_handles_empty_dict_in_data(self, test_logger):
        """Test handling of empty dict in data field for TestCasesData."""
        response = {"data": {}}
        # Our function now returns a default empty structure instead of raising an exception
        result = extract_data_from_response(response, TestCasesData, test_logger)
        assert isinstance(result, TestCasesData)
        assert len(result.testCases) == 0
            
    def test_handles_malformed_response(self, test_logger):
        """Test handling of malformed response."""
        # Response with invalid JSON in content
        response = {"content": "This is not JSON"}
        with pytest.raises(HTTPException) as excinfo:
            extract_data_from_response(response, TestCasesData, test_logger)
        assert excinfo.value.status_code == 500
        
    def test_handles_empty_response_for_other_schemas(self, test_logger):
        """Test that empty responses still raise exceptions for non-TestCasesData schemas."""
        response = {}
        with pytest.raises(HTTPException) as excinfo:
            extract_data_from_response(response, SimpleTestModel, test_logger)
        assert excinfo.value.status_code == 500 