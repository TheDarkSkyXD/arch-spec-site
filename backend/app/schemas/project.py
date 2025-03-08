from datetime import datetime
from typing import Dict, Optional, List, Any, Union, ClassVar
from pydantic import BaseModel, Field
import uuid

from .templates import ProjectTemplate, ProjectDefaults
from .shared_schemas import (
    TechStackData, Features, Pages, DataModel, Api, 
    Testing, ProjectStructure, Deployment, Documentation
)


class TimelineItem(BaseModel):
    """Model for a timeline item."""
    date: str
    milestone: str
    description: Optional[str] = None


class BudgetItem(BaseModel):
    """Model for a budget item."""
    category: str
    amount: float
    notes: Optional[str] = None


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
    
    # References to sections stored in separate collections
    # Original basic sections
    has_timeline: bool = False
    has_budget: bool = False
    has_requirements: bool = False
    has_metadata: bool = False
    
    # Architecture sections (previously part of template_data)
    has_tech_stack: bool = False
    has_features: bool = False
    has_pages: bool = False
    has_data_model: bool = False
    has_api: bool = False
    has_testing: bool = False
    has_project_structure: bool = False
    has_deployment: bool = False
    has_documentation: bool = False
    
    # Original template information (kept for reference)
    template_id: Optional[str] = None  # ID of the template used to create this project
    
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
    
    # These fields are kept for backward compatibility with existing APIs
    # In the new sectional approach, these updates should be directed to specific section endpoints
    timeline: Optional[Dict[str, TimelineItem]] = None
    budget: Optional[Dict[str, BudgetItem]] = None
    functional_requirements: Optional[List[Requirement]] = None
    non_functional_requirements: Optional[List[Requirement]] = None
    metadata: Optional[Dict[str, Any]] = None
    
    # Retained for backward compatibility
    template_data: Optional[ProjectTemplate] = None
    
    class Config:
        allow_population_by_field_name = True


class ProjectInDB(ProjectBase):
    """Model for Project data stored in the database."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "draft"
    team_members: List[str] = Field(default_factory=list)  # List of team member IDs
    version: int = 1  # Project version to track changes
    revision_history: List[Dict[str, Any]] = Field(default_factory=list)  # History of changes
    
    @classmethod
    def from_template(cls, template: ProjectTemplate, project_data: ProjectCreate) -> "ProjectInDB":
        """Create a new project from a template and project data."""
        # Initialize project with template defaults
        project_defaults = template.project_defaults
        
        # Set basic section flags based on data availability
        has_timeline = project_data.timeline is not None or project_defaults.timeline is not None
        has_budget = project_data.budget is not None or project_defaults.budget is not None
        has_requirements = (
            (project_data.functional_requirements and len(project_data.functional_requirements) > 0) or
            (project_data.non_functional_requirements and len(project_data.non_functional_requirements) > 0) or
            (project_defaults.functional_requirements and len(project_defaults.functional_requirements) > 0) or
            (project_defaults.non_functional_requirements and len(project_defaults.non_functional_requirements) > 0)
        )
        has_metadata = project_defaults.metadata is not None
        
        # Set architecture section flags based on template data availability
        has_tech_stack = hasattr(template, 'tech_stack') and template.tech_stack is not None
        has_features = hasattr(template, 'features') and template.features is not None
        has_pages = hasattr(template, 'pages') and template.pages is not None
        has_data_model = hasattr(template, 'data_model') and template.data_model is not None
        has_api = hasattr(template, 'api') and template.api is not None
        has_testing = hasattr(template, 'testing') and template.testing is not None
        has_project_structure = hasattr(template, 'project_structure') and template.project_structure is not None
        has_deployment = hasattr(template, 'deployment') and template.deployment is not None
        has_documentation = hasattr(template, 'documentation') and template.documentation is not None
        
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
            template_id=template.id if hasattr(template, 'id') else None,
            
            # Set section availability flags
            has_timeline=has_timeline,
            has_budget=has_budget,
            has_requirements=has_requirements,
            has_metadata=has_metadata,
            
            has_tech_stack=has_tech_stack,
            has_features=has_features,
            has_pages=has_pages,
            has_data_model=has_data_model,
            has_api=has_api,
            has_testing=has_testing,
            has_project_structure=has_project_structure,
            has_deployment=has_deployment,
            has_documentation=has_documentation,
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
    template_id: Optional[str] = None
    
    # Section availability flags
    has_timeline: bool = False
    has_budget: bool = False
    has_requirements: bool = False
    has_metadata: bool = False
    
    has_tech_stack: bool = False
    has_features: bool = False
    has_pages: bool = False
    has_data_model: bool = False
    has_api: bool = False
    has_testing: bool = False
    has_project_structure: bool = False
    has_deployment: bool = False
    has_documentation: bool = False
    
    # These fields will be populated from separate section documents when needed
    functional_requirements: List[Requirement] = Field(default_factory=list)
    non_functional_requirements: List[Requirement] = Field(default_factory=list)
    
    class Config:
        allow_population_by_field_name = True


class ProjectDetailResponse(ProjectResponse):
    """Detailed response model for Project data including all sections."""
    team_members: List[str]
    metadata: Dict[str, Any] = Field(default_factory=dict)
    version: int
    
    # Basic section data populated from separate collections
    timeline: Optional[Dict[str, TimelineItem]] = None
    budget: Optional[Dict[str, BudgetItem]] = None
    
    # Architecture section data populated from separate collections
    tech_stack: Optional[TechStackData] = None
    features: Optional[Features] = None
    pages: Optional[Pages] = None
    data_model: Optional[DataModel] = None
    api: Optional[Api] = None
    testing: Optional[Testing] = None
    project_structure: Optional[ProjectStructure] = None
    deployment: Optional[Deployment] = None
    documentation: Optional[Documentation] = None
    
    class Config:
        allow_population_by_field_name = True 