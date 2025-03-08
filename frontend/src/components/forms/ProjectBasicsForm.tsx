import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const projectBasicsSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  business_goals: z.string().optional(),
  target_users: z.string().optional(),
  domain: z.string().optional(),
  organization: z.string().optional(),
  project_lead: z.string().optional(),
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
      domain: "",
      organization: "",
      project_lead: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700"
        >
          Project Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm ${
            errors.name ? "border-red-500 focus:ring-red-500" : ""
          }`}
          placeholder="Enter project name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className={`mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm ${
            errors.description ? "border-red-500 focus:ring-red-500" : ""
          }`}
          placeholder="Describe your project"
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
          className="block text-sm font-medium text-slate-700"
        >
          Business Goals
        </label>
        <textarea
          id="business_goals"
          rows={2}
          {...register("business_goals")}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
          placeholder="What business problems are you trying to solve? (Comma separated)"
        />
      </div>

      <div>
        <label
          htmlFor="target_users"
          className="block text-sm font-medium text-slate-700"
        >
          Target Users
        </label>
        <input
          id="target_users"
          type="text"
          {...register("target_users")}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
          placeholder="Who will use this product? (Comma separated)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="domain"
            className="block text-sm font-medium text-slate-700"
          >
            Business Domain
          </label>
          <input
            id="domain"
            type="text"
            {...register("domain")}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
            placeholder="e.g. Healthcare, Finance, Education"
          />
        </div>

        <div>
          <label
            htmlFor="organization"
            className="block text-sm font-medium text-slate-700"
          >
            Organization
          </label>
          <input
            id="organization"
            type="text"
            {...register("organization")}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
            placeholder="Your organization name"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="project_lead"
          className="block text-sm font-medium text-slate-700"
        >
          Project Lead
        </label>
        <input
          id="project_lead"
          type="text"
          {...register("project_lead")}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
          placeholder="Who is leading this project?"
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </form>
  );
};

export default ProjectBasicsForm;
