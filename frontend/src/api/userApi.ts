import axios from "axios";
import { getAuthToken } from "../services/auth";

// Define API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create axios instance with auth header
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add development bypass header if in development mode
    if (import.meta.env.DEV) {
      config.headers["X-Dev-Bypass"] = "true";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Mock data for fallback in development
const mockUserProfile: UserProfile = {
  _id: "mock-user-id",
  firebase_uid: "mock-firebase-uid",
  email: "user@example.com",
  display_name: "Example User",
  photo_url: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_login: new Date().toISOString(),
  is_active: true,
  settings: {
    theme: "system",
    notifications: true,
    emailUpdates: false,
  },
};

// User interfaces
export interface UserProfile {
  _id: string;
  firebase_uid?: string;
  email: string;
  display_name?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active?: boolean;
  settings: Record<string, unknown>;
}

export interface UserUpdateData {
  display_name?: string;
  photo_url?: string;
  settings?: Record<string, unknown>;
}

// User API functions
export const userApi = {
  // Get current user profile
  getCurrentUser: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get("/api/users/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);

      // In development mode, return mock data as fallback
      if (import.meta.env.DEV) {
        console.warn("Using mock user profile in development mode");
        return mockUserProfile;
      }

      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userData: UserUpdateData): Promise<UserProfile> => {
    try {
      const response = await apiClient.put("/api/users/me", userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);

      // In development mode, return mock data with updates as fallback
      if (import.meta.env.DEV) {
        console.warn("Using mock user profile update in development mode");
        const updatedProfile = {
          ...mockUserProfile,
          ...userData,
          updated_at: new Date().toISOString(),
        };
        return updatedProfile;
      }

      throw error;
    }
  },

  // Update user settings
  updateUserSettings: async (
    settings: Record<string, unknown>
  ): Promise<UserProfile> => {
    try {
      const response = await apiClient.put("/api/users/me/settings", settings);
      return response.data;
    } catch (error) {
      console.error("Error updating user settings:", error);

      // In development mode, return mock data with settings as fallback
      if (import.meta.env.DEV) {
        console.warn("Using mock user settings update in development mode");
        const updatedProfile = {
          ...mockUserProfile,
          settings,
          updated_at: new Date().toISOString(),
        };
        return updatedProfile;
      }

      throw error;
    }
  },
};
