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
        # Test a valid tech stack without template, using the new TechStackData format
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
            }
        }
        
        validation_result = validate_project_tech_stack(valid_tech_stack)
        self.assertTrue(validation_result["is_valid"])
        self.assertEqual(len(validation_result["invalid_technologies"]), 0)
        
        # Test validation against a template with the new format
        template_tech_stack = {
            "frontend": {
                "frameworks": [
                    {
                        "name": "React",
                        "description": "A JavaScript library for building user interfaces",
                        "language": "TypeScript",
                        "compatibility": {
                            "stateManagement": ["Context API", "Redux", "MobX"],
                            "uiLibraries": ["Tailwind CSS", "MUI", "Styled Components"]
                        }
                    }
                ]
            },
            "backend": {
                "frameworks": [],
                "baas": [
                    {
                        "name": "Supabase",
                        "description": "Open source Firebase alternative",
                        "compatibility": {
                            "options": ["Firebase", "Custom Express", "NestJS"]
                        }
                    }
                ]
            }
        }
        
        # Compatible tech stack (using template defaults)
        compatible_tech_stack = {
            "frontend": {
                "frameworks": [
                    {
                        "name": "React",
                        "description": "A JavaScript library for building user interfaces",
                        "language": "TypeScript",
                        "compatibility": {
                            "stateManagement": ["Context API"],
                            "uiLibraries": ["Tailwind CSS"]
                        }
                    }
                ]
            },
            "backend": {
                "frameworks": [],
                "baas": [
                    {
                        "name": "Supabase",
                        "description": "Open source Firebase alternative",
                        "compatibility": {}
                    }
                ]
            }
        }
        
        validation_result = validate_project_tech_stack(compatible_tech_stack, template_tech_stack)
        self.assertTrue(validation_result["is_valid"])
        self.assertTrue(validation_result["template_compatibility"]["is_compatible"])
        
        # Compatible tech stack (using template options)
        compatible_options_tech_stack = {
            "frontend": {
                "frameworks": [
                    {
                        "name": "React",
                        "description": "A JavaScript library for building user interfaces",
                        "language": "TypeScript",
                        "compatibility": {
                            "stateManagement": ["Redux"],  # From options
                            "uiLibraries": ["Tailwind CSS"]
                        }
                    }
                ]
            },
            "backend": {
                "frameworks": [],
                "baas": [
                    {
                        "name": "Firebase",  # From options
                        "description": "Platform developed by Google for mobile and web applications",
                        "compatibility": {}
                    }
                ]
            }
        }
        
        validation_result = validate_project_tech_stack(compatible_options_tech_stack, template_tech_stack)
        self.assertTrue(validation_result["is_valid"])
        self.assertTrue(validation_result["template_compatibility"]["is_compatible"])
        
        # Incompatible tech stack
        incompatible_tech_stack = {
            "frontend": {
                "frameworks": [
                    {
                        "name": "React",
                        "description": "A JavaScript library for building user interfaces",
                        "language": "TypeScript",
                        "compatibility": {
                            "stateManagement": ["Zustand"],  # Not in default or options
                            "uiLibraries": ["Tailwind CSS"]
                        }
                    }
                ]
            },
            "backend": {
                "frameworks": [],
                "baas": [
                    {
                        "name": "Supabase",
                        "description": "Open source Firebase alternative",
                        "compatibility": {}
                    }
                ]
            }
        }
        
        validation_result = validate_project_tech_stack(incompatible_tech_stack, template_tech_stack)
        self.assertTrue(validation_result["is_valid"])  # Still valid technologies
        self.assertFalse(validation_result["template_compatibility"]["is_compatible"])  # But not compatible with template
        self.assertEqual(len(validation_result["template_compatibility"]["incompatibilities"]), 1)
    
    def test_get_tech_suggestions(self):
        """Test the get_tech_suggestions function with the new schema format."""
        # Test suggestions for React frontend
        react_partial_stack = {
            "frontend": {
                "frameworks": [
                    {
                        "name": "React",
                        "description": "A JavaScript library for building user interfaces",
                        "compatibility": {}
                    }
                ]
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
                "frameworks": [
                    {
                        "name": "Vue.js",
                        "description": "The Progressive JavaScript Framework",
                        "compatibility": {}
                    }
                ]
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
                "frameworks": [
                    {
                        "name": "Express.js",
                        "description": "Fast, unopinionated, minimalist web framework for Node.js",
                        "compatibility": {}
                    }
                ]
            }
        }
        
        suggestions = get_tech_suggestions(backend_partial_stack)
        self.assertIn("backend", suggestions)
        self.assertIn("orm", suggestions["backend"])
        self.assertIn("Prisma", suggestions["backend"]["orm"])
        
        # Test invalid framework
        invalid_partial_stack = {
            "frontend": {
                "frameworks": [
                    {
                        "name": "InvalidFramework",
                        "description": "Non-existent framework",
                        "compatibility": {}
                    }
                ]
            }
        }
        
        suggestions = get_tech_suggestions(invalid_partial_stack)
        self.assertEqual(len(suggestions), 0)


if __name__ == "__main__":
    unittest.main() 