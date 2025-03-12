"""
Shared schema definitions to avoid circular imports.
"""
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional, Union, Literal
from datetime import datetime

class Features(BaseModel):
    """Schema for features section"""
    features: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True

class Pages(BaseModel):
    """Schema for pages section"""
    pages: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True

class DataModel(BaseModel):
    """Schema for data model section"""
    models: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True

class Api(BaseModel):
    """Schema for API section"""
    endpoints: Dict[str, Any] = Field(default_factory=dict)
    
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
