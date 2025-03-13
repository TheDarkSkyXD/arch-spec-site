def get_data_model_user_prompt(project_description, formatted_goals, formatted_features, formatted_requirements, formatted_data_model):
  return (
      f"Project description: {project_description}\n"
      f"Business goals:\n{formatted_goals}\n"
      f"Features:\n{formatted_features}\n"
      f"Requirements:\n{formatted_requirements}\n"
      f"Original data model (if any): {formatted_data_model}\n\n"
      "Your task:\n"
      "1. Identify key entities needed to support the features and requirements\n"
      "2. Define properties/fields for each entity including their data types, constraints, and defaults\n"
      "3. Specify relationships between entities (one-to-one, one-to-many, many-to-many)\n"
      "4. Indicate primary keys and foreign keys\n"
      "5. Group related entities into logical schemas\n"
      "6. Include indexing recommendations for performance\n\n"
      "Once you've analyzed the requirements and created the data model, use the print_data_model function to output the structured data model specification."
  )
