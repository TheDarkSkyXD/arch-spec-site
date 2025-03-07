import React from "react";
import { ProjectTemplate } from "../../types";

interface TemplateDetailsProps {
  template: ProjectTemplate;
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({ template }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          {template.name}
        </h2>
        <p className="text-slate-600 mt-1">{template.description}</p>
        <div className="mt-2 text-xs text-slate-500">
          Version: {template.version}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tech Stack */}
        <div className="bg-white rounded-lg p-5 border border-slate-200">
          <h3 className="font-medium text-slate-800 mb-3">Tech Stack</h3>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-slate-700">Frontend</h4>
              <div className="mt-1 space-y-1">
                <div className="flex">
                  <span className="text-sm text-slate-600 w-24">
                    Framework:
                  </span>
                  <span className="text-sm font-medium">
                    {template.techStack.frontend.framework}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-sm text-slate-600 w-24">Language:</span>
                  <span className="text-sm font-medium">
                    {template.techStack.frontend.language}
                  </span>
                </div>
                {template.techStack.frontend.uiLibrary && (
                  <div className="flex">
                    <span className="text-sm text-slate-600 w-24">
                      UI Library:
                    </span>
                    <span className="text-sm font-medium">
                      {template.techStack.frontend.uiLibrary}
                    </span>
                  </div>
                )}
                {template.techStack.frontend.stateManagement && (
                  <div className="flex">
                    <span className="text-sm text-slate-600 w-24">
                      State Mgmt:
                    </span>
                    <span className="text-sm font-medium">
                      {template.techStack.frontend.stateManagement}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-700">Backend</h4>
              <div className="mt-1 space-y-1">
                <div className="flex">
                  <span className="text-sm text-slate-600 w-24">Type:</span>
                  <span className="text-sm font-medium">
                    {template.techStack.backend.type}
                  </span>
                </div>
                {template.techStack.backend.provider && (
                  <div className="flex">
                    <span className="text-sm text-slate-600 w-24">
                      Provider:
                    </span>
                    <span className="text-sm font-medium">
                      {template.techStack.backend.provider}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-700">Database</h4>
              <div className="mt-1 space-y-1">
                <div className="flex">
                  <span className="text-sm text-slate-600 w-24">Type:</span>
                  <span className="text-sm font-medium">
                    {template.techStack.database.type}
                  </span>
                </div>
                {template.techStack.database.provider && (
                  <div className="flex">
                    <span className="text-sm text-slate-600 w-24">
                      Provider:
                    </span>
                    <span className="text-sm font-medium">
                      {template.techStack.database.provider}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-700">
                Authentication
              </h4>
              <div className="mt-1 space-y-1">
                <div className="flex">
                  <span className="text-sm text-slate-600 w-24">Provider:</span>
                  <span className="text-sm font-medium">
                    {template.techStack.authentication.provider}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-sm text-slate-600 w-24">Methods:</span>
                  <span className="text-sm font-medium">
                    {template.techStack.authentication.methods.join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg p-5 border border-slate-200">
          <h3 className="font-medium text-slate-800 mb-3">Features</h3>

          <div className="space-y-4">
            {template.features.coreModules.map((feature) => (
              <div
                key={feature.name}
                className={`p-3 rounded ${
                  feature.enabled ? "bg-green-50" : "bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-slate-800">
                      {feature.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
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
                  <div className="mt-2 text-xs text-slate-600">
                    <span className="font-medium">Providers:</span>{" "}
                    {feature.providers.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pages Section */}
      <div className="bg-white rounded-lg p-5 border border-slate-200">
        <h3 className="font-medium text-slate-800 mb-3">Application Pages</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">
              Public Pages
            </h4>
            <ul className="space-y-2">
              {template.pages.public.map((page) => (
                <li key={page.name} className="text-sm">
                  <span className="font-medium">{page.name}</span>
                  <span className="text-slate-500 text-xs ml-1">
                    ({page.path})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">
              Authenticated Pages
            </h4>
            <ul className="space-y-2">
              {template.pages.authenticated.map((page) => (
                <li key={page.name} className="text-sm">
                  <span className="font-medium">{page.name}</span>
                  <span className="text-slate-500 text-xs ml-1">
                    ({page.path})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-2">
              Admin Pages
            </h4>
            <ul className="space-y-2">
              {template.pages.admin.map((page) => (
                <li key={page.name} className="text-sm">
                  <span className="font-medium">{page.name}</span>
                  <span className="text-slate-500 text-xs ml-1">
                    ({page.path})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetails;
