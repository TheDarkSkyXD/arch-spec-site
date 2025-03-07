from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any, Union

from .tech_stack import TechStackData

class ProjectDefaults(BaseModel):
    """Project default information."""
    name: str = ""
    description: str = ""
    business_goals: List[str] = Field(default_factory=list, alias="businessGoals")
    target_users: List[str] = Field(default_factory=list, alias="targetUsers")

    class Config:
        allow_population_by_field_name = True

class FeatureModule(BaseModel):
    """Feature module configuration."""
    name: str
    description: str
    enabled: bool = True
    optional: bool = False
    providers: List[str] = Field(default_factory=list)

class Features(BaseModel):
    """Features configuration."""
    core_modules: List[FeatureModule] = Field(default_factory=list, alias="coreModules")

    class Config:
        allow_population_by_field_name = True

class PageComponent(BaseModel):
    """Page component."""
    name: str
    path: str
    components: List[str] = Field(default_factory=list)
    enabled: bool = True

class Pages(BaseModel):
    """Application pages."""
    public: List[PageComponent] = Field(default_factory=list)
    authenticated: List[PageComponent] = Field(default_factory=list)
    admin: List[PageComponent] = Field(default_factory=list)

class EntityField(BaseModel):
    """Data model entity field."""
    name: str
    type: str
    primary_key: bool = False
    generated: bool = False
    unique: bool = False
    required: bool = False
    default: Optional[Union[str, int, float, bool]] = None
    enum: Optional[List[str]] = None
    foreign_key: Optional[Dict[str, Any]] = None

class Entity(BaseModel):
    """Data model entity."""
    name: str
    description: str
    fields: List[EntityField] = Field(default_factory=list)

class Relationship(BaseModel):
    """Data model relationship."""
    type: str
    from_entity: str = Field(alias="from")
    to: str
    field: str

    class Config:
        allow_population_by_field_name = True

class DataModel(BaseModel):
    """Application data model."""
    entities: List[Entity] = Field(default_factory=list)
    relationships: List[Relationship] = Field(default_factory=list)

    class Config:
        allow_population_by_field_name = True

class ApiEndpoint(BaseModel):
    """API endpoint configuration."""
    path: str
    description: str
    methods: List[str] = Field(default_factory=list)
    auth: bool = False
    roles: List[str] = Field(default_factory=list)

class Api(BaseModel):
    """API configuration."""
    endpoints: List[ApiEndpoint] = Field(default_factory=list)

class TestingFramework(BaseModel):
    """Testing framework configuration."""
    framework: str
    coverage: int = 0
    directories: Optional[List[str]] = None
    focus: Optional[List[str]] = None
    scenarios: Optional[List[str]] = None

class Testing(BaseModel):
    """Testing configuration."""
    unit: TestingFramework
    integration: TestingFramework
    e2e: TestingFramework

class ProjectStructure(BaseModel):
    """Project structure configuration."""
    frontend: Dict[str, List[str]]

class DeploymentEnvironment(BaseModel):
    """Deployment environment configuration."""
    name: str
    url: str
    variables: List[Dict[str, Any]] = Field(default_factory=list)

class CICD(BaseModel):
    """CI/CD configuration."""
    provider: str
    steps: List[str] = Field(default_factory=list)

class Deployment(BaseModel):
    """Deployment configuration."""
    environments: List[DeploymentEnvironment] = Field(default_factory=list)
    cicd: CICD

class Diagram(BaseModel):
    """Documentation diagram."""
    name: str
    type: str
    template: str

class Documentation(BaseModel):
    """Documentation configuration."""
    sections: List[str] = Field(default_factory=list)
    diagrams: List[Diagram] = Field(default_factory=list)

class ProjectTemplate(BaseModel):
    """Project template schema."""
    name: str
    version: str
    description: str
    project_defaults: ProjectDefaults = Field(alias="projectDefaults")
    tech_stack: TechStackData = Field(alias="techStack")  # Using TechStackData directly
    features: Features
    pages: Pages
    data_model: DataModel = Field(alias="dataModel")
    api: Api
    testing: Testing
    project_structure: ProjectStructure = Field(alias="projectStructure")
    deployment: Deployment
    documentation: Documentation

    class Config:
        allow_population_by_field_name = True

class ProjectTemplateResponse(BaseModel):
    """Response schema for a project template."""
    id: str
    template: ProjectTemplate

class ProjectTemplateList(BaseModel):
    """Response schema for a list of project templates."""
    templates: List[ProjectTemplateResponse] = Field(default_factory=list) 