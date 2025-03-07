import axios from "axios";

// Configure the API client
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Technology category types
 */
export type TechCategory =
  | "frontend"
  | "backend"
  | "database"
  | "authentication"
  | "deployment"
  | "testing";

/**
 * Technology subcategory mapping
 */
export interface TechSubcategories {
  frontend: {
    frameworks: string[];
    languages: string[];
    stateManagement: string[];
    uiLibraries: string[];
    formHandling: string[];
    routing: string[];
    apiClients: string[];
    metaFrameworks: string[];
  };
  backend: {
    frameworks: string[];
    languages: string[];
    orms: string[];
    authFrameworks: string[];
  };
  database: {
    relational: string[];
    noSql: string[];
    providers: string[];
  };
  authentication: {
    providers: string[];
    methods: string[];
  };
  deployment: {
    platforms: string[];
    containerization: string[];
    ci_cd: string[];
  };
  testing: {
    unitTesting: string[];
    e2eTesting: string[];
    apiTesting: string[];
  };
}

/**
 * Tech Stack structure for validation
 */
export interface TechStack {
  frontend?: {
    framework?: string;
    language?: string;
    stateManagement?: string;
    uiLibrary?: string;
    formHandling?: string;
    routing?: string;
    apiClient?: string;
    metaFramework?: string;
    options?: string[];
    [key: string]: string | string[] | undefined;
  };
  backend?: {
    framework?: string;
    language?: string;
    orm?: string;
    authFramework?: string;
    options?: string[];
    [key: string]: string | string[] | undefined;
  };
  database?: {
    type?: string;
    provider?: string;
    options?: string[];
    [key: string]: string | string[] | undefined;
  };
  authentication?: {
    provider?: string;
    methods?: string[];
    options?: string[];
    [key: string]: string | string[] | undefined;
  };
  deployment?: {
    platform?: string;
    containerization?: string;
    ci_cd?: string;
    options?: string[];
    [key: string]: string | string[] | undefined;
  };
  testing?: {
    unitTesting?: string;
    e2eTesting?: string;
    apiTesting?: string;
    options?: string[];
    [key: string]: string | string[] | undefined;
  };
  [key: string]: Record<string, unknown> | undefined;
}

/**
 * Tech Registry structure representing the full registry
 */
export interface TechRegistry {
  version?: string;
  last_updated?: string;
  categories: Array<{
    name: string;
    subcategories: Array<{
      name: string;
      technologies: string[];
    }>;
  }>;
  all_technologies?: string[];
}

/**
 * Technology Registry API client
 */
export const techRegistryApi = {
  /**
   * Get the full technology registry
   */
  async getTechRegistry(): Promise<{ data: TechRegistry; source: string }> {
    const response = await apiClient.get("/api/tech-registry");
    return response.data;
  },

  /**
   * Get all technology categories
   */
  async getTechCategories(): Promise<{ data: string[]; source: string }> {
    const response = await apiClient.get("/api/tech-registry/categories");
    return response.data;
  },

  /**
   * Get subcategories for a specific category
   * @param category The technology category
   */
  async getTechSubcategories(
    category: TechCategory
  ): Promise<{ data: string[]; source: string }> {
    const response = await apiClient.get(
      `/api/tech-registry/categories/${category}`
    );
    return response.data;
  },

  /**
   * Get technologies filtered by category and optional subcategory
   * @param category Optional technology category
   * @param subcategory Optional subcategory
   */
  async getTechnologies(
    category?: TechCategory,
    subcategory?: string
  ): Promise<{ data: Record<string, unknown>; source: string }> {
    let url = "/api/tech-registry/technologies";

    if (category) {
      url += `?category=${category}`;
      if (subcategory) {
        url += `&subcategory=${subcategory}`;
      }
    }

    const response = await apiClient.get(url);
    return response.data;
  },

  /**
   * Validate if a technology name exists in the registry
   * @param techName Name of the technology to validate
   */
  async validateTechnology(techName: string): Promise<{
    valid: boolean;
    category_info?: { category: string; subcategory: string };
    source: string;
  }> {
    const response = await apiClient.get(
      `/api/tech-registry/validate-tech?tech_name=${techName}`
    );
    return response.data;
  },

  /**
   * Validate a tech stack against the registry and optional template
   * @param techStack The tech stack to validate
   * @param templateTechStack Optional template tech stack to check compatibility with
   */
  async validateTechStack(
    techStack: TechStack,
    templateTechStack?: TechStack
  ): Promise<{
    is_valid: boolean;
    invalid_technologies: Array<{
      section: string;
      key: string;
      technology: string;
    }>;
    template_compatibility?: {
      is_compatible: boolean;
      incompatibilities: Array<{
        section: string;
        key: string;
        selected: string;
        allowed: string | string[];
      }>;
    };
  }> {
    const payload = templateTechStack
      ? { tech_stack: techStack, template_tech_stack: templateTechStack }
      : { tech_stack: techStack };

    const response = await apiClient.post(
      "/api/tech-registry/validate-tech-stack",
      payload
    );
    return response.data;
  },

  /**
   * Get technology suggestions based on a partial tech stack
   * @param partialTechStack The partially completed tech stack
   */
  async getTechSuggestions(
    partialTechStack: TechStack
  ): Promise<{ suggestions: Record<string, Record<string, string[]>> }> {
    const response = await apiClient.post(
      "/api/tech-registry/get-suggestions",
      {
        partial_tech_stack: partialTechStack,
      }
    );
    return response.data;
  },
};
