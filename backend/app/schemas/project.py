from datetime import datetime
from typing import Dict, Optional, List, Any, Union, ClassVar
from pydantic import BaseModel, Field
import uuid

from .templates import ProjectTemplate, ProjectDefaults


class Requirement(BaseModel):
    """Model for a project requirement."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    description: str
    priority: str = "medium"  # low, medium, high, critical
    status: str = "proposed"  # proposed, approved, implemented, verified, deferred
    category: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    
    class Config:
        allow_population_by_field_name = True


class ProjectBase(BaseModel):
    """Base model for Project data."""
    name: str
    description: str
    template_type: str = "web_app"
    business_goals: List[str] = Field(default_factory=list)
    target_users: List[str] = Field(default_factory=list)
    domain: Optional[str] = None  # Business domain (e.g., "healthcare", "finance")
    organization: Optional[str] = None  # Organization name
    project_lead: Optional[str] = None  # Project lead name or ID
    timeline: Optional[Dict[str, Any]] = None  # Project timeline information
    budget: Optional[Dict[str, Any]] = None  # Budget information
    functional_requirements: List[Requirement] = Field(default_factory=list)
    non_functional_requirements: List[Requirement] = Field(default_factory=list)
    
    class Config:
        allow_population_by_field_name = True


class ProjectCreate(ProjectBase):
    """Model for creating a new Project."""
    template_id: Optional[str] = None  # ID of the template to use as a base
    template_data: Optional[ProjectTemplate] = None  # Template data if not using an existing template


class ProjectUpdate(BaseModel):
    """Model for updating an existing Project."""
    name: Optional[str] = None
    description: Optional[str] = None
    template_type: Optional[str] = None
    status: Optional[str] = None
    business_goals: Optional[List[str]] = None
    target_users: Optional[List[str]] = None
    domain: Optional[str] = None
    organization: Optional[str] = None
    project_lead: Optional[str] = None
    timeline: Optional[Dict[str, Any]] = None
    budget: Optional[Dict[str, Any]] = None
    functional_requirements: Optional[List[Requirement]] = None
    non_functional_requirements: Optional[List[Requirement]] = None
    metadata: Optional[Dict[str, Any]] = None
    template_data: Optional[Dict[str, Any]] = None  # Allow updating specific parts of the template
    
    class Config:
        allow_population_by_field_name = True


class ProjectInDB(ProjectBase):
    """Model for Project data stored in the database."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "draft"
    team_members: List[str] = Field(default_factory=list)  # List of team member IDs
    metadata: Dict[str, Any] = Field(default_factory=dict)
    template_data: ProjectTemplate  # The complete template data associated with this project
    version: int = 1  # Project version to track changes
    revision_history: List[Dict[str, Any]] = Field(default_factory=list)  # History of changes
    
    @classmethod
    def from_template(cls, template: ProjectTemplate, project_data: ProjectCreate) -> "ProjectInDB":
        """Create a new project from a template and project data."""
        # Initialize project with template defaults
        project_defaults = template.project_defaults
        
        # Create the project with data from the template and provided project data
        project = cls(
            name=project_data.name or project_defaults.name,
            description=project_data.description or project_defaults.description,
            template_type=project_data.template_type,
            business_goals=project_data.business_goals or project_defaults.business_goals,
            target_users=project_data.target_users or project_defaults.target_users,
            domain=project_data.domain,
            organization=project_data.organization,
            project_lead=project_data.project_lead,
            timeline=project_data.timeline,
            budget=project_data.budget,
            functional_requirements=project_data.functional_requirements or [],
            non_functional_requirements=project_data.non_functional_requirements or [],
            template_data=template,
        )
        
        return project


class Project(ProjectInDB):
    """Model for Project data returned to clients."""
    pass


class ProjectResponse(BaseModel):
    """Response model for Project data."""
    id: str
    name: str
    description: str
    status: str
    template_type: str
    business_goals: List[str]
    target_users: List[str]
    domain: Optional[str] = None
    organization: Optional[str] = None
    project_lead: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    functional_requirements: List[Requirement] = Field(default_factory=list)
    non_functional_requirements: List[Requirement] = Field(default_factory=list)
    
    class Config:
        allow_population_by_field_name = True


class ProjectDetailResponse(ProjectResponse):
    """Detailed response model for Project data including template data."""
    template_data: ProjectTemplate
    team_members: List[str]
    metadata: Dict[str, Any]
    version: int
    timeline: Optional[Dict[str, Any]] = None
    budget: Optional[Dict[str, Any]] = None 