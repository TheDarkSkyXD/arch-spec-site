"""
Schemas for project specs that will be stored as separate documents in MongoDB.
This approach allows for partial updates to specific specs of a project.
"""

from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
import uuid

from .shared_schemas import (
    BudgetItem, ProjectTechStack, Features, Pages, DataModel, Api, Testing, TestCases, ProjectStructure, Deployment, Documentation, TimelineItem
)


class ProjectSpec(BaseModel):
    """Base model for a project spec stored separately in MongoDB."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    version: int = 1
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


class TimelineSpec(ProjectSpec):
    """Timeline spec of a project."""
    items: Dict[str, TimelineItem] = Field(default_factory=dict)


class BudgetSpec(ProjectSpec):
    """Budget spec of a project."""
    items: Dict[str, BudgetItem] = Field(default_factory=dict)


class RequirementsSpec(ProjectSpec):
    """Requirements spec of a project."""
    functional: List[str] = Field(default_factory=list)
    non_functional: List[str] = Field(default_factory=list)


class MetadataSpec(ProjectSpec):
    """Metadata spec of a project."""
    data: Dict[str, Any] = Field(default_factory=dict)


# DTO models for spec updates

class TimelineSpecUpdate(BaseModel):
    """Model for updating timeline spec."""
    items: Optional[Dict[str, TimelineItem]] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


class BudgetSpecUpdate(BaseModel):
    """Model for updating budget spec."""
    items: Optional[Dict[str, BudgetItem]] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


class RequirementsSpecUpdate(BaseModel):
    """Model for updating requirements spec."""
    functional: Optional[List[str]] = None
    non_functional: Optional[List[str]] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


class MetadataSpecUpdate(BaseModel):
    """Model for updating metadata spec."""
    data: Optional[Dict[str, Any]] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


# Core architecture specs derived from template data

class TechStackSpec(ProjectSpec):
    """Tech stack spec of a project."""
    data: Optional[ProjectTechStack] = None


class FeaturesSpec(ProjectSpec):
    """Features spec of a project."""
    data: Optional[Features] = None


class PagesSpec(ProjectSpec):
    """Pages spec of a project."""
    data: Optional[Pages] = None


class DataModelSpec(ProjectSpec):
    """Data model spec of a project."""
    data: Optional[DataModel] = None


class ApiSpec(ProjectSpec):
    """API spec of a project."""
    data: Optional[Api] = None


class TestingSpec(ProjectSpec):
    """Model for the testing spec."""
    data: Testing


class TestCasesSpec(ProjectSpec):
    """Model for the test cases spec using Gherkin format."""
    data: TestCases


class ProjectStructureSpec(ProjectSpec):
    """Model for the project structure spec."""
    data: ProjectStructure


class DeploymentSpec(ProjectSpec):
    """Deployment spec of a project."""
    data: Optional[Deployment] = None


class DocumentationSpec(ProjectSpec):
    """Documentation spec of a project."""
    data: Optional[Documentation] = None


# Update DTOs for core architecture specs

class TechStackSpecUpdate(BaseModel):
    """Model for updating tech stack spec."""
    data: Optional[ProjectTechStack] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


class FeaturesSpecUpdate(BaseModel):
    """Model for updating features spec."""
    data: Optional[Features] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


class PagesSpecUpdate(BaseModel):
    """Model for updating pages spec."""
    data: Optional[Pages] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


class DataModelSpecUpdate(BaseModel):
    """Model for updating data model spec."""
    data: Optional[DataModel] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


class ApiSpecUpdate(BaseModel):
    """Model for updating API spec."""
    data: Optional[Api] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


class TestingSpecUpdate(BaseModel):
    """Model for updating a testing spec."""
    data: Optional[Testing] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


class TestCasesSpecUpdate(BaseModel):
    """Model for updating a test cases spec."""
    data: Optional[TestCases] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


class ProjectStructureSpecUpdate(BaseModel):
    """Model for updating project structure spec."""
    data: Optional[ProjectStructure] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


class DeploymentSpecUpdate(BaseModel):
    """Model for updating deployment spec."""
    data: Optional[Deployment] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True


class DocumentationSpecUpdate(BaseModel):
    """Model for updating documentation spec."""
    data: Optional[Documentation] = None
    last_modified_by: Optional[str] = None

    class Config:
        populate_by_name = True 