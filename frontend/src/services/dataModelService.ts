/**
 * Service for data model API interactions.
 */
import apiClient from '../api/apiClient';
import { DataModel } from '../types/templates';

// Interface to match the backend response format
interface DataModelSpec {
  id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  version: number;
  last_modified_by?: string;
  data: DataModel;
}

// Define the API base URL to be consistent with other services
const API_BASE_URL = '/api';

export const dataModelService = {
  /**
   * Get data model for a project
   *
   * @param projectId - Project ID
   * @returns Promise containing the project data model
   */
  async getDataModel(projectId: string): Promise<DataModel | null> {
    try {
      const response = await apiClient.get<DataModelSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/data-model`
      );

      if (!response.data || !response.data.data) {
        console.error('Invalid data model response:', response.data);
        return null;
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error fetching data model for project ${projectId}:`, error);
      return null;
    }
  },

  /**
   * Save data model for a project
   *
   * @param projectId - Project ID
   * @param data - Data model data
   * @returns Promise containing the updated data model
   */
  async saveDataModel(projectId: string, data: DataModel): Promise<DataModel | null> {
    try {
      const payload = {
        data: data,
      };

      const response = await apiClient.put<DataModelSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/data-model`,
        payload
      );

      if (!response.data || !response.data.data) {
        console.error('Invalid data model response:', response.data);
        return null;
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error saving data model for project ${projectId}:`, error);
      return null;
    }
  },
};
