"""
Technology Registry Schema - Schema definitions for the Technology Registry.

This module defines the Pydantic models that represent the structure of the technology registry.
These schemas are used to enforce type safety and provide better validation for the tech registry.
"""
from typing import Dict, List, Optional, Set, Any, Union
from pydantic import BaseModel, Field, model_validator


class FrontendTechnologies(BaseModel):
    """
    Schema for frontend technologies in the registry.
    
    Contains all subcategories of frontend technologies.
    """
    frameworks: List[str] = Field(default_factory=list, description="Frontend frameworks")
    languages: List[str] = Field(default_factory=list, description="Frontend programming languages")
    stateManagement: List[str] = Field(default_factory=list, description="State management libraries")
    uiLibraries: List[str] = Field(default_factory=list, description="UI component libraries")
    formHandling: List[str] = Field(default_factory=list, description="Form handling libraries")
    routing: List[str] = Field(default_factory=list, description="Routing libraries")
    apiClients: List[str] = Field(default_factory=list, description="API client libraries")
    metaFrameworks: List[str] = Field(default_factory=list, description="Meta frameworks")


class BackendTechnologies(BaseModel):
    """
    Schema for backend technologies in the registry.
    
    Contains all subcategories of backend technologies.
    """
    frameworks: List[str] = Field(default_factory=list, description="Backend frameworks")
    languages: List[str] = Field(default_factory=list, description="Backend programming languages")
    orms: List[str] = Field(default_factory=list, description="Object-Relational Mapping libraries")
    authFrameworks: List[str] = Field(default_factory=list, description="Authentication frameworks")


class DatabaseTechnologies(BaseModel):
    """
    Schema for database technologies in the registry.
    
    Contains all subcategories of database technologies.
    """
    relational: List[str] = Field(default_factory=list, description="Relational databases")
    noSql: List[str] = Field(default_factory=list, description="NoSQL databases") 
    providers: List[str] = Field(default_factory=list, description="Database providers")


class AuthenticationTechnologies(BaseModel):
    """
    Schema for authentication technologies in the registry.
    
    Contains all subcategories of authentication technologies.
    """
    providers: List[str] = Field(default_factory=list, description="Authentication providers")
    methods: List[str] = Field(default_factory=list, description="Authentication methods")


class DeploymentTechnologies(BaseModel):
    """
    Schema for deployment technologies in the registry.
    
    Contains all subcategories of deployment technologies.
    """
    platforms: List[str] = Field(default_factory=list, description="Deployment platforms")
    containerization: List[str] = Field(default_factory=list, description="Containerization technologies")
    ci_cd: List[str] = Field(default_factory=list, description="CI/CD technologies")


class TestingTechnologies(BaseModel):
    """
    Schema for testing technologies in the registry.
    
    Contains all subcategories of testing technologies.
    """
    unitTesting: List[str] = Field(default_factory=list, description="Unit testing frameworks")
    e2eTesting: List[str] = Field(default_factory=list, description="End-to-end testing frameworks")
    apiTesting: List[str] = Field(default_factory=list, description="API testing frameworks")


class StorageTechnologies(BaseModel):
    """
    Schema for storage technologies in the registry.
    
    Contains all subcategories of storage technologies.
    """
    objectStorage: List[str] = Field(default_factory=list, description="Object storage technologies")
    fileSystem: List[str] = Field(default_factory=list, description="File system technologies")


class ServerlessTechnologies(BaseModel):
    """
    Schema for serverless technologies in the registry.
    
    Contains all subcategories of serverless technologies.
    """
    functions: List[str] = Field(default_factory=list, description="Serverless functions")
    platforms: List[str] = Field(default_factory=list, description="Serverless platforms")


class TechRegistrySchema(BaseModel):
    """
    Schema for the complete technology registry.
    
    This is the top-level schema that represents the entire technology registry,
    containing all categories with their subcategories and technologies.
    """
    # Main technology categories
    frontend: FrontendTechnologies = Field(default_factory=FrontendTechnologies, description="Frontend technologies")
    backend: BackendTechnologies = Field(default_factory=BackendTechnologies, description="Backend technologies")
    database: DatabaseTechnologies = Field(default_factory=DatabaseTechnologies, description="Database technologies")
    authentication: AuthenticationTechnologies = Field(default_factory=AuthenticationTechnologies, description="Authentication technologies")
    deployment: DeploymentTechnologies = Field(default_factory=DeploymentTechnologies, description="Deployment technologies")
    testing: TestingTechnologies = Field(default_factory=TestingTechnologies, description="Testing technologies")
    storage: StorageTechnologies = Field(default_factory=StorageTechnologies, description="Storage technologies")
    serverless: ServerlessTechnologies = Field(default_factory=ServerlessTechnologies, description="Serverless technologies")
    # Flat set of all technologies for quick validation
    all_technologies: Set[str] = Field(default_factory=set, description="Set of all technology names for quick validation")
    
    @model_validator(mode='after')
    def populate_all_technologies(self) -> 'TechRegistrySchema':
        """
        Populate the all_technologies set based on the technologies in all categories.
        
        This validator runs after all fields are validated and populates the all_technologies
        set with all technology names from all categories and subcategories.
        """
        all_techs = set()
        
        # Frontend technologies
        for tech_list in [
            self.frontend.frameworks,
            self.frontend.languages,
            self.frontend.stateManagement,
            self.frontend.uiLibraries,
            self.frontend.formHandling,
            self.frontend.routing,
            self.frontend.apiClients,
            self.frontend.metaFrameworks,
        ]:
            all_techs.update(tech_list)
        
        # Backend technologies
        for tech_list in [
            self.backend.frameworks,
            self.backend.languages,
            self.backend.orms,
            self.backend.authFrameworks,
        ]:
            all_techs.update(tech_list)
        
        # Database technologies
        for tech_list in [
            self.database.relational,
            self.database.noSql,
            self.database.providers,
        ]:
            all_techs.update(tech_list)
        
        # Authentication technologies
        for tech_list in [
            self.authentication.providers,
            self.authentication.methods,
        ]:
            all_techs.update(tech_list)
        
        # Deployment technologies
        for tech_list in [
            self.deployment.platforms,
            self.deployment.containerization,
            self.deployment.ci_cd,
        ]:
            all_techs.update(tech_list)
        
        # Testing technologies
        for tech_list in [
            self.testing.unitTesting,
            self.testing.e2eTesting,
            self.testing.apiTesting,
        ]:
            all_techs.update(tech_list)
        
        # Storage technologies
        for tech_list in [
            self.storage.objectStorage,
            self.storage.fileSystem,
        ]:
            all_techs.update(tech_list)
        
        # Serverless technologies
        for tech_list in [
            self.serverless.functions,
            self.serverless.platforms,
        ]:
            all_techs.update(tech_list)
        
        self.all_technologies = all_techs
        return self
    
    class Config:
        """Configuration for the schema."""
        json_schema_extra = {
            "example": {
                "frontend": {
                    "frameworks": ["React", "Vue.js", "Angular"],
                    "languages": ["JavaScript", "TypeScript"],
                    "stateManagement": ["Redux", "Vuex"],
                },
                "backend": {
                    "frameworks": ["Express.js", "Django", "FastAPI"],
                    "languages": ["JavaScript", "Python", "TypeScript"],
                },
                "all_technologies": ["React", "Vue.js", "Angular", "Express.js", "Django"]
            }
        }


class InvalidTechnology(BaseModel):
    """
    Schema for an invalid technology entry.
    
    Used in validation results to identify technologies that do not exist in the registry.
    """
    section: str = Field(..., description="Section where the invalid technology was found")
    key: str = Field(..., description="Key within the section")
    technology: str = Field(..., description="Name of the invalid technology")


class TechStackValidationResult(BaseModel):
    """
    Schema for the result of validating a tech stack.
    
    Contains whether the tech stack is valid and any invalid technologies found.
    """
    is_valid: bool = Field(..., description="Whether all technologies in the stack are valid")
    invalid_technologies: List[InvalidTechnology] = Field(
        default_factory=list,
        description="List of invalid technologies found"
    )


class TechValidationRequest(BaseModel):
    """
    Schema for a technology validation request.
    
    Used to validate if a technology name exists in the registry.
    """
    tech_name: str = Field(..., description="Name of the technology to validate")


class TechValidationResponse(BaseModel):
    """
    Schema for a technology validation response.
    
    Contains the result of a technology validation request.
    """
    is_valid: bool = Field(..., description="Whether the technology exists in the registry")
    tech_name: str = Field(..., description="The technology name that was validated")
    category_info: Optional[Dict[str, str]] = Field(
        None, 
        description="Category and subcategory information if technology is valid"
    )


class TechCategoryRequest(BaseModel):
    """
    Schema for a request to get the category for a technology.
    
    Used to find which category and subcategory a technology belongs to.
    """
    tech_name: str = Field(..., description="Name of the technology to look up")


class TechCategoryResponse(BaseModel):
    """
    Schema for a response containing category information for a technology.
    
    Contains the category and subcategory a technology belongs to, if found.
    """
    tech_name: str = Field(..., description="The technology name that was looked up")
    found: bool = Field(..., description="Whether the technology was found in the registry")
    category: Optional[str] = Field(None, description="Main category of the technology, if found")
    subcategory: Optional[str] = Field(None, description="Subcategory of the technology, if found")


class CategoryListResponse(BaseModel):
    """
    Schema for a response listing all available categories.
    
    Contains the list of all categories in the tech registry.
    """
    categories: List[str] = Field(default_factory=list, description="List of all category names")


class SubcategoryListRequest(BaseModel):
    """
    Schema for a request to list subcategories in a category.
    
    Used to get all subcategories in a specific category.
    """
    category: str = Field(..., description="Main technology category to list subcategories for")


class SubcategoryListResponse(BaseModel):
    """
    Schema for a response listing all subcategories in a category.
    
    Contains the list of all subcategories in the specified category.
    """
    category: str = Field(..., description="The category that was requested")
    subcategories: List[str] = Field(default_factory=list, description="List of subcategory names")
    found: bool = Field(..., description="Whether the category was found")


class TechListRequest(BaseModel):
    """
    Schema for a request to list technologies in a category and subcategory.
    
    Used to get all technologies in a specific category and subcategory.
    """
    category: str = Field(..., description="Main technology category")
    subcategory: str = Field(..., description="Subcategory within the category")


class TechListResponse(BaseModel):
    """
    Schema for a response containing a list of technologies.
    
    Contains the list of technologies in the specified category/subcategory.
    """
    category: str = Field(..., description="The category that was requested")
    subcategory: str = Field(..., description="The subcategory that was requested")
    technologies: List[str] = Field(default_factory=list, description="List of technology names")
    found: bool = Field(..., description="Whether the category/subcategory was found") 