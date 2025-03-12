import { UseFormRegister, Control, UseFormSetValue } from "react-hook-form";
import { TechStackFormData } from "./techStackSchema";
import { useEffect, useRef } from "react";
import { ProjectTechStack } from "../../../types/templates";
import { Technology } from "../../../types/techStack";

interface StorageSectionProps {
  register: UseFormRegister<TechStackFormData>;
  storageOptions: Technology[];
  control: Control<TechStackFormData>;
  setValue: UseFormSetValue<TechStackFormData>;
  initialData?: ProjectTechStack;
}

const StorageSection = ({
  register,
  storageOptions,
  setValue,
  initialData,
}: StorageSectionProps) => {
  // Create a ref to track whether we've applied initial data
  const initialDataAppliedRef = useRef<boolean>(false);

  // Reset form values if templateId is null
  useEffect(() => {
    if (!initialData) {
      console.log("Resetting storage section form values");
      setValue("storage_type", "", { shouldDirty: false });
      setValue("storage_service", "", { shouldDirty: false });
    }
  }, [initialData, setValue]);

  // Set initial values if they exist
  useEffect(() => {
    if (!initialData || !initialData.storage) return;

    console.log(
      "Checking initial data for storage section:",
      initialData.storage
    );

    // Track values that were successfully set
    let valuesWereSet = false;

    // Check and set storage type
    if (initialData.storage.type) {
      setValue("storage_type", initialData.storage.type, {
        shouldDirty: true,
      });
      console.log("Setting initial storage type:", initialData.storage.type);
      valuesWereSet = true;
    }

    // Check and set storage service
    if (initialData.storage.service) {
      setValue("storage_service", initialData.storage.service, {
        shouldDirty: true,
      });
      console.log(
        "Setting initial storage service:",
        initialData.storage.service
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
        Storage
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="storage_type"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Storage Type
          </label>
          <select
            id="storage_type"
            {...register("storage_type")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Select Storage Type</option>
            <option value="objectStorage">Object Storage</option>
            <option value="fileSystem">File System</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="storage_service"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Storage Service
          </label>
          <select
            id="storage_service"
            {...register("storage_service")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Select Storage Service</option>
            {storageOptions.map((option) => (
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

export default StorageSection;
