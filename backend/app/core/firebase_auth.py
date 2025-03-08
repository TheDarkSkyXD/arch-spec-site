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
        # Only use test user in development mode when Firebase is not initialized AND dev bypass is explicitly requested
        if (not firebase_initialized and 
            settings_local.ENVIRONMENT == "development" and 
            not token.startswith('ey')):  # Check if it's not a JWT token
            logger.info("Using development mode authentication without Firebase")
            test_user = await self.get_test_user()
            return {"firebase_user": {"uid": "test-uid", "email": "test@example.com"}, "db_user": test_user}
        
        try:
            # Verify the token with Firebase
            decoded_token = auth.verify_id_token(token)
            logger.info(f"Successfully verified Firebase token for user: {decoded_token.get('email', 'unknown')}")
            
            # Get user from database or create if not exists
            try:
                user_data = await self.get_or_create_user(decoded_token)
                if not user_data:
                    logger.error("Failed to get or create user after successful token verification")
                    raise HTTPException(status_code=500, detail="Failed to create user in database")
                return {"firebase_user": decoded_token, "db_user": user_data}
            except Exception as e:
                logger.error(f"Error in get_or_create_user: {str(e)}")
                raise HTTPException(status_code=500, detail="Error processing user data")
            
        except Exception as e:
            logger.error(f"Firebase authentication error: {str(e)}")
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    async def get_or_create_user(self, firebase_user: Dict[str, Any]) -> Dict[str, Any]:
        """Get user from database or create if not exists."""
        try:
            # Check if user exists
            user = await UserService.get_user_by_firebase_uid(firebase_user["uid"])
            
            if user:
                # Update last login time
                updated_user = await UserService.update_user(
                    str(user["_id"]), 
                    {"last_login": datetime.now(UTC)}
                )
                if not updated_user:
                    logger.error(f"Failed to update last login for user: {user['_id']}")
                    return user  # Return original user if update fails
                return updated_user
            
            # Create new user
            logger.info(f"Creating new user for Firebase UID: {firebase_user['uid']}")
            user = await UserService.create_user(
                firebase_uid=firebase_user["uid"],
                email=firebase_user.get("email", ""),
                display_name=firebase_user.get("name"),
                photo_url=firebase_user.get("picture")
            )
            
            if not user:
                logger.error(f"Failed to create user for Firebase UID: {firebase_user['uid']}")
                raise Exception("Failed to create user in database")
                
            logger.info(f"Successfully created new user with ID: {user.get('_id')}")
            return user
        except Exception as e:
            logger.error(f"Error in get_or_create_user: {str(e)}")
            raise
    
    async def get_test_user(self) -> Dict[str, Any]:
        """Get or create a test user for development."""
        if settings_local.ENVIRONMENT != "development":
            logger.error("Attempted to get test user in non-development environment")
            raise HTTPException(status_code=401, detail="Test users not allowed in production")
            
        try:
            # Look for existing test user
            test_user = await UserService.get_user_by_email("test@example.com")
            
            if test_user:
                # Update last login time
                updated_user = await UserService.update_user(
                    str(test_user["_id"]), 
                    {"last_login": datetime.now(UTC)}
                )
                if not updated_user:
                    logger.error("Failed to update test user last login")
                    return test_user  # Return original user if update fails
                return updated_user
            
            # Create test user if it doesn't exist
            logger.info("Creating new test user")
            test_user = await UserService.create_user(
                firebase_uid="test-uid",
                email="test@example.com",
                display_name="Test User",
                photo_url=""
            )
            
            if not test_user:
                logger.error("Failed to create test user")
                raise Exception("Failed to create test user")
                
            return test_user
        except Exception as e:
            logger.error(f"Error in get_test_user: {str(e)}")
            raise


# Create a reusable instance
firebase_auth = FirebaseAuth()


async def get_current_user(request: Request) -> Dict[str, Any]:
    """Dependency to get the current authenticated user."""
    # Normal authentication flow
    token = _get_token_from_header(request)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    auth_result = await firebase_auth.authenticate_token(token)
    return auth_result["db_user"]


async def get_firebase_user(request: Request) -> Dict[str, Any]:
    """Dependency to get the Firebase user data."""
    # Normal authentication flow
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
