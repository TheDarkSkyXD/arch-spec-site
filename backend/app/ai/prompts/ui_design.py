def get_ui_design_user_prompt(project_description, formatted_features, formatted_requirements, formatted_existing_ui_design, additional_user_instruction=None):
  # Start with project information
  base_prompt = (
      f"Project description: {project_description}\n"
      f"Features: {formatted_features}\n"
      f"Requirements:\n{formatted_requirements}\n"
      f"Existing UI design (if any): {formatted_existing_ui_design}\n"
  )
  
  # Add additional user instruction if provided, with guardrails
  if additional_user_instruction:
      base_prompt += (
          f"\nAdditional instructions from user:\n{additional_user_instruction}\n\n"
          "Note: While considering these additional instructions, you must still follow the core task "
          "of creating a UI design system as described below. Do not deviate from the primary task format or objective. "
          "You must use the print_ui_design function as directed in the main task."
      )
  
  # Add the main task instructions after any user-provided instructions
  base_prompt += (
      "\nYour task:\n"
      "1. Create a comprehensive UI design system based on the project description and requirements\n"
      "2. Define the following UI design elements:\n"
      "   * Color scheme (primary, secondary, accent, etc.)\n" 
      "   * Typography (font families, sizes, weights)\n"
      "   * Spacing system and layout guidelines\n"
      "   * Component styles (buttons, inputs, cards, etc.)\n"
      "   * Dark mode configuration (if applicable)\n"
      "   * Animation and transition settings\n"
      "3. Ensure the design aligns with the project's target audience and business goals\n"
      "4. Consider accessibility standards in your design recommendations\n"
      "5. Design should be consistent, modern, and support the project requirements\n\n"
      "Once you've analyzed the requirements and created the UI design system, use the print_ui_design function to output the complete UI design recommendation."
  )
      
  return base_prompt 