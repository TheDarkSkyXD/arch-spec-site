"""
Seed data for project templates.

This module defines project templates and provides functions to manage them in the database.
Templates serve as starting points for new projects, defining default configurations,
tech stack selections, and other project settings.

The module implements a smart synchronization mechanism that:
1. Adds new templates to the database
2. Updates existing templates when they change in the code
3. Marks templates as deprecated when they're removed from the code (instead of deleting)

All technologies referenced in templates should exist in the tech_stack.py file.

See /app/seed/README.md for more detailed documentation.
"""
import logging
import datetime
import json
import os
import glob
from typing import Dict, List, Optional
from pathlib import Path
from bson import ObjectId

logger = logging.getLogger(__name__)

# Path to templates directory
TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "template_data", "templates")

def load_templates_from_files() -> List[Dict]:
    """
    Load all templates from JSON files in the templates directory.
    
    Returns:
        List of project templates
    """
    templates = []
    
    # Get all JSON files in the templates directory
    template_files = glob.glob(os.path.join(TEMPLATES_DIR, "*.json"))
    
    for file_path in template_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                template = json.load(f)
                
                # Generate a unique ID if "auto_generate" is specified
                if template.get("id") == "auto_generate":
                    template["id"] = str(ObjectId())
                
                templates.append(template)
                logger.info(f"Loaded template: {template.get('template', {}).get('name', 'Unknown')} from {Path(file_path).name}")
        except Exception as e:
            logger.error(f"Error loading template from {file_path}: {str(e)}")
    
    return templates

async def seed_templates(db, clean_all: bool = False):
    """
    Seed project templates into the database.
    If templates already exist, check if there are new templates to add.
    
    Args:
        db: Database instance
        clean_all: If True, delete all existing records before inserting new ones
    """
    try:
        print("Seeding project templates...")

        # Check if templates collection exists and has data
        templates_collection = db.get_collection("templates")
        count = await templates_collection.count_documents({})
        
        if clean_all and count > 0:
            # Delete all existing records if clean_all is True
            logger.info("Clean all option enabled. Removing all existing template documents...")
            delete_result = await templates_collection.delete_many({})
            logger.info(f"Deleted {delete_result.deleted_count} template documents")
            count = 0  # Reset count to 0 to force insertion of new records
        
        # Load templates from JSON files
        loaded_templates = load_templates_from_files()
        
        if count == 0:
            # No templates exist, insert all
            logger.info("Seeding project templates...")
            
            # Insert templates
            result = await templates_collection.insert_many(loaded_templates)
            logger.info(f"Inserted {len(result.inserted_ids)} project templates")
        else:
            # Templates exist, check for new ones to add
            logger.info(f"Template collection already has {count} documents. Checking for new templates...")
            
            # Get existing templates from the database
            existing_templates = await templates_collection.find().to_list(length=None)
            existing_template_names = {template.get('template', {}).get('name') for template in existing_templates}
            
            # Find new templates to insert
            new_templates = []
            for template in loaded_templates:
                template_name = template.get('template', {}).get('name')
                if template_name and template_name not in existing_template_names:
                    new_templates.append(template)
            
            if new_templates:
                logger.info(f"Found {len(new_templates)} new templates to insert")
                result = await templates_collection.insert_many(new_templates)
                logger.info(f"Inserted {len(result.inserted_ids)} new project templates")
            else:
                logger.info("No new templates to insert")
            
        # Get all templates from the database
        templates = await get_templates_from_db(db)
        logger.info(f"Retrieved {len(templates)} templates from the database")
        
        print("Project templates seeded successfully")
    except Exception as e:
        logger.error(f"Error seeding templates: {str(e)}")
        raise

def get_templates() -> List[Dict]:
    """
    Get all project templates.
    
    Returns:
        List of project templates
    """
    return load_templates_from_files()

def get_template_by_id(template_id: str) -> Dict:
    """
    Get a project template by ID.
    
    Args:
        template_id: Template ID
        
    Returns:
        Project template or None if not found
    """
    for template in load_templates_from_files():
        if template["id"] == template_id:
            return template
    return None

async def get_templates_from_db(db) -> List[Dict]:
    """
    Get all project templates from the database.
    
    Args:
        db: Database instance
        
    Returns:
        List of project templates from the database
    """
    try:
        templates_collection = db.get_collection("templates")
        templates = await templates_collection.find(
            {"metadata.deprecated": {"$ne": True}}  # Exclude deprecated templates
        ).to_list(length=100)
        
        # Convert ObjectId to string for JSON serialization
        for template in templates:
            if "_id" in template:
                template["_id"] = str(template["_id"])
        
        return templates
    except Exception as e:
        logger.error(f"Error retrieving templates from database: {str(e)}")
        return []

async def get_template_by_id_from_db(db, template_id: str) -> Optional[Dict]:
    """
    Get a project template by ID from the database.
    
    Args:
        db: Database instance
        template_id: Template ID
        
    Returns:
        Project template or None if not found
    """
    try:
        templates_collection = db.get_collection("templates")
        template = await templates_collection.find_one({"id": template_id})
        
        if template:
            # Convert ObjectId to string for JSON serialization
            if "_id" in template:
                template["_id"] = str(template["_id"])
            
            return template
        
        return None
    except Exception as e:
        logger.error(f"Error retrieving template from database: {str(e)}")
        return None 