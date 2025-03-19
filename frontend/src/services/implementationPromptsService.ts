/**
 * Service for implementation prompts API interactions.
 */
import apiClient from "../api/apiClient";
import {
  ImplementationPrompts,
  ImplementationPrompt,
  ImplementationPromptType,
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

// Interface for AI prompt generation request
interface GenerateImplementationPromptRequest {
  category: string;
  project_id: string;
  prompt_type?: ImplementationPromptType;
}

// Interface for AI prompt generation response
interface GenerateImplementationPromptResponse {
  prompts: {
    type: ImplementationPromptType;
    content: string;
  }[];
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

  /**
   * Get sample implementation prompts that can be imported into a project
   *
   * @returns Promise containing the sample implementation prompts
   */
  async getSampleImplementationPrompts(): Promise<ImplementationPrompts | null> {
    try {
      const response = await apiClient.get<{
        data: Record<string, ImplementationPrompt[]>;
      }>(`${API_BASE_URL}/implementation-prompts/sample`);

      if (!response.data) {
        console.error(
          "Invalid sample implementation prompts response:",
          response.data
        );
        return null;
      }

      return {
        data: response.data.data || {},
      };
    } catch (error) {
      console.error("Error fetching sample implementation prompts:", error);
      return null;
    }
  },

  /**
   * Generate implementation prompts for a specific category using AI
   *
   * @param projectId - Project ID
   * @param category - Category to generate prompts for
   * @param promptType - Optional specific prompt type to generate
   * @returns Promise containing the generated implementation prompts
   */
  async generateImplementationPrompts(
    projectId: string,
    category: string,
    promptType?: ImplementationPromptType
  ): Promise<ImplementationPrompt[] | null> {
    try {
      const payload: GenerateImplementationPromptRequest = {
        category,
        project_id: projectId,
        prompt_type: promptType,
      };

      const response =
        await apiClient.post<GenerateImplementationPromptResponse>(
          `${API_BASE_URL}/ai-text/generate-implementation-prompt`,
          payload
        );

      if (!response.data || !response.data.prompts) {
        console.error(
          "Invalid generated implementation prompts response:",
          response.data
        );
        return null;
      }

      // Convert the response to ImplementationPrompt array
      return response.data.prompts.map((prompt) => ({
        id: crypto.randomUUID(),
        type: prompt.type,
        content: prompt.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
    } catch (error) {
      console.error(
        `Error generating implementation prompts for category ${category}:`,
        error
      );
      return null;
    }
  },
};
