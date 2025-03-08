from datetime import datetime
from typing import Dict, List, Any, Optional
from bson import ObjectId

from ..db.base import db
from ..schemas.user import UserInDB, UserUpdate, UserCreate


class UserService:
    """Service for user-related operations."""
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        """Get a user by ID."""
        database = db.get_db()
        if not database:
            return None
            
        try:
            user = await database.users.find_one({"_id": ObjectId(user_id)})
            return user
        except Exception:
            return None
    
    @staticmethod
    async def get_user_by_firebase_uid(firebase_uid: str) -> Optional[Dict[str, Any]]:
        """Get a user by Firebase UID."""
        database = db.get_db()
        if not database:
            return None
            
        try:
            user = await database.users.find_one({"firebase_uid": firebase_uid})
            return user
        except Exception:
            return None
    
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        """Get a user by email."""
        database = db.get_db()
        if not database:
            return None
            
        try:
            user = await database.users.find_one({"email": email})
            return user
        except Exception:
            return None
    
    @staticmethod
    async def create_user(firebase_uid: str, email: str, display_name: Optional[str] = None, 
                         photo_url: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Create a new user."""
        database = db.get_db()
        if not database:
            return None
            
        try:
            # Check if user already exists
            existing_user = await UserService.get_user_by_firebase_uid(firebase_uid)
            if existing_user:
                return existing_user
                
            # Prepare user data
            now = datetime.utcnow()
            user_data = {
                "firebase_uid": firebase_uid,
                "email": email,
                "display_name": display_name,
                "photo_url": photo_url,
                "created_at": now,
                "updated_at": now,
                "last_login": now,
                "is_active": True,
                "settings": {}
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
    async def update_user(user_id: str, user_data: UserUpdate) -> Optional[Dict[str, Any]]:
        """Update a user's information."""
        database = db.get_db()
        if not database:
            return None
            
        # Filter out None values
        update_data = {k: v for k, v in user_data.model_dump().items() if v is not None}
        if not update_data:
            return await UserService.get_user_by_id(user_id)
            
        # Add updated_at timestamp
        update_data["updated_at"] = datetime.utcnow()
        
        try:
            result = await database.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
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
        if not database:
            return False
            
        try:
            result = await database.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
            )
            
            return result.modified_count > 0
        except Exception:
            return False
    
    @staticmethod
    async def update_user_settings(user_id: str, settings: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a user's settings."""
        database = db.get_db()
        if not database:
            return None
            
        try:
            result = await database.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {
                    "settings": settings,
                    "updated_at": datetime.utcnow()
                }}
            )
            
            if result.modified_count:
                return await UserService.get_user_by_id(user_id)
            return None
        except Exception:
            return None
