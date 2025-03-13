import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { projectsService } from "../../services/projectsService";
import { aiService } from "../../services/aiService";
import { useToast } from "../../contexts/ToastContext";
import { PlusCircle, Trash2, Sparkles, Wand2 } from "lucide-react";

// Import shadcn UI components
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";

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

const ProjectBasicsForm = ({
  initialData,
  onSuccess,
}: ProjectBasicsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEnhancingGoals, setIsEnhancingGoals] = useState(false);
  const { showToast } = useToast();
  // Track the project ID internally for subsequent updates
  const [projectId, setProjectId] = useState<string | undefined>(
    initialData?.id
  );
  // Add state for error and success messages
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  // State for business goals
  const [businessGoals, setBusinessGoals] = useState<string[]>(
    initialData?.business_goals || []
  );
  const [newBusinessGoal, setNewBusinessGoal] = useState<string>("");

  const isEditMode = Boolean(projectId);

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

  // Get current description value for enhance button
  const currentDescription = watch("description");

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

  const enhanceDescription = async () => {
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
        currentDescription
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

  const enhanceBusinessGoals = async () => {
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
        businessGoals
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

  const onSubmit = async (data: ProjectBasicsFormData) => {
    setIsSubmitting(true);
    // Clear previous messages
    setError("");
    setSuccess("");

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

        setSuccess(successMessage);
        setTimeout(() => setSuccess(""), 3000);

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

  return (
    <form
      id="project-basics-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
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
        <Label htmlFor="description">Description</Label>
        <div className="relative">
          <Textarea
            id="description"
            rows={4}
            {...register("description")}
            error={errors.description?.message?.toString()}
            placeholder="Describe your project"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400"
            onClick={enhanceDescription}
            disabled={isEnhancing || !currentDescription}
            title="Enhance with AI"
          >
            <Sparkles
              size={18}
              className={isEnhancing ? "animate-pulse" : ""}
            />
          </Button>
        </div>
        {isEnhancing && (
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enhancing description...
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="business_goals">Business Goals</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={enhanceBusinessGoals}
            disabled={isEnhancingGoals || !currentDescription}
            className="text-xs flex items-center gap-1"
            title={
              businessGoals.length > 0
                ? "Enhance business goals with AI"
                : "Generate business goals with AI"
            }
          >
            <Wand2
              size={14}
              className={isEnhancingGoals ? "animate-pulse" : ""}
            />
            {businessGoals.length > 0 ? "Enhance Goals" : "Generate Goals"}
          </Button>
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
        <Label htmlFor="target_users">Target Users</Label>
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
