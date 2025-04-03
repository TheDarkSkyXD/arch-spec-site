"""
Sample Implementation Prompts Database Operations.

This module provides functions to seed and retrieve sample implementation prompts data.
"""

import logging
import datetime
import os
import uuid
from typing import Dict, List, Optional, Any
from datetime import timezone
from pathlib import Path

from app.schemas.shared_schemas import ImplementationPrompt, ImplementationPromptType

logger = logging.getLogger(__name__)


async def seed_sample_implementation_prompts(db, clean_all: bool = False):
    """
    Seed sample implementation prompts into the database.
    If the sample prompts already exist, skip the seeding process unless clean_all is True.

    Args:
        db: Database instance
        clean_all: If True, delete all existing records before inserting new ones
    """
    try:
        print("Starting sample implementation prompts seeding...")

        # Check if sample_implementation_prompts collection exists and has data
        sample_prompts_collection = db.get_collection("sample_implementation_prompts")
        count = await sample_prompts_collection.count_documents({})

        print(f"Found {count} existing sample implementation prompts documents in database")

        # If clean_all is True and there are existing records, delete them
        if clean_all and count > 0:
            print(
                "Clean all option enabled. Removing all existing sample implementation prompts..."
            )
            logger.info(
                "Clean all option enabled. Removing all existing sample implementation prompts..."
            )
            delete_result = await sample_prompts_collection.delete_many({})
            print(f"Deleted {delete_result.deleted_count} sample implementation prompts documents")
            logger.info(
                f"Deleted {delete_result.deleted_count} sample implementation prompts documents"
            )
            count = 0  # Reset count to 0 to force insertion of new records

        if count == 0:
            # No existing data, load and insert sample implementation prompts
            print("No existing sample implementation prompts, loading from files...")
            logger.info("Seeding sample implementation prompts...")

            sample_prompts_data = await load_implementation_prompts_from_files()

            # Prepare the data in a format suitable for the database
            prompts_doc = {
                "version": "1.0.0",
                "last_updated": datetime.datetime.now(timezone.utc),
                "data": sample_prompts_data,
            }

            # Insert sample implementation prompts
            result = await sample_prompts_collection.insert_one(prompts_doc)

            print(f"Sample implementation prompts inserted with ID: {result.inserted_id}")
            logger.info(f"Sample implementation prompts inserted with ID: {result.inserted_id}")
        else:
            # Data already exists, skip the seeding process
            print("Sample implementation prompts already exist, skipping seeding process")
            logger.info("Sample implementation prompts already exist, skipping seeding process")

        print("Sample implementation prompts seeding complete!")

    except Exception as e:
        print(f"Error seeding sample implementation prompts: {str(e)}")
        logger.error(f"Error seeding sample implementation prompts: {str(e)}")
        raise


async def load_implementation_prompts_from_files() -> Dict[str, List[ImplementationPrompt]]:
    """
    Load implementation prompts from files in the implementation_prompt_data directory.

    Returns:
        Dict[str, List[ImplementationPrompt]]: A dictionary of category to implementation prompts
    """
    prompts_data = {}

    # Get the directory containing implementation prompt data
    base_dir = Path(__file__).parent / "implementation_prompt_data"
    print(f"Looking for implementation prompt data in: {base_dir}")
    logger.info(f"Looking for implementation prompt data in: {base_dir}")

    # List all category directories (sorted for consistent order)
    category_dirs = sorted([d for d in base_dir.iterdir() if d.is_dir()])
    print(f"Found {len(category_dirs)} category directories: {[d.name for d in category_dirs]}")
    logger.info(
        f"Found {len(category_dirs)} category directories: {[d.name for d in category_dirs]}"
    )

    for category_dir in category_dirs:
        category_name = category_dir.name
        prompts_data[category_name] = []

        # List all prompt files in the category directory (sorted for consistent order)
        prompt_files = sorted(
            [f for f in category_dir.iterdir() if f.is_file() and f.suffix == ".txt"]
        )
        print(
            f"  Category {category_name}: Found {len(prompt_files)} prompt files: {[f.name for f in prompt_files]}"
        )
        logger.info(
            f"  Category {category_name}: Found {len(prompt_files)} prompt files: {[f.name for f in prompt_files]}"
        )

        for prompt_file in prompt_files:
            # Parse the prompt type from the filename (e.g., 01_main.txt -> MAIN)
            file_name = prompt_file.stem
            prompt_type = None

            if "main" in file_name.lower():
                prompt_type = ImplementationPromptType.MAIN
            elif "followup1" in file_name.lower():
                prompt_type = ImplementationPromptType.FOLLOWUP_1
            elif "followup2" in file_name.lower():
                prompt_type = ImplementationPromptType.FOLLOWUP_2
            else:
                # Skip files that don't match expected naming pattern
                logger.warning(f"Skipping file with unknown prompt type: {prompt_file}")
                continue

            print(f"    Processing file {prompt_file.name} as type {prompt_type}")
            logger.info(f"    Processing file {prompt_file.name} as type {prompt_type}")

            # Read the prompt content
            try:
                with open(prompt_file, "r", encoding="utf-8") as f:
                    content = f.read().strip()

                # Create an implementation prompt object
                prompt = ImplementationPrompt(
                    id=str(uuid.uuid4()),
                    content=content,
                    type=prompt_type,
                    created_at=datetime.datetime.now(timezone.utc),
                    updated_at=datetime.datetime.now(timezone.utc),
                )

                prompts_data[category_name].append(prompt.model_dump())
                print(f"    Added prompt of type {prompt_type} with {len(content)} characters")
                logger.info(
                    f"    Added prompt of type {prompt_type} with {len(content)} characters"
                )
            except Exception as e:
                print(f"    Error processing file {prompt_file}: {str(e)}")
                logger.error(f"    Error processing file {prompt_file}: {str(e)}")

    print(
        f"Loaded a total of {sum(len(p) for p in prompts_data.values())} prompts across {len(prompts_data)} categories"
    )
    logger.info(
        f"Loaded a total of {sum(len(p) for p in prompts_data.values())} prompts across {len(prompts_data)} categories"
    )
    return prompts_data
