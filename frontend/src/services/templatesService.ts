/**
 * Service for interacting with project templates API.
 */
import apiClient from "../api/apiClient";
import { ProjectTemplate } from "../types";

// Define interface for API response structure
interface TemplateResponse {
  id: string;
  template: ProjectTemplate;
}

interface TemplatesListResponse {
  templates: TemplateResponse[];
}

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
      const response = await apiClient.get<TemplatesListResponse>(
        `/api/templates`
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
        .map((item) => {
          // Include the id from the API response in the template object
          return {
            ...item.template,
            id: item.id,
          };
        })
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
      const response = await apiClient.get<TemplateResponse>(
        `/api/templates/${id}`
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

      // Include the id from the API response in the template object
      return {
        ...response.data.template,
        id: response.data.id,
      };
    } catch (error) {
      console.error(`Error fetching template ${id}:`, error);
      return null;
    }
  },

  /**
   * Update a project template by ID.
   *
   * @param id - Template ID
   * @param templateData - Updated template data
   * @returns Promise containing the updated project template
   */
  async updateTemplate(
    id: string,
    templateData: Partial<ProjectTemplate>
  ): Promise<ProjectTemplate | null> {
    try {
      const response = await apiClient.put<TemplateResponse>(
        `/api/templates/${id}`,
        templateData
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

      return {
        ...response.data.template,
        id: response.data.id,
      };
    } catch (error) {
      console.error(`Error updating template ${id}:`, error);
      return null;
    }
  },
};
