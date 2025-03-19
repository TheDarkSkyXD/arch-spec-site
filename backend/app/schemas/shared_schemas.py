"""
Shared schema definitions to avoid circular imports.
"""
from pydantic import BaseModel, Field, model_validator
from typing import Dict, Any, List, Optional, Union, Literal, Self
from datetime import datetime
from enum import Enum
import uuid


class Requirements(BaseModel):
    """Schema for requirements spec"""
    functional: List[str] = Field(default_factory=list)
    non_functional: List[str] = Field(default_factory=list) 
    
    class Config:
        populate_by_name = True

class FeatureModule(BaseModel):
    """Schema for feature module"""
    name: str
    description: str
    enabled: bool = True
    optional: Optional[bool] = False
    providers: Optional[List[str]] = Field(default_factory=list)

class Features(BaseModel):
    """Schema for features spec"""
    coreModules: List[FeatureModule] = Field(default_factory=list)
    optionalModules: Optional[List[FeatureModule]] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True


class PageComponent(BaseModel):
    """Schema for page component"""
    name: str
    path: str
    components: List[str] = Field(default_factory=list)
    enabled: bool = True


class Pages(BaseModel):
    """Schema for pages spec"""
    public: List[PageComponent] = Field(default_factory=list)
    authenticated: List[PageComponent] = Field(default_factory=list)
    admin: List[PageComponent] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class EntityField(BaseModel):
    """Schema for entity field"""
    name: str
    type: str
    primaryKey: Optional[bool] = False
    generated: Optional[bool] = False
    unique: Optional[bool] = False
    required: Optional[bool] = False
    default: Optional[str] = None
    enum: Optional[List[str]] = Field(default_factory=list)

    @model_validator(mode='before')
    @classmethod
    def validate_default_value(cls, data: Any) -> Any:
        """Convert non-string default values to strings."""
        if isinstance(data, dict) and 'default' in data and data['default'] is not None:
            if not isinstance(data['default'], str):
                data['default'] = str(data['default'])
        return data


class Entity(BaseModel):
    """Schema for entity"""
    name: str
    description: str
    fields: List[EntityField] = Field(default_factory=list)


class Relationship(BaseModel):
    """Schema for relationship"""
    type: str
    from_entity: str
    to_entity: str
    field: str


class DataModel(BaseModel):
    """Schema for data model spec"""
    entities: List[Entity] = Field(default_factory=list)
    relationships: List[Relationship] = Field(default_factory=list)

    class Config:
        populate_by_name = True


class ApiEndpoint(BaseModel):
    """Schema for API endpoint"""
    path: str
    description: str
    methods: List[str]
    auth: bool
    roles: Optional[List[str]] = Field(default_factory=list)

class Api(BaseModel):
    """Schema for API spec"""
    endpoints: List[ApiEndpoint] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class Testing(BaseModel):
    """Schema for testing spec"""
    strategy: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True

class GherkinTestCase(BaseModel):
    """Schema for Gherkin format test case"""
    feature: str
    title: str
    description: Optional[str] = None
    tags: Optional[List[str]] = Field(default_factory=list)
    scenarios: List[Dict[str, Any]] = Field(default_factory=list)

class TestCases(BaseModel):
    """Schema for test cases spec using Gherkin format"""
    testCases: List[GherkinTestCase] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class ProjectStructure(BaseModel):
    """Schema for project structure spec"""
    structure: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True

class Deployment(BaseModel):
    """Schema for deployment spec"""
    config: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True

class Diagram(BaseModel):
    """Diagram in a documentation."""
    name: str
    type: str
    template: str


class ImplementationPromptType(str, Enum):
    """Types of implementation prompts."""
    MAIN = "main"
    FOLLOWUP_1 = "followup_1"
    FOLLOWUP_2 = "followup_2"


class ImplementationPrompt(BaseModel):
    """Implementation prompt for a project."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    type: ImplementationPromptType
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)


class Documentation(BaseModel):
    """Documentation for a project."""
    sections: List[str] = Field(default_factory=list)
    diagrams: List[Diagram] = Field(default_factory=list)


# Timeline-related schemas
class TimelineItem(BaseModel):
    """Model for a timeline item."""
    title: str
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None
    order: Optional[int] = None
    
    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat() if dt else None
        }


# Budget-related schemas
class BudgetItem(BaseModel):
    """Model for a budget item."""
    name: str
    amount: float
    category: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None
    
    class Config:
        populate_by_name = True


# Frontend Types
class FrontendTechStack(BaseModel):
    framework: str
    language: str
    stateManagement: Optional[str] = None
    uiLibrary: Optional[str] = None
    formHandling: Optional[str] = None
    routing: Optional[str] = None
    apiClient: Optional[str] = None
    metaFramework: Optional[str] = None

# Backend Types
class FrameworkBackend(BaseModel):
    type: Literal["framework"]
    framework: str  # Express.js, NestJS, Django, etc.
    language: str  # JavaScript, TypeScript, Python, etc.
    realtime: Optional[str] = None

class BaaSBackend(BaseModel):
    type: Literal["baas"]
    service: str  # Supabase, Firebase, etc.
    functions: Optional[str] = None
    realtime: Optional[str] = None

class ServerlessBackend(BaseModel):
    type: Literal["serverless"]
    service: str  # AWS Lambda, Azure Functions, etc.
    language: str  # JavaScript, TypeScript, Python, etc.

# Combined Backend
BackendTechStack = Union[FrameworkBackend, BaaSBackend, ServerlessBackend]

# Database Types
class SQLDatabase(BaseModel):
    type: Literal["sql"]
    system: str  # PostgreSQL, MySQL, etc.
    hosting: str  # Supabase, AWS RDS, etc.
    orm: Optional[str] = None

class NoSQLDatabase(BaseModel):
    type: Literal["nosql"]
    system: str  # MongoDB, Firestore, etc.
    hosting: str  # MongoDB Atlas, Firebase, etc.
    client: Optional[str] = None

# Combined Database
DatabaseTechStack = Union[SQLDatabase, NoSQLDatabase]

# Authentication
class AuthenticationTechStack(BaseModel):
    provider: str
    methods: List[str]

# Hosting
class HostingTechStack(BaseModel):
    frontend: str
    backend: str
    database: Optional[str] = None

# Storage
class StorageTechStack(BaseModel):
    type: str  # objectStorage, fileSystem
    service: str

# Deployment
class DeploymentTechStack(BaseModel):
    ci_cd: Optional[str] = None
    containerization: Optional[str] = None

# Complete Project Tech Stack
class ProjectTechStack(BaseModel):
    frontend: Optional[FrontendTechStack] = None
    backend: Optional[BackendTechStack] = None
    database: Optional[DatabaseTechStack] = None
    authentication: Optional[AuthenticationTechStack] = None
    hosting: Optional[HostingTechStack] = None
    storage: Optional[StorageTechStack] = None
    deployment: Optional[DeploymentTechStack] = None

