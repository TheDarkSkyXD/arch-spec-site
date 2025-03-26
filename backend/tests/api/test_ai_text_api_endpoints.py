"""
Tests for the API endpoints enhancement functionality.
"""
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.ai_text import ApiData, ApiEndpoint

client = TestClient(app)

# Mock data for testing
MOCK_PROJECT_DESCRIPTION = "A task management application"
MOCK_FEATURES = [
    {
        "name": "User Authentication",
        "description": "User login and registration",
        "enabled": True,
        "optional": False
    },
    {
        "name": "Task Management",
        "description": "Create, update, and delete tasks",
        "enabled": True,
        "optional": False
    }
]
MOCK_DATA_MODELS = {
    "entities": [
        {
            "name": "User",
            "description": "User account information",
            "fields": [
                {"name": "id", "type": "uuid", "primaryKey": True},
                {"name": "email", "type": "string", "unique": True},
                {"name": "password", "type": "string"}
            ]
        },
        {
            "name": "Task",
            "description": "Task information",
            "fields": [
                {"name": "id", "type": "uuid", "primaryKey": True},
                {"name": "title", "type": "string"},
                {"name": "description", "type": "string"},
                {"name": "status", "type": "string"},
                {"name": "user_id", "type": "uuid"}
            ]
        }
    ]
}
MOCK_REQUIREMENTS = [
    "Users should be able to register and login",
    "Users should be able to create, update, and delete tasks",
    "Tasks should have a title, description, and status"
]

MOCK_API_ENDPOINTS = {
    "endpoints": [
        {
            "path": "/api/auth/register",
            "description": "Register a new user",
            "methods": ["POST"],
            "auth": False
        },
        {
            "path": "/api/auth/login",
            "description": "Login a user",
            "methods": ["POST"],
            "auth": False
        },
        {
            "path": "/api/tasks",
            "description": "Get all tasks for the authenticated user",
            "methods": ["GET"],
            "auth": True
        },
        {
            "path": "/api/tasks",
            "description": "Create a new task",
            "methods": ["POST"],
            "auth": True
        },
        {
            "path": "/api/tasks/{task_id}",
            "description": "Get a specific task",
            "methods": ["GET"],
            "auth": True
        },
        {
            "path": "/api/tasks/{task_id}",
            "description": "Update a task",
            "methods": ["PUT"],
            "auth": True
        },
        {
            "path": "/api/tasks/{task_id}",
            "description": "Delete a task",
            "methods": ["DELETE"],
            "auth": True
        }
    ]
}

@pytest.fixture
def mock_get_current_user():
    """Mock the get_current_user dependency."""
    with patch("app.api.routes.ai_text.get_current_user") as mock:
        mock.return_value = {"uid": "test-user-id", "email": "test@example.com"}
        yield mock

@pytest.fixture
def mock_anthropic_client():
    """Mock the AIService."""
    with patch("app.api.routes.ai_text.AIService") as mock:
        mock_instance = MagicMock()
        mock_instance.get_tool_use_response.return_value = {"data": MOCK_API_ENDPOINTS}
        mock.return_value = mock_instance
        yield mock_instance

def test_enhance_api_endpoints_success(mock_get_current_user, mock_anthropic_client):
    """Test successful API endpoints enhancement."""
    # Prepare the request data
    request_data = {
        "project_description": MOCK_PROJECT_DESCRIPTION,
        "features": MOCK_FEATURES,
        "data_models": MOCK_DATA_MODELS,
        "requirements": MOCK_REQUIREMENTS
    }
    
    # Make the request
    response = client.post("/api/ai-text/enhance-api-endpoints", json=request_data)
    
    # Verify the response
    assert response.status_code == 200
    assert "data" in response.json()
    assert "endpoints" in response.json()["data"]
    
    # Verify that the AIService was called with the correct parameters
    mock_anthropic_client.get_tool_use_response.assert_called_once()
    
    # Verify the response data
    endpoints = response.json()["data"]["endpoints"]
    assert len(endpoints) == len(MOCK_API_ENDPOINTS["endpoints"])
    
    # Verify that the first endpoint matches the expected data
    assert endpoints[0]["path"] == MOCK_API_ENDPOINTS["endpoints"][0]["path"]
    assert endpoints[0]["description"] == MOCK_API_ENDPOINTS["endpoints"][0]["description"]
    assert endpoints[0]["methods"] == MOCK_API_ENDPOINTS["endpoints"][0]["methods"]
    assert endpoints[0]["auth"] == MOCK_API_ENDPOINTS["endpoints"][0]["auth"]

def test_enhance_api_endpoints_with_existing_endpoints(mock_get_current_user, mock_anthropic_client):
    """Test API endpoints enhancement with existing endpoints."""
    # Prepare the request data with existing endpoints
    request_data = {
        "project_description": MOCK_PROJECT_DESCRIPTION,
        "features": MOCK_FEATURES,
        "data_models": MOCK_DATA_MODELS,
        "requirements": MOCK_REQUIREMENTS,
        "existing_endpoints": MOCK_API_ENDPOINTS
    }
    
    # Make the request
    response = client.post("/api/ai-text/enhance-api-endpoints", json=request_data)
    
    # Verify the response
    assert response.status_code == 200
    assert "data" in response.json()
    assert "endpoints" in response.json()["data"]
    
    # Verify that the AIService was called with the correct parameters
    mock_anthropic_client.get_tool_use_response.assert_called_once()

def test_enhance_api_endpoints_error_handling(mock_get_current_user, mock_anthropic_client):
    """Test error handling in API endpoints enhancement."""
    # Configure the mock to return an error
    mock_anthropic_client.get_tool_use_response.return_value = {"error": "AI service error"}
    
    # Prepare the request data
    request_data = {
        "project_description": MOCK_PROJECT_DESCRIPTION,
        "features": MOCK_FEATURES,
        "data_models": MOCK_DATA_MODELS,
        "requirements": MOCK_REQUIREMENTS
    }
    
    # Make the request
    response = client.post("/api/ai-text/enhance-api-endpoints", json=request_data)
    
    # Verify the response
    assert response.status_code == 500
    assert "detail" in response.json()
    assert "Failed to generate API endpoints" in response.json()["detail"] 