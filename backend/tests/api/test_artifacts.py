"""Tests for the artifacts API routes.

This module contains tests for the artifacts API routes.
"""

import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

from app.main import app
from app.services.artifact_service import ArtifactService
from app.dependencies.services import get_artifact_service

client = TestClient(app)

# Mock artifact data
MOCK_PROJECT_ID = "test-project-123"
MOCK_ARTIFACT_ID = "test-artifact-123"
MOCK_ARTIFACT = {
    "id": MOCK_ARTIFACT_ID,
    "project_id": MOCK_PROJECT_ID,
    "type": "document",
    "format": "markdown",
    "content": "# Test Document",
    "name": "Test Document",
    "spec": "test",
    "description": "A test document"
}
MOCK_ARTIFACT_CONTENT = b"# Test Document"
MOCK_CONTENT_TYPE = "text/markdown"


@pytest.fixture
def mock_artifact_service():
    """Create a mock artifact service for testing."""
    mock_service = AsyncMock(spec=ArtifactService)
    
    # Configure mock methods
    mock_service.generate_artifacts.return_value = [MOCK_ARTIFACT]
    mock_service.get_artifacts_by_specification.return_value = [MOCK_ARTIFACT]
    mock_service.get_artifact.return_value = (MOCK_ARTIFACT_CONTENT, MOCK_CONTENT_TYPE)
    mock_service.generate_artifact.return_value = MOCK_ARTIFACT
    mock_service.delete_artifact.return_value = None
    
    return mock_service


@pytest.fixture
def patch_get_artifact_service(mock_artifact_service):
    """Patch the get_artifact_service dependency."""
    with patch(
        "app.api.routes.artifacts.get_artifact_service",
        return_value=mock_artifact_service
    ):
        yield mock_artifact_service


def test_generate_artifacts(patch_get_artifact_service):
    """Test generating artifacts for a specification."""
    # When we make a request to generate artifacts
    response = client.post(f"/api/artifacts/{MOCK_PROJECT_ID}/generate")
    
    # Then the response should be successful
    assert response.status_code == 200
    
    # And it should return the generated artifacts
    assert response.json() == [MOCK_ARTIFACT]
    
    # And the service should have been called with the specification
    spec_arg = patch_get_artifact_service.generate_artifacts.call_args[0][0]
    assert spec_arg["id"] == MOCK_PROJECT_ID


def test_get_artifacts_by_specification(patch_get_artifact_service):
    """Test getting artifacts for a specification."""
    # When we make a request to get artifacts
    response = client.get(f"/api/artifacts/{MOCK_PROJECT_ID}")
    
    # Then the response should be successful
    assert response.status_code == 200
    
    # And it should return the artifacts
    assert response.json() == [MOCK_ARTIFACT]
    
    # And the service should have been called with the specification ID
    patch_get_artifact_service.get_artifacts_by_specification.assert_called_once_with(
        MOCK_PROJECT_ID
    )


def test_get_artifact(patch_get_artifact_service):
    """Test getting an artifact by ID."""
    # When we make a request to get an artifact
    response = client.get(f"/api/artifacts/item/{MOCK_ARTIFACT_ID}")
    
    # Then the response should be successful
    assert response.status_code == 200
    
    # And it should return the artifact content with the correct content type
    assert response.content == MOCK_ARTIFACT_CONTENT
    assert response.headers["content-type"] == MOCK_CONTENT_TYPE
    
    # And the service should have been called with the artifact ID
    patch_get_artifact_service.get_artifact.assert_called_once_with(MOCK_ARTIFACT_ID)


def test_generate_artifact(patch_get_artifact_service):
    """Test generating a specific artifact."""
    # When we make a request to generate an artifact
    request_body = {
        "project_id": MOCK_PROJECT_ID,
        "spec": "architecture",
        "type": "diagram",
        "name": "System Architecture"
    }
    response = client.post("/api/artifacts/generate", json=request_body)
    
    # Then the response should be successful
    assert response.status_code == 200
    
    # And it should return the generated artifact
    assert response.json() == MOCK_ARTIFACT
    
    # And the service should have been called with the correct arguments
    patch_get_artifact_service.generate_artifact.assert_called_once_with(
        project_id=MOCK_PROJECT_ID,
        spec="architecture",
        artifact_type="diagram",
        name="System Architecture",
        options=None
    )


def test_delete_artifact(patch_get_artifact_service):
    """Test deleting an artifact."""
    # When we make a request to delete an artifact
    response = client.delete(f"/api/artifacts/{MOCK_ARTIFACT_ID}")
    
    # Then the response should be successful
    assert response.status_code == 200
    
    # And it should return a success message
    assert "deleted successfully" in response.json()["message"]
    
    # And the service should have been called with the artifact ID
    patch_get_artifact_service.delete_artifact.assert_called_once_with(MOCK_ARTIFACT_ID) 