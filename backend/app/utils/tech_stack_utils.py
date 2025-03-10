from typing import Set, Optional

from ..schemas.tech_stack import TechStackData

class TechStackUtils:
    """Utility class for working with tech stack data."""
    
    def __init__(self, tech_stack_data: TechStackData):
        """Initialize with tech stack data."""
        self.tech_stack = tech_stack_data
        self._all_technologies: Optional[Set[str]] = None
    
    @property
    def all_technologies(self) -> Set[str]:
        """Get a set of all technology names in the system (cached for performance)."""
        if self._all_technologies is None:
            self._all_technologies = set()
            
            # Add technologies from categories
            categories = self.tech_stack.categories
            
            # Frontend
            self._all_technologies.update(categories.frontend.frameworks)
            self._all_technologies.update(categories.frontend.languages)
            self._all_technologies.update(categories.frontend.stateManagement)
            self._all_technologies.update(categories.frontend.uiLibraries)
            self._all_technologies.update(categories.frontend.formHandling)
            self._all_technologies.update(categories.frontend.routing)
            self._all_technologies.update(categories.frontend.apiClients)
            self._all_technologies.update(categories.frontend.metaFrameworks)
            
            # Backend
            self._all_technologies.update(categories.backend.frameworks)
            self._all_technologies.update(categories.backend.languages)
            self._all_technologies.update(categories.backend.baas)
            self._all_technologies.update(categories.backend.serverless)
            self._all_technologies.update(categories.backend.realtime)
            
            # Database
            self._all_technologies.update(categories.database.sql)
            self._all_technologies.update(categories.database.nosql)
            self._all_technologies.update(categories.database.providers)
            self._all_technologies.update(categories.database.clients)
            
            # Auth
            self._all_technologies.update(categories.authentication.providers)
            self._all_technologies.update(categories.authentication.methods)
            
            # Deployment
            self._all_technologies.update(categories.deployment.platforms)
            self._all_technologies.update(categories.deployment.containerization)
            self._all_technologies.update(categories.deployment.ci_cd)
            
            # Storage
            self._all_technologies.update(categories.storage.objectStorage)
            self._all_technologies.update(categories.storage.fileSystem)
            
            # Hosting
            self._all_technologies.update(categories.hosting.frontend)
            self._all_technologies.update(categories.hosting.backend)
            self._all_technologies.update(categories.hosting.database)
            
            # Testing
            self._all_technologies.update(categories.testing.unitTesting)
            self._all_technologies.update(categories.testing.e2eTesting)
            self._all_technologies.update(categories.testing.apiTesting)
            
        return self._all_technologies
    
    def is_valid_tech(self, tech_name: str) -> bool:
        """Check if a technology exists in the system."""
        return tech_name in self.all_technologies
    
    def get_tech_category(self, tech_name: str) -> Optional[str]:
        """Get the category of a technology."""
        if not self.is_valid_tech(tech_name):
            return None
            
        categories = self.tech_stack.categories
        
        # Frontend categories
        if tech_name in categories.frontend.frameworks:
            return "frontend.frameworks"
        if tech_name in categories.frontend.languages:
            return "frontend.languages"
        if tech_name in categories.frontend.stateManagement:
            return "frontend.stateManagement"
        if tech_name in categories.frontend.uiLibraries:
            return "frontend.uiLibraries"
        if tech_name in categories.frontend.formHandling:
            return "frontend.formHandling"
        if tech_name in categories.frontend.routing:
            return "frontend.routing"
        if tech_name in categories.frontend.apiClients:
            return "frontend.apiClients"
        if tech_name in categories.frontend.metaFrameworks:
            return "frontend.metaFrameworks"
        
        # Backend categories
        if tech_name in categories.backend.frameworks:
            return "backend.frameworks"
        if tech_name in categories.backend.languages:
            return "backend.languages"
        if tech_name in categories.backend.baas:
            return "backend.baas"
        if tech_name in categories.backend.serverless:
            return "backend.serverless"
        if tech_name in categories.backend.realtime:
            return "backend.realtime"
        
        # Database categories
        if tech_name in categories.database.sql:
            return "database.sql"
        if tech_name in categories.database.nosql:
            return "database.nosql"
        if tech_name in categories.database.providers:
            return "database.providers"
        if tech_name in categories.database.clients:
            return "database.clients"
        
        # Authentication categories
        if tech_name in categories.authentication.providers:
            return "authentication.providers"
        if tech_name in categories.authentication.methods:
            return "authentication.methods"
        
        # Deployment categories
        if tech_name in categories.deployment.platforms:
            return "deployment.platforms"
        if tech_name in categories.deployment.containerization:
            return "deployment.containerization"
        if tech_name in categories.deployment.ci_cd:
            return "deployment.ci_cd"
        
        # Storage categories
        if tech_name in categories.storage.objectStorage:
            return "storage.objectStorage"
        if tech_name in categories.storage.fileSystem:
            return "storage.fileSystem"
        
        # Hosting categories
        if tech_name in categories.hosting.frontend:
            return "hosting.frontend"
        if tech_name in categories.hosting.backend:
            return "hosting.backend"
        if tech_name in categories.hosting.database:
            return "hosting.database"
        
        # Testing categories
        if tech_name in categories.testing.unitTesting:
            return "testing.unitTesting"
        if tech_name in categories.testing.e2eTesting:
            return "testing.e2eTesting"
        if tech_name in categories.testing.apiTesting:
            return "testing.apiTesting"
        
        return None
    
    def get_compatible_technologies(self, tech_name: str, target_category: Optional[str] = None) -> Set[str]:
        """
        Get technologies compatible with the given technology.
        
        Args:
            tech_name: The name of the technology to check compatibility for
            target_category: Optional category to filter compatible technologies
                             (e.g., "frontend.frameworks", "database.sql")
        
        Returns:
            Set of compatible technology names
        """
        if not self.is_valid_tech(tech_name):
            return set()
            
        technologies = self.tech_stack.technologies
        compatible_techs = set()
        
        # Check which technology dictionary contains this tech
        tech_category = self.get_tech_category(tech_name)
        if not tech_category:
            return set()
            
        category_parts = tech_category.split('.')
        main_category = category_parts[0]
        sub_category = category_parts[1]
        
        # Find compatibility based on technology type
        if main_category == "frontend" and sub_category == "frameworks":
            if tech_name in technologies.frameworks:
                framework = technologies.frameworks[tech_name]
                if hasattr(framework.compatibleWith, "stateManagement"):
                    compatible_techs.update(framework.compatibleWith.stateManagement)
                if hasattr(framework.compatibleWith, "uiLibraries"):
                    compatible_techs.update(framework.compatibleWith.uiLibraries)
                if hasattr(framework.compatibleWith, "formHandling"):
                    compatible_techs.update(framework.compatibleWith.formHandling)
                if hasattr(framework.compatibleWith, "routing"):
                    compatible_techs.update(framework.compatibleWith.routing)
                if hasattr(framework.compatibleWith, "apiClients"):
                    compatible_techs.update(framework.compatibleWith.apiClients)
                if hasattr(framework.compatibleWith, "metaFrameworks"):
                    compatible_techs.update(framework.compatibleWith.metaFrameworks)
                if hasattr(framework.compatibleWith, "hosting"):
                    compatible_techs.update(framework.compatibleWith.hosting)
        
        elif main_category == "frontend" and sub_category == "stateManagement":
            if tech_name in technologies.stateManagement:
                compatible_techs.update(technologies.stateManagement[tech_name].compatibleWith)
        
        elif main_category == "frontend" and sub_category == "uiLibraries":
            if tech_name in technologies.uiLibraries:
                compatible_techs.update(technologies.uiLibraries[tech_name].compatibleWith)
        
        # Continue with other categories...
        # This pattern would be repeated for each category and subcategory
        
        # Filter by target category if provided
        if target_category and compatible_techs:
            target_techs = set()
            target_parts = target_category.split('.')
            target_main = target_parts[0]
            target_sub = target_parts[1]
            
            target_list = getattr(getattr(self.tech_stack.categories, target_main), target_sub)
            target_techs = set(target_list)
            
            compatible_techs = compatible_techs.intersection(target_techs)
        
        return compatible_techs

# Convenience functions for use without instantiating the class
def is_valid_tech(tech_stack_data: TechStackData, tech_name: str) -> bool:
    """Check if a technology exists in the system."""
    utils = TechStackUtils(tech_stack_data)
    return utils.is_valid_tech(tech_name)

def get_tech_category(tech_stack_data: TechStackData, tech_name: str) -> Optional[str]:
    """Get the category of a technology."""
    utils = TechStackUtils(tech_stack_data)
    return utils.get_tech_category(tech_name)

def get_compatible_technologies(tech_stack_data: TechStackData, tech_name: str, 
                               target_category: Optional[str] = None) -> Set[str]:
    """Get technologies compatible with the given technology."""
    utils = TechStackUtils(tech_stack_data)
    return utils.get_compatible_technologies(tech_name, target_category)
