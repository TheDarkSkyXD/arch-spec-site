import MainLayout from "../layouts/MainLayout";
import ProjectBasicsForm from "../components/forms/ProjectBasicsForm";
import TechStackForm from "../components/forms/TechStackForm";
import RequirementsForm from "../components/forms/RequirementsForm";
import FeaturesForm from "../components/forms/FeaturesForm";
import PagesForm from "../components/forms/PagesForm";
import ApiEndpointsForm from "../components/forms/ApiEndpointsForm";
import DataModelForm from "../components/forms/DataModelForm";
import TestCasesForm from "../components/forms/TestCasesForm";
import ImplementationPromptsForm from "../components/forms/ImplementationPromptsForm";
import TemplateSelectionStep from "../components/project/TemplateSelectionStep";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useProjectTemplateSection } from "../hooks/useProjectTemplateSection";
import { useSubscription } from "../contexts/SubscriptionContext";
import { userApi } from "../api/userApi";

// Import shadcn UI components
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

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
  TEST_CASES = "testCases",
  IMPLEMENTATION_PROMPTS = "implementationPrompts",
}

const NewProject = () => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const { refreshSubscriptionData } = useSubscription();

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
    [SectionId.TEST_CASES]: false,
    [SectionId.IMPLEMENTATION_PROMPTS]: false,
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

  // Load subscription data when component mounts
  useEffect(() => {
    const loadUserProfile = async () => {
      await userApi.getCurrentUser();
      refreshSubscriptionData();
    };
    loadUserProfile();
  }, [refreshSubscriptionData]);

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
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-2 text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </Button>
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
          <Card className="overflow-hidden">
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
          </Card>

          {/* Project Basics (Required) */}
          <Card className="overflow-hidden">
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
          </Card>

          {/* Requirements (Optional) */}
          <Card className="overflow-hidden">
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
          </Card>

          {/* Features (Optional) */}
          <Card className="overflow-hidden">
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
          </Card>

          {/* Tech Stack (Optional) */}
          <Card className="overflow-hidden">
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
          </Card>

          {/* Pages (Optional) */}
          <Card className="overflow-hidden">
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
          </Card>

          {/* Data Model (Optional) */}
          <Card className="overflow-hidden">
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
          </Card>

          {/* API Endpoints (Optional) */}
          <Card className="overflow-hidden">
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
          </Card>

          {/* Test Cases (Optional) */}
          <Card className="overflow-hidden">
            <SectionHeader
              title="Test Cases"
              description="Define Gherkin-style test cases to document expected behavior"
              sectionId={SectionId.TEST_CASES}
              isExpanded={expandedSections[SectionId.TEST_CASES]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.TEST_CASES] && (
              <div className="p-6">
                <TestCasesForm
                  initialData={{
                    testCases: [],
                  }}
                  projectId={projectId}
                  onSuccess={(updatedTestCases) => {
                    console.log("Test Cases updated:", updatedTestCases);
                  }}
                />
              </div>
            )}
          </Card>

          {/* Implementation Prompts (Optional) */}
          <Card className="overflow-hidden">
            <SectionHeader
              title="Implementation Prompts"
              description="Define prompts for implementing different aspects of your project"
              sectionId={SectionId.IMPLEMENTATION_PROMPTS}
              isExpanded={expandedSections[SectionId.IMPLEMENTATION_PROMPTS]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.IMPLEMENTATION_PROMPTS] && (
              <div className="p-6">
                <ImplementationPromptsForm
                  initialData={{
                    data: {},
                  }}
                  projectId={projectId}
                  onSuccess={(updatedImplementationPrompts) => {
                    console.log(
                      "Implementation Prompts updated:",
                      updatedImplementationPrompts
                    );
                  }}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewProject;
