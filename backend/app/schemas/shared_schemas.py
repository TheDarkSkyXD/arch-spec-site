"""
Shared schema definitions to avoid circular imports.
"""
from pydantic import BaseModel, Field
from typing import Dict, Any

# Basic schema classes that are used across multiple modules

class TechStackData(BaseModel):
    """Schema for the complete tech stack data."""
    frontend: Dict[str, Any] = Field(default_factory=dict)
    backend: Dict[str, Any] = Field(default_factory=dict)
    database: Dict[str, Any] = Field(default_factory=dict)
    hosting: Dict[str, Any] = Field(default_factory=dict)
    authentication: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True

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