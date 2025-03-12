/**
 * Service for requirements API interactions.
 */
import apiClient from "../api/apiClient";
import { RequirementsData } from "../types/project";

// Interface to match the backend response format
interface RequirementsSpec {
  id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  version: number;
  last_modified_by?: string;
  functional: string[];
  non_functional: string[];
}

// Define the API base URL to be consistent with other services
const API_BASE_URL = "/api";

export const requirementsService = {
  /**
   * Get requirements for a project
   *
   * @param projectId - Project ID
   * @returns Promise containing the project requirements
   */
  async getRequirements(projectId: string): Promise<RequirementsData | null> {
    try {
      const response = await apiClient.get<RequirementsSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/requirements`
      );

      if (!response.data) {
        console.error("Invalid requirements response:", response.data);
        return null;
      }

      return {
        functional: response.data.functional || [],
        non_functional: response.data.non_functional || [],
      };
    } catch (error) {
      console.error(
        `Error fetching requirements for project ${projectId}:`,
        error
      );
      return null;
    }
  },

  /**
   * Save requirements for a project
   *
   * @param projectId - Project ID
   * @param data - Requirements data
   * @returns Promise containing the updated requirements
   */
  async saveRequirements(
    projectId: string,
    data: RequirementsData
  ): Promise<RequirementsData | null> {
    try {
      // Create the payload in the correct format for the backend
      const payload = {
        functional: data.functional,
        non_functional: data.non_functional,
      };

      const response = await apiClient.put<RequirementsSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/requirements`,
        payload
      );

      if (!response.data) {
        console.error("Invalid requirements response:", response.data);
        return null;
      }

      return {
        functional: response.data.functional || [],
        non_functional: response.data.non_functional || [],
      };
    } catch (error) {
      console.error(
        `Error saving requirements for project ${projectId}:`,
        error
      );
      return null;
    }
  },
};
