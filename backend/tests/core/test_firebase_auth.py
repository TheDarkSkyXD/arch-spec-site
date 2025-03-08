import pytest
import asyncio
from unittest.mock import patch, MagicMock
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
    firebase_auth.get_or_create_user = MagicMock(return_value=asyncio.Future())
    firebase_auth.get_or_create_user.return_value.set_result(sample_db_user)
    
    # Execute
    result = await firebase_auth.authenticate_token("valid_token")
    
    # Assert
    mock_firebase_auth.verify_id_token.assert_called_once_with("valid_token")
    firebase_auth.get_or_create_user.assert_called_once_with(sample_firebase_token)
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
    mock_user_service.get_user_by_firebase_uid.return_value = asyncio.Future()
    mock_user_service.get_user_by_firebase_uid.return_value.set_result(sample_db_user)
    
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
    mock_user_service.get_user_by_firebase_uid.return_value = asyncio.Future()
    mock_user_service.get_user_by_firebase_uid.return_value.set_result(None)
    
    # User is created
    mock_user_service.create_user.return_value = asyncio.Future()
    mock_user_service.create_user.return_value.set_result(sample_db_user)
    
    # Execute
    result = await firebase_auth.get_or_create_user(sample_firebase_token)
    
    # Assert
    mock_user_service.get_user_by_firebase_uid.assert_called_once_with(sample_firebase_token["uid"])
    mock_user_service.create_user.assert_called_once()
    assert "firebase_uid" in mock_user_service.create_user.call_args[1]
    assert "email" in mock_user_service.create_user.call_args[1]
    assert result == sample_db_user


@pytest.mark.asyncio
async def test_get_current_user_dependency(mock_firebase_auth, mock_user_service, sample_firebase_token, sample_db_user):
    """Test the get_current_user dependency"""
    # Setup - Create a mock request with a valid token
    mock_request = MagicMock()
    mock_request.headers = {"Authorization": "Bearer valid_token"}
    
    # Mock the FirebaseAuth class
    with patch('app.core.firebase_auth.FirebaseAuth') as MockFirebaseAuth:
        mock_instance = MagicMock()
        MockFirebaseAuth.return_value = mock_instance
        
        # Mock the authenticate_token method
        mock_instance.authenticate_token.return_value = asyncio.Future()
        mock_instance.authenticate_token.return_value.set_result({
            "firebase_user": sample_firebase_token,
            "db_user": sample_db_user
        })
        
        # Execute
        result = await get_current_user(request=mock_request)
        
        # Assert
        mock_instance.authenticate_token.assert_called_once_with("valid_token")
        assert result == sample_db_user


@pytest.mark.asyncio
async def test_get_firebase_user_dependency(mock_firebase_auth, mock_user_service, sample_firebase_token, sample_db_user):
    """Test the get_firebase_user dependency"""
    # Setup - Create a mock request with a valid token
    mock_request = MagicMock()
    mock_request.headers = {"Authorization": "Bearer valid_token"}
    
    # Mock the FirebaseAuth class
    with patch('app.core.firebase_auth.FirebaseAuth') as MockFirebaseAuth:
        mock_instance = MagicMock()
        MockFirebaseAuth.return_value = mock_instance
        
        # Mock the authenticate_token method
        mock_instance.authenticate_token.return_value = asyncio.Future()
        mock_instance.authenticate_token.return_value.set_result({
            "firebase_user": sample_firebase_token,
            "db_user": sample_db_user
        })
        
        # Execute
        result = await get_firebase_user(request=mock_request)
        
        # Assert
        mock_instance.authenticate_token.assert_called_once_with("valid_token")
        assert result == sample_firebase_token


@pytest.mark.asyncio
async def test_dev_bypass_mode(mock_firebase_auth, mock_user_service, sample_db_user):
    """Test development bypass mode"""
    # Setup - Create a mock request with dev bypass header
    mock_request = MagicMock()
    mock_request.headers = {"X-Dev-Bypass": "true"}
    
    # Mock the development environment check
    with patch('app.core.firebase_auth.settings.ENVIRONMENT', 'development'):
        # Mock the UserService to return a mock user
        mock_user_service.get_user_by_email.return_value = asyncio.Future()
        mock_user_service.get_user_by_email.return_value.set_result(sample_db_user)
        
        # Execute
        result = await get_current_user(request=mock_request)
        
        # Assert
        assert not mock_firebase_auth.verify_id_token.called
        assert result == sample_db_user
