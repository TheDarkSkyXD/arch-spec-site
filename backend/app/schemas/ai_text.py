"""
Schemas for AI text generation.
"""
from pydantic import BaseModel, Field
from typing import List, Optional


class DescriptionEnhanceRequest(BaseModel):
    """Request model for enhancing project descriptions."""
    
    user_description: str = Field(
        ...,
        title="User Description",
        description="The original project description provided by the user",
        examples=["An app for tracking my daily workouts"],
    )


class DescriptionEnhanceResponse(BaseModel):
    """Response model for enhanced project descriptions."""
    
    enhanced_description: str = Field(
        ...,
        title="Enhanced Description",
        description="The AI-enhanced project description",
    )


class BusinessGoalsEnhanceRequest(BaseModel):
    """Request model for enhancing business goals."""
    
    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )
    
    user_goals: List[str] = Field(
        ...,
        title="User Goals",
        description="The original business goals provided by the user",
        examples=[["Track workouts", "Monitor progress", "Share with friends"]],
    )


class BusinessGoalsEnhanceResponse(BaseModel):
    """Response model for enhanced business goals."""
    
    enhanced_goals: List[str] = Field(
        ...,
        title="Enhanced Goals",
        description="The AI-enhanced business goals",
    )


class TargetUsersEnhanceRequest(BaseModel):
    """Request model for enhancing target users description."""
    
    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )
    
    target_users: str = Field(
        ...,
        title="Target Users",
        description="The original target users description provided by the user",
        examples=["People who want to track their workouts"],
    )


class TargetUsersEnhanceResponse(BaseModel):
    """Response model for enhanced target users description."""
    
    enhanced_target_users: str = Field(
        ...,
        title="Enhanced Target Users",
        description="The AI-enhanced target users description",
    )


class EnhanceDescriptionRequest(BaseModel):
    description: str = Field(..., min_length=5)


class EnhanceDescriptionResponse(BaseModel):
    enhanced_description: str


class EnhanceBusinessGoalsRequest(BaseModel):
    project_description: str = Field(..., min_length=5)
    business_goals: List[str] = Field(default_factory=list)


class EnhanceBusinessGoalsResponse(BaseModel):
    enhanced_business_goals: List[str]


class EnhanceTargetUsersRequest(BaseModel):
    project_description: str = Field(..., min_length=5)
    target_users: Optional[str] = Field(default="")


class EnhanceTargetUsersResponse(BaseModel):
    enhanced_target_users: str 