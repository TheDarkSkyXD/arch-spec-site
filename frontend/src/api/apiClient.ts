import axios from "axios";
import { getAuthToken } from "../services/auth";

// Define API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

export default apiClient;
