/**
 * Service for interacting with projects API.
 */
import apiClient from "../api/apiClient";
import { ProjectBase } from "../types/project";

// Define interface for API response structure
interface ProjectResponse {
  id: string;
  name: string;
  description: string;
  business_goals: string;
  target_users: string;
  domain: string;
  version: string;
  created_at: string; // ISO format date string
  updated_at: string; // ISO format date string
  user_id: string;
}

/**
 * Check if a project has the minimum required structure
 */
const isValidProject = (project: unknown): boolean => {
  return (
    project !== null &&
    project !== undefined &&
    typeof project === "object" &&
    "id" in (project as object) &&
    "name" in (project as object) &&
    "description" in (project as object)
  );
};

/**
 * Convert API response to frontend ProjectBase format
 */
const convertToProjectBase = (response: ProjectResponse): ProjectBase => {
  return {
    id: response.id,
    name: response.name,
    description: response.description,
    version: response.version || "1.0.0",
    business_goals: response.business_goals
      ? response.business_goals.split(",").map((g) => g.trim())
      : [],
    target_users: response.target_users
      ? response.target_users.split(",").map((u) => u.trim())
      : [],
    domain: response.domain || "",
  };
};

/**
 * Projects API service.
 */
export const projectsService = {
  /**
   * Create a new project.
   *
   * @param projectData - Project data to create
   * @returns Promise containing the created project
   */
  async createProject(projectData: {
    name: string;
    description: string;
    business_goals?: string;
    target_users?: string;
    domain?: string;
  }): Promise<ProjectBase | null> {
    try {
      const response = await apiClient.post<ProjectResponse>(
        `/api/projects`,
        projectData
      );

      if (!response.data || !isValidProject(response.data)) {
        console.error(
          "Invalid project structure in API response:",
          response.data
        );
        return null;
      }

      return convertToProjectBase(response.data);
    } catch (error) {
      console.error("Error creating project:", error);
      return null;
    }
  },

  /**
   * Get all projects for the current user.
   *
   * @returns Promise containing list of projects
   */
  async getProjects(): Promise<ProjectBase[]> {
    try {
      const response = await apiClient.get<ProjectResponse[]>(`/api/projects`);

      if (!response.data || !Array.isArray(response.data)) {
        console.error("Invalid API response format:", response.data);
        return [];
      }

      // Convert projects from API format to frontend format
      return response.data
        .filter((project) => isValidProject(project))
        .map(convertToProjectBase);
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  },

  /**
   * Get a project by ID.
   *
   * @param id - Project ID
   * @returns Promise containing the project
   */
  async getProjectById(id: string): Promise<ProjectBase | null> {
    try {
      const response = await apiClient.get<ProjectResponse>(
        `/api/projects/${id}`
      );

      if (!response.data || !isValidProject(response.data)) {
        console.error(
          "Invalid project structure in API response:",
          response.data
        );
        return null;
      }

      return convertToProjectBase(response.data);
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      return null;
    }
  },

  /**
   * Update an existing project.
   *
   * @param id - Project ID
   * @param projectData - Updated project data
   * @returns Promise containing the updated project
   */
  async updateProject(
    id: string,
    projectData: {
      name: string;
      description: string;
      business_goals?: string;
      target_users?: string;
      domain?: string;
    }
  ): Promise<ProjectBase | null> {
    try {
      const response = await apiClient.put<ProjectResponse>(
        `/api/projects/${id}`,
        projectData
      );

      if (!response.data || !isValidProject(response.data)) {
        console.error(
          "Invalid project structure in API response:",
          response.data
        );
        return null;
      }

      return convertToProjectBase(response.data);
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      return null;
    }
  },
};
