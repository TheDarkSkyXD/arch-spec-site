"""
Prompts for AI-enhanced README generation.
"""

def readme_system_prompt() -> str:
    """
    System prompt for enhancing README content.
    """
    return """You are a README generator for software project specifications. Your task is to create a comprehensive, informative and well-structured README.md file for a software project.

The README should include:
1. Project title (based on project name)
2. A clear, concise overview of the project based on the project description
3. Key business goals and objectives
4. Key requirements and non-functional requirements
5. Brief summary of core features
6. Summary of the technology stack
7. Information about the specification documents available
8. Any other relevant details that would help someone understand the project

Format the README in proper Markdown with appropriate headers, lists, and emphasis.
Make the README professional, informative, and visually well-organized.
"""


def get_readme_user_prompt(
    project_name: str, 
    project_description: str,
    business_goals: list,
    requirements: dict,
    features: dict,
    tech_stack: dict
) -> str:
    """
    User prompt for README enhancement.
    
    Args:
        project_name: The name of the project
        project_description: The project description
        business_goals: List of business goals
        requirements: Dictionary of requirements
        features: Dictionary of features
        tech_stack: Dictionary of tech stack
        
    Returns:
        Formatted user prompt
    """
    # Format the business goals as a string
    formatted_goals = "\n".join([f"- {goal}" for goal in business_goals])
    
    # Create a summary of requirements
    functional_count = len(requirements.get("functional", []))
    non_functional_count = len(requirements.get("non_functional", []))
    
    # Create a summary of features
    core_modules = features.get("coreModules", [])
    optional_modules = features.get("optionalModules", [])
    core_module_names = [module.get("name") for module in core_modules if isinstance(module, dict) and "name" in module]
    optional_module_names = [module.get("name") for module in optional_modules if isinstance(module, dict) and "name" in module]
    
    # Create a summary of tech stack
    frontend = tech_stack.get("frontend", {})
    backend = tech_stack.get("backend", {})
    database = tech_stack.get("database", {})
    
    return f"""
Please generate a README.md file for the following project:

Project Name: {project_name}

Project Description:
{project_description}

Business Goals:
{formatted_goals}

Requirements Summary:
- {functional_count} Functional Requirements
- {non_functional_count} Non-Functional Requirements

Core Features:
{', '.join(core_module_names)}

Optional Features:
{', '.join(optional_module_names)}

Technology Stack Highlights:
- Frontend: {frontend.get('framework', 'N/A')} / {frontend.get('language', 'N/A')}
- Backend: {backend.get('type', 'N/A')} / {backend.get('service', 'N/A')}
- Database: {database.get('type', 'N/A')} / {database.get('system', 'N/A')}

The README should mention that detailed documentation is available for each of these aspects in separate specification files.
""" 