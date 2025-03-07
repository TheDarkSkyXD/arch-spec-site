/**
 * Service for tech stack compatibility API interactions.
 */
import axios from "axios";
import {
  TechStackSelection,
  CompatibilityResult,
  CompatibleOptionsRequest,
  CompatibleOptionsResponse,
  TechStackData,
} from "../types/techStack";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
      const response = await axios.post<CompatibilityResult>(
        `${API_URL}/api/tech-stack/compatibility/check`,
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
      const response = await axios.post<CompatibleOptionsResponse>(
        `${API_URL}/api/tech-stack/compatibility/options`,
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
      const response = await axios.get<TechStackData>(
        `${API_URL}/api/tech-stack/options`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting all technology options:", error);
      throw error;
    }
  },
};
