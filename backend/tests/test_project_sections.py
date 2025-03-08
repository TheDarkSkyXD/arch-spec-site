"""
Tests for the project sections API endpoints.
"""
import pytest
import json
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.main import app
from app.schemas.project_sections import (
    TimelineSection,
    BudgetSection,
    RequirementsSection,
    MetadataSection
)
from app.db.base import Database


# Test client setup
client = TestClient(app)

# Mock database for testing
test_db = None


# Set up test database
@pytest.fixture(autouse=True)
async def setup_test_db():
    """Set up a test database for each test."""
    global test_db
    
    # Create an in-memory MongoDB for testing
    mongo_client = AsyncIOMotorClient("mongodb://localhost:27017")
    test_db = mongo_client["archspec_test"]
    
    # Clear all collections
    collections = await test_db.list_collection_names()
    for collection in collections:
        await test_db[collection].drop()
    
    # Create a test project
    project_id = "test-project-id"
    test_project = {
        "id": project_id,
        "name": "Test Project",
        "description": "A project for testing",
        "template_type": "web_app",
        "status": "draft",
        "business_goals": ["Testing"],
        "target_users": ["Developers"],
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "has_timeline": False,
        "has_budget": False,
        "has_requirements": False,
        "has_metadata": False,
        "team_members": [],
        "template_data": {
            "id": "test-template",
            "name": "Test Template",
            "description": "A template for testing",
            "template_type": "web_app",
            "project_defaults": {
                "name": "Default Name",
                "description": "Default Description",
                "business_goals": [],
                "target_users": []
            }
        },
        "version": 1,
        "revision_history": []
    }
    
    # Insert test project
    await test_db.projects.insert_one(test_project)
    
    # Mock the database dependency
    async def override_get_db():
        return test_db
    
    # Patching the get_db dependency
    app.dependency_overrides = {
        Database.get_db: override_get_db
    }
    
    yield
    
    # Cleanup after test
    app.dependency_overrides = {}
    mongo_client.close()


# Timeline section tests
def test_create_timeline_section():
    """Test creating a timeline section."""
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
    
    response = client.put(f"/api/projects/{project_id}/timeline", json=timeline_data)
    assert response.status_code == 200
    
    # Verify the section was created
    section_data = response.json()
    assert section_data["project_id"] == project_id
    assert len(section_data["items"]) == 2
    assert section_data["items"]["milestone1"]["milestone"] == "Project Start"
    
    # Verify the project was updated
    response = client.get(f"/api/projects/{project_id}")
    assert response.status_code == 200
    project_data = response.json()
    assert project_data["has_timeline"] is True


# Budget section tests
def test_create_budget_section():
    """Test creating a budget section."""
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
    
    response = client.put(f"/api/projects/{project_id}/budget", json=budget_data)
    assert response.status_code == 200
    
    # Verify the section was created
    section_data = response.json()
    assert section_data["project_id"] == project_id
    assert len(section_data["items"]) == 2
    assert section_data["items"]["item1"]["category"] == "Development"
    
    # Verify the project was updated
    response = client.get(f"/api/projects/{project_id}")
    assert response.status_code == 200
    project_data = response.json()
    assert project_data["has_budget"] is True


# Requirements section tests
def test_create_requirements_section():
    """Test creating a requirements section."""
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
    
    response = client.put(f"/api/projects/{project_id}/requirements", json=requirements_data)
    assert response.status_code == 200
    
    # Verify the section was created
    section_data = response.json()
    assert section_data["project_id"] == project_id
    assert len(section_data["functional"]) == 1
    assert len(section_data["non_functional"]) == 1
    assert section_data["functional"][0]["description"] == "User login"
    
    # Verify the project was updated
    response = client.get(f"/api/projects/{project_id}")
    assert response.status_code == 200
    project_data = response.json()
    assert project_data["has_requirements"] is True


# Metadata section tests
def test_create_metadata_section():
    """Test creating a metadata section."""
    project_id = "test-project-id"
    metadata_data = {
        "data": {
            "team_size": 5,
            "priority": "high",
            "estimated_cost": 150000,
            "tags": ["web", "mobile", "cloud"]
        }
    }
    
    response = client.put(f"/api/projects/{project_id}/metadata", json=metadata_data)
    assert response.status_code == 200
    
    # Verify the section was created
    section_data = response.json()
    assert section_data["project_id"] == project_id
    assert section_data["data"]["team_size"] == 5
    assert section_data["data"]["tags"] == ["web", "mobile", "cloud"]
    
    # Verify the project was updated
    response = client.get(f"/api/projects/{project_id}")
    assert response.status_code == 200
    project_data = response.json()
    assert project_data["has_metadata"] is True


# End-to-end test for project with all sections
def test_full_project_with_sections():
    """Test creating and retrieving a project with all sections."""
    # Create a new project
    project_data = {
        "name": "Complete Project",
        "description": "Project with all sections",
        "template_type": "web_app",
        "business_goals": ["Business Value"],
        "target_users": ["End Users"]
    }
    
    # Create project
    response = client.post("/api/projects", json=project_data)
    assert response.status_code == 200
    project = response.json()
    project_id = project["id"]
    
    # Add timeline section
    timeline_data = {
        "items": {
            "milestone1": {
                "date": "2023-03-01",
                "milestone": "Project Kickoff",
                "description": "Starting the project"
            }
        }
    }
    response = client.put(f"/api/projects/{project_id}/timeline", json=timeline_data)
    assert response.status_code == 200
    
    # Add budget section
    budget_data = {
        "items": {
            "budget1": {
                "category": "Marketing",
                "amount": 20000.0,
                "notes": "Marketing budget"
            }
        }
    }
    response = client.put(f"/api/projects/{project_id}/budget", json=budget_data)
    assert response.status_code == 200
    
    # Add requirements section
    requirements_data = {
        "functional": [
            {
                "description": "User registration",
                "priority": "critical",
                "status": "approved"
            }
        ],
        "non_functional": [
            {
                "description": "Page load time under 2 seconds",
                "priority": "high",
                "status": "approved"
            }
        ]
    }
    response = client.put(f"/api/projects/{project_id}/requirements", json=requirements_data)
    assert response.status_code == 200
    
    # Add metadata section
    metadata_data = {
        "data": {
            "complexity": "medium",
            "estimated_duration": "6 months"
        }
    }
    response = client.put(f"/api/projects/{project_id}/metadata", json=metadata_data)
    assert response.status_code == 200
    
    # Retrieve the full project
    response = client.get(f"/api/projects/{project_id}")
    assert response.status_code == 200
    
    # Check that all sections are included
    full_project = response.json()
    assert full_project["has_timeline"] is True
    assert full_project["has_budget"] is True
    assert full_project["has_requirements"] is True
    assert full_project["has_metadata"] is True
    
    # Verify section contents
    assert full_project["timeline"]["milestone1"]["milestone"] == "Project Kickoff"
    assert full_project["budget"]["budget1"]["category"] == "Marketing"
    assert any(req["description"] == "User registration" for req in full_project["functional_requirements"])
    assert any(req["description"] == "Page load time under 2 seconds" for req in full_project["non_functional_requirements"])
    assert full_project["metadata"]["complexity"] == "medium" 