import { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  AlertCircle,
  Loader2,
  Sparkles,
  Tag,
  RefreshCw,
  Lock,
  Edit,
} from "lucide-react";
import { requirementsService } from "../../services/requirementsService";
import { projectsService } from "../../services/projectsService";
import { aiService } from "../../services/aiService";
import { useToast } from "../../contexts/ToastContext";
import { useSubscription } from "../../contexts/SubscriptionContext";
import { Requirements } from "../../types/templates";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";
import { PremiumFeatureBadge, ProcessingOverlay } from "../ui/index";

interface RequirementsFormProps {
  initialData?: Partial<Requirements>;
  projectId?: string;
  onSuccess?: (requirementsData: Partial<Requirements>) => void;
}

export default function RequirementsForm({
  initialData,
  projectId,
  onSuccess,
}: RequirementsFormProps) {
  const { showToast } = useToast();
  const { hasAIFeatures } = useSubscription();
  const [functionalReqs, setFunctionalReqs] = useState<string[]>(
    initialData?.functional || []
  );
  const [nonFunctionalReqs, setNonFunctionalReqs] = useState<string[]>(
    initialData?.non_functional || []
  );
  const [newFunctionalReq, setNewFunctionalReq] = useState("");
  const [newNonFunctionalReq, setNewNonFunctionalReq] = useState("");
  // Add state for inline editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingType, setEditingType] = useState<
    "functional" | "non-functional" | null
  >(null);
  const [editingValue, setEditingValue] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Add state for form-level error and success messages
  const [error, setError] = useState<string>("");
  // Add state for AI enhancement
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [businessGoals, setBusinessGoals] = useState<string[]>([]);
  // Add state for stripping prefixes
  const [stripPrefixes, setStripPrefixes] = useState<boolean>(true);
  // Add a new state for the second button loading state
  const [isAddingRequirements, setIsAddingRequirements] =
    useState<boolean>(false);

  // Effect to update local state when initial data changes
  useEffect(() => {
    if (initialData) {
      setFunctionalReqs(initialData.functional || []);
      setNonFunctionalReqs(initialData.non_functional || []);
    }
  }, [initialData]);

  // Fetch requirements if projectId is provided but no initialData
  useEffect(() => {
    const fetchRequirements = async () => {
      if (projectId && !initialData) {
        setIsLoading(true);
        try {
          const requirementsData = await requirementsService.getRequirements(
            projectId
          );
          if (requirementsData) {
            setFunctionalReqs(requirementsData.functional || []);
            setNonFunctionalReqs(requirementsData.non_functional || []);
          }
        } catch (error) {
          console.error("Error fetching requirements:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRequirements();
  }, [projectId, initialData]);

  // New function to fetch project description and business goals for AI enhancement
  const fetchProjectInfo = async () => {
    if (!projectId) return;

    try {
      // Fetch project details including description and business goals
      const projectDetails = await projectsService.getProjectById(projectId);

      if (projectDetails) {
        setProjectDescription(projectDetails.description || "");
        setBusinessGoals(projectDetails.business_goals || []);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  // Add effect to fetch project info
  useEffect(() => {
    if (projectId) {
      fetchProjectInfo();
    }
  }, [projectId]);

  const addFunctionalRequirement = () => {
    if (!newFunctionalReq.trim()) return;

    setFunctionalReqs([...functionalReqs, newFunctionalReq]);
    setNewFunctionalReq("");
  };

  const addNonFunctionalRequirement = () => {
    if (!newNonFunctionalReq.trim()) return;

    setNonFunctionalReqs([...nonFunctionalReqs, newNonFunctionalReq]);
    setNewNonFunctionalReq("");
  };

  const removeFunctionalRequirement = (index: number) => {
    const newReqs = functionalReqs.filter((_, i) => i !== index);

    // If we're removing the last item before a divider, or the first item after a divider,
    // we should also remove the divider if it exists
    const dividerIndex = newReqs.indexOf("---");
    if (dividerIndex !== -1) {
      // Check if there are items before and after the divider
      const hasBefore = dividerIndex > 0;
      const hasAfter = dividerIndex < newReqs.length - 1;

      // If either section is empty, remove the divider
      if (!hasBefore || !hasAfter) {
        newReqs.splice(dividerIndex, 1);
      }
    }

    setFunctionalReqs(newReqs);
  };

  const removeNonFunctionalRequirement = (index: number) => {
    const newReqs = nonFunctionalReqs.filter((_, i) => i !== index);

    // If we're removing the last item before a divider, or the first item after a divider,
    // we should also remove the divider if it exists
    const dividerIndex = newReqs.indexOf("---");
    if (dividerIndex !== -1) {
      // Check if there are items before and after the divider
      const hasBefore = dividerIndex > 0;
      const hasAfter = dividerIndex < newReqs.length - 1;

      // If either section is empty, remove the divider
      if (!hasBefore || !hasAfter) {
        newReqs.splice(dividerIndex, 1);
      }
    }

    setNonFunctionalReqs(newReqs);
  };

  // Function to strip category prefixes
  const stripCategoryPrefix = (req: string): string => {
    if (
      stripPrefixes &&
      (req.toLowerCase().startsWith("[functional]") ||
        req.toLowerCase().startsWith("[non-functional]") ||
        req.toLowerCase().startsWith("[nonfunctional]"))
    ) {
      return req.substring(req.indexOf("]") + 1).trim();
    }
    return req;
  };

  // Enhanced function to enhance requirements using AI with subscription check
  const enhanceRequirements = async () => {
    if (!projectId) {
      showToast({
        title: "Error",
        description:
          "Project must be saved before requirements can be enhanced",
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
          "Project description is missing. Requirements may not be properly enhanced.",
        type: "warning",
      });
    }

    // Combine functional and non-functional requirements
    const allRequirements = [...functionalReqs, ...nonFunctionalReqs];

    if (allRequirements.length === 0) {
      showToast({
        title: "Warning",
        description:
          "No requirements to enhance. Please add some requirements first.",
        type: "warning",
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const enhancedRequirements = await aiService.enhanceRequirements(
        projectDescription,
        businessGoals,
        allRequirements
      );

      if (enhancedRequirements && enhancedRequirements.length > 0) {
        // Process enhanced requirements
        const functionalRequirements: string[] = [];
        const nonFunctionalRequirements: string[] = [];

        console.log("Enhanced requirements from AI:", enhancedRequirements);

        // Categorize requirements based on [Category] prefix first, then fall back to content keywords
        enhancedRequirements.forEach((req) => {
          const lowerCaseReq = req.toLowerCase();

          // First check for explicit category prefixes
          if (lowerCaseReq.startsWith("[functional]")) {
            functionalRequirements.push(req); // Keep original format for categorization
          } else if (
            lowerCaseReq.startsWith("[non-functional]") ||
            lowerCaseReq.startsWith("[nonfunctional]")
          ) {
            nonFunctionalRequirements.push(req); // Keep original format for categorization
          }
          // Fall back to keyword detection if no category prefix is found
          else if (
            lowerCaseReq.includes("non-functional") ||
            lowerCaseReq.includes("nonfunctional") ||
            lowerCaseReq.includes("nfr") ||
            lowerCaseReq.includes("quality") ||
            lowerCaseReq.includes("performance") ||
            lowerCaseReq.includes("security") ||
            lowerCaseReq.includes("usability") ||
            lowerCaseReq.includes("reliability") ||
            lowerCaseReq.includes("maintainability")
          ) {
            nonFunctionalRequirements.push(req);
          } else {
            // Default to functional requirement if no other indicators are present
            functionalRequirements.push(req);
          }
        });

        console.log(
          "Categorized functional requirements:",
          functionalRequirements
        );
        console.log(
          "Categorized non-functional requirements:",
          nonFunctionalRequirements
        );

        setFunctionalReqs(functionalRequirements);
        setNonFunctionalReqs(nonFunctionalRequirements);

        showToast({
          title: "Success",
          description: "Requirements enhanced successfully",
          type: "success",
        });
      } else {
        showToast({
          title: "Warning",
          description: "No enhanced requirements returned",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error enhancing requirements:", error);
      showToast({
        title: "Error",
        description: "Failed to enhance requirements",
        type: "error",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  // Enhanced function to add AI-generated requirements with subscription check
  const addAIRequirements = async () => {
    if (!projectId) {
      showToast({
        title: "Error",
        description:
          "Project must be saved before requirements can be enhanced",
        type: "error",
      });
      return;
    }

    // Check if user has access to AI features
    if (!hasAIFeatures) {
      showToast({
        title: "Premium Feature",
        description:
          "AI-generated requirements are only available on Premium and Open Source plans. Please upgrade to use this feature.",
        type: "warning",
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: "Warning",
        description:
          "Project description is missing. Requirements may not be properly enhanced.",
        type: "warning",
      });
    }

    // Combine functional and non-functional requirements to provide context to the AI
    const allRequirements = [...functionalReqs, ...nonFunctionalReqs];

    setIsAddingRequirements(true);
    try {
      const enhancedRequirements = await aiService.enhanceRequirements(
        projectDescription,
        businessGoals,
        allRequirements
      );

      if (enhancedRequirements && enhancedRequirements.length > 0) {
        // Process enhanced requirements
        const newFunctionalRequirements: string[] = [];
        const newNonFunctionalRequirements: string[] = [];

        console.log("New requirements from AI:", enhancedRequirements);

        // Categorize requirements based on [Category] prefix first, then fall back to content keywords
        enhancedRequirements.forEach((req) => {
          const lowerCaseReq = req.toLowerCase();

          // First check for explicit category prefixes
          if (lowerCaseReq.startsWith("[functional]")) {
            newFunctionalRequirements.push(req); // Keep original format for categorization
          } else if (
            lowerCaseReq.startsWith("[non-functional]") ||
            lowerCaseReq.startsWith("[nonfunctional]")
          ) {
            newNonFunctionalRequirements.push(req); // Keep original format for categorization
          }
          // Fall back to keyword detection if no category prefix is found
          else if (
            lowerCaseReq.includes("non-functional") ||
            lowerCaseReq.includes("nonfunctional") ||
            lowerCaseReq.includes("nfr") ||
            lowerCaseReq.includes("quality") ||
            lowerCaseReq.includes("performance") ||
            lowerCaseReq.includes("security") ||
            lowerCaseReq.includes("usability") ||
            lowerCaseReq.includes("reliability") ||
            lowerCaseReq.includes("maintainability")
          ) {
            newNonFunctionalRequirements.push(req);
          } else {
            // Default to functional requirement if no other indicators are present
            newFunctionalRequirements.push(req);
          }
        });

        // If there are already requirements and we're adding new ones, add a divider
        const divider = "---";

        // Add new requirements to existing requirements with a divider if needed
        if (functionalReqs.length > 0 && newFunctionalRequirements.length > 0) {
          setFunctionalReqs([
            ...functionalReqs,
            divider,
            ...newFunctionalRequirements,
          ]);
        } else {
          setFunctionalReqs([...functionalReqs, ...newFunctionalRequirements]);
        }

        if (
          nonFunctionalReqs.length > 0 &&
          newNonFunctionalRequirements.length > 0
        ) {
          setNonFunctionalReqs([
            ...nonFunctionalReqs,
            divider,
            ...newNonFunctionalRequirements,
          ]);
        } else {
          setNonFunctionalReqs([
            ...nonFunctionalReqs,
            ...newNonFunctionalRequirements,
          ]);
        }

        showToast({
          title: "Success",
          description: `Added ${
            newFunctionalRequirements.length +
            newNonFunctionalRequirements.length
          } new requirements`,
          type: "success",
        });
      } else {
        showToast({
          title: "Warning",
          description: "No new requirements generated",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error adding AI requirements:", error);
      showToast({
        title: "Error",
        description: "Failed to generate new requirements",
        type: "error",
      });
    } finally {
      setIsAddingRequirements(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Validation can be optional, comment this out if you don't want to require at least one functional requirement
    // if (functionalReqs.length === 0) {
    //   newErrors.functional = "At least one functional requirement is needed";
    // }

    setErrors(newErrors);
    // Clear previous form-level messages
    setError("");

    if (Object.keys(newErrors).length === 0) {
      if (!projectId) {
        const errorMessage =
          "Project must be saved before requirements can be saved";
        showToast({
          title: "Error",
          description: errorMessage,
          type: "error",
        });
        setError(errorMessage);
        return;
      }

      setIsSubmitting(true);
      try {
        const data = {
          functional: functionalReqs,
          non_functional: nonFunctionalReqs,
        };

        const result = await requirementsService.saveRequirements(
          projectId,
          data
        );

        if (result) {
          showToast({
            title: "Success",
            description: "Requirements saved successfully",
            type: "success",
          });

          if (onSuccess) {
            onSuccess(result);
          }
        } else {
          const errorMessage = "Failed to save requirements";
          showToast({
            title: "Error",
            description: errorMessage,
            type: "error",
          });
          setError(errorMessage);
          setTimeout(() => setError(""), 5000);
        }
      } catch (error) {
        console.error("Error saving requirements:", error);
        const errorMessage = "An unexpected error occurred";
        showToast({
          title: "Error",
          description: errorMessage,
          type: "error",
        });
        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Helper function to check if any AI operation is in progress
  const isAnyEnhancementInProgress = () => {
    return isEnhancing || isAddingRequirements;
  };

  // Helper to get the appropriate message for the overlay
  const getEnhancementMessage = () => {
    if (isEnhancing) {
      return "AI is enhancing your requirements. Please wait...";
    }
    if (isAddingRequirements) {
      return "AI is generating new requirements for your project. Please wait...";
    }
    return "AI enhancement in progress...";
  };

  const handleStartEdit = (
    index: number,
    type: "functional" | "non-functional",
    value: string
  ) => {
    setEditingIndex(index);
    setEditingType(type);
    setEditingValue(value);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingType(null);
    setEditingValue("");
  };

  const handleSaveEdit = () => {
    if (!editingValue.trim() || editingIndex === null || !editingType) return;

    if (editingType === "functional") {
      const newReqs = [...functionalReqs];
      newReqs[editingIndex] = editingValue.trim();
      setFunctionalReqs(newReqs);
    } else {
      const newReqs = [...nonFunctionalReqs];
      newReqs[editingIndex] = editingValue.trim();
      setNonFunctionalReqs(newReqs);
    }

    showToast({
      title: "Success",
      description: "Requirement updated successfully",
      type: "success",
    });

    handleCancelEdit();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
        <span className="text-slate-600 dark:text-slate-300">
          Loading requirements...
        </span>
      </div>
    );
  }

  return (
    <form
      id="requirements-form"
      onSubmit={handleSubmit}
      className="space-y-8 relative"
    >
      {/* Processing Overlay */}
      <ProcessingOverlay
        isVisible={isAnyEnhancementInProgress()}
        message={getEnhancementMessage()}
        opacity={0.6}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Project Requirements
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Define the functional and non-functional requirements for your
          project.
        </p>
      </div>

      {/* AI Enhancement Buttons */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setStripPrefixes(!stripPrefixes)}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-xs"
            title={
              stripPrefixes
                ? "Show category prefixes"
                : "Hide category prefixes"
            }
          >
            <Tag className="h-3 w-3" />
            {stripPrefixes ? "Show prefixes" : "Hide prefixes"}
          </Button>
        </div>
        <div className="flex justify-end items-center gap-3 mb-4">
          {!hasAIFeatures && <PremiumFeatureBadge />}
          <Button
            type="button"
            onClick={addAIRequirements}
            disabled={
              isAddingRequirements ||
              isEnhancing ||
              !projectId ||
              !hasAIFeatures
            }
            variant={hasAIFeatures ? "outline" : "ghost"}
            className={`flex items-center gap-2 relative ${
              !hasAIFeatures ? "opacity-50 cursor-not-allowed" : ""
            } ${isAddingRequirements ? "relative z-[60]" : ""}`}
            title={
              hasAIFeatures
                ? "Generate new requirements to complement existing ones"
                : "Upgrade to Premium to use AI-powered features"
            }
          >
            {isAddingRequirements ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                {hasAIFeatures ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span>Add AI Requirements</span>
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={enhanceRequirements}
            disabled={
              isEnhancing ||
              isAddingRequirements ||
              !projectId ||
              !hasAIFeatures
            }
            variant={hasAIFeatures ? "outline" : "ghost"}
            className={`flex items-center gap-2 relative ${
              !hasAIFeatures ? "opacity-50 cursor-not-allowed" : ""
            } ${isEnhancing ? "relative z-[60]" : ""}`}
            title={
              hasAIFeatures
                ? "Replace all requirements with enhanced versions"
                : "Upgrade to Premium to use AI-powered features"
            }
          >
            {isEnhancing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Enhancing...</span>
              </>
            ) : (
              <>
                {hasAIFeatures ? (
                  <RefreshCw className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span>Replace All</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Functional Requirements */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">
          Functional Requirements
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          What specific features and capabilities should your application have?
        </p>

        {errors.functional && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-2 text-red-700 dark:text-red-400">
            <AlertCircle size={16} className="mt-0.5" />
            <span>{errors.functional}</span>
          </div>
        )}

        <div className="space-y-2">
          {functionalReqs.map((req, index) =>
            req === "---" ? (
              <div
                key={`divider-${index}`}
                className="border-t border-dashed border-slate-300 dark:border-slate-600 my-4 py-1 px-3 text-xs text-center text-slate-500 dark:text-slate-400"
              >
                New AI-generated requirements
              </div>
            ) : (
              <Card
                key={index}
                className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {editingIndex === index && editingType === "functional" ? (
                  <div className="flex gap-2 w-full">
                    <Input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="flex-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleSaveEdit}
                      variant="default"
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="dark:text-slate-300">
                      {stripCategoryPrefix(req)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleStartEdit(index, "functional", req)
                        }
                        className="text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFunctionalRequirement(index)}
                        className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            )
          )}
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            value={newFunctionalReq}
            onChange={(e) => setNewFunctionalReq(e.target.value)}
            placeholder="Enter a functional requirement"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addFunctionalRequirement}
            disabled={!newFunctionalReq.trim()}
            variant={!newFunctionalReq.trim() ? "outline" : "default"}
            className={!newFunctionalReq.trim() ? "cursor-not-allowed" : ""}
          >
            <PlusCircle size={20} />
          </Button>
        </div>
      </div>

      {/* Non-Functional Requirements */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">
          Non-Functional Requirements
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          What qualities should your application have (performance, security,
          usability, etc.)?
        </p>

        <div className="space-y-2">
          {nonFunctionalReqs.map((req, index) =>
            req === "---" ? (
              <div
                key={`divider-${index}`}
                className="border-t border-dashed border-slate-300 dark:border-slate-600 my-4 py-1 px-3 text-xs text-center text-slate-500 dark:text-slate-400"
              >
                New AI-generated requirements
              </div>
            ) : (
              <Card
                key={index}
                className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                {editingIndex === index && editingType === "non-functional" ? (
                  <div className="flex gap-2 w-full">
                    <Input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="flex-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleSaveEdit}
                      variant="default"
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="dark:text-slate-300">
                      {stripCategoryPrefix(req)}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleStartEdit(index, "non-functional", req)
                        }
                        className="text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNonFunctionalRequirement(index)}
                        className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            )
          )}
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            value={newNonFunctionalReq}
            onChange={(e) => setNewNonFunctionalReq(e.target.value)}
            placeholder="Enter a non-functional requirement"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={addNonFunctionalRequirement}
            disabled={!newNonFunctionalReq.trim()}
            variant={!newNonFunctionalReq.trim() ? "outline" : "default"}
            className={!newNonFunctionalReq.trim() ? "cursor-not-allowed" : ""}
          >
            <PlusCircle size={20} />
          </Button>
        </div>
      </div>

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
          {isSubmitting ? "Saving..." : "Save Requirements"}
        </Button>
      </div>
    </form>
  );
}
