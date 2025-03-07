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
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import ProgressBar from "../components/common/ProgressBar";
import ProjectBasicsForm from "../components/forms/ProjectBasicsForm";
import TechStackForm from "../components/forms/TechStackForm";
import { useProjectStore } from "../store/projectStore";
import { mockTemplates } from "../data/mockData";

const steps = [
  { id: "basics", name: "Project Basics", icon: <FileText size={16} /> },
  { id: "tech-stack", name: "Tech Stack", icon: <Code size={16} /> },
  { id: "features", name: "Features", icon: <Database size={16} /> },
  { id: "data-model", name: "Data Model", icon: <Database size={16} /> },
  { id: "review", name: "Review", icon: <CheckCircle size={16} /> },
];

const NewProject = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");

  const { createProject } = useProjectStore();
  const [currentStep, setCurrentStep] = useState("basics");
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
      backend: "",
      backend_provider: "",
      database: "",
      database_provider: "",
      auth_provider: "",
      auth_methods: "",
    },
  });

  // If a template is selected, pre-fill the form data
  useEffect(() => {
    if (templateId) {
      const template = mockTemplates.find((t) => t.id === templateId);
      if (template) {
        setFormData((prev) => ({
          ...prev,
          techStack: {
            ...prev.techStack,
            frontend: template.tech_stack?.frontend || "",
            backend: template.tech_stack?.backend || "",
            database: template.tech_stack?.database || "",
          },
        }));
      }
    }
  }, [templateId]);

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

    // In a real app, we would continue to the next step
    // For now, let's create the project and navigate to the dashboard
    handleCreateProject();
  };

  const handleCreateProject = async () => {
    try {
      await createProject({
        name: formData.basics.name,
        description: formData.basics.description,
        template_type: "web_app",
        status: "draft",
        metadata: {
          version: "0.1",
          author: "User",
        },
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
              onClick={() => {
                if (currentStep === "basics" || currentStep === "tech-stack") {
                  submitCurrentForm();
                }
              }}
              className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
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
