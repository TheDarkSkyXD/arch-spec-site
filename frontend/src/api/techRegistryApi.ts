import { apiClient } from "./apiClient";

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
 * Technology Registry API client
 */
export const techRegistryApi = {
  /**
   * Get the full technology registry
   */
  async getTechRegistry() {
    const response = await apiClient.get("/tech-registry");
    return response.data;
  },

  /**
   * Get all technology categories
   */
  async getTechCategories() {
    const response = await apiClient.get("/tech-registry/categories");
    return response.data;
  },

  /**
   * Get subcategories for a specific category
   * @param category The technology category
   */
  async getTechSubcategories(category: TechCategory) {
    const response = await apiClient.get(
      `/tech-registry/categories/${category}`
    );
    return response.data;
  },

  /**
   * Get technologies filtered by category and optional subcategory
   * @param category Optional technology category
   * @param subcategory Optional subcategory
   */
  async getTechnologies(category?: TechCategory, subcategory?: string) {
    let url = "/tech-registry/technologies";

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
  async validateTechnology(techName: string) {
    const response = await apiClient.get(
      `/tech-registry/validate-tech?tech_name=${techName}`
    );
    return response.data;
  },

  /**
   * Validate a tech stack against the registry and optional template
   * @param techStack The tech stack to validate
   * @param templateTechStack Optional template tech stack to check compatibility with
   */
  async validateTechStack(techStack: any, templateTechStack?: any) {
    const payload = templateTechStack
      ? { tech_stack: techStack, template_tech_stack: templateTechStack }
      : { tech_stack: techStack };

    const response = await apiClient.post(
      "/tech-registry/validate-tech-stack",
      payload
    );
    return response.data;
  },

  /**
   * Get technology suggestions based on a partial tech stack
   * @param partialTechStack The partially completed tech stack
   */
  async getTechSuggestions(partialTechStack: any) {
    const response = await apiClient.post("/tech-registry/get-suggestions", {
      partial_tech_stack: partialTechStack,
    });
    return response.data;
  },
};
