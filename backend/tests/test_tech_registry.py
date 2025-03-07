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
        # Test a valid tech stack
        valid_tech_stack = {
            "frontend": {
                "framework": "React",
                "language": "TypeScript",
                "stateManagement": "Redux",
                "uiLibrary": "Material UI"
            },
            "backend": {
                "framework": "Express.js",
                "language": "TypeScript"
            },
            "database": {
                "type": "PostgreSQL",
                "provider": "Supabase"
            }
        }
        
        validation_result = validate_template_tech_stack(valid_tech_stack)
        self.assertTrue(validation_result["is_valid"])
        self.assertEqual(len(validation_result["invalid_technologies"]), 0)
        
        # Test an invalid tech stack
        invalid_tech_stack = {
            "frontend": {
                "framework": "React",
                "language": "NotARealLanguage",  # Invalid
                "stateManagement": "Redux"
            },
            "backend": {
                "framework": "FakeFramework"  # Invalid
            }
        }
        
        validation_result = validate_template_tech_stack(invalid_tech_stack)
        self.assertFalse(validation_result["is_valid"])
        self.assertEqual(len(validation_result["invalid_technologies"]), 2)
        
        # Validate tech options list
        tech_with_options = {
            "frontend": {
                "framework": "React",
                "options": ["Redux", "Material UI", "FakeTech"]  # One invalid option
            }
        }
        
        validation_result = validate_template_tech_stack(tech_with_options)
        self.assertFalse(validation_result["is_valid"])
        self.assertEqual(len(validation_result["invalid_technologies"]), 1)


if __name__ == "__main__":
    unittest.main() 