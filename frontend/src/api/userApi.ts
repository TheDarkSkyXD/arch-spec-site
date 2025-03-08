import axios from 'axios';
import { getAuthToken } from '../services/auth';

// Define API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create axios instance with auth header
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User interfaces
export interface UserProfile {
  _id: string;
  email: string;
  display_name?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
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
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userData: UserUpdateData): Promise<UserProfile> => {
    try {
      const response = await apiClient.put('/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Update user settings
  updateUserSettings: async (settings: Record<string, unknown>): Promise<UserProfile> => {
    try {
      const response = await apiClient.put('/users/me/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  },
};
