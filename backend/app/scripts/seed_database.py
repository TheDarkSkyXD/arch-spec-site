#!/usr/bin/env python
import asyncio
import argparse
import logging
import sys

# Add parent directory to path so we can import from app
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.seed.templates import seed_templates
from app.seed.tech_stack import seed_tech_stack
from app.seed.implementation_prompts import seed_sample_implementation_prompts
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
        "--clean-all", action="store_true", help="Delete all existing records before seeding"
    )
    parser.add_argument("--templates-only", action="store_true", help="Only seed template data")
    parser.add_argument(
        "--tech-stack-only", action="store_true", help="Only seed tech stack compatibility data"
    )
    parser.add_argument(
        "--implementation-prompts-only",
        action="store_true",
        help="Only seed sample implementation prompts data",
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
        seed_templates_data = True
        seed_tech_stack_data = True
        seed_implementation_prompts_data = True

        if args.templates_only:
            seed_tech_stack_data = False
            seed_implementation_prompts_data = False
        if args.tech_stack_only:
            seed_templates_data = False
            seed_implementation_prompts_data = False
        if args.implementation_prompts_only:
            seed_templates_data = False
            seed_tech_stack_data = False

        # Seed templates if specified
        if seed_templates_data:
            logger.info(f"Seeding templates (clean_all={args.clean_all})")
            await seed_templates(database, clean_all=args.clean_all)
            logger.info("Templates seeding complete")

        # Seed tech stack data if specified
        if seed_tech_stack_data:
            logger.info(f"Seeding tech stack data (clean_all={args.clean_all})")
            await seed_tech_stack(database, clean_all=args.clean_all)
            logger.info("Tech stack seeding complete")

        # Seed sample implementation prompts if specified
        if seed_implementation_prompts_data:
            logger.info(f"Seeding sample implementation prompts (clean_all={args.clean_all})")
            await seed_sample_implementation_prompts(database, clean_all=args.clean_all)
            logger.info("Sample implementation prompts seeding complete")

    except Exception as e:
        logger.error(f"Error during database seeding: {str(e)}")
        raise
    finally:
        # Close database connection
        await db.close_mongodb_connection()
        logger.info("MongoDB connection closed")


if __name__ == "__main__":
    asyncio.run(main())
