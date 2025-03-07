"""
Service for project templates.
"""
import logging
from typing import List, Dict, Optional, Any, Union, cast
from bson import ObjectId
from ..db.base import db
from ..seed.templates import (
    get_templates, 
    get_template_by_id, 
    get_templates_from_db,
    get_template_by_id_from_db
)
from ..schemas.templates import (
    ProjectTemplate,
    ProjectTemplateResponse
)
from ..schemas.tech_stack import TechStackData
from ..seed.tech_registry import validate_template_tech_stack

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
                        
                        # Validate and enrich tech stack data if present
                        if "techStack" in complete_template:
                            try:
                                # Convert to TechStackData model for validation
                                tech_stack = TechStackData(**complete_template["techStack"])
                                # Validate technologies
                                validate_result = validate_template_tech_stack(tech_stack)
                                if not validate_result["is_valid"]:
                                    logger.warning(f"Template {template_id} contains invalid technologies: {validate_result['invalid_technologies']}")
                            except Exception as e:
                                logger.warning(f"Error validating tech stack for template {template_id}: {str(e)}")
                        
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
            
            # Ensure seed templates have all required fields and validate tech stack
            for template_data in seed_templates:
                if "template" in template_data:
                    template_data["template"] = TemplatesService._ensure_complete_template(template_data["template"])
                    
                    # Validate and enrich tech stack data if present
                    if "techStack" in template_data["template"]:
                        try:
                            # Convert to TechStackData model for validation
                            tech_stack = TechStackData(**template_data["template"]["techStack"])
                            # Validate technologies
                            validate_result = validate_template_tech_stack(tech_stack)
                            if not validate_result["is_valid"]:
                                logger.warning(f"Template {template_data.get('id')} contains invalid technologies: {validate_result['invalid_technologies']}")
                        except Exception as e:
                            logger.warning(f"Error validating tech stack for template {template_data.get('id')}: {str(e)}")
            
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
        
        # Convert old tech stack format to new format if needed
        elif "frontend" in template["techStack"] and "frameworks" not in template["techStack"]["frontend"]:
            old_tech_stack = template["techStack"]
            
            # Create a new tech stack with the proper format
            new_tech_stack = {
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
            
            # Handle frontend conversion if present
            if "frontend" in old_tech_stack:
                frontend = old_tech_stack["frontend"]
                if "framework" in frontend and frontend["framework"]:
                    framework_data = {
                        "name": frontend["framework"],
                        "description": f"{frontend['framework']} with {frontend.get('language', 'JavaScript')}",
                        "language": frontend.get("language", "JavaScript"),
                        "compatibility": {
                            "stateManagement": [frontend.get("state_management")] if frontend.get("state_management") else [],
                            "uiLibraries": [frontend.get("ui_library")] if frontend.get("ui_library") else [],
                            "formHandling": [frontend.get("form_handling")] if frontend.get("form_handling") else [],
                            "routing": [frontend.get("routing")] if frontend.get("routing") else []
                        }
                    }
                    new_tech_stack["frontend"]["frameworks"].append(framework_data)
            
            # Handle backend conversion if present
            if "backend" in old_tech_stack:
                backend = old_tech_stack["backend"]
                if "type" in backend and backend["type"]:
                    backend_data = {
                        "name": backend.get("provider") or backend["type"],
                        "description": f"{backend.get('provider') or backend['type']} backend",
                        "compatibility": {}
                    }
                    new_tech_stack["backend"]["frameworks"].append(backend_data)
            
            # Handle database conversion if present
            if "database" in old_tech_stack:
                database = old_tech_stack["database"]
                if "type" in database and database["type"]:
                    db_data = {
                        "name": database.get("provider") or database["type"],
                        "description": f"{database.get('provider') or database['type']} database",
                        "compatibility": {}
                    }
                    if database["type"].lower() == "sql":
                        new_tech_stack["database"]["sql"].append(db_data)
                    else:
                        new_tech_stack["database"]["nosql"].append(db_data)
            
            # Handle hosting conversion if present
            if "hosting" in old_tech_stack:
                hosting = old_tech_stack["hosting"]
                if hosting.get("frontend"):
                    new_tech_stack["hosting"]["frontend"] = [hosting["frontend"]]
                if hosting.get("backend"):
                    new_tech_stack["hosting"]["backend"] = [hosting["backend"]]
            
            # Handle authentication conversion if present
            if "authentication" in old_tech_stack:
                auth = old_tech_stack["authentication"]
                if "provider" in auth and auth["provider"]:
                    new_tech_stack["authentication"]["providers"] = [auth["provider"]]
                if "methods" in auth and auth["methods"]:
                    new_tech_stack["authentication"]["methods"] = auth["methods"]
            
            # Replace the old tech stack with the new one
            template["techStack"] = new_tech_stack
        
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