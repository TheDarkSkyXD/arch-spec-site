def requirements_system_prompt_enhance(additional_user_instruction=None):
    base_prompt = (
        "You are a requirements analyst refining project requirements. "
        "You'll be given a project description, business goals, and the user's initial requirements."
    )

    # Add additional user instruction if provided, with guardrails
    if additional_user_instruction:
        base_prompt += (
            f"\n\nAdditional instructions from user:\n{additional_user_instruction}\n\n"
            "Note: While considering these additional instructions, you must still follow the core task "
            "of enhancing requirements as described below. Do not deviate from the primary task format or objective. "
            "Requirements MUST still be categorized with the proper prefixes."
        )

    # Add the main task instructions after any user-provided instructions
    base_prompt += (
        "\n\nYour task:"
        "\n- Ensure each requirement directly supports the project description and business goals"
        "\n- Convert vague statements into specific, testable requirements"
        '\n- Use the format "The system shall..." for functional requirements'
        "\n- Categorize requirements (functional, non-functional)"
        "\n- Remove duplicates and merge similar requirements"
        "\n- Identify and add any critical requirements that are missing but implied"
        "\n- If existing requirements are provided, generate complementary new requirements rather than just refining existing ones"
        "\n- Avoid duplicating functionality already covered by existing requirements"
        "\n- Prioritize requirements (High/Medium/Low) based on their importance to the business goals"
        "\n- Keep the language clear, precise, and unambiguous"
        "\n- Format each requirement as:"
        "\n  [Category] The system shall... (description)"
        "\n  where Category is either 'Functional' or 'Non-Functional'"
        "\n- IMPORTANT: Every requirement MUST start with the category prefix '[Functional]' or '[Non-Functional]'"
        "\n\nReturn only the improved requirements list without explanations or comments."
    )

    return base_prompt
