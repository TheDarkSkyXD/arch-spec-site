def get_api_endpoints_user_prompt(project_description, formatted_features, formatted_data_models, formatted_requirements, additional_user_instruction=None):
  # Start with project information
  base_prompt = (
      f"Project description: {project_description}\n"
      f"Features:\n{formatted_features}\n"
      f"Data models:\n{formatted_data_models}\n"
      f"Requirements:\n{formatted_requirements}\n"
  )
  
  # Add additional user instruction if provided, with guardrails
  if additional_user_instruction:
      base_prompt += (
          f"\nAdditional instructions from user:\n{additional_user_instruction}\n\n"
          "Note: While considering these additional instructions, you must still follow the core task "
          "of designing API endpoints as described below. Do not deviate from the primary task format or objective. "
          "You must use the print_api_endpoints function as directed in the main task."
      )
  
  # Add the main task instructions after any user-provided instructions
  base_prompt += (
      "\nYour task:\n"
      "1. Design RESTful API endpoints that enable all the required features\n"
      "2. For each endpoint, specify:\n"
      "   - HTTP method (GET, POST, PUT, DELETE, etc.)\n"
      "   - Path with parameters if needed\n"
      "   - Request body schema (reference data models)\n"
      "   - Response schema with status codes\n"
      "   - Authentication requirements\n"
      "   - Rate limiting considerations (if applicable)\n"
      "3. Group endpoints by resource or functional area\n"
      "4. Include pagination for endpoints returning collections\n"
      "5. Follow REST best practices (proper HTTP methods, resource naming, etc.)\n"
      "6. Consider versioning strategy\n\n"
      "Once you've analyzed the requirements and designed the API endpoints, use the print_api_endpoints function to output the organized API specification."
  )
      
  return base_prompt 