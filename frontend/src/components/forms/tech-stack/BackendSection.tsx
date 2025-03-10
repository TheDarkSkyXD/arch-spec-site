import {
  UseFormRegister,
  FormState,
  FieldError,
  Control,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { Technology } from "../../../types/techStack";
import { TechStackFormData } from "../tech-stack/techStackSchema";
import { ReactNode, useEffect, useRef } from "react";
import { TechStack } from "../../../types/templates";

interface BackendSectionProps {
  register: UseFormRegister<TechStackFormData>;
  errors: FormState<TechStackFormData>["errors"];
  backendFrameworks: Technology[];
  setValue: UseFormSetValue<TechStackFormData>;
  control: Control<TechStackFormData>;
  initialData?: TechStack;
}

const BackendSection = ({
  register,
  errors,
  backendFrameworks,
  control,
  setValue,
  initialData,
}: BackendSectionProps) => {
  // Create a ref to track whether we've applied initial data
  const initialDataAppliedRef = useRef<boolean>(false);

  // Helper function to safely get error message
  const getErrorMessage = (error: FieldError | undefined): ReactNode => {
    return error?.message as ReactNode;
  };

  useEffect(() => {
    console.log("backendFrameworks:", backendFrameworks);
  }, [backendFrameworks]);

  const watchedValues = useWatch({
    control,
    name: ["backend", "backend_provider"],
  });

  const [selectedBackend, selectedBackendProvider] = watchedValues;

  console.log("Selected Backend values:", {
    backend: selectedBackend,
    backendProvider: selectedBackendProvider,
  });

  // Set initial values if they exist in the available options
  useEffect(() => {
    if (!initialData || initialDataAppliedRef.current) return;

    console.log("Checking initial data for backend section:", initialData);

    // Track values that were successfully set
    let valuesWereSet = false;

    // Check and set backend if it exists in options
    if (initialData.backend) {
      const backendExists = backendFrameworks.some(
        (framework) => framework.id === initialData.backend
      );
      if (backendExists) {
        setValue("backend", initialData.backend, { shouldDirty: true });
        console.log("Setting initial backend:", initialData.backend);
        valuesWereSet = true;
      } else {
        console.log(
          "Initial backend not available in options:",
          initialData.backend
        );
      }
    }

    // Check and set backend provider
    if (initialData.backend_provider) {
      // For simplicity, we're not validating backend_provider against a list of options
      setValue("backend_provider", initialData.backend_provider, {
        shouldDirty: true,
      });
      console.log(
        "Setting initial backend provider:",
        initialData.backend_provider
      );
      valuesWereSet = true;
    }

    // Mark as applied if any values were set
    if (valuesWereSet) {
      initialDataAppliedRef.current = true;
    }
  }, [initialData, backendFrameworks, setValue]);

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
            {backendFrameworks.map((framework, index) => {
              // Use the id property added in TechStackForm
              const id = (framework as any).id || `backend-framework-${index}`;
              return (
                <option key={id} value={id}>
                  {id}
                </option>
              );
            })}
          </select>
          {errors.backend && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {getErrorMessage(errors.backend)}
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
