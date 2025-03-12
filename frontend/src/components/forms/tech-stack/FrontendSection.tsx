import {
  UseFormRegister,
  FormState,
  FieldError,
  useWatch,
  Control,
  UseFormSetValue,
} from "react-hook-form";
import {
  Technology,
  UILibrary,
  StateManagement,
} from "../../../types/techStack";
import { TechStackFormData } from "../tech-stack/techStackSchema";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import {
  filterLanguageOptions,
  filterFrameworkOptions,
  filterUILibraryOptions,
  filterStateManagementOptions,
} from "../../../utils/techStackFilterUtils";
import { ProjectTechStack } from "../../../types/templates";

// Import shadcn UI components
import { Label } from "../../ui/label";
import { Select } from "../../ui/select";

interface FrontendSectionProps {
  register: UseFormRegister<TechStackFormData>;
  errors: FormState<TechStackFormData>["errors"];
  frontendFrameworks: Technology[];
  uiLibraryOptions: UILibrary[];
  stateManagementOptions: StateManagement[];
  control: Control<TechStackFormData>;
  setValue: UseFormSetValue<TechStackFormData>;
  initialData?: ProjectTechStack;
}

const FrontendSection = ({
  register,
  errors,
  frontendFrameworks,
  uiLibraryOptions,
  stateManagementOptions,
  control,
  setValue,
  initialData,
}: FrontendSectionProps) => {
  // Create a ref to track whether we've applied initial data
  const initialDataAppliedRef = useRef<boolean>(false);

  // Helper function to safely get error message
  const getErrorMessage = (error: FieldError | undefined): ReactNode => {
    return error?.message as ReactNode;
  };

  // Watch for form value changes
  const watchedValues = useWatch({
    control,
    name: ["frontend", "frontend_language", "ui_library", "state_management"],
  });

  const [
    selectedFramework,
    selectedLanguage,
    selectedUILibrary,
    selectedStateManagement,
  ] = watchedValues;

  // Reset form values if templateId is null
  useEffect(() => {
    if (!initialData) {
      setValue("frontend", "", { shouldDirty: false });
      setValue("frontend_language", "", { shouldDirty: false });
      setValue("ui_library", "", { shouldDirty: false });
      setValue("state_management", "", { shouldDirty: false });
    }
  }, [initialData, setValue]);

  // Debug log for watched values
  // useEffect(() => {
  //   console.log("Selected Frontend values:", {
  //     framework: selectedFramework,
  //     language: selectedLanguage,
  //     uiLibrary: selectedUILibrary,
  //     stateManagement: selectedStateManagement,
  //   });
  // }, [
  //   selectedFramework,
  //   selectedLanguage,
  //   selectedUILibrary,
  //   selectedStateManagement,
  // ]);

  const filteredLanguages = useMemo(
    () =>
      filterLanguageOptions(
        selectedFramework,
        selectedUILibrary,
        selectedStateManagement,
        frontendFrameworks,
        uiLibraryOptions,
        stateManagementOptions
      ),
    [
      selectedFramework,
      selectedUILibrary,
      selectedStateManagement,
      frontendFrameworks,
      uiLibraryOptions,
      stateManagementOptions,
    ]
  );

  const filteredFrameworks = useMemo(
    () =>
      filterFrameworkOptions(
        selectedLanguage,
        selectedUILibrary,
        selectedStateManagement,
        frontendFrameworks,
        uiLibraryOptions,
        stateManagementOptions
      ),
    [
      selectedLanguage,
      selectedUILibrary,
      selectedStateManagement,
      frontendFrameworks,
      uiLibraryOptions,
      stateManagementOptions,
    ]
  );

  const filteredUILibraries = useMemo(
    () =>
      filterUILibraryOptions(
        selectedFramework,
        selectedLanguage,
        selectedStateManagement,
        frontendFrameworks,
        uiLibraryOptions,
        stateManagementOptions
      ),
    [
      selectedFramework,
      selectedLanguage,
      selectedStateManagement,
      frontendFrameworks,
      uiLibraryOptions,
      stateManagementOptions,
    ]
  );

  const filteredStateManagement = useMemo(
    () =>
      filterStateManagementOptions(
        selectedFramework,
        selectedLanguage,
        selectedUILibrary,
        frontendFrameworks,
        uiLibraryOptions,
        stateManagementOptions
      ),
    [
      selectedFramework,
      selectedLanguage,
      selectedUILibrary,
      frontendFrameworks,
      uiLibraryOptions,
      stateManagementOptions,
    ]
  );

  // Check if initial values exist in the available options and set them as defaults
  useEffect(() => {
    if (!initialData || initialDataAppliedRef.current) return;

    console.log("Checking initial data for frontend section:", initialData);

    // Track values that were successfully set
    let valuesWereSet = false;

    // Check and set each value if it exists in options
    if (!selectedFramework && initialData.frontend) {
      const frameworkExists = filteredFrameworks.some(
        (framework) => framework.id === initialData.frontend.framework
      );
      if (frameworkExists) {
        setValue("frontend", initialData.frontend.framework, {
          shouldDirty: true,
        });
        console.log("Setting initial framework:", initialData.frontend);
        valuesWereSet = true;
      } else {
        console.log(
          "Initial framework not available in options:",
          initialData.frontend
        );
      }
    }

    if (!selectedLanguage && initialData.frontend.language) {
      const languageExists = filteredLanguages.includes(
        initialData.frontend.language
      );
      if (languageExists) {
        setValue("frontend_language", initialData.frontend.language, {
          shouldDirty: true,
        });
        console.log("Setting initial language:", initialData.frontend.language);
        valuesWereSet = true;
      } else {
        console.log(
          "Initial language not available in options:",
          initialData.frontend.language
        );
      }
    }

    if (!selectedUILibrary && initialData.frontend.uiLibrary) {
      const uiLibraryExists = filteredUILibraries.some(
        (lib) => lib.id === initialData.frontend.uiLibrary
      );
      if (uiLibraryExists) {
        setValue("ui_library", initialData.frontend.uiLibrary, {
          shouldDirty: true,
        });
        console.log(
          "Setting initial UI library:",
          initialData.frontend.uiLibrary
        );
        valuesWereSet = true;
      } else {
        console.log(
          "Initial UI library not available in options:",
          initialData.frontend.uiLibrary
        );
      }
    }

    if (!selectedStateManagement && initialData.frontend.stateManagement) {
      const stateManagementExists = filteredStateManagement.some(
        (sm) => sm.id === initialData.frontend.stateManagement
      );
      if (stateManagementExists) {
        setValue("state_management", initialData.frontend.stateManagement, {
          shouldDirty: true,
        });
        console.log(
          "Setting initial state management:",
          initialData.frontend.stateManagement
        );
        valuesWereSet = true;
      } else {
        console.log(
          "Initial state management not available in options:",
          initialData.frontend.stateManagement
        );
      }
    }

    // Mark as applied if any values were set
    if (valuesWereSet) {
      initialDataAppliedRef.current = true;
    }
  }, [
    initialData,
    filteredFrameworks,
    filteredLanguages,
    filteredUILibraries,
    filteredStateManagement,
    selectedFramework,
    selectedLanguage,
    selectedUILibrary,
    selectedStateManagement,
    setValue,
  ]);

  return (
    <div>
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">
        Frontend
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="frontend">Framework</Label>
          <Select
            id="frontend"
            {...register("frontend")}
            error={errors.frontend?.message?.toString()}
          >
            <option value="">Select Framework</option>
            {filteredFrameworks.map((framework) => (
              <option key={framework.id} value={framework.id}>
                {framework.id}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="frontend_language">Language</Label>
          <Select
            id="frontend_language"
            {...register("frontend_language")}
            error={errors.frontend_language?.message?.toString()}
          >
            <option value="">Select Language</option>
            {filteredLanguages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="ui_library">UI Library</Label>
          <Select id="ui_library" {...register("ui_library")}>
            <option value="">Select UI Library</option>
            {filteredUILibraries.map((lib) => (
              <option key={lib.id} value={lib.id}>
                {lib.id}
              </option>
            ))}
          </Select>
        </div>

        {/* State Management dropdown */}
        <div>
          <Label htmlFor="state_management">State Management</Label>
          <Select id="state_management" {...register("state_management")}>
            <option value="">Select State Management</option>
            {filteredStateManagement.map((sm) => (
              <option key={sm.id} value={sm.id}>
                {sm.id}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FrontendSection;
