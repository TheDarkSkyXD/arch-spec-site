from datetime import datetime, UTC
import logging
from typing import Dict, Any, Optional, Union
from bson import ObjectId

from ..db.base import db
from ..schemas.user import UserUpdate

# Set up logger at module level
logger = logging.getLogger(__name__)


class UserService:
    """Service for user-related operations."""

    @staticmethod
    def _prepare_user_document(user: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """Transform MongoDB document for API response.

        Converts ObjectId to string and handles other necessary transformations.
        """
        if user is None:
            return None

        # Convert _id from ObjectId to string
        if "_id" in user and isinstance(user["_id"], ObjectId):
            user["_id"] = str(user["_id"])

        user["ai_credits_remaining"] = user.get("ai_credits", 0) - user.get("ai_credits_used", 0)

        return user

    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        """Get a user by ID."""
        database = db.get_db()
        if database is None:
            return None

        try:
            user = await database.users.find_one({"_id": ObjectId(user_id)})
            return UserService._prepare_user_document(user)
        except Exception:
            return None

    @staticmethod
    async def get_user_by_firebase_uid(firebase_uid: str) -> Optional[Dict[str, Any]]:
        """Get a user by Firebase UID."""
        database = db.get_db()
        if database is None:
            return None

        try:
            user = await database.users.find_one({"firebase_uid": firebase_uid})
            return UserService._prepare_user_document(user)
        except Exception:
            return None

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        """Get a user by email."""
        database = db.get_db()
        if database is None:
            return None

        try:
            user = await database.users.find_one({"email": email})
            return UserService._prepare_user_document(user)
        except Exception:
            return None

    @staticmethod
    async def create_user(
        firebase_uid: str,
        email: str,
        display_name: Optional[str] = None,
        photo_url: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """Create a new user."""
        database = db.get_db()
        if database is None:
            return None

        try:
            # Check if user already exists
            existing_user = await UserService.get_user_by_firebase_uid(firebase_uid)
            if existing_user:
                return existing_user

            # Prepare user data
            now = datetime.now(UTC)
            user_data = {
                "firebase_uid": firebase_uid,
                "email": email,
                "display_name": display_name,
                "photo_url": photo_url,
                "created_at": now,
                "updated_at": now,
                "last_login": now,
                "is_active": True,
                "settings": {},
                # Initialize subscription-related fields
                "plan": "free",
                "subscription_id": None,
                "ai_credits": 0,
                "ai_credits_used": 0,
            }

            # Insert user
            result = await database.users.insert_one(user_data)

            if result.inserted_id:
                return await UserService.get_user_by_id(str(result.inserted_id))
            return None
        except Exception as e:
            print(f"Error creating user: {e}")
            return None

    @staticmethod
    async def update_user(
        user_id: str, user_data: Union[UserUpdate, Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """Update a user's information.

        Args:
            user_id: The user ID to update
            user_data: Either a UserUpdate model or a dictionary with user data

        Returns:
            The updated user document or None if the update failed
        """
        database = db.get_db()
        if database is None:
            return None

        # Handle both UserUpdate model and dictionary
        if isinstance(user_data, UserUpdate):
            # Filter out None values if it's a Pydantic model
            update_data = {k: v for k, v in user_data.model_dump().items() if v is not None}
        else:
            # It's already a dictionary
            update_data = {k: v for k, v in user_data.items() if v is not None}

        if not update_data:
            return await UserService.get_user_by_id(user_id)

        # Add updated_at timestamp
        update_data["updated_at"] = datetime.now(UTC)

        try:
            result = await database.users.update_one(
                {"_id": ObjectId(user_id)}, {"$set": update_data}
            )

            if result.modified_count:
                return await UserService.get_user_by_id(user_id)
            return None
        except Exception:
            return None

    @staticmethod
    async def delete_user(user_id: str) -> bool:
        """Delete a user (soft delete by setting is_active to False)."""
        database = db.get_db()
        if database is None:
            return False

        try:
            result = await database.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"is_active": False, "updated_at": datetime.now(UTC)}},
            )

            return result.modified_count > 0
        except Exception:
            return False

    @staticmethod
    async def update_user_settings(
        user_id: str, settings: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Update a user's settings."""
        database = db.get_db()
        if database is None:
            return None

        try:
            result = await database.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"settings": settings, "updated_at": datetime.now(UTC)}},
            )

            if result.modified_count:
                return await UserService.get_user_by_id(user_id)
            return None
        except Exception:
            return None
