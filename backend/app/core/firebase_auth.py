import logging
import json
from typing import Optional, Dict, Any
from datetime import datetime

import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from ..services.user_service import UserService

logger = logging.getLogger(__name__)

# Simple settings object for environment configuration
class Settings:
    ENVIRONMENT = "development"  # Default to development for tests

settings = Settings()

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


class FirebaseAuth:
    """Firebase authentication dependency for FastAPI."""
    
    def __init__(self, auto_error: bool = True):
        self.auto_error = auto_error
        
    async def authenticate_token(self, token: str) -> Dict[str, Any]:
        """Authenticate a Firebase token and return the user data."""
        try:
            # Verify the token with Firebase
            decoded_token = auth.verify_id_token(token)
            
            # Get user from database or create if not exists
            user_data = await self.get_or_create_user(decoded_token)
            
            return {"firebase_user": decoded_token, "db_user": user_data}
            
        except Exception as e:
            logger.error(f"Firebase authentication error: {str(e)}")
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    async def get_or_create_user(self, firebase_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get user from database or create if not exists."""
        # Check if user exists
        user = await UserService.get_user_by_firebase_uid(firebase_user["uid"])
        
        if user:
            return user
        
        # Create new user
        return await UserService.create_user(
            firebase_uid=firebase_user["uid"],
            email=firebase_user.get("email", ""),
            display_name=firebase_user.get("name"),
            photo_url=firebase_user.get("picture")
        )


# Create a reusable instance
firebase_auth = FirebaseAuth()


async def get_current_user(request: Request) -> Dict[str, Any]:
    """Dependency to get the current authenticated user."""
    # Development bypass for testing
    if settings.ENVIRONMENT == 'development' and request.headers.get('X-Dev-Bypass') == 'true':
        # Use a test user in development mode
        test_user = await UserService.get_user_by_email('test@example.com')
        if test_user:
            return test_user
    
    # Normal authentication flow
    token = _get_token_from_header(request)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    auth_result = await firebase_auth.authenticate_token(token)
    return auth_result["db_user"]


async def get_firebase_user(request: Request) -> Dict[str, Any]:
    """Dependency to get the Firebase user data."""
    token = _get_token_from_header(request)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    auth_result = await firebase_auth.authenticate_token(token)
    return auth_result["firebase_user"]


def _get_token_from_header(request: Request) -> Optional[str]:
    """Extract the token from the Authorization header."""
    auth_header = request.headers.get('Authorization')
    if not auth_header or ' ' not in auth_header:
        return None
        
    scheme, token = auth_header.split(' ', 1)
    if scheme.lower() != 'bearer':
        return None
        
    return token
