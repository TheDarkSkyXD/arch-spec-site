import { useState, useEffect } from "react";
import { PlusCircle, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { requirementsService } from "../../services/requirementsService";
import { useToast } from "../../contexts/ToastContext";
import { RequirementsData } from "../../types/project";

interface RequirementsFormProps {
  initialData?: RequirementsData;
  projectId?: string;
  onSuccess?: (requirementsData: RequirementsData) => void;
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

  // Effect to update local state when initial data changes
  useEffect(() => {
    console.log("RequirementsForm initialData:", initialData);
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

    if (Object.keys(newErrors).length === 0) {
      if (!projectId) {
        showToast({
          title: "Error",
          description: "Project must be saved before requirements can be saved",
          type: "error",
        });
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
          showToast({
            title: "Error",
            description: "Failed to save requirements",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error saving requirements:", error);
        showToast({
          title: "Error",
          description: "An unexpected error occurred",
          type: "error",
        });
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
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md"
            >
              <p className="dark:text-slate-300">{req}</p>
              <button
                type="button"
                onClick={() => removeFunctionalRequirement(index)}
                className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newFunctionalReq}
            onChange={(e) => setNewFunctionalReq(e.target.value)}
            placeholder="Enter a functional requirement"
            className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
          <button
            type="button"
            onClick={addFunctionalRequirement}
            disabled={!newFunctionalReq.trim()}
            className={`p-2 rounded-md flex items-center ${
              !newFunctionalReq.trim()
                ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            <PlusCircle size={20} />
          </button>
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
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md"
            >
              <p className="dark:text-slate-300">{req}</p>
              <button
                type="button"
                onClick={() => removeNonFunctionalRequirement(index)}
                className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newNonFunctionalReq}
            onChange={(e) => setNewNonFunctionalReq(e.target.value)}
            placeholder="Enter a non-functional requirement"
            className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
          <button
            type="button"
            onClick={addNonFunctionalRequirement}
            disabled={!newNonFunctionalReq.trim()}
            className={`p-2 rounded-md flex items-center ${
              !newNonFunctionalReq.trim()
                ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            <PlusCircle size={20} />
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !projectId}
          className={`px-4 py-2 rounded-md text-white ${
            !projectId || isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700"
          } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
        >
          {isSubmitting ? "Saving..." : "Save Requirements"}
        </button>
      </div>
    </form>
  );
}
