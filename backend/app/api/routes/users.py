from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from ...schemas.user import UserResponse, UserUpdate
from ...services.user_service import UserService
from ...core.firebase_auth import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get the current authenticated user's information."""
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_current_user(user_update: UserUpdate, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Update the current authenticated user's information."""
    updated_user = await UserService.update_user(current_user["_id"], user_update)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return updated_user


@router.put("/me/settings", response_model=UserResponse)
async def update_user_settings(settings: Dict[str, Any], current_user: Dict[str, Any] = Depends(get_current_user)):
    """Update the current authenticated user's settings."""
    updated_user = await UserService.update_user_settings(current_user["_id"], settings)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return updated_user
