"""Service for exporting project specifications.

This module provides a service for exporting project specifications to various
formats, including Markdown.
"""

import io
import os
import zipfile
from typing import Dict, Any, List
import json


class ExportService:
    """Service for exporting project specifications."""
    
    async def export_to_markdown(self, project: Dict[str, Any], specification: Dict[str, Any], artifacts: List[Dict[str, Any]]) -> bytes:
        """Export a project specification to Markdown.
        
        Args:
            project: The project to export.
            specification: The specification to export.
            artifacts: The artifacts to export.
            
        Returns:
            The exported specification as a ZIP file in bytes.
        """
        # Create an in-memory ZIP file
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Add README.md with project info
            readme_content = self._generate_readme(project, specification)
            zip_file.writestr("README.md", readme_content)
            
            # Add specification.json
            spec_json = json.dumps(specification, indent=2)
            zip_file.writestr("specification.json", spec_json)
            
            # Add artifacts in appropriate folders
            for artifact in artifacts:
                folder = self._get_folder_for_artifact(artifact['type'])
                extension = self._get_extension_for_format(artifact['format'])
                artifact_id = artifact['id']
                
                filename = f"{folder}/{artifact_id}{extension}"
                zip_file.writestr(filename, artifact['content'])
            
            # Add project.json
            project_json = json.dumps(project, indent=2)
            zip_file.writestr("project.json", project_json)
        
        # Get the ZIP file contents
        zip_buffer.seek(0)
        return zip_buffer.getvalue()
    
    def _generate_readme(self, project: Dict[str, Any], specification: Dict[str, Any]) -> str:
        """Generate a README file for the exported project.
        
        Args:
            project: The project to generate a README for.
            specification: The specification to include in the README.
            
        Returns:
            The README content as a string.
        """
        readme = f"# {project.get('name', 'Untitled Project')}\n\n"
        readme += f"{project.get('description', '')}\n\n"
        
        readme += "## Project Information\n\n"
        readme += f"- **Status:** {project.get('status', 'draft')}\n"
        readme += f"- **Template Type:** {project.get('template_type', 'web_app')}\n\n"
        
        if specification.get('requirements'):
            readme += "## Requirements\n\n"
            
            if specification['requirements'].get('project_type'):
                readme += f"### Project Type\n\n{specification['requirements']['project_type']}\n\n"
            
            if specification['requirements'].get('functional_requirements'):
                readme += "### Functional Requirements\n\n"
                for req in specification['requirements']['functional_requirements']:
                    readme += f"- {req}\n"
                readme += "\n"
            
            if specification['requirements'].get('non_functional_requirements'):
                readme += "### Non-Functional Requirements\n\n"
                for req in specification['requirements']['non_functional_requirements']:
                    readme += f"- {req}\n"
                readme += "\n"
            
            if specification['requirements'].get('tech_stack'):
                tech_stack = specification['requirements']['tech_stack']
                readme += "### Tech Stack\n\n"
                readme += f"- **Frontend:** {tech_stack.get('frontend', 'Not specified')}\n"
                readme += f"- **Backend:** {tech_stack.get('backend', 'Not specified')}\n"
                readme += f"- **Database:** {tech_stack.get('database', 'Not specified')}\n\n"
        
        readme += "## Contents\n\n"
        readme += "This export contains the following files:\n\n"
        readme += "- **README.md**: This file\n"
        readme += "- **specification.json**: The complete specification in JSON format\n"
        readme += "- **project.json**: Project metadata\n"
        readme += "- **diagrams/**: Architecture and other diagrams\n"
        readme += "- **schemas/**: Data model schemas\n"
        readme += "- **documents/**: Generated documentation\n"
        
        return readme
    
    def _get_folder_for_artifact(self, artifact_type: str) -> str:
        """Get the folder name for an artifact type.
        
        Args:
            artifact_type: The artifact type.
            
        Returns:
            The folder name for the artifact type.
        """
        type_to_folder = {
            "diagram": "diagrams",
            "schema": "schemas",
            "document": "documents"
        }
        return type_to_folder.get(artifact_type, "other")
    
    def _get_extension_for_format(self, artifact_format: str) -> str:
        """Get the file extension for an artifact format.
        
        Args:
            artifact_format: The artifact format.
            
        Returns:
            The file extension for the artifact format.
        """
        format_to_extension = {
            "mermaid": ".mmd",
            "json": ".json",
            "markdown": ".md"
        }
        return format_to_extension.get(artifact_format, ".txt") 