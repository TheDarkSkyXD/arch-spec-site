"""
Schemas for AI text generation.
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


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


class RequirementsEnhanceRequest(BaseModel):
    """Request model for enhancing project requirements."""
    
    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )
    
    business_goals: List[str] = Field(
        ...,
        title="Business Goals",
        description="The business goals of the project",
        examples=[["Increase user engagement", "Generate revenue through premium subscriptions"]],
    )
    
    user_requirements: List[str] = Field(
        ...,
        title="User Requirements",
        description="The original requirements provided by the user",
        examples=[["Track workouts", "Monitor progress", "Share with friends"]],
    )


class RequirementsEnhanceResponse(BaseModel):
    """Response model for enhanced project requirements."""
    
    enhanced_requirements: List[str] = Field(
        ...,
        title="Enhanced Requirements",
        description="The AI-enhanced project requirements",
    )


class FeaturesEnhanceRequest(BaseModel):
    """Request model for enhancing project features."""
    
    project_description: str = Field(
        ...,
        title="Project Description",
        description="The description of the project",
        examples=["A web application for tracking daily fitness workouts and nutrition"],
    )
    
    business_goals: List[str] = Field(
        ...,
        title="Business Goals",
        description="The business goals of the project",
        examples=[["Increase user engagement", "Generate revenue through premium subscriptions"]],
    )
    
    requirements: List[str] = Field(
        ...,
        title="Requirements",
        description="The project requirements",
        examples=[["Track workouts", "Monitor progress", "Share with friends"]],
    )
    
    user_features: Optional[List[Dict[str, Any]]] = Field(
        default=None,
        title="User Features",
        description="The original features provided by the user",
    )


class FeatureModule(BaseModel):
    """Model for a feature module."""
    
    name: str = Field(
        ...,
        title="Module Name",
        description="Name of the module (e.g., Authentication, User Management)"
    )
    
    description: str = Field(
        ...,
        title="Module Description",
        description="Brief description of the module's purpose"
    )
    
    enabled: bool = Field(
        ...,
        title="Enabled",
        description="Whether this module is enabled by default"
    )
    
    optional: bool = Field(
        ...,
        title="Optional",
        description="Whether this module is optional or required"
    )
    
    providers: Optional[List[str]] = Field(
        default=None,
        title="Providers",
        description="List of service providers associated with this module, if any"
    )


class FeaturesData(BaseModel):
    """Model for features data."""
    
    coreModules: List[FeatureModule] = Field(
        ...,
        title="Core Modules",
        description="List of core modules in the application"
    )
    
    optionalModules: Optional[List[FeatureModule]] = Field(
        default=None,
        title="Optional Modules",
        description="List of optional modules that can be enabled"
    )


class FeaturesEnhanceResponse(BaseModel):
    """Response model for enhanced features."""
    
    data: FeaturesData = Field(
        ...,
        title="Features Data",
        description="The structured feature data organized by modules"
    ) 