/**
 * Service for API endpoints API interactions.
 */
import apiClient from '../api/apiClient';

// Define API endpoint interface
export interface ApiEndpoint {
  path: string;
  description: string;
  methods: string[];
  auth: boolean;
  roles?: string[];
}

// Data structure for API endpoints
export interface ApiEndpointsData {
  endpoints: ApiEndpoint[];
}

// Interface to match the backend response format
interface ApiEndpointsSpec {
  id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  version: number;
  last_modified_by?: string;
  data: {
    endpoints: ApiEndpoint[];
  };
}

// Define the API base URL to be consistent with other services
const API_BASE_URL = '/api';

export const apiEndpointsService = {
  /**
   * Get API endpoints for a project
   *
   * @param projectId - Project ID
   * @returns Promise containing the project API endpoints
   */
  async getApiEndpoints(projectId: string): Promise<ApiEndpointsData | null> {
    try {
      const response = await apiClient.get<ApiEndpointsSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/api`
      );

      if (!response.data || !response.data.data) {
        console.error('Invalid API endpoints response:', response.data);
        return null;
      }

      return {
        endpoints: response.data.data.endpoints || [],
      };
    } catch (error) {
      console.error(`Error fetching API endpoints for project ${projectId}:`, error);
      return null;
    }
  },

  /**
   * Save API endpoints for a project
   *
   * @param projectId - Project ID
   * @param data - API endpoints data
   * @returns Promise containing the updated API endpoints
   */
  async saveApiEndpoints(
    projectId: string,
    data: ApiEndpointsData
  ): Promise<ApiEndpointsData | null> {
    try {
      const payload = {
        data: {
          endpoints: data.endpoints,
        },
      };

      const response = await apiClient.put<ApiEndpointsSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/api`,
        payload
      );

      if (!response.data || !response.data.data) {
        console.error('Invalid API endpoints response:', response.data);
        return null;
      }

      return {
        endpoints: response.data.data.endpoints || [],
      };
    } catch (error) {
      console.error(`Error saving API endpoints for project ${projectId}:`, error);
      return null;
    }
  },
};
