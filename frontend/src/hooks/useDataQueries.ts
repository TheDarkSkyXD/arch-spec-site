import { useQuery, useQueryClient } from '@tanstack/react-query';
import { templatesService } from '../services/templatesService';
import { techStackService } from '../services/techStackService';
import { requirementsService } from '../services/requirementsService';
import { featuresService, FeaturesData } from '../services/featuresService';
import { testCasesService, TestCasesData } from '../services/testCasesService';
import { pagesService } from '../services/pagesService';
import { useState, useEffect } from 'react';
import { Requirements, Pages, DataModel } from '../types/templates';
import { apiEndpointsService } from '../services/apiEndpointsService';
import { Api } from '../types/templates';
import { dataModelService } from '../services/dataModelService';
import { uiDesignService } from '../services/uiDesignService';
import { UIDesign } from '../types/templates';

// Query keys for different types of data
export const QUERY_KEYS = {
  TECH_STACK: 'techStack',
  TEMPLATES: 'templates',
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
      if (!templateId) throw new Error('Template ID is required');
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
 * Hook to fetch requirements data for a project
 */
export function useRequirements(projectId?: string) {
  const [data, setData] = useState<Requirements | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const requirements = await requirementsService.getRequirements(projectId);
        setData(requirements as Requirements);
      } catch (err) {
        console.error('Error fetching requirements:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { data, isLoading, error };
}

/**
 * Hook to fetch features data for a project
 */
export function useFeatures(projectId?: string) {
  const [data, setData] = useState<FeaturesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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
        console.error('Error fetching features:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { data, isLoading, error };
}

/**
 * Hook to fetch pages data for a project
 */
export function usePages(projectId?: string) {
  const [data, setData] = useState<Pages | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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
        console.error('Error fetching pages:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { data, isLoading, error };
}

/**
 * Hook to fetch data model for a project
 */
export function useDataModel(projectId?: string) {
  const [data, setData] = useState<DataModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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
        console.error('Error fetching data model:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { data, isLoading, error };
}

/**
 * Hook to fetch API endpoints for a project
 */
export function useApiEndpoints(projectId?: string) {
  const [data, setData] = useState<Api | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const apiEndpoints = await apiEndpointsService.getApiEndpoints(projectId);
        setData(apiEndpoints);
      } catch (err) {
        console.error('Error fetching API endpoints:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { data, isLoading, error };
}

/**
 * Hook to fetch test cases for a project
 */
export function useTestCases(projectId?: string) {
  const [data, setData] = useState<TestCasesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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
        console.error('Error fetching test cases:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { data, isLoading, error };
}

/**
 * Hook to fetch UI Design data for a project
 */
export function useUIDesign(projectId?: string) {
  const [data, setData] = useState<UIDesign | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const uiDesign = await uiDesignService.getUIDesign(projectId);
        setData(uiDesign);
      } catch (err) {
        console.error('Error fetching UI design:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { data, isLoading, error };
}
