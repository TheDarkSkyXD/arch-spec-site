import pytest
import asyncio
from unittest.mock import patch, MagicMock, AsyncMock
from fastapi import HTTPException
from app.core.firebase_auth import FirebaseAuth, get_current_user, get_firebase_user


@pytest.fixture
def mock_firebase_auth():
    """Fixture to mock Firebase auth verification"""
    with patch('app.core.firebase_auth.auth') as mock_auth:
        yield mock_auth


@pytest.fixture
def mock_user_service():
    """Fixture to mock the user service"""
    with patch('app.core.firebase_auth.UserService') as mock_service:
        # Set up AsyncMock for async methods
        mock_service.get_user_by_firebase_uid = AsyncMock()
        mock_service.get_user_by_email = AsyncMock()
        mock_service.create_user = AsyncMock()
        yield mock_service


@pytest.fixture
def sample_firebase_token():
    """Sample decoded Firebase token"""
    return {
        "uid": "firebase123",
        "email": "test@example.com",
        "name": "Test User",
        "picture": "https://example.com/photo.jpg",
        "email_verified": True
    }


@pytest.fixture
def sample_db_user():
    """Sample user from database"""
    return {
        "_id": "user123",
        "firebase_uid": "firebase123",
        "email": "test@example.com",
        "display_name": "Test User",
        "photo_url": "https://example.com/photo.jpg",
        "created_at": "2023-01-01T00:00:00",
        "updated_at": "2023-01-01T00:00:00",
        "is_active": True,
        "settings": {}
    }


@pytest.mark.asyncio
async def test_authenticate_token_valid(mock_firebase_auth, mock_user_service, sample_firebase_token, sample_db_user):
    """Test authenticating a valid token"""
    # Setup
    firebase_auth = FirebaseAuth()
    mock_firebase_auth.verify_id_token.return_value = sample_firebase_token
    
    # Mock the get_or_create_user method
    mock_user_service.get_user_by_firebase_uid.return_value = sample_db_user
    
    # Execute
    result = await firebase_auth.authenticate_token("valid_token")
    
    # Assert
    mock_firebase_auth.verify_id_token.assert_called_once_with("valid_token")
    mock_user_service.get_user_by_firebase_uid.assert_called_once_with(sample_firebase_token["uid"])
    assert result == {"firebase_user": sample_firebase_token, "db_user": sample_db_user}


@pytest.mark.asyncio
async def test_authenticate_token_invalid(mock_firebase_auth):
    """Test authenticating an invalid token"""
    # Setup
    firebase_auth = FirebaseAuth()
    mock_firebase_auth.verify_id_token.side_effect = Exception("Invalid token")
    
    # Execute and Assert
    with pytest.raises(HTTPException) as exc_info:
        await firebase_auth.authenticate_token("invalid_token")
    
    assert exc_info.value.status_code == 401
    assert "Invalid authentication credentials" in str(exc_info.value.detail)


@pytest.mark.asyncio
async def test_get_or_create_user_existing(mock_user_service, sample_firebase_token, sample_db_user):
    """Test getting an existing user"""
    # Setup
    firebase_auth = FirebaseAuth()
    mock_user_service.get_user_by_firebase_uid.return_value = sample_db_user
    
    # Execute
    result = await firebase_auth.get_or_create_user(sample_firebase_token)
    
    # Assert
    mock_user_service.get_user_by_firebase_uid.assert_called_once_with(sample_firebase_token["uid"])
    assert not mock_user_service.create_user.called
    assert result == sample_db_user


@pytest.mark.asyncio
async def test_get_or_create_user_new(mock_user_service, sample_firebase_token, sample_db_user):
    """Test creating a new user"""
    # Setup
    firebase_auth = FirebaseAuth()
    
    # User doesn't exist yet
    mock_user_service.get_user_by_firebase_uid.return_value = None
    
    # User is created
    mock_user_service.create_user.return_value = sample_db_user
    
    # Execute
    result = await firebase_auth.get_or_create_user(sample_firebase_token)
    
    # Assert
    mock_user_service.get_user_by_firebase_uid.assert_called_once_with(sample_firebase_token["uid"])
    mock_user_service.create_user.assert_called_once()
    assert result == sample_db_user


@pytest.mark.asyncio
async def test_get_current_user_dependency(mock_firebase_auth, mock_user_service, sample_firebase_token, sample_db_user):
    """Test the get_current_user dependency"""
    # Setup - Create a mock request with a valid token
    mock_request = MagicMock()
    mock_request.headers = {"Authorization": "Bearer valid_token"}
    
    # Mock the FirebaseAuth class
    with patch('app.core.firebase_auth.firebase_auth.authenticate_token', new_callable=AsyncMock) as mock_auth_token:
        # Set up the mock to return the expected result
        mock_auth_token.return_value = {
            "firebase_user": sample_firebase_token,
            "db_user": sample_db_user
        }
        
        # Execute
        result = await get_current_user(request=mock_request)
        
        # Assert
        mock_auth_token.assert_called_once_with("valid_token")
        assert result == sample_db_user


@pytest.mark.asyncio
async def test_get_firebase_user_dependency(mock_firebase_auth, mock_user_service, sample_firebase_token, sample_db_user):
    """Test the get_firebase_user dependency"""
    # Setup - Create a mock request with a valid token
    mock_request = MagicMock()
    mock_request.headers = {"Authorization": "Bearer valid_token"}
    
    # Mock the FirebaseAuth class
    with patch('app.core.firebase_auth.firebase_auth.authenticate_token', new_callable=AsyncMock) as mock_auth_token:
        # Set up the mock to return the expected result
        mock_auth_token.return_value = {
            "firebase_user": sample_firebase_token,
            "db_user": sample_db_user
        }
        
        # Execute
        result = await get_firebase_user(request=mock_request)
        
        # Assert
        mock_auth_token.assert_called_once_with("valid_token")
        assert result == sample_firebase_token


@pytest.mark.asyncio
async def test_dev_bypass_mode(mock_user_service, sample_db_user):
    """Test development bypass mode"""
    # Setup - Create a mock request with dev bypass header
    mock_request = MagicMock()
    mock_request.headers = {"X-Dev-Bypass": "true"}
    
    # Mock the UserService to return a mock user
    mock_user_service.get_user_by_email.return_value = sample_db_user
    
    # Execute
    result = await get_current_user(request=mock_request)
    
    # Assert
    mock_user_service.get_user_by_email.assert_called_once_with('test@example.com')
    assert result == sample_db_user
