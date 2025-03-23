import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  BaaS,
  BackendFramework,
  Database,
  Hosting,
  ORM,
  Realtime,
  Serverless,
  StateManagement,
  Storage,
  TechStackData,
  Technology,
  UILibrary,
} from "../../types/techStack";
import { useTechStack } from "../../hooks/useDataQueries";
import { techStackService } from "../../services/techStackService";
// Import AI service for tech stack enhancement
import { aiService } from "../../services/aiService";

// Import shadcn UI components
import Button from "../ui/Button";
import Card from "../ui/Card";
// Import Lucide icons for AI enhancement buttons
import { Loader2, Sparkles, Lock } from "lucide-react";
import AIInstructionsModal from "../ui/AIInstructionsModal";

// Import schema
import {
  techStackSchema,
  TechStackFormData,
} from "./tech-stack/techStackSchema";

// Import section components
import FrontendSection from "./tech-stack/FrontendSection";
import BackendSection from "./tech-stack/BackendSection";
import DatabaseSection from "./tech-stack/DatabaseSection";
import AuthenticationSection from "./tech-stack/AuthenticationSection";
import HostingSection from "./tech-stack/HostingSection";
import StorageSection from "./tech-stack/StorageSection";
import DeploymentSection from "./tech-stack/DeploymentSection";
import { ProjectTechStack } from "../../types/templates";
import { useToast } from "../../contexts/ToastContext";
// Import services to fetch project info for AI enhancement
import { projectsService } from "../../services/projectsService";
import { requirementsService } from "../../services/requirementsService";
import { useSubscription } from "../../contexts/SubscriptionContext";
import { PremiumFeatureBadge, ProcessingOverlay } from "../ui/index";

interface TechStackFormProps {
  initialData?: ProjectTechStack;
  projectId?: string;
  onSuccess?: (techStackData: ProjectTechStack) => void;
}

const TechStackForm = ({
  initialData,
  projectId,
  onSuccess,
}: TechStackFormProps) => {
  const { showToast } = useToast();
  const { hasAIFeatures } = useSubscription();
  // State for options
  const [techStackOptions, setTechStackOptions] =
    useState<TechStackData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Add state for error and success messages
  const [error, setError] = useState<string>("");
  const [justification, setJustification] = useState<string>("");

  // Add state for AI enhancement
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [projectRequirements, setProjectRequirements] = useState<string[]>([]);

  // Add state for AI instructions modal
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);

  const defaultValues: TechStackFormData = {
    frontend: "",
    frontend_language: "",
    ui_library: "",
    state_management: "",
    backend_type: "",
    backend_framework: "",
    backend_language: "",
    backend_service: "",
    backend_realtime: "",
    database_type: "",
    database_system: "",
    database_hosting: "",
    database_orm: "",
    auth_provider: "",
    auth_methods: "",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue: setTechStackValue,
  } = useForm<TechStackFormData>({
    resolver: zodResolver(techStackSchema),
    defaultValues: defaultValues,
  });

  // Use the data query hook instead of direct service call
  const { data: techStackData, isLoading: isTechStackLoading } = useTechStack();

  // Update local state when data from hook is received
  useEffect(() => {
    if (techStackData) {
      setTechStackOptions(techStackData);
      setIsLoading(false);
    } else {
      setIsLoading(isTechStackLoading);
    }
  }, [techStackData, isTechStackLoading]);

  // Helper functions to get tech options from the updated TechStackData structure
  const getFrontendFrameworks = (): Technology[] => {
    // Get all frameworks and filter to only return frontend frameworks
    const frameworks = techStackOptions?.technologies?.frameworks || {};

    return (
      Object.entries(frameworks)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, framework]) => framework.type === "frontend")
        .map(([name, framework]) => ({
          ...framework,
          id: name,
        }))
        .sort((a, b) => a.id.localeCompare(b.id)) as Technology[]
    );
  };

  const getFrontendUILibraries = (): UILibrary[] => {
    // Get all UI libraries and filter to only return frontend UI libraries
    const uiLibraries = techStackOptions?.technologies?.uiLibraries || {};

    return Object.entries(uiLibraries)
      .map(([name, uiLibrary]) => ({
        ...uiLibrary,
        id: name,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)) as UILibrary[];
  };

  const getFrontendStateManagement = (): StateManagement[] => {
    // Get all state management and filter to only return frontend state management
    const stateManagement =
      techStackOptions?.technologies?.stateManagement || {};

    return Object.entries(stateManagement)
      .map(([name, stateManagement]) => ({
        ...stateManagement,
        id: name,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)) as StateManagement[];
  };

  const getBackendFrameworks = (): BackendFramework[] => {
    // Get all frameworks and filter to only return backend frameworks
    const frameworks = techStackOptions?.technologies?.frameworks || {};

    return (
      Object.entries(frameworks)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, framework]) => framework.type === "backend")
        .map(([name, framework]) => ({
          ...framework,
          id: name,
        }))
        .sort((a, b) => a.id.localeCompare(b.id)) as BackendFramework[]
    );
  };

  const getBackendBaaS = (): BaaS[] => {
    // Get all BaaS and filter to only return backend BaaS
    const baas = techStackOptions?.technologies?.baas || {};

    return Object.entries(baas)
      .map(([name, baas]) => ({
        ...baas,
        id: name,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)) as BaaS[];
  };

  const getBackendRealtime = (): Realtime[] => {
    // Get all realtime and filter to only return backend realtime
    const realtime = techStackOptions?.technologies?.realtime || {};

    return Object.entries(realtime)
      .map(([name, realtime]) => ({
        ...realtime,
        id: name,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)) as Realtime[];
  };

  const getBackendServerless = (): Serverless[] => {
    // Get all serverless options
    const serverless = techStackOptions?.technologies?.serverless || {};

    return Object.entries(serverless)
      .map(([name, service]) => ({
        ...service,
        id: name,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)) as Serverless[];
  };

  const getAllDatabases = (): Database[] => {
    // Get all databases
    const databases = techStackOptions?.technologies?.databases || {};

    return Object.entries(databases)
      .map(([name, database]) => ({
        ...database,
        id: name,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)) as Database[];
  };

  const getAllDatabaseHosting = (): Hosting[] => {
    // Get all database hosting
    const hosting = techStackOptions?.technologies?.hosting || {};

    return (
      Object.entries(hosting)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, hosting]) => hosting.type === "database")
        .map(([name, hosting]) => ({
          ...hosting,
          id: name,
        }))
        .sort((a, b) => a.id.localeCompare(b.id)) as Hosting[]
    );
  };

  const getAllOrms = (): ORM[] => {
    // Get all ORMs
    const orms = techStackOptions?.technologies?.orms || {};

    return Object.entries(orms)
      .map(([name, orm]) => ({
        ...orm,
        id: name,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)) as ORM[];
  };

  const getAuthProviders = (): string[] => {
    const auth = techStackOptions?.categories?.authentication?.providers || [];

    return auth.sort();
  };

  const getAuthMethods = (): string[] => {
    const auth = techStackOptions?.categories?.authentication?.methods || [];

    return auth.sort();
  };

  const getAllHostingFrontend = (): Hosting[] => {
    const hosting = techStackOptions?.technologies?.hosting || {};

    return Object.entries(hosting)
      .map(([name, hosting]) => ({
        ...hosting,
        id: name,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)) as Hosting[];
  };

  const getAllHostingBackend = (): Hosting[] => {
    const hosting = techStackOptions?.technologies?.hosting || {};

    return Object.entries(hosting)
      .map(([name, hosting]) => ({
        ...hosting,
        id: name,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)) as Hosting[];
  };

  const getAllStorageServices = (): Storage[] => {
    const storage = techStackOptions?.technologies?.storage || {};

    return Object.entries(storage)
      .map(([name, storage]) => ({
        ...storage,
        id: name,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)) as Storage[];
  };

  const getAllDeploymentContainerization = (): string[] => {
    const containerization =
      techStackOptions?.categories?.deployment?.containerization || [];

    return containerization.sort();
  };

  const getAllDeploymentCICD = (): string[] => {
    const ci_cd = techStackOptions?.categories?.deployment?.ci_cd || [];

    return ci_cd.sort();
  };

  // New function to fetch project info for AI enhancement
  const fetchProjectInfo = async () => {
    if (!projectId) return;

    try {
      // Fetch project details including description
      const projectDetails = await projectsService.getProjectById(projectId);

      if (projectDetails) {
        setProjectDescription(projectDetails.description || "");

        // Fetch requirements as well
        const requirementsData = await requirementsService.getRequirements(
          projectId
        );
        if (requirementsData) {
          // Combine functional and non-functional requirements
          const allRequirements = [
            ...(requirementsData.functional || []),
            ...(requirementsData.non_functional || []),
          ];
          setProjectRequirements(allRequirements);
        }
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  // Function to open the AI modal
  const openAIModal = () => {
    if (!projectId) {
      showToast({
        title: "Error",
        description: "Project must be saved before tech stack can be enhanced",
        type: "error",
      });
      return;
    }

    // Check if user has access to AI features
    if (!hasAIFeatures) {
      showToast({
        title: "Premium Feature",
        description:
          "AI enhancement is only available on Premium and Open Source plans. Please upgrade to use this feature.",
        type: "warning",
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: "Warning",
        description:
          "Project description is missing. Tech stack may not be properly enhanced.",
        type: "warning",
      });
    }

    if (projectRequirements.length === 0) {
      showToast({
        title: "Warning",
        description:
          "No requirements found. Tech stack will be based only on project description.",
        type: "warning",
      });
    }

    setIsAIModalOpen(true);
  };

  // New function to enhance tech stack using AI (replace existing settings)
  const enhanceTechStack = async (additionalInstructions?: string) => {
    setIsEnhancing(true);
    setJustification("");
    try {
      console.log("Enhancing tech stack with AI...");

      // Get current form values as user preferences
      const formValues = control._formValues;
      console.log("Current tech stack preferences:", formValues);

      const techStackRecommendations = await aiService.enhanceTechStack(
        projectDescription,
        projectRequirements,
        formValues,
        additionalInstructions
      );

      if (techStackRecommendations) {
        // Set form values based on AI recommendations
        if (techStackRecommendations.frontend) {
          if (techStackRecommendations.frontend.framework) {
            setTechStackValue(
              "frontend",
              techStackRecommendations.frontend.framework
            );
          }
          if (techStackRecommendations.frontend.language) {
            setTechStackValue(
              "frontend_language",
              techStackRecommendations.frontend.language
            );
          }
          if (techStackRecommendations.frontend.uiLibrary) {
            setTechStackValue(
              "ui_library",
              techStackRecommendations.frontend.uiLibrary
            );
          }
          if (techStackRecommendations.frontend.stateManagement) {
            setTechStackValue(
              "state_management",
              techStackRecommendations.frontend.stateManagement
            );
          }
        }

        if (techStackRecommendations.backend) {
          if (techStackRecommendations.backend.type) {
            // Convert the backend type to a valid value for the form
            const backendType =
              techStackRecommendations.backend.type === "traditional"
                ? "framework"
                : techStackRecommendations.backend.type;

            // Only set if it's a valid value
            if (["framework", "baas", "serverless"].includes(backendType)) {
              setTechStackValue(
                "backend_type",
                backendType as "framework" | "baas" | "serverless"
              );
            }
          }
          if (techStackRecommendations.backend.service) {
            setTechStackValue(
              "backend_service",
              techStackRecommendations.backend.service
            );
          }
          if (techStackRecommendations.backend.realtime) {
            setTechStackValue(
              "backend_realtime",
              techStackRecommendations.backend.realtime
            );
          }
        }

        if (techStackRecommendations.database) {
          if (techStackRecommendations.database.type) {
            setTechStackValue(
              "database_type",
              techStackRecommendations.database.type
            );
          }
          if (techStackRecommendations.database.system) {
            setTechStackValue(
              "database_system",
              techStackRecommendations.database.system
            );
          }
          if (techStackRecommendations.database.hosting) {
            setTechStackValue(
              "database_hosting",
              techStackRecommendations.database.hosting
            );
          }
          if (techStackRecommendations.database.orm) {
            setTechStackValue(
              "database_orm",
              techStackRecommendations.database.orm
            );
          }
        }

        if (techStackRecommendations.authentication) {
          if (techStackRecommendations.authentication.provider) {
            setTechStackValue(
              "auth_provider",
              techStackRecommendations.authentication.provider
            );
          }
          if (
            techStackRecommendations.authentication.methods &&
            techStackRecommendations.authentication.methods.length > 0
          ) {
            setTechStackValue(
              "auth_methods",
              techStackRecommendations.authentication.methods.join(",")
            );
          }
        }

        // Display success message with the overall justification
        const justification =
          techStackRecommendations.overallJustification ||
          "Tech stack enhanced successfully";
        showToast({
          title: "Success",
          description: "Tech stack enhanced successfully",
          type: "success",
        });

        // Set justification
        setJustification(justification);
      } else {
        showToast({
          title: "Warning",
          description: "No tech stack recommendations returned",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error enhancing tech stack:", error);
      showToast({
        title: "Error",
        description: "Failed to enhance tech stack",
        type: "error",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  // Add effect to fetch project info when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchProjectInfo();
    }
  }, [projectId]);

  // Helper function to check if any AI operation is in progress
  const isAnyEnhancementInProgress = () => {
    return isEnhancing;
  };

  // Helper to get the appropriate message for the overlay
  const getEnhancementMessage = () => {
    if (isEnhancing) {
      return "AI is analyzing your project requirements and recommending the optimal tech stack. Please wait...";
    }
    return "AI enhancement in progress...";
  };

  if (isLoading || !techStackOptions) {
    return <Card className="p-4">Loading tech stack options...</Card>;
  }

  const onSubmit = async (data: TechStackFormData) => {
    // If no project ID, can't save
    if (!projectId) {
      showToast({
        title: "Error",
        description: "Project must be saved before tech stack can be saved",
        type: "error",
      });
      setError("Project must be saved before tech stack can be saved");
      setTimeout(() => setError(""), 5000);
      return;
    }

    setIsSubmitting(true);
    // Clear previous messages
    setError("");

    try {
      const result = await techStackService.saveTechStack(projectId, data);

      if (result) {
        showToast({
          title: "Success",
          description: "Tech stack saved successfully",
          type: "success",
        });

        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        showToast({
          title: "Error",
          description: "Failed to save tech stack",
          type: "error",
        });
        setError("Failed to save tech stack");
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Error saving tech stack:", error);
      showToast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "error",
      });
      setError("An unexpected error occurred while saving tech stack");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      id="tech-stack-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 relative"
    >
      {/* Processing Overlay */}
      <ProcessingOverlay
        isVisible={isAnyEnhancementInProgress()}
        message={getEnhancementMessage()}
        opacity={0.6}
      />

      {/* AI Instructions Modal */}
      <AIInstructionsModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onConfirm={(instructions) => enhanceTechStack(instructions)}
        title="AI Tech Stack Recommendations"
        description="The AI will analyze your project description and requirements to recommend the optimal technology stack. You can provide additional context or constraints below."
        confirmText="Generate Recommendations"
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {justification && (
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-3 rounded-md whitespace-pre-line mb-4">
          {justification}
        </div>
      )}

      {/* AI Enhancement Button */}
      <div className="flex justify-end items-center gap-3 mb-4">
        {!hasAIFeatures && <PremiumFeatureBadge />}
        <Button
          type="button"
          onClick={openAIModal}
          disabled={isEnhancing || !projectId || !hasAIFeatures}
          variant={hasAIFeatures ? "outline" : "ghost"}
          className={`flex items-center gap-2 relative ${
            !hasAIFeatures ? "opacity-50 cursor-not-allowed" : ""
          } ${isEnhancing ? "relative z-[60]" : ""}`}
          title={
            hasAIFeatures
              ? "Replace tech stack with AI-generated recommendations"
              : "Upgrade to Premium to use AI-powered features"
          }
        >
          {isEnhancing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing requirements...</span>
            </>
          ) : (
            <>
              {hasAIFeatures ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span>AI Recommendations</span>
            </>
          )}
        </Button>
      </div>

      {/* Frontend Section */}
      <Card className="p-6">
        <FrontendSection
          register={register}
          errors={errors}
          frontendFrameworks={getFrontendFrameworks()}
          uiLibraryOptions={getFrontendUILibraries()}
          stateManagementOptions={getFrontendStateManagement()}
          control={control}
          setValue={setTechStackValue}
          initialData={initialData}
        />
      </Card>

      {/* Backend Section */}
      <Card className="p-6">
        <BackendSection
          register={register}
          errors={errors}
          backendFrameworks={getBackendFrameworks()}
          backendBaaS={getBackendBaaS()}
          backendRealtime={getBackendRealtime()}
          backendServerless={getBackendServerless()}
          initialData={initialData}
          control={control}
          setValue={setTechStackValue}
        />
      </Card>

      {/* Database Section */}
      <Card className="p-6">
        <DatabaseSection
          register={register}
          errors={errors}
          allDatabases={getAllDatabases()}
          allDatabaseHosting={getAllDatabaseHosting()}
          allOrms={getAllOrms()}
          initialData={initialData}
          control={control}
          setValue={setTechStackValue}
        />
      </Card>

      {/* Authentication Section */}
      <Card className="p-6">
        <AuthenticationSection
          register={register}
          authProviders={getAuthProviders()}
          authMethods={getAuthMethods()}
          initialData={initialData}
          control={control}
          setValue={setTechStackValue}
        />
      </Card>

      {/* Hosting Section */}
      <Card className="p-6">
        <HostingSection
          register={register}
          hostingFrontendOptions={getAllHostingFrontend()}
          hostingBackendOptions={getAllHostingBackend()}
          initialData={initialData}
          control={control}
          setValue={setTechStackValue}
        />
      </Card>

      {/* Storage Section */}
      <Card className="p-6">
        <StorageSection
          register={register}
          storageOptions={getAllStorageServices()}
          initialData={initialData}
          control={control}
          setValue={setTechStackValue}
        />
      </Card>

      {/* Deployment Section */}
      <Card className="p-6">
        <DeploymentSection
          register={register}
          deploymentCICDOptions={getAllDeploymentCICD()}
          deploymentContainerizationOptions={getAllDeploymentContainerization()}
          initialData={initialData}
          control={control}
          setValue={setTechStackValue}
        />
      </Card>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !projectId}
          variant={!projectId || isSubmitting ? "outline" : "default"}
          className={
            !projectId || isSubmitting
              ? "bg-gray-400 text-white hover:bg-gray-400"
              : ""
          }
        >
          {isSubmitting ? "Saving..." : "Save Tech Stack"}
        </Button>
      </div>
    </form>
  );
};

export default TechStackForm;
