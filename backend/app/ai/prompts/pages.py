def get_pages_user_prompt(project_description, formatted_features, formatted_requirements, formatted_existing_pages):
  return (
      f"Project description: {project_description}\n"
      f"Features: {formatted_features}\n"
      f"Requirements:\n{formatted_requirements}\n"
      f"Existing pages (if any): {formatted_existing_pages}\n\n"
      "Your task:\n"
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
