"""
Schemas for project sections that will be stored as separate documents in MongoDB.
This approach allows for partial updates to specific sections of a project.
"""

from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
import uuid

from .project import TimelineItem, BudgetItem, Requirement
from .shared_schemas import (
    TechStackData, Features, Pages, DataModel, Api, 
    Testing, ProjectStructure, Deployment, Documentation
)


class ProjectSection(BaseModel):
    """Base model for a project section stored separately in MongoDB."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    version: int = 1
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class TimelineSection(ProjectSection):
    """Timeline section of a project."""
    items: Dict[str, TimelineItem] = Field(default_factory=dict)


class BudgetSection(ProjectSection):
    """Budget section of a project."""
    items: Dict[str, BudgetItem] = Field(default_factory=dict)


class RequirementsSection(ProjectSection):
    """Requirements section of a project."""
    functional: List[Requirement] = Field(default_factory=list)
    non_functional: List[Requirement] = Field(default_factory=list)


class MetadataSection(ProjectSection):
    """Metadata section of a project."""
    data: Dict[str, Any] = Field(default_factory=dict)


# DTO models for section updates

class TimelineSectionUpdate(BaseModel):
    """Model for updating timeline section."""
    items: Optional[Dict[str, TimelineItem]] = None
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class BudgetSectionUpdate(BaseModel):
    """Model for updating budget section."""
    items: Optional[Dict[str, BudgetItem]] = None
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class RequirementsSectionUpdate(BaseModel):
    """Model for updating requirements section."""
    functional: Optional[List[Requirement]] = None
    non_functional: Optional[List[Requirement]] = None
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class MetadataSectionUpdate(BaseModel):
    """Model for updating metadata section."""
    data: Optional[Dict[str, Any]] = None
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


# Core architecture sections derived from template data

class TechStackSection(ProjectSection):
    """Tech stack section of a project."""
    data: TechStackData = Field(default_factory=dict)


class FeaturesSection(ProjectSection):
    """Features section of a project."""
    data: Features = Field(default_factory=dict)


class PagesSection(ProjectSection):
    """Pages section of a project."""
    data: Pages = Field(default_factory=dict)


class DataModelSection(ProjectSection):
    """Data model section of a project."""
    data: DataModel = Field(default_factory=dict)


class ApiSection(ProjectSection):
    """API section of a project."""
    data: Api = Field(default_factory=dict)


class TestingSection(ProjectSection):
    """Testing section of a project."""
    data: Testing = Field(default_factory=dict)


class ProjectStructureSection(ProjectSection):
    """Project structure section of a project."""
    data: ProjectStructure = Field(default_factory=dict)


class DeploymentSection(ProjectSection):
    """Deployment section of a project."""
    data: Deployment = Field(default_factory=dict)


class DocumentationSection(ProjectSection):
    """Documentation section of a project."""
    data: Documentation = Field(default_factory=dict)


# Update DTOs for core architecture sections

class TechStackSectionUpdate(BaseModel):
    """Model for updating tech stack section."""
    data: Optional[TechStackData] = None
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class FeaturesSectionUpdate(BaseModel):
    """Model for updating features section."""
    data: Optional[Features] = None
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class PagesSectionUpdate(BaseModel):
    """Model for updating pages section."""
    data: Optional[Pages] = None
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class DataModelSectionUpdate(BaseModel):
    """Model for updating data model section."""
    data: Optional[DataModel] = None
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class ApiSectionUpdate(BaseModel):
    """Model for updating API section."""
    data: Optional[Api] = None
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class TestingSectionUpdate(BaseModel):
    """Model for updating testing section."""
    data: Optional[Testing] = None
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class ProjectStructureSectionUpdate(BaseModel):
    """Model for updating project structure section."""
    data: Optional[ProjectStructure] = None
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class DeploymentSectionUpdate(BaseModel):
    """Model for updating deployment section."""
    data: Optional[Deployment] = None
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class DocumentationSectionUpdate(BaseModel):
    """Model for updating documentation section."""
    data: Optional[Documentation] = None
    last_modified_by: Optional[str] = None

    class Config:
        allow_population_by_field_name = True 