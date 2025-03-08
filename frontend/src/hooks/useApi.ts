import { useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface ApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  initialData?: T | null;
}

export function useApi<T>(endpoint: string, options: ApiOptions<T> = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: options.initialData || null,
    isLoading: false,
    error: null,
  });

  const makeRequest = async <R = T>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    url: string = endpoint,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R | null> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      let response: AxiosResponse<R>;

      switch (method) {
        case "GET":
          response = await axios.get<R>(`${API_URL}${url}`, config);
          break;
        case "POST":
          response = await axios.post<R>(`${API_URL}${url}`, data, config);
          break;
        case "PUT":
          response = await axios.put<R>(`${API_URL}${url}`, data, config);
          break;
        case "DELETE":
          response = await axios.delete<R>(`${API_URL}${url}`, config);
          break;
        case "PATCH":
          response = await axios.patch<R>(`${API_URL}${url}`, data, config);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setState((prev) => ({
        ...prev,
        data: response.data as any,
        isLoading: false,
      }));
      options.onSuccess?.(response.data as any);

      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";

      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
      options.onError?.(errorMessage);

      console.error(`API Error (${method} ${url}):`, error);
      return null;
    }
  };

  return {
    ...state,
    get: <R = T>(url?: string, config?: AxiosRequestConfig) =>
      makeRequest<R>("GET", url, undefined, config),
    post: <R = T>(data?: any, url?: string, config?: AxiosRequestConfig) =>
      makeRequest<R>("POST", url, data, config),
    put: <R = T>(data?: any, url?: string, config?: AxiosRequestConfig) =>
      makeRequest<R>("PUT", url, data, config),
    patch: <R = T>(data?: any, url?: string, config?: AxiosRequestConfig) =>
      makeRequest<R>("PATCH", url, data, config),
    delete: <R = T>(url?: string, config?: AxiosRequestConfig) =>
      makeRequest<R>("DELETE", url, undefined, config),
    reset: () => setState({ data: null, isLoading: false, error: null }),
  };
}
