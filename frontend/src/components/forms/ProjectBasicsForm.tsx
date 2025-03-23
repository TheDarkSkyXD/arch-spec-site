import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { projectsService } from "../../services/projectsService";
import { aiService } from "../../services/aiService";
import { useToast } from "../../contexts/ToastContext";
import {
  PlusCircle,
  Trash2,
  Sparkles,
  Wand2,
  Users,
  Lock,
  Loader2,
} from "lucide-react";
import { useSubscription } from "../../contexts/SubscriptionContext";

// Import shadcn UI components
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";
import PremiumFeatureBadge from "../ui/PremiumFeatureBadge";
import { ProcessingOverlay } from "../ui/index";
import AIInstructionsModal from "../ui/AIInstructionsModal";

const projectBasicsSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  business_goals: z.array(z.string()).optional(),
  target_users: z.string().optional(),
  domain: z.string().optional(),
});

type ProjectBasicsFormData = z.infer<typeof projectBasicsSchema>;

interface ProjectBasicsFormProps {
  initialData?: Partial<ProjectBasicsFormData> & { id?: string };
  onSuccess?: (projectId: string) => void;
}

// Define the type for active modal
type ActiveModal = "description" | "businessGoals" | "targetUsers" | null;

const ProjectBasicsForm = ({
  initialData,
  onSuccess,
}: ProjectBasicsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEnhancingGoals, setIsEnhancingGoals] = useState(false);
  const [isEnhancingTargetUsers, setIsEnhancingTargetUsers] = useState(false);
  const { showToast } = useToast();
  const { hasAIFeatures, isLoading: isSubscriptionLoading } = useSubscription();

  // Add local loading state with forced delay
  const [localLoading, setLocalLoading] = useState(true);

  // Track the project ID internally for subsequent updates
  const [projectId, setProjectId] = useState<string | undefined>(
    initialData?.id
  );
  // Add state for error and success messages
  const [error, setError] = useState<string>("");
  // State for business goals
  const [businessGoals, setBusinessGoals] = useState<string[]>(
    initialData?.business_goals || []
  );
  const [newBusinessGoal, setNewBusinessGoal] = useState<string>("");

  // State for AI instructions modal
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const isEditMode = Boolean(projectId);

  // Force a minimum loading time to prevent flickering
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 1000); // Force a 1-second minimum loading time

    return () => clearTimeout(timer);
  }, []);

  // Reset local loading if subscription loading state changes
  useEffect(() => {
    if (isSubscriptionLoading) {
      setLocalLoading(true);
    }
  }, [isSubscriptionLoading]);

  // Composite loading state - true if either local or subscription is loading
  const isLoading = localLoading || isSubscriptionLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProjectBasicsFormData>({
    resolver: zodResolver(projectBasicsSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      business_goals: initialData?.business_goals || [],
      target_users: initialData?.target_users || "",
      domain: initialData?.domain || "",
    },
  });

  // Get current field values for enhance buttons
  const currentDescription = watch("description");
  const currentTargetUsers = watch("target_users");

  // Update form values if initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        business_goals: initialData.business_goals || [],
        target_users: initialData.target_users || "",
        domain: initialData.domain || "",
      });

      setBusinessGoals(initialData.business_goals || []);

      if (initialData.id) {
        setProjectId(initialData.id);
      }
    }
  }, [initialData, reset]);

  // Update hidden form field when business goals change
  useEffect(() => {
    setValue("business_goals", businessGoals);
  }, [businessGoals, setValue]);

  const addBusinessGoal = () => {
    if (!newBusinessGoal.trim()) return;

    setBusinessGoals([...businessGoals, newBusinessGoal]);
    setNewBusinessGoal("");
  };

  const removeBusinessGoal = (index: number) => {
    setBusinessGoals(businessGoals.filter((_, i) => i !== index));
  };

  // Function to open AI instructions modal
  const openAIInstructionsModal = (modal: ActiveModal) => {
    // Check if user has access to AI features
    if (!hasAIFeatures) {
      showToast({
        title: "Premium Feature",
        description: "Upgrade to Premium to use AI-powered features",
        type: "info",
      });
      return;
    }

    setActiveModal(modal);
  };

  // Function to close the modal
  const closeAIInstructionsModal = () => {
    setActiveModal(null);
  };

  // Enhanced functions with AI instructions
  const enhanceDescription = async (additionalInstructions?: string) => {
    if (!currentDescription || currentDescription.length < 5) {
      showToast({
        title: "Description too short",
        description: "Please provide a longer description to enhance",
        type: "warning",
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const enhancedDescription = await aiService.enhanceDescription(
        currentDescription,
        additionalInstructions
      );

      if (enhancedDescription) {
        setValue("description", enhancedDescription, { shouldValidate: true });
        showToast({
          title: "Description Enhanced",
          description: "The project description has been improved",
          type: "success",
        });
      } else {
        showToast({
          title: "Enhancement Failed",
          description: "Unable to enhance the description. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error enhancing description:", error);
      showToast({
        title: "Enhancement Failed",
        description: "An error occurred while enhancing the description",
        type: "error",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const enhanceBusinessGoals = async (additionalInstructions?: string) => {
    // Only need a valid description to generate/enhance goals
    if (!currentDescription || currentDescription.length < 5) {
      showToast({
        title: "Description too short",
        description: "Please provide a project description first",
        type: "warning",
      });
      return;
    }

    setIsEnhancingGoals(true);
    try {
      const enhancedGoals = await aiService.enhanceBusinessGoals(
        currentDescription,
        businessGoals,
        additionalInstructions
      );

      if (enhancedGoals && enhancedGoals.length > 0) {
        setBusinessGoals(enhancedGoals);

        // Show different messages based on whether we're enhancing or generating
        const hasExistingGoals = businessGoals.length > 0;
        showToast({
          title: hasExistingGoals
            ? "Business Goals Enhanced"
            : "Business Goals Generated",
          description: hasExistingGoals
            ? "Your business goals have been improved"
            : "New business goals have been generated based on your project description",
          type: "success",
        });
      } else {
        showToast({
          title: "Enhancement Failed",
          description: "Unable to enhance business goals. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error enhancing business goals:", error);
      showToast({
        title: "Enhancement Failed",
        description: "An error occurred while enhancing business goals",
        type: "error",
      });
    } finally {
      setIsEnhancingGoals(false);
    }
  };

  const enhanceTargetUsers = async (additionalInstructions?: string) => {
    // Need a valid description to generate/enhance target users
    if (!currentDescription || currentDescription.length < 5) {
      showToast({
        title: "Description too short",
        description: "Please provide a project description first",
        type: "warning",
      });
      return;
    }

    setIsEnhancingTargetUsers(true);
    try {
      const enhancedTargetUsers = await aiService.enhanceTargetUsers(
        currentDescription,
        currentTargetUsers || "",
        additionalInstructions
      );

      if (enhancedTargetUsers) {
        setValue("target_users", enhancedTargetUsers, { shouldValidate: true });
        // Show different messages based on whether we're enhancing or generating
        const hasExistingTargetUsers =
          currentTargetUsers && currentTargetUsers.trim().length > 0;
        showToast({
          title: hasExistingTargetUsers
            ? "Target Users Enhanced"
            : "Target Users Generated",
          description: hasExistingTargetUsers
            ? "Your target users description has been improved"
            : "Target users have been generated based on your project description",
          type: "success",
        });
      } else {
        showToast({
          title: "Enhancement Failed",
          description: "Unable to enhance target users. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error enhancing target users:", error);
      showToast({
        title: "Enhancement Failed",
        description: "An error occurred while enhancing target users",
        type: "error",
      });
    } finally {
      setIsEnhancingTargetUsers(false);
    }
  };

  const onSubmit = async (data: ProjectBasicsFormData) => {
    setIsSubmitting(true);
    // Clear previous messages
    setError("");

    // Update business_goals in form data before submission
    data.business_goals = businessGoals;

    try {
      let project;

      if (isEditMode && projectId) {
        // Update existing project
        project = await projectsService.updateProject(projectId, data);
      } else {
        // Create new project
        project = await projectsService.createProject(data);
        // Store the new project ID for future updates
        if (project) {
          setProjectId(project.id);
        }
      }

      if (project) {
        const successMessage = isEditMode
          ? "Project updated successfully"
          : "Project created successfully";

        showToast({
          title: "Success",
          description: successMessage,
          type: "success",
        });

        if (onSuccess) {
          onSuccess(project.id);
        }
      } else {
        const errorMessage = isEditMode
          ? "Failed to update project"
          : "Failed to create project";

        showToast({
          title: "Error",
          description: errorMessage,
          type: "error",
        });

        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} project:`,
        error
      );

      showToast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "error",
      });

      setError("An unexpected error occurred");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to check if any AI enhancement is in progress
  const isAnyEnhancementInProgress = () => {
    return isEnhancing || isEnhancingGoals || isEnhancingTargetUsers;
  };

  // Helper to get the appropriate message based on which enhancement is in progress
  const getEnhancementMessage = () => {
    if (isEnhancing) {
      return "AI is enhancing your project description. Please wait...";
    }
    if (isEnhancingGoals) {
      return businessGoals.length > 0
        ? "AI is improving your business goals. Please wait..."
        : "AI is generating business goals based on your description. Please wait...";
    }
    if (isEnhancingTargetUsers) {
      return currentTargetUsers
        ? "AI is enhancing your target users description. Please wait..."
        : "AI is generating target users based on your description. Please wait...";
    }
    return "AI enhancement in progress...";
  };

  return (
    <form
      id="project-basics-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 relative"
    >
      {/* Processing Overlay */}
      <ProcessingOverlay
        isVisible={isAnyEnhancementInProgress()}
        message={getEnhancementMessage()}
        opacity={0.6}
      />

      {/* AI Instructions Modal */}
      <AIInstructionsModal
        isOpen={activeModal === "description"}
        onClose={closeAIInstructionsModal}
        onConfirm={(instructions) => enhanceDescription(instructions)}
        title="Enhance Project Description"
        description="The AI will improve your project description with better clarity, grammar, and technical precision."
        confirmText="Enhance Description"
      />

      <AIInstructionsModal
        isOpen={activeModal === "businessGoals"}
        onClose={closeAIInstructionsModal}
        onConfirm={(instructions) => enhanceBusinessGoals(instructions)}
        title={
          businessGoals.length > 0
            ? "Enhance Business Goals"
            : "Generate Business Goals"
        }
        description={
          businessGoals.length > 0
            ? "The AI will improve your existing business goals to be more specific, measurable, and actionable."
            : "The AI will generate relevant business goals based on your project description."
        }
        confirmText={
          businessGoals.length > 0 ? "Enhance Goals" : "Generate Goals"
        }
      />

      <AIInstructionsModal
        isOpen={activeModal === "targetUsers"}
        onClose={closeAIInstructionsModal}
        onConfirm={(instructions) => enhanceTargetUsers(instructions)}
        title={
          currentTargetUsers ? "Enhance Target Users" : "Generate Target Users"
        }
        description={
          currentTargetUsers
            ? "The AI will improve your target users description with more detail and precision."
            : "The AI will generate a relevant target users description based on your project."
        }
        confirmText={currentTargetUsers ? "Enhance Users" : "Generate Users"}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          type="text"
          {...register("name")}
          error={errors.name?.message?.toString()}
          placeholder="Enter project name"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="description">Description</Label>

          {!isLoading && (
            <div className="flex justify-end items-center gap-3 mb-1">
              {!hasAIFeatures && <PremiumFeatureBadge />}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openAIInstructionsModal("description")}
                disabled={isEnhancing || !currentDescription || !hasAIFeatures}
                className={`flex items-center gap-1 text-xs ${
                  !hasAIFeatures ? "opacity-50 cursor-not-allowed" : ""
                } ${isEnhancing ? "relative z-[60]" : ""}`}
                title={
                  hasAIFeatures
                    ? "Enhance description with AI"
                    : "Upgrade to Premium to use AI-powered features"
                }
              >
                {isEnhancing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <>
                    {hasAIFeatures ? (
                      <Sparkles size={14} className="mr-1" />
                    ) : (
                      <Lock size={14} className="mr-1" />
                    )}
                  </>
                )}
                {isEnhancing ? "Enhancing..." : "Enhance Description"}
              </Button>
            </div>
          )}
        </div>
        <div className="relative">
          <Textarea
            id="description"
            rows={4}
            {...register("description")}
            error={errors.description?.message?.toString()}
            placeholder="Describe your project"
          />
        </div>
        {isEnhancing && (
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enhancing description...
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="business_goals">Business Goals</Label>

          {!isLoading && (
            <div className="flex justify-end items-center gap-3">
              {!hasAIFeatures && <PremiumFeatureBadge />}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openAIInstructionsModal("businessGoals")}
                disabled={
                  isEnhancingGoals || !currentDescription || !hasAIFeatures
                }
                className={`text-xs flex items-center gap-1 ${
                  !hasAIFeatures ? "opacity-50 cursor-not-allowed" : ""
                } ${isEnhancingGoals ? "relative z-[60]" : ""}`}
                title={
                  hasAIFeatures
                    ? businessGoals.length > 0
                      ? "Enhance business goals with AI"
                      : "Generate business goals with AI"
                    : "Upgrade to Premium to use AI-powered features"
                }
              >
                {isEnhancingGoals ? (
                  <Loader2 size={14} className="animate-spin mr-1" />
                ) : (
                  <>
                    {hasAIFeatures ? (
                      <Wand2 size={14} className="mr-1" />
                    ) : (
                      <Lock size={14} className="mr-1" />
                    )}
                  </>
                )}
                {businessGoals.length > 0 ? "Enhance Goals" : "Generate Goals"}
              </Button>
            </div>
          )}
        </div>

        {isEnhancingGoals && (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {businessGoals.length > 0
              ? "Enhancing business goals..."
              : "Generating business goals..."}
          </div>
        )}

        {/* Display existing business goals */}
        <div className="space-y-2">
          {businessGoals.map((goal, index) => (
            <Card
              key={index}
              className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <p className="dark:text-slate-300">{goal}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeBusinessGoal(index)}
                className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
              >
                <Trash2 size={18} />
              </Button>
            </Card>
          ))}
        </div>

        {/* Input for new business goal */}
        <div className="flex items-center w-full gap-2">
          <div className="flex-grow w-full">
            <Input
              type="text"
              value={newBusinessGoal}
              onChange={(e) => setNewBusinessGoal(e.target.value)}
              placeholder="Add a business goal"
              className="w-full"
            />
          </div>
          <div className="flex-shrink-0">
            <Button
              type="button"
              onClick={addBusinessGoal}
              disabled={!newBusinessGoal.trim()}
              variant={!newBusinessGoal.trim() ? "outline" : "default"}
              className={!newBusinessGoal.trim() ? "cursor-not-allowed" : ""}
            >
              <PlusCircle size={20} />
            </Button>
          </div>
        </div>

        {/* Hidden input to handle form submission */}
        <input type="hidden" {...register("business_goals")} />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <Label htmlFor="target_users">Target Users</Label>

          {!isLoading && (
            <div className="flex justify-end items-center gap-3 mb-1">
              {!hasAIFeatures && <PremiumFeatureBadge />}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openAIInstructionsModal("targetUsers")}
                disabled={
                  isEnhancingTargetUsers ||
                  !currentDescription ||
                  !hasAIFeatures
                }
                className={`text-xs flex items-center gap-1 ${
                  !hasAIFeatures ? "opacity-50 cursor-not-allowed" : ""
                } ${isEnhancingTargetUsers ? "relative z-[60]" : ""}`}
                title={
                  hasAIFeatures
                    ? currentTargetUsers
                      ? "Enhance target users with AI"
                      : "Generate target users with AI"
                    : "Upgrade to Premium to use AI-powered features"
                }
              >
                {isEnhancingTargetUsers ? (
                  <Loader2 size={14} className="animate-spin mr-1" />
                ) : (
                  <>
                    {hasAIFeatures ? (
                      <Users size={14} className="mr-1" />
                    ) : (
                      <Lock size={14} className="mr-1" />
                    )}
                  </>
                )}
                {currentTargetUsers ? "Enhance Users" : "Generate Users"}
              </Button>
            </div>
          )}
        </div>

        {isEnhancingTargetUsers && (
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            {currentTargetUsers
              ? "Enhancing target users..."
              : "Generating target users..."}
          </div>
        )}

        <Textarea
          id="target_users"
          rows={2}
          {...register("target_users")}
          placeholder="Describe your target user personas"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="domain">Domain</Label>
          <Input
            id="domain"
            type="text"
            {...register("domain")}
            placeholder="e.g. Healthcare, Finance, Education"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditMode
            ? "Update Project"
            : "Save Project"}
        </Button>
      </div>
    </form>
  );
};

export default ProjectBasicsForm;
