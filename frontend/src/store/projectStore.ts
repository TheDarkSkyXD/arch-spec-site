import { create } from "zustand";
import {
  Project,
  Specification,
  ProjectCreate,
  ProjectUpdate as ProjectUpdateType,
  Requirement,
} from "../types/project";
import apiClient from "../api/apiClient";

// We're now using apiClient which has the base URL configured already
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  currentSpecification: Specification | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: () => Promise<void>;
  createProject: (project: ProjectCreate) => Promise<Project | null>;
  selectProject: (id: string) => Promise<void>;
  updateProject: (id: string, data: ProjectUpdateType) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Requirement actions
  addRequirement: (
    projectId: string,
    type: "functional" | "non-functional",
    requirement: Omit<Requirement, "id">
  ) => Promise<void>;
  updateRequirement: (
    projectId: string,
    type: "functional" | "non-functional",
    requirementId: string,
    data: Partial<Requirement>
  ) => Promise<void>;
  deleteRequirement: (
    projectId: string,
    type: "functional" | "non-functional",
    requirementId: string
  ) => Promise<void>;

  // Specification actions
  fetchSpecification: (projectId: string) => Promise<void>;
  updateSpecification: (
    projectId: string,
    data: Partial<Specification>
  ) => Promise<void>;
  generateArtifacts: (projectId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  currentSpecification: null,
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/api/projects`);
      set({ projects: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      set({ error: "Failed to fetch projects", isLoading: false });
    }
  },

  createProject: async (project) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post(`/api/projects`, project);
      const newProject = response.data;

      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false,
      }));

      return newProject;
    } catch (error) {
      console.error("Failed to create project:", error);
      set({ error: "Failed to create project", isLoading: false });
      return null;
    }
  },

  selectProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/api/projects/${id}`);
      set({ currentProject: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to select project:", error);
      set({ error: "Failed to select project", isLoading: false });
    }
  },

  updateProject: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.put(`/api/projects/${id}`, data);
      const updatedProject = response.data;

      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
        currentProject:
          state.currentProject?.id === id
            ? updatedProject
            : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to update project:", error);
      set({ error: "Failed to update project", isLoading: false });
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/api/projects/${id}`);

      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject:
          state.currentProject?.id === id ? null : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to delete project:", error);
      set({ error: "Failed to delete project", isLoading: false });
    }
  },

  addRequirement: async (projectId, type, requirement) => {
    set({ isLoading: true, error: null });
    try {
      const currentProject = get().currentProject;
      if (!currentProject) throw new Error("No project selected");

      // Create a new requirement with a temporary ID
      // The backend will assign a proper ID when saving
      const newRequirement: Requirement = {
        ...requirement,
        id: `temp-${Date.now()}`, // This will be replaced by the backend
        tags: requirement.tags || [],
        priority: requirement.priority || "medium",
        status: requirement.status || "proposed",
      };

      // Determine which requirements list to update
      const field = type === "functional" ? "functional" : "non_functional";
      const requirements = [...(currentProject[field] || []), newRequirement];

      // Update the project
      await get().updateProject(projectId, {
        [field]: requirements,
      } as any);
    } catch (error) {
      console.error(`Failed to add ${type} requirement:`, error);
      set({ error: `Failed to add requirement`, isLoading: false });
    }
  },

  updateRequirement: async (projectId, type, requirementId, data) => {
    set({ isLoading: true, error: null });
    try {
      const currentProject = get().currentProject;
      if (!currentProject) throw new Error("No project selected");

      // Determine which requirements list to update
      const field = type === "functional" ? "functional" : "non_functional";
      const requirements = currentProject[field] || [];

      // Update the specific requirement
      const updatedRequirements = requirements.map((req) =>
        req.id === requirementId ? { ...req, ...data } : req
      );

      // Update the project
      await get().updateProject(projectId, {
        [field]: updatedRequirements,
      } as any);
    } catch (error) {
      console.error(`Failed to update ${type} requirement:`, error);
      set({ error: `Failed to update requirement`, isLoading: false });
    }
  },

  deleteRequirement: async (projectId, type, requirementId) => {
    set({ isLoading: true, error: null });
    try {
      const currentProject = get().currentProject;
      if (!currentProject) throw new Error("No project selected");

      // Determine which requirements list to update
      const field = type === "functional" ? "functional" : "non_functional";
      const requirements = currentProject[field] || [];

      // Filter out the requirement to delete
      const updatedRequirements = requirements.filter(
        (req) => req.id !== requirementId
      );

      // Update the project
      await get().updateProject(projectId, {
        [field]: updatedRequirements,
      } as any);
    } catch (error) {
      console.error(`Failed to delete ${type} requirement:`, error);
      set({ error: `Failed to delete requirement`, isLoading: false });
    }
  },

  fetchSpecification: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(
        `/api/projects/${projectId}/specification`
      );
      set({ currentSpecification: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch specification:", error);
      set({ error: "Failed to fetch specification", isLoading: false });
    }
  },

  updateSpecification: async (projectId, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.put(
        `/api/projects/${projectId}/specification`,
        data
      );

      set({ currentSpecification: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to update specification:", error);
      set({ error: "Failed to update specification", isLoading: false });
    }
  },

  generateArtifacts: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post(`/api/projects/${projectId}/generate-artifacts`);
      set({ isLoading: false });
    } catch (error) {
      console.error("Failed to generate artifacts:", error);
      set({ error: "Failed to generate artifacts", isLoading: false });
    }
  },
}));
