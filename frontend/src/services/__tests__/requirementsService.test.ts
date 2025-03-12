import { beforeEach, describe, expect, it, vi } from "vitest";
import { requirementsService } from "../requirementsService";
import apiClient from "../../api/apiClient";

// Mock the API client
vi.mock("../../api/apiClient", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe("requirementsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRequirements", () => {
    it("should fetch requirements successfully", async () => {
      // Mock successful API response
      const mockResponseData = {
        id: "req-123",
        project_id: "project-123",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        version: 1,
        functional: ["User authentication", "Dashboard view"],
        non_functional: ["Performance", "Security"],
      };

      (apiClient.get as any).mockResolvedValueOnce({
        data: mockResponseData,
      });

      const result = await requirementsService.getRequirements("project-123");

      expect(apiClient.get).toHaveBeenCalledWith(
        "/api/project-sections/project-123/requirements"
      );
      expect(result).toEqual({
        functional: ["User authentication", "Dashboard view"],
        non_functional: ["Performance", "Security"],
      });
    });

    it("should handle API errors gracefully", async () => {
      // Mock API error
      (apiClient.get as any).mockRejectedValueOnce(new Error("API error"));

      const result = await requirementsService.getRequirements("project-123");

      expect(apiClient.get).toHaveBeenCalledWith(
        "/api/project-sections/project-123/requirements"
      );
      expect(result).toBeNull();
    });

    it("should handle empty response data", async () => {
      // Mock empty response
      (apiClient.get as any).mockResolvedValueOnce({
        data: null,
      });

      const result = await requirementsService.getRequirements("project-123");

      expect(apiClient.get).toHaveBeenCalledWith(
        "/api/project-sections/project-123/requirements"
      );
      expect(result).toBeNull();
    });
  });

  describe("saveRequirements", () => {
    it("should save requirements successfully", async () => {
      // Mock successful API response
      const mockResponseData = {
        id: "req-123",
        project_id: "project-123",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        version: 1,
        functional: ["User authentication", "Dashboard view"],
        non_functional: ["Performance", "Security"],
      };

      (apiClient.put as any).mockResolvedValueOnce({
        data: mockResponseData,
      });

      const requirementsData = {
        functional: ["User authentication", "Dashboard view"],
        non_functional: ["Performance", "Security"],
      };

      const result = await requirementsService.saveRequirements(
        "project-123",
        requirementsData
      );

      expect(apiClient.put).toHaveBeenCalledWith(
        "/api/project-sections/project-123/requirements",
        {
          functional: ["User authentication", "Dashboard view"],
          non_functional: ["Performance", "Security"],
        }
      );

      expect(result).toEqual({
        functional: ["User authentication", "Dashboard view"],
        non_functional: ["Performance", "Security"],
      });
    });

    it("should handle API errors gracefully", async () => {
      // Mock API error
      (apiClient.put as any).mockRejectedValueOnce(new Error("API error"));

      const requirementsData = {
        functional: ["User authentication"],
        non_functional: ["Performance"],
      };

      const result = await requirementsService.saveRequirements(
        "project-123",
        requirementsData
      );

      expect(apiClient.put).toHaveBeenCalledWith(
        "/api/project-sections/project-123/requirements",
        {
          functional: ["User authentication"],
          non_functional: ["Performance"],
        }
      );

      expect(result).toBeNull();
    });

    it("should handle empty response data", async () => {
      // Mock empty response
      (apiClient.put as any).mockResolvedValueOnce({
        data: null,
      });

      const requirementsData = {
        functional: ["User authentication"],
        non_functional: ["Performance"],
      };

      const result = await requirementsService.saveRequirements(
        "project-123",
        requirementsData
      );

      expect(apiClient.put).toHaveBeenCalledWith(
        "/api/project-sections/project-123/requirements",
        {
          functional: ["User authentication"],
          non_functional: ["Performance"],
        }
      );

      expect(result).toBeNull();
    });
  });
});
