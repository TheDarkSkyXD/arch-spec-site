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