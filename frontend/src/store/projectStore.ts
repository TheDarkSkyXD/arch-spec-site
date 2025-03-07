import { create } from "zustand";
import { Project, Specification } from "../types/project";
import { mockProjects } from "../data/mockData";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  currentSpecification: Specification | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: () => Promise<void>;
  createProject: (
    project: Omit<Project, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  selectProject: (id: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

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

  // In a real application, these would make API calls
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ projects: mockProjects, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch projects", isLoading: false });
    }
  },

  createProject: async (project) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newProject: Project = {
        ...project,
        id: Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      set((state) => ({
        projects: [...state.projects, newProject],
        currentProject: newProject,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to create project", isLoading: false });
    }
  },

  selectProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      const project = get().projects.find((p) => p.id === id) || null;
      set({ currentProject: project, isLoading: false });
    } catch (error) {
      set({ error: "Failed to select project", isLoading: false });
    }
  },

  updateProject: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id
            ? { ...p, ...data, updated_at: new Date().toISOString() }
            : p
        ),
        currentProject:
          state.currentProject?.id === id
            ? {
                ...state.currentProject,
                ...data,
                updated_at: new Date().toISOString(),
              }
            : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update project", isLoading: false });
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject:
          state.currentProject?.id === id ? null : state.currentProject,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete project", isLoading: false });
    }
  },

  fetchSpecification: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, this would fetch from an API
      const mockSpecification: Specification = {
        id: Math.random().toString(36).substring(2, 9),
        project_id: projectId,
        requirements: {
          project_type: "Web Application",
          functional_requirements: [
            "User authentication",
            "Expense tracking",
            "Income tracking",
            "Budget planning",
            "Reports and analytics",
          ],
          non_functional_requirements: [
            "Responsive design",
            "Fast loading times",
            "Secure data storage",
          ],
          tech_stack: {
            frontend: "React",
            backend: "Node.js",
            database: "PostgreSQL",
          },
        },
        architecture: {
          pattern: "MVC",
          components: ["Frontend", "Backend API", "Database"],
          data_flow: ["User -> Frontend -> API -> Database"],
          diagram: "graph TD\n  A[Frontend] --> B[API]\n  B --> C[Database]",
        },
        data_model: {
          entities: [
            {
              name: "User",
              attributes: [
                { name: "id", type: "UUID", constraints: ["primary_key"] },
                { name: "email", type: "string", constraints: ["unique"] },
                { name: "password", type: "string", constraints: [] },
              ],
              relationships: ["Has many Expenses", "Has many Incomes"],
            },
          ],
        },
        api_endpoints: [
          {
            path: "/api/auth/login",
            method: "POST",
            request_body: '{ "email": "string", "password": "string" }',
            response:
              '{ "token": "string", "user": { "id": "string", "email": "string" } }',
            description: "User login endpoint",
          },
        ],
        implementation: {
          file_structure: [
            "src/",
            "src/components/",
            "src/pages/",
            "src/api/",
            "src/utils/",
          ],
          key_components: [
            "Authentication",
            "Dashboard",
            "Expense Tracker",
            "Budget Planner",
          ],
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      set({ currentSpecification: mockSpecification, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch specification", isLoading: false });
    }
  },

  updateSpecification: async (projectId, data) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      set((state) => ({
        currentSpecification: state.currentSpecification
          ? {
              ...state.currentSpecification,
              ...data,
              updated_at: new Date().toISOString(),
            }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update specification", isLoading: false });
    }
  },

  generateArtifacts: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would trigger artifact generation on the backend
      set({ isLoading: false });
    } catch (error) {
      set({ error: "Failed to generate artifacts", isLoading: false });
    }
  },
}));
