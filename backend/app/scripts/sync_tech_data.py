#!/usr/bin/env python
"""
Tech Stack Data Synchronization Script.

This script checks and corrects inconsistencies between the tech registry,
tech stack compatibility data, and project templates to ensure all 
technology references are valid.
"""
import logging
import sys
import os
from typing import Dict, List, Set, Tuple

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.seed.tech_registry import (
    ALL_TECHNOLOGIES
)
from app.seed.tech_stack import TECH_STACK_DATA
from app.seed.templates import PROJECT_TEMPLATES

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def extract_tech_from_tech_stack() -> Set[str]:
    """
    Extract all technology names from the tech stack compatibility data.
    
    Returns:
        Set of all technology names found in tech stack data
    """
    tech_names = set()
    
    # Extract frontend framework names
    for framework in TECH_STACK_DATA.get("frontend", {}).get("frameworks", []):
        name = framework.get("name")
        if name:
            tech_names.add(name)
        
        # Extract compatible technologies
        for compat_category, compat_techs in framework.get("compatibility", {}).items():
            for tech in compat_techs:
                tech_names.add(tech)
    
    # Extract backend framework names
    for framework in TECH_STACK_DATA.get("backend", {}).get("frameworks", []):
        name = framework.get("name")
        if name:
            tech_names.add(name)
            
        # Extract compatible technologies
        for compat_category, compat_techs in framework.get("compatibility", {}).items():
            for tech in compat_techs:
                tech_names.add(tech)
    
    # Extract backend BaaS names
    for baas in TECH_STACK_DATA.get("backend", {}).get("baas", []):
        name = baas.get("name")
        if name:
            tech_names.add(name)
            
        # Extract compatible technologies
        for compat_category, compat_techs in baas.get("compatibility", {}).items():
            for tech in compat_techs:
                tech_names.add(tech)
    
    # Extract database names
    for db_type in ["sql", "nosql"]:
        for db in TECH_STACK_DATA.get("database", {}).get(db_type, []):
            name = db.get("name")
            if name:
                tech_names.add(name)
                
            # Extract compatible technologies
            for compat_category, compat_techs in db.get("compatibility", {}).items():
                for tech in compat_techs:
                    tech_names.add(tech)
    
    # Extract hosting technologies
    for key, techs in TECH_STACK_DATA.get("hosting", {}).items():
        for tech in techs:
            tech_names.add(tech)
    
    # Extract authentication technologies
    for key, techs in TECH_STACK_DATA.get("authentication", {}).items():
        for tech in techs:
            tech_names.add(tech)
    
    return tech_names


def extract_tech_from_templates() -> Set[str]:
    """
    Extract all technology names from the project templates.
    
    Returns:
        Set of all technology names found in templates
    """
    tech_names = set()
    
    for template in PROJECT_TEMPLATES:
        tech_stack = template.get("template", {}).get("techStack", {})
        
        # Check if it's using the new flattened structure
        if "frontend" in tech_stack and isinstance(tech_stack["frontend"], dict) and "frameworks" in tech_stack["frontend"]:
            # Process frontend frameworks
            for framework in tech_stack["frontend"].get("frameworks", []):
                name = framework.get("name")
                if name:
                    tech_names.add(name)
                
                # Extract compatibility entries
                for compat_category, compat_techs in framework.get("compatibility", {}).items():
                    for tech in compat_techs:
                        tech_names.add(tech)
            
            # Process backend frameworks
            for framework in tech_stack.get("backend", {}).get("frameworks", []):
                name = framework.get("name")
                if name:
                    tech_names.add(name)
                
                # Extract compatibility entries
                for compat_category, compat_techs in framework.get("compatibility", {}).items():
                    for tech in compat_techs:
                        tech_names.add(tech)
            
            # Process backend BaaS
            for baas in tech_stack.get("backend", {}).get("baas", []):
                name = baas.get("name")
                if name:
                    tech_names.add(name)
                
                # Extract compatibility entries
                for compat_category, compat_techs in baas.get("compatibility", {}).items():
                    for tech in compat_techs:
                        tech_names.add(tech)
            
            # Process database
            for db_type in ["sql", "nosql"]:
                for db in tech_stack.get("database", {}).get(db_type, []):
                    name = db.get("name")
                    if name:
                        tech_names.add(name)
                    
                    # Extract compatibility entries
                    for compat_category, compat_techs in db.get("compatibility", {}).items():
                        for tech in compat_techs:
                            tech_names.add(tech)
            
            # Process hosting options
            for key, value_list in tech_stack.get("hosting", {}).items():
                for value in value_list:
                    tech_names.add(value)
            
            # Process authentication options
            for key, value_list in tech_stack.get("authentication", {}).items():
                for value in value_list:
                    tech_names.add(value)
        else:
            # Handle old format templates (for backward compatibility)
            # Process frontend tech
            if "frontend" in tech_stack:
                frontend = tech_stack["frontend"]
                for key, value in frontend.items():
                    if key != "options" and isinstance(value, str):
                        tech_names.add(value)
                    elif key == "options" and isinstance(value, list):
                        tech_names.update(value)
            
            # Process backend tech
            if "backend" in tech_stack:
                backend = tech_stack["backend"]
                for key, value in backend.items():
                    if key != "options" and isinstance(value, str):
                        tech_names.add(value)
                    elif key == "options" and isinstance(value, list):
                        tech_names.update(value)
            
            # Process database tech
            if "database" in tech_stack:
                database = tech_stack["database"]
                for key, value in database.items():
                    if key != "options" and isinstance(value, str):
                        tech_names.add(value)
                    elif key == "options" and isinstance(value, list):
                        tech_names.update(value)
            
            # Process authentication tech
            if "authentication" in tech_stack:
                auth = tech_stack["authentication"]
                for key, value in auth.items():
                    if key != "methods" and key != "options" and isinstance(value, str):
                        tech_names.add(value)
                    elif (key == "methods" or key == "options") and isinstance(value, list):
                        tech_names.update(value)
            
            # Process hosting tech
            if "hosting" in tech_stack:
                hosting = tech_stack["hosting"]
                for key, value in hosting.items():
                    if isinstance(value, str):
                        tech_names.add(value)
                    elif isinstance(value, list):
                        tech_names.update(value)
    
    return tech_names


def find_inconsistencies() -> Tuple[Set[str], Set[str], Set[str]]:
    """
    Find technologies that are inconsistent between the tech registry,
    tech stack data, and templates.
    
    Returns:
        Tuple of sets:
            1. Tech in tech_stack not in registry
            2. Tech in templates not in registry 
            3. Tech in both tech_stack and templates but not in registry
    """
    tech_stack_techs = extract_tech_from_tech_stack()
    template_techs = extract_tech_from_templates()
    
    # Find inconsistencies
    tech_stack_missing = tech_stack_techs - ALL_TECHNOLOGIES
    template_missing = template_techs - ALL_TECHNOLOGIES
    both_missing = tech_stack_missing.intersection(template_missing)
    
    return tech_stack_missing, template_missing, both_missing


def suggest_registry_updates(missing_techs: Set[str]) -> Dict[str, Dict[str, List[str]]]:
    """
    Suggest updates to the tech registry based on missing technologies.
    
    Args:
        missing_techs: Set of technology names missing from the registry
        
    Returns:
        Dictionary of suggested additions to the registry by category and subcategory
    """
    suggested_updates = {}
    
    # Helper function to check if a tech name might belong to a category
    def categorize_tech(tech_name: str) -> Tuple[str, str]:
        # Frontend-related heuristics
        if any(x in tech_name.lower() for x in ["react", "vue", "angular", "svelte"]):
            return "frontend", "frameworks"
        elif any(x in tech_name.lower() for x in ["redux", "mobx", "state", "context", "store"]):
            return "frontend", "stateManagement"
        elif any(x in tech_name.lower() for x in ["ui", "css", "tailwind", "bootstrap", "material"]):
            return "frontend", "uiLibraries"
        elif any(x in tech_name.lower() for x in ["form"]):
            return "frontend", "formHandling"
        elif any(x in tech_name.lower() for x in ["router", "routing"]):
            return "frontend", "routing"
        elif any(x in tech_name.lower() for x in ["next", "remix", "gatsby", "nuxt"]):
            return "frontend", "metaFrameworks"
        
        # Backend-related heuristics
        elif any(x in tech_name.lower() for x in ["express", "django", "flask", "spring", "rails", "nest", "fastapi"]):
            return "backend", "frameworks"
        elif any(x in tech_name.lower() for x in ["orm", "prisma", "sequelize", "typeorm"]):
            return "backend", "orms"
        elif any(x in tech_name.lower() for x in ["passport", "jwt", "auth"]):
            return "backend", "authFrameworks"
        
        # Database-related heuristics
        elif any(x in tech_name.lower() for x in ["sql", "postgres", "mysql", "sqlite", "oracle"]):
            return "database", "relational"
        elif any(x in tech_name.lower() for x in ["mongo", "nosql", "dynamo", "firestore", "redis"]):
            return "database", "noSql"
        elif any(x in tech_name.lower() for x in ["supabase", "firebase", "planet", "aws"]):
            return "database", "providers"
        
        # Default - uncategorized
        return "uncategorized", "general"
    
    # Process each missing tech
    for tech in missing_techs:
        category, subcategory = categorize_tech(tech)
        
        if category not in suggested_updates:
            suggested_updates[category] = {}
        
        if subcategory not in suggested_updates[category]:
            suggested_updates[category][subcategory] = []
        
        suggested_updates[category][subcategory].append(tech)
    
    return suggested_updates


def print_report(tech_stack_missing: Set[str], template_missing: Set[str], both_missing: Set[str]) -> None:
    """
    Print a report of inconsistencies and suggested updates.
    
    Args:
        tech_stack_missing: Technologies in tech stack not in registry
        template_missing: Technologies in templates not in registry
        both_missing: Technologies in both not in registry
    """
    print("\n" + "="*80)
    print("TECH STACK SYNCHRONIZATION REPORT")
    print("="*80)
    
    print("\nTechnologies in tech stack not in registry:", len(tech_stack_missing))
    for tech in sorted(tech_stack_missing):
        print(f"  - {tech}")
    
    print("\nTechnologies in templates not in registry:", len(template_missing))
    for tech in sorted(template_missing):
        print(f"  - {tech}")
    
    print("\nTechnologies in both but missing from registry:", len(both_missing))
    for tech in sorted(both_missing):
        print(f"  - {tech}")
    
    if both_missing:
        print("\nSuggested registry updates:")
        suggestions = suggest_registry_updates(both_missing)
        
        for category, subcategories in suggestions.items():
            print(f"\n  {category}:")
            for subcategory, techs in subcategories.items():
                print(f"    {subcategory}:")
                tech_list = ", ".join([f'"{tech}"' for tech in sorted(techs)])
                print(f"      [{tech_list}]")
    
    if not tech_stack_missing and not template_missing:
        print("\nAll technologies are consistent! No inconsistencies found!")
        print("The tech registry contains all technologies used in tech stack and templates.")
    
    print("\n" + "="*80)


def generate_registry_update_code(missing_techs: Set[str]) -> str:
    """
    Generate code to update the tech registry with missing technologies.
    
    Args:
        missing_techs: Set of technology names missing from the registry
        
    Returns:
        String containing Python code to update the registry
    """
    suggestions = suggest_registry_updates(missing_techs)
    code_lines = ["# Add the following to tech_registry.py\n"]
    
    for category, subcategories in suggestions.items():
        for subcategory, techs in subcategories.items():
            if category == "uncategorized":
                code_lines.append(f"# New technologies to categorize manually:")
                for tech in sorted(techs):
                    code_lines.append(f'# "{tech}",')
                continue
                
            code_lines.append(f"# Update TECH_REGISTRY['{category}']['{subcategory}'] to include:")
            for tech in sorted(techs):
                code_lines.append(f'"{tech}",')
            code_lines.append("")
    
    return "\n".join(code_lines)


def main():
    """Main function to check and report inconsistencies."""
    logger.info("Starting tech stack data synchronization check")
    
    tech_stack_missing, template_missing, both_missing = find_inconsistencies()
    
    # Always print the report
    print_report(tech_stack_missing, template_missing, both_missing)
    
    if both_missing:
        registry_updates = generate_registry_update_code(both_missing)
        logger.info("Generated registry update code")
        
        # Write update code to a file
        with open("suggested_registry_updates.py", "w") as f:
            f.write(registry_updates)
        
        logger.info("Wrote suggested updates to suggested_registry_updates.py")
    
    logger.info("Tech stack data synchronization check complete")


if __name__ == "__main__":
    main() 