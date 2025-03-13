from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime


class ProjectBase(BaseModel):
    """Base model for Project data."""
    # Project Basics
    name: str
    description: str
    business_goals: Optional[List[str]] = None
    target_users: Optional[str] = None
    domain: Optional[str] = None
    user_id: Optional[str] = None
    template_id: Optional[str] = None
    version: Optional[str] = "1.0.0"
    
    class Config:
        populate_by_name = True


class ProjectCreate(ProjectBase):
    """Model for creating a new project."""
    pass


class ProjectUpdate(ProjectBase):
    """Model for updating an existing project."""
    name: Optional[str] = None
    description: Optional[str] = None

    class Config:
        populate_by_name = True


class ProjectResponse(ProjectBase):
    """Model for project response data."""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class ProjectListResponse(BaseModel):
    """Model for list of projects response."""
    projects: List[ProjectResponse]

    class Config:
        populate_by_name = True
