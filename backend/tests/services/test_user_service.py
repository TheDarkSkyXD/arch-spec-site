import pytest
import asyncio
from datetime import datetime
from unittest.mock import patch, MagicMock, AsyncMock
from bson import ObjectId
from app.services.user_service import UserService
from app.db.base import db
from app.schemas.user import UserUpdate


@pytest.fixture
def mock_database():
    """Fixture to mock the database connection"""
    mock_db = MagicMock()
    mock_db.users = MagicMock()
    
    with patch('app.db.base.db.get_db', return_value=mock_db):
        yield mock_db


@pytest.fixture
def sample_user_data():
    """Sample user data for testing"""
    return {
        "_id": ObjectId(),
        "firebase_uid": "firebase123",
        "email": "test@example.com",
        "display_name": "Test User",
        "photo_url": "https://example.com/photo.jpg",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "is_active": True,
        "settings": {"theme": "dark"}
    }


@pytest.mark.asyncio
async def test_get_user_by_id(mock_database, sample_user_data):
    """Test getting a user by ID"""
    # Setup
    user_id = str(sample_user_data["_id"])
    mock_database.users.find_one.return_value = sample_user_data
    
    # Execute
    result = await UserService.get_user_by_id(user_id)
    
    # Assert
    mock_database.users.find_one.assert_called_once_with({"_id": ObjectId(user_id)})
    assert result == sample_user_data


@pytest.mark.asyncio
async def test_get_user_by_firebase_uid(mock_database, sample_user_data):
    """Test getting a user by Firebase UID"""
    # Setup
    firebase_uid = sample_user_data["firebase_uid"]
    mock_database.users.find_one.return_value = sample_user_data
    
    # Execute
    result = await UserService.get_user_by_firebase_uid(firebase_uid)
    
    # Assert
    mock_database.users.find_one.assert_called_once_with({"firebase_uid": firebase_uid})
    assert result == sample_user_data


@pytest.mark.asyncio
async def test_get_user_by_email(mock_database, sample_user_data):
    """Test getting a user by email"""
    # Setup
    email = sample_user_data["email"]
    mock_database.users.find_one.return_value = sample_user_data
    
    # Execute
    result = await UserService.get_user_by_email(email)
    
    # Assert
    mock_database.users.find_one.assert_called_once_with({"email": email})
    assert result == sample_user_data


@pytest.mark.asyncio
async def test_create_user(mock_database, sample_user_data):
    """Test creating a new user"""
    # Setup
    user_data = {
        "firebase_uid": "firebase123",
        "email": "test@example.com",
        "display_name": "Test User",
        "photo_url": "https://example.com/photo.jpg"
    }
    
    # Mock the get_user_by_firebase_uid to return None (user doesn't exist)
    with patch('app.services.user_service.UserService.get_user_by_firebase_uid', return_value=None) as mock_get_user:
        inserted_id = sample_user_data["_id"]
        mock_database.users.insert_one.return_value = MagicMock(inserted_id=inserted_id)
        
        # Mock get_user_by_id to return the sample user
        with patch('app.services.user_service.UserService.get_user_by_id', return_value=sample_user_data) as mock_get_by_id:
            # Execute
            result = await UserService.create_user(**user_data)
            
            # Assert
            mock_database.users.insert_one.assert_called_once()
            # Check that the insert_one call includes required fields
            insert_call_args = mock_database.users.insert_one.call_args[0][0]
            assert "firebase_uid" in insert_call_args
            assert "email" in insert_call_args
            assert "created_at" in insert_call_args
            assert "updated_at" in insert_call_args
            assert result == sample_user_data


@pytest.mark.asyncio
async def test_update_user(mock_database, sample_user_data):
    """Test updating a user"""
    # Setup
    user_id = str(sample_user_data["_id"])
    update_data = UserUpdate(display_name="Updated Name")
    
    updated_user = sample_user_data.copy()
    updated_user["display_name"] = "Updated Name"
    
    mock_database.users.update_one.return_value = MagicMock(modified_count=1)
    
    # Mock get_user_by_id to return the updated user
    with patch('app.services.user_service.UserService.get_user_by_id', return_value=updated_user) as mock_get_by_id:
        # Execute
        result = await UserService.update_user(user_id, update_data)
        
        # Assert
        mock_database.users.update_one.assert_called_once()
        # Check that the update includes the updated_at field
        update_call_args = mock_database.users.update_one.call_args[0][1]["$set"]
        assert "updated_at" in update_call_args
        assert result == updated_user


@pytest.mark.asyncio
async def test_delete_user(mock_database, sample_user_data):
    """Test deleting a user"""
    # Setup
    user_id = str(sample_user_data["_id"])
    
    mock_database.users.update_one.return_value = MagicMock(modified_count=1)
    
    # Execute
    result = await UserService.delete_user(user_id)
    
    # Assert
    mock_database.users.update_one.assert_called_once()
    call_args = mock_database.users.update_one.call_args
    assert call_args[0][0] == {"_id": ObjectId(user_id)}
    assert "is_active" in call_args[0][1]["$set"]
    assert call_args[0][1]["$set"]["is_active"] is False
    assert "updated_at" in call_args[0][1]["$set"]
    assert result is True


@pytest.mark.asyncio
async def test_update_user_settings(mock_database, sample_user_data):
    """Test updating user settings"""
    # Setup
    user_id = str(sample_user_data["_id"])
    settings = {"theme": "light", "notifications": True}
    
    updated_user = sample_user_data.copy()
    updated_user["settings"] = settings
    
    mock_database.users.update_one.return_value = MagicMock(modified_count=1)
    
    # Mock get_user_by_id to return the updated user
    with patch('app.services.user_service.UserService.get_user_by_id', return_value=updated_user) as mock_get_by_id:
        # Execute
        result = await UserService.update_user_settings(user_id, settings)
        
        # Assert
        mock_database.users.update_one.assert_called_once()
        update_call_args = mock_database.users.update_one.call_args[0][1]["$set"]
        assert "settings" in update_call_args
        assert "updated_at" in update_call_args
        assert result == updated_user
