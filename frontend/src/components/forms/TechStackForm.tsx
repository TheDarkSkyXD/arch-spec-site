import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  TechStackData,
  TechStackSelection,
  CompatibilityResult,
  CompatibleOptionsResponse,
  Technology,
} from "../../types/techStack";
import { techStackService } from "../../services/techStackService";

const techStackSchema = z.object({
  frontend: z.string().min(1, "Frontend framework is required"),
  frontend_language: z.string().min(1, "Frontend language is required"),
  ui_library: z.string().optional(),
  state_management: z.string().optional(),
  backend: z.string().min(1, "Backend type is required"),
  backend_provider: z.string().optional(),
  database: z.string().min(1, "Database type is required"),
  orm: z.string().optional(),
  database_provider: z.string().optional(),
  auth_provider: z.string().optional(),
  auth_methods: z.string().optional(),
});

type TechStackFormData = z.infer<typeof techStackSchema>;

interface TechStackFormProps {
  initialData?: Partial<TechStackFormData>;
  onSubmit: (data: TechStackFormData) => void;
  onBack: () => void;
}

const TechStackForm = ({
  initialData,
  onSubmit,
  onBack,
}: TechStackFormProps) => {
  // State for compatibility tracking
  const [compatibilityIssues, setCompatibilityIssues] = useState<string[]>([]);
  const [techStackOptions, setTechStackOptions] =
    useState<TechStackData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State for filtered/compatible options
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

  // Watch for form value changes to update compatibility
  const watchedValues = useWatch({
    control,
    name: [
      "frontend",
      "backend",
      "database",
      "ui_library",
      "state_management",
      "orm",
    ],
  });

  const [frontend, backend, database, uiLibrary, stateManagement, orm] =
    watchedValues;

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

  // Check compatibility when form values change
  useEffect(() => {
    const checkCompatibility = async () => {
      // Skip if not enough options are selected
      if (!frontend && !backend && !database) return;

      try {
        // Create current selection object
        const currentSelection: TechStackSelection = {
          frontend_framework: frontend || undefined,
          state_management: stateManagement || undefined,
          ui_library: uiLibrary || undefined,
          backend_framework: backend || undefined,
          database: database || undefined,
          orm: orm || undefined,
        };

        // Only send API request if we have at least two selections
        const selectionCount =
          Object.values(currentSelection).filter(Boolean).length;
        if (selectionCount < 2) {
          setCompatibilityIssues([]);
          return;
        }

        // Send to backend for compatibility check
        const result = await techStackService.checkCompatibility(
          currentSelection
        );

        // Update issues and compatible options
        setCompatibilityIssues(result.compatibility_issues);

        // Update compatible options based on response
        if (result.compatible_options) {
          if (result.compatible_options.ui_libraries) {
            setUiLibraryOptions(result.compatible_options.ui_libraries);
          }
          if (result.compatible_options.state_management) {
            setStateManagementOptions(
              result.compatible_options.state_management
            );
          }
          if (result.compatible_options.databases) {
            setDatabaseOptions(result.compatible_options.databases);
          }
          if (result.compatible_options.orms) {
            setOrmOptions(result.compatible_options.orms);
          }
          if (result.compatible_options.auth) {
            setAuthOptions(result.compatible_options.auth);
          }
        }
      } catch (error) {
        console.error("Error checking compatibility:", error);
      }
    };

    checkCompatibility();
  }, [frontend, backend, database, uiLibrary, stateManagement, orm]);

  // Update compatible options when a selection is made
  useEffect(() => {
    const fetchCompatibleOptions = async (
      category: string,
      technology: string
    ) => {
      if (!category || !technology) return;

      try {
        const result = await techStackService.getCompatibleOptions(
          category,
          technology
        );
        const options = result.options;

        // Update specific option lists based on the response
        if (options.state_management) {
          setStateManagementOptions(options.state_management);
        }
        if (options.ui_libraries) {
          setUiLibraryOptions(options.ui_libraries);
        }
        if (options.databases) {
          setDatabaseOptions(options.databases);
        }
        if (options.orms) {
          setOrmOptions(options.orms);
        }
        if (options.auth) {
          setAuthOptions(options.auth);
        }
      } catch (error) {
        console.error(
          `Error fetching compatible options for ${category} - ${technology}:`,
          error
        );
      }
    };

    // Fetch compatible options when frontend changes
    if (frontend) {
      fetchCompatibleOptions("frontend_framework", frontend);
    }

    // Fetch compatible options when backend changes
    if (backend) {
      fetchCompatibleOptions("backend_framework", backend);
    }

    // Fetch compatible options when database changes
    if (database) {
      fetchCompatibleOptions("database", database);
    }
  }, [frontend, backend, database]);

  if (isLoading || !techStackOptions) {
    return <div className="p-4">Loading tech stack options...</div>;
  }

  // Helper function to get frameworks from the updated TechStackData structure
  const getFrontendFrameworks = (): Technology[] => {
    return techStackOptions?.frontend?.frameworks || [];
  };

  // Helper function to get backend frameworks from the updated TechStackData structure
  const getBackendFrameworks = (): Technology[] => {
    return techStackOptions?.backend?.frameworks || [];
  };

  // Helper function to get all databases (SQL and NoSQL)
  const getAllDatabases = (): Technology[] => {
    const sqlDatabases = techStackOptions?.database?.sql || [];
    const nosqlDatabases = techStackOptions?.database?.nosql || [];
    return [...sqlDatabases, ...nosqlDatabases];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Compatibility Issues Warning */}
      {compatibilityIssues.length > 0 && (
        <div className="p-3 bg-yellow-50 border border-yellow-300 rounded text-yellow-800">
          <h3 className="font-semibold">Compatibility Issues:</h3>
          <ul className="list-disc list-inside">
            {compatibilityIssues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm">
            You can still proceed, but these combinations may cause integration
            problems.
          </p>
        </div>
      )}

      {/* Frontend Section */}
      <div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">
          Frontend
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="frontend"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Framework
            </label>
            <select
              id="frontend"
              {...register("frontend")}
              className={`mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                errors.frontend ? "border-red-500 focus:ring-red-500" : ""
              }`}
            >
              <option value="">Select Framework</option>
              {getFrontendFrameworks().map((framework) => (
                <option key={framework.name} value={framework.name}>
                  {framework.name}
                </option>
              ))}
            </select>
            {errors.frontend && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.frontend.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="frontend_language"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Language
            </label>
            <select
              id="frontend_language"
              {...register("frontend_language")}
              className={`mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                errors.frontend_language
                  ? "border-red-500 focus:ring-red-500"
                  : ""
              }`}
            >
              <option value="">Select Language</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
            </select>
            {errors.frontend_language && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.frontend_language.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="ui_library"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              UI Library
            </label>
            <select
              id="ui_library"
              {...register("ui_library")}
              className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              disabled={!frontend || uiLibraryOptions.length === 0}
            >
              <option value="">Select UI Library</option>
              {uiLibraryOptions.map((lib) => (
                <option key={lib} value={lib}>
                  {lib}
                </option>
              ))}
            </select>
          </div>

          {/* State Management dropdown */}
          {frontend && (
            <div>
              <label
                htmlFor="state_management"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                State Management
              </label>
              <select
                id="state_management"
                {...register("state_management")}
                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                disabled={stateManagementOptions.length === 0}
              >
                <option value="">Select State Management</option>
                {stateManagementOptions.map((sm) => (
                  <option key={sm} value={sm}>
                    {sm}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Backend Section */}
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
              {getBackendFrameworks().map((framework) => (
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

      {/* Database Section */}
      <div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">
          Database
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="database"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Type
            </label>
            <select
              id="database"
              {...register("database")}
              className={`mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                errors.database ? "border-red-500 focus:ring-red-500" : ""
              }`}
              disabled={!backend || databaseOptions.length === 0}
            >
              <option value="">Select Database Type</option>
              {databaseOptions.length > 0
                ? databaseOptions.map((db) => (
                    <option key={db} value={db}>
                      {db}
                    </option>
                  ))
                : getAllDatabases().map((db) => (
                    <option key={db.name} value={db.name}>
                      {db.name}
                    </option>
                  ))}
            </select>
            {errors.database && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.database.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="database_provider"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Provider (if applicable)
            </label>
            <select
              id="database_provider"
              {...register("database_provider")}
              className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="">Select Provider</option>
              <option value="AWS RDS">AWS RDS</option>
              <option value="Supabase">Supabase</option>
              <option value="MongoDB Atlas">MongoDB Atlas</option>
              <option value="Firebase">Firebase</option>
              <option value="Self-hosted">Self-hosted</option>
            </select>
          </div>

          {/* ORM/Database Access dropdown */}
          {database && (
            <div>
              <label
                htmlFor="orm"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                ORM / Database Access
              </label>
              <select
                id="orm"
                {...register("orm")}
                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                disabled={ormOptions.length === 0}
              >
                <option value="">Select ORM</option>
                {ormOptions.map((orm) => (
                  <option key={orm} value={orm}>
                    {orm}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Section */}
      <div>
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">
          Authentication
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="auth_provider"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Provider
            </label>
            <select
              id="auth_provider"
              {...register("auth_provider")}
              className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              disabled={!backend || authOptions.length === 0}
            >
              <option value="">Select Auth Provider</option>
              {authOptions.map((auth) => (
                <option key={auth} value={auth}>
                  {auth}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="auth_methods"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Methods
            </label>
            <select
              id="auth_methods"
              {...register("auth_methods")}
              className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="">Select Auth Methods</option>
              <option value="Email/Password">Email/Password</option>
              <option value="Social">Social Logins</option>
              <option value="Email/Password + Social">
                Email/Password + Social
              </option>
              <option value="SSO">SSO</option>
              <option value="Multi-factor">Multi-factor Authentication</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 rounded-md text-sm font-medium text-white hover:bg-primary-700"
        >
          {isSubmitting ? "Saving..." : "Continue"}
        </button>
      </div>

      {/* Display compatibility status */}
      {(frontend || backend || database) && (
        <div
          className={`p-3 rounded ${
            compatibilityIssues.length === 0
              ? "bg-green-50 text-green-700"
              : "bg-yellow-50 text-yellow-700"
          }`}
        >
          <p className="font-medium">
            {compatibilityIssues.length === 0
              ? "✓ Your selected tech stack is compatible"
              : "⚠️ There are some compatibility issues with your selection"}
          </p>
        </div>
      )}
    </form>
  );
};

export default TechStackForm;
