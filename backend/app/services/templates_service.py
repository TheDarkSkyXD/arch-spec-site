"""
Service for project templates.
"""
import logging
from typing import List, Dict, Optional, Any
from bson import ObjectId
from ..db.base import db
from ..seed.templates import (
    get_templates, 
    get_template_by_id, 
    get_templates_from_db,
    get_template_by_id_from_db
)

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
            # Try fetching from database using our new function
            database = db.get_db()
            if database is not None:
                templates = await get_templates_from_db(database)
                
                if templates and len(templates) > 0:
                    # Format the templates for the API response
                    formatted_templates = []
                    for template in templates:
                        # Extract the id
                        template_id = template.get("id", str(template.get("_id", "unknown")))
                        # Ensure the template has all required fields
                        complete_template = TemplatesService._ensure_complete_template(template.get("template", template))
                        
                        # Ensure each template in the response has id and template fields
                        formatted_templates.append({
                            "id": template_id,
                            "template": complete_template
                        })
                    
                    logger.info(f"Retrieved {len(templates)} templates from database")
                    return formatted_templates
            
            # Fallback to seed data if database is not available or empty
            logger.info("Fetching templates from seed data")
            seed_templates = get_templates()
            
            return seed_templates
            
        except Exception as e:
            logger.error(f"Error retrieving templates: {str(e)}")
            
            # Fallback to seed data in case of error
            logger.info("Falling back to seed data due to error")
            seed_templates = get_templates()
            
            # Ensure seed templates have all required fields
            for template_data in seed_templates:
                if "template" in template_data:
                    template_data["template"] = TemplatesService._ensure_complete_template(template_data["template"])
            
            return seed_templates
    
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
            # Try fetching from database using our new function
            database = db.get_db()
            if database is not None:
                template = await get_template_by_id_from_db(database, template_id)
                
                if template:
                    # Format the template for API response
                    template_id = template.get("id", str(template.get("_id", template_id)))
                    # Ensure the template has all required fields
                    complete_template = TemplatesService._ensure_complete_template(template.get("template", template))
                    # Return in the expected format with id and template fields
                    return {
                        "id": template_id,
                        "template": complete_template
                    }
            
            # Fallback to seed data if database is not available or template not found
            logger.info(f"Template {template_id} not found in database, checking seed data")
            template_data = get_template_by_id(template_id)
            
            # Ensure the template has all required fields
            if template_data and "template" in template_data:
                template_data["template"] = TemplatesService._ensure_complete_template(template_data["template"])
            
            return template_data
            
        except Exception as e:
            logger.error(f"Error retrieving template {template_id}: {str(e)}")
            
            # Fallback to seed data in case of error
            logger.info("Falling back to seed data due to error")
            template_data = get_template_by_id(template_id)
            
            # Ensure the template has all required fields
            if template_data and "template" in template_data:
                template_data["template"] = TemplatesService._ensure_complete_template(template_data["template"])
            
            return template_data

    @staticmethod
    async def update_template(template_id: str, template_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Update a project template by ID.
        
        Args:
            template_id: Template ID
            template_data: Updated template data
            
        Returns:
            Updated template or None if not found
        """
        try:
            # Try to update in database first
            database = db.get_db()
            if database is not None:
                templates_collection = database.get_collection("templates")
                
                # Try to convert string ID to ObjectId (if it's a valid ObjectId)
                try:
                    # If template_id is a valid ObjectId, use it for the query
                    obj_id = ObjectId(template_id)
                    filter_criteria = {"_id": obj_id}
                except Exception:
                    # Otherwise, search by string ID
                    filter_criteria = {"id": template_id}
                
                # Prepare data for update, ensuring id field is preserved
                update_data = template_data.copy()
                if "_id" in update_data:
                    del update_data["_id"]  # MongoDB doesn't allow modifying _id field
                
                # Set the id field to match the template_id for consistency
                update_data["id"] = template_id
                
                # Ensure the template has all required fields
                complete_template = TemplatesService._ensure_complete_template(update_data)
                
                result = await templates_collection.replace_one(filter_criteria, complete_template)
                
                if result.matched_count > 0:
                    logger.info(f"Template {template_id} updated successfully")
                    # Return the updated template with id field in the expected format
                    return {
                        "id": template_id,
                        "template": complete_template
                    }
                else:
                    logger.warning(f"Template {template_id} not found in database")
                    return None
            
            # If database is not available, we can't update
            logger.warning("Database not available, cannot update template")
            return None
            
        except Exception as e:
            logger.error(f"Error updating template {template_id}: {str(e)}")
            raise

    @staticmethod
    def _ensure_complete_template(template: Dict[str, Any]) -> Dict[str, Any]:
        """
        Ensure a template has all required fields according to the schema.
        
        Args:
            template: Template data
            
        Returns:
            Template with all required fields
        """
        # Ensure projectDefaults is present
        if "projectDefaults" not in template:
            template["projectDefaults"] = {
                "name": "",
                "description": "",
                "businessGoals": [],
                "targetUsers": []
            }
        
        # Ensure techStack is present with the new schema format
        if "techStack" not in template:
            template["techStack"] = {
                "frontend": {
                    "frameworks": []
                },
                "backend": {
                    "frameworks": [],
                    "baas": []
                },
                "database": {
                    "sql": [],
                    "nosql": []
                },
                "hosting": {},
                "authentication": {}
            }
        
        # Ensure features is present
        if "features" not in template:
            template["features"] = {
                "coreModules": []
            }
        
        # Ensure pages is present
        if "pages" not in template:
            template["pages"] = {
                "public": [],
                "authenticated": [],
                "admin": []
            }
        
        # Ensure dataModel is present
        if "dataModel" not in template:
            template["dataModel"] = {
                "entities": [],
                "relationships": []
            }
        
        # Ensure api is present
        if "api" not in template:
            template["api"] = {
                "endpoints": []
            }
        
        # Ensure testing is present
        if "testing" not in template:
            template["testing"] = {
                "unit": {
                    "framework": "",
                    "coverage": 0
                },
                "integration": {
                    "framework": "",
                    "coverage": 0
                },
                "e2e": {
                    "framework": "",
                    "coverage": 0
                }
            }
        
        # Ensure projectStructure is present
        if "projectStructure" not in template:
            template["projectStructure"] = {
                "frontend": {
                    "directories": [],
                    "files": []
                }
            }
        
        # Ensure deployment is present
        if "deployment" not in template:
            template["deployment"] = {
                "environments": [],
                "cicd": {
                    "provider": "",
                    "steps": []
                }
            }
        
        # Ensure documentation is present
        if "documentation" not in template:
            template["documentation"] = {
                "sections": [],
                "diagrams": []
            }
        
        # Ensure required top-level fields are present
        required_fields = ["name", "version", "description"]
        for field in required_fields:
            if field not in template:
                template[field] = ""
                
        return template 