"""
Service for managing project specs.
"""
import logging
from typing import Dict, List, Optional, Any, Union, Type
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel
from datetime import timezone

from ..schemas.project_specs import (
    ProjectSpec,
    TimelineSpec,
    BudgetSpec,
    RequirementsSpec,
    MetadataSpec,
    TimelineSpecUpdate,
    BudgetSpecUpdate,
    RequirementsSpecUpdate,
    MetadataSpecUpdate,
    TechStackSpec,
    FeaturesSpec,
    PagesSpec,
    DataModelSpec,
    ApiSpec,
    TestingSpec,
    ProjectStructureSpec,
    DeploymentSpec,
    DocumentationSpec,
    TechStackSpecUpdate,
    FeaturesSpecUpdate,
    PagesSpecUpdate,
    DataModelSpecUpdate,
    ApiSpecUpdate,
    TestingSpecUpdate,
    ProjectStructureSpecUpdate,
    DeploymentSpecUpdate,
    DocumentationSpecUpdate
)
from ..schemas.shared_schemas import (
    BudgetItem, ProjectTechStack, Features, Pages, DataModel, Api, 
    Testing, ProjectStructure, Deployment, Documentation, TimelineItem
)

logger = logging.getLogger(__name__)

class ProjectSpecsService:
    """Service for managing project specs."""
    
    @staticmethod
    async def get_timeline_spec(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[TimelineSpec]:
        """Get the timeline spec for a project."""
        spec_doc = await database.timeline_specs.find_one({"project_id": project_id})
        if spec_doc:
            return TimelineSpec(**spec_doc)
        return None
    
    @staticmethod
    async def get_budget_spec(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[BudgetSpec]:
        """Get the budget spec for a project."""
        spec_doc = await database.budget_specs.find_one({"project_id": project_id})
        if spec_doc:
            return BudgetSpec(**spec_doc)
        return None
    
    @staticmethod
    async def get_requirements_spec(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[RequirementsSpec]:
        """Get the requirements spec for a project."""
        spec_doc = await database.requirements_specs.find_one({"project_id": project_id})
        if spec_doc:
            return RequirementsSpec(**spec_doc)
        return None
    
    @staticmethod
    async def get_metadata_spec(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[MetadataSpec]:
        """Get the metadata spec for a project."""
        spec_doc = await database.metadata_specs.find_one({"project_id": project_id})
        if spec_doc:
            return MetadataSpec(**spec_doc)
        return None
    
    @staticmethod
    async def create_or_update_timeline_spec(
        project_id: str, 
        data: Union[Dict[str, TimelineItem], TimelineSpecUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> TimelineSpec:
        """Create or update the timeline spec for a project."""
        # Check if spec exists
        existing = await database.timeline_specs.find_one({"project_id": project_id})
        
        # Convert Dict[str, TimelineItem] to TimelineSpecUpdate if needed
        if isinstance(data, dict):
            update_data = TimelineSpecUpdate(items=data, last_modified_by=user_id)
        else:
            update_data = data
            if user_id:
                update_data.last_modified_by = user_id
        
        if existing:
            # Update existing spec
            update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.now(timezone.utc)
                update_dict["version"] = existing.get("version", 1) + 1
                
                await database.timeline_specs.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await database.timeline_specs.find_one({"project_id": project_id})
            return TimelineSpec(**updated_doc)
        else:
            # Create new spec
            items = update_data.items if update_data.items else {}
            new_spec = TimelineSpec(
                project_id=project_id,
                items=items,
                last_modified_by=user_id
            )
            await database.timeline_specs.insert_one(new_spec.model_dump())
            
            # Update project to indicate it has this spec
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {"has_timeline": True, "updated_at": datetime.now(timezone.utc)}}
            )
            
            return new_spec
    
    @staticmethod
    async def create_or_update_budget_spec(
        project_id: str, 
        data: Union[Dict[str, BudgetItem], BudgetSpecUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> BudgetSpec:
        """Create or update the budget spec for a project."""
        # Check if spec exists
        existing = await database.budget_specs.find_one({"project_id": project_id})
        
        # Convert Dict[str, BudgetItem] to BudgetSpecUpdate if needed
        if isinstance(data, dict):
            update_data = BudgetSpecUpdate(items=data, last_modified_by=user_id)
        else:
            update_data = data
            if user_id:
                update_data.last_modified_by = user_id
        
        if existing:
            # Update existing spec
            update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.now(timezone.utc)
                update_dict["version"] = existing.get("version", 1) + 1
                
                await database.budget_specs.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await database.budget_specs.find_one({"project_id": project_id})
            return BudgetSpec(**updated_doc)
        else:
            # Create new spec
            items = update_data.items if update_data.items else {}
            new_spec = BudgetSpec(
                project_id=project_id,
                items=items,
                last_modified_by=user_id
            )
            await database.budget_specs.insert_one(new_spec.model_dump())
            
            # Update project to indicate it has this spec
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {"has_budget": True, "updated_at": datetime.now(timezone.utc)}}
            )
            
            return new_spec
    
    @staticmethod
    async def create_or_update_requirements_spec(
        project_id: str, 
        data: RequirementsSpecUpdate,
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> RequirementsSpec:
        """Create or update the requirements spec for a project."""
        # Check if spec exists
        existing = await database.requirements_specs.find_one({"project_id": project_id})
        
        if existing:
            # Update existing spec
            update_dict = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.now(timezone.utc)
                update_dict["version"] = existing.get("version", 1) + 1
                update_dict["last_modified_by"] = user_id
                
                await database.requirements_specs.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await database.requirements_specs.find_one({"project_id": project_id})
            return RequirementsSpec(**updated_doc)
        else:
            # Create new spec
            new_spec = RequirementsSpec(
                project_id=project_id,
                functional=data.functional if data.functional else [],
                non_functional=data.non_functional if data.non_functional else [],
                last_modified_by=user_id
            )
            await database.requirements_specs.insert_one(new_spec.model_dump())
            
            # Update project to indicate it has this spec
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {"has_requirements": True, "updated_at": datetime.now(timezone.utc)}}
            )
            
            return new_spec
    
    @staticmethod
    async def create_or_update_metadata_spec(
        project_id: str, 
        data: Union[Dict[str, Any], MetadataSpecUpdate],
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> MetadataSpec:
        """Create or update the metadata spec for a project."""
        # Check if spec exists
        existing = await database.metadata_specs.find_one({"project_id": project_id})
        
        # Convert Dict[str, Any] to MetadataSpecUpdate if needed
        if isinstance(data, dict):
            update_data = MetadataSpecUpdate(data=data, last_modified_by=user_id)
        else:
            update_data = data
            if user_id:
                update_data.last_modified_by = user_id
        
        if existing:
            # Update existing spec
            update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.now(timezone.utc)
                update_dict["version"] = existing.get("version", 1) + 1
                
                await database.metadata_specs.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await database.metadata_specs.find_one({"project_id": project_id})
            return MetadataSpec(**updated_doc)
        else:
            # Create new spec
            metadata = update_data.data if update_data.data else {}
            new_spec = MetadataSpec(
                project_id=project_id,
                data=metadata,
                last_modified_by=user_id
            )
            await database.metadata_specs.insert_one(new_spec.model_dump())
            
            # Update project to indicate it has this spec
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {"has_metadata": True, "updated_at": datetime.now(timezone.utc)}}
            )
            
            return new_spec
    
    # Tech stack spec methods
    @staticmethod
    async def get_tech_stack_spec(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[TechStackSpec]:
        """Get the tech stack spec for a project."""
        spec_doc = await database.tech_stack_specs.find_one({"project_id": project_id})
        if spec_doc:
            return TechStackSpec(**spec_doc)
        return None
    
    @staticmethod
    async def create_or_update_tech_stack_spec(
        project_id: str, 
        data: Union[ProjectTechStack, TechStackSpecUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> TechStackSpec:
        """Create or update the tech stack spec for a project."""
        # Check if spec exists
        existing = await database.tech_stack_specs.find_one({"project_id": project_id})
        
        # Convert TechStackData to TechStackSpecUpdate if needed
        if not isinstance(data, TechStackSpecUpdate):
            update_data = TechStackSpecUpdate(data=data, last_modified_by=user_id)
        else:
            update_data = data
            if user_id:
                update_data.last_modified_by = user_id
        
        if existing:
            # Update existing spec
            update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.now(timezone.utc)
                update_dict["version"] = existing.get("version", 1) + 1
                
                await database.tech_stack_specs.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await database.tech_stack_specs.find_one({"project_id": project_id})
            return TechStackSpec(**updated_doc)
        else:
            # Create new spec
            tech_stack_data = update_data.data if update_data.data else {}
            new_spec = TechStackSpec(
                project_id=project_id,
                data=tech_stack_data,
                last_modified_by=user_id
            )
            await database.tech_stack_specs.insert_one(new_spec.model_dump())
            
            # Update project to indicate it has this spec
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {"has_tech_stack": True, "updated_at": datetime.now(timezone.utc)}}
            )
            
            return new_spec
    
    # Features spec methods
    @staticmethod
    async def get_features_spec(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[FeaturesSpec]:
        """Get the features spec for a project."""
        spec_doc = await database.features_specs.find_one({"project_id": project_id})
        if spec_doc:
            return FeaturesSpec(**spec_doc)
        return None
    
    @staticmethod
    async def create_or_update_features_spec(
        project_id: str, 
        data: Union[Features, FeaturesSpecUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> FeaturesSpec:
        """Create or update the features spec for a project."""
        # Check if spec exists
        existing = await database.features_specs.find_one({"project_id": project_id})
        
        # Convert Features to FeaturesSpecUpdate if needed
        if not isinstance(data, FeaturesSpecUpdate):
            update_data = FeaturesSpecUpdate(data=data, last_modified_by=user_id)
        else:
            update_data = data
            if user_id:
                update_data.last_modified_by = user_id
        
        if existing:
            # Update existing spec
            update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.now(timezone.utc)
                update_dict["version"] = existing.get("version", 1) + 1
                
                await database.features_specs.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await database.features_specs.find_one({"project_id": project_id})
            return FeaturesSpec(**updated_doc)
        else:
            # Create new spec
            features_data = update_data.data if update_data.data else {}
            new_spec = FeaturesSpec(
                project_id=project_id,
                data=features_data,
                last_modified_by=user_id
            )
            await database.features_specs.insert_one(new_spec.model_dump())
            
            # Update project to indicate it has this spec
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {"has_features": True, "updated_at": datetime.now(timezone.utc)}}
            )
            
            return new_spec
    
    # We would add similar methods for all other architecture specs
    # For brevity, I'll create a generic spec handler method and add a template for all others

    @staticmethod
    async def _generic_spec_handler(
        project_id: str,
        spec_type: str,
        data: Any,
        user_id: Optional[str],
        database: AsyncIOMotorDatabase,
        spec_class: Type[ProjectSpec],
        update_class: Type[BaseModel]
    ) -> ProjectSpec:
        """Generic handler for creating or updating a spec."""
        collection_name = f"{spec_type}_specs"
        flag_name = f"has_{spec_type}"
        
        # Check if spec exists
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
            # Update existing spec
            update_dict = {k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None}
            if update_dict:
                update_dict["updated_at"] = datetime.now(timezone.utc)
                update_dict["version"] = existing.get("version", 1) + 1
                
                await collection.update_one(
                    {"project_id": project_id},
                    {"$set": update_dict}
                )
            
            updated_doc = await collection.find_one({"project_id": project_id})
            return spec_class(**updated_doc)
        else:
            # Create new spec
            spec_data = update_data.data if hasattr(update_data, 'data') else {}
            new_spec = spec_class(
                project_id=project_id,
                data=spec_data,
                last_modified_by=user_id
            )
            await collection.insert_one(new_spec.model_dump())
            
            # Update project to indicate it has this spec
            await database.projects.update_one(
                {"id": project_id},
                {"$set": {flag_name: True, "updated_at": datetime.now(timezone.utc)}}
            )
            
            return new_spec
    
    # Using the generic handler for other specs
    
    # Pages spec
    @staticmethod
    async def get_pages_spec(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[PagesSpec]:
        """Get the pages spec for a project."""
        spec_doc = await database.pages_specs.find_one({"project_id": project_id})
        if spec_doc:
            return PagesSpec(**spec_doc)
        return None
    
    @staticmethod
    async def create_or_update_pages_spec(
        project_id: str, 
        data: Union[Pages, PagesSpecUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> PagesSpec:
        return await ProjectSpecsService._generic_spec_handler(
            project_id, "pages", data, user_id, database, PagesSpec, PagesSpecUpdate
        )
        
    # Data model spec
    @staticmethod
    async def get_data_model_spec(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[DataModelSpec]:
        """Get the data model spec for a project."""
        spec_doc = await database.data_model_specs.find_one({"project_id": project_id})
        if spec_doc:
            return DataModelSpec(**spec_doc)
        return None
    
    @staticmethod
    async def create_or_update_data_model_spec(
        project_id: str, 
        data: Union[DataModel, DataModelSpecUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> DataModelSpec:
        return await ProjectSpecsService._generic_spec_handler(
            project_id, "data_model", data, user_id, database, DataModelSpec, DataModelSpecUpdate
        )
    
    # API spec
    @staticmethod
    async def get_api_spec(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[ApiSpec]:
        """Get the API spec for a project."""
        spec_doc = await database.api_specs.find_one({"project_id": project_id})
        if spec_doc:
            return ApiSpec(**spec_doc)
        return None
    
    @staticmethod
    async def create_or_update_api_spec(
        project_id: str, 
        data: Union[Api, ApiSpecUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> ApiSpec:
        return await ProjectSpecsService._generic_spec_handler(
            project_id, "api", data, user_id, database, ApiSpec, ApiSpecUpdate
        )
    
    # Testing spec
    @staticmethod
    async def get_testing_spec(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[TestingSpec]:
        """Get the testing spec for a project."""
        spec_doc = await database.testing_specs.find_one({"project_id": project_id})
        if spec_doc:
            return TestingSpec(**spec_doc)
        return None
    
    @staticmethod
    async def create_or_update_testing_spec(
        project_id: str, 
        data: Union[Testing, TestingSpecUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> TestingSpec:
        return await ProjectSpecsService._generic_spec_handler(
            project_id, "testing", data, user_id, database, TestingSpec, TestingSpecUpdate
        )
    
    # Project structure spec
    @staticmethod
    async def get_project_structure_spec(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[ProjectStructureSpec]:
        """Get the project structure spec for a project."""
        spec_doc = await database.project_structure_specs.find_one({"project_id": project_id})
        if spec_doc:
            return ProjectStructureSpec(**spec_doc)
        return None
    
    @staticmethod
    async def create_or_update_project_structure_spec(
        project_id: str, 
        data: Union[ProjectStructure, ProjectStructureSpecUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> ProjectStructureSpec:
        return await ProjectSpecsService._generic_spec_handler(
            project_id, "project_structure", data, user_id, database, ProjectStructureSpec, ProjectStructureSpecUpdate
        )
    
    # Deployment spec
    @staticmethod
    async def get_deployment_spec(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[DeploymentSpec]:
        """Get the deployment spec for a project."""
        spec_doc = await database.deployment_specs.find_one({"project_id": project_id})
        if spec_doc:
            return DeploymentSpec(**spec_doc)
        return None
    
    @staticmethod
    async def create_or_update_deployment_spec(
        project_id: str, 
        data: Union[Deployment, DeploymentSpecUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> DeploymentSpec:
        return await ProjectSpecsService._generic_spec_handler(
            project_id, "deployment", data, user_id, database, DeploymentSpec, DeploymentSpecUpdate
        )
    
    # Documentation spec
    @staticmethod
    async def get_documentation_spec(
        project_id: str, database: AsyncIOMotorDatabase
    ) -> Optional[DocumentationSpec]:
        """Get the documentation spec for a project."""
        spec_doc = await database.documentation_specs.find_one({"project_id": project_id})
        if spec_doc:
            return DocumentationSpec(**spec_doc)
        return None
    
    @staticmethod
    async def create_or_update_documentation_spec(
        project_id: str, 
        data: Union[Documentation, DocumentationSpecUpdate], 
        user_id: Optional[str],
        database: AsyncIOMotorDatabase
    ) -> DocumentationSpec:
        return await ProjectSpecsService._generic_spec_handler(
            project_id, "documentation", data, user_id, database, DocumentationSpec, DocumentationSpecUpdate
        ) 