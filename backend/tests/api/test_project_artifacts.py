"""Tests for generating artifacts from projects.

This module contains tests for generating artifacts from project specs.
"""

import pytest
import pytest_asyncio
from unittest.mock import patch, AsyncMock, MagicMock
from fastapi.testclient import TestClient
from asgi_lifespan import LifespanManager
import asyncio

from app.main import app
from app.services.generator_service import GeneratorService
from app.dependencies.services import get_artifact_service

# Mock authorization header
TEST_AUTH_HEADER = "Bearer test-token"

# Mock project ID
MOCK_PROJECT_ID = "test-project-123"

# Mock project data
MOCK_PROJECT = {
    "_id": MOCK_PROJECT_ID,
    "id": MOCK_PROJECT_ID,
    "name": "Test Project",
    "description": "A test project",
    "user_id": "test-user-123",
    "business_goals": "Build amazing software,Improve efficiency",
    "target_users": "Developers,Designers"
}

# Mock spec data
MOCK_TECH_STACK_SPEC = {
    "_id": "tech-stack-123",
    "project_id": MOCK_PROJECT_ID,
    "data": {
        "frontend": {
            "framework": "React",
            "language": "TypeScript",
            "uiLibrary": "Material UI"
        },
        "backend": {
            "type": "framework",
            "framework": "FastAPI",
            "language": "Python"
        },
        "database": {
            "type": "sql",
            "system": "PostgreSQL",
            "hosting": "AWS RDS"
        }
    }
}

MOCK_REQUIREMENTS_SPEC = {
    "_id": "requirements-123",
    "project_id": MOCK_PROJECT_ID,
    "functional": [
        "User authentication",
        "Project management",
        "Artifact generation"
    ],
    "non_functional": [
        "High performance",
        "Scalability"
    ]
}

MOCK_DATA_MODEL_SPEC = {
    "_id": "data-model-123",
    "project_id": MOCK_PROJECT_ID,
    "data": {
        "entities": [
            {
                "name": "User",
                "description": "User account",
                "fields": [
                    {
                        "name": "id",
                        "type": "uuid",
                        "required": True
                    },
                    {
                        "name": "email",
                        "type": "string",
                        "required": True
                    }
                ]
            }
        ],
        "relationships": [
            {
                "type": "one-to-many",
                "from_entity": "User",
                "to_entity": "Project",
                "field": "user_id"
            }
        ]
    }
}

# Mock artifacts returned by the generator service
MOCK_ARTIFACTS = [
    {
        "id": "artifact-1",
        "project_id": MOCK_PROJECT_ID,
        "type": "document",
        "format": "markdown",
        "content": "# Project Overview",
        "name": "Project Overview",
        "spec": "project"
    },
    {
        "id": "artifact-2",
        "project_id": MOCK_PROJECT_ID,
        "type": "schema",
        "format": "json",
        "content": "{}",
        "name": "Data Model Schema",
        "spec": "data_model"
    }
]


@pytest_asyncio.fixture
async def mock_db():
    """Create a mock database."""
    db = AsyncMock()
    
    # Configure collections
    db.projects = AsyncMock()
    db.projects.find_one = AsyncMock(return_value=MOCK_PROJECT)
    
    db.tech_stack_specs = AsyncMock()
    db.tech_stack_specs.find_one = AsyncMock(return_value=MOCK_TECH_STACK_SPEC)
    
    db.requirements_specs = AsyncMock()
    db.requirements_specs.find_one = AsyncMock(return_value=MOCK_REQUIREMENTS_SPEC)
    
    db.data_model_specs = AsyncMock()
    db.data_model_specs.find_one = AsyncMock(return_value=MOCK_DATA_MODEL_SPEC)
    
    # Other specs can be None
    for spec in [
        "api_specs", "documentation_specs", "features_specs",
        "testing_specs", "project_structure_specs"
    ]:
        setattr(db, spec, AsyncMock())
        getattr(db, spec).find_one = AsyncMock(return_value=None)
    
    # Configure artifacts collection
    db.artifacts = AsyncMock()
    find_mock = AsyncMock()
    to_list_mock = AsyncMock(return_value=MOCK_ARTIFACTS)
    find_mock.to_list = to_list_mock
    db.artifacts.find = AsyncMock(return_value=find_mock)
    db.artifacts.insert_one = AsyncMock()
    
    return db


@pytest_asyncio.fixture
async def mock_current_user():
    """Create a mock authenticated user."""
    return {"_id": "test-user-123"}


@pytest_asyncio.fixture
async def mock_generator_service():
    """Create a mock generator service."""
    service = AsyncMock(spec=GeneratorService)
    service.generate_artifacts_from_project_specs = AsyncMock(return_value=MOCK_ARTIFACTS)
    return service


@pytest_asyncio.fixture
async def mock_get_db(mock_db):
    """Patch the get_db dependency."""
    with patch("app.api.routes.artifacts.get_db", return_value=mock_db):
        yield mock_db


@pytest_asyncio.fixture
async def mock_get_current_user(mock_current_user):
    """Patch the get_current_user dependency."""
    with patch("app.api.routes.artifacts.get_current_user", return_value=mock_current_user):
        yield mock_current_user


@pytest_asyncio.fixture
async def mock_get_token():
    """Patch the _get_token_from_header function to return a test token."""
    with patch("app.core.firebase_auth._get_token_from_header", return_value="test-token"):
        yield


@pytest_asyncio.fixture
async def mock_authenticate_token(mock_current_user):
    """Patch the FirebaseAuth.authenticate_token method."""
    with patch("app.core.firebase_auth.FirebaseAuth.authenticate_token") as mock:
        mock.return_value = {
            "firebase_user": {"uid": "test-uid", "email": "test@example.com"},
            "db_user": mock_current_user
        }
        yield mock


@pytest_asyncio.fixture
async def mock_artifact_service(mock_generator_service):
    """Create a mock artifact service with the mock generator service."""
    service = AsyncMock()
    service.generator_service = mock_generator_service
    service.generate_artifacts_from_project_specs = mock_generator_service.generate_artifacts_from_project_specs
    return service


@pytest_asyncio.fixture
async def mock_get_artifact_service(mock_artifact_service):
    """Patch the get_artifact_service dependency."""
    with patch(
        "app.api.routes.artifacts.get_artifact_service",
        return_value=mock_artifact_service
    ):
        yield mock_artifact_service


@pytest_asyncio.fixture
async def client():
    """Create a test client that closes properly."""
    async with LifespanManager(app):
        yield TestClient(app)


@pytest.mark.asyncio
async def test_generate_artifacts_for_project(
    client, mock_get_db, mock_get_current_user, mock_get_artifact_service, 
    mock_get_token, mock_authenticate_token
):
    """Test generating artifacts for a project."""
    # When we make a request to generate artifacts for a project
    response = client.post(
        f"/api/artifacts/projects/{MOCK_PROJECT_ID}/generate",
        headers={"Authorization": TEST_AUTH_HEADER}
    )
    
    # Then the response should be successful
    assert response.status_code == 200, f"Response: {response.text}"
    
    # And it should return the generated artifacts
    assert response.json() == MOCK_ARTIFACTS
    
    # And the generator service should have been called with the project specs
    mock_get_artifact_service.generator_service.generate_artifacts_from_project_specs.assert_called_once()
    
    # Check that the artifacts were stored in the database
    assert mock_get_db.artifacts.insert_one.call_count == len(MOCK_ARTIFACTS)


@pytest.mark.asyncio
async def test_get_artifacts_by_project(
    client, mock_get_db, mock_get_current_user, mock_get_token, mock_authenticate_token
):
    """Test getting artifacts for a project."""
    # When we make a request to get artifacts for a project
    response = client.get(
        f"/api/artifacts/projects/{MOCK_PROJECT_ID}",
        headers={"Authorization": TEST_AUTH_HEADER}
    )
    
    # Then the response should be successful
    assert response.status_code == 200, f"Response: {response.text}"
    
    # And it should return the artifacts
    assert response.json() == MOCK_ARTIFACTS
    
    # And the database should have been queried for artifacts
    mock_get_db.artifacts.find.assert_called_once()


@pytest.mark.asyncio
async def test_project_not_found(
    client, mock_get_db, mock_get_current_user, mock_get_token, mock_authenticate_token
):
    """Test handling when a project is not found."""
    # Given a non-existent project
    mock_get_db.projects.find_one = AsyncMock(return_value=None)
    
    # When we make a request to generate artifacts
    response = client.post(
        f"/api/artifacts/projects/non-existent-project/generate",
        headers={"Authorization": TEST_AUTH_HEADER}
    )
    
    # Then the response should be a 404 error
    assert response.status_code == 404, f"Response: {response.text}"
    assert "Project not found" in response.json()["detail"] 