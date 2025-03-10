"""
Service for tech stack compatibility checks and data retrieval.
"""
from ..seed.tech_stack import (
    get_all_tech_options_with_db
)
from ..schemas.tech_stack import (
    AllTechOptionsResponse
)

class TechStackService:    
    @staticmethod
    async def get_all_technology_options() -> AllTechOptionsResponse:
        """
        Get all available technology options across all categories.
        
        Returns:
            All technology options organized by category
        """
        tech_options = await get_all_tech_options_with_db()
        
        # Return as a properly formatted AllTechOptionsResponse object
        return AllTechOptionsResponse(
            frontend=tech_options.get("frontend", {}),
            backend=tech_options.get("backend", {}),
            database=tech_options.get("database", {}),
            authentication=tech_options.get("authentication", {}),
            hosting=tech_options.get("hosting", {})
        ) 