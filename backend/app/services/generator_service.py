"""Service for generating artifacts from specifications.

This module provides a service for generating artifacts from project data,
including diagrams, schemas, and documentation.
"""

from typing import Dict, Any, List, Optional
import json
import uuid
from datetime import datetime, UTC
from ..schemas.artifact_schema import ArtifactCreate


class GeneratorService:
    """Service for generating artifacts from project data."""

    async def generate_artifacts(
        self, 
        project_id: str,
        project: Dict[str, Any],
        # add more specs here
    ) -> List[Dict[str, Any]]:
        """Generate artifacts directly from project specs.
        
        Args:
            project_id: The ID of the project
            project: The base project data
            
        Returns:
            A list of generated artifacts.
        """
        artifacts = []

        # Generate project overview document
        overview_doc = self._generate_project_basics(
            project,
        )
        artifacts.append(
            ArtifactCreate(
                id=str(uuid.uuid4()),
                project_id=project_id,
                type="document",
                format="markdown",
                content=overview_doc,
                name="Project Overview",
                spec="project",
                description="High-level overview of the project specification"
            ).model_dump()
        )

        return artifacts
