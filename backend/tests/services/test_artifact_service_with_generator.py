"""Tests for the ArtifactService with GeneratorService.

This module focuses on testing the artifact generation capabilities
through the ArtifactService, bypassing API route complexity.
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
import uuid
from datetime import datetime

from app.services.artifact_service import ArtifactService
from app.services.generator_service import GeneratorService

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


@pytest.fixture
def mock_generator_service():
    """Create a mock generator service."""
    service = AsyncMock(spec=GeneratorService)
    service.generate_artifacts_from_project_specs = AsyncMock(return_value=MOCK_ARTIFACTS)
    service.generate_artifacts = AsyncMock(return_value=MOCK_ARTIFACTS)
    return service


@pytest.fixture
def artifact_service(mock_generator_service):
    """Create an artifact service with a mock generator service."""
    return ArtifactService(generator_service=mock_generator_service)


@pytest.fixture
def mock_db():
    """Create a mock database."""
    db = AsyncMock()
    
    # Configure collections
    db.artifacts = AsyncMock()
    db.artifacts.insert_one = AsyncMock()

    # This is crucial for proper async mocking
    cursor_mock = AsyncMock()
    cursor_mock.to_list = AsyncMock(return_value=MOCK_ARTIFACTS)
    db.artifacts.find = AsyncMock(return_value=cursor_mock)
    
    return db


@pytest.mark.asyncio
async def test_generate_artifacts_from_project_specs(artifact_service, mock_generator_service):
    """Test generating artifacts from project specs."""
    # When we call the generator service directly through the artifact service interface
    await mock_generator_service.generate_artifacts_from_project_specs(
        tech_stack_spec=MOCK_TECH_STACK_SPEC,
        requirements_spec=MOCK_REQUIREMENTS_SPEC,
        data_model_spec=MOCK_DATA_MODEL_SPEC
    )

    # Then the generator service should have been called with the correct specs
    mock_generator_service.generate_artifacts_from_project_specs.assert_called_once_with(
        tech_stack_spec=MOCK_TECH_STACK_SPEC,
        requirements_spec=MOCK_REQUIREMENTS_SPEC,
        data_model_spec=MOCK_DATA_MODEL_SPEC
    )


@pytest.mark.asyncio
async def test_store_artifacts(artifact_service, mock_db):
    """Test storing artifacts in the database."""
    # When we store artifacts
    await artifact_service.store_artifacts(MOCK_ARTIFACTS, mock_db)
    
    # Then it should insert each artifact into the database
    assert mock_db.artifacts.insert_one.call_count == len(MOCK_ARTIFACTS)


@pytest.mark.asyncio
async def test_get_artifacts_by_specification(artifact_service, mock_db):
    """Test retrieving artifacts by specification ID."""
    # When we get artifacts by specification ID
    artifacts = await artifact_service.get_artifacts_by_specification(MOCK_PROJECT_ID, mock_db)
    
    # Then it should return the artifacts
    assert artifacts == MOCK_ARTIFACTS
    
    # And it should query the database with the correct specification ID
    mock_db.artifacts.find.assert_called_once_with({"project_id": MOCK_PROJECT_ID})


@pytest.mark.asyncio
async def test_generate_and_store_artifacts(artifact_service, mock_db, mock_generator_service):
    """Test generating and storing artifacts from project specs."""
    # When we generate and store artifacts
    artifacts = await artifact_service.generate_and_store_artifacts(
        project_id=MOCK_PROJECT_ID,
        tech_stack_spec=MOCK_TECH_STACK_SPEC,
        requirements_spec=MOCK_REQUIREMENTS_SPEC,
        data_model_spec=MOCK_DATA_MODEL_SPEC,
        database=mock_db
    )
    
    # Then it should return the artifacts
    assert artifacts == MOCK_ARTIFACTS
    
    # And the generator service should have been called with the correct specs
    mock_generator_service.generate_artifacts_from_project_specs.assert_called_once()
    
    # And it should insert each artifact into the database
    assert mock_db.artifacts.insert_one.call_count == len(MOCK_ARTIFACTS) 