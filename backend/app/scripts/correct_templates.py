#!/usr/bin/env python
"""
Tech Data Correction Script.

This script automatically corrects inconsistencies in template data
based on the tech stack data. It attempts to normalize technology names by
finding close matches in the tech stack data.
"""
import logging
import sys
import os
import json
from typing import Dict, List, Optional
import difflib
from pathlib import Path

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.seed.tech_stack_data import TECH_STACK_DATA
from app.seed.templates import PROJECT_TEMPLATES

from app.utils.tech_stack_utils import TechStackUtils

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


utils = TechStackUtils(TECH_STACK_DATA)

def find_closest_match(tech_name: str, threshold: float = 0.8) -> Optional[str]:
    """
    Find the closest matching technology name in the tech stack.
    
    Args:
        tech_name: The technology name to find a match for
        threshold: Similarity threshold (0.0 to 1.0)
        
    Returns:
        The closest matching technology name or None if no match found
    """
    if utils.is_valid_tech(tech_name):
        return tech_name
    
    # Check for simple case differences
    for valid_tech in utils.all_technologies:
        if valid_tech.lower() == tech_name.lower():
            return valid_tech
    
    # Find the closest match using difflib
    matches = difflib.get_close_matches(tech_name, utils.all_technologies, n=1, cutoff=threshold)
    
    if matches:
        return matches[0]
    
    logger.warning(f"Manual correction needed: {tech_name} not found in tech stack")
    return None

def correct_template_data() -> List[Dict]:
    """
    Correct technology names in the template data.
    
    Returns:
        Corrected template data
    """
    logger.info("Correcting template data...")
    
    # Create a deep copy of the original data
    corrected_templates = json.loads(json.dumps(PROJECT_TEMPLATES))
    corrections_made = 0
    
    for i, template in enumerate(corrected_templates):
        tech_stack = template.get("template", {}).get("techStack", {})
        
        # Check if it's using the new flattened structure
        if "frontend" in tech_stack and isinstance(tech_stack["frontend"], dict) and "frameworks" in tech_stack["frontend"]:
            # Process frontend frameworks
            for j, framework in enumerate(tech_stack["frontend"].get("frameworks", [])):
                name = framework.get("name")
                if name and not utils.is_valid_tech(name):
                    closest_match = find_closest_match(name)
                    if closest_match:
                        logger.info(f"Correcting frontend framework: {name} -> {closest_match}")
                        corrected_templates[i]["template"]["techStack"]["frontend"]["frameworks"][j]["name"] = closest_match
                        corrections_made += 1
                
                # Correct compatibility entries
                for compat_category, compat_techs in framework.get("compatibility", {}).items():
                    for k, tech in enumerate(compat_techs):
                        if not utils.is_valid_tech(tech):
                            closest_match = find_closest_match(tech)
                            if closest_match:
                                logger.info(f"Correcting compatibility tech: {tech} -> {closest_match}")
                                corrected_templates[i]["template"]["techStack"]["frontend"]["frameworks"][j]["compatibility"][compat_category][k] = closest_match
                                corrections_made += 1
            
            # Process backend frameworks
            for j, framework in enumerate(tech_stack.get("backend", {}).get("frameworks", [])):
                name = framework.get("name")
                if name and not utils.is_valid_tech(name):
                    closest_match = find_closest_match(name)
                    if closest_match:
                        logger.info(f"Correcting backend framework: {name} -> {closest_match}")
                        corrected_templates[i]["template"]["techStack"]["backend"]["frameworks"][j]["name"] = closest_match
                        corrections_made += 1
                
                # Correct compatibility entries
                for compat_category, compat_techs in framework.get("compatibility", {}).items():
                    for k, tech in enumerate(compat_techs):
                        if not utils.is_valid_tech(tech):
                            closest_match = find_closest_match(tech)
                            if closest_match:
                                logger.info(f"Correcting compatibility tech: {tech} -> {closest_match}")
                                corrected_templates[i]["template"]["techStack"]["backend"]["frameworks"][j]["compatibility"][compat_category][k] = closest_match
                                corrections_made += 1
            
            # Process backend BaaS
            for j, baas in enumerate(tech_stack.get("backend", {}).get("baas", [])):
                name = baas.get("name")
                if name and not utils.is_valid_tech(name):
                    closest_match = find_closest_match(name)
                    if closest_match:
                        logger.info(f"Correcting backend BaaS: {name} -> {closest_match}")
                        corrected_templates[i]["template"]["techStack"]["backend"]["baas"][j]["name"] = closest_match
                        corrections_made += 1
                
                # Correct compatibility entries
                for compat_category, compat_techs in baas.get("compatibility", {}).items():
                    for k, tech in enumerate(compat_techs):
                        if not utils.is_valid_tech(tech):
                            closest_match = find_closest_match(tech)
                            if closest_match:
                                logger.info(f"Correcting compatibility tech: {tech} -> {closest_match}")
                                corrected_templates[i]["template"]["techStack"]["backend"]["baas"][j]["compatibility"][compat_category][k] = closest_match
                                corrections_made += 1
            
            # Process database
            for db_type in ["sql", "nosql"]:
                for j, db in enumerate(tech_stack.get("database", {}).get(db_type, [])):
                    name = db.get("name")
                    if name and not utils.is_valid_tech(name):
                        closest_match = find_closest_match(name)
                        if closest_match:
                            logger.info(f"Correcting {db_type} database: {name} -> {closest_match}")
                            corrected_templates[i]["template"]["techStack"]["database"][db_type][j]["name"] = closest_match
                            corrections_made += 1
                    
                    # Correct compatibility entries
                    for compat_category, compat_techs in db.get("compatibility", {}).items():
                        for k, tech in enumerate(compat_techs):
                            if not utils.is_valid_tech(tech):
                                closest_match = find_closest_match(tech)
                                if closest_match:
                                    logger.info(f"Correcting compatibility tech: {tech} -> {closest_match}")
                                    corrected_templates[i]["template"]["techStack"]["database"][db_type][j]["compatibility"][compat_category][k] = closest_match
                                    corrections_made += 1
            
            # Process hosting options
            for key, value_list in tech_stack.get("hosting", {}).items():
                for j, value in enumerate(value_list):
                    if not utils.is_valid_tech(value):
                        closest_match = find_closest_match(value)
                        if closest_match:
                            logger.info(f"Correcting hosting option: {value} -> {closest_match}")
                            corrected_templates[i]["template"]["techStack"]["hosting"][key][j] = closest_match
                            corrections_made += 1
            
            # Process authentication options
            for key, value_list in tech_stack.get("authentication", {}).items():
                for j, value in enumerate(value_list):
                    if not utils.is_valid_tech(value):
                        closest_match = find_closest_match(value)
                        if closest_match:
                            logger.info(f"Correcting authentication option: {value} -> {closest_match}")
                            corrected_templates[i]["template"]["techStack"]["authentication"][key][j] = closest_match
                            corrections_made += 1
        else:
            # Handle old format templates (for backward compatibility)
            # Process frontend tech
            if "frontend" in tech_stack:
                frontend = tech_stack["frontend"]
                for key, value in frontend.items():
                    if key != "options" and isinstance(value, str) and not utils.is_valid_tech(value):
                        closest_match = find_closest_match(value)
                        if closest_match:
                            logger.info(f"Correcting frontend tech: {value} -> {closest_match}")
                            corrected_templates[i]["template"]["techStack"]["frontend"][key] = closest_match
                            corrections_made += 1
                    elif key == "options" and isinstance(value, list):
                        for j, option in enumerate(value):
                            if not utils.is_valid_tech(option):
                                closest_match = find_closest_match(option)
                                if closest_match:
                                    logger.info(f"Correcting frontend option: {option} -> {closest_match}")
                                    corrected_templates[i]["template"]["techStack"]["frontend"]["options"][j] = closest_match
                                    corrections_made += 1

    
    logger.info(f"Made {corrections_made} corrections to template data")
    
    return corrected_templates


def write_corrected_data(corrected_templates: List[Dict]) -> None:
    """
    Write corrected data to files.
    
    Args:
        corrected_templates: Corrected template data
    """
    # Create directory for corrected files
    output_dir = Path("corrected_data")
    output_dir.mkdir(exist_ok=True)
    
    # Write templates data
    with open(output_dir / "corrected_templates.py", "w") as f:
        f.write("# Corrected Templates Data\n\n")
        f.write("PROJECT_TEMPLATES = ")
        f.write(json.dumps(corrected_templates, indent=4))
        f.write("\n")
    
    logger.info(f"Wrote corrected data to {output_dir}")


def main():
    """Main function to correct tech data inconsistencies."""
    logger.info("Starting tech data correction process")
    
    # First, find inconsistencies to understand the problem
    template_missing = find_inconsistencies()
    
    if template_missing:
        logger.info(f"Found {len(template_missing)} template inconsistencies")
        
        # Correct the data
        corrected_templates = correct_template_data()
        
        # Write corrected data to files
        write_corrected_data(corrected_templates)
        
        logger.info("Correction process complete")
    else:
        logger.info("No inconsistencies found! All technology names are valid.")


if __name__ == "__main__":
    main() 