"""
Tests for the AI text generation API endpoints.
"""
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.ai_text import (
    DescriptionEnhanceRequest, 
    DescriptionEnhanceResponse,
    BusinessGoalsEnhanceRequest,
    BusinessGoalsEnhanceResponse,
    RequirementsEnhanceRequest,
    RequirementsEnhanceResponse
)


@pytest.fixture
def test_client():
    return TestClient(app)


@patch("app.services.ai_service.AnthropicClient")
def test_enhance_project_description(mock_anthropic_client, test_client):
    """Test the enhance project description endpoint."""
    # Mock the client's generate_response method to return a fixed response
    mock_instance = mock_anthropic_client.return_value
    mock_instance.generate_response.return_value = "An enhanced workout tracking application with comprehensive exercise logging features."
    
    # Create a test request
    request = DescriptionEnhanceRequest(
        user_description="An app for tracking my workouts"
    )
    
    # Mock the firebase authentication
    with patch("app.core.firebase_auth.get_current_user", return_value={"uid": "test-user"}):
        # Make the request
        response = test_client.post(
            "/api/ai-text/enhance-description",
            json=request.dict()
        )
    
    # Check the response
    assert response.status_code == 200
    response_data = response.json()
    assert "enhanced_description" in response_data
    assert response_data["enhanced_description"] == "An enhanced workout tracking application with comprehensive exercise logging features."
    
    # Verify the mock was called with the correct parameters
    mock_instance.generate_response.assert_called_once()
    args, kwargs = mock_instance.generate_response.call_args
    assert len(args[0]) == 1  # Should have one message
    assert args[0][0]["role"] == "user"
    assert "Original description: An app for tracking my workouts" in args[0][0]["content"]
    assert "technical writing assistant" in kwargs["system"]


@patch("app.services.ai_service.AnthropicClient")
def test_enhance_business_goals_with_existing_goals(mock_anthropic_client, test_client):
    """Test the enhance business goals endpoint with existing goals."""
    # Mock the client's generate_response method to return a fixed response
    mock_instance = mock_anthropic_client.return_value
    mock_instance.generate_response.return_value = (
        "- Achieve 10,000 daily active users within the first six months of launch\n"
        "- Generate $50,000 in monthly recurring revenue through premium subscriptions by Q4 2023\n"
        "- Maintain a user retention rate of at least 70% after 30 days"
    )
    
    # Create a test request
    request = BusinessGoalsEnhanceRequest(
        project_description="A fitness tracking app for tracking workouts and nutrition",
        user_goals=["Make money", "Get users", "Keep users"]
    )
    
    # Mock the firebase authentication
    with patch("app.core.firebase_auth.get_current_user", return_value={"uid": "test-user"}):
        # Make the request
        response = test_client.post(
            "/api/ai-text/enhance-business-goals",
            json=request.dict()
        )
    
    # Check the response
    assert response.status_code == 200
    response_data = response.json()
    assert "enhanced_goals" in response_data
    
    # Check that the response contains the expected goals
    enhanced_goals = response_data["enhanced_goals"]
    assert len(enhanced_goals) == 3
    assert "Achieve 10,000 daily active users within the first six months of launch" in enhanced_goals
    assert "Generate $50,000 in monthly recurring revenue through premium subscriptions by Q4 2023" in enhanced_goals
    assert "Maintain a user retention rate of at least 70% after 30 days" in enhanced_goals
    
    # Verify the mock was called with the correct parameters
    mock_instance.generate_response.assert_called_once()
    args, kwargs = mock_instance.generate_response.call_args
    assert len(args[0]) == 1  # Should have one message
    assert args[0][0]["role"] == "user"
    assert "Project description: A fitness tracking app" in args[0][0]["content"]
    assert "Original business goals:" in args[0][0]["content"]
    assert "- Make money" in args[0][0]["content"]
    assert "business analyst" in kwargs["system"]
    assert "SMART" in kwargs["system"]


@patch("app.services.ai_service.AnthropicClient")
def test_enhance_business_goals_without_existing_goals(mock_anthropic_client, test_client):
    """Test the enhance business goals endpoint without any existing goals."""
    # Mock the client's generate_response method to return a fixed response
    mock_instance = mock_anthropic_client.return_value
    mock_instance.generate_response.return_value = (
        "- Achieve 10,000 daily active users within the first six months of launch\n"
        "- Generate $50,000 in monthly recurring revenue through premium subscriptions by Q4 2023\n"
        "- Maintain a user retention rate of at least 70% after 30 days"
    )
    
    # Create a test request with empty goals list
    request = BusinessGoalsEnhanceRequest(
        project_description="A fitness tracking app for tracking workouts and nutrition",
        user_goals=[]
    )
    
    # Mock the firebase authentication
    with patch("app.core.firebase_auth.get_current_user", return_value={"uid": "test-user"}):
        # Make the request
        response = test_client.post(
            "/api/ai-text/enhance-business-goals",
            json=request.dict()
        )
    
    # Check the response
    assert response.status_code == 200
    response_data = response.json()
    assert "enhanced_goals" in response_data
    
    # Check that the response contains the expected goals
    enhanced_goals = response_data["enhanced_goals"]
    assert len(enhanced_goals) == 3
    
    # Verify the mock was called with the correct parameters
    mock_instance.generate_response.assert_called_once()
    args, kwargs = mock_instance.generate_response.call_args
    
    # Check that the user message only contains the project description
    assert len(args[0]) == 1
    assert args[0][0]["role"] == "user"
    assert "Project description: A fitness tracking app" in args[0][0]["content"]
    assert "Original business goals:" not in args[0][0]["content"]
    
    # Check that the system prompt includes instructions for generating goals
    assert "business analyst" in kwargs["system"]
    assert "Create 3-5 focused, actionable business goals" in kwargs["system"]
    assert "SMART" in kwargs["system"]


@patch("app.services.ai_service.AnthropicClient")
def test_enhance_requirements(mock_anthropic_client, test_client):
    """Test the enhance requirements endpoint with existing requirements."""
    # Mock the client's generate_response method to return a fixed response
    mock_instance = mock_anthropic_client.return_value
    mock_instance.generate_response.return_value = (
        "[Functional] The system shall allow users to log their workouts including exercise type, duration, and intensity.\n"
        "[Functional] The system shall provide a calendar view of past workouts.\n"
        "[Non-Functional] The system shall load workout data within 2 seconds of request."
    )
    
    # Create a test request
    request = RequirementsEnhanceRequest(
        project_description="A fitness tracking app for tracking workouts and nutrition",
        business_goals=["Increase user engagement", "Generate revenue through premium subscriptions"],
        user_requirements=["Track workouts", "See workout history", "Fast performance"]
    )
    
    # Mock the firebase authentication
    with patch("app.core.firebase_auth.get_current_user", return_value={"uid": "test-user"}):
        # Make the request
        response = test_client.post(
            "/api/ai-text/enhance-requirements",
            json=request.dict()
        )
    
    # Check the response
    assert response.status_code == 200
    response_data = response.json()
    assert "enhanced_requirements" in response_data
    
    # Check that the response contains the expected requirements
    enhanced_requirements = response_data["enhanced_requirements"]
    assert len(enhanced_requirements) == 3
    
    # Verify category prefixes are preserved
    functional_reqs = [req for req in enhanced_requirements if req.startswith("[Functional]")]
    non_functional_reqs = [req for req in enhanced_requirements if req.startswith("[Non-Functional]")]
    
    assert len(functional_reqs) == 2
    assert len(non_functional_reqs) == 1
    assert any("users to log their workouts" in req for req in functional_reqs)
    assert any("calendar view" in req for req in functional_reqs)
    assert any("2 seconds" in req for req in non_functional_reqs)
    
    # Verify the mock was called with the correct parameters
    mock_instance.generate_response.assert_called_once()
    args, kwargs = mock_instance.generate_response.call_args
    assert len(args[0]) == 1  # Should have one message
    assert args[0][0]["role"] == "user"
    assert "Project description: A fitness tracking app" in args[0][0]["content"]
    assert "Business goals:" in args[0][0]["content"]
    assert "Original requirements:" in args[0][0]["content"]
    assert "requirements analyst" in kwargs["system"]


@patch("app.services.ai_service.AnthropicClient")
def test_enhance_requirements_empty_requirements(mock_anthropic_client, test_client):
    """Test the enhance requirements endpoint with no existing requirements."""
    # Mock the client's generate_response method to return a fixed response
    mock_instance = mock_anthropic_client.return_value
    mock_instance.generate_response.return_value = (
        "[Functional] The system shall allow users to log their workouts including exercise type, duration, and intensity.\n"
        "[Functional] The system shall provide a calendar view of past workouts.\n"
        "[Non-Functional] The system shall load workout data within 2 seconds of request."
    )
    
    # Create a test request with empty requirements
    request = RequirementsEnhanceRequest(
        project_description="A fitness tracking app for tracking workouts and nutrition",
        business_goals=["Increase user engagement", "Generate revenue through premium subscriptions"],
        user_requirements=[]
    )
    
    # Mock the firebase authentication
    with patch("app.core.firebase_auth.get_current_user", return_value={"uid": "test-user"}):
        # Make the request
        response = test_client.post(
            "/api/ai-text/enhance-requirements",
            json=request.dict()
        )
    
    # Check the response
    assert response.status_code == 200
    response_data = response.json()
    assert "enhanced_requirements" in response_data
    
    # Check that we got some requirements back
    enhanced_requirements = response_data["enhanced_requirements"]
    assert len(enhanced_requirements) > 0
    
    # Verify the mock was called with the correct parameters
    mock_instance.generate_response.assert_called_once()
    args, kwargs = mock_instance.generate_response.call_args
    assert len(args[0]) == 1
    assert "Project description" in args[0][0]["content"]
    assert "Business goals" in args[0][0]["content"]
    assert "Original requirements:" in args[0][0]["content"] 