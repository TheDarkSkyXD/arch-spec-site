import { UseFormRegister, FormState } from "react-hook-form";
import { Technology } from "../../../types/techStack";

interface BackendSectionProps {
  register: UseFormRegister<any>;
  errors: FormState<any>["errors"];
  backendFrameworks: Technology[];
}

const BackendSection = ({
  register,
  errors,
  backendFrameworks,
}: BackendSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">
        Backend
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="backend"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Framework
          </label>
          <select
            id="backend"
            {...register("backend")}
            className={`mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
              errors.backend ? "border-red-500 focus:ring-red-500" : ""
            }`}
          >
            <option value="">Select Backend Framework</option>
            {backendFrameworks.map((framework) => (
              <option key={framework.name} value={framework.name}>
                {framework.name}
              </option>
            ))}
          </select>
          {errors.backend && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.backend.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="backend_provider"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Provider (if applicable)
          </label>
          <select
            id="backend_provider"
            {...register("backend_provider")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Select Provider</option>
            <option value="AWS Lambda">AWS Lambda</option>
            <option value="Vercel">Vercel</option>
            <option value="Netlify">Netlify</option>
            <option value="Firebase">Firebase</option>
            <option value="Supabase">Supabase</option>
            <option value="Self-hosted">Self-hosted</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BackendSection;