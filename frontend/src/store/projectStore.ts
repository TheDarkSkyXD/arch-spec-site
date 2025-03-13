import { create } from "zustand";
import apiClient from "../api/apiClient";
import { ProjectBase } from "../types/project";

interface ProjectState {
  projects: ProjectBase[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: () => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
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

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/api/projects/${id}`);

      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to delete project:", error);
      set({ error: "Failed to delete project", isLoading: false });
    }
  },
}));
