"""
Service for tech stack compatibility checks and data retrieval.
"""
from typing import Dict, List, Any, Optional
from ..seed.tech_stack import check_compatibility, get_compatible_options, TECH_STACK_DATA
from ..schemas.tech_stack import TechStackSelection, CompatibilityResult, CompatibleOptionsResponse

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
        # Convert pydantic model to dict and remove None values
        tech_choice = selection.dict(exclude_none=True)
        
        # Call the compatibility check function from the seed module
        result = check_compatibility(tech_choice)
        
        # Return as pydantic model
        return CompatibilityResult(**result)
    
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
        options = get_compatible_options(category, technology)
        return CompatibleOptionsResponse(options=options)
    
    @staticmethod
    async def get_all_technology_options() -> Dict[str, Any]:
        """
        Get all available technology options from the data.
        
        Returns:
            Dictionary of all technology options
        """
        return TECH_STACK_DATA["techStackOptions"] 