import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { projectsService } from "../../services/projectsService";
import { useToast } from "../../contexts/ToastContext";

// Import shadcn UI components
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import Button from "../ui/Button";
import Input from "../ui/Input";

const projectBasicsSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  business_goals: z.string().optional(),
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
  const { showToast } = useToast();
  // Track the project ID internally for subsequent updates
  const [projectId, setProjectId] = useState<string | undefined>(
    initialData?.id
  );
  // Add state for error and success messages
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const isEditMode = Boolean(projectId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectBasicsFormData>({
    resolver: zodResolver(projectBasicsSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      business_goals: initialData?.business_goals || "",
      target_users: initialData?.target_users || "",
      domain: initialData?.domain || "",
    },
  });

  // Update form values if initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        business_goals: initialData.business_goals || "",
        target_users: initialData.target_users || "",
        domain: initialData.domain || "",
      });

      if (initialData.id) {
        setProjectId(initialData.id);
      }
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ProjectBasicsFormData) => {
    setIsSubmitting(true);
    // Clear previous messages
    setError("");
    setSuccess("");

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
        <Textarea
          id="description"
          rows={4}
          {...register("description")}
          error={errors.description?.message?.toString()}
          placeholder="Describe your project"
        />
      </div>

      <div>
        <Label htmlFor="business_goals">Business Goals</Label>
        <Textarea
          id="business_goals"
          rows={2}
          {...register("business_goals")}
          placeholder="List your key business goals (comma separated)"
        />
      </div>

      <div>
        <Label htmlFor="target_users">Target Users</Label>
        <Textarea
          id="target_users"
          rows={2}
          {...register("target_users")}
          placeholder="Describe your target user personas (comma separated)"
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
