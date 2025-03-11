import { UseFormRegister, Control, UseFormSetValue } from "react-hook-form";
import { TechStackFormData } from "./techStackSchema";
import { useEffect, useRef } from "react";
import { ProjectTechStack } from "../../../types/templates";
import { Technology } from "../../../types/techStack";

interface HostingSectionProps {
  register: UseFormRegister<TechStackFormData>;
  hostingFrontendOptions: Technology[];
  hostingBackendOptions: Technology[];
  control: Control<TechStackFormData>;
  setValue: UseFormSetValue<TechStackFormData>;
  initialData?: ProjectTechStack;
}

const HostingSection = ({
  register,
  hostingFrontendOptions,
  hostingBackendOptions,
  setValue,
  initialData,
}: HostingSectionProps) => {
  // Create a ref to track whether we've applied initial data
  const initialDataAppliedRef = useRef<boolean>(false);

  // Set initial values if they exist
  useEffect(() => {
    if (!initialData) return;

    console.log("Checking initial data for hosting section:", initialData);

    // Track values that were successfully set
    let valuesWereSet = false;

    // Check and set frontend hosting
    if (initialData.hosting?.frontend) {
      setValue("hosting_frontend", initialData.hosting.frontend, {
        shouldDirty: true,
      });
      console.log(
        "Setting initial frontend hosting:",
        initialData.hosting.frontend
      );
      valuesWereSet = true;
    }

    // Check and set backend hosting
    if (initialData.hosting?.backend) {
      setValue("hosting_backend", initialData.hosting.backend, {
        shouldDirty: true,
      });
      console.log(
        "Setting initial backend hosting:",
        initialData.hosting.backend
      );
      valuesWereSet = true;
    }

    // Mark as applied if any values were set
    if (valuesWereSet) {
      initialDataAppliedRef.current = true;
    }
  }, [initialData, setValue]);

  return (
    <div>
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">
        Hosting
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="hosting_frontend"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Frontend Hosting
          </label>
          <select
            id="hosting_frontend"
            {...register("hosting_frontend")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Select Frontend Hosting</option>
            {hostingFrontendOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="hosting_backend"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Backend Hosting
          </label>
          <select
            id="hosting_backend"
            {...register("hosting_backend")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Select Backend Hosting</option>
            {hostingBackendOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.id}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default HostingSection;
