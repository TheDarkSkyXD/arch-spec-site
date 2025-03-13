"""Service for managing artifacts.

This module provides a service for managing artifacts, including creating,
retrieving, and generating artifacts from specifications.
"""

from typing import Dict, Any, List, Tuple, Optional
import uuid
from datetime import datetime, UTC
import io
import mimetypes

from ..schemas.artifact_schema import ArtifactCreate, Artifact
from .generator_service import GeneratorService
from motor.motor_asyncio import AsyncIOMotorDatabase


class ArtifactService:
    """Service for managing artifacts."""
    
    def __init__(self, generator_service: Optional[GeneratorService] = None):
        """Initialize the artifact service.
        
        Args:
            generator_service: The generator service to use for artifact generation.
                If None, a new instance will be created.
        """
        self.generator_service = generator_service or GeneratorService()
        self.artifacts_db = {}  # In-memory storage for artifacts, replace with database in production
    
    async def generate_artifacts(self, specification: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate artifacts from a specification.
        
        Args:
            specification: The specification to generate artifacts from.
            
        Returns:
            A list of generated and stored artifacts.
        """
        # Use the generator service to create artifacts
        artifacts = await self.generator_service.generate_artifacts(specification)
        
        # Store the artifacts in the database
        stored_artifacts = []
        for artifact in artifacts:
            stored_artifact = await self.create_artifact(artifact)
            stored_artifacts.append(stored_artifact)
        
        return stored_artifacts
    
    async def store_artifacts(self, artifacts: List[Dict[str, Any]], database: AsyncIOMotorDatabase) -> List[Dict[str, Any]]:
        """Store artifacts in the database.
        
        Args:
            artifacts: The artifacts to store.
            database: The database instance.
            
        Returns:
            The stored artifacts.
        """
        stored_artifacts = []
        for artifact in artifacts:
            # Ensure the artifact has an ID and creation timestamp
            if not artifact.get('id'):
                artifact['id'] = str(uuid.uuid4())
            
            if not artifact.get('created_at'):
                artifact['created_at'] = datetime.now(UTC).isoformat()
            
            # Store in database
            await database.artifacts.insert_one(artifact)
            stored_artifacts.append(artifact)
        
        return stored_artifacts
    
    async def create_artifact(self, artifact_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new artifact.
        
        Args:
            artifact_data: The artifact data.
            
        Returns:
            The created artifact.
        """
        # Validate the artifact data (could use Pydantic here)
        if not artifact_data.get('id'):
            artifact_data['id'] = str(uuid.uuid4())
        
        if not artifact_data.get('created_at'):
            artifact_data['created_at'] = datetime.now(UTC).isoformat()
        
        # Store the artifact
        self.artifacts_db[artifact_data['id']] = artifact_data
        
        return artifact_data
    
    async def get_artifact(self, artifact_id: str) -> Tuple[bytes, str]:
        """Get an artifact by ID.
        
        Args:
            artifact_id: The artifact ID.
            
        Returns:
            A tuple containing the artifact content and the content type.
        """
        # Get the artifact from the database
        artifact = self.artifacts_db.get(artifact_id)
        if not artifact:
            raise ValueError(f"Artifact not found: {artifact_id}")
        
        
        # Return the content as bytes and the content type
    
    async def generate_artifact(
        self,
        project_id: str,
        spec: str,
        artifact_type: str,
        name: str,
        options: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Generate a specific artifact.
        
        Args:
            project_id: The project ID.
            spec: The spec ID.
            artifact_type: The type of artifact to generate.
            name: The name of the artifact.
            options: Optional generation options.
            
        Returns:
            The generated artifact.
        """
        # For now, just create a placeholder artifact
        # In a real implementation, this would use the generator service in a more specific way
        artifact = {
            'id': str(uuid.uuid4()),
            'project_id': project_id,
            'type': artifact_type,
            'format': self._get_default_format(artifact_type),
            'content': f"Placeholder for {name}",
            'name': name,
            'spec': spec,
            'description': f"Generated {artifact_type} for {spec}",
            'created_at': datetime.now(UTC).isoformat()
        }
        
        # Store the artifact
        self.artifacts_db[artifact['id']] = artifact
        
        return artifact
    
    async def delete_artifact(self, artifact_id: str) -> None:
        """Delete an artifact.
        
        Args:
            artifact_id: The artifact ID.
            
        Raises:
            ValueError: If the artifact is not found.
        """
        if artifact_id not in self.artifacts_db:
            raise ValueError(f"Artifact not found: {artifact_id}")
        
        del self.artifacts_db[artifact_id]
