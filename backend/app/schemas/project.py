from datetime import datetime
from typing import Dict, Optional
from pydantic import BaseModel, Field
import uuid


class ProjectBase(BaseModel):
    """Base model for Project data."""
    name: str
    description: str
    template_type: str = "web_app"


class ProjectCreate(ProjectBase):
    """Model for creating a new Project."""
    pass


class ProjectUpdate(BaseModel):
    """Model for updating an existing Project."""
    name: Optional[str] = None
    description: Optional[str] = None
    template_type: Optional[str] = None
    status: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None


class ProjectInDB(ProjectBase):
    """Model for Project data stored in the database."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "draft"
    metadata: Dict[str, str] = Field(default_factory=dict)


class Project(ProjectInDB):
    """Model for Project data returned to clients."""
    pass 