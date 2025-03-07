import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const projectBasicsSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  business_goals: z.string().optional(),
  target_users: z.string().optional(),
});

type ProjectBasicsFormData = z.infer<typeof projectBasicsSchema>;

interface ProjectBasicsFormProps {
  initialData?: Partial<ProjectBasicsFormData>;
  onSubmit: (data: ProjectBasicsFormData) => void;
  onBack?: () => void;
}

const ProjectBasicsForm = ({
  initialData,
  onSubmit,
  onBack,
}: ProjectBasicsFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectBasicsFormData>({
    resolver: zodResolver(projectBasicsSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      business_goals: "",
      target_users: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Project Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`mt-1 input ${
            errors.name ? "border-red-500 focus:ring-red-500" : ""
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className={`mt-1 input ${
            errors.description ? "border-red-500 focus:ring-red-500" : ""
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="business_goals"
          className="block text-sm font-medium text-gray-700"
        >
          Business Goals
        </label>
        <textarea
          id="business_goals"
          rows={2}
          {...register("business_goals")}
          className="mt-1 input"
        />
      </div>

      <div>
        <label
          htmlFor="target_users"
          className="block text-sm font-medium text-gray-700"
        >
          Target Users
        </label>
        <input
          id="target_users"
          type="text"
          {...register("target_users")}
          className="mt-1 input"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        {onBack && (
          <button type="button" onClick={onBack} className="btn btn-secondary">
            Back
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? "Saving..." : "Next"}
        </button>
      </div>
    </form>
  );
};

export default ProjectBasicsForm;
