import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProgressBar from "../components/common/ProgressBar";
import ProjectBasicsForm from "../components/forms/ProjectBasicsForm";
import TechStackForm from "../components/forms/TechStackForm";
import { useProjectStore } from "../store/projectStore";
import { mockTemplates } from "../data/mockData";

const steps = [
  { id: "basics", name: "Project Basics" },
  { id: "tech-stack", name: "Tech Stack" },
  { id: "features", name: "Features" },
  { id: "data-model", name: "Data Model" },
  { id: "review", name: "Review" },
];

const NewProject = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");

  const { createProject, isLoading } = useProjectStore();
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
            frontend: template.tech_stack.frontend,
            backend: template.tech_stack.backend,
            database: template.tech_stack.database,
          },
        }));
      }
    }
  }, [templateId]);

  const handleBasicsSubmit = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      basics: data,
    }));
    setCurrentStep("tech-stack");
  };

  const handleTechStackSubmit = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      techStack: data,
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

  return (
    <MainLayout showSidebar={false}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Project
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Define your project specifications to generate a detailed
            implementation plan
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <ProgressBar
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />

          <div className="mt-8">{renderStepContent()}</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewProject;
