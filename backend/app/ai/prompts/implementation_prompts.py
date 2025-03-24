"""
Implementation prompts meta prompts.

This module provides functions to load and use implementation prompt meta prompts.
"""
import os
from pathlib import Path
from typing import Dict, Optional

# Dictionary to map category to meta prompt filename
CATEGORY_TO_METAPROMPT = {
    "01_project_setup": "01_project_gen_prompt.txt",
    "02_data_layer": "02_data_layer_gen_prompt.txt",
    "03_api_backend": "03_api_backend_gen_prompt.txt",
    "04_frontend_foundation": "04_frontend_foundation_gen_prompt.txt",
    "05_feature_implementation": "05_feature_implementation_gen_prompt.txt",
    "06_testing_implementation": "06_testing_implementation_gen_prompt.txt",
    "07_deployment_devops": "07_deployment_devops_gen_prompt.txt",
    "08_component_completion": "08_component_completion_gen_prompt.txt",
    "09_integration_implementation": "09_integration_implementation_gen_prompt.txt",
}

def get_implementation_prompt_template(category: str) -> Optional[str]:
    """
    Get the implementation prompt meta template for a specific category.
    
    Args:
        category: The category to get the meta prompt for
        
    Returns:
        The meta prompt template as a string, or None if not found
    """
    meta_prompt_file = CATEGORY_TO_METAPROMPT.get(category)
    if not meta_prompt_file:
        return None
        
    meta_prompt_path = Path(__file__).parent / "implementation" / meta_prompt_file
    
    try:
        with open(meta_prompt_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error loading implementation prompt meta prompt: {str(e)}")
        return None

def prepare_implementation_prompt(
    category: str,
    project_description: str = "",
    architecture_spec: str = "",
    tech_stack: str = "",
    data_models: str = "",
    api_endpoints: str = "",
    features: str = "",
    security_requirements: str = "",
    architecture_backend: str = "",
    architecture_frontend: str = "",
    architecture_data_layer: str = "",
    nfr_spec: str = "",
    nfr_data_related: str = "",
    database_tech: str = "",
    component_specs: str = "",
    ui_components: str = "",
    integration_points: str = "",
    testing_requirements: str = "",
    deployment_requirements: str = "",
    additional_user_instruction: str = "",
) -> Optional[str]:
    """
    Prepare the implementation prompt for a specific category by filling in the template.
    
    Args:
        category: The category to prepare the prompt for
        project_description: Project description
        architecture_spec: Architecture specification
        tech_stack: Technology stack
        data_models: Data models specification
        api_endpoints: API endpoints specification
        features: Features specification
        security_requirements: Security requirements
        architecture_backend: Backend architecture specification
        architecture_frontend: Frontend architecture specification
        architecture_data_layer: Data layer architecture specification
        nfr_spec: Non-functional requirements specification
        nfr_data_related: Data-related non-functional requirements
        database_tech: Database technology
        component_specs: Component specifications
        ui_components: UI component specifications
        integration_points: Integration points
        testing_requirements: Testing requirements
        deployment_requirements: Deployment requirements
        additional_user_instruction: Optional custom instructions from the user
        
    Returns:
        The prepared implementation prompt, or None if the template couldn't be loaded
    """
    template = get_implementation_prompt_template(category)
    if not template:
        return None
    
    # Create a dict of variables to replace in the template
    variables = {
        "project_description": project_description,
        "architecture_spec": architecture_spec,
        "tech_stack": tech_stack,
        "data_models": data_models,
        "api_endpoints": api_endpoints,
        "features": features,
        "security_requirements": security_requirements,
        "architecture_backend": architecture_backend,
        "architecture_frontend": architecture_frontend,
        "architecture_data_layer": architecture_data_layer,
        "nfr_spec": nfr_spec,
        "nfr_data_related": nfr_data_related,
        "database_tech": database_tech,
        "component_specs": component_specs,
        "ui_components": ui_components,
        "integration_points": integration_points,
        "testing_requirements": testing_requirements,
        "deployment_requirements": deployment_requirements,
    }
    
    # Replace variables in the template
    prompt = template
    for var_name, var_value in variables.items():
        placeholder = f"{{{var_name}}}"
        if placeholder in prompt:
            prompt = prompt.replace(placeholder, var_value)
    
    # Add the additional user instruction if provided
    if additional_user_instruction:
        prompt += f"\n\nAdditional instructions from user:\n{additional_user_instruction}\n\n"
        prompt += "Note: While considering these additional instructions, still follow the core implementation requirements outlined above. Do not deviate from the primary objective of the implementation."
    
    return prompt 