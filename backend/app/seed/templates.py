"""
Seed data for project templates.

This module defines project templates and provides functions to manage them in the database.
Templates serve as starting points for new projects, defining default configurations,
tech stack selections, and other project settings.

The module implements a smart synchronization mechanism that:
1. Adds new templates to the database
2. Updates existing templates when they change in the code
3. Marks templates as deprecated when they're removed from the code (instead of deleting)
4. Validates templates against the tech registry to ensure consistency

All technologies referenced in templates should exist in the tech_registry.py file.

See /app/seed/README.md for more detailed documentation.
"""
import logging
import datetime
from typing import Dict, List, Optional

from ..seed.template_data.sample_templates import PROJECT_TEMPLATES

from ..seed.tech_registry import validate_template_tech_stack

logger = logging.getLogger(__name__)

async def seed_templates(db, clean_all: bool = False):
    """
    Seed project templates into the database.
    If templates already exist, check if they need to be updated.
    
    Args:
        db: Database instance
        clean_all: If True, delete all existing records before inserting new ones
    """
    try:
        # Check if templates collection exists and has data
        templates_collection = db.get_collection("templates")
        count = await templates_collection.count_documents({})
        
        # First validate all templates against the tech registry
        for template in PROJECT_TEMPLATES:
            if "techStack" in template.get("template", {}):
                validation_result = validate_template_tech_stack(template["template"]["techStack"])
                if not validation_result["is_valid"]:
                    logger.warning(f"Template '{template['template']['name']}' contains invalid technologies: {validation_result['invalid_technologies']}")
        
        if clean_all and count > 0:
            # Delete all existing records if clean_all is True
            logger.info("Clean all option enabled. Removing all existing template documents...")
            delete_result = await templates_collection.delete_many({})
            logger.info(f"Deleted {delete_result.deleted_count} template documents")
            count = 0  # Reset count to 0 to force insertion of new records
        
        if count == 0:
            # No templates exist, insert all
            logger.info("Seeding project templates...")
            
            # Insert templates
            result = await templates_collection.insert_many(PROJECT_TEMPLATES)
            logger.info(f"Inserted {len(result.inserted_ids)} project templates")
        else:
            # Templates already exist, check for updates
            logger.info(f"Template collection already has {count} documents. Checking for updates...")
            
            # Get existing template IDs from database
            existing_templates = await templates_collection.find({}, {"id": 1}).to_list(length=100)
            existing_template_ids = {t["id"] for t in existing_templates}
            
            # Compare with current templates
            current_template_ids = {t["id"] for t in PROJECT_TEMPLATES}
            
            # Find templates to add or update
            templates_to_add = []
            templates_to_update = []
            
            for template in PROJECT_TEMPLATES:
                if template["id"] not in existing_template_ids:
                    templates_to_add.append(template)
                else:
                    # Template exists, check if it's changed
                    templates_to_update.append(template)
            
            # Add new templates
            if templates_to_add:
                result = await templates_collection.insert_many(templates_to_add)
                logger.info(f"Added {len(result.inserted_ids)} new templates")
            
            # Update existing templates 
            for template in templates_to_update:
                # Add a last_updated field
                if "metadata" not in template:
                    template["metadata"] = {}
                template["metadata"]["last_updated"] = datetime.datetime.utcnow()
                
                result = await templates_collection.replace_one(
                    {"id": template["id"]},
                    template
                )
                if result.modified_count > 0:
                    logger.info(f"Updated template: {template['template']['name']}")
            
            # Check for templates to remove (templates in DB but not in code)
            templates_to_remove = existing_template_ids - current_template_ids
            if templates_to_remove:
                logger.info(f"Found {len(templates_to_remove)} templates to remove")
                # Option 1: Actually delete them
                # result = await templates_collection.delete_many({"id": {"$in": list(templates_to_remove)}})
                # logger.info(f"Removed {result.deleted_count} templates")
                
                # Option 2: Mark them as deprecated but don't delete
                for template_id in templates_to_remove:
                    result = await templates_collection.update_one(
                        {"id": template_id},
                        {"$set": {"metadata.deprecated": True, "metadata.last_updated": datetime.datetime.utcnow()}}
                    )
                    if result.modified_count > 0:
                        logger.info(f"Marked template {template_id} as deprecated")
    
    except Exception as e:
        logger.error(f"Error seeding templates: {str(e)}")
        raise

def get_templates() -> List[Dict]:
    """
    Get all project templates.
    
    Returns:
        List of project templates
    """
    return PROJECT_TEMPLATES

def get_template_by_id(template_id: str) -> Dict:
    """
    Get a project template by ID.
    
    Args:
        template_id: Template ID
        
    Returns:
        Project template or None if not found
    """
    for template in PROJECT_TEMPLATES:
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