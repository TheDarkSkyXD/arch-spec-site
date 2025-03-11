"""
Tech Stack Database Operations.

This module provides functions to seed and retrieve tech stack compatibility data.
"""
import logging
import datetime
from typing import Dict, Any, Optional
from datetime import timezone
from app.seed.tech_stack_data import TECH_STACK_DATA

logger = logging.getLogger(__name__)


async def seed_tech_stack(db, clean_all: bool = False):
    """
    Seed technology stack compatibility data into the database.
    If the tech stack data already exists, skip the seeding process unless clean_all is True.
    
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
            "last_updated": datetime.datetime.now(timezone.utc),
            "data": TECH_STACK_DATA
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
            # Data already exists, skip the seeding process
            print("Tech stack data already exists, skipping seeding process")
            logger.info("Tech stack data already exists, skipping seeding process")
        
        print("Tech stack seeding complete!")
    
    except Exception as e:
        print(f"Error seeding tech stack data: {str(e)}")
        logger.error(f"Error seeding tech stack data: {str(e)}")
        raise
