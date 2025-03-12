import { UseFormRegister, Control, UseFormSetValue } from "react-hook-form";
import { TechStackFormData } from "./techStackSchema";
import { useEffect, useRef } from "react";
import { ProjectTechStack } from "../../../types/templates";
import { Technology } from "../../../types/techStack";

// Import shadcn UI components
import { Label } from "../../ui/label";
import { Select } from "../../ui/select";

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
          <Label htmlFor="storage_type">Storage Type</Label>
          <Select id="storage_type" {...register("storage_type")}>
            <option value="">Select Storage Type</option>
            <option value="objectStorage">Object Storage</option>
            <option value="fileSystem">File System</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="storage_service">Storage Service</Label>
          <Select id="storage_service" {...register("storage_service")}>
            <option value="">Select Storage Service</option>
            {storageOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.id}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StorageSection;
