def get_features_user_prompt(project_description, formatted_goals, formatted_requirements, formatted_features, additional_user_instruction=None):
  # Start with project information
  base_prompt = (
      f"Project description: {project_description}\n"
      f"Business goals:\n{formatted_goals}\n"
      f"Requirements:\n{formatted_requirements}\n"
      f"Original features (if any): {formatted_features}\n"
  )
  
  # Add additional user instruction if provided, with guardrails
  if additional_user_instruction:
      base_prompt += (
          f"\nAdditional instructions from user:\n{additional_user_instruction}\n\n"
          "Note: While considering these additional instructions, you must still follow the core task "
          "of creating or enhancing features as described below. Do not deviate from the primary task format or objective. "
          "You must use the print_features function as directed in the main task."
      )
  
  # Add the main task instructions after any user-provided instructions
  base_prompt += (
      "\nYour task:\n"
      "1. Create a clear list of features that fulfill the requirements and support the business goals\n"
      "2. Group features into logical categories based on core modules\n"
      "3. For each feature, include:\n"
      "   * A descriptive name\n"
      "   * A brief (1-2 sentence) description\n"
      "   * User benefit or value\n"
      "   * Complexity estimate (Simple/Moderate/Complex)\n"
      "4. Ensure all high-priority requirements are addressed by at least one feature\n"
      "5. If the user provided original features, incorporate and improve them\n"
      "6. If generating from scratch, create features that comprehensively address the requirements\n"
      "7. Include both core features and nice-to-have features, clearly labeled\n\n"
      "Once you've analyzed the requirements and created the features, use the print_features function to output the organized feature list."
  )
      
  return base_prompt
