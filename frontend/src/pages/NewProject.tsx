import MainLayout from "../layouts/MainLayout";
import ProjectBasicsForm from "../components/forms/ProjectBasicsForm";
import TechStackForm from "../components/forms/TechStackForm";
import RequirementsForm from "../components/forms/RequirementsForm";
import FeaturesForm from "../components/forms/FeaturesForm";
import PagesForm from "../components/forms/PagesForm";
import ApiEndpointsForm from "../components/forms/ApiEndpointsForm";
import { useProjectWizard } from "../hooks/useProjectWizard";
import TemplateSelectionStep from "../components/project/TemplateSelectionStep";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { ProjectTechStack } from "../types/templates";

const NewProject = () => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const [techStack, setTechStack] = useState<ProjectTechStack | undefined>(
    undefined
  );

  const {
    selectedTemplate,
    loading,
    error,
    formData,
    handleTemplateSelect,
    handleBlankProjectSelect,
    handleTechStackSubmit,
    handleRequirementsSubmit,
    handleFeaturesSubmit,
    handlePagesSubmit,
    handleApiEndpointsSubmit,
    handleCreateProject,
  } = useProjectWizard();
  useEffect(() => {
    console.log("Selected Template:", selectedTemplate);
  }, [selectedTemplate]);

  // Handle tech stack updates
  const handleTechStackUpdated = (updatedTechStack: ProjectTechStack) => {
    setTechStack(updatedTechStack);
    if (handleTechStackSubmit) {
      handleTechStackSubmit(updatedTechStack);
    }
  };

  return (
    <MainLayout showSidebar={false}>
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-2 text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-heading">
            Create New Project
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Fill in the required information to create your project. You can
            update other sections anytime.
          </p>
        </div>

        {/* Project Sections */}
        <div className="space-y-8">
          {/* Template Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                Template Selection
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose a template or start from scratch
              </p>
            </div>
            <div className="p-6">
              <TemplateSelectionStep
                selectedTemplate={selectedTemplate}
                templateId={formData.template_id}
                onTemplateSelect={handleTemplateSelect}
                onBlankProjectSelect={handleBlankProjectSelect}
                loading={loading}
                error={error}
              />
            </div>
          </div>

          {/* Project Basics (Required) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                Project Basics <span className="text-red-500">*</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Required information about your project
              </p>
            </div>
            <div className="p-6">
              <ProjectBasicsForm
                onSuccess={(newProjectId) => {
                  // Store the project ID in state
                  setProjectId(newProjectId);
                  console.log(
                    "Project created/updated successfully with ID:",
                    newProjectId
                  );
                }}
              />
            </div>
          </div>

          {/* Tech Stack (Optional) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                Tech Stack
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Define your project's technology stack
                {!projectId && (
                  <span className="ml-1 text-amber-500">
                    (Save project basics first to enable)
                  </span>
                )}
              </p>
            </div>
            <div className="p-6">
              <TechStackForm
                initialData={techStack || selectedTemplate?.techStack}
                projectId={projectId}
                onSuccess={handleTechStackUpdated}
              />
            </div>
          </div>

          {/* Requirements (Optional) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                Requirements
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Define functional and non-functional requirements
              </p>
            </div>
            <div className="p-6">
              <RequirementsForm
                initialData={{
                  functional_requirements:
                    formData.functional_requirements || [],
                  non_functional_requirements:
                    formData.non_functional_requirements || [],
                }}
                onSubmit={handleRequirementsSubmit}
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  form="requirements-form"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Save Requirements
                </button>
              </div>
            </div>
          </div>

          {/* Features (Optional) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                Features
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Define core modules and features
              </p>
            </div>
            <div className="p-6">
              <FeaturesForm
                initialData={{
                  core_modules:
                    formData.template_data?.features?.core_modules || [],
                }}
                onSubmit={handleFeaturesSubmit}
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  form="features-form"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Save Features
                </button>
              </div>
            </div>
          </div>

          {/* Pages (Optional) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                Pages
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Define pages for your application
              </p>
            </div>
            <div className="p-6">
              <PagesForm
                initialData={{
                  public: formData.template_data?.pages?.public || [],
                  authenticated:
                    formData.template_data?.pages?.authenticated || [],
                  admin: formData.template_data?.pages?.admin || [],
                }}
                onSubmit={handlePagesSubmit}
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  form="pages-form"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Save Pages
                </button>
              </div>
            </div>
          </div>

          {/* API Endpoints (Optional) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                API Endpoints
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Define API endpoints for your application
              </p>
            </div>
            <div className="p-6">
              <ApiEndpointsForm
                initialData={{
                  endpoints: formData.template_data?.api?.endpoints || [],
                }}
                onSubmit={handleApiEndpointsSubmit}
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  form="api-endpoints-form"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Save API Endpoints
                </button>
              </div>
            </div>
          </div>

          {/* Create Project Button (enabled only when basics are filled) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col items-center justify-center py-6">
                <h2 className="text-xl font-medium text-slate-800 dark:text-slate-100 mb-2">
                  Ready to create your project?
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-center max-w-md">
                  {projectId
                    ? "Your project has the required information. Click below to create it."
                    : "Please fill in the Project Basics section (required) before creating your project."}
                </p>
                <button
                  onClick={handleCreateProject}
                  disabled={!projectId}
                  className={`px-6 py-3 rounded-md text-white font-medium ${
                    projectId
                      ? "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewProject;
