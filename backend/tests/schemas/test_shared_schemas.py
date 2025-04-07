"""
Tests for shared schema validation.
"""

import pytest
from app.schemas.shared_schemas import EntityField, Entity, Relationship, DataModel


def test_entity_field_default_value_conversion():
    """Test that EntityField converts non-string default values to strings."""
    # Test with integer default
    field_with_int = EntityField(name="count", type="integer", default="0")
    assert field_with_int.default == "0"
    assert isinstance(field_with_int.default, str)

    # Test with boolean default
    field_with_bool = EntityField(name="is_active", type="boolean", default="True")
    assert field_with_bool.default == "True"
    assert isinstance(field_with_bool.default, str)

    # Test with float default
    field_with_float = EntityField(name="price", type="decimal", default="10.5")
    assert field_with_float.default == "10.5"
    assert isinstance(field_with_float.default, str)

    # Test with string default (should remain unchanged)
    field_with_string = EntityField(name="name", type="string", default="default_name")
    assert field_with_string.default == "default_name"
    assert isinstance(field_with_string.default, str)


def test_entity_field_validator():
    """Test that the model validator actually converts values."""
    # Call the validator directly
    raw_data = {"name": "count", "type": "integer", "default": 0}
    validated_data = EntityField.validate_default_value(raw_data)
    assert validated_data["default"] == "0"
    assert isinstance(validated_data["default"], str)

    # Boolean conversion
    raw_data = {"name": "active", "type": "boolean", "default": True}
    validated_data = EntityField.validate_default_value(raw_data)
    assert validated_data["default"] == "True"
    assert isinstance(validated_data["default"], str)

    # Float conversion
    raw_data = {"name": "price", "type": "decimal", "default": 99.99}
    validated_data = EntityField.validate_default_value(raw_data)
    assert validated_data["default"] == "99.99"
    assert isinstance(validated_data["default"], str)

    # None should not be converted
    raw_data = {"name": "optional", "type": "string", "default": None}
    validated_data = EntityField.validate_default_value(raw_data)
    assert validated_data["default"] is None


def test_relationship_validation():
    """Test that Relationship model accepts from_entity and to_entity fields."""
    relationship = Relationship(
        type="oneToOne", from_entity="User", to_entity="Profile", field="user_id"
    )

    assert relationship.from_entity == "User"
    assert relationship.to_entity == "Profile"
    assert relationship.field == "user_id"
    assert relationship.type == "oneToOne"


def test_data_model_integration():
    """Test the DataModel with entities and relationships."""
    data_model = DataModel(
        entities=[
            Entity(
                name="User",
                description="User entity",
                fields=[
                    EntityField(name="id", type="uuid", primaryKey=True, generated=True),
                    EntityField(name="name", type="string", required=True),
                    EntityField(name="count", type="integer", default="0"),
                ],
            ),
            Entity(
                name="Profile",
                description="Profile entity",
                fields=[
                    EntityField(name="id", type="uuid", primaryKey=True, generated=True),
                    EntityField(name="bio", type="text"),
                    EntityField(name="user_id", type="uuid", required=True),
                ],
            ),
        ],
        relationships=[
            Relationship(type="oneToOne", from_entity="User", to_entity="Profile", field="user_id")
        ],
    )

    # Validate entities
    assert len(data_model.entities) == 2
    assert data_model.entities[0].name == "User"
    assert data_model.entities[1].name == "Profile"

    # Check default value
    assert data_model.entities[0].fields[2].default == "0"
    assert isinstance(data_model.entities[0].fields[2].default, str)

    # Validate relationship
    assert len(data_model.relationships) == 1
    assert data_model.relationships[0].from_entity == "User"
    assert data_model.relationships[0].to_entity == "Profile"
