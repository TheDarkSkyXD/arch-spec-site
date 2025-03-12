/**
 * Service for tech stack compatibility API interactions.
 */
import apiClient from "../api/apiClient";
import { TechStackData } from "../types/techStack";
import { TechStackFormData } from "../components/forms/tech-stack/techStackSchema";
import { ProjectTechStack } from "../types/templates";

// Interface to match the backend response format
interface TechStackSpec {
  id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  version: number;
  last_modified_by?: string;
  data: ProjectTechStack;
}

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

  /**
   * Get tech stack for a project.
   *
   * @param projectId - Project ID
   * @returns Promise containing the project tech stack
   */
  async getTechStack(projectId: string): Promise<ProjectTechStack | null> {
    try {
      const response = await apiClient.get<TechStackSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/tech-stack`
      );

      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching tech stack for project ${projectId}:`,
        error
      );
      return null;
    }
  },

  /**
   * Create or update tech stack for a project.
   *
   * @param projectId - Project ID
   * @param techStackData - Tech stack form data
   * @returns Promise containing the updated tech stack
   */
  async saveTechStack(
    projectId: string,
    techStackData: TechStackFormData
  ): Promise<ProjectTechStack | null> {
    try {
      // Convert from form data to API structure
      const apiData = convertFormToApiFormat(techStackData);

      // Create the payload in the correct format for the backend
      // The backend expects a TechStackSpecUpdate object with data field
      const payload = {
        data: apiData,
      };

      // Because of how the routers are set up in the backend, the path is doubled
      const response = await apiClient.put<TechStackSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/tech-stack`,
        payload
      );

      if (!response.data || !response.data.data) {
        console.error("Invalid tech stack response:", response.data);
        return null;
      }

      return response.data.data;
    } catch (error) {
      console.error(`Error saving tech stack for project ${projectId}:`, error);
      return null;
    }
  },
};

/**
 * Convert form data to API format
 */
function convertFormToApiFormat(formData: TechStackFormData): ProjectTechStack {
  // Create the frontend spec
  const frontend = {
    framework: formData.frontend,
    language: formData.frontend_language,
    uiLibrary: formData.ui_library || undefined,
    stateManagement: formData.state_management || undefined,
  };

  // Create the backend spec based on type
  let backend;
  if (formData.backend_type === "framework") {
    backend = {
      type: "framework" as const,
      framework: formData.backend_framework || "",
      language: formData.backend_language || "",
      realtime: formData.backend_realtime || undefined,
    };
  } else if (formData.backend_type === "baas") {
    backend = {
      type: "baas" as const,
      service: formData.backend_service || "",
      functions: formData.backend_functions || undefined,
      realtime: formData.backend_realtime || undefined,
    };
  } else if (formData.backend_type === "serverless") {
    backend = {
      type: "serverless" as const,
      service: formData.backend_service || "",
      language: formData.backend_language || "",
    };
  } else {
    // Default to empty framework if no type selected
    backend = {
      type: "framework" as const,
      framework: "",
      language: "",
    };
  }

  // Create database spec
  const database = {
    type: (formData.database_type as "sql" | "nosql") || "sql",
    system: formData.database_system || "",
    hosting: formData.database_hosting || "",
    orm: formData.database_orm || undefined,
  };

  // Create authentication spec
  const authentication = {
    provider: formData.auth_provider || "",
    methods: formData.auth_methods ? [formData.auth_methods] : [],
  };

  // Create hosting spec
  const hosting = {
    frontend: formData.hosting_frontend || "",
    backend: formData.hosting_backend || "",
  };

  // Create storage spec if values provided
  const storage = formData.storage_service
    ? {
        type: formData.storage_type || "objectStorage",
        service: formData.storage_service,
      }
    : undefined;

  // Create deployment spec if values provided
  const deployment =
    formData.deployment_ci_cd || formData.deployment_containerization
      ? {
          ci_cd: formData.deployment_ci_cd || undefined,
          containerization: formData.deployment_containerization || undefined,
        }
      : undefined;

  return {
    frontend,
    backend,
    database,
    authentication,
    hosting,
    storage,
    deployment,
  };
}
