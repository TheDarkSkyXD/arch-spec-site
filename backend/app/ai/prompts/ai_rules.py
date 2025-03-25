"""
Prompts for AI rules generation.
"""

def create_ai_rules_system_prompt(additional_user_instruction: str) -> str:
    """
    System prompt for creating AI rules.
    """
    base_prompt = """You are an AI assistant that helps create project-specific rules for AI development tools. Your task is to generate a comprehensive rules document that will guide AI assistants in understanding the project context, requirements, and best practices.

    The rules you create should be structured as a single document that can optionally be divided into sections by the user if their AI tool supports project rules in multiple files. Your output should be tool-agnostic and work with any AI development assistant.

    The rules document should include:
    1. Project Context - Description of the project, its goals, and high-level architecture
    2. AI Assistant Persona - How the AI should behave when working with this project
    3. Coding Standards - Programming patterns, naming conventions, and architecture principles
    4. Knowledge References - Important frameworks, libraries, and technical domains relevant to the project
    5. Response Guidelines - How code should be structured, documented, and explained
    6. Examples - Sample interactions demonstrating ideal AI responses for project-related tasks

    Format the output as a Markdown document with clear section headers. This allows users to either:
    - Use it as a single rules file (compatible with .cursorrules, .windsurfrules, CLAUDE.md, etc.)
    - Split it into multiple files if their AI tool supports directory-based project rules

    Each section should be self-contained with appropriate headers to facilitate easy separation.
    """

    if additional_user_instruction:
        base_prompt += f"""
        Additional instructions from user:
        {additional_user_instruction}

        Note: While considering these additional instructions, still follow the core implementation requirements outlined above. Do not deviate from the primary objective of creating project-specific AI rules.
        """

    return base_prompt

def get_create_ai_rules_user_prompt(
    project_name: str, 
    project_description: str,
    business_goals: list,
    requirements: dict,
    features: dict,
    tech_stack: dict,
    additional_user_instruction: str
) -> str:
    """
    User prompt for creating AI rules.
    
    Args:
        project_name: The name of the project
        project_description: The project description
        business_goals: List of business goals
        requirements: Dictionary of requirements
        features: Dictionary of features
        tech_stack: Dictionary of tech stack
        additional_user_instruction: Optional custom instructions
        
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

    base_prompt = f"""
    Please generate a comprehensive AI Rules document for the following project. The document should be structured in a way that works with any AI development tool.

    # Project Information
    
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

    # Output Instructions

    Create a Markdown document with clear section headers for:

    1. **Project Context** - Essential information about the project, its domain, and purpose
    2. **AI Assistant Persona** - How the AI should behave when working on this project
    3. **Coding Standards** - Programming patterns, architecture principles, naming conventions
    4. **Technology Guidelines** - Framework-specific rules and best practices
    5. **Response Format** - How code should be structured, documented, and explained
    6. **Examples** - Sample interactions showing ideal responses for common project tasks

    The document should be formatted so it can be:
    - Used as a single file (compatible with .cursorrules, CLAUDE.md, etc.)
    - Easily split into separate files if needed (for systems that support directory-based rules)

    Each section should be prefaced with clear headers and be self-contained. Include appropriate semantic descriptions of when rules should apply (e.g., for specific file types or project areas).

    The rules should emphasize that detailed documentation is available for each project aspect in separate specification files.
    """

    return base_prompt
