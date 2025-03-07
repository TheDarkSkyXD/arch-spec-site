"""
Service for tech stack compatibility checks and data retrieval.
"""
from typing import Dict, List, Any, Optional
from ..seed.tech_stack import check_compatibility, get_compatible_options, TECH_STACK_DATA
from ..schemas.tech_stack import (
    TechStackSelection, 
    CompatibilityResult, 
    CompatibleOptionsResponse,
    AllTechOptionsResponse
)

class TechStackService:
    """Service for tech stack compatibility operations."""
    
    @staticmethod
    async def check_compatibility(selection: TechStackSelection) -> CompatibilityResult:
        """
        Check compatibility between selected technologies.
        
        Args:
            selection: The tech stack selection to check
            
        Returns:
            Compatibility check results
        """
        # Just pass the Pydantic model to the compatibility checker 
        # which now accepts both Dict and TechStackSelection
        return check_compatibility(selection)
    
    @staticmethod
    async def get_compatible_options(category: str, technology: str) -> CompatibleOptionsResponse:
        """
        Get compatible options for a given technology in a specific category.
        
        Args:
            category: The technology category
            technology: The specific technology name
            
        Returns:
            Compatible options
        """
        return get_compatible_options(category, technology)
    
    @staticmethod
    async def get_all_technology_options() -> AllTechOptionsResponse:
        """
        Get all available technology options from the data.
        
        Returns:
            AllTechOptionsResponse containing all technology options
        """
        # Convert raw data to structured response
        return AllTechOptionsResponse(
            frontend=TECH_STACK_DATA["frontend"],
            backend=TECH_STACK_DATA["backend"],
            database=TECH_STACK_DATA["database"],
            hosting=TECH_STACK_DATA.get("hosting", {}),
            authentication=TECH_STACK_DATA.get("authentication", {})
        ) 