import { UseFormRegister, FormState } from "react-hook-form";
import { Technology } from "../../../types/techStack";

interface FrontendSectionProps {
  register: UseFormRegister<any>;
  errors: FormState<any>["errors"];
  frontendFrameworks: Technology[];
  uiLibraryOptions: string[];
  stateManagementOptions: string[];
  frontend: string | undefined;
}

const FrontendSection = ({
  register,
  errors,
  frontendFrameworks,
  uiLibraryOptions,
  stateManagementOptions,
  frontend,
}: FrontendSectionProps) => {
  return (
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
            {frontendFrameworks.map((framework) => (
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
              errors.frontend_language ? "border-red-500 focus:ring-red-500" : ""
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
  );
};

export default FrontendSection;