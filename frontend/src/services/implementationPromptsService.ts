/**
 * Service for implementation prompts API interactions.
 */
import apiClient from "../api/apiClient";
import {
  ImplementationPrompts,
  ImplementationPrompt,
} from "../types/templates";

// Interface to match the backend response format
interface ImplementationPromptsSpec {
  id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  version: number;
  last_modified_by?: string;
  data: Record<string, ImplementationPrompt[]>;
}

// Define the API base URL to be consistent with other services
const API_BASE_URL = "/api";

export const implementationPromptsService = {
  /**
   * Get implementation prompts for a project
   *
   * @param projectId - Project ID
   * @returns Promise containing the project implementation prompts
   */
  async getImplementationPrompts(
    projectId: string
  ): Promise<ImplementationPrompts | null> {
    try {
      const response = await apiClient.get<ImplementationPromptsSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/implementation-prompts`
      );

      if (!response.data) {
        console.error(
          "Invalid implementation prompts response:",
          response.data
        );
        return null;
      }

      return {
        data: response.data.data || {},
      };
    } catch (error) {
      console.error(
        `Error fetching implementation prompts for project ${projectId}:`,
        error
      );
      return null;
    }
  },

  /**
   * Save implementation prompts for a project
   *
   * @param projectId - Project ID
   * @param data - Implementation prompts data
   * @returns Promise containing the updated implementation prompts
   */
  async saveImplementationPrompts(
    projectId: string,
    data: ImplementationPrompts
  ): Promise<ImplementationPrompts | null> {
    try {
      // Create the payload in the correct format for the backend
      const payload = {
        data: data.data,
      };

      const response = await apiClient.put<ImplementationPromptsSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/implementation-prompts`,
        payload
      );

      if (!response.data) {
        console.error(
          "Invalid implementation prompts response:",
          response.data
        );
        return null;
      }

      return {
        data: response.data.data || {},
      };
    } catch (error) {
      console.error(
        `Error saving implementation prompts for project ${projectId}:`,
        error
      );
      return null;
    }
  },
};
