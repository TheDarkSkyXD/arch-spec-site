"""
Utility functions for technology stack validation during project creation.

This module provides validation functionality for technology stacks,
ensuring that all selected technologies exist in the central registry
and are compatible with each other and with templates.

Key functions:
- validate_project_tech_stack: Validates a project's tech stack against the registry
  and optionally against a template's tech stack
- get_tech_suggestions: Provides technology suggestions based on partial selections

These utilities help maintain consistency between user selections, templates,
and the central technology registry.

See /app/seed/README.md for more detailed documentation.
"""
import logging
from typing import Dict, List, Any, Optional

from app.seed.tech_registry import (
    is_valid_tech,
    get_category_for_tech,
    validate_template_tech_stack
)

logger = logging.getLogger(__name__)

def validate_project_tech_stack(tech_stack: Dict[str, Any], template_tech_stack: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Validate a project's tech stack against the central tech registry
    and optionally against a template's tech stack.
    
    Args:
        tech_stack: The tech stack selections for the project
        template_tech_stack: Optional template tech stack to check compatibility with
        
    Returns:
        Dict with validation results:
        {
            "is_valid": bool,
            "invalid_technologies": List[Dict[str, str]],
            "template_compatibility": Optional[Dict[str, Any]]  # Only if template_tech_stack is provided
        }
    """
    # First validate against the central registry
    validation_result = validate_template_tech_stack(tech_stack)
    
    result = {
        "is_valid": validation_result["is_valid"],
        "invalid_technologies": validation_result["invalid_technologies"]
    }
    
    # If a template is provided, also check compatibility with the template
    if template_tech_stack:
        template_compatibility = {
            "is_compatible": True,
            "incompatibilities": []
        }
        
        # Compare each section
        for section in ["frontend", "backend", "database", "authentication", "deployment", "testing"]:
            if section in tech_stack and section in template_tech_stack:
                tech_section = tech_stack[section]
                template_section = template_tech_stack[section]
                
                # Check each key in the tech section against the template
                for key, value in tech_section.items():
                    if key in template_section:
                        template_value = template_section[key]
                        
                        # If template specifies options, check if the selected value is in options
                        if key == "options" and isinstance(value, list) and isinstance(template_value, list):
                            for option in value:
                                if option not in template_value:
                                    template_compatibility["is_compatible"] = False
                                    template_compatibility["incompatibilities"].append({
                                        "section": section,
                                        "key": key,
                                        "selected": option,
                                        "allowed": template_value
                                    })
                        # For other fields, direct comparison
                        elif template_value != value and key != "options":
                            # Check if the selected value is in the template options
                            if "options" in template_section and isinstance(template_section["options"], list):
                                if value not in template_section["options"]:
                                    template_compatibility["is_compatible"] = False
                                    template_compatibility["incompatibilities"].append({
                                        "section": section,
                                        "key": key,
                                        "selected": value,
                                        "allowed": [template_value] + template_section["options"]
                                    })
                            else:
                                template_compatibility["is_compatible"] = False
                                template_compatibility["incompatibilities"].append({
                                    "section": section,
                                    "key": key,
                                    "selected": value,
                                    "allowed": template_value
                                })
        
        result["template_compatibility"] = template_compatibility
    
    return result


def get_tech_suggestions(partial_tech_stack: Dict[str, Any]) -> Dict[str, List[str]]:
    """
    Get technology suggestions based on the partial tech stack already selected.
    
    Args:
        partial_tech_stack: The partially completed tech stack
        
    Returns:
        Dict with technology suggestions for each unfilled category
    """
    suggestions = {}
    
    # Frontend suggestions based on framework
    if "frontend" in partial_tech_stack and "framework" in partial_tech_stack["frontend"]:
        frontend_framework = partial_tech_stack["frontend"]["framework"]
        
        # If framework is valid, provide compatible options
        if is_valid_tech(frontend_framework):
            # This logic would typically come from the tech_stack compatibility data
            # For now, we're providing a simplified suggestion mechanism
            if frontend_framework == "React":
                suggestions["frontend"] = {
                    "stateManagement": ["Redux", "MobX", "Context API", "Zustand", "Recoil"],
                    "uiLibrary": ["Material UI", "Chakra UI", "Ant Design", "Tailwind CSS"],
                    "formHandling": ["React Hook Form", "Formik"]
                }
            elif frontend_framework == "Vue.js":
                suggestions["frontend"] = {
                    "stateManagement": ["Pinia", "Vuex"],
                    "uiLibrary": ["Vuetify", "PrimeVue", "Quasar", "Tailwind CSS"],
                    "formHandling": ["VeeValidate", "FormKit"]
                }
            elif frontend_framework == "Angular":
                suggestions["frontend"] = {
                    "stateManagement": ["NgRx", "Akita", "NGXS"],
                    "uiLibrary": ["Angular Material", "PrimeNG", "NG Bootstrap", "Tailwind CSS"],
                    "formHandling": ["Angular Forms", "NgxFormly"]
                }
    
    # Backend suggestions
    if "backend" in partial_tech_stack and "framework" in partial_tech_stack["backend"]:
        backend_framework = partial_tech_stack["backend"]["framework"]
        
        if is_valid_tech(backend_framework):
            # Provide ORM suggestions based on backend framework
            if backend_framework in ["Express.js", "NestJS"]:
                suggestions["backend"] = {
                    "orm": ["Sequelize", "TypeORM", "Prisma"],
                    "authFramework": ["Passport.js"]
                }
            elif backend_framework == "Django":
                suggestions["backend"] = {
                    "orm": ["Django ORM"],
                    "authFramework": ["Django Auth"]
                }
            elif backend_framework == "FastAPI":
                suggestions["backend"] = {
                    "orm": ["SQLAlchemy"],
                    "authFramework": ["FastAPI Security"]
                }
    
    # Add suggestions for other categories
    # This is simplified - a real implementation would have more complex logic
    
    return suggestions 