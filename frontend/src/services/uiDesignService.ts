import { UIDesign } from "../types/templates";
import apiClient from "../api/apiClient";
const API_BASE_URL = "/api";

interface UIDesignResponse {
  id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  version: number;
  data: UIDesign;
}

export class UIDesignService {
  /**
   * Get UI design data for a project
   * @param projectId The project ID
   * @returns UI design data or null if not found
   */
  static async getUIDesign(projectId: string): Promise<UIDesign | null> {
    try {
      const response = await apiClient.get<UIDesignResponse>(
        `${API_BASE_URL}/project-specs/${projectId}/ui-design`
      );

      if (!response.data) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch UI design: ${response.statusText}`);
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching UI design:", error);
      throw error;
    }
  }

  /**
   * Save UI design data for a project
   * @param projectId The project ID
   * @param uiDesignData The UI design data to save
   * @returns The saved UI design data
   */
  static async saveUIDesign(
    projectId: string,
    uiDesignData: UIDesign
  ): Promise<UIDesign | null> {
    try {
      const response = await apiClient.put<UIDesign>(
        `${API_BASE_URL}/project-specs/${projectId}/ui-design`,
        {
          data: uiDesignData,
        }
      );

      if (!response.data) {
        throw new Error(`Failed to save UI design: ${response.statusText}`);
      }

      return response.data;
    } catch (error) {
      console.error("Error saving UI design:", error);
      throw error;
    }
  }
}

export const uiDesignService = UIDesignService;
