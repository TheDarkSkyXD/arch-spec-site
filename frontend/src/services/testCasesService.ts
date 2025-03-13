/**
 * Service for test cases API interactions.
 */
import apiClient from "../api/apiClient";

// Define Gherkin test case interface
export interface GherkinTestCase {
  feature: string;
  title: string;
  description?: string;
  tags?: string[];
  scenarios: Array<{
    name: string;
    steps: Array<{
      type: "given" | "when" | "then" | "and" | "but";
      text: string;
    }>;
  }>;
}

// Data structure for test cases
export interface TestCasesData {
  testCases: GherkinTestCase[];
}

// Interface to match the backend response format
interface TestCasesSpec {
  id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  version: number;
  last_modified_by?: string;
  data: {
    testCases: GherkinTestCase[];
  };
}

// Define the API base URL to be consistent with other services
const API_BASE_URL = "/api";

export const testCasesService = {
  /**
   * Get test cases for a project
   *
   * @param projectId - Project ID
   * @returns Promise containing the project test cases
   */
  async getTestCases(projectId: string): Promise<TestCasesData | null> {
    try {
      const response = await apiClient.get<TestCasesSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/test-cases`
      );

      if (!response.data || !response.data.data) {
        console.error("Invalid test cases response:", response.data);
        return null;
      }

      return {
        testCases: response.data.data.testCases || [],
      };
    } catch (error) {
      console.error(
        `Error fetching test cases for project ${projectId}:`,
        error
      );
      return null;
    }
  },

  /**
   * Save test cases for a project
   *
   * @param projectId - Project ID
   * @param data - Test cases data
   * @returns Promise containing the updated test cases
   */
  async saveTestCases(
    projectId: string,
    data: TestCasesData
  ): Promise<TestCasesData | null> {
    try {
      const payload = {
        data: {
          testCases: data.testCases,
        },
      };

      const response = await apiClient.put<TestCasesSpec>(
        `${API_BASE_URL}/project-specs/${projectId}/test-cases`,
        payload
      );

      if (!response.data || !response.data.data) {
        console.error("Invalid test cases response:", response.data);
        return null;
      }

      return {
        testCases: response.data.data.testCases || [],
      };
    } catch (error) {
      console.error(`Error saving test cases for project ${projectId}:`, error);
      return null;
    }
  },
};
