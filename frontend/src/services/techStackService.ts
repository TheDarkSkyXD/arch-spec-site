/**
 * Service for tech stack compatibility API interactions.
 */
import apiClient from "../api/apiClient";
import {
  TechStackData,
} from "../types/techStack";

// Define the API base URL to be consistent with other services
const API_BASE_URL = "/api";

/**
 * Tech Stack API service for compatibility checks and options.
 */
export const techStackService = {
  /**
   * Get all available technology options.
   *
   * @returns All technology options
   */
  async getAllTechnology(): Promise<TechStackData> {
    try {
      const response = await apiClient.get<TechStackData>(
        `${API_BASE_URL}/tech-stack`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting all technology:", error);
      throw error;
    }
  },
};
