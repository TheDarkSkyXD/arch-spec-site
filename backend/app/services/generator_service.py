"""Service for generating artifacts from specifications.

This module provides a service for generating artifacts from project data,
including diagrams, schemas, and documentation.
"""

from typing import Dict, Any, List, Optional
import json
import uuid
from datetime import datetime, UTC
from ..schemas.artifact import ArtifactCreate


class GeneratorService:
    """Service for generating artifacts from project data."""

    async def generate_artifacts_from_project_specs(
        self, 
        project_id: str,
        project: Dict[str, Any],
        tech_stack_spec: Optional[Dict[str, Any]] = None,
        requirements_spec: Optional[Dict[str, Any]] = None,
        data_model_spec: Optional[Dict[str, Any]] = None,
        api_spec: Optional[Dict[str, Any]] = None,
        documentation_spec: Optional[Dict[str, Any]] = None,
        features_spec: Optional[Dict[str, Any]] = None,
        testing_spec: Optional[Dict[str, Any]] = None,
        project_structure_spec: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Generate artifacts directly from project specs.
        
        Args:
            project_id: The ID of the project
            project: The base project data
            tech_stack_spec: The tech stack spec data
            requirements_spec: The requirements spec data
            data_model_spec: The data model spec data
            api_spec: The API spec data
            documentation_spec: The documentation spec data
            features_spec: The features spec data
            testing_spec: The testing spec data
            project_structure_spec: The project structure spec data
            
        Returns:
            A list of generated artifacts.
        """
        artifacts = []

        # Generate project overview document
        overview_doc = self._generate_project_overview_from_specs(
            project, 
            tech_stack_spec, 
            requirements_spec
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

        # Generate architecture diagram if available in documentation spec
        if documentation_spec and documentation_spec.get("data", {}).get("architecture_diagram"):
            artifacts.append(
                ArtifactCreate(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    type="diagram",
                    format="mermaid",
                    content=documentation_spec["data"]["architecture_diagram"],
                    name="System Architecture Diagram",
                    spec="architecture",
                    description="High-level system architecture visualization"
                ).model_dump()
            )
            
            # Generate architecture decision records if available
            if documentation_spec.get("data", {}).get("architecture_decisions"):
                adr_doc = self._generate_architecture_decision_records(
                    documentation_spec["data"]["architecture_decisions"]
                )
                artifacts.append(
                    ArtifactCreate(
                        id=str(uuid.uuid4()),
                        project_id=project_id,
                        type="document",
                        format="markdown",
                        content=adr_doc,
                        name="Architecture Decision Records",
                        spec="architecture",
                        description="Documentation of key architectural decisions"
                    ).model_dump()
                )

        # Generate sequence diagrams if available
        if documentation_spec and documentation_spec.get("data", {}).get("sequence_diagrams"):
            for idx, seq_diagram in enumerate(documentation_spec["data"]["sequence_diagrams"]):
                diagram_name = seq_diagram.get("name", f"Sequence Diagram {idx+1}")
                artifacts.append(
                    ArtifactCreate(
                        id=str(uuid.uuid4()),
                        project_id=project_id,
                        type="diagram",
                        format="mermaid",
                        content=seq_diagram.get("content", ""),
                        name=diagram_name,
                        spec="architecture",
                        description=f"Sequence diagram for {diagram_name}"
                    ).model_dump()
                )

        # Generate data model artifacts
        if data_model_spec and data_model_spec.get("data", {}).get("entities"):
            data_model = data_model_spec["data"]
            
            # Generate JSON schema
            artifacts.append(
                ArtifactCreate(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    type="schema",
                    format="json",
                    content=json.dumps(data_model, indent=2),
                    name="Data Model Schema",
                    spec="data_model",
                    description="Database schema definition"
                ).model_dump()
            )
            
            # Generate ER diagram if available
            if data_model.get("er_diagram"):
                artifacts.append(
                    ArtifactCreate(
                        id=str(uuid.uuid4()),
                        project_id=project_id,
                        type="diagram",
                        format="mermaid",
                        content=data_model["er_diagram"],
                        name="Entity-Relationship Diagram",
                        spec="data_model",
                        description="Entity relationship visualization"
                    ).model_dump()
                )
            
            # Generate data model documentation
            data_model_doc = self._generate_data_model_doc_from_spec(data_model)
            artifacts.append(
                ArtifactCreate(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    type="document",
                    format="markdown",
                    content=data_model_doc,
                    name="Data Model Documentation",
                    spec="data_model",
                    description="Detailed data model documentation"
                ).model_dump()
            )

        # Generate API documentation
        if api_spec and api_spec.get("data", {}).get("endpoints"):
            api_doc = self._generate_api_doc_from_spec(api_spec["data"])
            artifacts.append(
                ArtifactCreate(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    type="document",
                    format="markdown",
                    content=api_doc,
                    name="API Documentation",
                    spec="api",
                    description="API endpoint specifications"
                ).model_dump()
            )
            
            # Generate OpenAPI specification
            openapi_spec = self._generate_openapi_spec_from_spec(api_spec["data"])
            artifacts.append(
                ArtifactCreate(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    type="schema",
                    format="json",
                    content=openapi_spec,
                    name="OpenAPI Specification",
                    spec="api",
                    description="OpenAPI/Swagger compatible API specification"
                ).model_dump()
            )

        # Generate UI design artifacts if available in documentation or another spec
        if documentation_spec and documentation_spec.get("data", {}).get("ui_design"):
            ui_doc = self._generate_ui_documentation(documentation_spec["data"]["ui_design"])
            artifacts.append(
                ArtifactCreate(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    type="document",
                    format="markdown",
                    content=ui_doc,
                    name="UI Design Documentation",
                    spec="ui",
                    description="User interface design documentation"
                ).model_dump()
            )

        # Generate testing framework
        if testing_spec and testing_spec.get("data", {}).get("strategy"):
            test_doc = self._generate_testing_doc_from_spec(testing_spec["data"])
            artifacts.append(
                ArtifactCreate(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    type="document",
                    format="markdown",
                    content=test_doc,
                    name="Testing Strategy",
                    spec="testing",
                    description="Testing framework and strategy documentation"
                ).model_dump()
            )

        # Generate implementation plan
        if project_structure_spec and project_structure_spec.get("data", {}).get("structure"):
            impl_doc = self._generate_implementation_doc_from_spec(project_structure_spec["data"])
            artifacts.append(
                ArtifactCreate(
                    id=str(uuid.uuid4()),
                    project_id=project_id,
                    type="document",
                    format="markdown",
                    content=impl_doc,
                    name="Implementation Plan",
                    spec="implementation",
                    description="Implementation guidelines and task breakdown"
                ).model_dump()
            )

        return artifacts

    def _generate_architecture_decision_records(self, decisions: List[Dict[str, Any]]) -> str:
        """Generate architecture decision records in markdown format.
        
        Args:
            decisions: List of architecture decisions.
            
        Returns:
            Markdown-formatted ADR document.
        """
        doc = "# Architecture Decision Records\n\n"
        
        for i, decision in enumerate(decisions):
            doc += f"## ADR-{i+1}: {decision.get('title', 'Untitled Decision')}\n\n"
            doc += f"**Date:** {decision.get('date', 'N/A')}\n\n"
            doc += f"**Status:** {decision.get('status', 'Proposed')}\n\n"
            
            doc += "### Context\n\n"
            doc += f"{decision.get('context', 'No context provided.')}\n\n"
            
            doc += "### Decision\n\n"
            doc += f"{decision.get('decision', 'No decision provided.')}\n\n"
            
            doc += "### Consequences\n\n"
            doc += f"{decision.get('consequences', 'No consequences provided.')}\n\n"
            
            if i < len(decisions) - 1:
                doc += "---\n\n"
        
        return doc

    def _generate_data_model_doc_from_spec(self, data_model: Dict[str, Any]) -> str:
        """Generate data model documentation in markdown format from a data model spec.
        
        Args:
            data_model: The data model spec data.
            
        Returns:
            Markdown-formatted data model documentation.
        """
        doc = "# Data Model Documentation\n\n"
        
        if data_model.get('description'):
            doc += f"{data_model['description']}\n\n"
        
        if data_model.get('entities'):
            doc += "## Entities\n\n"
            
            for entity in data_model['entities']:
                entity_name = entity.get('name', 'Unnamed Entity')
                doc += f"### {entity_name}\n\n"
                
                if entity.get('description'):
                    doc += f"{entity['description']}\n\n"
                
                if entity.get('fields'):
                    doc += "| Field | Type | Required | Description |\n"
                    doc += "|-------|------|----------|-------------|\n"
                    
                    for field in entity['fields']:
                        field_name = field.get('name', 'unnamed')
                        field_type = field.get('type', 'string')
                        required = "Yes" if field.get('required', False) else "No"
                        description = field.get('description', '')
                        
                        doc += f"| {field_name} | {field_type} | {required} | {description} |\n"
                    
                    doc += "\n"
            
            # If there are relationships defined at the data model level
            if data_model.get('relationships'):
                doc += "## Relationships\n\n"
                doc += "| Type | From Entity | To Entity | Field |\n"
                doc += "|------|------------|-----------|-------|\n"
                
                for rel in data_model['relationships']:
                    rel_type = rel.get('type', '')
                    from_entity = rel.get('from_entity', '')
                    to_entity = rel.get('to_entity', '')
                    field = rel.get('field', '')
                    
                    doc += f"| {rel_type} | {from_entity} | {to_entity} | {field} |\n"
                
                doc += "\n"
        
        if data_model.get('validation_rules'):
            doc += "## Validation Rules\n\n"
            
            for rule in data_model['validation_rules']:
                doc += f"- {rule}\n"
            
            doc += "\n"
        
        return doc

    def _generate_api_doc_from_spec(self, api_data: Dict[str, Any]) -> str:
        """Generate API documentation in markdown format from an API spec.
        
        Args:
            api_data: The API spec data.
            
        Returns:
            Markdown-formatted API documentation.
        """
        doc = "# API Documentation\n\n"

        endpoints = api_data.get('endpoints', [])
        if not endpoints:
            doc += "No API endpoints have been defined yet.\n"
            return doc
            
        # Group endpoints by their path prefix for organization
        endpoints_by_group = {}
        
        for endpoint in endpoints:
            path = endpoint.get('path', '')
            parts = path.split('/')
            if len(parts) > 1:
                group = parts[1].capitalize()  # Use the first path segment as group
            else:
                group = 'General'
                
            if group not in endpoints_by_group:
                endpoints_by_group[group] = []
            endpoints_by_group[group].append(endpoint)
        
        # Generate documentation for each group
        for group, group_endpoints in endpoints_by_group.items():
            doc += f"## {group}\n\n"
            
            for endpoint in group_endpoints:
                path = endpoint.get('path', 'Unknown Endpoint')
                methods = endpoint.get('methods', ['GET'])
                for method in methods:
                    doc += f"### {method} {path}\n\n"
                    
                    # Description
                    if endpoint.get('description'):
                        doc += f"**Description:** {endpoint.get('description', '')}\n\n"
                    
                    # Authentication
                    auth_required = endpoint.get('auth', False)
                    doc += f"**Authentication:** {'Required' if auth_required else 'Not required'}\n\n"
                    
                    # Roles if applicable
                    if auth_required and endpoint.get('roles'):
                        doc += f"**Required Roles:** {', '.join(endpoint.get('roles', []))}\n\n"
                    
                    # Add example request/response if available in the future
                    
                    doc += "---\n\n"

        return doc
    
    def _generate_openapi_spec_from_spec(self, api_data: Dict[str, Any]) -> str:
        """Generate OpenAPI specification in JSON format from an API spec.
        
        Args:
            api_data: The API spec data.
            
        Returns:
            JSON string of OpenAPI specification.
        """
        openapi = {
            "openapi": "3.0.0",
            "info": {
                "title": "API Specification",
                "version": "1.0.0",
                "description": "Generated API specification"
            },
            "paths": {},
            "components": {
                "schemas": {},
                "securitySchemes": {
                    "bearerAuth": {
                        "type": "http",
                        "scheme": "bearer",
                        "bearerFormat": "JWT"
                    }
                }
            }
        }
        
        # Build paths from endpoints
        endpoints = api_data.get('endpoints', [])
        for endpoint in endpoints:
            path = endpoint.get('path', '/unknown')
            methods = endpoint.get('methods', ['get'])
            
            if path not in openapi["paths"]:
                openapi["paths"][path] = {}
            
            # Build endpoint definition for each method
            for method in methods:
                method = method.lower()  # Ensure method is lowercase for OpenAPI
                
                # Build endpoint definition
                endpoint_def = {
                    "summary": endpoint.get('description', ''),
                    "description": endpoint.get('description', ''),
                    "responses": {
                        "200": {
                            "description": "Successful response"
                        }
                    }
                }
                
                # Add security if authentication is required
                if endpoint.get('auth', False):
                    endpoint_def["security"] = [
                        {
                            "bearerAuth": []
                        }
                    ]
                
                # Add the endpoint definition to the path
                openapi["paths"][path][method] = endpoint_def
        
        return json.dumps(openapi, indent=2)

    def _generate_ui_documentation(self, ui_design: Dict[str, Any]) -> str:
        """Generate UI design documentation in markdown format.
        
        Args:
            ui_design: The UI design data.
            
        Returns:
            Markdown-formatted UI documentation.
        """
        doc = "# UI Design Documentation\n\n"
        
        if ui_design.get('description'):
            doc += f"{ui_design['description']}\n\n"
        
        if ui_design.get('wireframes'):
            doc += "## Wireframes\n\n"
            
            for wireframe in ui_design['wireframes']:
                name = wireframe.get('name', 'Unnamed Wireframe')
                description = wireframe.get('description', '')
                
                doc += f"### {name}\n\n"
                doc += f"{description}\n\n"
                
                if wireframe.get('content'):
                    doc += "```\n"
                    doc += wireframe['content']
                    doc += "\n```\n\n"
        
        if ui_design.get('components'):
            doc += "## UI Components\n\n"
            
            for component in ui_design['components']:
                name = component.get('name', 'Unnamed Component')
                description = component.get('description', '')
                
                doc += f"### {name}\n\n"
                doc += f"{description}\n\n"
                
                if component.get('props'):
                    doc += "#### Props\n\n"
                    doc += "| Prop | Type | Required | Description |\n"
                    doc += "|------|------|----------|-------------|\n"
                    
                    for prop in component['props']:
                        prop_name = prop.get('name', 'unnamed')
                        prop_type = prop.get('type', 'any')
                        required = "Yes" if prop.get('required', False) else "No"
                        description = prop.get('description', '')
                        
                        doc += f"| {prop_name} | {prop_type} | {required} | {description} |\n"
                    
                    doc += "\n"
        
        return doc

    def _generate_testing_doc_from_spec(self, testing_data: Dict[str, Any]) -> str:
        """Generate testing documentation in markdown format from a testing spec.
        
        Args:
            testing_data: The testing spec data.
            
        Returns:
            Markdown-formatted testing documentation.
        """
        doc = "# Testing Strategy\n\n"
        
        strategy = testing_data.get('strategy', {})
        
        if strategy.get('overview'):
            doc += "## Overall Strategy\n\n"
            doc += f"{strategy['overview']}\n\n"
        
        if strategy.get('unit_testing'):
            doc += "## Unit Testing\n\n"
            doc += f"{strategy['unit_testing']}\n\n"
        
        if strategy.get('integration_testing'):
            doc += "## Integration Testing\n\n"
            doc += f"{strategy['integration_testing']}\n\n"
        
        if strategy.get('e2e_testing'):
            doc += "## End-to-End Testing\n\n"
            doc += f"{strategy['e2e_testing']}\n\n"
        
        if strategy.get('coverage'):
            doc += "## Coverage Targets\n\n"
            doc += f"{strategy['coverage']}\n\n"
        
        if strategy.get('test_cases'):
            doc += "## Test Cases\n\n"
            
            doc += "| ID | Description | Component | Type | Expected Result |\n"
            doc += "|----|--------------|-----------|---------|-----------------|\n"
            
            for i, test in enumerate(strategy['test_cases']):
                test_id = test.get('id', f"TC-{i+1}")
                description = test.get('description', '')
                component = test.get('component', '')
                test_type = test.get('type', 'functional')
                expected = test.get('expected', '')
                
                doc += f"| {test_id} | {description} | {component} | {test_type} | {expected} |\n"
            
            doc += "\n"
        
        return doc

    def _generate_implementation_doc_from_spec(self, structure_data: Dict[str, Any]) -> str:
        """Generate implementation documentation in markdown format from a project structure spec.
        
        Args:
            structure_data: The project structure spec data.
            
        Returns:
            Markdown-formatted implementation documentation.
        """
        doc = "# Implementation Plan\n\n"
        
        structure = structure_data.get('structure', {})
        
        if structure.get('description'):
            doc += f"{structure['description']}\n\n"
        
        if structure.get('file_structure'):
            doc += "## File Structure\n\n```\n"
            
            # Convert to string list if it's a dictionary/tree structure
            file_structure = structure['file_structure']
            if isinstance(file_structure, dict):
                flat_structure = self._flatten_file_structure(file_structure)
                for file in flat_structure:
                    doc += f"{file}\n"
            elif isinstance(file_structure, list):
                for file in file_structure:
                    doc += f"{file}\n"
            
            doc += "```\n\n"
        
        if structure.get('components'):
            doc += "## Key Components\n\n"
            
            for component in structure['components']:
                if isinstance(component, str):
                    doc += f"- {component}\n"
                elif isinstance(component, dict):
                    name = component.get('name', 'Unnamed Component')
                    description = component.get('description', '')
                    doc += f"- **{name}**: {description}\n"
            
            doc += "\n"
        
        if structure.get('tasks'):
            doc += "## Implementation Tasks\n\n"
            
            for task in structure['tasks']:
                name = task.get('name', 'Unnamed Task')
                description = task.get('description', '')
                priority = task.get('priority', 'medium')
                
                doc += f"### {name}\n\n"
                doc += f"**Priority:** {priority}\n\n"
                doc += f"{description}\n\n"
                
                if task.get('subtasks'):
                    doc += "#### Subtasks\n\n"
                    for subtask in task['subtasks']:
                        doc += f"- {subtask}\n"
                    doc += "\n"
        
        if structure.get('dependencies'):
            doc += "## Dependencies\n\n"
            
            doc += "| Name | Version | Purpose |\n"
            doc += "|------|---------|--------|\n"
            
            for dep in structure['dependencies']:
                if isinstance(dep, str):
                    doc += f"| {dep} | - | - |\n"
                elif isinstance(dep, dict):
                    name = dep.get('name', '')
                    version = dep.get('version', '')
                    purpose = dep.get('purpose', '')
                    doc += f"| {name} | {version} | {purpose} |\n"
            
            doc += "\n"
        
        return doc
    
    def _flatten_file_structure(self, structure, prefix=""):
        """Flatten a nested file structure dictionary into a list of paths.
        
        Args:
            structure: Dictionary representing the file structure
            prefix: Path prefix for recursive calls
            
        Returns:
            List of file paths
        """
        result = []
        
        for key, value in structure.items():
            path = f"{prefix}/{key}" if prefix else key
            
            if isinstance(value, dict):
                # It's a directory, add it and recursively process its contents
                result.append(f"{path}/")
                result.extend(self._flatten_file_structure(value, path))
            else:
                # It's a file
                result.append(path)
                
        return result 