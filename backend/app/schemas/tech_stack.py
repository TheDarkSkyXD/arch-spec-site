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
    compatible: bool = True
    message: str = ""
    compatible_with: Dict[str, List[str]] = Field(default_factory=dict)

class CompatibleOptionsResponse(BaseModel):
    """Schema for compatible options response."""
    category: str
    technology: str
    compatible_options: List[str] = Field(default_factory=list)

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
    
    class Config:
        allow_population_by_field_name = True

class Technology(BaseModel):
    """Schema for technology entry."""
    name: str
    description: str
    language: Optional[str] = None
    compatibility: TechnologyCompatibility
    
    class Config:
        allow_population_by_field_name = True

class FrontendOptions(BaseModel):
    """Schema for frontend technology options."""
    frameworks: List[Technology] = Field(default_factory=list)
    
    class Config:
        allow_population_by_field_name = True

class BackendOptions(BaseModel):
    """Schema for backend technology options."""
    frameworks: List[Technology] = Field(default_factory=list)
    baas: List[Technology] = Field(default_factory=list)
    
    class Config:
        allow_population_by_field_name = True

class DatabaseType(BaseModel):
    """Schema for database type (SQL/NoSQL) options."""
    sql: List[Technology] = Field(default_factory=list)
    nosql: List[Technology] = Field(default_factory=list)
    
    class Config:
        allow_population_by_field_name = True

class TechStackData(BaseModel):
    """Schema for the complete tech stack data."""
    frontend: FrontendOptions = Field(default_factory=FrontendOptions)
    backend: BackendOptions = Field(default_factory=BackendOptions)
    database: DatabaseType = Field(default_factory=DatabaseType)
    hosting: Dict[str, List[str]] = Field(default_factory=dict)
    authentication: Dict[str, List[str]] = Field(default_factory=dict)
    
    class Config:
        allow_population_by_field_name = True


class AllTechOptionsResponse(BaseModel):
    """Schema for the response of getting all technology options."""
    frontend: Dict[str, Any]
    backend: Dict[str, Any]
    database: Dict[str, Any]
    hosting: Dict[str, Any]
    authentication: Dict[str, Any]