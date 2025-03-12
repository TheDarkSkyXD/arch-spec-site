"""
Shared schema definitions to avoid circular imports.
"""
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional, Union, Literal
from datetime import datetime


class Requirements(BaseModel):
    """Schema for requirements section"""
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
    """Schema for features section"""
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
    """Schema for pages section"""
    public: List[PageComponent] = Field(default_factory=list)
    authenticated: List[PageComponent] = Field(default_factory=list)
    admin: List[PageComponent] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class DataModel(BaseModel):
    """Schema for data model section"""
    models: Dict[str, Any] = Field(default_factory=dict)
    
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
    """Schema for API section"""
    endpoints: List[ApiEndpoint] = Field(default_factory=list)
    
    class Config:
        populate_by_name = True

class Testing(BaseModel):
    """Schema for testing section"""
    strategy: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True

class ProjectStructure(BaseModel):
    """Schema for project structure section"""
    structure: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True

class Deployment(BaseModel):
    """Schema for deployment section"""
    config: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True

class Documentation(BaseModel):
    """Schema for documentation section"""
    content: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True 


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
