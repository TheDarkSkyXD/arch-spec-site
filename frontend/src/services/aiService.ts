/**
 * Service for interacting with AI endpoints.
 */
import apiClient from "../api/apiClient";
import { FeatureModule } from "./featuresService";
import { DataModel } from "../types/templates";
import { GherkinTestCase } from "./testCasesService";

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

interface EnhanceRequirementsRequest {
  project_description: string;
  business_goals: string[];
  user_requirements: string[];
}

interface EnhanceRequirementsResponse {
  enhanced_requirements: string[];
}

interface FeaturesData {
  coreModules: FeatureModule[];
  optionalModules?: FeatureModule[];
}

interface EnhanceFeaturesRequest {
  project_description: string;
  business_goals: string[];
  requirements: string[];
  user_features?: FeatureModule[];
}

interface EnhanceFeaturesResponse {
  data: FeaturesData;
}

export interface PageComponent {
  name: string;
  path: string;
  components: string[];
  enabled: boolean;
}

export interface PagesData {
  public: PageComponent[];
  authenticated: PageComponent[];
  admin: PageComponent[];
}

interface EnhancePagesRequest {
  project_description: string;
  features: FeatureModule[];
  requirements: string[];
  existing_pages?: PagesData;
}

interface EnhancePagesResponse {
  data: PagesData;
}

interface EnhanceDataModelRequest {
  project_description: string;
  business_goals: string[];
  features: FeatureModule[];
  requirements: string[];
  existing_data_model?: Partial<DataModel>;
}

interface EnhanceDataModelResponse {
  data: DataModel;
}

// New interfaces for API endpoints enhancement
export interface ApiEndpoint {
  path: string;
  description: string;
  methods: string[];
  auth: boolean;
  roles?: string[];
}

export interface ApiData {
  endpoints: ApiEndpoint[];
}

interface EnhanceApiEndpointsRequest {
  project_description: string;
  features: FeatureModule[];
  data_models: Record<string, unknown>;
  requirements: string[];
  existing_endpoints?: ApiData;
}

interface EnhanceApiEndpointsResponse {
  data: ApiData;
}

interface EnhanceTechStackRequest {
  project_description: string;
  project_requirements: string[];
  user_preferences: Record<string, unknown>;
}

interface TechStackRecommendation {
  frontend: {
    framework: string | null;
    language: string | null;
    stateManagement: string | null;
    uiLibrary: string | null;
    formHandling: string | null;
    routing: string | null;
    apiClient: string | null;
    metaFramework: string | null;
  };
  backend: {
    type: string | null;
    service: string | null;
    functions: string | null;
    realtime: string | null;
  };
  database: {
    type: string | null;
    system: string | null;
    hosting: string | null;
    orm: string | null;
  };
  authentication: {
    provider: string | null;
    methods: string[];
  };
  hosting: {
    frontend: string | null;
    backend: string | null;
    database: string | null;
  };
  storage: {
    type: string | null;
    service: string | null;
  };
  deployment: {
    ci_cd: string | null;
    containerization: string | null;
  };
  overallJustification: string;
}

interface EnhanceTechStackResponse {
  data: TechStackRecommendation;
}

interface TestCasesData {
  testCases: GherkinTestCase[];
}

interface TestCasesEnhanceRequest {
  project_description: string;
  requirements: string[];
  features: FeatureModule[];
  existing_test_cases?: GherkinTestCase[];
}

interface TestCasesEnhanceResponse {
  data: TestCasesData;
}

interface EnhanceTestCasesRequest {
  existing_test_cases: GherkinTestCase[];
  requirements: string[];
  features: FeatureModule[];
}

interface EnhanceTestCasesResponse {
  testCases: GherkinTestCase[];
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

  /**
   * Enhance project requirements using AI.
   *
   * @param projectDescription The project description
   * @param businessGoals The business goals
   * @param requirements The original requirements
   * @returns The enhanced requirements or null if an error occurred
   */
  async enhanceRequirements(
    projectDescription: string,
    businessGoals: string[],
    requirements: string[]
  ): Promise<string[] | null> {
    try {
      const response = await apiClient.post<EnhanceRequirementsResponse>(
        "/api/ai-text/enhance-requirements",
        {
          project_description: projectDescription,
          business_goals: businessGoals,
          user_requirements: requirements,
        } as EnhanceRequirementsRequest
      );

      return response.data.enhanced_requirements;
    } catch (error) {
      console.error("Error enhancing requirements:", error);
      return null;
    }
  }

  /**
   * Enhance project features using AI.
   *
   * @param projectDescription The project description
   * @param businessGoals The business goals
   * @param requirements The project requirements
   * @param userFeatures The original features (optional)
   * @returns The enhanced features data or null if an error occurred
   */
  async enhanceFeatures(
    projectDescription: string,
    businessGoals: string[],
    requirements: string[],
    userFeatures?: FeatureModule[]
  ): Promise<FeaturesData | null> {
    try {
      const response = await apiClient.post<EnhanceFeaturesResponse>(
        "/api/ai-text/enhance-features",
        {
          project_description: projectDescription,
          business_goals: businessGoals,
          requirements: requirements,
          user_features: userFeatures,
        } as EnhanceFeaturesRequest
      );

      return response.data.data;
    } catch (error) {
      console.error("Error enhancing features:", error);
      return null;
    }
  }

  /**
   * Enhance API endpoints using AI.
   *
   * @param projectDescription The project description
   * @param features The project features
   * @param dataModels The data models
   * @param requirements The project requirements
   * @param existingEndpoints The original endpoints (optional)
   * @returns The enhanced API endpoints or null if an error occurred
   */
  async enhanceApiEndpoints(
    projectDescription: string,
    features: FeatureModule[],
    dataModels: Record<string, unknown>,
    requirements: string[],
    existingEndpoints?: ApiData
  ): Promise<ApiData | null> {
    try {
      const response = await apiClient.post<EnhanceApiEndpointsResponse>(
        "/api/ai-text/enhance-api-endpoints",
        {
          project_description: projectDescription,
          features: features,
          data_models: dataModels,
          requirements: requirements,
          existing_endpoints: existingEndpoints,
        } as EnhanceApiEndpointsRequest
      );

      return response.data.data;
    } catch (error) {
      console.error("Error enhancing API endpoints:", error);
      return null;
    }
  }

  /**
   * Enhance project pages/screens using AI.
   *
   * @param projectDescription The project description
   * @param features The project features
   * @param requirements The project requirements
   * @param existingPages The original pages (optional)
   * @returns The enhanced pages data or null if an error occurred
   */
  async enhancePages(
    projectDescription: string,
    features: FeatureModule[],
    requirements: string[],
    existingPages?: PagesData
  ): Promise<PagesData | null> {
    try {
      const response = await apiClient.post<EnhancePagesResponse>(
        "/api/ai-text/enhance-pages",
        {
          project_description: projectDescription,
          features: features,
          requirements: requirements,
          existing_pages: existingPages,
        } as EnhancePagesRequest
      );

      return response.data.data;
    } catch (error) {
      console.error("Error enhancing pages:", error);
      return null;
    }
  }

  /**
   * Enhance data model using AI.
   *
   * @param projectDescription The project description
   * @param businessGoals The business goals
   * @param features The project features
   * @param requirements The project requirements
   * @param existingDataModel The original data model (optional)
   * @returns The enhanced data model or null if an error occurred
   */
  async enhanceDataModel(
    projectDescription: string,
    businessGoals: string[],
    features: FeatureModule[],
    requirements: string[],
    existingDataModel?: Partial<DataModel>
  ): Promise<DataModel | null> {
    try {
      const response = await apiClient.post<EnhanceDataModelResponse>(
        "/api/ai-text/enhance-data-model",
        {
          project_description: projectDescription,
          business_goals: businessGoals,
          features: features,
          requirements: requirements,
          existing_data_model: existingDataModel,
        } as EnhanceDataModelRequest
      );

      return response.data.data;
    } catch (error) {
      console.error("Error enhancing data model:", error);
      return null;
    }
  }

  /**
   * Enhance technology stack recommendations using AI.
   *
   * @param projectDescription The project description
   * @param projectRequirements The project requirements
   * @param userPreferences The user's existing tech preferences (optional)
   * @returns The enhanced tech stack recommendations or null if an error occurred
   */
  async enhanceTechStack(
    projectDescription: string,
    projectRequirements: string[],
    userPreferences?: Record<string, unknown>
  ): Promise<TechStackRecommendation | null> {
    try {
      const response = await apiClient.post<EnhanceTechStackResponse>(
        "/api/ai-text/enhance-tech-stack",
        {
          project_description: projectDescription,
          project_requirements: projectRequirements,
          user_preferences: userPreferences || {},
        } as EnhanceTechStackRequest
      );

      return response.data.data;
    } catch (error) {
      console.error("Error enhancing tech stack:", error);
      return null;
    }
  }

  async generateTestCases(
    projectDescription: string,
    requirements: string[],
    features: FeatureModule[]
  ): Promise<TestCasesData | null> {
    try {
      const response = await apiClient.post<TestCasesEnhanceResponse>(
        "/api/ai-text/generate-test-cases",
        {
          project_description: projectDescription,
          requirements,
          features,
        } as TestCasesEnhanceRequest
      );

      if (response.data && response.data.data && response.data.data.testCases) {
        return {
          testCases: response.data.data.testCases,
        };
      }
      return null;
    } catch (error) {
      console.error("Error generating test cases:", error);
      return null;
    }
  }

  async enhanceTestCases(
    projectDescription: string,
    existingTestCases: GherkinTestCase[],
    requirements: string[],
    features: FeatureModule[]
  ): Promise<TestCasesData | null> {
    try {
      const response = await apiClient.post<TestCasesEnhanceResponse>(
        "/api/ai-text/enhance-test-cases",
        {
          project_description: projectDescription,
          existing_test_cases: existingTestCases,
          requirements,
          features,
        } as TestCasesEnhanceRequest
      );

      if (response.data && response.data.data && response.data.data.testCases) {
        return {
          testCases: response.data.data.testCases,
        };
      }
      return null;
    } catch (error) {
      console.error("Error enhancing test cases:", error);
      return null;
    }
  }
}

export const aiService = new AIService();
