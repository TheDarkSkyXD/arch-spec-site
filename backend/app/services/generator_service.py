"""Service for generating artifacts from specifications.

This module provides a service for generating artifacts from specifications,
including diagrams, schemas, and documentation.
"""

from typing import Dict, Any, List
import uuid
from ..schemas.artifact import ArtifactCreate


class GeneratorService:
    """Service for generating artifacts from specifications."""

    async def generate_artifacts(self, specification: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate artifacts from a specification.
        
        Args:
            specification: The specification to generate artifacts from.
            
        Returns:
            A list of generated artifacts.
        """
        artifacts = []

        # Generate architecture diagram
        if specification.get('architecture', {}).get('diagram'):
            artifacts.append(
                ArtifactCreate(
                    id=str(uuid.uuid4()),
                    specification_id=specification.get('id'),
                    type="diagram",
                    format="mermaid",
                    content=specification['architecture']['diagram']
                ).model_dump()
            )

        # Generate data model schema
        if specification.get('data_model', {}).get('entities'):
            import json
            artifacts.append(
                ArtifactCreate(
                    id=str(uuid.uuid4()),
                    specification_id=specification.get('id'),
                    type="schema",
                    format="json",
                    content=json.dumps(specification['data_model'], indent=2)
                ).model_dump()
            )

        # Generate API documentation
        if specification.get('api_endpoints'):
            api_doc = self._generate_api_doc(specification['api_endpoints'])
            artifacts.append(
                ArtifactCreate(
                    id=str(uuid.uuid4()),
                    specification_id=specification.get('id'),
                    type="document",
                    format="markdown",
                    content=api_doc
                ).model_dump()
            )

        # Generate implementation plan
        if specification.get('implementation', {}).get('file_structure'):
            impl_doc = self._generate_implementation_doc(specification['implementation'])
            artifacts.append(
                ArtifactCreate(
                    id=str(uuid.uuid4()),
                    specification_id=specification.get('id'),
                    type="document",
                    format="markdown",
                    content=impl_doc
                ).model_dump()
            )

        return artifacts

    def _generate_api_doc(self, api_endpoints: List[Dict[str, Any]]) -> str:
        """Generate API documentation in markdown format.
        
        Args:
            api_endpoints: The API endpoints to document.
            
        Returns:
            Markdown-formatted API documentation.
        """
        doc = "# API Documentation\n\n"

        for endpoint in api_endpoints:
            doc += f"## {endpoint.get('path', 'Unknown Endpoint')}\n\n"
            doc += f"**Method:** {endpoint.get('method', 'GET')}\n\n"
            doc += f"**Description:** {endpoint.get('description', '')}\n\n"

            if endpoint.get('request_body'):
                doc += "**Request Body:**\n\n```json\n"
                doc += f"{endpoint['request_body']}\n```\n\n"

            if endpoint.get('response'):
                doc += "**Response:**\n\n```json\n"
                doc += f"{endpoint['response']}\n```\n\n"

            doc += "---\n\n"

        return doc

    def _generate_implementation_doc(self, implementation: Dict[str, Any]) -> str:
        """Generate implementation documentation in markdown format.
        
        Args:
            implementation: The implementation details to document.
            
        Returns:
            Markdown-formatted implementation documentation.
        """
        doc = "# Implementation Plan\n\n"

        doc += "## File Structure\n\n```\n"
        for file in implementation.get('file_structure', []):
            doc += f"{file}\n"
        doc += "```\n\n"

        if implementation.get('key_components'):
            doc += "## Key Components\n\n"
            for component in implementation['key_components']:
                doc += f"- {component}\n"

        return doc 