from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any

class TechStackSelection(BaseModel):
    """Schema for tech stack selection."""
    frontend_framework: Optional[str] = None
    state_management: Optional[str] = None
    ui_library: Optional[str] = None
    form_handling: Optional[str] = None
    backend_framework: Optional[str] = None
    database: Optional[str] = None
    orm: Optional[str] = None
    auth: Optional[str] = None
    hosting_frontend: Optional[str] = None
    hosting_backend: Optional[str] = None
    hosting_database: Optional[str] = None

class CompatibilityResult(BaseModel):
    """Schema for compatibility check results."""
    is_compatible: bool = True
    compatibility_issues: List[str] = Field(default_factory=list)
    compatible_options: Dict[str, Any] = Field(default_factory=dict)

class CompatibleOptionsRequest(BaseModel):
    """Schema for requesting compatible options for a technology."""
    category: str
    technology: str

class CompatibleOptionsResponse(BaseModel):
    """Schema for compatible options response."""
    options: Dict[str, List[str]] = Field(default_factory=dict)

# New schemas for more detailed tech stack data validation

class TechnologyCompatibility(BaseModel):
    """Schema for technology compatibility options."""
    stateManagement: Optional[List[str]] = Field(default_factory=list)
    uiLibraries: Optional[List[str]] = Field(default_factory=list)
    formHandling: Optional[List[str]] = Field(default_factory=list)
    routing: Optional[List[str]] = Field(default_factory=list)
    apiClients: Optional[List[str]] = Field(default_factory=list)
    metaFrameworks: Optional[List[str]] = Field(default_factory=list)
    databases: Optional[List[str]] = Field(default_factory=list)
    orms: Optional[List[str]] = Field(default_factory=list)
    auth: Optional[List[str]] = Field(default_factory=list)
    hosting: Optional[List[str]] = Field(default_factory=list)
    storage: Optional[List[str]] = Field(default_factory=list)
    functions: Optional[List[str]] = Field(default_factory=list)

class Technology(BaseModel):
    """Schema for technology entry."""
    name: str
    description: str
    language: Optional[str] = None
    compatibility: TechnologyCompatibility

class FrontendOptions(BaseModel):
    """Schema for frontend technology options."""
    frameworks: List[Technology] = Field(default_factory=list)

class BackendOptions(BaseModel):
    """Schema for backend technology options."""
    frameworks: List[Technology] = Field(default_factory=list)
    baas: List[Technology] = Field(default_factory=list)

class DatabaseType(BaseModel):
    """Schema for database type (SQL/NoSQL) options."""
    sql: List[Technology] = Field(default_factory=list)
    nosql: List[Technology] = Field(default_factory=list)

class TechStackData(BaseModel):
    """Schema for the complete tech stack data."""
    frontend: FrontendOptions = Field(default_factory=FrontendOptions)
    backend: BackendOptions = Field(default_factory=BackendOptions)
    database: DatabaseType = Field(default_factory=DatabaseType)
    hosting: Dict[str, List[str]] = Field(default_factory=dict)
    authentication: Dict[str, List[str]] = Field(default_factory=dict)

class AllTechOptionsResponse(BaseModel):
    """Schema for the response of getting all technology options."""
    frontend: Dict[str, Any]
    backend: Dict[str, Any]
    database: Dict[str, Any]
    hosting: Dict[str, Any]
    authentication: Dict[str, Any]