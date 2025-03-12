import { beforeEach, describe, expect, it, vi } from "vitest";
import { featuresService } from "../featuresService";
import apiClient from "../../api/apiClient";

// Mock the API client
vi.mock("../../api/apiClient", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe("featuresService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFeatures", () => {
    it("should fetch features successfully", async () => {
      // Mock successful API response
      const mockResponseData = {
        id: "feat-123",
        project_id: "project-123",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        version: 1,
        data: {
          coreModules: [
            {
              name: "Authentication",
              description: "User registration and login",
              enabled: true,
              optional: false,
            },
            {
              name: "Payment Processing",
              description: "Process payments",
              enabled: true,
              optional: true,
              providers: ["Stripe"],
            },
          ],
        },
      };

      (apiClient.get as any).mockResolvedValueOnce({
        data: mockResponseData,
      });

      const result = await featuresService.getFeatures("project-123");

      expect(apiClient.get).toHaveBeenCalledWith(
        "/api/project-sections/project-123/features"
      );
      expect(result).toEqual({
        coreModules: [
          {
            name: "Authentication",
            description: "User registration and login",
            enabled: true,
            optional: false,
          },
          {
            name: "Payment Processing",
            description: "Process payments",
            enabled: true,
            optional: true,
            providers: ["Stripe"],
          },
        ],
        optional_modules: [],
      });
    });

    it("should handle API errors gracefully", async () => {
      // Mock API error
      (apiClient.get as any).mockRejectedValueOnce(new Error("API error"));

      const result = await featuresService.getFeatures("project-123");

      expect(apiClient.get).toHaveBeenCalledWith(
        "/api/project-sections/project-123/features"
      );
      expect(result).toBeNull();
    });

    it("should handle empty response data", async () => {
      // Mock empty response
      (apiClient.get as any).mockResolvedValueOnce({
        data: null,
      });

      const result = await featuresService.getFeatures("project-123");

      expect(apiClient.get).toHaveBeenCalledWith(
        "/api/project-sections/project-123/features"
      );
      expect(result).toBeNull();
    });
  });

  describe("saveFeatures", () => {
    it("should save features successfully", async () => {
      // Mock successful API response
      const mockResponseData = {
        id: "feat-123",
        project_id: "project-123",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        version: 1,
        data: {
          coreModules: [
            {
              name: "Authentication",
              description: "User registration and login",
              enabled: true,
              optional: false,
            },
          ],
        },
      };

      (apiClient.put as any).mockResolvedValueOnce({
        data: mockResponseData,
      });

      const featuresData = {
        coreModules: [
          {
            name: "Authentication",
            description: "User registration and login",
            enabled: true,
            optional: false,
          },
        ],
      };

      const result = await featuresService.saveFeatures(
        "project-123",
        featuresData
      );

      expect(apiClient.put).toHaveBeenCalledWith(
        "/api/project-sections/project-123/features",
        {
          data: {
            coreModules: [
              {
                name: "Authentication",
                description: "User registration and login",
                enabled: true,
                optional: false,
              },
            ],
            optionalModules: undefined,
          },
        }
      );

      expect(result).toEqual({
        coreModules: [
          {
            name: "Authentication",
            description: "User registration and login",
            enabled: true,
            optional: false,
          },
        ],
        optional_modules: [],
      });
    });

    it("should handle API errors gracefully", async () => {
      // Mock API error
      (apiClient.put as any).mockRejectedValueOnce(new Error("API error"));

      const featuresData = {
        coreModules: [
          {
            name: "Authentication",
            description: "User registration and login",
            enabled: true,
            optional: false,
          },
        ],
      };

      const result = await featuresService.saveFeatures(
        "project-123",
        featuresData
      );

      expect(apiClient.put).toHaveBeenCalledWith(
        "/api/project-sections/project-123/features",
        {
          data: {
            coreModules: [
              {
                name: "Authentication",
                description: "User registration and login",
                enabled: true,
                optional: false,
              },
            ],
            optionalModules: undefined,
          },
        }
      );

      expect(result).toBeNull();
    });

    it("should handle empty response data", async () => {
      // Mock empty response
      (apiClient.put as any).mockResolvedValueOnce({
        data: null,
      });

      const featuresData = {
        coreModules: [
          {
            name: "Authentication",
            description: "User registration and login",
            enabled: true,
            optional: false,
          },
        ],
      };

      const result = await featuresService.saveFeatures(
        "project-123",
        featuresData
      );

      expect(apiClient.put).toHaveBeenCalledWith(
        "/api/project-sections/project-123/features",
        {
          data: {
            coreModules: [
              {
                name: "Authentication",
                description: "User registration and login",
                enabled: true,
                optional: false,
              },
            ],
            optionalModules: undefined,
          },
        }
      );

      expect(result).toBeNull();
    });
  });
});
