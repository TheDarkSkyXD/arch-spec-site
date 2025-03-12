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
import { ReactNode, useEffect, useRef, useMemo } from "react";
import { ProjectTechStack } from "../../../types/templates";
import {
  filterDatabaseSystems,
  filterDatabaseHosting,
  filterOrmOptions,
} from "../../../utils/databaseTechStackFilterUtils";
interface DatabaseSectionProps {
  register: UseFormRegister<TechStackFormData>;
  errors: FormState<TechStackFormData>["errors"];
  allDatabases: Technology[];
  allDatabaseHosting: Technology[];
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

  // Reset form values if templateId is null
  useEffect(() => {
    if (!initialData) {
      setValue("database_type", "", { shouldDirty: false });
      setValue("database_system", "", { shouldDirty: false });
      setValue("database_hosting", "", { shouldDirty: false });
      setValue("database_orm", "", { shouldDirty: false });
    }
  }, [initialData, setValue]);

  // Filter database systems based on selections
  const filteredDatabases = useMemo(
    () =>
      filterDatabaseSystems(
        selectedDatabaseType,
        selectedDatabaseHosting,
        selectedDatabaseOrm,
        allDatabases,
        allDatabaseHosting,
        allOrms
      ),
    [
      selectedDatabaseType,
      selectedDatabaseHosting,
      selectedDatabaseOrm,
      allDatabases,
      allDatabaseHosting,
      allOrms,
    ]
  );

  // Filter database hosting options based on selections
  const filteredDatabaseHosting = useMemo(
    () =>
      filterDatabaseHosting(
        selectedDatabaseType,
        selectedDatabaseSystem,
        selectedDatabaseOrm,
        allDatabases,
        allDatabaseHosting,
        allOrms
      ),
    [
      selectedDatabaseType,
      selectedDatabaseSystem,
      selectedDatabaseOrm,
      allDatabases,
      allDatabaseHosting,
      allOrms,
    ]
  );

  // Filter ORM options based on selections
  const filteredOrms = useMemo(
    () =>
      filterOrmOptions(
        selectedDatabaseType,
        selectedDatabaseSystem,
        selectedDatabaseHosting,
        allDatabases,
        allDatabaseHosting,
        allOrms
      ),
    [
      selectedDatabaseType,
      selectedDatabaseSystem,
      selectedDatabaseHosting,
      allDatabases,
      allDatabaseHosting,
      allOrms,
    ]
  );

  // Auto-select values when only one option is available
  useEffect(() => {
    // Auto-select database type if only one option is available in filtered databases
    if (filteredDatabases.length > 0 && !selectedDatabaseType) {
      const types = [...new Set(filteredDatabases.map((db) => db.type))];
      if (types.length === 1) {
        setValue("database_type", types[0], { shouldDirty: true });
        console.log("Auto-selected database type:", types[0]);
      }
    }

    // Auto-select database system if only one option is available
    if (filteredDatabases.length === 1 && !selectedDatabaseSystem) {
      setValue("database_system", filteredDatabases[0].id as string, {
        shouldDirty: true,
      });
      console.log("Auto-selected database system:", filteredDatabases[0].id);
    }

    // Auto-select database hosting if only one option is available
    if (filteredDatabaseHosting.length === 1 && !selectedDatabaseHosting) {
      setValue("database_hosting", filteredDatabaseHosting[0].id as string, {
        shouldDirty: true,
      });
      console.log(
        "Auto-selected database hosting:",
        filteredDatabaseHosting[0].id
      );
    }

    // Auto-select ORM if only one option is available
    if (filteredOrms.length === 1 && !selectedDatabaseOrm) {
      setValue("database_orm", filteredOrms[0].id as string, {
        shouldDirty: true,
      });
      console.log("Auto-selected ORM:", filteredOrms[0].id);
    }
  }, [
    filteredDatabases,
    filteredDatabaseHosting,
    filteredOrms,
    selectedDatabaseType,
    selectedDatabaseSystem,
    selectedDatabaseHosting,
    selectedDatabaseOrm,
    setValue,
  ]);

  // useEffect(() => {
  //   console.log("Selected database values:", {
  //     database_type: selectedDatabaseType,
  //     database_system: selectedDatabaseSystem,
  //     database_hosting: selectedDatabaseHosting,
  //     database_orm: selectedDatabaseOrm,
  //   });
  // }, [
  //   selectedDatabaseType,
  //   selectedDatabaseSystem,
  //   selectedDatabaseHosting,
  //   selectedDatabaseOrm,
  // ]);

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
            {filteredDatabases.map((db) => (
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
            {filteredDatabaseHosting.map((hosting) => (
              <option key={hosting.id} value={hosting.id}>
                {hosting.id}
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
            disabled={selectedDatabaseType === "nosql"}
          >
            <option value="">Select ORM</option>
            {filteredOrms.map((orm) => (
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
