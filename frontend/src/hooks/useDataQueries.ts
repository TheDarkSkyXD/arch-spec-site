import { useQuery, useQueryClient } from "@tanstack/react-query";
import { techRegistryApi } from "../api/techRegistryApi";
import { templatesService } from "../services/templatesService";
import axios from "axios";

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
  return useQuery({
    queryKey: [QUERY_KEYS.TECH_REGISTRY, "categories"],
    queryFn: async () => {
      const categories = await techRegistryApi.getCategories();
      return categories;
    },
  });
}

/**
 * Hook to fetch technologies by category and optional subcategory
 */
export function useTechnologies(category?: string, subcategory?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.TECH_REGISTRY, "technologies", category, subcategory],
    queryFn: async () => {
      if (!category) return [];
      const technologies = await techRegistryApi.getTechnologies(
        category,
        subcategory
      );
      return technologies;
    },
    enabled: !!category, // Only run if category is provided
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
      // Use the correct endpoint for tech stack options
      const response = await axios.get("/api/tech-stack/options");
      return response.data;
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
