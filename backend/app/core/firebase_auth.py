import logging
import json
import os
from typing import Optional, Dict, Any
from datetime import datetime, UTC

import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

from ..services.user_service import UserService
from .config import settings

logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Simple settings object for environment configuration
class Settings:
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")  # Default to development for tests

settings_local = Settings()

# Initialize Firebase Admin SDK
firebase_initialized = False
try:
    # Check if Firebase environment variables are available
    if (os.getenv("FIREBASE_PROJECT_ID") and 
        os.getenv("FIREBASE_PRIVATE_KEY") and 
        os.getenv("FIREBASE_CLIENT_EMAIL")):
        
        # Create credentials dictionary from environment variables
        firebase_credentials = {
            "type": os.getenv("FIREBASE_TYPE", "service_account"),
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
            "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
            "client_id": os.getenv("FIREBASE_CLIENT_ID"),
            "auth_uri": os.getenv("FIREBASE_AUTH_URI", "https://accounts.google.com/o/oauth2/auth"),
            "token_uri": os.getenv("FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token"),
            "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL", 
                                                    "https://www.googleapis.com/oauth2/v1/certs"),
            "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
            "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN", "googleapis.com")
        }
        
        try:
            # Initialize Firebase with credentials from environment variables
            cred = credentials.Certificate(firebase_credentials)
            firebase_admin.initialize_app(cred)
            firebase_initialized = True
            logger.info("Firebase Admin SDK initialized successfully from environment variables")
        except Exception as e:
            logger.error(f"Failed to initialize Firebase with environment variables: {str(e)}")
            
    else:
        logger.warning("Firebase environment variables not found. Running in development mode only.")
except Exception as e:
    logger.error(f"Failed to initialize Firebase Admin SDK: {str(e)}")
    # Continue without Firebase for development purposes


class FirebaseAuth:
    """Firebase authentication dependency for FastAPI."""
    
    def __init__(self, auto_error: bool = True):
        self.auto_error = auto_error
        
    async def authenticate_token(self, token: str) -> Dict[str, Any]:
        """Authenticate a Firebase token and return the user data."""
        # In development mode with no Firebase, accept any token
        if not firebase_initialized and settings_local.ENVIRONMENT == "development":
            logger.info("Using development mode authentication")
            test_user = await self.get_test_user()
            return {"firebase_user": {"uid": "test-uid", "email": "test@example.com"}, "db_user": test_user}
        
        try:
            # Verify the token with Firebase
            decoded_token = auth.verify_id_token(token)
            
            # Get user from database or create if not exists
            user_data = await self.get_or_create_user(decoded_token)
            
            return {"firebase_user": decoded_token, "db_user": user_data}
            
        except Exception as e:
            logger.error(f"Firebase authentication error: {str(e)}")
            if settings_local.ENVIRONMENT == "development":
                # In development, fall back to test user
                logger.info("Falling back to test user in development mode")
                test_user = await self.get_test_user()
                return {"firebase_user": {"uid": "test-uid", "email": "test@example.com"}, "db_user": test_user}
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    async def get_or_create_user(self, firebase_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get user from database or create if not exists."""
        # Check if user exists
        user = await UserService.get_user_by_firebase_uid(firebase_user["uid"])
        
        if user:
            # Update last login time
            await UserService.update_user(
                str(user["_id"]), 
                {"last_login": datetime.now(UTC)}
            )
            return user
        
        # Create new user
        return await UserService.create_user(
            firebase_uid=firebase_user["uid"],
            email=firebase_user.get("email", ""),
            display_name=firebase_user.get("name"),
            photo_url=firebase_user.get("picture")
        )
    
    async def get_test_user(self) -> Dict[str, Any]:
        """Get or create a test user for development."""
        # Look for existing test user
        test_user = await UserService.get_user_by_email("test@example.com")
        
        if test_user:
            # Update last login time
            await UserService.update_user(
                str(test_user["_id"]), 
                {"last_login": datetime.now(UTC)}
            )
            return test_user
        
        # Create test user if it doesn't exist
        return await UserService.create_user(
            firebase_uid="test-uid",
            email="test@example.com",
            display_name="Test User",
            photo_url=""
        )


# Create a reusable instance
firebase_auth = FirebaseAuth()


async def get_current_user(request: Request) -> Dict[str, Any]:
    """Dependency to get the current authenticated user."""
    # Development bypass for testing
    if settings_local.ENVIRONMENT == 'development' and request.headers.get('X-Dev-Bypass') == 'true':
        # Use a test user in development mode
        test_user = await firebase_auth.get_test_user()
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
    # Development bypass for testing
    if settings_local.ENVIRONMENT == 'development' and request.headers.get('X-Dev-Bypass') == 'true':
        return {"uid": "test-uid", "email": "test@example.com"}
    
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
