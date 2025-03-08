import pytest
import asyncio
from datetime import datetime, UTC
from unittest.mock import patch, MagicMock, AsyncMock
from bson import ObjectId
from app.services.user_service import UserService
from app.db.base import db
from app.schemas.user import UserUpdate


@pytest.fixture
def mock_database():
    """Fixture to mock the database connection"""
    mock_db = MagicMock()
    # Use MagicMock for the users collection but AsyncMock for the methods that are awaited
    mock_db.users = MagicMock()
    mock_db.users.find_one = AsyncMock()
    mock_db.users.insert_one = AsyncMock()
    mock_db.users.update_one = AsyncMock()
    
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
        "created_at": datetime.now(UTC),
        "updated_at": datetime.now(UTC),
        "is_active": True,
        "settings": {"theme": "dark"}
    }


@pytest.fixture
def sample_user_data_with_string_id(sample_user_data):
    """Sample user data with _id converted to string"""
    result = sample_user_data.copy()
    result["_id"] = str(result["_id"])
    return result


@pytest.mark.asyncio
async def test_get_user_by_id(mock_database, sample_user_data, sample_user_data_with_string_id):
    """Test getting a user by ID"""
    # Setup
    user_id = str(sample_user_data["_id"])
    mock_database.users.find_one.return_value = sample_user_data
    
    # Execute
    result = await UserService.get_user_by_id(user_id)
    
    # Assert
    mock_database.users.find_one.assert_called_once_with({"_id": ObjectId(user_id)})
    assert result == sample_user_data_with_string_id


@pytest.mark.asyncio
async def test_get_user_by_firebase_uid(mock_database, sample_user_data, sample_user_data_with_string_id):
    """Test getting a user by Firebase UID"""
    # Setup
    firebase_uid = sample_user_data["firebase_uid"]
    mock_database.users.find_one.return_value = sample_user_data
    
    # Execute
    result = await UserService.get_user_by_firebase_uid(firebase_uid)
    
    # Assert
    mock_database.users.find_one.assert_called_once_with({"firebase_uid": firebase_uid})
    assert result == sample_user_data_with_string_id


@pytest.mark.asyncio
async def test_get_user_by_email(mock_database, sample_user_data, sample_user_data_with_string_id):
    """Test getting a user by email"""
    # Setup
    email = sample_user_data["email"]
    mock_database.users.find_one.return_value = sample_user_data
    
    # Execute
    result = await UserService.get_user_by_email(email)
    
    # Assert
    mock_database.users.find_one.assert_called_once_with({"email": email})
    assert result == sample_user_data_with_string_id


@pytest.mark.asyncio
async def test_create_user(mock_database, sample_user_data, sample_user_data_with_string_id):
    """Test creating a new user"""
    # Setup
    user_data = {
        "firebase_uid": "firebase123",
        "email": "test@example.com",
        "display_name": "Test User",
        "photo_url": "https://example.com/photo.jpg"
    }
    
    # Mock the get_user_by_firebase_uid to return None (user doesn't exist)
    with patch('app.services.user_service.UserService.get_user_by_firebase_uid', new_callable=AsyncMock, return_value=None):
        inserted_id = sample_user_data["_id"]
        # Create a regular MagicMock for the result since it's not awaited
        mock_result = MagicMock()
        mock_result.inserted_id = inserted_id
        mock_database.users.insert_one.return_value = mock_result
        
        # Mock get_user_by_id to return the sample user with string ID
        with patch('app.services.user_service.UserService.get_user_by_id', new_callable=AsyncMock, return_value=sample_user_data_with_string_id):
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
            assert result == sample_user_data_with_string_id


@pytest.mark.asyncio
async def test_update_user(mock_database, sample_user_data, sample_user_data_with_string_id):
    """Test updating a user"""
    # Setup
    user_id = str(sample_user_data["_id"])
    update_data = UserUpdate(display_name="Updated Name")
    
    updated_user = sample_user_data.copy()
    updated_user["display_name"] = "Updated Name"
    
    updated_user_with_string_id = sample_user_data_with_string_id.copy()
    updated_user_with_string_id["display_name"] = "Updated Name"
    
    # Create a regular MagicMock for the result since it's not awaited
    mock_result = MagicMock()
    mock_result.modified_count = 1
    mock_database.users.update_one.return_value = mock_result
    
    # Mock get_user_by_id to return the updated user with string ID
    with patch('app.services.user_service.UserService.get_user_by_id', new_callable=AsyncMock, return_value=updated_user_with_string_id):
        # Execute
        result = await UserService.update_user(user_id, update_data)
        
        # Assert
        mock_database.users.update_one.assert_called_once()
        # Check that the update includes the updated_at field
        update_call_args = mock_database.users.update_one.call_args[0][1]["$set"]
        assert "updated_at" in update_call_args
        assert result == updated_user_with_string_id


@pytest.mark.asyncio
async def test_delete_user(mock_database, sample_user_data):
    """Test deleting a user"""
    # Setup
    user_id = str(sample_user_data["_id"])
    
    # Create a regular MagicMock for the result since it's not awaited
    mock_result = MagicMock()
    mock_result.modified_count = 1
    mock_database.users.update_one.return_value = mock_result
    
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
async def test_update_user_settings(mock_database, sample_user_data, sample_user_data_with_string_id):
    """Test updating user settings"""
    # Setup
    user_id = str(sample_user_data["_id"])
    settings = {"theme": "light", "notifications": True}
    
    updated_user = sample_user_data.copy()
    updated_user["settings"] = settings
    
    updated_user_with_string_id = sample_user_data_with_string_id.copy()
    updated_user_with_string_id["settings"] = settings
    
    # Create a regular MagicMock for the result since it's not awaited
    mock_result = MagicMock()
    mock_result.modified_count = 1
    mock_database.users.update_one.return_value = mock_result
    
    # Mock get_user_by_id to return the updated user with string ID
    with patch('app.services.user_service.UserService.get_user_by_id', new_callable=AsyncMock, return_value=updated_user_with_string_id):
        # Execute
        result = await UserService.update_user_settings(user_id, settings)
        
        # Assert
        mock_database.users.update_one.assert_called_once()
        update_call_args = mock_database.users.update_one.call_args[0][1]["$set"]
        assert "settings" in update_call_args
        assert "updated_at" in update_call_args
        assert result == updated_user_with_string_id


def test_prepare_user_document():
    """Test that the _prepare_user_document method correctly converts ObjectId to string."""
    # Test with None
    assert UserService._prepare_user_document(None) is None
    
    # Test with document containing ObjectId
    obj_id = ObjectId()
    user_doc = {
        "_id": obj_id,
        "name": "Test User",
        "email": "test@example.com"
    }
    
    # Process the document
    processed_doc = UserService._prepare_user_document(user_doc)
    
    # Verify _id is converted to string
    assert "_id" in processed_doc
    assert isinstance(processed_doc["_id"], str)
    assert processed_doc["_id"] == str(obj_id)
    
    # Verify other fields are unchanged
    assert processed_doc["name"] == "Test User"
    assert processed_doc["email"] == "test@example.com"
    
    # Test with document that doesn't have ObjectId
    user_doc_no_id = {
        "name": "Test User",
        "email": "test@example.com"
    }
    
    # Process the document
    processed_doc_no_id = UserService._prepare_user_document(user_doc_no_id)
    
    # Verify it's returned unchanged
    assert processed_doc_no_id == user_doc_no_id
