import logging
import json
from typing import Optional, Dict, Any
from datetime import datetime

import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from ..db.base import db
from ..schemas.user import UserInDB, UserCreate

logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
try:
    # Use service account credentials from environment or file
    cred = credentials.Certificate("firebase-service-account.json")
    firebase_admin.initialize_app(cred)
    logger.info("Firebase Admin SDK initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Firebase Admin SDK: {str(e)}")
    # Continue without Firebase for development purposes
    # In production, you would want to fail fast here


class FirebaseAuth(HTTPBearer):
    """Firebase authentication dependency for FastAPI."""
    
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)
        
    async def __call__(self, request: Request) -> Optional[Dict[str, Any]]:
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        
        if not credentials:
            if self.auto_error:
                raise HTTPException(status_code=403, detail="Invalid authentication credentials")
            return None
            
        if credentials.scheme != "Bearer":
            if self.auto_error:
                raise HTTPException(status_code=403, detail="Invalid authentication scheme")
            return None
            
        return await self.authenticate_token(credentials.credentials)
    
    async def authenticate_token(self, token: str) -> Dict[str, Any]:
        """Authenticate a Firebase token and return the user data."""
        try:
            # Verify the token with Firebase
            decoded_token = auth.verify_id_token(token)
            
            # Get user from database or create if not exists
            user_data = await self.get_or_create_user(decoded_token)
            
            # Update last login time
            await self.update_last_login(user_data["_id"])
            
            return {"firebase_user": decoded_token, "db_user": user_data}
            
        except Exception as e:
            logger.error(f"Firebase authentication error: {str(e)}")
            raise HTTPException(status_code=401, detail="Invalid token or token expired")
    
    async def get_or_create_user(self, firebase_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get user from database or create if not exists."""
        # Get MongoDB database
        database = db.get_db()
        if not database:
            raise HTTPException(status_code=500, detail="Database connection error")
        
        # Check if user exists
        user_collection = database.users
        user = await user_collection.find_one({"firebase_uid": firebase_user["uid"]})
        
        if user:
            return user
        
        # Create new user
        new_user = UserCreate(
            email=firebase_user.get("email", ""),
            firebase_uid=firebase_user["uid"],
            display_name=firebase_user.get("name"),
            photo_url=firebase_user.get("picture")
        )
        
        # Convert to dict for MongoDB
        user_dict = UserInDB(
            **new_user.model_dump(),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        ).model_dump(by_alias=True)
        
        # Insert into database
        result = await user_collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        
        return user_dict
    
    async def update_last_login(self, user_id: str) -> None:
        """Update user's last login time."""
        database = db.get_db()
        if not database:
            logger.error("Database connection error when updating last login")
            return
        
        await database.users.update_one(
            {"_id": user_id},
            {"$set": {"last_login": datetime.utcnow(), "updated_at": datetime.utcnow()}}
        )


# Create a reusable dependency
firebase_auth = FirebaseAuth()


async def get_current_user(auth_data: Dict[str, Any] = Depends(firebase_auth)) -> Dict[str, Any]:
    """Dependency to get the current authenticated user."""
    return auth_data["db_user"]


async def get_firebase_user(auth_data: Dict[str, Any] = Depends(firebase_auth)) -> Dict[str, Any]:
    """Dependency to get the Firebase user data."""
    return auth_data["firebase_user"]
