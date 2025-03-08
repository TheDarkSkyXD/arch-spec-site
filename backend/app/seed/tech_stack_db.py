"""
Tech Stack Database Operations.

This module provides functions to seed and retrieve tech stack compatibility data.
"""
import logging
import datetime
from typing import Dict, Any, Optional

from .tech_stack import TECH_STACK_RAW_DATA

logger = logging.getLogger(__name__)


async def seed_tech_stack(db, clean_all: bool = False):
    """
    Seed technology stack compatibility data into the database.
    If the tech stack data already exists, check if it needs to be updated.
    
    Args:
        db: Database instance
        clean_all: If True, delete all existing records before inserting new ones
    """
    try:
        print("Starting tech stack seeding...")
        
        # Check if tech_stack collection exists and has data
        tech_stack_collection = db.get_collection("tech_stack")
        count = await tech_stack_collection.count_documents({})
        
        print(f"Found {count} existing tech stack documents in database")
        
        # Prepare the data in a format suitable for the database
        tech_stack_data = {
            "version": "1.0.0",
            "last_updated": datetime.datetime.now(datetime.UTC),
            **TECH_STACK_RAW_DATA
        }
        
        if clean_all and count > 0:
            # Delete all existing records if clean_all is True
            print("Clean all option enabled. Removing all existing tech stack documents...")
            logger.info("Clean all option enabled. Removing all existing tech stack documents...")
            delete_result = await tech_stack_collection.delete_many({})
            print(f"Deleted {delete_result.deleted_count} tech stack documents")
            logger.info(f"Deleted {delete_result.deleted_count} tech stack documents")
            count = 0  # Reset count to 0 to force insertion of new records
        
        if count == 0:
            # No existing data, insert new record
            print("No existing tech stack data, inserting new record...")
            logger.info("Seeding technology stack compatibility data...")
            
            # Insert tech stack data
            result = await tech_stack_collection.insert_one(tech_stack_data)
            
            print(f"Tech stack data inserted with ID: {result.inserted_id}")
            logger.info(f"Tech stack data inserted with ID: {result.inserted_id}")
            
        else:
            # Data already exists, check if it needs updating
            print(f"Tech stack data already exists with {count} records. Checking for updates...")
            logger.info(f"Tech stack data already exists with {count} records. Checking for updates...")
            
            # Get the current data from the database
            existing_data = await tech_stack_collection.find_one({})
            
            if existing_data:
                # Replace the existing data with the updated one
                result = await tech_stack_collection.replace_one(
                    {"_id": existing_data["_id"]},
                    tech_stack_data
                )
                
                print(f"Tech stack data updated successfully. Modified count: {result.modified_count}")
                logger.info(f"Tech stack data updated successfully. Modified count: {result.modified_count}")
            else:
                print("Unexpected empty result when querying existing tech stack data")
                logger.warning("Unexpected empty result when querying existing tech stack data")
        
        print("Tech stack seeding complete!")
    
    except Exception as e:
        print(f"Error seeding tech stack data: {str(e)}")
        logger.error(f"Error seeding tech stack data: {str(e)}")
        raise


async def get_tech_stack_from_db(db) -> Optional[Dict[str, Any]]:
    """
    Get the technology stack compatibility data from the database.
    
    Args:
        db: Database instance
        
    Returns:
        Dict: The technology stack compatibility data, or None if not found
    """
    try:
        tech_stack_collection = db.get_collection("tech_stack")
        tech_stack_data = await tech_stack_collection.find_one({})
        
        if not tech_stack_data:
            logger.warning("Tech stack data not found in database")
            return None
            
        # Remove MongoDB _id field
        if "_id" in tech_stack_data:
            tech_stack_data.pop("_id")
            
        return tech_stack_data
    except Exception as e:
        logger.error(f"Error retrieving tech stack data: {str(e)}")
        raise