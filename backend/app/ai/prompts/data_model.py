def get_data_model_user_prompt(
    project_description,
    formatted_features,
    formatted_requirements,
    formatted_data_model,
    additional_user_instruction=None,
):
    # Start with project information
    base_prompt = (
        f"Project description: {project_description}\n"
        f"Features:\n{formatted_features}\n"
        f"Requirements:\n{formatted_requirements}\n"
        f"Original data model (if any): {formatted_data_model}\n"
    )

    # Add additional user instruction if provided, with guardrails
    if additional_user_instruction:
        base_prompt += (
            f"\nAdditional instructions from user:\n{additional_user_instruction}\n\n"
            "Note: While considering these additional instructions, you must still follow the core task "
            "of creating or enhancing the data model as described below. Do not deviate from the primary task format or objective. "
            "You must use the print_data_model function as directed in the main task."
        )

    # Add the main task instructions after any user-provided instructions
    base_prompt += (
        "\nYour task:\n"
        "1. Identify key entities needed to support the features and requirements\n"
        "2. Define properties/fields for each entity including their data types, constraints, and defaults\n"
        "3. Specify relationships between entities (one-to-one, one-to-many, many-to-many)\n"
        "4. Indicate primary keys and foreign keys\n"
        "5. Group related entities into logical schemas\n"
        "6. Include indexing recommendations for performance\n\n"
        "Once you've analyzed the requirements and created the data model, use the print_data_model function to output the structured data model specification."
    )

    return base_prompt
