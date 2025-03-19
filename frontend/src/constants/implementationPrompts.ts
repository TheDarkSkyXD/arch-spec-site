import { ImplementationPromptType } from "../types/templates";

// Define the categories for implementation prompts
export const IMPLEMENTATION_CATEGORIES = [
  "01_project_setup",
  "02_data_layer",
  "03_api_backend",
  "04_frontend_foundation",
  "05_features",
  "06_testing",
  "07_deployment_devops",
  "08_component_completion",
  "09_integration_implementation",
];

// Define readable labels for the categories
export const CATEGORY_LABELS: Record<string, string> = {
  "01_project_setup": "1. Project Setup",
  "02_data_layer": "2. Data Layer",
  "03_api_backend": "3. API/Backend",
  "04_frontend_foundation": "4. Frontend Foundation",
  "05_features": "5. Features",
  "06_testing": "6. Testing",
  "07_deployment_devops": "7. Deployment & DevOps",
  "08_component_completion": "8. Component Completion",
  "09_integration_implementation": "9. Integration Implementation",
};

// Define readable labels for prompt types
export const PROMPT_TYPE_LABELS: Record<string, string> = {
  [ImplementationPromptType.MAIN]: "Main Prompt",
  [ImplementationPromptType.FOLLOWUP_1]: "Follow-up 1",
  [ImplementationPromptType.FOLLOWUP_2]: "Follow-up 2",
};
