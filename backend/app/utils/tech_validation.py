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

from app.seed.tech_registry import is_valid_tech, validate_template_tech_stack

logger = logging.getLogger(__name__)


def validate_project_tech_stack(
    tech_stack: Dict[str, Any], template_tech_stack: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Validate a project's tech stack against the central tech registry
    and optionally against a template's tech stack.

    Args:
        tech_stack: The tech stack selections for the project (in TechStackData format)
        template_tech_stack: Optional template tech stack to check compatibility with (in TechStackData format)

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
        "invalid_technologies": validation_result["invalid_technologies"],
    }

    # If a template is provided, also check compatibility with the template
    if template_tech_stack:
        template_compatibility = {"is_compatible": True, "incompatibilities": []}

        # Compare frontend frameworks
        if "frontend" in tech_stack and "frontend" in template_tech_stack:
            tech_frameworks = tech_stack["frontend"].get("frameworks", [])
            template_frameworks = template_tech_stack["frontend"].get("frameworks", [])

            for tech_fw in tech_frameworks:
                tech_fw_name = tech_fw.get("name", "")

                # Find matching framework in template
                template_fw = next(
                    (fw for fw in template_frameworks if fw.get("name", "") == tech_fw_name), None
                )

                if template_fw:
                    # Check compatibility settings
                    tech_compat = tech_fw.get("compatibility", {})
                    template_compat = template_fw.get("compatibility", {})

                    # Check state management
                    if "stateManagement" in tech_compat and "stateManagement" in template_compat:
                        tech_state_mgmt = tech_compat["stateManagement"]
                        template_state_mgmt = template_compat["stateManagement"]

                        for state_mgmt in tech_state_mgmt:
                            if state_mgmt not in template_state_mgmt:
                                template_compatibility["is_compatible"] = False
                                template_compatibility["incompatibilities"].append(
                                    {
                                        "section": "frontend",
                                        "framework": tech_fw_name,
                                        "key": "stateManagement",
                                        "selected": state_mgmt,
                                        "allowed": template_state_mgmt,
                                    }
                                )

                    # Check UI libraries
                    if "uiLibraries" in tech_compat and "uiLibraries" in template_compat:
                        tech_ui_libs = tech_compat["uiLibraries"]
                        template_ui_libs = template_compat["uiLibraries"]

                        for ui_lib in tech_ui_libs:
                            if ui_lib not in template_ui_libs:
                                template_compatibility["is_compatible"] = False
                                template_compatibility["incompatibilities"].append(
                                    {
                                        "section": "frontend",
                                        "framework": tech_fw_name,
                                        "key": "uiLibraries",
                                        "selected": ui_lib,
                                        "allowed": template_ui_libs,
                                    }
                                )

                    # Add more checks for other compatibility fields as needed
                else:
                    # Framework not found in template
                    template_compatibility["is_compatible"] = False
                    template_compatibility["incompatibilities"].append(
                        {
                            "section": "frontend",
                            "key": "framework",
                            "selected": tech_fw_name,
                            "allowed": [fw.get("name", "") for fw in template_frameworks],
                        }
                    )

        # Compare backend frameworks
        if "backend" in tech_stack and "backend" in template_tech_stack:
            tech_frameworks = tech_stack["backend"].get("frameworks", [])
            template_frameworks = template_tech_stack["backend"].get("frameworks", [])

            # Check backend frameworks
            for tech_fw in tech_frameworks:
                tech_fw_name = tech_fw.get("name", "")

                if not any(fw.get("name", "") == tech_fw_name for fw in template_frameworks):
                    template_compatibility["is_compatible"] = False
                    template_compatibility["incompatibilities"].append(
                        {
                            "section": "backend",
                            "key": "framework",
                            "selected": tech_fw_name,
                            "allowed": [fw.get("name", "") for fw in template_frameworks],
                        }
                    )

            # Check backend as a service (BaaS)
            tech_baas = tech_stack["backend"].get("baas", [])
            template_baas = template_tech_stack["backend"].get("baas", [])

            for tech_b in tech_baas:
                tech_baas_name = tech_b.get("name", "")

                if not any(b.get("name", "") == tech_baas_name for b in template_baas):
                    # Check if the selected BaaS is in the options of any template BaaS
                    allowed = False
                    for template_b in template_baas:
                        if (
                            "compatibility" in template_b
                            and "options" in template_b["compatibility"]
                        ):
                            if tech_baas_name in template_b["compatibility"]["options"]:
                                allowed = True
                                break

                    if not allowed:
                        template_compatibility["is_compatible"] = False
                        template_compatibility["incompatibilities"].append(
                            {
                                "section": "backend",
                                "key": "baas",
                                "selected": tech_baas_name,
                                "allowed": [b.get("name", "") for b in template_baas]
                                + [
                                    opt
                                    for b in template_baas
                                    if "compatibility" in b and "options" in b["compatibility"]
                                    for opt in b["compatibility"]["options"]
                                ],
                            }
                        )

        # Similar checks could be added for database, authentication, etc.

        result["template_compatibility"] = template_compatibility

    return result


def get_tech_suggestions(partial_tech_stack: Dict[str, Any]) -> Dict[str, Dict[str, List[str]]]:
    """
    Get technology suggestions based on the partial tech stack already selected.

    Args:
        partial_tech_stack: The partially completed tech stack in TechStackData format

    Returns:
        Dict with technology suggestions for each unfilled category
    """
    suggestions = {}

    # Frontend suggestions based on framework
    if "frontend" in partial_tech_stack and "frameworks" in partial_tech_stack["frontend"]:
        frontend_frameworks = partial_tech_stack["frontend"]["frameworks"]

        if frontend_frameworks and len(frontend_frameworks) > 0:
            frontend_framework = frontend_frameworks[0].get("name", "")

            # If framework is valid, provide compatible options
            if is_valid_tech(frontend_framework):
                # This logic would typically come from the tech_stack compatibility data
                # For now, we're providing a simplified suggestion mechanism
                if frontend_framework == "React":
                    suggestions["frontend"] = {
                        "stateManagement": ["Redux", "MobX", "Context API", "Zustand", "Recoil"],
                        "uiLibrary": ["Material UI", "Chakra UI", "Ant Design", "Tailwind CSS"],
                        "formHandling": ["React Hook Form", "Formik"],
                    }
                elif frontend_framework == "Vue.js":
                    suggestions["frontend"] = {
                        "stateManagement": ["Pinia", "Vuex"],
                        "uiLibrary": ["Vuetify", "PrimeVue", "Quasar", "Tailwind CSS"],
                        "formHandling": ["VeeValidate", "FormKit"],
                    }
                elif frontend_framework == "Angular":
                    suggestions["frontend"] = {
                        "stateManagement": ["NgRx", "Akita", "NGXS"],
                        "uiLibrary": [
                            "Angular Material",
                            "PrimeNG",
                            "NG Bootstrap",
                            "Tailwind CSS",
                        ],
                        "formHandling": ["Angular Forms", "NgxFormly"],
                    }

    # Backend suggestions
    if "backend" in partial_tech_stack and "frameworks" in partial_tech_stack["backend"]:
        backend_frameworks = partial_tech_stack["backend"]["frameworks"]

        if backend_frameworks and len(backend_frameworks) > 0:
            backend_framework = backend_frameworks[0].get("name", "")

            if is_valid_tech(backend_framework):
                # Provide ORM suggestions based on backend framework
                if backend_framework in ["Express.js", "NestJS"]:
                    suggestions["backend"] = {
                        "orm": ["Sequelize", "TypeORM", "Prisma"],
                        "authFramework": ["Passport.js"],
                    }
                elif backend_framework == "Django":
                    suggestions["backend"] = {
                        "orm": ["Django ORM"],
                        "authFramework": ["Django Auth"],
                    }
                elif backend_framework == "FastAPI":
                    suggestions["backend"] = {
                        "orm": ["SQLAlchemy"],
                        "authFramework": ["FastAPI Security"],
                    }

    return suggestions
