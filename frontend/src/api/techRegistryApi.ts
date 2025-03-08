import axios from "axios";

// Define your API base URL
const API_BASE_URL = "/api";

// Tech Registry interfaces
export interface TechSubcategory {
  name: string;
  technologies: string[];
}

export interface TechCategory {
  name: string;
  subcategories: TechSubcategory[];
}

export interface TechRegistry {
  // Index signature to allow dynamic keys for categories
  [category: string]:
    | {
        [subcategory: string]: string[];
      }
    | string[]
    | string
    | undefined;

  // Special properties that should not be treated as categories
  _id?: string;
  all_technologies?: string[];
  last_updated?: string;
  version?: string;
}

export interface TechRegistryResponse {
  data: TechRegistry;
  source?: string;
}

export interface ValidationResult {
  valid: boolean;
  found_in?: string[];
  message?: string;
}

export interface TechStackData {
  [category: string]: {
    [subcategory: string]: string[];
  };
}

export interface TechStackValidationResult {
  is_valid: boolean;
  invalid_technologies?: {
    section: string;
    key: string;
    technology: string;
  }[];
  message?: string;
}

export interface TechSuggestion {
  category: string;
  subcategory: string;
  technologies: string[];
  reason: string;
}

export interface TechSuggestionsResult {
  suggestions: TechSuggestion[];
}

// Tech Registry API methods
export const techRegistryApi = {
  // Get the complete tech registry
  getTechRegistry: async (): Promise<TechRegistryResponse> => {
    const response = await axios.get(`${API_BASE_URL}/tech-registry`);
    return response.data;
  },

  // Validate a single technology name
  validateTechnology: async (techName: string): Promise<ValidationResult> => {
    const response = await axios.get(
      `${API_BASE_URL}/tech-registry/validate-tech?tech_name=${encodeURIComponent(
        techName
      )}`
    );
    return response.data;
  },

  // Validate an entire tech stack
  validateTechStack: async (
    techStack: TechStackData,
    templateStack?: TechStackData
  ): Promise<TechStackValidationResult> => {
    const response = await axios.post(
      `${API_BASE_URL}/tech-registry/validate-tech-stack`,
      {
        tech_stack: techStack,
        template_tech_stack: templateStack || null,
      }
    );
    return response.data;
  },

  // Get suggestions based on partial tech stack
  getTechSuggestions: async (
    partialTechStack: TechStackData
  ): Promise<TechSuggestionsResult> => {
    const response = await axios.post(
      `${API_BASE_URL}/tech-registry/get-suggestions`,
      {
        ...partialTechStack,
      }
    );
    return response.data;
  },

  // Refresh the tech registry from the source
  refreshTechRegistry: async (): Promise<TechRegistryResponse> => {
    const response = await axios.post(`${API_BASE_URL}/tech-registry/refresh`);
    return response.data;
  },
};

export default techRegistryApi;
