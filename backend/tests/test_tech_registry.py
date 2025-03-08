"""
Tests for the tech registry module.
"""
import unittest
from app.seed.tech_registry import (
    is_valid_tech,
    get_category_for_tech,
    get_technologies_in_category,
    validate_template_tech_stack,
    get_tech_registry_schema,
    validate_tech_stack_with_schema,
    get_all_technologies_in_category_with_schema,
    get_all_subcategories_with_schema,
    get_technologies_in_subcategory_with_schema,
    TECH_REGISTRY,
    ALL_TECHNOLOGIES
)
from app.schemas.tech_registry_schema import (
    TechRegistrySchema,
    TechStackValidationResult,
    InvalidTechnology,
    FrontendTechnologies,
    BackendTechnologies,
    DatabaseTechnologies,
    AuthenticationTechnologies,
    DeploymentTechnologies,
    TestingTechnologies,
    StorageTechnologies,
    ServerlessTechnologies
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
    
    def test_get_tech_registry_schema(self):
        """Test the get_tech_registry_schema function."""
        # Get the schema representation
        schema = get_tech_registry_schema()
        
        # Test the schema structure
        self.assertIsInstance(schema, TechRegistrySchema)
        self.assertEqual(schema.all_technologies, ALL_TECHNOLOGIES)
        
        # Test that frontend technologies are properly populated
        self.assertIsInstance(schema.frontend, FrontendTechnologies)
        self.assertEqual(set(schema.frontend.frameworks), set(TECH_REGISTRY["frontend"]["frameworks"]))
        self.assertEqual(set(schema.frontend.languages), set(TECH_REGISTRY["frontend"]["languages"]))
        self.assertEqual(set(schema.frontend.stateManagement), set(TECH_REGISTRY["frontend"]["stateManagement"]))
        self.assertEqual(set(schema.frontend.uiLibraries), set(TECH_REGISTRY["frontend"]["uiLibraries"]))
        self.assertEqual(set(schema.frontend.formHandling), set(TECH_REGISTRY["frontend"]["formHandling"]))
        self.assertEqual(set(schema.frontend.routing), set(TECH_REGISTRY["frontend"]["routing"]))
        self.assertEqual(set(schema.frontend.apiClients), set(TECH_REGISTRY["frontend"]["apiClients"]))
        self.assertEqual(set(schema.frontend.metaFrameworks), set(TECH_REGISTRY["frontend"]["metaFrameworks"]))
        
        # Test that backend technologies are properly populated
        self.assertIsInstance(schema.backend, BackendTechnologies)
        self.assertEqual(set(schema.backend.frameworks), set(TECH_REGISTRY["backend"]["frameworks"]))
        self.assertEqual(set(schema.backend.languages), set(TECH_REGISTRY["backend"]["languages"]))
        self.assertEqual(set(schema.backend.orms), set(TECH_REGISTRY["backend"]["orms"]))
        self.assertEqual(set(schema.backend.authFrameworks), set(TECH_REGISTRY["backend"]["authFrameworks"]))
        
        # Test that database technologies are properly populated
        self.assertIsInstance(schema.database, DatabaseTechnologies)
        self.assertEqual(set(schema.database.relational), set(TECH_REGISTRY["database"]["relational"]))
        self.assertEqual(set(schema.database.noSql), set(TECH_REGISTRY["database"]["noSql"]))
        self.assertEqual(set(schema.database.providers), set(TECH_REGISTRY["database"]["providers"]))
        
        # Test that authentication technologies are properly populated
        self.assertIsInstance(schema.authentication, AuthenticationTechnologies)
        self.assertEqual(set(schema.authentication.providers), set(TECH_REGISTRY["authentication"]["providers"]))
        self.assertEqual(set(schema.authentication.methods), set(TECH_REGISTRY["authentication"]["methods"]))
        
        # Test that deployment technologies are properly populated
        self.assertIsInstance(schema.deployment, DeploymentTechnologies)
        self.assertEqual(set(schema.deployment.platforms), set(TECH_REGISTRY["deployment"]["platforms"]))
        self.assertEqual(set(schema.deployment.containerization), set(TECH_REGISTRY["deployment"]["containerization"]))
        self.assertEqual(set(schema.deployment.ci_cd), set(TECH_REGISTRY["deployment"]["ci_cd"]))
        
        # Test that testing technologies are properly populated
        self.assertIsInstance(schema.testing, TestingTechnologies)
        self.assertEqual(set(schema.testing.unitTesting), set(TECH_REGISTRY["testing"]["unitTesting"]))
        self.assertEqual(set(schema.testing.e2eTesting), set(TECH_REGISTRY["testing"]["e2eTesting"]))
        self.assertEqual(set(schema.testing.apiTesting), set(TECH_REGISTRY["testing"]["apiTesting"]))
        
        # Test that storage technologies are properly populated
        self.assertIsInstance(schema.storage, StorageTechnologies)
        self.assertEqual(set(schema.storage.objectStorage), set(TECH_REGISTRY["storage"]["objectStorage"]))
        self.assertEqual(set(schema.storage.fileSystem), set(TECH_REGISTRY["storage"]["fileSystem"]))
        
        # Test that serverless technologies are properly populated
        self.assertIsInstance(schema.serverless, ServerlessTechnologies)
        self.assertEqual(set(schema.serverless.functions), set(TECH_REGISTRY["serverless"]["functions"]))
        self.assertEqual(set(schema.serverless.platforms), set(TECH_REGISTRY["serverless"]["platforms"]))
    
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
    
    def test_validate_tech_stack_with_schema(self):
        """Test the validate_tech_stack_with_schema function."""
        # Test a valid tech stack
        valid_tech_stack = {
            "frontend": {
                "frameworks": [
                    {
                        "name": "React",
                        "description": "A JavaScript library for building user interfaces",
                        "compatibility": {
                            "stateManagement": ["Redux"]
                        }
                    }
                ]
            }
        }
        
        validation_result = validate_tech_stack_with_schema(valid_tech_stack)
        self.assertIsInstance(validation_result, TechStackValidationResult)
        self.assertTrue(validation_result.is_valid)
        self.assertEqual(len(validation_result.invalid_technologies), 0)
        
        # Test an invalid tech stack
        invalid_tech_stack = {
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
        
        validation_result = validate_tech_stack_with_schema(invalid_tech_stack)
        self.assertIsInstance(validation_result, TechStackValidationResult)
        self.assertFalse(validation_result.is_valid)
        self.assertEqual(len(validation_result.invalid_technologies), 1)
        
        # Test the InvalidTechnology schema
        invalid_tech = validation_result.invalid_technologies[0]
        self.assertIsInstance(invalid_tech, InvalidTechnology)
        self.assertEqual(invalid_tech.section, "frontend")
        self.assertEqual(invalid_tech.key, "frameworks")
        self.assertEqual(invalid_tech.technology, "FakeFramework")
    
    def test_get_all_technologies_in_category_with_schema(self):
        """Test the get_all_technologies_in_category_with_schema function."""
        # Test a valid category
        frontend_techs = get_all_technologies_in_category_with_schema("frontend")
        self.assertIsNotNone(frontend_techs)
        self.assertTrue(len(frontend_techs) > 0)
        self.assertIn("React", frontend_techs)
        self.assertIn("TypeScript", frontend_techs)
        
        # Compare with standard function
        standard_frontend_techs = get_technologies_in_category("frontend")
        self.assertEqual(set(frontend_techs), set(standard_frontend_techs))
        
        # Test an invalid category
        invalid_category = get_all_technologies_in_category_with_schema("not_a_category")
        self.assertIsNone(invalid_category)
    
    def test_get_all_subcategories_with_schema(self):
        """Test the get_all_subcategories_with_schema function."""
        # Test a valid category
        frontend_subcats = get_all_subcategories_with_schema("frontend")
        self.assertIsNotNone(frontend_subcats)
        self.assertTrue(len(frontend_subcats) > 0)
        self.assertIn("frameworks", frontend_subcats)
        self.assertIn("languages", frontend_subcats)
        
        # Compare with registry keys
        standard_subcats = list(TECH_REGISTRY["frontend"].keys())
        self.assertEqual(set(frontend_subcats), set(standard_subcats))
        
        # Test an invalid category
        invalid_category = get_all_subcategories_with_schema("not_a_category")
        self.assertIsNone(invalid_category)
    
    def test_get_technologies_in_subcategory_with_schema(self):
        """Test the get_technologies_in_subcategory_with_schema function."""
        # Test a valid category and subcategory
        frontend_frameworks = get_technologies_in_subcategory_with_schema("frontend", "frameworks")
        self.assertIsNotNone(frontend_frameworks)
        self.assertTrue(len(frontend_frameworks) > 0)
        self.assertIn("React", frontend_frameworks)
        self.assertIn("Angular", frontend_frameworks)
        
        # Compare with standard function
        standard_frontend_frameworks = get_technologies_in_category("frontend", "frameworks")
        self.assertEqual(set(frontend_frameworks), set(standard_frontend_frameworks))
        
        # Test an invalid category
        invalid_category = get_technologies_in_subcategory_with_schema("not_a_category", "frameworks")
        self.assertIsNone(invalid_category)
        
        # Test a valid category with an invalid subcategory
        invalid_subcategory = get_technologies_in_subcategory_with_schema("frontend", "not_a_subcategory")
        self.assertIsNone(invalid_subcategory)


if __name__ == "__main__":
    unittest.main() 