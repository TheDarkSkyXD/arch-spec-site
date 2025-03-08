"""
Service for managing project sections.
"""
import logging
from typing import Dict, List, Optional, Any, Union, Type
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel

from ..schemas.project_sections import (
    ProjectSection,
    TimelineSection,
    BudgetSection,
    RequirementsSection,
    MetadataSection,
    TimelineSectionUpdate,
    BudgetSectionUpdate,
    RequirementsSectionUpdate,
    MetadataSectionUpdate,
    TechStackSection,
    FeaturesSection,
    PagesSection,
    DataModelSection,
    ApiSection,
    TestingSection,
    ProjectStructureSection,
    DeploymentSection,
    DocumentationSection,
    TechStackSectionUpdate,
    FeaturesSectionUpdate,
    PagesSectionUpdate,
    DataModelSectionUpdate,
    ApiSectionUpdate,
    TestingSectionUpdate,
    ProjectStructureSectionUpdate,
    DeploymentSectionUpdate,
    DocumentationSectionUpdate
)
from ..schemas.project import TimelineItem, BudgetItem, Requirement
from ..schemas.shared_schemas import (
    TechStackData, Features, Pages, DataModel, Api, 
    Testing, ProjectStructure, Deployment, Documentation
)

logger = logging.getLogger(__name__)

class ProjectSectionsService:
    """Service for managing project sections."""
    
    @staticmethod
    async def get_timeline_section(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[TimelineSection]:
        """Get the timeline section for a project."""
        section_doc = await database.timeline_sections.find_one({"project_id": project_id})
        if section_doc:
            return TimelineSection(**section_doc)
        return None
    
    @staticmethod
    async def get_budget_section(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[BudgetSection]:
        """Get the budget section for a project."""
        section_doc = await database.budget_sections.find_one({"project_id": project_id})
        if section_doc:
            return BudgetSection(**section_doc)
        return None
    
    @staticmethod
    async def get_requirements_section(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[RequirementsSection]:
        """Get the requirements section for a project."""
        section_doc = await database.requirements_sections.find_one({"project_id": project_id})
        if section_doc:
            return RequirementsSection(**section_doc)
        return None
    
    @staticmethod
    async def get_metadata_section(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[MetadataSection]:
        """Get the metadata section for a project."""
        section_doc = await database.metadata_sections.find_one({"project_id": project_id})
        if section_doc:
            return MetadataSection(**section_doc)
        return None
    
    @staticmethod
    async def create_or_update_timeline_section(
        project_id: str, 
        data: Union[Dict[str, TimelineItem], TimelineSectionUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> TimelineSection:
        """Create or update the timeline section for a project."""
        # Check if section exists
        existing = await database.timeline_sections.find_one({"project_id": project_id})
        
        # Convert Dict[str, TimelineItem] to TimelineSectionUpdate if needed
        if isinstance(data, dict):
            update_data = TimelineSectionUpdate(items=data, last_modified_by=user_id)
        else:
            update_data = data
            if user_id:
                update_data.last_modified_by = user_id
        
        if existing:
            # Update existing section
            update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.utcnow()
                update_dict["version"] = existing.get("version", 1) + 1
                
                await database.timeline_sections.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await database.timeline_sections.find_one({"project_id": project_id})
            return TimelineSection(**updated_doc)
        else:
            # Create new section
            items = update_data.items if update_data.items else {}
            new_section = TimelineSection(
                project_id=project_id,
                items=items,
                last_modified_by=user_id
            )
            await database.timeline_sections.insert_one(new_section.model_dump())
            
            # Update project to indicate it has this section
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {"has_timeline": True, "updated_at": datetime.utcnow()}}
            )
            
            return new_section
    
    @staticmethod
    async def create_or_update_budget_section(
        project_id: str, 
        data: Union[Dict[str, BudgetItem], BudgetSectionUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> BudgetSection:
        """Create or update the budget section for a project."""
        # Check if section exists
        existing = await database.budget_sections.find_one({"project_id": project_id})
        
        # Convert Dict[str, BudgetItem] to BudgetSectionUpdate if needed
        if isinstance(data, dict):
            update_data = BudgetSectionUpdate(items=data, last_modified_by=user_id)
        else:
            update_data = data
            if user_id:
                update_data.last_modified_by = user_id
        
        if existing:
            # Update existing section
            update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.utcnow()
                update_dict["version"] = existing.get("version", 1) + 1
                
                await database.budget_sections.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await database.budget_sections.find_one({"project_id": project_id})
            return BudgetSection(**updated_doc)
        else:
            # Create new section
            items = update_data.items if update_data.items else {}
            new_section = BudgetSection(
                project_id=project_id,
                items=items,
                last_modified_by=user_id
            )
            await database.budget_sections.insert_one(new_section.model_dump())
            
            # Update project to indicate it has this section
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {"has_budget": True, "updated_at": datetime.utcnow()}}
            )
            
            return new_section
    
    @staticmethod
    async def create_or_update_requirements_section(
        project_id: str, 
        data: RequirementsSectionUpdate,
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> RequirementsSection:
        """Create or update the requirements section for a project."""
        # Check if section exists
        existing = await database.requirements_sections.find_one({"project_id": project_id})
        
        if existing:
            # Update existing section
            update_dict = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.utcnow()
                update_dict["version"] = existing.get("version", 1) + 1
                update_dict["last_modified_by"] = user_id
                
                await database.requirements_sections.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await database.requirements_sections.find_one({"project_id": project_id})
            return RequirementsSection(**updated_doc)
        else:
            # Create new section
            new_section = RequirementsSection(
                project_id=project_id,
                functional=data.functional if data.functional else [],
                non_functional=data.non_functional if data.non_functional else [],
                last_modified_by=user_id
            )
            await database.requirements_sections.insert_one(new_section.model_dump())
            
            # Update project to indicate it has this section
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {"has_requirements": True, "updated_at": datetime.utcnow()}}
            )
            
            return new_section
    
    @staticmethod
    async def create_or_update_metadata_section(
        project_id: str, 
        data: Union[Dict[str, Any], MetadataSectionUpdate],
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> MetadataSection:
        """Create or update the metadata section for a project."""
        # Check if section exists
        existing = await database.metadata_sections.find_one({"project_id": project_id})
        
        # Convert Dict[str, Any] to MetadataSectionUpdate if needed
        if isinstance(data, dict):
            update_data = MetadataSectionUpdate(data=data, last_modified_by=user_id)
        else:
            update_data = data
            if user_id:
                update_data.last_modified_by = user_id
        
        if existing:
            # Update existing section
            update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.utcnow()
                update_dict["version"] = existing.get("version", 1) + 1
                
                await database.metadata_sections.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await database.metadata_sections.find_one({"project_id": project_id})
            return MetadataSection(**updated_doc)
        else:
            # Create new section
            metadata = update_data.data if update_data.data else {}
            new_section = MetadataSection(
                project_id=project_id,
                data=metadata,
                last_modified_by=user_id
            )
            await database.metadata_sections.insert_one(new_section.model_dump())
            
            # Update project to indicate it has this section
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {"has_metadata": True, "updated_at": datetime.utcnow()}}
            )
            
            return new_section
    
    # Tech stack section methods
    @staticmethod
    async def get_tech_stack_section(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[TechStackSection]:
        """Get the tech stack section for a project."""
        section_doc = await database.tech_stack_sections.find_one({"project_id": project_id})
        if section_doc:
            return TechStackSection(**section_doc)
        return None
    
    @staticmethod
    async def create_or_update_tech_stack_section(
        project_id: str, 
        data: Union[TechStackData, TechStackSectionUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> TechStackSection:
        """Create or update the tech stack section for a project."""
        # Check if section exists
        existing = await database.tech_stack_sections.find_one({"project_id": project_id})
        
        # Convert TechStackData to TechStackSectionUpdate if needed
        if not isinstance(data, TechStackSectionUpdate):
            update_data = TechStackSectionUpdate(data=data, last_modified_by=user_id)
        else:
            update_data = data
            if user_id:
                update_data.last_modified_by = user_id
        
        if existing:
            # Update existing section
            update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.utcnow()
                update_dict["version"] = existing.get("version", 1) + 1
                
                await database.tech_stack_sections.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await database.tech_stack_sections.find_one({"project_id": project_id})
            return TechStackSection(**updated_doc)
        else:
            # Create new section
            tech_stack_data = update_data.data if update_data.data else {}
            new_section = TechStackSection(
                project_id=project_id,
                data=tech_stack_data,
                last_modified_by=user_id
            )
            await database.tech_stack_sections.insert_one(new_section.model_dump())
            
            # Update project to indicate it has this section
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {"has_tech_stack": True, "updated_at": datetime.utcnow()}}
            )
            
            return new_section
    
    # Features section methods
    @staticmethod
    async def get_features_section(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[FeaturesSection]:
        """Get the features section for a project."""
        section_doc = await database.features_sections.find_one({"project_id": project_id})
        if section_doc:
            return FeaturesSection(**section_doc)
        return None
    
    @staticmethod
    async def create_or_update_features_section(
        project_id: str, 
        data: Union[Features, FeaturesSectionUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> FeaturesSection:
        """Create or update the features section for a project."""
        # Check if section exists
        existing = await database.features_sections.find_one({"project_id": project_id})
        
        # Convert Features to FeaturesSectionUpdate if needed
        if not isinstance(data, FeaturesSectionUpdate):
            update_data = FeaturesSectionUpdate(data=data, last_modified_by=user_id)
        else:
            update_data = data
            if user_id:
                update_data.last_modified_by = user_id
        
        if existing:
            # Update existing section
            update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.utcnow()
                update_dict["version"] = existing.get("version", 1) + 1
                
                await database.features_sections.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await database.features_sections.find_one({"project_id": project_id})
            return FeaturesSection(**updated_doc)
        else:
            # Create new section
            features_data = update_data.data if update_data.data else {}
            new_section = FeaturesSection(
                project_id=project_id,
                data=features_data,
                last_modified_by=user_id
            )
            await database.features_sections.insert_one(new_section.model_dump())
            
            # Update project to indicate it has this section
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {"has_features": True, "updated_at": datetime.utcnow()}}
            )
            
            return new_section
    
    # We would add similar methods for all other architecture sections
    # For brevity, I'll create a generic section handler method and add a template for all others

    @staticmethod
    async def _generic_section_handler(
        project_id: str,
        section_type: str,
        data: Any,
        user_id: Optional[str],
        database: AsyncIOMotorDatabase,
        section_class: Type[ProjectSection],
        update_class: Type[BaseModel]
    ) -> ProjectSection:
        """Generic handler for creating or updating a section."""
        collection_name = f"{section_type}_sections"
        flag_name = f"has_{section_type}"
        
        # Check if section exists
        collection = getattr(database, collection_name)
        existing = await collection.find_one({"project_id": project_id})
        
        # Convert data to appropriate update class if needed
        if not isinstance(data, update_class):
            update_data = update_class(data=data, last_modified_by=user_id)
        else:
            update_data = data
            if user_id:
                update_data.last_modified_by = user_id
        
        if existing:
            # Update existing section
            update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.utcnow()
                update_dict["version"] = existing.get("version", 1) + 1
                
                await collection.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await collection.find_one({"project_id": project_id})
            return section_class(**updated_doc)
        else:
            # Create new section
            section_data = update_data.data if hasattr(update_data, 'data') else {}
            new_section = section_class(
                project_id=project_id,
                data=section_data,
                last_modified_by=user_id
            )
            await collection.insert_one(new_section.model_dump())
            
            # Update project to indicate it has this section
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {flag_name: True, "updated_at": datetime.utcnow()}}
            )
            
            return new_section
    
    # Using the generic handler for other sections
    
    # Pages section
    @staticmethod
    async def get_pages_section(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[PagesSection]:
        """Get the pages section for a project."""
        section_doc = await database.pages_sections.find_one({"project_id": project_id})
        if section_doc:
            return PagesSection(**section_doc)
        return None
    
    @staticmethod
    async def create_or_update_pages_section(
        project_id: str, 
        data: Union[Pages, PagesSectionUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> PagesSection:
        return await ProjectSectionsService._generic_section_handler(
            project_id, "pages", data, user_id, database, PagesSection, PagesSectionUpdate
        )
        
    # Data model section
    @staticmethod
    async def get_data_model_section(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[DataModelSection]:
        """Get the data model section for a project."""
        section_doc = await database.data_model_sections.find_one({"project_id": project_id})
        if section_doc:
            return DataModelSection(**section_doc)
        return None
    
    @staticmethod
    async def create_or_update_data_model_section(
        project_id: str, 
        data: Union[DataModel, DataModelSectionUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> DataModelSection:
        return await ProjectSectionsService._generic_section_handler(
            project_id, "data_model", data, user_id, database, DataModelSection, DataModelSectionUpdate
        )
    
    # API section
    @staticmethod
    async def get_api_section(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[ApiSection]:
        """Get the API section for a project."""
        section_doc = await database.api_sections.find_one({"project_id": project_id})
        if section_doc:
            return ApiSection(**section_doc)
        return None
    
    @staticmethod
    async def create_or_update_api_section(
        project_id: str, 
        data: Union[Api, ApiSectionUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> ApiSection:
        return await ProjectSectionsService._generic_section_handler(
            project_id, "api", data, user_id, database, ApiSection, ApiSectionUpdate
        )
    
    # Testing section
    @staticmethod
    async def get_testing_section(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[TestingSection]:
        """Get the testing section for a project."""
        section_doc = await database.testing_sections.find_one({"project_id": project_id})
        if section_doc:
            return TestingSection(**section_doc)
        return None
    
    @staticmethod
    async def create_or_update_testing_section(
        project_id: str, 
        data: Union[Testing, TestingSectionUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> TestingSection:
        return await ProjectSectionsService._generic_section_handler(
            project_id, "testing", data, user_id, database, TestingSection, TestingSectionUpdate
        )
    
    # Project structure section
    @staticmethod
    async def get_project_structure_section(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[ProjectStructureSection]:
        """Get the project structure section for a project."""
        section_doc = await database.project_structure_sections.find_one({"project_id": project_id})
        if section_doc:
            return ProjectStructureSection(**section_doc)
        return None
    
    @staticmethod
    async def create_or_update_project_structure_section(
        project_id: str, 
        data: Union[ProjectStructure, ProjectStructureSectionUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> ProjectStructureSection:
        return await ProjectSectionsService._generic_section_handler(
            project_id, "project_structure", data, user_id, database, ProjectStructureSection, ProjectStructureSectionUpdate
        )
    
    # Deployment section
    @staticmethod
    async def get_deployment_section(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[DeploymentSection]:
        """Get the deployment section for a project."""
        section_doc = await database.deployment_sections.find_one({"project_id": project_id})
        if section_doc:
            return DeploymentSection(**section_doc)
        return None
    
    @staticmethod
    async def create_or_update_deployment_section(
        project_id: str, 
        data: Union[Deployment, DeploymentSectionUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> DeploymentSection:
        return await ProjectSectionsService._generic_section_handler(
            project_id, "deployment", data, user_id, database, DeploymentSection, DeploymentSectionUpdate
        )
    
    # Documentation section
    @staticmethod
    async def get_documentation_section(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[DocumentationSection]:
        """Get the documentation section for a project."""
        section_doc = await database.documentation_sections.find_one({"project_id": project_id})
        if section_doc:
            return DocumentationSection(**section_doc)
        return None
    
    @staticmethod
    async def create_or_update_documentation_section(
        project_id: str, 
        data: Union[Documentation, DocumentationSectionUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> DocumentationSection:
        return await ProjectSectionsService._generic_section_handler(
            project_id, "documentation", data, user_id, database, DocumentationSection, DocumentationSectionUpdate
        ) 