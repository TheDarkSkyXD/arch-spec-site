from datetime import datetime, UTC
from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from bson import ObjectId


class PyObjectId(str):
    """Custom ObjectId field for Pydantic models."""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)


class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr = Field(..., description="User's email address")
    display_name: Optional[str] = Field(None, description="User's display name")
    photo_url: Optional[str] = Field(None, description="URL to user's profile photo")
    

class UserCreate(UserBase):
    """Schema for creating a new user."""
    firebase_uid: str = Field(..., description="Firebase Auth UID")
    

class UserUpdate(BaseModel):
    """Schema for updating user information."""
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None
    plan: Optional[Literal["free", "premium", "open_source"]] = None
    subscription_id: Optional[str] = None
    ai_credits: Optional[int] = None
    ai_credits_used: Optional[int] = None
    

class UserInDB(UserBase):
    """User schema as stored in the database."""
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    firebase_uid: str = Field(..., description="Firebase Auth UID")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    last_login: Optional[datetime] = None
    is_active: bool = True
    settings: Dict[str, Any] = Field(default_factory=dict)
    plan: Literal["free", "premium", "open_source"] = Field(default="free", description="User's subscription plan")
    subscription_id: Optional[str] = Field(None, description="ID of the user's subscription if applicable")
    ai_credits: int = Field(default=0, description="Available AI enhancement credits")
    ai_credits_used: int = Field(default=0, description="AI enhancement credits used so far")
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "email": "user@example.com",
                "firebase_uid": "firebase123456",
                "display_name": "John Doe",
                "photo_url": "https://example.com/photo.jpg",
                "created_at": "2023-01-01T00:00:00",
                "updated_at": "2023-01-01T00:00:00",
                "last_login": "2023-01-01T00:00:00",
                "is_active": True,
                "settings": {"theme": "dark"},
                "plan": "free",
                "subscription_id": None,
                "ai_credits": 0,
                "ai_credits_used": 0
            }
        }
    )


class UserResponse(BaseModel):
    """User schema for API responses."""
    id: str = Field(..., alias="_id")
    email: EmailStr
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    settings: Dict[str, Any] = Field(default_factory=dict)
    plan: Literal["free", "premium", "open_source"] = Field(default="free")
    subscription_id: Optional[str] = None
    ai_credits: int = Field(default=0)
    ai_credits_used: int = Field(default=0)
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str}
    )
