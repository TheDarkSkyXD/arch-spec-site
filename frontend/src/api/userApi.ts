import axios from 'axios';
import { SubscriptionPlan } from '../contexts/SubscriptionContext';
import { getAuthToken } from '../services/auth';

// Define API base URL
const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8000' // Development
  : import.meta.env.VITE_API_URL || 'https://api.archspec.dev'; // Use env variable with fallback

// Create axios instance with auth header
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // If no token is available, this might be an unauthorized request
        delete config.headers.Authorization;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
      // Remove any existing auth header if we can't get a new token
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already tried retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark this request as retried to prevent infinite loops
      originalRequest._retry = true;

      try {
        const newToken = await getAuthToken();
        if (newToken) {
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// User interfaces
export interface UserProfile {
  plan: SubscriptionPlan;
  subscription_id: string | null;
  ai_credits: number;
  ai_credits_used: number;
  ai_credits_remaining: number;
  _id: string;
  firebase_uid: string;
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
  plan?: 'free' | 'premium' | 'open_source';
  subscription_id?: string | null;
  ai_credits?: number;
  ai_credits_used?: number;
}

// User API functions
export const userApi = {
  // Get current user profile
  getCurrentUserProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get('/api/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userData: UserUpdateData): Promise<UserProfile> => {
    try {
      const response = await apiClient.put('/api/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Update user subscription
  updateUserSubscription: async (subscriptionData: {
    plan?: 'free' | 'premium' | 'open_source';
    subscription_id?: string | null;
    ai_credits?: number;
    ai_credits_used?: number;
  }): Promise<UserProfile> => {
    try {
      const response = await apiClient.put('/api/users/me/subscription', subscriptionData);
      return response.data;
    } catch (error) {
      console.error('Error updating user subscription:', error);
      throw error;
    }
  },

  // Update user settings
  updateUserSettings: async (settings: Record<string, unknown>): Promise<UserProfile> => {
    try {
      const response = await apiClient.put('/api/users/me/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  },
};
