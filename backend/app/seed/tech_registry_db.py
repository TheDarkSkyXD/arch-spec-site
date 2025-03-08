"""
Module for seeding tech registry data into the database.

This module provides functions to manage the technology registry in the database.
It handles creating, updating, and retrieving the registry data, ensuring that
the database stays in sync with the in-memory TECH_REGISTRY defined in tech_registry.py.

Key functions:
- seed_tech_registry: Seeds or updates the tech registry in the database
- get_registry_from_db: Retrieves the tech registry from the database

The module implements a smart synchronization mechanism that:
1. Detects new technologies added to the in-memory registry
2. Detects technologies removed from the in-memory registry
3. Updates the database to reflect these changes
4. Maintains a history of when changes occurred

See /app/seed/README.md for more detailed documentation.
"""
import logging
import datetime

from .tech_registry import (
    get_tech_registry_schema
)
from ..schemas.tech_registry_schema import (
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

logger = logging.getLogger(__name__)


async def seed_tech_registry(db, clean_all: bool = False):
    """
    Seed technology registry data into the database.
    If the registry already exists, check if it needs to be updated.
    
    Args:
        db: Database instance
        clean_all: If True, delete all existing records before inserting new ones
    """
    try:
        print("Starting tech registry seeding...")
        
        # Check if tech_registry collection exists and has data
        tech_registry_collection = db.get_collection("tech_registry")
        count = await tech_registry_collection.count_documents({})
        
        print(f"Found {count} existing tech registry documents in database")
        
        # Get the registry schema
        registry_schema = get_tech_registry_schema()
        
        # Prepare the data in a format suitable for the database
        registry_data = {
            "version": "1.0.0",
            "last_updated": datetime.datetime.now(datetime.UTC),
            "frontend": {
                "frameworks": registry_schema.frontend.frameworks,
                "languages": registry_schema.frontend.languages,
                "stateManagement": registry_schema.frontend.stateManagement,
                "uiLibraries": registry_schema.frontend.uiLibraries,
                "formHandling": registry_schema.frontend.formHandling,
                "routing": registry_schema.frontend.routing,
                "apiClients": registry_schema.frontend.apiClients,
                "metaFrameworks": registry_schema.frontend.metaFrameworks,
            },
            "backend": {
                "frameworks": registry_schema.backend.frameworks,
                "languages": registry_schema.backend.languages,
                "orms": registry_schema.backend.orms,
                "authFrameworks": registry_schema.backend.authFrameworks,
            },
            "database": {
                "relational": registry_schema.database.relational,
                "noSql": registry_schema.database.noSql,
                "providers": registry_schema.database.providers,
            },
            "authentication": {
                "providers": registry_schema.authentication.providers,
                "methods": registry_schema.authentication.methods,
            },
            "deployment": {
                "platforms": registry_schema.deployment.platforms,
                "containerization": registry_schema.deployment.containerization,
                "ci_cd": registry_schema.deployment.ci_cd,
            },
            "testing": {
                "unitTesting": registry_schema.testing.unitTesting,
                "e2eTesting": registry_schema.testing.e2eTesting,
                "apiTesting": registry_schema.testing.apiTesting,
            },
            "storage": {
                "objectStorage": registry_schema.storage.objectStorage,
                "fileSystem": registry_schema.storage.fileSystem,
            },
            "serverless": {
                "functions": registry_schema.serverless.functions,
                "platforms": registry_schema.serverless.platforms,
            },
            "all_technologies": list(registry_schema.all_technologies)
        }
        
        print(f"Prepared tech registry with {len(registry_schema.all_technologies)} technologies")
        logger.info(f"Prepared tech registry with {len(registry_schema.all_technologies)} technologies")
        
        if clean_all and count > 0:
            # Delete all existing records if clean_all is True
            print("Clean all option enabled. Removing all existing tech registry documents...")
            logger.info("Clean all option enabled. Removing all existing tech registry documents...")
            delete_result = await tech_registry_collection.delete_many({})
            print(f"Deleted {delete_result.deleted_count} tech registry documents")
            logger.info(f"Deleted {delete_result.deleted_count} tech registry documents")
            count = 0  # Reset count to 0 to force insertion of new records
        
        if count == 0:
            # No existing data, insert new record
            print("No existing tech registry, inserting new record...")
            logger.info("Seeding technology registry...")
            
            # Insert registry data
            result = await tech_registry_collection.insert_one(registry_data)
            
            print(f"Tech registry inserted with ID: {result.inserted_id}")
            logger.info(f"Tech registry inserted with ID: {result.inserted_id}")
            
            # Create index on technology names for faster lookups
            await tech_registry_collection.create_index("all_technologies")
            
            print("Created index on technology names")
            logger.info("Created index on technology names")
        else:
            # Registry already exists, check if it needs updating
            print(f"Tech registry already exists with {count} records. Checking for updates...")
            logger.info(f"Tech registry already exists with {count} records. Checking for updates...")
            
            # Get the current registry from the database
            existing_registry = await tech_registry_collection.find_one({})
            
            if existing_registry:
                # Compare the technologies in memory vs database
                if "all_technologies" in existing_registry:
                    db_techs = set(existing_registry["all_technologies"])
                    memory_techs = registry_schema.all_technologies
                    
                    # Get differences
                    new_techs = memory_techs - db_techs
                    removed_techs = db_techs - memory_techs
                    
                    print(f"Found {len(new_techs)} new and {len(removed_techs)} removed technologies")
                    
                    # If there are differences, update the database
                    if new_techs or removed_techs:
                        print(f"Found differences in tech registry. New: {len(new_techs)}, Removed: {len(removed_techs)}")
                        print(f"New technologies: {sorted(list(new_techs))}")
                        print(f"Removed technologies: {sorted(list(removed_techs))}")
                        
                        logger.info(f"Found differences in tech registry. New: {len(new_techs)}, Removed: {len(removed_techs)}")
                        logger.info(f"New technologies: {sorted(list(new_techs))}")
                        logger.info(f"Removed technologies: {sorted(list(removed_techs))}")
                        
                        # Replace the existing registry with the updated one
                        result = await tech_registry_collection.replace_one(
                            {"_id": existing_registry["_id"]},
                            registry_data
                        )
                        
                        print(f"Tech registry updated successfully. Modified count: {result.modified_count}")
                        logger.info(f"Tech registry updated successfully. Modified count: {result.modified_count}")
                    else:
                        print("Tech registry is up to date, no changes needed")
                        logger.info("Tech registry is up to date, no changes needed")
                else:
                    print("Existing registry doesn't have 'all_technologies' field, updating...")
                    # Replace the existing registry with the updated one
                    result = await tech_registry_collection.replace_one(
                        {"_id": existing_registry["_id"]},
                        registry_data
                    )
                    print(f"Tech registry updated with all_technologies field. Modified count: {result.modified_count}")
            else:
                print("Unexpected empty result when querying existing tech registry")
                logger.warning("Unexpected empty result when querying existing tech registry")
        
        print("Tech registry seeding complete!")
    
    except Exception as e:
        print(f"Error seeding tech registry: {str(e)}")
        logger.error(f"Error seeding tech registry: {str(e)}")
        raise


async def get_registry_from_db(db) -> TechRegistrySchema:
    """
    Get the technology registry from the database and convert it to a TechRegistrySchema.
    
    Args:
        db: Database instance
        
    Returns:
        TechRegistrySchema: The technology registry as a Pydantic model, or None if not found
    """
    try:
        tech_registry_collection = db.get_collection("tech_registry")
        registry_dict = await tech_registry_collection.find_one({})
        
        if not registry_dict:
            logger.warning("No tech registry found in database")
            return None
            
        # Convert MongoDB ObjectId to string for JSON serialization
        if "_id" in registry_dict:
            registry_dict["_id"] = str(registry_dict["_id"])
        
        # Convert from database format to TechRegistrySchema
        schema = TechRegistrySchema()
        
        # Create the schema from the database record
        frontend = registry_dict["frontend"]
        schema.frontend = FrontendTechnologies(
            frameworks=frontend.get("frameworks", []),
            languages=frontend.get("languages", []),
            stateManagement=frontend.get("stateManagement", []),
            uiLibraries=frontend.get("uiLibraries", []),
            formHandling=frontend.get("formHandling", []),
            routing=frontend.get("routing", []),
            apiClients=frontend.get("apiClients", []),
            metaFrameworks=frontend.get("metaFrameworks", []),
        )
        
        schema.backend = BackendTechnologies(
            frameworks=registry_dict["backend"].get("frameworks", []),
            languages=registry_dict["backend"].get("languages", []),
            orms=registry_dict["backend"].get("orms", []),
            authFrameworks=registry_dict["backend"].get("authFrameworks", []),
        )
        
        schema.database = DatabaseTechnologies(
            relational=registry_dict["database"].get("relational", []),
            noSql=registry_dict["database"].get("noSql", []),
            providers=registry_dict["database"].get("providers", []),
        )
        
        schema.authentication = AuthenticationTechnologies(
            providers=registry_dict["authentication"].get("providers", []),
            methods=registry_dict["authentication"].get("methods", []),
        )
        
        schema.deployment = DeploymentTechnologies(
            platforms=registry_dict["deployment"].get("platforms", []),
            containerization=registry_dict["deployment"].get("containerization", []),
            ci_cd=registry_dict["deployment"].get("ci_cd", []),
        )
        
        schema.testing = TestingTechnologies(
            unitTesting=registry_dict["testing"].get("unitTesting", []),
            e2eTesting=registry_dict["testing"].get("e2eTesting", []),
            apiTesting=registry_dict["testing"].get("apiTesting", []),
        )
        
        schema.storage = StorageTechnologies(
            objectStorage=registry_dict["storage"].get("objectStorage", []),
            fileSystem=registry_dict["storage"].get("fileSystem", []),
        )

        schema.serverless = ServerlessTechnologies(
            functions=registry_dict["serverless"].get("functions", []),
            platforms=registry_dict["serverless"].get("platforms", []),
        )
        
        # Set all_technologies from the database
        if "all_technologies" in registry_dict:
            schema.all_technologies = set(registry_dict["all_technologies"])
        
        return schema
    except Exception as e:
        logger.error(f"Error retrieving tech registry from database: {str(e)}")
        return None 