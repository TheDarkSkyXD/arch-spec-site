/**
 * Service for interacting with AI endpoints.
 */
import apiClient from "../api/apiClient";
import { FeatureModule } from "./featuresService";
import { DataModel, UIDesign } from "../types/templates";
import { GherkinTestCase } from "./testCasesService";

interface BaseRequest {
  project_description: string;
  additional_user_instruction?: string;
}

interface EnhanceDescriptionRequest extends BaseRequest {
  user_description: string;
}

interface EnhanceDescriptionResponse {
  enhanced_description: string;
}

interface EnhanceBusinessGoalsRequest extends BaseRequest {
  user_goals: string[];
}

interface EnhanceBusinessGoalsResponse {
  enhanced_goals: string[];
}

interface EnhanceTargetUsersRequest extends BaseRequest {
  target_users: string;
}

interface EnhanceTargetUsersResponse {
  enhanced_target_users: string;
}

interface EnhanceRequirementsRequest extends BaseRequest {
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

interface EnhanceFeaturesRequest extends BaseRequest {
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

interface EnhancePagesRequest extends BaseRequest {
  features: FeatureModule[];
  requirements: string[];
  existing_pages?: PagesData;
}

interface EnhancePagesResponse {
  data: PagesData;
}

interface EnhanceDataModelRequest extends BaseRequest {
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

interface EnhanceApiEndpointsRequest extends BaseRequest {
  features: FeatureModule[];
  data_models: Record<string, unknown>;
  requirements: string[];
  existing_endpoints?: ApiData;
}

interface EnhanceApiEndpointsResponse {
  data: ApiData;
}

interface EnhanceTechStackRequest extends BaseRequest {
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

interface TestCasesEnhanceRequest extends BaseRequest {
  requirements: string[];
  features: FeatureModule[];
  existing_test_cases?: GherkinTestCase[];
}

interface TestCasesEnhanceResponse {
  data: TestCasesData;
}

// Add new interfaces for README enhancement
interface EnhanceReadmeRequest extends BaseRequest {
  project_name: string;
  business_goals: string[];
  requirements: {
    functional: string[];
    non_functional: string[];
  };
  features: {
    coreModules: FeatureModule[];
    optionalModules?: FeatureModule[];
  };
  tech_stack: Record<string, unknown>;
}

interface EnhanceReadmeResponse {
  enhanced_readme: string;
}

interface EnhanceUIDesignRequest extends BaseRequest {
  features: FeatureModule[];
  requirements: string[];
  existing_ui_design?: UIDesign;
}

interface EnhanceUIDesignResponse {
  data: UIDesign;
}

class AIService {
  /**
   * Enhance a project description using AI.
   *
   * @param description The original project description
   * @param additionalInstructions Optional custom instructions for the AI
   * @returns The enhanced description or null if an error occurred
   */
  async enhanceDescription(
    description: string,
    additionalInstructions?: string
  ): Promise<string | null> {
    try {
      const response = await apiClient.post<EnhanceDescriptionResponse>(
        "/api/ai-text/enhance-description",
        {
          user_description: description,
          additional_user_instruction: additionalInstructions,
        } as EnhanceDescriptionRequest
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
   * @param additionalInstructions Optional custom instructions for the AI
   * @returns The enhanced business goals or null if an error occurred
   */
  async enhanceBusinessGoals(
    projectDescription: string,
    businessGoals: string[],
    additionalInstructions?: string
  ): Promise<string[] | null> {
    try {
      const response = await apiClient.post<EnhanceBusinessGoalsResponse>(
        "/api/ai-text/enhance-business-goals",
        {
          project_description: projectDescription,
          user_goals: businessGoals,
          additional_user_instruction: additionalInstructions,
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
   * @param additionalInstructions Optional custom instructions for the AI
   * @returns The enhanced target users description or null if an error occurred
   */
  async enhanceTargetUsers(
    projectDescription: string,
    targetUsers: string,
    additionalInstructions?: string
  ): Promise<string | null> {
    try {
      const response = await apiClient.post<EnhanceTargetUsersResponse>(
        "/api/ai-text/enhance-target-users",
        {
          project_description: projectDescription,
          target_users: targetUsers,
          additional_user_instruction: additionalInstructions,
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
   * @param additionalInstructions Optional custom instructions for the AI
   * @returns The enhanced requirements or null if an error occurred
   */
  async enhanceRequirements(
    projectDescription: string,
    businessGoals: string[],
    requirements: string[],
    additionalInstructions?: string
  ): Promise<string[] | null> {
    try {
      const response = await apiClient.post<EnhanceRequirementsResponse>(
        "/api/ai-text/enhance-requirements",
        {
          project_description: projectDescription,
          business_goals: businessGoals,
          user_requirements: requirements,
          additional_user_instruction: additionalInstructions,
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
   * @param additionalInstructions Optional custom instructions for the AI
   * @returns The enhanced features data or null if an error occurred
   */
  async enhanceFeatures(
    projectDescription: string,
    businessGoals: string[],
    requirements: string[],
    userFeatures?: FeatureModule[],
    additionalInstructions?: string
  ): Promise<FeaturesData | null> {
    try {
      const response = await apiClient.post<EnhanceFeaturesResponse>(
        "/api/ai-text/enhance-features",
        {
          project_description: projectDescription,
          business_goals: businessGoals,
          requirements: requirements,
          user_features: userFeatures,
          additional_user_instruction: additionalInstructions,
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
   * @param additionalInstructions Optional custom instructions for the AI
   * @returns The enhanced API endpoints or null if an error occurred
   */
  async enhanceApiEndpoints(
    projectDescription: string,
    features: FeatureModule[],
    dataModels: Record<string, unknown>,
    requirements: string[],
    existingEndpoints?: ApiData,
    additionalInstructions?: string
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
          additional_user_instruction: additionalInstructions,
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
   * @param additionalInstructions Optional custom instructions for the AI
   * @returns The enhanced pages data or null if an error occurred
   */
  async enhancePages(
    projectDescription: string,
    features: FeatureModule[],
    requirements: string[],
    existingPages?: PagesData,
    additionalInstructions?: string
  ): Promise<PagesData | null> {
    try {
      const response = await apiClient.post<EnhancePagesResponse>(
        "/api/ai-text/enhance-pages",
        {
          project_description: projectDescription,
          features: features,
          requirements: requirements,
          existing_pages: existingPages,
          additional_user_instruction: additionalInstructions,
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
   * @param additionalInstructions Optional custom instructions for the AI
   * @returns The enhanced data model or null if an error occurred
   */
  async enhanceDataModel(
    projectDescription: string,
    businessGoals: string[],
    features: FeatureModule[],
    requirements: string[],
    existingDataModel?: Partial<DataModel>,
    additionalInstructions?: string
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
          additional_user_instruction: additionalInstructions,
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
   * @param additionalInstructions Optional custom instructions for the AI
   * @returns The enhanced tech stack recommendations or null if an error occurred
   */
  async enhanceTechStack(
    projectDescription: string,
    projectRequirements: string[],
    userPreferences?: Record<string, unknown>,
    additionalInstructions?: string
  ): Promise<TechStackRecommendation | null> {
    try {
      const response = await apiClient.post<EnhanceTechStackResponse>(
        "/api/ai-text/enhance-tech-stack",
        {
          project_description: projectDescription,
          project_requirements: projectRequirements,
          user_preferences: userPreferences || {},
          additional_user_instruction: additionalInstructions,
        } as EnhanceTechStackRequest
      );

      return response.data.data;
    } catch (error) {
      console.error("Error enhancing tech stack:", error);
      return null;
    }
  }

  /**
   * Generate test cases using AI.
   *
   * @param projectDescription The project description
   * @param requirements The project requirements
   * @param features The project features
   * @param additionalInstructions Optional custom instructions for the AI
   * @returns The generated test cases data or null if an error occurred
   */
  async generateTestCases(
    projectDescription: string,
    requirements: string[],
    features: FeatureModule[],
    additionalInstructions?: string
  ): Promise<TestCasesData | null> {
    try {
      const response = await apiClient.post<TestCasesEnhanceResponse>(
        "/api/ai-text/generate-test-cases",
        {
          project_description: projectDescription,
          requirements,
          features,
          additional_user_instruction: additionalInstructions,
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

  /**
   * Enhance existing test cases using AI.
   *
   * @param projectDescription The project description
   * @param existingTestCases Existing test cases to enhance
   * @param requirements The project requirements
   * @param features The project features
   * @param additionalInstructions Optional custom instructions for the AI
   * @returns The enhanced test cases data or null if an error occurred
   */
  async enhanceTestCases(
    projectDescription: string,
    existingTestCases: GherkinTestCase[],
    requirements: string[],
    features: FeatureModule[],
    additionalInstructions?: string
  ): Promise<TestCasesData | null> {
    try {
      const response = await apiClient.post<TestCasesEnhanceResponse>(
        "/api/ai-text/enhance-test-cases",
        {
          project_description: projectDescription,
          existing_test_cases: existingTestCases,
          requirements,
          features,
          additional_user_instruction: additionalInstructions,
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

  /**
   * Enhance README markdown content using AI.
   *
   * @param projectName The project name
   * @param projectDescription The project description
   * @param businessGoals The business goals
   * @param requirements The project requirements
   * @param features The project features
   * @param techStack The technology stack
   * @param additionalInstructions Optional custom instructions for the AI
   * @returns The enhanced README content or null if an error occurred
   */
  async enhanceReadme(
    projectName: string,
    projectDescription: string,
    businessGoals: string[],
    requirements: {
      functional: string[];
      non_functional: string[];
    },
    features: {
      coreModules: FeatureModule[];
      optionalModules?: FeatureModule[];
    },
    techStack: Record<string, unknown>,
    additionalInstructions?: string
  ): Promise<string | null> {
    try {
      const response = await apiClient.post<EnhanceReadmeResponse>(
        "/api/ai-text/enhance-readme",
        {
          project_name: projectName,
          project_description: projectDescription,
          business_goals: businessGoals,
          requirements: requirements,
          features: features,
          tech_stack: techStack,
          additional_user_instruction: additionalInstructions,
        } as EnhanceReadmeRequest
      );

      return response.data.enhanced_readme;
    } catch (error) {
      console.error("Error enhancing README:", error);
      return null;
    }
  }

  /**
   * Enhance UI design using AI.
   *
   * @param projectDescription The project description
   * @param features The project features
   * @param requirements The project requirements
   * @param existingUIDesign The original UI design (optional)
   * @param additionalInstructions Optional custom instructions for the AI
   * @returns The enhanced UI design or null if an error occurred
   */
  async enhanceUIDesign(
    projectDescription: string,
    features: FeatureModule[],
    requirements: string[],
    existingUIDesign?: UIDesign,
    additionalInstructions?: string
  ): Promise<UIDesign | null> {
    try {
      const response = await apiClient.post<EnhanceUIDesignResponse>(
        "/api/ai-text/enhance-ui-design",
        {
          project_description: projectDescription,
          features: features,
          requirements: requirements,
          existing_ui_design: existingUIDesign,
          additional_user_instruction: additionalInstructions,
        } as EnhanceUIDesignRequest
      );

      return response.data.data;
    } catch (error) {
      console.error("Error enhancing UI design:", error);
      return null;
    }
  }
}

export const aiService = new AIService();
