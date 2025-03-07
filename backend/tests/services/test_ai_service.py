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


@pytest.mark.asyncio
@patch.object(AnthropicClient, "generate_response")
async def test_process_specification(mock_generate_response):
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
    result = await client.process_specification(spec)
    
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


@patch("anthropic.Anthropic")
def test_get_tool_use_response_with_tool_use(mock_anthropic):
    """Test the _get_tool_use_response method with tool use content blocks."""
    # Set up mock response with tool_use content block
    mock_client = MagicMock()
    mock_anthropic.return_value = mock_client
    
    mock_content_block = MagicMock()
    mock_content_block.type = "tool_use"
    mock_content_block.input = {"key": "value"}
    
    mock_response = MagicMock()
    mock_response.content = [mock_content_block]
    mock_client.messages.create.return_value = mock_response
    
    # Create client and test parameters
    client = AnthropicClient()
    system_prompt = "Test system prompt"
    tools = [{"type": "function", "function": {"name": "test_function"}}]
    messages = [{"role": "user", "content": "Test message"}]
    
    # Call the method
    result = client._get_tool_use_response(system_prompt, tools, messages)
    
    # Check that the client was called with the right parameters
    mock_client.messages.create.assert_called_once_with(
        model=client.model,
        max_tokens=client.max_tokens,
        temperature=client.temperature,
        system=system_prompt,
        tools=tools,
        messages=messages
    )
    
    # Check the result
    assert result == {"key": "value"}


@patch("anthropic.Anthropic")
def test_get_tool_use_response_fallback_to_json(mock_anthropic):
    """Test the _get_tool_use_response method falling back to JSON extraction."""
    # Set up mock response with text content block containing JSON
    mock_client = MagicMock()
    mock_anthropic.return_value = mock_client
    
    mock_text_block = MagicMock()
    mock_text_block.type = "text"
    mock_text_block.text = "Here is the result: {\"key\": \"value\"}"
    
    mock_response = MagicMock()
    mock_response.content = [mock_text_block]
    mock_client.messages.create.return_value = mock_response
    
    # Create client and test parameters
    client = AnthropicClient()
    system_prompt = "Test system prompt"
    tools = [{"type": "function", "function": {"name": "test_function"}}]
    messages = [{"role": "user", "content": "Test message"}]
    
    # Call the method
    result = client._get_tool_use_response(system_prompt, tools, messages)
    
    # Check the result
    assert result == {"key": "value"}


@patch("anthropic.Anthropic")
def test_get_tool_use_response_error_handling(mock_anthropic):
    """Test the _get_tool_use_response method handling errors."""
    # Set up mock to raise an exception
    mock_client = MagicMock()
    mock_anthropic.return_value = mock_client
    mock_client.messages.create.side_effect = Exception("Test error")
    
    # Create client and test parameters
    client = AnthropicClient()
    system_prompt = "Test system prompt"
    tools = [{"type": "function", "function": {"name": "test_function"}}]
    messages = [{"role": "user", "content": "Test message"}]
    
    # Call the method
    result = client._get_tool_use_response(system_prompt, tools, messages)
    
    # Check the result
    assert "error" in result
    assert "Test error" in result["error"] 