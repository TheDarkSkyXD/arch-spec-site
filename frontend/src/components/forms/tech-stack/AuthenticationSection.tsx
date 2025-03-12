import { UseFormRegister, Control, UseFormSetValue } from "react-hook-form";
import { TechStackFormData } from "../tech-stack/techStackSchema";
import { useEffect, useRef } from "react";
import { ProjectTechStack } from "../../../types/templates";

// Import shadcn UI components
import { Label } from "../../ui/label";
import { Select } from "../../ui/select";

interface AuthenticationSectionProps {
  register: UseFormRegister<TechStackFormData>;
  authProviders: string[];
  authMethods: string[];
  control: Control<TechStackFormData>;
  setValue: UseFormSetValue<TechStackFormData>;
  initialData?: ProjectTechStack;
}

const AuthenticationSection = ({
  register,
  authProviders,
  authMethods,
  setValue,
  initialData,
}: AuthenticationSectionProps) => {
  // Create a ref to track whether we've applied initial data
  const initialDataAppliedRef = useRef<boolean>(false);

  // Reset form values if templateId is null
  useEffect(() => {
    if (!initialData) {
      setValue("auth_provider", "", { shouldDirty: false });
      setValue("auth_methods", "", { shouldDirty: false });
    }
  }, [initialData, setValue]);

  // Set initial values if they exist
  useEffect(() => {
    if (!initialData) return;

    console.log(
      "Checking initial data for authentication section:",
      initialData
    );

    // Track values that were successfully set
    let valuesWereSet = false;

    // Check and set auth provider
    if (initialData.authentication.provider) {
      // For simplicity, we're not validating auth_provider against a list of options
      setValue("auth_provider", initialData.authentication.provider, {
        shouldDirty: true,
      });
      console.log(
        "Setting initial auth provider:",
        initialData.authentication.provider
      );
      valuesWereSet = true;
    }

    // Check and set auth methods
    if (
      initialData.authentication.methods &&
      initialData.authentication.methods.length > 0
    ) {
      // get the first method
      const firstMethod = initialData.authentication.methods[0];
      setValue("auth_methods", firstMethod, {
        shouldDirty: true,
      });
      console.log("Setting initial auth methods:", firstMethod);
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
        Authentication
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="auth_provider">Provider</Label>
          <Select id="auth_provider" {...register("auth_provider")}>
            <option value="">Select Auth Provider</option>
            {authProviders.map((auth) => (
              <option key={auth} value={auth}>
                {auth}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="auth_methods">Methods</Label>
          <Select id="auth_methods" {...register("auth_methods")}>
            <option value="">Select Auth Methods</option>
            {authMethods.map((auth) => (
              <option key={auth} value={auth}>
                {auth}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationSection;
