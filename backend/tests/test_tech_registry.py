"""
Tests for the tech registry module.
"""
import unittest
from app.seed.tech_registry import (
    is_valid_tech,
    get_category_for_tech,
    get_technologies_in_category,
    validate_template_tech_stack,
    TECH_REGISTRY,
    ALL_TECHNOLOGIES
)


class TestTechRegistry(unittest.TestCase):
    """Test cases for the tech registry module."""
    
    def test_registry_initialization(self):
        """Test that the registry is initialized correctly."""
        # Check that the registry is not empty
        self.assertTrue(len(TECH_REGISTRY) > 0)
        
        # Check that ALL_TECHNOLOGIES is populated
        self.assertTrue(len(ALL_TECHNOLOGIES) > 0)
        
        # Sample check for a few technologies
        self.assertIn("React", ALL_TECHNOLOGIES)
        self.assertIn("Express.js", ALL_TECHNOLOGIES)
        self.assertIn("PostgreSQL", ALL_TECHNOLOGIES)
    
    def test_is_valid_tech(self):
        """Test the is_valid_tech function."""
        # Test valid technologies
        self.assertTrue(is_valid_tech("React"))
        self.assertTrue(is_valid_tech("Vue.js"))
        self.assertTrue(is_valid_tech("Django"))
        
        # Test invalid technologies
        self.assertFalse(is_valid_tech("NotARealTech"))
        self.assertFalse(is_valid_tech("FakeTech"))
        self.assertFalse(is_valid_tech(""))
    
    def test_get_category_for_tech(self):
        """Test the get_category_for_tech function."""
        # Test valid technologies
        react_category = get_category_for_tech("React")
        self.assertIsNotNone(react_category)
        self.assertEqual(react_category["category"], "frontend")
        self.assertEqual(react_category["subcategory"], "frameworks")
        
        postgres_category = get_category_for_tech("PostgreSQL")
        self.assertIsNotNone(postgres_category)
        self.assertEqual(postgres_category["category"], "database")
        self.assertEqual(postgres_category["subcategory"], "relational")
        
        # Test invalid technology
        self.assertIsNone(get_category_for_tech("NotARealTech"))
    
    def test_get_technologies_in_category(self):
        """Test the get_technologies_in_category function."""
        # Get all frontend technologies
        frontend_techs = get_technologies_in_category("frontend")
        self.assertTrue(len(frontend_techs) > 0)
        self.assertIn("React", frontend_techs)
        self.assertIn("Vue.js", frontend_techs)
        
        # Get frontend frameworks specifically
        frontend_frameworks = get_technologies_in_category("frontend", "frameworks")
        self.assertTrue(len(frontend_frameworks) > 0)
        self.assertIn("React", frontend_frameworks)
        self.assertIn("Angular", frontend_frameworks)
        
        # Test invalid category
        self.assertEqual(get_technologies_in_category("not_a_category"), [])
        
        # Test valid category with invalid subcategory
        self.assertEqual(get_technologies_in_category("frontend", "not_a_subcategory"), [])
    
    def test_validate_template_tech_stack(self):
        """Test the validate_template_tech_stack function."""
        # Test a valid tech stack with the new structure
        valid_tech_stack = {
            "frontend": {
                "frameworks": [
                    {
                        "name": "React",
                        "description": "A JavaScript library for building user interfaces",
                        "language": "TypeScript",
                        "compatibility": {
                            "stateManagement": ["Redux"],
                            "uiLibraries": ["Material UI"]
                        }
                    }
                ]
            },
            "backend": {
                "frameworks": [
                    {
                        "name": "Express.js",
                        "description": "Fast, unopinionated, minimalist web framework for Node.js",
                        "language": "TypeScript",
                        "compatibility": {}
                    }
                ]
            },
            "database": {
                "sql": [
                    {
                        "name": "PostgreSQL",
                        "description": "Advanced open source relational database",
                        "compatibility": {}
                    }
                ]
            }
        }
        
        validation_result = validate_template_tech_stack(valid_tech_stack)
        self.assertTrue(validation_result["is_valid"])
        self.assertEqual(len(validation_result["invalid_technologies"]), 0)
        
        # Test a tech stack with invalid framework
        invalid_framework_stack = {
            "frontend": {
                "frameworks": [
                    {
                        "name": "FakeFramework",  # Invalid
                        "description": "Not a real framework",
                        "compatibility": {}
                    }
                ]
            }
        }
        
        # First, make sure FakeFramework is not in ALL_TECHNOLOGIES
        self.assertFalse(is_valid_tech("FakeFramework"))
        
        validation_result = validate_template_tech_stack(invalid_framework_stack)
        self.assertFalse(validation_result["is_valid"])
        self.assertEqual(len(validation_result["invalid_technologies"]), 1)
        
        # Test a tech stack with invalid compatibility option
        invalid_compatibility_stack = {
            "frontend": {
                "frameworks": [
                    {
                        "name": "React",
                        "description": "A JavaScript library for building user interfaces",
                        "compatibility": {
                            "stateManagement": ["NonExistentStateManager"]  # Invalid
                        }
                    }
                ]
            }
        }
        
        # Make sure NonExistentStateManager is not in ALL_TECHNOLOGIES
        self.assertFalse(is_valid_tech("NonExistentStateManager"))
        
        validation_result = validate_template_tech_stack(invalid_compatibility_stack)
        print(f"Debug - validation_result: {validation_result}")
        self.assertFalse(validation_result["is_valid"])
        self.assertEqual(len(validation_result["invalid_technologies"]), 1)
        
        # Test a tech stack with multiple invalid technologies
        multiple_invalid_stack = {
            "frontend": {
                "frameworks": [
                    {
                        "name": "React",
                        "description": "A JavaScript library for building user interfaces",
                        "compatibility": {
                            "stateManagement": ["NonExistentStateManager"]  # Invalid
                        }
                    }
                ]
            },
            "backend": {
                "frameworks": [
                    {
                        "name": "FakeFramework",  # Invalid
                        "description": "Not a real framework",
                        "compatibility": {}
                    }
                ]
            }
        }
        
        validation_result = validate_template_tech_stack(multiple_invalid_stack)
        self.assertFalse(validation_result["is_valid"])
        self.assertEqual(len(validation_result["invalid_technologies"]), 2)


if __name__ == "__main__":
    unittest.main() 