import { useQuery, useQueryClient } from "@tanstack/react-query";
import { templatesService } from "../services/templatesService";
import { techStackService } from "../services/techStackService";

// Query keys for different types of data
export const QUERY_KEYS = {
  TECH_STACK: "techStack",
  TEMPLATES: "templates",
};

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
