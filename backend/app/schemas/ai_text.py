"""
Schemas for AI text generation.
"""
from pydantic import BaseModel, Field
from typing import List


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