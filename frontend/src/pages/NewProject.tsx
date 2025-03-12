import MainLayout from "../layouts/MainLayout";
import ProjectBasicsForm from "../components/forms/ProjectBasicsForm";
import TechStackForm from "../components/forms/TechStackForm";
import RequirementsForm from "../components/forms/RequirementsForm";
import FeaturesForm from "../components/forms/FeaturesForm";
import PagesForm from "../components/forms/PagesForm";
import ApiEndpointsForm from "../components/forms/ApiEndpointsForm";
import DataModelForm from "../components/forms/DataModelForm";
import TemplateSelectionStep from "../components/project/TemplateSelectionStep";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useProjectTemplateSection } from "../hooks/useProjectTemplateSection";

// Define section IDs for consistency
enum SectionId {
  TEMPLATE = "template",
  BASICS = "basics",
  TECH_STACK = "techStack",
  REQUIREMENTS = "requirements",
  FEATURES = "features",
  PAGES = "pages",
  DATA_MODEL = "dataModel",
  API_ENDPOINTS = "apiEndpoints",
}

const NewProject = () => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | undefined>(undefined);

  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState<
    Record<SectionId, boolean>
  >({
    [SectionId.TEMPLATE]: true,
    [SectionId.BASICS]: true,
    [SectionId.TECH_STACK]: false,
    [SectionId.REQUIREMENTS]: false,
    [SectionId.FEATURES]: false,
    [SectionId.PAGES]: false,
    [SectionId.DATA_MODEL]: false,
    [SectionId.API_ENDPOINTS]: false,
  });

  // Function to toggle section expansion
  const toggleSection = (sectionId: SectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const {
    selectedTemplate,
    loading,
    error,
    handleTemplateSelect,
    handleBlankProjectSelect,
  } = useProjectTemplateSection();
  useEffect(() => {
    console.log("Selected Template:", selectedTemplate);
  }, [selectedTemplate]);

  // Reusable section header component
  const SectionHeader = ({
    title,
    description,
    sectionId,
    isExpanded,
    required = false,
    disabled = false,
  }: {
    title: string;
    description: string;
    sectionId: SectionId;
    isExpanded: boolean;
    required?: boolean;
    disabled?: boolean;
  }) => (
    <div
      className={`p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center ${
        !disabled ? "cursor-pointer" : ""
      }`}
      onClick={() => !disabled && toggleSection(sectionId)}
    >
      <div>
        <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
          {title} {required && <span className="text-red-500">*</span>}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description}
          {disabled && (
            <span className="ml-1 text-amber-500">
              (Save project basics first to enable)
            </span>
          )}
        </p>
      </div>
      {!disabled && (
        <div className="text-slate-400 dark:text-slate-500">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      )}
    </div>
  );

  return (
    <MainLayout>
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
            <SectionHeader
              title="Template Selection"
              description="Choose a template or start from scratch"
              sectionId={SectionId.TEMPLATE}
              isExpanded={expandedSections[SectionId.TEMPLATE]}
            />
            {expandedSections[SectionId.TEMPLATE] && (
              <div className="p-6">
                <TemplateSelectionStep
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                  onBlankProjectSelect={handleBlankProjectSelect}
                  loading={loading}
                  error={error}
                />
              </div>
            )}
          </div>

          {/* Project Basics (Required) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <SectionHeader
              title="Project Basics"
              description="Required information about your project"
              sectionId={SectionId.BASICS}
              isExpanded={expandedSections[SectionId.BASICS]}
              required={true}
            />
            {expandedSections[SectionId.BASICS] && (
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
            )}
          </div>

          {/* Tech Stack (Optional) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <SectionHeader
              title="Tech Stack"
              description="Define your project's technology stack"
              sectionId={SectionId.TECH_STACK}
              isExpanded={expandedSections[SectionId.TECH_STACK]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.TECH_STACK] && (
              <div className="p-6">
                <TechStackForm
                  initialData={selectedTemplate?.techStack}
                  projectId={projectId}
                  onSuccess={() => {
                    console.log("Tech stack updated");
                  }}
                />
              </div>
            )}
          </div>

          {/* Requirements (Optional) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <SectionHeader
              title="Requirements"
              description="Define functional and non-functional requirements"
              sectionId={SectionId.REQUIREMENTS}
              isExpanded={expandedSections[SectionId.REQUIREMENTS]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.REQUIREMENTS] && (
              <div className="p-6">
                <RequirementsForm
                  initialData={
                    selectedTemplate?.requirements || {
                      functional: [],
                      non_functional: [],
                    }
                  }
                  projectId={projectId}
                  onSuccess={(updatedRequirements) => {
                    console.log("Requirements updated:", updatedRequirements);
                  }}
                />
              </div>
            )}
          </div>

          {/* Features (Optional) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <SectionHeader
              title="Features"
              description="Define core modules and features"
              sectionId={SectionId.FEATURES}
              isExpanded={expandedSections[SectionId.FEATURES]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.FEATURES] && (
              <div className="p-6">
                <FeaturesForm
                  initialData={
                    selectedTemplate?.features || {
                      coreModules: [],
                    }
                  }
                  projectId={projectId}
                  onSuccess={(updatedFeatures) => {
                    console.log("Features updated:", updatedFeatures);
                  }}
                />
              </div>
            )}
          </div>

          {/* Pages (Optional) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <SectionHeader
              title="Pages"
              description="Define pages for your application"
              sectionId={SectionId.PAGES}
              isExpanded={expandedSections[SectionId.PAGES]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.PAGES] && (
              <div className="p-6">
                <PagesForm
                  initialData={
                    selectedTemplate?.pages || {
                      public: [],
                      authenticated: [],
                      admin: [],
                    }
                  }
                  projectId={projectId}
                  onSuccess={(updatedPages) => {
                    console.log("Pages updated:", updatedPages);
                  }}
                />
              </div>
            )}
          </div>

          {/* Data Model (Optional) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <SectionHeader
              title="Data Model"
              description="Define database entities and relationships"
              sectionId={SectionId.DATA_MODEL}
              isExpanded={expandedSections[SectionId.DATA_MODEL]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.DATA_MODEL] && (
              <div className="p-6">
                <DataModelForm
                  initialData={
                    selectedTemplate?.dataModel || {
                      entities: [],
                      relationships: [],
                    }
                  }
                  projectId={projectId}
                  onSuccess={(updatedDataModel) => {
                    console.log("Data Model updated:", updatedDataModel);
                  }}
                />
              </div>
            )}
          </div>

          {/* API Endpoints (Optional) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <SectionHeader
              title="API Endpoints"
              description="Define API endpoints for your application"
              sectionId={SectionId.API_ENDPOINTS}
              isExpanded={expandedSections[SectionId.API_ENDPOINTS]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.API_ENDPOINTS] && (
              <div className="p-6">
                <ApiEndpointsForm
                  initialData={
                    selectedTemplate?.api || {
                      endpoints: [],
                    }
                  }
                  projectId={projectId}
                  onSuccess={(updatedApiEndpoints) => {
                    console.log("API Endpoints updated:", updatedApiEndpoints);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewProject;
