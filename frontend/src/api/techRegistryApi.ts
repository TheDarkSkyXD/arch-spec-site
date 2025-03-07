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
  all_technologies?: string[];
  categories: TechCategory[];
  last_updated?: string;
  version?: string;
  [key: string]: unknown; // For any additional properties
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

// Tech Registry API methods
export const techRegistryApi = {
  // Get the complete tech registry
  getTechRegistry: async (): Promise<TechRegistryResponse> => {
    const response = await axios.get(`${API_BASE_URL}/tech-registry`);
    return response.data;
  },

  // Get categories
  getCategories: async (): Promise<string[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/tech-registry/categories`
    );
    return response.data.categories;
  },

  // Get technologies by category and optionally subcategory
  getTechnologies: async (
    category: string,
    subcategory?: string
  ): Promise<string[]> => {
    let url = `${API_BASE_URL}/tech-registry/technologies?category=${encodeURIComponent(
      category
    )}`;
    if (subcategory) {
      url += `&subcategory=${encodeURIComponent(subcategory)}`;
    }

    const response = await axios.get(url);
    return response.data.technologies;
  },

  // Validate if a technology exists in the registry
  validateTechnology: async (techName: string): Promise<ValidationResult> => {
    const response = await axios.get(
      `${API_BASE_URL}/tech-registry/validate-tech?tech_name=${encodeURIComponent(
        techName
      )}`
    );
    return response.data;
  },
};

export default techRegistryApi;
