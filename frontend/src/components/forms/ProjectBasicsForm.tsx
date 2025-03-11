import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { projectsService } from "../../services/projectsService";
import { useToast } from "../../contexts/ToastContext";

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
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Project Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
            errors.name ? "border-red-500 focus:ring-red-500" : ""
          }`}
          placeholder="Enter project name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className={`mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
            errors.description ? "border-red-500 focus:ring-red-500" : ""
          }`}
          placeholder="Describe your project"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="business_goals"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Business Goals
        </label>
        <textarea
          id="business_goals"
          rows={2}
          {...register("business_goals")}
          className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          placeholder="List your key business goals (comma separated)"
        />
      </div>

      <div>
        <label
          htmlFor="target_users"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Target Users
        </label>
        <textarea
          id="target_users"
          rows={2}
          {...register("target_users")}
          className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          placeholder="Describe your target user personas (comma separated)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="domain"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Domain
          </label>
          <input
            id="domain"
            type="text"
            {...register("domain")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            placeholder="e.g. Healthcare, Finance, Education"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
            ? "Update Project"
            : "Save Project"}
        </button>
      </div>
    </form>
  );
};

export default ProjectBasicsForm;
