/**
 * Service for interacting with AI endpoints.
 */
import apiClient from "../api/apiClient";

interface EnhanceDescriptionRequest {
  user_description: string;
}

interface EnhanceDescriptionResponse {
  enhanced_description: string;
}

interface EnhanceBusinessGoalsRequest {
  project_description: string;
  user_goals: string[];
}

interface EnhanceBusinessGoalsResponse {
  enhanced_goals: string[];
}

interface EnhanceTargetUsersRequest {
  project_description: string;
  target_users: string;
}

interface EnhanceTargetUsersResponse {
  enhanced_target_users: string;
}

class AIService {
  /**
   * Enhance a project description using AI.
   *
   * @param description The original project description
   * @returns The enhanced description or null if an error occurred
   */
  async enhanceDescription(description: string): Promise<string | null> {
    try {
      const response = await apiClient.post<EnhanceDescriptionResponse>(
        "/api/ai-text/enhance-description",
        { user_description: description } as EnhanceDescriptionRequest
      );

      return response.data.enhanced_description;
    } catch (error) {
      console.error("Error enhancing description:", error);
      return null;
    }
  }

  /**
   * Enhance business goals using AI.
   *
   * @param projectDescription The project description
   * @param businessGoals The original business goals
   * @returns The enhanced business goals or null if an error occurred
   */
  async enhanceBusinessGoals(
    projectDescription: string,
    businessGoals: string[]
  ): Promise<string[] | null> {
    try {
      const response = await apiClient.post<EnhanceBusinessGoalsResponse>(
        "/api/ai-text/enhance-business-goals",
        {
          project_description: projectDescription,
          user_goals: businessGoals,
        } as EnhanceBusinessGoalsRequest
      );

      return response.data.enhanced_goals;
    } catch (error) {
      console.error("Error enhancing business goals:", error);
      return null;
    }
  }

  /**
   * Enhance target users description using AI.
   *
   * @param projectDescription The project description
   * @param targetUsers The original target users description
   * @returns The enhanced target users description or null if an error occurred
   */
  async enhanceTargetUsers(
    projectDescription: string,
    targetUsers: string
  ): Promise<string | null> {
    try {
      const response = await apiClient.post<EnhanceTargetUsersResponse>(
        "/api/ai-text/enhance-target-users",
        {
          project_description: projectDescription,
          target_users: targetUsers,
        } as EnhanceTargetUsersRequest
      );

      return response.data.enhanced_target_users;
    } catch (error) {
      console.error("Error enhancing target users:", error);
      return null;
    }
  }
}

export const aiService = new AIService();
