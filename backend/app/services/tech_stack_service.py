"""
Service for tech stack compatibility checks and data retrieval.
"""
from ..seed.tech_stack import (
    check_compatibility_with_db, 
    get_compatible_options_with_db, 
    get_all_tech_options_with_db
)
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
        # Use the database-first version of the compatibility checker
        return await check_compatibility_with_db(selection)
    
    @staticmethod
    async def get_compatible_options(category: str, technology: str) -> CompatibleOptionsResponse:
        """
        Get compatible options for a given technology in a category.
        
        Args:
            category: Technology category
            technology: Technology name
            
        Returns:
            Compatible options for the specified technology
        """
        # Use the database-first version of the function
        return await get_compatible_options_with_db(category, technology)
    
    @staticmethod
    async def get_all_technology_options() -> AllTechOptionsResponse:
        """
        Get all available technology options across all categories.
        
        Returns:
            All technology options organized by category
        """
        # Use the database-first version to get tech options
        tech_options = await get_all_tech_options_with_db()
        
        # Return as a properly formatted AllTechOptionsResponse object
        return AllTechOptionsResponse(
            frontend=tech_options.get("frontend", {}),
            backend=tech_options.get("backend", {}),
            database=tech_options.get("database", {}),
            authentication=tech_options.get("authentication", {}),
            hosting=tech_options.get("hosting", {})
        ) 