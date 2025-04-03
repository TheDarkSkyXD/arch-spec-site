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
    # Get the most up-to-date user information from the database
    # to ensure all fields, especially subscription-related ones, are included
    user_id = current_user["_id"]
    updated_user_info = await UserService.get_user_by_id(user_id)

    if not updated_user_info:
        # Fall back to the current_user if database fetch fails
        return current_user

    return updated_user_info


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_data: UserUpdate, current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update the current user's profile information."""
    user_id = current_user["_id"]
    updated_user = await UserService.update_user(user_id, user_data)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user information",
        )

    return updated_user


@router.put("/me/subscription", response_model=UserResponse)
async def update_user_subscription(
    subscription_data: Dict[str, Any], current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update the current user's subscription information."""
    user_id = current_user["_id"]

    # Filter to only include subscription-related fields
    allowed_fields = ["plan", "subscription_id", "ai_credits", "ai_credits_used"]
    filtered_data = {k: v for k, v in subscription_data.items() if k in allowed_fields}

    if not filtered_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No valid subscription data provided"
        )

    updated_user = await UserService.update_user(user_id, filtered_data)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update subscription information",
        )

    return updated_user


@router.put("/me/settings", response_model=UserResponse)
async def update_user_settings(
    settings: Dict[str, Any], current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update the current authenticated user's settings."""
    updated_user = await UserService.update_user_settings(current_user["_id"], settings)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return updated_user
