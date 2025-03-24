def get_tech_stack_user_prompt(project_description, formatted_requirements, formatted_preferences, additional_user_instruction=None):
    # Start with project information
    base_prompt = (
        f"You are a technical architect advising on technology choices. Based on the project description and requirements, recommend an appropriate technology stack.\n\n"
        f"Project description: {project_description}\n"
        f"Project requirements: {formatted_requirements}\n"
        f"User preferences: {formatted_preferences}\n"
    )
    
    # Add additional user instruction if provided, with guardrails
    if additional_user_instruction:
        base_prompt += (
            f"\nAdditional instructions from user:\n{additional_user_instruction}\n\n"
            "Note: While considering these additional instructions, you must still follow the core task "
            "of recommending a technology stack as described below. Do not deviate from the primary task format or objective. "
            "You must use the print_tech_stack function as directed in the main task."
        )
    
    # Add the main task instructions after any user-provided instructions
    base_prompt += (
        "\nYour task:\n"
        "1. Recommend a coherent tech stack that addresses the specific needs of this project\n"
        "2. For each component, provide a brief justification\n"
        "3. Consider the user's stated preferences unless there's a compelling technical reason not to\n"
        "4. Prioritize widely-adopted, well-supported technologies\n"
        "5. Consider the complexity appropriate for the project scope\n\n"
        "After analyzing the requirements, use the print_tech_stack function to output your technology recommendations with justifications."
    )
    
    return base_prompt 