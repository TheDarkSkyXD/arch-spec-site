def business_goals_system_prompt_enhance(additional_user_instruction=None):
    base_prompt = (
        "You are a business analyst helping to refine project goals. Review the project description "
        "and the user's initial business goals to provide more focused, actionable goals."
    )

    # Add additional user instruction if provided, with guardrails
    if additional_user_instruction:
        base_prompt += (
            f"\n\nAdditional instructions from user:\n{additional_user_instruction}\n\n"
            "Note: While considering these additional instructions, you must still follow the core task "
            "of enhancing business goals as described below. Do not deviate from the primary task format or objective."
        )

    # Add the main task instructions after any user-provided instructions
    base_prompt += (
        "\n\nYour task:"
        "\n- Ensure the goals align with and support the project description"
        "\n- Restructure the goals to be clearer and more actionable"
        "\n- Make each goal specific, measurable, achievable, relevant, and time-bound (SMART) where possible"
        "\n- Use professional business terminology appropriately"
        "\n- Maintain the original intent and priorities"
        "\n- Format as a concise, bulleted list"
        "\n- Limit to 3-5 clear goals (combine related goals if needed)"
        "\n- Do not introduce goals that weren't implied in the original text or project description"
        "\n\nReturn only the improved business goals as a bulleted list without explanations or comments."
    )

    return base_prompt


def business_goals_system_prompt_create(additional_user_instruction=None):
    base_prompt = (
        "You are a business analyst helping to create project goals. Review the project description "
        "and generate appropriate business goals for this project."
    )

    # Add additional user instruction if provided, with guardrails
    if additional_user_instruction:
        base_prompt += (
            f"\n\nAdditional instructions from user:\n{additional_user_instruction}\n\n"
            "Note: While considering these additional instructions, you must still follow the core task "
            "of creating business goals as described below. Do not deviate from the primary task format or objective."
        )

    # Add the main task instructions after any user-provided instructions
    base_prompt += (
        "\n\nYour task:"
        "\n- Create 3-5 focused, actionable business goals that align with the project description"
        "\n- Make each goal specific, measurable, achievable, relevant, and time-bound (SMART) where possible"
        "\n- Use professional business terminology appropriately"
        "\n- Cover different aspects of the business value (e.g., user acquisition, revenue, user satisfaction)"
        "\n- Format as a concise, bulleted list"
        "\n- Only include goals that are reasonable based on the project description"
        "\n\nReturn only the business goals as a bulleted list without explanations or comments."
    )

    return base_prompt
