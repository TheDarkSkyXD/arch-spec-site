import React from "react";
import { ProjectTemplate } from "../../types/project";

interface TemplateDetailsProps {
  template: ProjectTemplate;
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({ template }) => {
  // Helper to safely render tech stack info
  const renderTechStack = (value: unknown) => {
    if (typeof value === "string") {
      return value;
    } else if (value && typeof value === "object") {
      return JSON.stringify(value);
    }
    return "Not specified";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {template.name}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {template.description}
        </p>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
          Version: {template.version}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tech Stack */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-800 dark:text-slate-100 mb-3">
            Tech Stack
          </h3>

          <div className="space-y-3">
            {template.tech_stack && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Frontend
                  </h4>
                  <div className="mt-1 space-y-1">
                    <div className="flex">
                      <span className="text-sm text-slate-600 dark:text-slate-400 w-24">
                        Framework:
                      </span>
                      <span className="text-sm font-medium dark:text-slate-200">
                        {renderTechStack(template.tech_stack.frontend)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Backend
                  </h4>
                  <div className="mt-1 space-y-1">
                    <div className="flex">
                      <span className="text-sm text-slate-600 dark:text-slate-400 w-24">
                        Type:
                      </span>
                      <span className="text-sm font-medium dark:text-slate-200">
                        {renderTechStack(template.tech_stack.backend)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Database
                  </h4>
                  <div className="mt-1 space-y-1">
                    <div className="flex">
                      <span className="text-sm text-slate-600 dark:text-slate-400 w-24">
                        Type:
                      </span>
                      <span className="text-sm font-medium dark:text-slate-200">
                        {renderTechStack(template.tech_stack.database)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-800 dark:text-slate-100 mb-3">
            Features
          </h3>

          {template.features?.core_modules &&
          template.features.core_modules.length > 0 ? (
            <div className="space-y-4">
              {template.features.core_modules.map((feature, index) => (
                <div
                  key={index}
                  className={`p-3 rounded ${
                    feature.enabled ? "bg-green-50" : "bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {feature.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {feature.description}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          feature.enabled
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {feature.enabled ? "Enabled" : "Optional"}
                      </span>
                    </div>
                  </div>

                  {feature.providers && feature.providers.length > 0 && (
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Providers:</span>{" "}
                      {feature.providers.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No features specified</p>
          )}
        </div>
      </div>

      {/* Pages Section */}
      {template.pages && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-800 dark:text-slate-100 mb-3">
            Application Pages
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Public Pages
              </h4>
              {template.pages.public && template.pages.public.length > 0 ? (
                <ul className="space-y-2">
                  {template.pages.public.map((page, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{page.name}</span>
                      <span className="text-slate-500 text-xs ml-1">
                        ({page.path})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">No public pages</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Authenticated Pages
              </h4>
              {template.pages.authenticated &&
              template.pages.authenticated.length > 0 ? (
                <ul className="space-y-2">
                  {template.pages.authenticated.map((page, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{page.name}</span>
                      <span className="text-slate-500 text-xs ml-1">
                        ({page.path})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">No authenticated pages</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Admin Pages
              </h4>
              {template.pages.admin && template.pages.admin.length > 0 ? (
                <ul className="space-y-2">
                  {template.pages.admin.map((page, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{page.name}</span>
                      <span className="text-slate-500 text-xs ml-1">
                        ({page.path})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">No admin pages</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* API Section */}
      {template.api &&
        template.api.endpoints &&
        template.api.endpoints.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
            <h3 className="font-medium text-slate-800 dark:text-slate-100 mb-3">
              API Endpoints
            </h3>

            <div className="space-y-4 mt-4">
              {template.api.endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="p-3 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex space-x-1">
                      {endpoint.methods.map((method) => (
                        <span
                          key={method}
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            method === "GET"
                              ? "bg-green-100 text-green-800"
                              : method === "POST"
                              ? "bg-blue-100 text-blue-800"
                              : method === "PUT"
                              ? "bg-yellow-100 text-yellow-800"
                              : method === "DELETE"
                              ? "bg-red-100 text-red-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                    <span className="font-medium">{endpoint.path}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {endpoint.description}
                  </p>

                  {endpoint.auth && (
                    <div className="mt-2 flex items-center text-xs text-slate-500 dark:text-slate-500">
                      <span className="font-medium mr-2">Auth Required</span>
                      {endpoint.roles.length > 0 && (
                        <span>Roles: {endpoint.roles.join(", ")}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Project Defaults */}
      {template.project_defaults && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-800 dark:text-slate-100 mb-3">
            Project Defaults
          </h3>

          <div className="space-y-3">
            {template.project_defaults.business_goals.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Business Goals
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {template.project_defaults.business_goals.map(
                    (goal, index) => (
                      <li
                        key={index}
                        className="text-sm text-slate-600 dark:text-slate-400"
                      >
                        {goal}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {template.project_defaults.target_users.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Users
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {template.project_defaults.target_users.map((user, index) => (
                    <li
                      key={index}
                      className="text-sm text-slate-600 dark:text-slate-400"
                    >
                      {user}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDetails;
