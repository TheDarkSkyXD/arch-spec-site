"""
Shared schema definitions to avoid circular imports.
"""
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional, Union, Literal

# TODO Review the TechStackData schema and remove it in favor of the ProjectTechStack schema below

class TechStackData(BaseModel):
    """Schema for the complete tech stack data."""
    frontend: Dict[str, Any] = Field(default_factory=dict)
    backend: Dict[str, Any] = Field(default_factory=dict)
    database: Dict[str, Any] = Field(default_factory=dict)
    hosting: Dict[str, Any] = Field(default_factory=dict)
    authentication: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True

# These are still in use in the project templates

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


# THIS IS THE LATEST PROJECT TECH STACK SCHEMA COMPATIBLE WITH THE TECH STACK SCHEMA

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
    frontend: FrontendTechStack
    backend: BackendTechStack
    database: DatabaseTechStack
    authentication: AuthenticationTechStack
    hosting: HostingTechStack
    storage: Optional[StorageTechStack] = None
    deployment: Optional[DeploymentTechStack] = None
