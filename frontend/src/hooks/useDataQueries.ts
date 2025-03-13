import { useQuery, useQueryClient } from "@tanstack/react-query";
import { templatesService } from "../services/templatesService";
import { techStackService } from "../services/techStackService";
import { requirementsService } from "../services/requirementsService";
import { featuresService, FeaturesData } from "../services/featuresService";
import { testCasesService, TestCasesData } from "../services/testCasesService";
import { pagesService } from "../services/pagesService";
import { useState, useEffect } from "react";
import { Requirements, Pages, DataModel } from "../types/templates";
import { apiEndpointsService } from "../services/apiEndpointsService";
import { Api } from "../types/templates";
import { dataModelService } from "../services/dataModelService";

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
      return await techStackService.getAllTechnology();
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

// Requirements hook
export const useRequirements = (projectId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Partial<Requirements> | null>(null);

  useEffect(() => {
    const fetchRequirements = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const requirements = await requirementsService.getRequirements(
          projectId
        );
        setData(requirements);
      } catch (err) {
        console.error("Error fetching requirements:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch requirements")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequirements();
  }, [projectId]);

  return { data, isLoading, error };
};

// Features hook
export const useFeatures = (projectId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<FeaturesData | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const features = await featuresService.getFeatures(projectId);
        setData(features);
      } catch (err) {
        console.error("Error fetching features:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch features")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatures();
  }, [projectId]);

  return { data, isLoading, error };
};

// Pages hook
export const usePages = (projectId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Pages | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const pages = await pagesService.getPages(projectId);
        setData(pages);
      } catch (err) {
        console.error("Error fetching pages:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch pages")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPages();
  }, [projectId]);

  return { data, isLoading, error };
};

// API Endpoints hook
export const useApiEndpoints = (projectId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Api | null>(null);

  useEffect(() => {
    const fetchApiEndpoints = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const apiEndpoints = await apiEndpointsService.getApiEndpoints(
          projectId
        );
        setData(apiEndpoints);
      } catch (err) {
        console.error("Error fetching API endpoints:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch API endpoints")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiEndpoints();
  }, [projectId]);

  return { data, isLoading, error };
};

// Data Model hook
export const useDataModel = (projectId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Partial<DataModel> | null>(null);

  useEffect(() => {
    const fetchDataModel = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const dataModel = await dataModelService.getDataModel(projectId);
        setData(dataModel);
      } catch (err) {
        console.error("Error fetching data model:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch data model")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataModel();
  }, [projectId]);

  return { data, isLoading, error };
};

// Test Cases hook
export const useTestCases = (projectId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TestCasesData | null>(null);

  useEffect(() => {
    const fetchTestCases = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const testCases = await testCasesService.getTestCases(projectId);
        setData(testCases);
      } catch (err) {
        console.error("Error fetching test cases:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to fetch test cases")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestCases();
  }, [projectId]);

  return { data, isLoading, error };
};
