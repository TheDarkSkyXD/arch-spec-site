"""
Service for project templates.
"""
import logging
from typing import List, Dict, Optional, Any
from bson import ObjectId
from ..db.base import db
from ..seed.templates import get_templates, get_template_by_id

logger = logging.getLogger(__name__)

class TemplatesService:
    """Service for project templates operations."""
    
    @staticmethod
    async def get_templates() -> List[Dict[str, Any]]:
        """
        Get all project templates.
        
        Returns:
            List of project templates
        """
        try:
            # Try fetching from database first
            database = db.get_db()
            if database is not None:
                templates_collection = database.get_collection("templates")
                cursor = templates_collection.find({})
                templates = await cursor.to_list(length=100)
                
                if templates and len(templates) > 0:
                    # Convert ObjectIds to strings for JSON serialization
                    for template in templates:
                        if "_id" in template:
                            template["id"] = str(template["_id"])
                            del template["_id"]
                    
                    logger.info(f"Retrieved {len(templates)} templates from database")
                    return templates
            
            # Fallback to seed data if database is not available or empty
            logger.info("Fetching templates from seed data")
            return get_templates()
            
        except Exception as e:
            logger.error(f"Error retrieving templates: {str(e)}")
            
            # Fallback to seed data in case of error
            logger.info("Falling back to seed data due to error")
            return get_templates()
    
    @staticmethod
    async def get_template_by_id(template_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a project template by ID.
        
        Args:
            template_id: Template ID
            
        Returns:
            Project template or None if not found
        """
        try:
            # Try fetching from database first
            database = db.get_db()
            if database is not None:
                templates_collection = database.get_collection("templates")
                
                # Try to convert string ID to ObjectId (if it's a valid ObjectId)
                try:
                    obj_id = ObjectId(template_id)
                    template = await templates_collection.find_one({"_id": obj_id})
                    
                    if template:
                        template["id"] = str(template["_id"])
                        del template["_id"]
                        return template
                        
                except Exception:
                    # If not a valid ObjectId, search by string ID
                    template = await templates_collection.find_one({"id": template_id})
                    if template:
                        if "_id" in template:
                            template["id"] = str(template["_id"])
                            del template["_id"]
                        return template
            
            # Fallback to seed data if database is not available or template not found
            logger.info(f"Template {template_id} not found in database, checking seed data")
            return get_template_by_id(template_id)
            
        except Exception as e:
            logger.error(f"Error retrieving template {template_id}: {str(e)}")
            
            # Fallback to seed data in case of error
            logger.info("Falling back to seed data due to error")
            return get_template_by_id(template_id) 