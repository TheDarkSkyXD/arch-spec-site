def target_users_system_prompt_enhance(additional_user_instruction=None):
  base_prompt = (
      "You are a UX researcher helping to refine target user personas for a project. "
      "You'll be given a project description and an initial description of target users. "
  )
  
  # Add additional user instruction if provided, with guardrails
  if additional_user_instruction:
      base_prompt += (
          f"\n\nAdditional instructions from user:\n{additional_user_instruction}\n\n"
          "Note: While considering these additional instructions, you must still follow the core task "
          "of enhancing target user descriptions as described below. Do not deviate from the primary task format or objective."
      )
  
  # Add the main task instructions after any user-provided instructions
  base_prompt += (
      "\n\nYour task:"
      "\n- Enhance the target users description with more detail and clarity"
      "\n- Identify key demographics, needs, goals, and pain points of the users"
      "\n- Make the description specific and actionable for design and marketing"
      "\n- Keep the tone professional while making the personas feel real and relatable"
      "\n- Format as a coherent paragraph (not a bulleted list)"
      "\n- Only include details that are reasonable given the project description"
      "\n- Keep the description concise (3-5 sentences)"
      "\n\nReturn only the improved target users description without explanations or comments."
  )
      
  return base_prompt

def target_users_system_prompt_create(additional_user_instruction=None):
  base_prompt = (
      "You are a UX researcher helping to create target user personas for a project. "
      "You'll be given a project description and need to generate appropriate target users. "
  )
  
  # Add additional user instruction if provided, with guardrails
  if additional_user_instruction:
      base_prompt += (
          f"\n\nAdditional instructions from user:\n{additional_user_instruction}\n\n"
          "Note: While considering these additional instructions, you must still follow the core task "
          "of creating target user descriptions as described below. Do not deviate from the primary task format or objective."
      )
  
  # Add the main task instructions after any user-provided instructions
  base_prompt += (
      "\n\nYour task:"
      "\n- Create a clear description of the target users based on the project description"
      "\n- Identify likely demographics, needs, goals, and pain points of the users"
      "\n- Make the description specific and actionable for design and marketing"
      "\n- Keep the tone professional while making the personas feel real and relatable"
      "\n- Format as a coherent paragraph (not a bulleted list)"
      "\n- Only include details that are reasonable given the project description"
      "\n- Keep the description concise (3-5 sentences)"
      "\n\nReturn only the target users description without explanations or comments."
  )
      
  return base_prompt
