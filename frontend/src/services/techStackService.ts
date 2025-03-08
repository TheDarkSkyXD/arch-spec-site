/**
 * Service for tech stack compatibility API interactions.
 */
import apiClient from "../api/apiClient";
import {
  TechStackSelection,
  CompatibilityResult,
  CompatibleOptionsRequest,
  CompatibleOptionsResponse,
  TechStackData,
} from "../types/techStack";

// Define the API base URL to be consistent with other services
const API_BASE_URL = "/api";

/**
 * Tech Stack API service for compatibility checks and options.
 */
export const techStackService = {
  /**
   * Check compatibility between selected technologies.
   *
   * @param selection - The tech stack selection to check
   * @returns Compatibility check results
   */
  async checkCompatibility(
    selection: TechStackSelection
  ): Promise<CompatibilityResult> {
    try {
      const response = await apiClient.post<CompatibilityResult>(
        `${API_BASE_URL}/tech-stack/compatibility/check`,
        selection
      );
      return response.data;
    } catch (error) {
      console.error("Error checking tech stack compatibility:", error);
      throw error;
    }
  },

  /**
   * Get compatible options for a given technology in a specific category.
   *
   * @param category - The technology category
   * @param technology - The specific technology name
   * @returns Compatible options for the technology
   */
  async getCompatibleOptions(
    category: string,
    technology: string
  ): Promise<CompatibleOptionsResponse> {
    try {
      const request: CompatibleOptionsRequest = { category, technology };
      const response = await apiClient.post<CompatibleOptionsResponse>(
        `${API_BASE_URL}/tech-stack/compatibility/options`,
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error getting compatible options:", error);
      throw error;
    }
  },

  /**
   * Get all available technology options.
   *
   * @returns All technology options
   */
  async getAllTechnologyOptions(): Promise<TechStackData> {
    try {
      const response = await apiClient.get<TechStackData>(
        `${API_BASE_URL}/tech-stack/options`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting all technology options:", error);
      throw error;
    }
  },

  /**
   * Update the tech stack configuration.
   *
   * @param techStackData - The updated tech stack data
   * @returns The updated tech stack data
   */
  async updateTechStack(techStackData: TechStackData): Promise<TechStackData> {
    try {
      const response = await apiClient.put<TechStackData>(
        `${API_BASE_URL}/tech-stack`,
        techStackData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating tech stack data:", error);
      throw error;
    }
  },
};
