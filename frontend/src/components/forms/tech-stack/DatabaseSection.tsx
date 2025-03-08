import { UseFormRegister, FormState } from "react-hook-form";
import { Technology } from "../../../types/techStack";

interface DatabaseSectionProps {
  register: UseFormRegister<any>;
  errors: FormState<any>["errors"];
  backend: string | undefined;
  database: string | undefined;
  databaseOptions: string[];
  ormOptions: string[];
  allDatabases: Technology[];
}

const DatabaseSection = ({
  register,
  errors,
  backend,
  database,
  databaseOptions,
  ormOptions,
  allDatabases,
}: DatabaseSectionProps) => {
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
              : allDatabases.map((db) => (
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
  );
};

export default DatabaseSection;