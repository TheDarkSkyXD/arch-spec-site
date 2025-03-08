#!/usr/bin/env python
import asyncio
import argparse
import logging
import sys

# Add parent directory to path so we can import from app
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.seed.tech_registry_db import seed_tech_registry
from app.seed.templates import seed_templates
from app.db.base import db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("seed_database")

async def main():
    parser = argparse.ArgumentParser(description="Seed the database with initial data")
    parser.add_argument(
        "--clean-all", 
        action="store_true", 
        help="Delete all existing records before seeding"
    )
    parser.add_argument(
        "--tech-registry-only", 
        action="store_true", 
        help="Only seed tech registry data"
    )
    parser.add_argument(
        "--templates-only", 
        action="store_true", 
        help="Only seed template data"
    )
    
    args = parser.parse_args()
    
    # Connect to database
    try:
        await db.connect_to_mongodb()
        logger.info("Connected to MongoDB")
        
        database = db.get_db()
        if database is None:
            logger.error("Failed to get database instance")
            return
        
        # Determine what to seed based on args
        seed_tech = True
        seed_temps = True
        
        if args.tech_registry_only:
            seed_temps = False
        if args.templates_only:
            seed_tech = False
        
        # Seed tech registry if specified
        if seed_tech:
            logger.info(f"Seeding tech registry (clean_all={args.clean_all})")
            await seed_tech_registry(database, clean_all=args.clean_all)
            logger.info("Tech registry seeding complete")
        
        # Seed templates if specified
        if seed_temps:
            logger.info(f"Seeding templates (clean_all={args.clean_all})")
            await seed_templates(database, clean_all=args.clean_all)
            logger.info("Templates seeding complete")
        
    except Exception as e:
        logger.error(f"Error during database seeding: {str(e)}")
        raise
    finally:
        # Close database connection
        await db.close_mongodb_connection()
        logger.info("MongoDB connection closed")

if __name__ == "__main__":
    asyncio.run(main()) 