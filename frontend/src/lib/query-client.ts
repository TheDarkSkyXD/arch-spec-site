import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

// Create axios instance specifically for TanStack Query with redirect handling
export const queryAxios = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:8000"
    : import.meta.env.VITE_API_URL || "https://api.archspec.dev",
});

// Add interceptor to ensure HTTPS in production
queryAxios.interceptors.response.use(
  (response) => {
    // If there's a redirect in the response, ensure it uses HTTPS in production
    if (!import.meta.env.DEV && response.request?.responseURL) {
      const redirectUrl = new URL(response.request.responseURL);
      if (redirectUrl.protocol === "http:") {
        redirectUrl.protocol = "https:";
        // Cancel the current request and retry with HTTPS
        return queryAxios(redirectUrl.toString());
      }
    }
    return response;
  },
  (error) => {
    // For network errors that might be related to mixed content
    if (error.message === "Network Error" && !import.meta.env.DEV) {
      // Check if the URL is HTTP and should be HTTPS
      if (error.config?.url && error.config.url.startsWith("http:")) {
        const secureUrl = error.config.url.replace("http:", "https:");
        // Retry the request with HTTPS
        return queryAxios({
          ...error.config,
          url: secureUrl,
        });
      }
    }
    return Promise.reject(error);
  }
);

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime in v3)
    },
  },
});
