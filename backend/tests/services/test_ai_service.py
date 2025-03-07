"""Tests for the AI service."""

import pytest
from unittest.mock import patch, MagicMock

from app.services.ai_service import AnthropicClient, SetEncoder


def test_set_encoder():
    """Test the SetEncoder class."""
    encoder = SetEncoder()
    
    # Test encoding a set
    result = encoder.default({"a", "b", "c"})
    assert isinstance(result, list)
    assert set(result) == {"a", "b", "c"}
    
    # Test encoding a non-set
    with pytest.raises(TypeError):
        encoder.default(123)


@patch("anthropic.Anthropic")
def test_anthropic_client_init(mock_anthropic):
    """Test initializing the AnthropicClient."""
    client = AnthropicClient()
    
    assert client.client == mock_anthropic.return_value
    assert isinstance(client.model, str)
    assert isinstance(client.max_tokens, int)
    assert isinstance(client.temperature, float)


@patch.object(AnthropicClient, "generate_response")
def test_process_specification(mock_generate_response):
    """Test processing a specification."""
    # Setup mock
    mock_generate_response.return_value = """
    Here's the enhanced specification:
    
    {
        "architecture_diagram": "graph TD\\n    A-->B\\n    B-->C",
        "api_endpoints": [
            {
                "path": "/api/test",
                "method": "GET",
                "description": "Test endpoint"
            }
        ],
        "data_models": [
            {
                "name": "TestModel",
                "attributes": [
                    {
                        "name": "id",
                        "type": "string",
                        "constraints": ["primary_key"]
                    }
                ],
                "relationships": []
            }
        ],
        "file_structure": [
            "src/",
            "src/components/",
            "src/pages/"
        ]
    }
    """
    
    # Create client and test
    client = AnthropicClient()
    
    # Create test specification
    spec = {
        "requirements": {
            "project_type": "Web Application",
            "functional_requirements": ["Test requirement"],
            "non_functional_requirements": ["Test non-functional requirement"],
            "tech_stack": {
                "frontend": "React",
                "backend": "FastAPI",
                "database": "MongoDB"
            }
        }
    }
    
    # Process specification
    result = client.process_specification(spec)
    
    # Check result
    assert "architecture" in result
    assert "diagram" in result["architecture"]
    assert "api_endpoints" in result
    assert "data_model" in result
    assert "entities" in result["data_model"]
    assert "implementation" in result
    assert "file_structure" in result["implementation"]
    
    # Check that generate_response was called
    mock_generate_response.assert_called_once()


def test_generate_prompt():
    """Test generating a prompt."""
    client = AnthropicClient()
    
    # Create test specification
    spec = {
        "requirements": {
            "project_type": "Web Application",
            "functional_requirements": ["Test requirement"],
            "non_functional_requirements": ["Test non-functional requirement"],
            "tech_stack": {
                "frontend": "React",
                "backend": "FastAPI",
                "database": "MongoDB"
            }
        }
    }
    
    # Generate prompt
    prompt = client._generate_prompt(spec)
    
    # Check prompt
    assert "Web Application" in prompt
    assert "Test requirement" in prompt
    assert "Test non-functional requirement" in prompt
    assert "React" in prompt
    assert "FastAPI" in prompt
    assert "MongoDB" in prompt 