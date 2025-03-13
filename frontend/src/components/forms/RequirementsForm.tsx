import { useState, useEffect } from "react";
import { PlusCircle, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { requirementsService } from "../../services/requirementsService";
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
              <p className="dark:text-slate-300">{req}</p>
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
              <p className="dark:text-slate-300">{req}</p>
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
