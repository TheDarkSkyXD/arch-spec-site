import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { TechStackData, Technology } from "../../types/techStack";
import { techStackService } from "../../services/techStackService";

// Import schema
import {
  techStackSchema,
  TechStackFormData,
} from "./tech-stack/techStackSchema";

// Import section components
import FrontendSection from "./tech-stack/FrontendSection";
import BackendSection from "./tech-stack/BackendSection";
import DatabaseSection from "./tech-stack/DatabaseSection";
import AuthenticationSection from "./tech-stack/AuthenticationSection";

interface TechStackFormProps {
  initialData?: Partial<TechStackFormData>;
  onSubmit: (data: TechStackFormData) => void;
  onBack?: () => void;
}

const TechStackForm = ({
  initialData,
  onSubmit,
  onBack,
}: TechStackFormProps) => {
  // State for options
  const [techStackOptions, setTechStackOptions] =
    useState<TechStackData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State for filtered options
  const [uiLibraryOptions, setUiLibraryOptions] = useState<string[]>([]);
  const [stateManagementOptions, setStateManagementOptions] = useState<
    string[]
  >([]);
  const [databaseOptions, setDatabaseOptions] = useState<string[]>([]);
  const [ormOptions, setOrmOptions] = useState<string[]>([]);
  const [authOptions, setAuthOptions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TechStackFormData>({
    resolver: zodResolver(techStackSchema),
    defaultValues: initialData || {
      frontend: "",
      frontend_language: "",
      ui_library: "",
      state_management: "",
      backend: "",
      backend_provider: "",
      database: "",
      orm: "",
      database_provider: "",
      auth_provider: "",
      auth_methods: "",
    },
  });

  // Watch for form value changes
  const watchedValues = useWatch({
    control,
    name: ["frontend", "backend", "database"],
  });

  const [frontend, backend, database] = watchedValues;

  // Initialize tech stack data from backend
  useEffect(() => {
    const fetchTechStackOptions = async () => {
      setIsLoading(true);
      try {
        const data = await techStackService.getAllTechnologyOptions();
        setTechStackOptions(data);
      } catch (error) {
        console.error("Error fetching tech stack options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechStackOptions();
  }, []);

  // Helper functions to get tech options from the updated TechStackData structure
  const getFrontendFrameworks = (): Technology[] => {
    return techStackOptions?.frontend?.frameworks || [];
  };

  const getBackendFrameworks = (): Technology[] => {
    return techStackOptions?.backend?.frameworks || [];
  };

  const getAllDatabases = (): Technology[] => {
    const sqlDatabases = techStackOptions?.database?.sql || [];
    const nosqlDatabases = techStackOptions?.database?.nosql || [];
    return [...sqlDatabases, ...nosqlDatabases];
  };

  if (isLoading || !techStackOptions) {
    return <div className="p-4">Loading tech stack options...</div>;
  }

  return (
    <form
      id="tech-stack-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      {/* Frontend Section */}
      <FrontendSection
        register={register}
        errors={errors}
        frontendFrameworks={getFrontendFrameworks()}
        uiLibraryOptions={uiLibraryOptions}
        stateManagementOptions={stateManagementOptions}
        frontend={frontend}
      />

      {/* Backend Section */}
      <BackendSection
        register={register}
        errors={errors}
        backendFrameworks={getBackendFrameworks()}
      />

      {/* Database Section */}
      <DatabaseSection
        register={register}
        errors={errors}
        backend={backend}
        database={database}
        databaseOptions={databaseOptions}
        ormOptions={ormOptions}
        allDatabases={getAllDatabases()}
      />

      {/* Authentication Section */}
      <AuthenticationSection
        register={register}
        backend={backend}
        authOptions={authOptions}
      />
    </form>
  );
};

export default TechStackForm;
