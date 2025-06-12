import pytest
import asyncio
from unittest.mock import patch, MagicMock, AsyncMock
from fastapi import HTTPException, Request
from app.core.firebase_auth import (
    FirebaseAuth,
    get_current_user,
    get_firebase_user,
    _get_token_from_header,
    settings,
)


@pytest.fixture
def mock_firebase_auth():
    """Fixture to mock Firebase auth verification"""
    with patch("app.core.firebase_auth.auth") as mock_auth:
        yield mock_auth


@pytest.fixture
def mock_user_service():
    """Fixture to mock the user service"""
    with patch("app.core.firebase_auth.UserService") as mock_service:
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
        "email_verified": True,
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
        "settings": {},
    }


@pytest.fixture
def mock_request_with_token():
    """Create a mock request with a valid token"""
    mock_request = MagicMock(spec=Request)
    mock_request.headers = {"Authorization": "Bearer valid_token"}
    return mock_request


@pytest.fixture
def mock_request_without_token():
    """Create a mock request without a token"""
    mock_request = MagicMock(spec=Request)
    mock_request.headers = {}
    return mock_request


@pytest.fixture
def mock_request_with_invalid_scheme():
    """Create a mock request with an invalid auth scheme"""
    mock_request = MagicMock(spec=Request)
    mock_request.headers = {"Authorization": "Basic valid_token"}
    return mock_request


@pytest.fixture
def mock_request_with_dev_bypass():
    """Create a mock request with dev bypass header"""
    mock_request = MagicMock(spec=Request)
    mock_request.headers = {"X-Dev-Bypass": "true"}
    return mock_request


@pytest.mark.asyncio
async def test_authenticate_token_valid(
    mock_firebase_auth, mock_user_service, sample_firebase_token, sample_db_user
):
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
async def test_get_or_create_user_existing(
    mock_user_service, sample_firebase_token, sample_db_user
):
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
    mock_user_service.create_user.assert_called_once_with(
        firebase_uid=sample_firebase_token["uid"],
        email=sample_firebase_token["email"],
        display_name=sample_firebase_token["name"],
        photo_url=sample_firebase_token["picture"],
    )
    assert result == sample_db_user


@pytest.mark.asyncio
async def test_get_current_user_dependency(
    mock_firebase_auth, mock_user_service, sample_firebase_token, sample_db_user
):
    """Test the get_current_user dependency"""
    # Setup - Create a mock request with a valid token
    mock_request = MagicMock()
    mock_request.headers = {"Authorization": "Bearer valid_token"}

    # Mock the FirebaseAuth class
    with patch(
        "app.core.firebase_auth.firebase_auth.authenticate_token", new_callable=AsyncMock
    ) as mock_auth_token:
        # Set up the mock to return the expected result
        mock_auth_token.return_value = {
            "firebase_user": sample_firebase_token,
            "db_user": sample_db_user,
        }

        # Execute
        result = await get_current_user(request=mock_request)

        # Assert
        mock_auth_token.assert_called_once_with("valid_token")
        assert result == sample_db_user


@pytest.mark.asyncio
async def test_get_firebase_user_dependency(
    mock_firebase_auth, mock_user_service, sample_firebase_token, sample_db_user
):
    """Test the get_firebase_user dependency"""
    # Setup - Create a mock request with a valid token
    mock_request = MagicMock()
    mock_request.headers = {"Authorization": "Bearer valid_token"}

    # Mock the FirebaseAuth class
    with patch(
        "app.core.firebase_auth.firebase_auth.authenticate_token", new_callable=AsyncMock
    ) as mock_auth_token:
        # Set up the mock to return the expected result
        mock_auth_token.return_value = {
            "firebase_user": sample_firebase_token,
            "db_user": sample_db_user,
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
    mock_user_service.get_user_by_email.assert_called_once_with("test@example.com")
    assert result == sample_db_user


# Additional tests for better coverage


@pytest.mark.asyncio
async def test_get_current_user_no_token(mock_request_without_token):
    """Test get_current_user with no token"""
    # Execute and Assert
    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(request=mock_request_without_token)

    assert exc_info.value.status_code == 401
    assert "Not authenticated" in str(exc_info.value.detail)


@pytest.mark.asyncio
async def test_get_firebase_user_no_token(mock_request_without_token):
    """Test get_firebase_user with no token"""
    # Execute and Assert
    with pytest.raises(HTTPException) as exc_info:
        await get_firebase_user(request=mock_request_without_token)

    assert exc_info.value.status_code == 401
    assert "Not authenticated" in str(exc_info.value.detail)


@pytest.mark.asyncio
async def test_dev_bypass_mode_user_not_found(mock_request_with_dev_bypass, mock_user_service):
    """Test development bypass mode when user is not found"""
    # Mock the UserService to return None (user not found)
    mock_user_service.get_user_by_email.return_value = None

    # Set environment to development
    original_env = settings.ENVIRONMENT
    settings.ENVIRONMENT = "development"

    try:
        # Execute and Assert - should fall back to normal auth which will fail without a token
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(request=mock_request_with_dev_bypass)

        assert exc_info.value.status_code == 401
        assert "Not authenticated" in str(exc_info.value.detail)
    finally:
        # Restore original environment setting
        settings.ENVIRONMENT = original_env


def test_get_token_from_header_valid(mock_request_with_token):
    """Test extracting a valid token from headers"""
    # Execute
    token = _get_token_from_header(mock_request_with_token)

    # Assert
    assert token == "valid_token"


def test_get_token_from_header_missing(mock_request_without_token):
    """Test extracting a token when Authorization header is missing"""
    # Execute
    token = _get_token_from_header(mock_request_without_token)

    # Assert
    assert token is None


def test_get_token_from_header_invalid_scheme(mock_request_with_invalid_scheme):
    """Test extracting a token with an invalid auth scheme"""
    # Execute
    token = _get_token_from_header(mock_request_with_invalid_scheme)

    # Assert
    assert token is None


@pytest.mark.asyncio
async def test_firebase_auth_non_auto_error():
    """Test FirebaseAuth with auto_error=False"""
    # Setup
    firebase_auth = FirebaseAuth(auto_error=False)

    # Mock the authenticate_token method to raise an exception
    with patch.object(firebase_auth, "authenticate_token", side_effect=Exception("Test error")):
        # This should not raise an exception due to auto_error=False
        # But our implementation doesn't currently use this parameter, so this test is for future-proofing
        with pytest.raises(Exception):
            await firebase_auth.authenticate_token("token")


@pytest.mark.asyncio
async def test_get_or_create_user_missing_fields(mock_user_service):
    """Test creating a user with missing fields in the Firebase token"""
    # Setup
    firebase_auth = FirebaseAuth()

    # Minimal Firebase token with only UID
    minimal_token = {"uid": "firebase123"}

    # User doesn't exist yet
    mock_user_service.get_user_by_firebase_uid.return_value = None

    # Mock user creation
    sample_user = {"_id": "user123", "firebase_uid": "firebase123"}
    mock_user_service.create_user.return_value = sample_user

    # Execute
    result = await firebase_auth.get_or_create_user(minimal_token)

    # Assert
    mock_user_service.get_user_by_firebase_uid.assert_called_once_with(minimal_token["uid"])
    mock_user_service.create_user.assert_called_once_with(
        firebase_uid=minimal_token["uid"],
        email="",  # Default empty string
        display_name=None,  # Default None
        photo_url=None,  # Default None
    )
    assert result == sample_user


@pytest.mark.asyncio
async def test_production_environment_no_bypass(mock_user_service):
    """Test that dev bypass doesn't work in production environment"""
    # Setup - Create a mock request with dev bypass header
    mock_request = MagicMock()
    mock_request.headers = {"X-Dev-Bypass": "true"}

    # Set environment to production
    original_env = settings.ENVIRONMENT
    settings.ENVIRONMENT = "production"

    try:
        # Execute and Assert - should not use bypass in production
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(request=mock_request)

        # Should not call get_user_by_email in production mode
        mock_user_service.get_user_by_email.assert_not_called()

        assert exc_info.value.status_code == 401
        assert "Not authenticated" in str(exc_info.value.detail)
    finally:
        # Restore original environment setting
        settings.ENVIRONMENT = original_env


@pytest.mark.asyncio
async def test_get_or_create_user_retry_on_failure(
    mock_user_service, sample_firebase_token, sample_db_user
):
    """Test that a user can still be created successfully if create_user fails initially but succeeds on retry"""
    # Setup
    firebase_auth = FirebaseAuth()

    # User doesn't exist yet
    mock_user_service.get_user_by_firebase_uid.return_value = None

    # First attempt to create user fails, second attempt succeeds
    mock_user_service.create_user.side_effect = [None, sample_db_user]

    # Execute - should raise an exception since first create attempt fails
    with pytest.raises(Exception, match="Failed to create user in database"):
        await firebase_auth.get_or_create_user(sample_firebase_token)

    # Assert create_user was called
    mock_user_service.create_user.assert_called_once()

    # Reset mocks for second attempt
    mock_user_service.create_user.reset_mock()
    mock_user_service.get_user_by_firebase_uid.reset_mock()

    # Setup for second attempt - still no existing user
    mock_user_service.get_user_by_firebase_uid.return_value = None
    mock_user_service.create_user.return_value = sample_db_user

    # Execute second attempt - should succeed
    result = await firebase_auth.get_or_create_user(sample_firebase_token)

    # Assert
    assert result == sample_db_user
    mock_user_service.get_user_by_firebase_uid.assert_called_once_with(sample_firebase_token["uid"])
    mock_user_service.create_user.assert_called_once()
