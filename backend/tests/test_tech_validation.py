"""
Tests for the tech validation utility module.
"""
import unittest
from app.utils.tech_validation import (
    validate_project_tech_stack,
    get_tech_suggestions
)


class TestTechValidation(unittest.TestCase):
    """Test cases for the tech validation utility module."""
    
    def test_validate_project_tech_stack(self):
        """Test the validate_project_tech_stack function."""
        # Test a valid tech stack without template
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
            }
        }
        
        validation_result = validate_project_tech_stack(valid_tech_stack)
        self.assertTrue(validation_result["is_valid"])
        self.assertEqual(len(validation_result["invalid_technologies"]), 0)
        
        # Test validation against a template
        template_tech_stack = {
            "frontend": {
                "framework": "React",
                "language": "TypeScript",
                "stateManagement": "Context API",
                "uiLibrary": "Tailwind CSS",
                "options": ["Redux", "MUI", "Styled Components"]
            },
            "backend": {
                "type": "Serverless",
                "provider": "Supabase",
                "options": ["Firebase", "Custom Express", "NestJS"]
            }
        }
        
        # Compatible tech stack (using template defaults)
        compatible_tech_stack = {
            "frontend": {
                "framework": "React",
                "language": "TypeScript",
                "stateManagement": "Context API",
                "uiLibrary": "Tailwind CSS"
            },
            "backend": {
                "type": "Serverless",
                "provider": "Supabase"
            }
        }
        
        validation_result = validate_project_tech_stack(compatible_tech_stack, template_tech_stack)
        self.assertTrue(validation_result["is_valid"])
        self.assertTrue(validation_result["template_compatibility"]["is_compatible"])
        
        # Compatible tech stack (using template options)
        compatible_options_tech_stack = {
            "frontend": {
                "framework": "React",
                "language": "TypeScript",
                "stateManagement": "Redux",  # From options
                "uiLibrary": "Tailwind CSS"
            },
            "backend": {
                "type": "Serverless",
                "provider": "Firebase"  # From options
            }
        }
        
        validation_result = validate_project_tech_stack(compatible_options_tech_stack, template_tech_stack)
        self.assertTrue(validation_result["is_valid"])
        self.assertTrue(validation_result["template_compatibility"]["is_compatible"])
        
        # Incompatible tech stack
        incompatible_tech_stack = {
            "frontend": {
                "framework": "React",
                "language": "TypeScript",
                "stateManagement": "MobX",  # Not in default or options
                "uiLibrary": "Tailwind CSS"
            },
            "backend": {
                "type": "Serverless",
                "provider": "Supabase"
            }
        }
        
        validation_result = validate_project_tech_stack(incompatible_tech_stack, template_tech_stack)
        self.assertTrue(validation_result["is_valid"])  # Still valid technologies
        self.assertFalse(validation_result["template_compatibility"]["is_compatible"])  # But not compatible with template
        self.assertEqual(len(validation_result["template_compatibility"]["incompatibilities"]), 1)
    
    def test_get_tech_suggestions(self):
        """Test the get_tech_suggestions function."""
        # Test suggestions for React frontend
        react_partial_stack = {
            "frontend": {
                "framework": "React"
            }
        }
        
        suggestions = get_tech_suggestions(react_partial_stack)
        self.assertIn("frontend", suggestions)
        self.assertIn("stateManagement", suggestions["frontend"])
        self.assertIn("uiLibrary", suggestions["frontend"])
        self.assertIn("formHandling", suggestions["frontend"])
        
        # Check specific suggestions
        self.assertIn("Redux", suggestions["frontend"]["stateManagement"])
        self.assertIn("Context API", suggestions["frontend"]["stateManagement"])
        self.assertIn("Material UI", suggestions["frontend"]["uiLibrary"])
        self.assertIn("React Hook Form", suggestions["frontend"]["formHandling"])
        
        # Test suggestions for Vue frontend
        vue_partial_stack = {
            "frontend": {
                "framework": "Vue.js"
            }
        }
        
        suggestions = get_tech_suggestions(vue_partial_stack)
        self.assertIn("frontend", suggestions)
        self.assertIn("stateManagement", suggestions["frontend"])
        self.assertIn("Pinia", suggestions["frontend"]["stateManagement"])
        self.assertIn("Vuex", suggestions["frontend"]["stateManagement"])
        
        # Test suggestions for backend
        backend_partial_stack = {
            "backend": {
                "framework": "Express.js"
            }
        }
        
        suggestions = get_tech_suggestions(backend_partial_stack)
        self.assertIn("backend", suggestions)
        self.assertIn("orm", suggestions["backend"])
        self.assertIn("Prisma", suggestions["backend"]["orm"])
        
        # Test invalid framework
        invalid_partial_stack = {
            "frontend": {
                "framework": "InvalidFramework"
            }
        }
        
        suggestions = get_tech_suggestions(invalid_partial_stack)
        self.assertEqual(len(suggestions), 0)


if __name__ == "__main__":
    unittest.main() 