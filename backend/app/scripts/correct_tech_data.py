#!/usr/bin/env python
"""
Tech Data Correction Script.

This script automatically corrects inconsistencies in tech stack and template data
based on the technology registry. It attempts to normalize technology names by
finding close matches in the registry.
"""
import logging
import sys
import os
import json
from typing import Dict, List, Set, Any, Tuple, Optional
import difflib
from pathlib import Path

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.seed.tech_registry import (
    TECH_REGISTRY, 
    ALL_TECHNOLOGIES, 
    is_valid_tech,
    get_category_for_tech
)
from app.seed.tech_stack import TECH_STACK_DATA
from app.seed.templates import PROJECT_TEMPLATES
from app.scripts.sync_tech_data import (
    extract_tech_from_tech_stack,
    extract_tech_from_templates,
    find_inconsistencies
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def find_closest_match(tech_name: str, threshold: float = 0.8) -> Optional[str]:
    """
    Find the closest matching technology name in the registry.
    
    Args:
        tech_name: The technology name to find a match for
        threshold: Similarity threshold (0.0 to 1.0)
        
    Returns:
        The closest matching technology name or None if no match found
    """
    if is_valid_tech(tech_name):
        return tech_name
    
    # Check for simple case differences
    for valid_tech in ALL_TECHNOLOGIES:
        if valid_tech.lower() == tech_name.lower():
            return valid_tech
    
    # Find the closest match using difflib
    matches = difflib.get_close_matches(tech_name, ALL_TECHNOLOGIES, n=1, cutoff=threshold)
    
    if matches:
        return matches[0]
    
    return None


def correct_tech_stack_data() -> Dict:
    """
    Correct technology names in the tech stack data.
    
    Returns:
        Corrected tech stack data
    """
    logger.info("Correcting tech stack data...")
    
    # Create a deep copy of the original data
    corrected_data = json.loads(json.dumps(TECH_STACK_DATA))
    corrections_made = 0
    
    # Frontend frameworks
    for i, framework in enumerate(corrected_data.get("techStackOptions", {}).get("frontend", {}).get("frameworks", [])):
        name = framework.get("name")
        if name and not is_valid_tech(name):
            closest_match = find_closest_match(name)
            if closest_match:
                logger.info(f"Correcting frontend framework: {name} -> {closest_match}")
                corrected_data["techStackOptions"]["frontend"]["frameworks"][i]["name"] = closest_match
                corrections_made += 1
        
        # Correct compatibility entries
        for compat_category, compat_techs in framework.get("compatibility", {}).items():
            for j, tech in enumerate(compat_techs):
                if not is_valid_tech(tech):
                    closest_match = find_closest_match(tech)
                    if closest_match:
                        logger.info(f"Correcting compatibility tech: {tech} -> {closest_match}")
                        corrected_data["techStackOptions"]["frontend"]["frameworks"][i]["compatibility"][compat_category][j] = closest_match
                        corrections_made += 1
    
    # Backend frameworks
    for i, framework in enumerate(corrected_data.get("techStackOptions", {}).get("backend", {}).get("frameworks", [])):
        name = framework.get("name")
        if name and not is_valid_tech(name):
            closest_match = find_closest_match(name)
            if closest_match:
                logger.info(f"Correcting backend framework: {name} -> {closest_match}")
                corrected_data["techStackOptions"]["backend"]["frameworks"][i]["name"] = closest_match
                corrections_made += 1
        
        # Correct compatibility entries
        for compat_category, compat_techs in framework.get("compatibility", {}).items():
            for j, tech in enumerate(compat_techs):
                if not is_valid_tech(tech):
                    closest_match = find_closest_match(tech)
                    if closest_match:
                        logger.info(f"Correcting compatibility tech: {tech} -> {closest_match}")
                        corrected_data["techStackOptions"]["backend"]["frameworks"][i]["compatibility"][compat_category][j] = closest_match
                        corrections_made += 1
    
    # Database options
    for i, db in enumerate(corrected_data.get("techStackOptions", {}).get("database", {}).get("options", [])):
        if not is_valid_tech(db):
            closest_match = find_closest_match(db)
            if closest_match:
                logger.info(f"Correcting database option: {db} -> {closest_match}")
                corrected_data["techStackOptions"]["database"]["options"][i] = closest_match
                corrections_made += 1
    
    logger.info(f"Made {corrections_made} corrections to tech stack data")
    
    return corrected_data


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
        
        # Process frontend tech
        if "frontend" in tech_stack:
            frontend = tech_stack["frontend"]
            for key, value in frontend.items():
                if key != "options" and isinstance(value, str) and not is_valid_tech(value):
                    closest_match = find_closest_match(value)
                    if closest_match:
                        logger.info(f"Correcting frontend tech: {value} -> {closest_match}")
                        corrected_templates[i]["template"]["techStack"]["frontend"][key] = closest_match
                        corrections_made += 1
                elif key == "options" and isinstance(value, list):
                    for j, option in enumerate(value):
                        if not is_valid_tech(option):
                            closest_match = find_closest_match(option)
                            if closest_match:
                                logger.info(f"Correcting frontend option: {option} -> {closest_match}")
                                corrected_templates[i]["template"]["techStack"]["frontend"]["options"][j] = closest_match
                                corrections_made += 1
        
        # Process backend tech
        if "backend" in tech_stack:
            backend = tech_stack["backend"]
            for key, value in backend.items():
                if key != "options" and isinstance(value, str) and not is_valid_tech(value):
                    closest_match = find_closest_match(value)
                    if closest_match:
                        logger.info(f"Correcting backend tech: {value} -> {closest_match}")
                        corrected_templates[i]["template"]["techStack"]["backend"][key] = closest_match
                        corrections_made += 1
                elif key == "options" and isinstance(value, list):
                    for j, option in enumerate(value):
                        if not is_valid_tech(option):
                            closest_match = find_closest_match(option)
                            if closest_match:
                                logger.info(f"Correcting backend option: {option} -> {closest_match}")
                                corrected_templates[i]["template"]["techStack"]["backend"]["options"][j] = closest_match
                                corrections_made += 1
        
        # Process database tech
        if "database" in tech_stack:
            database = tech_stack["database"]
            for key, value in database.items():
                if key != "options" and isinstance(value, str) and not is_valid_tech(value):
                    closest_match = find_closest_match(value)
                    if closest_match:
                        logger.info(f"Correcting database tech: {value} -> {closest_match}")
                        corrected_templates[i]["template"]["techStack"]["database"][key] = closest_match
                        corrections_made += 1
                elif key == "options" and isinstance(value, list):
                    for j, option in enumerate(value):
                        if not is_valid_tech(option):
                            closest_match = find_closest_match(option)
                            if closest_match:
                                logger.info(f"Correcting database option: {option} -> {closest_match}")
                                corrected_templates[i]["template"]["techStack"]["database"]["options"][j] = closest_match
                                corrections_made += 1
        
        # Process authentication tech
        if "authentication" in tech_stack:
            auth = tech_stack["authentication"]
            for key, value in auth.items():
                if key != "methods" and key != "options" and isinstance(value, str) and not is_valid_tech(value):
                    closest_match = find_closest_match(value)
                    if closest_match:
                        logger.info(f"Correcting auth tech: {value} -> {closest_match}")
                        corrected_templates[i]["template"]["techStack"]["authentication"][key] = closest_match
                        corrections_made += 1
                elif (key == "methods" or key == "options") and isinstance(value, list):
                    for j, option in enumerate(value):
                        if not is_valid_tech(option):
                            closest_match = find_closest_match(option)
                            if closest_match:
                                logger.info(f"Correcting auth option: {option} -> {closest_match}")
                                corrected_templates[i]["template"]["techStack"]["authentication"][key][j] = closest_match
                                corrections_made += 1
    
    logger.info(f"Made {corrections_made} corrections to template data")
    
    return corrected_templates


def write_corrected_data(corrected_tech_stack: Dict, corrected_templates: List[Dict]) -> None:
    """
    Write corrected data to files.
    
    Args:
        corrected_tech_stack: Corrected tech stack data
        corrected_templates: Corrected template data
    """
    # Create directory for corrected files
    output_dir = Path("corrected_data")
    output_dir.mkdir(exist_ok=True)
    
    # Write tech stack data
    with open(output_dir / "corrected_tech_stack.py", "w") as f:
        f.write("# Corrected Tech Stack Data\n\n")
        f.write("TECH_STACK_DATA = ")
        f.write(json.dumps(corrected_tech_stack, indent=4))
        f.write("\n")
    
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
    tech_stack_missing, template_missing, both_missing = find_inconsistencies()
    
    if tech_stack_missing or template_missing:
        logger.info(f"Found {len(tech_stack_missing)} tech stack inconsistencies")
        logger.info(f"Found {len(template_missing)} template inconsistencies")
        
        # Correct the data
        corrected_tech_stack = correct_tech_stack_data()
        corrected_templates = correct_template_data()
        
        # Write corrected data to files
        write_corrected_data(corrected_tech_stack, corrected_templates)
        
        logger.info("Correction process complete")
    else:
        logger.info("No inconsistencies found! All technology names are valid.")


if __name__ == "__main__":
    main() 