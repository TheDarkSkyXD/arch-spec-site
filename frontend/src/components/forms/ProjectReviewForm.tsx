import React from "react";
import {
  CheckCircle,
  ChevronRight,
  Code,
  Server,
  Globe,
  Shield,
} from "lucide-react";
import { ProjectCreate } from "../../types/project";

interface ProjectReviewFormProps {
  projectData: Partial<ProjectCreate>;
  onSubmit: () => void;
  onBack: () => void;
  onEdit: (section: string) => void;
}

export default function ProjectReviewForm({
  projectData,
  onSubmit,
  onBack,
  onEdit,
}: ProjectReviewFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Review Your Project
          </h2>
          <p className="text-slate-600 mb-6">
            Review the details of your project before creating it.
          </p>
        </div>

        {/* Project Basics */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center">
              <h3 className="font-medium text-slate-800">Project Basics</h3>
            </div>
            <button
              type="button"
              onClick={() => onEdit("basics")}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              Edit <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div>
                <span className="block text-xs text-slate-500">Name</span>
                <span className="block text-sm text-slate-800 font-medium">
                  {projectData.name}
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-500">
                  Description
                </span>
                <span className="block text-sm text-slate-800">
                  {projectData.description}
                </span>
              </div>
              {projectData.business_goals &&
                projectData.business_goals.length > 0 && (
                  <div>
                    <span className="block text-xs text-slate-500">
                      Business Goals
                    </span>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {projectData.business_goals.map((goal, index) => (
                        <li key={index} className="text-sm text-slate-800">
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {projectData.target_users &&
                projectData.target_users.length > 0 && (
                  <div>
                    <span className="block text-xs text-slate-500">
                      Target Users
                    </span>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {projectData.target_users.map((user, index) => (
                        <li key={index} className="text-sm text-slate-800">
                          {user}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {projectData.domain && (
                <div>
                  <span className="block text-xs text-slate-500">Domain</span>
                  <span className="block text-sm text-slate-800">
                    {projectData.domain}
                  </span>
                </div>
              )}
              {projectData.organization && (
                <div>
                  <span className="block text-xs text-slate-500">
                    Organization
                  </span>
                  <span className="block text-sm text-slate-800">
                    {projectData.organization}
                  </span>
                </div>
              )}
              {projectData.project_lead && (
                <div>
                  <span className="block text-xs text-slate-500">
                    Project Lead
                  </span>
                  <span className="block text-sm text-slate-800">
                    {projectData.project_lead}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        {projectData.template_data && projectData.template_data.tech_stack && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center">
                <Code size={16} className="text-slate-500 mr-2" />
                <h3 className="font-medium text-slate-800">Tech Stack</h3>
              </div>
              <button
                type="button"
                onClick={() => onEdit("tech-stack")}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                Edit <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs text-slate-500">Frontend</span>
                  <span className="block text-sm text-slate-800 font-medium">
                    {projectData.template_data.tech_stack.frontend}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Backend</span>
                  <span className="block text-sm text-slate-800 font-medium">
                    {projectData.template_data.tech_stack.backend}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Database</span>
                  <span className="block text-sm text-slate-800 font-medium">
                    {projectData.template_data.tech_stack.database}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        {projectData.template_data && projectData.template_data.features && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center">
                <Server size={16} className="text-slate-500 mr-2" />
                <h3 className="font-medium text-slate-800">
                  Features & Modules
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onEdit("features")}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                Edit <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {projectData.template_data.features.core_modules
                  .filter((module) => module.enabled)
                  .map((module, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle
                        size={16}
                        className="text-green-500 mt-0.5 mr-2"
                      />
                      <div>
                        <span className="block text-sm text-slate-800 font-medium">
                          {module.name}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {module.description}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Requirements */}
        {((projectData.functional_requirements &&
          projectData.functional_requirements.length > 0) ||
          (projectData.non_functional_requirements &&
            projectData.non_functional_requirements.length > 0)) && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center">
                <CheckCircle size={16} className="text-slate-500 mr-2" />
                <h3 className="font-medium text-slate-800">Requirements</h3>
              </div>
              <button
                type="button"
                onClick={() => onEdit("requirements")}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                Edit <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {projectData.functional_requirements &&
                  projectData.functional_requirements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                        Functional Requirements
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {projectData.functional_requirements.map(
                          (req, index) => (
                            <li key={index} className="text-sm text-slate-800">
                              {req.description}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {projectData.non_functional_requirements &&
                  projectData.non_functional_requirements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                        Non-Functional Requirements
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {projectData.non_functional_requirements.map(
                          (req, index) => (
                            <li key={index} className="text-sm text-slate-800">
                              {req.description}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* API Endpoints */}
        {projectData.template_data &&
          projectData.template_data.api &&
          projectData.template_data.api.endpoints && (
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center">
                  <Globe size={16} className="text-slate-500 mr-2" />
                  <h3 className="font-medium text-slate-800">API Endpoints</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onEdit("api")}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                >
                  Edit <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {projectData.template_data.api.endpoints.map(
                    (endpoint, index) => (
                      <div
                        key={index}
                        className="pb-2 border-b border-slate-100 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex space-x-1">
                            {endpoint.methods.map((method) => (
                              <span
                                key={method}
                                className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-800"
                              >
                                {method}
                              </span>
                            ))}
                          </div>
                          <span className="font-medium text-sm text-slate-800">
                            {endpoint.path}
                          </span>
                          {endpoint.auth && (
                            <Shield
                              size={14}
                              className="text-slate-400"
                              aria-label="Requires Authentication"
                            />
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {endpoint.description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Create Project
        </button>
      </div>
    </form>
  );
}
