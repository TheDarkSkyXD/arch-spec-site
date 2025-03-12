"""
Simplified tests for the project sections API endpoints using mocks.
"""
import pytest
from unittest.mock import patch, MagicMock, ANY, AsyncMock
from fastapi.testclient import TestClient
from datetime import datetime

from app.main import app
from app.schemas.project_sections import (
    TimelineSection,
    BudgetSection,
    RequirementsSection,
    MetadataSection
)


@pytest.fixture
def client():
    """Create test client."""
    with TestClient(app) as test_client:
        yield test_client


@patch("app.api.routes.project_sections.validate_project_exists")
@patch("app.services.project_sections_service.ProjectSectionsService.create_or_update_timeline_section")
def test_create_timeline_section(mock_create_update, mock_validate, client):
    """Test creating a timeline section with fully mocked dependencies."""
    # Setup mocks
    mock_validate.return_value = {
        "id": "test-project-id",
        "name": "Test Project"
    }
    
    mock_create_update.return_value = {
        "id": "section-1",
        "project_id": "test-project-id",
        "items": {
            "milestone1": {
                "date": "2023-01-01",
                "milestone": "Project Start",
                "description": "Beginning of the project"
            },
            "milestone2": {
                "date": "2023-02-01",
                "milestone": "First Deliverable",
                "description": "Completion of the first deliverable"
            }
        },
        "version": 1
    }
    
    # Test data
    project_id = "test-project-id"
    timeline_data = {
        "items": {
            "milestone1": {
                "date": "2023-01-01",
                "milestone": "Project Start",
                "description": "Beginning of the project"
            },
            "milestone2": {
                "date": "2023-02-01",
                "milestone": "First Deliverable",
                "description": "Completion of the first deliverable"
            }
        }
    }
    
    # Act
    response = client.put(f"/api/projects/{project_id}/timeline", json=timeline_data)
    
    # Assert
    assert response.status_code == 200
    
    # Check mock was called correctly
    mock_validate.assert_called_once_with(project_id, ANY)
    mock_create_update.assert_called_once()
    
    # Verify response structure
    response_data = response.json()
    assert response_data["project_id"] == project_id
    assert len(response_data["items"]) == 2
    assert response_data["items"]["milestone1"]["milestone"] == "Project Start"


@patch("app.api.routes.project_sections.validate_project_exists")
@patch("app.services.project_sections_service.ProjectSectionsService.create_or_update_budget_section")
def test_create_budget_section(mock_create_update, mock_validate, client):
    """Test creating a budget section with fully mocked dependencies."""
    # Setup mocks
    mock_validate.return_value = {
        "id": "test-project-id",
        "name": "Test Project"
    }
    
    mock_create_update.return_value = {
        "id": "section-2",
        "project_id": "test-project-id",
        "items": {
            "item1": {
                "category": "Development",
                "amount": 10000.0,
                "notes": "Developer salaries"
            },
            "item2": {
                "category": "Infrastructure",
                "amount": 5000.0,
                "notes": "Cloud hosting"
            }
        },
        "version": 1
    }
    
    # Test data
    project_id = "test-project-id"
    budget_data = {
        "items": {
            "item1": {
                "category": "Development",
                "amount": 10000.0,
                "notes": "Developer salaries"
            },
            "item2": {
                "category": "Infrastructure",
                "amount": 5000.0,
                "notes": "Cloud hosting"
            }
        }
    }
    
    # Act
    response = client.put(f"/api/projects/{project_id}/budget", json=budget_data)
    
    # Assert
    assert response.status_code == 200
    
    # Check mock was called correctly
    mock_validate.assert_called_once_with(project_id, ANY)
    mock_create_update.assert_called_once()
    
    # Verify response structure
    response_data = response.json()
    assert response_data["project_id"] == project_id
    assert len(response_data["items"]) == 2
    assert response_data["items"]["item1"]["category"] == "Development"
    assert response_data["items"]["item2"]["amount"] == 5000.0


@patch("app.api.routes.project_sections.validate_project_exists")
@patch("app.services.project_sections_service.ProjectSectionsService.create_or_update_requirements_section")
def test_create_requirements_section(mock_create_update, mock_validate, client):
    """Test creating a requirements section with fully mocked dependencies."""
    # Setup mocks
    mock_validate.return_value = {
        "id": "test-project-id",
        "name": "Test Project"
    }
    
    mock_create_update.return_value = {
        "id": "section-3",
        "project_id": "test-project-id",
        "functional": [
            {
                "id": "req1",
                "description": "User login",
                "priority": "high",
                "status": "approved"
            }
        ],
        "non_functional": [
            {
                "id": "req2",
                "description": "System should handle 1000 users concurrently",
                "priority": "medium",
                "status": "proposed" 
            }
        ],
        "version": 1
    }
    
    # Test data
    project_id = "test-project-id"
    requirements_data = {
        "functional": [
            {
                "id": "req1",
                "description": "User login",
                "priority": "high",
                "status": "approved"
            }
        ],
        "non_functional": [
            {
                "id": "req2",
                "description": "System should handle 1000 users concurrently",
                "priority": "medium",
                "status": "proposed"
            }
        ]
    }
    
    # Act
    response = client.put(f"/api/projects/{project_id}/requirements", json=requirements_data)
    
    # Assert
    assert response.status_code == 200
    
    # Check mock was called correctly
    mock_validate.assert_called_once_with(project_id, ANY)
    mock_create_update.assert_called_once()
    
    # Verify response structure
    response_data = response.json()
    assert response_data["project_id"] == project_id
    assert len(response_data["functional"]) == 1
    assert len(response_data["non_functional"]) == 1
    assert response_data["functional"][0]["description"] == "User login"
    assert response_data["non_functional"][0]["description"] == "System should handle 1000 users concurrently"


@patch("app.api.routes.project_sections.validate_project_exists")
@patch("app.services.project_sections_service.ProjectSectionsService.create_or_update_metadata_section")
def test_create_metadata_section(mock_create_update, mock_validate, client):
    """Test creating a metadata section with fully mocked dependencies."""
    # Setup mocks
    mock_validate.return_value = {
        "id": "test-project-id",
        "name": "Test Project"
    }
    
    mock_create_update.return_value = {
        "id": "section-4",
        "project_id": "test-project-id",
        "data": {
            "team_size": 5,
            "priority": "high",
            "estimated_cost": 150000,
            "tags": ["web", "mobile", "cloud"]
        },
        "version": 1
    }
    
    # Test data
    project_id = "test-project-id"
    metadata_data = {
        "data": {
            "team_size": 5,
            "priority": "high",
            "estimated_cost": 150000,
            "tags": ["web", "mobile", "cloud"]
        }
    }
    
    # Act
    response = client.put(f"/api/projects/{project_id}/metadata", json=metadata_data)
    
    # Assert
    assert response.status_code == 200
    
    # Check mock was called correctly
    mock_validate.assert_called_once_with(project_id, ANY)
    mock_create_update.assert_called_once()
    
    # Verify response structure
    response_data = response.json()
    assert response_data["project_id"] == project_id
    assert response_data["data"]["team_size"] == 5
    assert response_data["data"]["priority"] == "high"
    assert response_data["data"]["tags"] == ["web", "mobile", "cloud"]


@patch("app.api.routes.projects.ProjectSectionsService")
@patch("app.db.base.db.get_db")
def test_full_project_with_sections(mock_get_db, mock_sections_service, client):
    """Test retrieving a project with all sections."""
    # Mock the database operations
    new_project_id = "test-full-project-id"
    mock_db = AsyncMock()
    
    # Set up mock responses for all required methods
    mock_db.projects = AsyncMock()
    
    # Mock the project find_one response
    mock_db.projects.find_one = AsyncMock(return_value={
        "id": new_project_id,
        "name": "Complete Project",
        "description": "Project with all sections",
        "template_type": "web_app",
        "status": "draft",
        "business_goals": ["Business Value"],
        "target_users": ["End Users"],
        "has_timeline": True,
        "has_budget": True,
        "has_requirements": True,
        "has_metadata": True,
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z",
        "team_members": [],
        "version": 1,
    })
    
    # Set up the get_db mock to return our mock database
    mock_get_db.return_value = mock_db
    
    # Setup mocks for section retrievals
    timeline_section = TimelineSection(
        id="timeline-id",
        project_id=new_project_id,
        items={
            "milestone1": {
                "date": "2023-03-01",
                "milestone": "Project Kickoff",
                "description": "Starting the project"
            }
        },
        created_at=datetime.now(),
        updated_at=datetime.now(),
        version=1
    )
    
    budget_section = BudgetSection(
        id="budget-id",
        project_id=new_project_id,
        items={
            "budget1": {
                "category": "Marketing",
                "amount": 20000.0,
                "notes": "Marketing budget"
            }
        },
        created_at=datetime.now(),
        updated_at=datetime.now(),
        version=1
    )
    
    requirements_section = RequirementsSection(
        id="requirements-id",
        project_id=new_project_id,
        functional=[
            {
                "id": "func-req-1",
                "description": "User registration",
                "priority": "critical",
                "status": "approved"
            }
        ],
        non_functional=[
            {
                "id": "non-func-req-1",
                "description": "Page load time under 2 seconds",
                "priority": "high",
                "status": "approved"
            }
        ],
        created_at=datetime.now(),
        updated_at=datetime.now(),
        version=1
    )
    
    metadata_section = MetadataSection(
        id="metadata-id",
        project_id=new_project_id,
        data={
            "complexity": "medium",
            "estimated_duration": "6 months"
        },
        created_at=datetime.now(),
        updated_at=datetime.now(),
        version=1
    )
    
    # Set up the mock service methods
    mock_sections_service.get_timeline_section = AsyncMock(return_value=timeline_section)
    mock_sections_service.get_budget_section = AsyncMock(return_value=budget_section)
    mock_sections_service.get_requirements_section = AsyncMock(return_value=requirements_section)
    mock_sections_service.get_metadata_section = AsyncMock(return_value=metadata_section)
    
    # Act - retrieve the project with all sections
    response = client.get(f"/api/projects/{new_project_id}")
    
    # Assert
    assert response.status_code == 200, f"Failed to retrieve project: {response.text}"
    result = response.json()
    
    # Verify the sections were included
    assert result["has_timeline"] is True
    assert result["has_budget"] is True
    assert result["has_requirements"] is True
    assert result["has_metadata"] is True
    
    # Check the timeline section
    assert "timeline" in result
    assert "milestone1" in result["timeline"]
    assert result["timeline"]["milestone1"]["milestone"] == "Project Kickoff"
    
    # Check the budget section
    assert "budget" in result
    assert "budget1" in result["budget"]
    assert result["budget"]["budget1"]["category"] == "Marketing"
    
    # Check the requirements section
    assert "functional" in result
    assert len(result["functional"]) == 1
    assert result["functional"][0]["description"] == "User registration"
    
    assert "non_functional" in result
    assert len(result["non_functional"]) == 1
    assert result["non_functional"][0]["description"] == "Page load time under 2 seconds"
    
    # Check the metadata section
    assert "metadata" in result
    assert result["metadata"]["complexity"] == "medium"
    assert result["metadata"]["estimated_duration"] == "6 months" 