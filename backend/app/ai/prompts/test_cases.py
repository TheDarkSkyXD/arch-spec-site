def get_test_cases_user_prompt(formatted_requirements, formatted_features, formatted_test_cases=None, additional_user_instruction=None):
    """
    Generate a prompt for creating test cases in Gherkin format
    """
    # Start with project information
    existing_test_cases = ""
    if formatted_test_cases:
        existing_test_cases = f"Original test cases (if any): {formatted_test_cases}\n"

    base_prompt = (
        f"Requirements:\n{formatted_requirements}\n\n"
        f"Features:\n{formatted_features}\n\n"
        f"{existing_test_cases}"
    )
    
    # Add additional user instruction if provided, with guardrails
    if additional_user_instruction:
        base_prompt += (
            f"\nAdditional instructions from user:\n{additional_user_instruction}\n\n"
            "Note: While considering these additional instructions, you must still follow the core task "
            "of creating test cases in Gherkin format as described below. Do not deviate from the primary task format or objective. "
            "You must use the print_test_cases function as directed in the main task."
        )
    
    # Add the main task instructions after any user-provided instructions
    base_prompt += (
        "\nYour task:\n"
        "1. Create comprehensive test cases using Gherkin format (Feature, Scenario, Given, When, Then)\n"
        "2. Each test case should include:\n"
        "   * Feature name\n"
        "   * Test case title\n"
        "   * Optional description\n"
        "   * Optional tags (like @smoke, @regression, @ui, @api)\n"
        "   * One or more scenarios with steps using Given/When/Then\n"
        "3. Cover both happy paths and edge cases\n"
        "4. Ensure all critical requirements are addressed by test cases\n"
        "5. If the user provided original test cases, enhance them by:\n"
        "   * Improving steps to be more specific and precise\n"
        "   * Adding missing scenarios\n"
        "   * Adding appropriate tags\n"
        "   * Organizing them into logical features\n"
        "6. If generating from scratch, create test cases that comprehensively verify requirements\n\n"
        "Once you've analyzed the requirements and features, use the print_test_cases function to output the organized test cases."
    )
    
    return base_prompt 