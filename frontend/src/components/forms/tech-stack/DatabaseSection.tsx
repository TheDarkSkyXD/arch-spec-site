import {
  UseFormRegister,
  FormState,
  FieldError,
  Control,
} from "react-hook-form";
import { Technology } from "../../../types/techStack";
import { TechStackFormData } from "../tech-stack/techStackSchema";
import { ReactNode, useEffect, useRef } from "react";
import { ProjectTechStack } from "../../../types/templates";
interface DatabaseSectionProps {
  register: UseFormRegister<TechStackFormData>;
  errors: FormState<TechStackFormData>["errors"];
  backend: string | undefined;
  database: string | undefined;
  databaseOptions: string[];
  ormOptions: string[];
  allDatabases: Technology[];
  initialData?: ProjectTechStack;
  control: Control<TechStackFormData>;
}

const DatabaseSection = ({
  register,
  errors,
  backend,
  database,
  databaseOptions,
  ormOptions,
  allDatabases,
  initialData,
  control,
}: DatabaseSectionProps) => {
  // Get setValue from control prop
  const setValue = control.setValue;

  // Create a ref to track whether we've applied initial data
  const initialDataAppliedRef = useRef<boolean>(false);

  // Helper function to safely get error message
  const getErrorMessage = (error: FieldError | undefined): ReactNode => {
    return error?.message as ReactNode;
  };

  // Set initial values if they exist in the available options
  useEffect(() => {
    if (!initialData || initialDataAppliedRef.current) return;

    console.log("Checking initial data for database section:", initialData);

    // Track values that were successfully set
    let valuesWereSet = false;

    // Check and set database if it exists in options
    if (initialData.database) {
      const dbExists = allDatabases.some(
        (db) => db.id === initialData.database
      );
      if (dbExists) {
        setValue("database", initialData.database, { shouldDirty: true });
        console.log("Setting initial database:", initialData.database);
        valuesWereSet = true;
      } else {
        console.log(
          "Initial database not available in options:",
          initialData.database
        );
      }
    }

    // Check and set database provider
    if (initialData.database_provider) {
      // For simplicity, we're not validating database_provider against a list of options
      setValue("database_provider", initialData.database_provider, {
        shouldDirty: true,
      });
      console.log(
        "Setting initial database provider:",
        initialData.database_provider
      );
      valuesWereSet = true;
    }

    // Check and set ORM
    if (initialData.orm) {
      // For simplicity, we're not validating orm against a list of options
      setValue("orm", initialData.orm, { shouldDirty: true });
      console.log("Setting initial ORM:", initialData.orm);
      valuesWereSet = true;
    }

    // Mark as applied if any values were set
    if (valuesWereSet) {
      initialDataAppliedRef.current = true;
    }
  }, [initialData, allDatabases, setValue]);

  return (
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
              : allDatabases.map((db, index) => {
                  // Use the id property added in TechStackForm
                  const id = (db as any).id || `database-${index}`;
                  return (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  );
                })}
          </select>
          {errors.database && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {getErrorMessage(errors.database)}
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
  );
};

export default DatabaseSection;
