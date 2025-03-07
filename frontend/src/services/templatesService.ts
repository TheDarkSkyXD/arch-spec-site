/**
 * Service for interacting with project templates API.
 */
import axios from "axios";
import { ProjectTemplate } from "../types";

// Define interface for API response structure
interface TemplateResponse {
  id: string;
  template: ProjectTemplate;
}

interface TemplatesListResponse {
  templates: TemplateResponse[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Check if a template has the minimum required structure
 */
const isValidTemplate = (template: unknown): boolean => {
  return (
    template !== null &&
    template !== undefined &&
    typeof template === "object" &&
    template !== null &&
    "name" in template &&
    "version" in template &&
    "description" in template &&
    "techStack" in template
  );
};

/**
 * Project templates API service.
 */
export const templatesService = {
  /**
   * Get all project templates.
   *
   * @returns Promise containing list of project templates
   */
  async getTemplates(): Promise<ProjectTemplate[]> {
    try {
      const response = await axios.get<TemplatesListResponse>(
        `${API_URL}/api/templates`
      );

      // Validate response structure
      if (
        !response.data ||
        !response.data.templates ||
        !Array.isArray(response.data.templates)
      ) {
        console.error("Invalid API response format:", response.data);
        return [];
      }

      // Map and validate templates
      return response.data.templates
        .filter((item) => item && item.template)
        .map((item) => item.template)
        .filter((template) => isValidTemplate(template));
    } catch (error) {
      console.error("Error fetching templates:", error);
      return [];
    }
  },

  /**
   * Get a project template by ID.
   *
   * @param id - Template ID
   * @returns Promise containing the project template
   */
  async getTemplateById(id: string): Promise<ProjectTemplate | null> {
    try {
      const response = await axios.get<TemplateResponse>(
        `${API_URL}/api/templates/${id}`
      );

      if (
        !response.data ||
        !response.data.template ||
        !isValidTemplate(response.data.template)
      ) {
        console.error(
          "Invalid template structure in API response:",
          response.data
        );
        return null;
      }

      return response.data.template;
    } catch (error) {
      console.error(`Error fetching template ${id}:`, error);
      return null;
    }
  },
};
