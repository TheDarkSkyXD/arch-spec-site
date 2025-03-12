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
        showToast({
          title: "Success",
          description: isEditMode
            ? "Project updated successfully"
            : "Project created successfully",
          type: "success",
        });

        if (onSuccess) {
          onSuccess(project.id);
        }
      } else {
        showToast({
          title: "Error",
          description: isEditMode
            ? "Failed to update project"
            : "Failed to create project",
          type: "error",
        });
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
