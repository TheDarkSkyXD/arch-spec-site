/**
 * Service for features API interactions.
 */
import apiClient from '../api/apiClient';

// Define feature module interface
export interface FeatureModule {
  name: string;
  description: string;
  enabled: boolean;
  optional?: boolean;
  providers?: string[];
}

// Data structure for features
export interface FeaturesData {
  coreModules: FeatureModule[];
  optionalModules?: FeatureModule[];
}

// Interface to match the backend response format
interface FeaturesSpec {
  id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  version: number;
  last_modified_by?: string;
  data: {
    coreModules: FeatureModule[];
    optionalModules?: FeatureModule[];
  };
}

// Define the API base URL to be consistent with other services
const API_BASE_URL = '/api';

export const featuresService = {
  /**
   * Get features for a project
   *
   * @param projectId - Project ID
   * @returns Promise containing the project features
   */
  async getFeatures(projectId: string): Promise<FeaturesData | null> {
    try {
      const response = await apiClient.get<FeaturesSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/features`
      );

      if (!response.data || !response.data.data) {
        console.error('Invalid features response:', response.data);
        return null;
      }

      // Convert camelCase from backend to snake_case for frontend
      return {
        coreModules: response.data.data.coreModules || [],
        optionalModules: response.data.data.optionalModules || [],
      };
    } catch (error) {
      console.error(`Error fetching features for project ${projectId}:`, error);
      return null;
    }
  },

  /**
   * Save features for a project
   *
   * @param projectId - Project ID
   * @param data - Features data
   * @returns Promise containing the updated features
   */
  async saveFeatures(projectId: string, data: FeaturesData): Promise<FeaturesData | null> {
    try {
      // Convert snake_case from frontend to camelCase for backend
      const payload = {
        data: {
          coreModules: data.coreModules,
          optionalModules: data.optionalModules,
        },
      };

      const response = await apiClient.put<FeaturesSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/features`,
        payload
      );

      if (!response.data || !response.data.data) {
        console.error('Invalid features response:', response.data);
        return null;
      }

      return {
        coreModules: response.data.data.coreModules || [],
        optionalModules: response.data.data.optionalModules || [],
      };
    } catch (error) {
      console.error(`Error saving features for project ${projectId}:`, error);
      return null;
    }
  },
};
