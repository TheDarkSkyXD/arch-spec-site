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
import { ProjectTechStack } from "../../../types/templates";
interface DatabaseSectionProps {
  register: UseFormRegister<TechStackFormData>;
  errors: FormState<TechStackFormData>["errors"];
  allDatabases: Technology[];
  allDatabaseHosting: string[];
  allOrms: Technology[];
  control: Control<TechStackFormData>;
  setValue: UseFormSetValue<TechStackFormData>;
  initialData?: ProjectTechStack;
}

const DatabaseSection = ({
  register,
  errors,
  allDatabases,
  allDatabaseHosting,
  allOrms,
  initialData,
  control,
  setValue,
}: DatabaseSectionProps) => {
  // Create a ref to track whether we've applied initial data
  const initialDataAppliedRef = useRef<boolean>(false);

  // Helper function to safely get error message
  const getErrorMessage = (error: FieldError | undefined): ReactNode => {
    return error?.message as ReactNode;
  };

  // Watch for form value changes
  const watchedValues = useWatch({
    control,
    name: [
      "database_type",
      "database_system",
      "database_hosting",
      "database_orm",
    ],
  });

  const [
    selectedDatabaseType,
    selectedDatabaseSystem,
    selectedDatabaseHosting,
    selectedDatabaseOrm,
  ] = watchedValues;

  useEffect(() => {
    console.log("Selected database values:", {
      database_type: selectedDatabaseType,
      database_system: selectedDatabaseSystem,
      database_hosting: selectedDatabaseHosting,
      database_orm: selectedDatabaseOrm,
    });
  }, [
    selectedDatabaseType,
    selectedDatabaseSystem,
    selectedDatabaseHosting,
    selectedDatabaseOrm,
  ]);

  // Set initial values if they exist in the available options
  useEffect(() => {
    if (!initialData || initialDataAppliedRef.current) return;

    console.log("Checking initial data for database section:", initialData);

    // Track values that were successfully set
    let valuesWereSet = false;

    // Check and set database type
    if (initialData.database.type) {
      setValue("database_type", initialData.database.type, {
        shouldDirty: true,
      });
      console.log("Setting initial database type:", initialData.database.type);
      valuesWereSet = true;
    }

    // Check and set database if it exists in options
    if (initialData.database.system) {
      const dbExists = allDatabases.some(
        (db) => db.id === initialData.database.system
      );
      if (dbExists) {
        setValue("database_system", initialData.database.system, {
          shouldDirty: true,
        });
        console.log("Setting initial database:", initialData.database.system);
        valuesWereSet = true;
      } else {
        console.log(
          "Initial database system not available in options:",
          initialData.database.system
        );
      }
    }

    // Check and set database provider
    if (initialData.database.hosting) {
      // For simplicity, we're not validating database_hosting against a list of options
      setValue("database_hosting", initialData.database.hosting, {
        shouldDirty: true,
      });
      console.log(
        "Setting initial database provider:",
        initialData.database.hosting
      );
      valuesWereSet = true;
    }

    // Check and set ORM
    if (initialData.database.type === "sql" && initialData.database.orm) {
      // For simplicity, we're not validating orm against a list of options
      setValue("database_orm", initialData.database.orm, {
        shouldDirty: true,
      });
      console.log("Setting initial ORM:", initialData.database.orm);
      valuesWereSet = true;
    }

    // Mark as applied if any values were set
    if (valuesWereSet) {
      initialDataAppliedRef.current = true;
    }
  }, [initialData, allDatabases, setValue]);

  useEffect(() => {
    console.log("Databases", allDatabases);
  }, [allDatabases]);

  return (
    <div>
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">
        Database
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="database_type"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Type
          </label>
          <select
            id="database_type"
            {...register("database_type")}
            className={`mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
              errors.database_type ? "border-red-500 focus:ring-red-500" : ""
            }`}
          >
            <option value="">Select Database Type</option>
            <option value="sql">SQL</option>
            <option value="nosql">NoSQL</option>
          </select>
          {errors.database_type && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {getErrorMessage(errors.database_type)}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="database_system"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Database System
          </label>
          <select
            id="database_system"
            {...register("database_system")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Select Database System</option>
            {allDatabases.map((db) => (
              <option key={db.id} value={db.id}>
                {db.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="database_hosting"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Database Hosting
          </label>
          <select
            id="database_hosting"
            {...register("database_hosting")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Select Database Hosting</option>
            {allDatabaseHosting.map((hosting) => (
              <option key={hosting} value={hosting}>
                {hosting}
              </option>
            ))}
          </select>
        </div>

        {/* ORM/Database Access dropdown */}
        <div>
          <label
            htmlFor="database_orm"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            ORM / Database Access
          </label>
          <select
            id="database_orm"
            {...register("database_orm")}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            <option value="">Select ORM</option>
            {allOrms.map((orm) => (
              <option key={orm.id} value={orm.id}>
                {orm.id}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSection;
