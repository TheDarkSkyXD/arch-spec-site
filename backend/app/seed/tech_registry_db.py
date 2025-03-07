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
from typing import Dict, List, Any, Set

from .tech_registry import TECH_REGISTRY, ALL_TECHNOLOGIES

logger = logging.getLogger(__name__)


async def seed_tech_registry(db):
    """
    Seed technology registry data into the database.
    If the registry already exists, check if it needs to be updated.
    
    Args:
        db: Database instance
    """
    try:
        print("Starting tech registry seeding...")
        
        # Check if tech_registry collection exists and has data
        tech_registry_collection = db.get_collection("tech_registry")
        count = await tech_registry_collection.count_documents({})
        
        print(f"Found {count} existing tech registry documents in database")
        
        # Prepare the data in a format suitable for the database
        registry_data = {
            "version": "1.0.0",
            "last_updated": datetime.datetime.utcnow(),
            "categories": []
        }
        
        # Convert the registry structure for database storage
        for category, subcategories in TECH_REGISTRY.items():
            category_data = {
                "name": category,
                "subcategories": []
            }
            
            for subcategory, technologies in subcategories.items():
                subcategory_data = {
                    "name": subcategory,
                    "technologies": technologies
                }
                category_data["subcategories"].append(subcategory_data)
            
            registry_data["categories"].append(category_data)
        
        # Add the flat list for quick lookup
        registry_data["all_technologies"] = list(ALL_TECHNOLOGIES)
        print(f"Prepared tech registry with {len(ALL_TECHNOLOGIES)} technologies")
        logger.info(f"Prepared tech registry with {len(ALL_TECHNOLOGIES)} technologies")
        
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
                    memory_techs = ALL_TECHNOLOGIES
                    
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


async def get_registry_from_db(db):
    """
    Get the technology registry from the database.
    
    Args:
        db: Database instance
        
    Returns:
        The technology registry data or None if not found
    """
    try:
        tech_registry_collection = db.get_collection("tech_registry")
        registry = await tech_registry_collection.find_one({})
        
        if registry and "_id" in registry:
            # Convert MongoDB ObjectId to string for JSON serialization
            registry["_id"] = str(registry["_id"])
            
        return registry
    except Exception as e:
        logger.error(f"Error retrieving tech registry from database: {str(e)}")
        return None 