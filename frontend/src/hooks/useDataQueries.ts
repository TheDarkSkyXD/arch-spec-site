import { useQuery, useQueryClient } from "@tanstack/react-query";
import { techRegistryApi } from "../api/techRegistryApi";
import { templatesService } from "../services/templatesService";
import { techStackService } from "../services/techStackService";

// Query keys for different types of data
export const QUERY_KEYS = {
  TECH_REGISTRY: "techRegistry",
  TECH_STACK: "techStack",
  TEMPLATES: "templates",
};

/**
 * Hook to fetch and cache tech registry data
 */
export function useTechRegistry() {
  return useQuery({
    queryKey: [QUERY_KEYS.TECH_REGISTRY],
    queryFn: async () => {
      const response = await techRegistryApi.getTechRegistry();
      return response;
    },
  });
}

/**
 * Hook to fetch tech registry categories
 */
export function useTechCategories() {
  const techRegistryQuery = useQuery({
    queryKey: [QUERY_KEYS.TECH_REGISTRY],
    queryFn: async () => {
      const response = await techRegistryApi.getTechRegistry();
      return response;
    },
  });

  return useQuery({
    queryKey: [QUERY_KEYS.TECH_REGISTRY, "categories"],
    queryFn: () => {
      if (!techRegistryQuery.data?.data) {
        throw new Error("Tech registry data not available");
      }

      // Get all keys but exclude special properties
      const specialProperties = [
        "_id",
        "all_technologies",
        "last_updated",
        "version",
      ];
      const allKeys = Object.keys(techRegistryQuery.data.data);

      // Filter out special properties to get only actual technology categories
      return allKeys.filter((key) => !specialProperties.includes(key));
    },
    // Only run this query if tech registry data is available
    enabled: Boolean(techRegistryQuery.data?.data),
  });
}

/**
 * Hook to fetch technologies by category and optional subcategory
 */
export function useTechnologies(category?: string, subcategory?: string) {
  const techRegistryQuery = useQuery({
    queryKey: [QUERY_KEYS.TECH_REGISTRY],
    queryFn: async () => {
      const response = await techRegistryApi.getTechRegistry();
      return response;
    },
  });

  return useQuery({
    queryKey: [QUERY_KEYS.TECH_REGISTRY, "technologies", category, subcategory],
    queryFn: () => {
      if (!techRegistryQuery.data?.data) {
        return [];
      }

      // If no category is selected but we have all_technologies, return that
      if (!category && techRegistryQuery.data.data.all_technologies) {
        return techRegistryQuery.data.data.all_technologies;
      }

      // If no category, return an empty array
      if (!category) {
        return [];
      }

      const categoryData = techRegistryQuery.data.data[category];
      if (!categoryData) {
        return [];
      }

      // If subcategory is specified, return technologies from that subcategory
      if (subcategory) {
        return typeof categoryData === "object" && !Array.isArray(categoryData)
          ? categoryData[subcategory] || []
          : [];
      }

      // If no subcategory specified, return all technologies from all subcategories
      const allTechnologies: string[] = [];

      if (
        typeof categoryData === "object" &&
        !Array.isArray(categoryData) &&
        categoryData !== null
      ) {
        Object.values(categoryData).forEach((technologies) => {
          if (Array.isArray(technologies)) {
            allTechnologies.push(...technologies);
          }
        });
      }

      return allTechnologies;
    },
    // Only run if tech registry data is available (category can be empty for "All Categories")
    enabled: Boolean(techRegistryQuery.data?.data),
  });
}

/**
 * Hook to validate if a technology exists in the registry
 */
export function useValidateTechnology(techName?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.TECH_REGISTRY, "validate", techName],
    queryFn: async () => {
      if (!techName) throw new Error("Technology name is required");
      const result = await techRegistryApi.validateTechnology(techName);
      return result;
    },
    enabled: !!techName, // Only run if techName is provided
  });
}

/**
 * Hook to invalidate tech registry data for refreshing
 */
export function useRefreshTechRegistry() {
  const queryClient = useQueryClient();

  return {
    refreshTechRegistry: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TECH_REGISTRY] });
    },
  };
}

/**
 * Hook to fetch tech stack data
 */
export function useTechStack() {
  return useQuery({
    queryKey: [QUERY_KEYS.TECH_STACK],
    queryFn: async () => {
      // Use the tech stack service to ensure proper authentication
      return await techStackService.getAllTechnologyOptions();
    },
  });
}

/**
 * Hook to invalidate tech stack data for refreshing
 */
export function useRefreshTechStack() {
  const queryClient = useQueryClient();

  return {
    refreshTechStack: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TECH_STACK] });
    },
  };
}

/**
 * Hook to fetch template data
 */
export function useTemplates() {
  return useQuery({
    queryKey: [QUERY_KEYS.TEMPLATES],
    queryFn: async () => {
      const templates = await templatesService.getTemplates();
      return templates;
    },
  });
}

/**
 * Hook to fetch a specific template by ID
 */
export function useTemplate(templateId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.TEMPLATES, templateId],
    queryFn: async () => {
      if (!templateId) throw new Error("Template ID is required");
      const template = await templatesService.getTemplateById(templateId);
      return template;
    },
    enabled: !!templateId, // Only run if templateId is provided
  });
}

/**
 * Hook to invalidate templates data for refreshing
 */
export function useRefreshTemplates() {
  const queryClient = useQueryClient();

  return {
    refreshTemplates: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEMPLATES] });
    },
  };
}

/**
 * Hook to fetch tech registry subcategories for a given category
 */
export function useTechSubcategories(categoryName?: string) {
  const techRegistryQuery = useQuery({
    queryKey: [QUERY_KEYS.TECH_REGISTRY],
    queryFn: async () => {
      const response = await techRegistryApi.getTechRegistry();
      return response;
    },
  });

  return useQuery({
    queryKey: [QUERY_KEYS.TECH_REGISTRY, "subcategories", categoryName],
    queryFn: () => {
      if (!techRegistryQuery.data?.data || !categoryName) {
        return [];
      }

      const category = techRegistryQuery.data.data[categoryName];

      // Check if category exists and is an object (not an array or primitive)
      if (
        !category ||
        typeof category !== "object" ||
        Array.isArray(category) ||
        category === null
      ) {
        return [];
      }

      // Return the subcategory keys from the category object
      return Object.keys(category);
    },
    // Only run if tech registry data and category name are available
    enabled: Boolean(techRegistryQuery.data?.data) && Boolean(categoryName),
  });
}
