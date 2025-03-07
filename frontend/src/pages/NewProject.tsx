import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Code,
  Database,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  LayoutTemplate,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import ProgressBar from "../components/common/ProgressBar";
import ProjectBasicsForm from "../components/forms/ProjectBasicsForm";
import TechStackForm from "../components/forms/TechStackForm";
import { useProjectStore } from "../store/projectStore";
import { ProjectTemplate } from "../types";
import TemplateSelector from "../components/templates/TemplateSelector";
import TemplateDetails from "../components/templates/TemplateDetails";
import { templatesService } from "../services/templatesService";

const steps = [
  { id: "template", name: "Template", icon: <LayoutTemplate size={16} /> },
  { id: "basics", name: "Project Basics", icon: <FileText size={16} /> },
  { id: "tech-stack", name: "Tech Stack", icon: <Code size={16} /> },
  { id: "features", name: "Features", icon: <Database size={16} /> },
  { id: "data-model", name: "Data Model", icon: <Database size={16} /> },
  { id: "review", name: "Review", icon: <CheckCircle size={16} /> },
];

// Define a more specific type for project metadata
interface ProjectMetadata {
  version: string;
  author: string;
  template?: {
    name: string;
    version: string;
  };
}

const NewProject = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");

  const { createProject } = useProjectStore();
  const [currentStep, setCurrentStep] = useState("template");
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplate | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    basics: {
      name: "",
      description: "",
      business_goals: "",
      target_users: "",
    },
    techStack: {
      frontend: "",
      frontend_language: "",
      ui_library: "",
      state_management: "",
      backend: "",
      backend_provider: "",
      database: "",
      database_provider: "",
      auth_provider: "",
      auth_methods: "",
    },
  });

  // Load template from API if templateId is provided
  useEffect(() => {
    const loadTemplateFromApi = async () => {
      if (templateId) {
        try {
          setLoading(true);
          setError(null);
          console.log(`Attempting to load template with ID: ${templateId}`);

          const template = await templatesService.getTemplateById(templateId);

          if (template) {
            console.log(
              `Successfully loaded template: ${template.name} (${template.version})`
            );
            setSelectedTemplate(template);
          } else {
            console.error(
              `Template with ID ${templateId} not found in API response`
            );
            setError(
              `Template with ID ${templateId} not found. Please try browsing all templates.`
            );
          }
        } catch (err) {
          console.error("Error loading template:", err);
          setError(
            "Failed to load the selected template. Please try again later."
          );
        } finally {
          setLoading(false);
        }
      }
    };

    loadTemplateFromApi();
  }, [templateId]);

  // When a template is selected, update form data
  useEffect(() => {
    if (selectedTemplate) {
      setFormData({
        basics: {
          name: selectedTemplate.projectDefaults?.name || "",
          description: selectedTemplate.projectDefaults?.description || "",
          business_goals: selectedTemplate.projectDefaults?.businessGoals
            ?.length
            ? selectedTemplate.projectDefaults.businessGoals.join(", ")
            : "",
          target_users: selectedTemplate.projectDefaults?.targetUsers?.length
            ? selectedTemplate.projectDefaults.targetUsers.join(", ")
            : "",
        },
        techStack: {
          frontend: selectedTemplate.techStack?.frontend?.framework || "",
          frontend_language:
            selectedTemplate.techStack?.frontend?.language || "",
          ui_library: selectedTemplate.techStack?.frontend?.uiLibrary || "",
          state_management:
            selectedTemplate.techStack?.frontend?.stateManagement || "",
          backend: selectedTemplate.techStack?.backend?.type || "",
          backend_provider: selectedTemplate.techStack?.backend?.provider || "",
          database: selectedTemplate.techStack?.database?.type || "",
          database_provider:
            selectedTemplate.techStack?.database?.provider || "",
          auth_provider:
            selectedTemplate.techStack?.authentication?.provider || "",
          auth_methods: selectedTemplate.techStack?.authentication?.methods
            ?.length
            ? selectedTemplate.techStack.authentication.methods.join(", ")
            : "",
        },
      });
    }
  }, [selectedTemplate]);

  const handleTemplateSelect = (template: ProjectTemplate | null) => {
    setSelectedTemplate(template);
    if (template) {
      // After selecting a template, automatically move to the next step
      setCurrentStep("basics");
    }
  };

  const handleBasicsSubmit = (data: Record<string, unknown>) => {
    setFormData((prev) => ({
      ...prev,
      basics: data as typeof prev.basics,
    }));
    setCurrentStep("tech-stack");
  };

  const handleTechStackSubmit = (data: Record<string, unknown>) => {
    setFormData((prev) => ({
      ...prev,
      techStack: data as typeof prev.techStack,
    }));

    // For now, let's create the project and navigate to the dashboard
    // In a real implementation, we would continue to the next steps
    handleCreateProject();
  };

  const handleCreateProject = async () => {
    try {
      const metadata: ProjectMetadata = {
        version: "0.1",
        author: "User",
      };

      // If template was selected, include template information in metadata
      if (selectedTemplate) {
        metadata.template = {
          name: selectedTemplate.name,
          version: selectedTemplate.version,
        };
      }

      await createProject({
        name: formData.basics.name,
        description: formData.basics.description,
        template_type: selectedTemplate?.name || "custom",
        status: "draft",
        metadata,
      });

      navigate("/");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleStepClick = (stepId: string) => {
    // Only allow going back to previous steps or to the next step
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    const targetIndex = steps.findIndex((step) => step.id === stepId);

    if (targetIndex <= currentIndex || targetIndex === currentIndex + 1) {
      setCurrentStep(stepId);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "template":
        // Show loading state when fetching template
        if (loading) {
          return (
            <div className="py-10 text-center">
              <div className="animate-pulse inline-block h-8 w-8 rounded-full bg-primary-200"></div>
              <p className="mt-4 text-slate-600">Loading template...</p>
            </div>
          );
        }

        // Show error state
        if (error) {
          return (
            <div className="py-10 text-center">
              <div className="text-red-600 mb-4">
                <p>{error}</p>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  onClick={() => navigate("/templates")}
                >
                  Browse all templates
                </button>
              </div>

              {/* Debug section for development - can be removed in production */}
              <div className="mt-8 p-4 border border-slate-300 rounded-md bg-slate-50 text-left max-w-2xl mx-auto">
                <h3 className="font-semibold text-slate-700 mb-2">
                  Debug Information
                </h3>
                <p className="text-sm text-slate-600 mb-2">
                  Template ID from URL:{" "}
                  <code className="bg-slate-200 px-1 rounded">
                    {templateId}
                  </code>
                </p>
                <div className="text-sm text-slate-600">
                  <p className="mb-1">Try these options:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      Check that the template ID in the URL matches an actual
                      template ID from the API
                    </li>
                    <li>
                      Verify that the template API endpoint is working correctly
                    </li>
                    <li>
                      Check the browser console for more detailed error
                      information
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div>
            <TemplateSelector
              onTemplateSelect={handleTemplateSelect}
              selectedTemplateId={templateId || undefined}
            />

            {selectedTemplate && (
              <div className="mt-8 border-t border-slate-200 pt-6">
                <TemplateDetails template={selectedTemplate} />
              </div>
            )}
          </div>
        );
      case "basics":
        return (
          <ProjectBasicsForm
            initialData={formData.basics}
            onSubmit={handleBasicsSubmit}
          />
        );
      case "tech-stack":
        return (
          <TechStackForm
            initialData={formData.techStack}
            onSubmit={handleTechStackSubmit}
            onBack={() => setCurrentStep("basics")}
          />
        );
      default:
        return <div>Step not implemented yet</div>;
    }
  };

  // Determine current step index
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const submitCurrentForm = () => {
    if (currentStep === "template" && selectedTemplate) {
      // If template is selected, move to next step
      setCurrentStep("basics");
      return;
    }

    const formElement = document.querySelector("form");
    if (formElement) {
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      formElement.dispatchEvent(submitEvent);
    }
  };

  return (
    <MainLayout showSidebar={false}>
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-slate-500 hover:text-slate-700 mb-2 text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-slate-800 font-heading">
            Create New Project
          </h1>
          <p className="text-slate-500 mt-1">
            Define your project specifications to generate an architecture plan
          </p>
        </div>

        {/* Main content card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {/* Steps indicator */}
          <div className="p-6 border-b border-slate-100">
            <ProgressBar
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Form content */}
          <div className="p-6">{renderStepContent()}</div>

          {/* Footer with navigation buttons */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between">
            <button
              onClick={() => {
                if (!isFirstStep) {
                  const prevStepId = steps[currentStepIndex - 1].id;
                  setCurrentStep(prevStepId);
                } else {
                  navigate("/");
                }
              }}
              className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              <ChevronLeft size={16} className="mr-1" />
              {isFirstStep ? "Cancel" : "Previous"}
            </button>

            <button
              onClick={submitCurrentForm}
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentStep === "template" && !selectedTemplate
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 text-white"
              }`}
              disabled={currentStep === "template" && !selectedTemplate}
            >
              {isLastStep ? "Create Project" : "Continue"}
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewProject;
