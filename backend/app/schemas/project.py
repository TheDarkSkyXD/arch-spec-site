from typing import Optional
from pydantic import BaseModel, Field


class ProjectBase(BaseModel):
    """Base model for Project data."""
    # Project Basics
    name: str
    description: str
    business_goals: Optional[str] = None
    target_users: Optional[str] = None
    domain: Optional[str] = None  # Business domain (e.g., "healthcare", "finance")
    user_id: Optional[str] = None  # ID of the user who created this project
    template_id: Optional[str] = None  # ID of the template used to create this project
    
    class Config:
        populate_by_name = True
