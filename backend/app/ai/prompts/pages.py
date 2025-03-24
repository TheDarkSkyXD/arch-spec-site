def get_pages_user_prompt(project_description, formatted_features, formatted_requirements, formatted_existing_pages, additional_user_instruction=None):
  # Start with project information
  base_prompt = (
      f"Project description: {project_description}\n"
      f"Features: {formatted_features}\n"
      f"Requirements:\n{formatted_requirements}\n"
      f"Existing pages (if any): {formatted_existing_pages}\n"
  )
  
  # Add additional user instruction if provided, with guardrails
  if additional_user_instruction:
      base_prompt += (
          f"\nAdditional instructions from user:\n{additional_user_instruction}\n\n"
          "Note: While considering these additional instructions, you must still follow the core task "
          "of identifying and organizing pages as described below. Do not deviate from the primary task format or objective. "
          "You must use the print_pages function as directed in the main task."
      )
  
  # Add the main task instructions after any user-provided instructions
  base_prompt += (
      "\nYour task:\n"
      "1. Identify the essential pages needed to implement the specified features\n"
      "2. For each page, provide:\n"
      "   * A descriptive name\n"
      "   * The primary purpose/function\n"
      "   * Key UI elements to include\n"
      "   * User interactions to support\n"
      "3. Organize pages by user access level (public, authenticated, admin)\n"
      "4. Consider different user roles if mentioned in the requirements\n"
      "5. Focus on pages that deliver the core functionality first\n"
      "6. Include administrative/management pages if needed\n\n"
      "Once you've analyzed the requirements and identified the essential pages, use the print_pages function to output the organized page recommendations."
  )
      
  return base_prompt
