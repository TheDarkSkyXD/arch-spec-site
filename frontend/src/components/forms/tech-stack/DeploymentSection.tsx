import { UseFormRegister, Control, UseFormSetValue } from "react-hook-form";
import { TechStackFormData } from "./techStackSchema";
import { useEffect, useRef } from "react";
import { ProjectTechStack } from "../../../types/templates";

interface DeploymentSectionProps {
  register: UseFormRegister<TechStackFormData>;
  deploymentCICDOptions: string[];
  deploymentContainerizationOptions: string[];
  control: Control<TechStackFormData>;
  setValue: UseFormSetValue<TechStackFormData>;
  initialData?: ProjectTechStack;
}

const DeploymentSection = ({
  register,
  deploymentCICDOptions,
  deploymentContainerizationOptions,
  setValue,
  initialData,
}: DeploymentSectionProps) => {
  // Create a ref to track whether we've applied initial data
  const initialDataAppliedRef = useRef<boolean>(false);

  // Reset form values if templateId is null
  useEffect(() => {
    if (!initialData) {
      setValue("deployment_ci_cd", "", { shouldDirty: false });
      setValue("deployment_containerization", "", { shouldDirty: false });
    }
  }, [initialData, setValue]);

  // Set initial values if they exist
  useEffect(() => {
    if (!initialData || !initialData.deployment) return;

    console.log(
      "Checking initial data for deployment section:",
      initialData.deployment
    );

    // Track values that were successfully set
    let valuesWereSet = false;

    // Check and set CI/CD
    if (initialData.deployment.ci_cd) {
      setValue("deployment_ci_cd", initialData.deployment.ci_cd, {
        shouldDirty: true,
      });
      console.log(
        "Setting initial deployment CI/CD:",
        initialData.deployment.ci_cd
      );
      valuesWereSet = true;
    }

    // Check and set containerization
    if (initialData.deployment.containerization) {
      setValue(
        "deployment_containerization",
        initialData.deployment.containerization,
        {
          shouldDirty: true,
        }
      );
      console.log(
        "Setting initial deployment containerization:",
        initialData.deployment.containerization
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
        Deployment
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="deployment_ci_cd"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            CI/CD
          </label>
          <select
            id="deployment_ci_cd"
            {...register("deployment_ci_cd")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Select CI/CD</option>
            {deploymentCICDOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="deployment_containerization"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Containerization
          </label>
          <select
            id="deployment_containerization"
            {...register("deployment_containerization")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Select Containerization</option>
            {deploymentContainerizationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DeploymentSection;
