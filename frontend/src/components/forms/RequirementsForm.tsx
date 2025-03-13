import { useState, useEffect } from "react";
import { PlusCircle, Trash2, AlertCircle, Loader2, Sparkles, Tag } from "lucide-react";
import { requirementsService } from "../../services/requirementsService";
import { projectsService } from "../../services/projectsService";
import { aiService } from "../../services/aiService";
import { useToast } from "../../contexts/ToastContext";
import { Requirements } from "../../types/templates";

// Import shadcn UI components
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";

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
  const [functionalReqs, setFunctionalReqs] = useState<string[]>(
    initialData?.functional || []
  );
  const [nonFunctionalReqs, setNonFunctionalReqs] = useState<string[]>(
    initialData?.non_functional || []
  );
  const [newFunctionalReq, setNewFunctionalReq] = useState("");
  const [newNonFunctionalReq, setNewNonFunctionalReq] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Add state for form-level error and success messages
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  // Add state for AI enhancement
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [businessGoals, setBusinessGoals] = useState<string[]>([]);
  // Add state for stripping prefixes
  const [stripPrefixes, setStripPrefixes] = useState<boolean>(true);

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
    setFunctionalReqs(functionalReqs.filter((_, i) => i !== index));
  };

  const removeNonFunctionalRequirement = (index: number) => {
    setNonFunctionalReqs(nonFunctionalReqs.filter((_, i) => i !== index));
  };

  // Function to strip category prefixes
  const stripCategoryPrefix = (req: string): string => {
    if (stripPrefixes && (
        req.toLowerCase().startsWith("[functional]") || 
        req.toLowerCase().startsWith("[non-functional]") ||
        req.toLowerCase().startsWith("[nonfunctional]")
      )) {
      return req.substring(req.indexOf("]") + 1).trim();
    }
    return req;
  };

  // New function to enhance requirements using AI
  const enhanceRequirements = async () => {
    if (!projectId) {
      showToast({
        title: "Error",
        description: "Project must be saved before requirements can be enhanced",
        type: "error",
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: "Warning",
        description: "Project description is missing. Requirements may not be properly enhanced.",
        type: "warning",
      });
    }

    // Combine functional and non-functional requirements
    const allRequirements = [...functionalReqs, ...nonFunctionalReqs];
    
    if (allRequirements.length === 0) {
      showToast({
        title: "Warning",
        description: "No requirements to enhance. Please add some requirements first.",
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
        enhancedRequirements.forEach(req => {
          const lowerCaseReq = req.toLowerCase();
          
          // First check for explicit category prefixes
          if (lowerCaseReq.startsWith("[functional]")) {
            functionalRequirements.push(req); // Keep original format for categorization
          } else if (lowerCaseReq.startsWith("[non-functional]") || lowerCaseReq.startsWith("[nonfunctional]")) {
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

        console.log("Categorized functional requirements:", functionalRequirements);
        console.log("Categorized non-functional requirements:", nonFunctionalRequirements);

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
    setSuccess("");

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
          const successMessage = "Requirements saved successfully";
          showToast({
            title: "Success",
            description: successMessage,
            type: "success",
          });
          setSuccess(successMessage);
          setTimeout(() => setSuccess(""), 3000);

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
    <form id="requirements-form" onSubmit={handleSubmit} className="space-y-8">
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-md mb-4">
          {success}
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

      {/* AI Enhancement Button */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={() => setStripPrefixes(!stripPrefixes)}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-xs"
            title={stripPrefixes ? "Show category prefixes" : "Hide category prefixes"}
          >
            <Tag className="h-3 w-3" />
            {stripPrefixes ? "Show prefixes" : "Hide prefixes"}
          </Button>
        </div>
        <Button
          type="button"
          onClick={enhanceRequirements}
          disabled={isEnhancing || !projectId}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Enhancing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Enhance with AI</span>
            </>
          )}
        </Button>
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
          {functionalReqs.map((req, index) => (
            <Card
              key={index}
              className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <p className="dark:text-slate-300">{stripCategoryPrefix(req)}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFunctionalRequirement(index)}
                className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
              >
                <Trash2 size={18} />
              </Button>
            </Card>
          ))}
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
          {nonFunctionalReqs.map((req, index) => (
            <Card
              key={index}
              className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <p className="dark:text-slate-300">{stripCategoryPrefix(req)}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeNonFunctionalRequirement(index)}
                className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
              >
                <Trash2 size={18} />
              </Button>
            </Card>
          ))}
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
