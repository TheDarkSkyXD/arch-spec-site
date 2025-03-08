"""
Tests for the tech_registry_db module.

These tests ensure that the tech registry database operations work correctly
with the schema structure.
"""
import unittest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
import datetime

from app.seed.tech_registry_db import seed_tech_registry, get_registry_from_db
from app.seed.tech_registry import get_tech_registry_schema
from app.schemas.tech_registry_schema import (
    TechRegistrySchema,
    FrontendTechnologies,
    BackendTechnologies,
    DatabaseTechnologies,
    AuthenticationTechnologies,
    DeploymentTechnologies,
    TestingTechnologies,
    StorageTechnologies,
    ServerlessTechnologies
)


class TestTechRegistryDb(unittest.IsolatedAsyncioTestCase):
    """Test cases for the tech registry database operations."""
    
    async def asyncSetUp(self):
        """Set up test fixtures."""
        # Create a mock database
        self.db = MagicMock()
        self.collection = AsyncMock()
        self.db.get_collection.return_value = self.collection
    
    async def test_seed_tech_registry_new(self):
        """Test seeding a new tech registry."""
        # Set up the collection to have no documents
        self.collection.count_documents.return_value = 0
        self.collection.insert_one.return_value = MagicMock(inserted_id="test_id")
        
        # Call the function
        await seed_tech_registry(self.db, clean_all=False)
        
        # Verify the database interactions
        self.db.get_collection.assert_called_once_with("tech_registry")
        self.collection.count_documents.assert_called_once_with({})
        self.collection.insert_one.assert_called_once()
        self.collection.create_index.assert_called_once_with("all_technologies")
        
        # Verify the inserted document structure
        inserted_doc = self.collection.insert_one.call_args[0][0]
        self.assertEqual(inserted_doc["version"], "1.0.0")
        self.assertIsInstance(inserted_doc["last_updated"], datetime.datetime)
        
        # Check that all the expected categories are present
        self.assertIn("frontend", inserted_doc)
        self.assertIn("backend", inserted_doc)
        self.assertIn("database", inserted_doc)
        self.assertIn("authentication", inserted_doc)
        self.assertIn("deployment", inserted_doc)
        self.assertIn("testing", inserted_doc)
        self.assertIn("storage", inserted_doc)
        self.assertIn("serverless", inserted_doc)
        self.assertIn("all_technologies", inserted_doc)
    
    async def test_seed_tech_registry_update(self):
        """Test updating an existing tech registry."""
        # Set up the collection to have one document
        self.collection.count_documents.return_value = 1
        
        # Create a mock existing registry with some differences
        registry_schema = get_tech_registry_schema()
        all_techs = list(registry_schema.all_technologies)
        # Remove one tech and add a fake one
        existing_techs = all_techs.copy()
        if len(existing_techs) > 0:
            existing_techs.pop()
        existing_techs.append("FakeTech")
        
        self.collection.find_one.return_value = {
            "_id": "existing_id",
            "version": "1.0.0",
            "last_updated": datetime.datetime.now(datetime.UTC),
            "all_technologies": existing_techs
        }
        
        self.collection.replace_one.return_value = MagicMock(modified_count=1)
        
        # Call the function
        await seed_tech_registry(self.db, clean_all=False)
        
        # Verify the database interactions
        self.db.get_collection.assert_called_once_with("tech_registry")
        self.collection.count_documents.assert_called_once_with({})
        self.collection.find_one.assert_called_once_with({})
        self.collection.replace_one.assert_called_once()
        
        # Check replace_one arguments
        replace_args, replace_kwargs = self.collection.replace_one.call_args
        filter_doc, new_doc = replace_args
        self.assertEqual(filter_doc, {"_id": "existing_id"})
        self.assertEqual(new_doc["version"], "1.0.0")
        self.assertIsInstance(new_doc["last_updated"], datetime.datetime)
    
    async def test_seed_tech_registry_clean_all(self):
        """Test seeding with clean_all option enabled."""
        # Set up the collection to have documents
        self.collection.count_documents.return_value = 5
        self.collection.delete_many.return_value = MagicMock(deleted_count=5)
        self.collection.insert_one.return_value = MagicMock(inserted_id="test_id")
        
        # Call the function with clean_all=True
        await seed_tech_registry(self.db, clean_all=True)
        
        # Verify the database interactions
        self.db.get_collection.assert_called_with("tech_registry")
        self.collection.count_documents.assert_called_with({})
        self.collection.delete_many.assert_called_once_with({})
        self.collection.insert_one.assert_called_once()
        self.collection.create_index.assert_called_once_with("all_technologies")
        
        # Verify the inserted document structure
        inserted_doc = self.collection.insert_one.call_args[0][0]
        self.assertEqual(inserted_doc["version"], "1.0.0")
        self.assertIsInstance(inserted_doc["last_updated"], datetime.datetime)
    
    async def test_get_registry_from_db(self):
        """Test retrieving the tech registry from the database."""
        # Set up mock data
        mock_registry = {
            "_id": "test_id",
            "version": "1.0.0",
            "last_updated": datetime.datetime.now(datetime.UTC),
            "frontend": {
                "frameworks": ["React", "Vue.js"],
                "languages": ["JavaScript", "TypeScript"],
                "stateManagement": ["Redux", "Vuex"],
                "uiLibraries": ["Material UI", "Chakra UI"],
                "formHandling": ["React Hook Form", "Formik"],
                "routing": ["React Router", "Vue Router"],
                "apiClients": ["Axios", "TanStack Query"],
                "metaFrameworks": ["Next.js", "Nuxt.js"],
            },
            "backend": {
                "frameworks": ["Express.js", "Django"],
                "languages": ["JavaScript", "Python"],
                "orms": ["Sequelize", "Django ORM"],
                "authFrameworks": ["Passport.js", "Django Auth"],
            },
            "database": {
                "relational": ["PostgreSQL", "MySQL"],
                "noSql": ["MongoDB", "Firestore"],
                "providers": ["Supabase", "MongoDB Atlas"],
            },
            "authentication": {
                "providers": ["Supabase Auth", "Firebase Auth"],
                "methods": ["Email/Password", "Google"],
            },
            "deployment": {
                "platforms": ["Vercel", "Netlify"],
                "containerization": ["Docker", "Kubernetes"],
                "ci_cd": ["GitHub Actions", "GitLab CI"],
            },
            "testing": {
                "unitTesting": ["Jest", "pytest"],
                "e2eTesting": ["Cypress", "Playwright"],
                "apiTesting": ["Postman", "SuperTest"],
            },
            "storage": {
                "objectStorage": ["AWS S3", "Google Cloud Storage"],
                "fileSystem": ["Local File System", "Network File System"],
            },
            "serverless": {
                "functions": ["AWS Lambda", "Azure Functions"],
                "platforms": ["AWS Amplify", "Serverless Framework"],
            },
            "all_technologies": [
                "React", "Vue.js", "JavaScript", "TypeScript", "Redux", "Vuex",
                "Material UI", "Chakra UI", "React Hook Form", "Formik",
                "React Router", "Vue Router", "Axios", "TanStack Query",
                "Next.js", "Nuxt.js", "Express.js", "Django", "Python",
                "Sequelize", "Django ORM", "Passport.js", "Django Auth",
                "PostgreSQL", "MySQL", "MongoDB", "Firestore", "Supabase",
                "MongoDB Atlas", "Supabase Auth", "Firebase Auth", "Email/Password",
                "Google", "Vercel", "Netlify", "Docker", "Kubernetes",
                "GitHub Actions", "GitLab CI", "Jest", "pytest",
                "Cypress", "Playwright", "Postman", "SuperTest",
                "AWS S3", "Google Cloud Storage", "Local File System", "Network File System",
                "AWS Lambda", "Azure Functions", "AWS Amplify", "Serverless Framework"
            ]
        }
        
        self.collection.find_one.return_value = mock_registry
        
        # Call the function
        result = await get_registry_from_db(self.db)
        
        # Verify the database interactions
        self.db.get_collection.assert_called_once_with("tech_registry")
        self.collection.find_one.assert_called_once_with({})
        
        # Verify the result is a TechRegistrySchema instance
        self.assertIsInstance(result, TechRegistrySchema)
        
        # Verify the data was correctly mapped to the schema
        self.assertEqual(set(result.frontend.frameworks), set(mock_registry["frontend"]["frameworks"]))
        self.assertEqual(set(result.frontend.languages), set(mock_registry["frontend"]["languages"]))
        self.assertEqual(set(result.backend.frameworks), set(mock_registry["backend"]["frameworks"]))
        self.assertEqual(set(result.database.relational), set(mock_registry["database"]["relational"]))
        self.assertEqual(set(result.authentication.providers), set(mock_registry["authentication"]["providers"]))
        self.assertEqual(set(result.deployment.platforms), set(mock_registry["deployment"]["platforms"]))
        self.assertEqual(set(result.testing.unitTesting), set(mock_registry["testing"]["unitTesting"]))
        self.assertEqual(set(result.storage.objectStorage), set(mock_registry["storage"]["objectStorage"]))
        self.assertEqual(set(result.storage.fileSystem), set(mock_registry["storage"]["fileSystem"]))
        self.assertEqual(set(result.serverless.functions), set(mock_registry["serverless"]["functions"]))
        self.assertEqual(set(result.serverless.platforms), set(mock_registry["serverless"]["platforms"]))
        
        # Verify all_technologies was correctly set
        self.assertEqual(result.all_technologies, set(mock_registry["all_technologies"]))
    
    async def test_get_registry_from_db_not_found(self):
        """Test retrieving the tech registry when it doesn't exist."""
        self.collection.find_one.return_value = None
        
        # Call the function
        result = await get_registry_from_db(self.db)
        
        # Verify the database interactions
        self.db.get_collection.assert_called_once_with("tech_registry")
        self.collection.find_one.assert_called_once_with({})
        
        # Verify the result is None
        self.assertIsNone(result)


if __name__ == "__main__":
    unittest.main() 