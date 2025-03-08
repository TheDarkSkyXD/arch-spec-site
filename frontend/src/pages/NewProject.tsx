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
  List,
  Globe,
  Server,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import ProgressBar from "../components/common/ProgressBar";
import ProjectBasicsForm from "../components/forms/ProjectBasicsForm";
import TechStackForm from "../components/forms/TechStackForm";
import RequirementsForm from "../components/forms/RequirementsForm";
import FeaturesForm from "../components/forms/FeaturesForm";
import PagesForm from "../components/forms/PagesForm";
import ApiEndpointsForm from "../components/forms/ApiEndpointsForm";
import ProjectReviewForm from "../components/forms/ProjectReviewForm";
import { useProjectStore } from "../store/projectStore";
import { ProjectCreate, ProjectTemplate, Requirement } from "../types/project";
import TemplateSelector from "../components/templates/TemplateSelector";
import TemplateDetails from "../components/templates/TemplateDetails";
import { templatesService } from "../services/templatesService";

// Type definitions for form data
interface FeatureModule {
  name: string;
  description: string;
  enabled: boolean;
  optional: boolean;
  providers: string[];
}

interface PageComponent {
  name: string;
  path: string;
  components: string[];
  enabled: boolean;
}

interface ApiEndpoint {
  path: string;
  description: string;
  methods: string[];
  auth: boolean;
  roles: string[];
}

const steps = [
  { id: "template", name: "Template", icon: <LayoutTemplate size={16} /> },
  { id: "basics", name: "Project Basics", icon: <FileText size={16} /> },
  { id: "tech-stack", name: "Tech Stack", icon: <Code size={16} /> },
  { id: "requirements", name: "Requirements", icon: <List size={16} /> },
  { id: "features", name: "Features", icon: <Server size={16} /> },
  { id: "pages", name: "Pages", icon: <Globe size={16} /> },
  { id: "api", name: "API Endpoints", icon: <Database size={16} /> },
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
  const [isBlankProject, setIsBlankProject] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ProjectCreate>>({
    name: "",
    description: "",
    template_type: "web_app",
    business_goals: [],
    target_users: [],
    domain: "",
    organization: "",
    project_lead: "",
    functional_requirements: [],
    non_functional_requirements: [],
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
      // Prepare empty defaults in case fields don't exist
      const emptyFeatures = { core_modules: [] };
      const emptyPages = { public: [], authenticated: [], admin: [] };
      const emptyApi = { endpoints: [] };

      // Parse business goals and target users into arrays if they're provided as strings
      const parseStringToArray = (
        value: string | string[] | undefined
      ): string[] => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      };

      // Extract values from project defaults
      const businessGoals =
        selectedTemplate.project_defaults?.business_goals || [];
      const targetUsers = selectedTemplate.project_defaults?.target_users || [];

      // Update form data with template values
      setFormData({
        name: selectedTemplate.project_defaults?.name || "",
        description: selectedTemplate.project_defaults?.description || "",
        template_type: selectedTemplate.name || "web_app",
        business_goals: parseStringToArray(businessGoals),
        target_users: parseStringToArray(targetUsers),
        functional_requirements: [],
        non_functional_requirements: [],
        template_id: templateId || undefined,
        template_data: {
          ...selectedTemplate,
          features: selectedTemplate.features || emptyFeatures,
          pages: selectedTemplate.pages || emptyPages,
          api: selectedTemplate.api || emptyApi,
        },
      });
    }
  }, [selectedTemplate, templateId]);

  const handleTemplateSelect = (template: ProjectTemplate | null) => {
    setSelectedTemplate(template);
    if (template) {
      setIsBlankProject(false);
      // After selecting a template, automatically move to the next step
      setCurrentStep("basics");
    }
  };

  const handleBlankProjectSelect = () => {
    setSelectedTemplate(null);
    setIsBlankProject(true);

    // Initialize with empty defaults for a blank project
    setFormData({
      name: "",
      description: "",
      template_type: "custom",
      business_goals: [],
      target_users: [],
      domain: "",
      organization: "",
      project_lead: "",
      functional_requirements: [],
      non_functional_requirements: [],
      template_id: undefined,
      template_data: {
        id: "blank",
        name: "Custom Project",
        description: "A custom project created from scratch",
        version: "1.0.0",
        project_defaults: {
          name: "",
          description: "",
          business_goals: [],
          target_users: [],
        },
        tech_stack: {
          frontend: "",
          backend: "",
          database: "",
        },
        features: {
          core_modules: [],
        },
        pages: {
          public: [],
          authenticated: [],
          admin: [],
        },
        api: {
          endpoints: [],
        },
      },
    });

    // Move to the basics step
    setCurrentStep("basics");
  };

  const handleBasicsSubmit = (data: Record<string, unknown>) => {
    const businessGoals =
      typeof data.business_goals === "string"
        ? data.business_goals
            .split(",")
            .map((g) => g.trim())
            .filter(Boolean)
        : (data.business_goals as string[]) || [];

    const targetUsers =
      typeof data.target_users === "string"
        ? data.target_users
            .split(",")
            .map((u) => u.trim())
            .filter(Boolean)
        : (data.target_users as string[]) || [];

    setFormData((prev) => ({
      ...prev,
      name: data.name as string,
      description: data.description as string,
      domain: data.domain as string,
      organization: data.organization as string,
      project_lead: data.project_lead as string,
      business_goals: businessGoals,
      target_users: targetUsers,
    }));

    setCurrentStep("tech-stack");
  };

  const handleTechStackSubmit = (data: Record<string, unknown>) => {
    // Update the tech stack in the template_data
    if (formData.template_data) {
      setFormData((prev) => ({
        ...prev,
        template_data: {
          ...prev.template_data!,
          tech_stack: {
            ...prev.template_data!.tech_stack,
            frontend: data.frontend as string,
            backend: data.backend as string,
            database: data.database as string,
          },
        },
      }));
    }

    setCurrentStep("requirements");
  };

  const handleRequirementsSubmit = (data: {
    functional_requirements: Requirement[];
    non_functional_requirements: Requirement[];
  }) => {
    setFormData((prev) => ({
      ...prev,
      functional_requirements: data.functional_requirements,
      non_functional_requirements: data.non_functional_requirements,
    }));

    setCurrentStep("features");
  };

  const handleFeaturesSubmit = (data: { core_modules: FeatureModule[] }) => {
    // Update the features in the template_data
    if (formData.template_data) {
      setFormData((prev) => ({
        ...prev,
        template_data: {
          ...prev.template_data!,
          features: {
            ...prev.template_data!.features,
            core_modules: data.core_modules,
          },
        },
      }));
    }

    setCurrentStep("pages");
  };

  const handlePagesSubmit = (data: {
    public: PageComponent[];
    authenticated: PageComponent[];
    admin: PageComponent[];
  }) => {
    // Update the pages in the template_data
    if (formData.template_data) {
      setFormData((prev) => ({
        ...prev,
        template_data: {
          ...prev.template_data!,
          pages: {
            public: data.public,
            authenticated: data.authenticated,
            admin: data.admin,
          },
        },
      }));
    }

    setCurrentStep("api");
  };

  const handleApiEndpointsSubmit = (data: { endpoints: ApiEndpoint[] }) => {
    // Update the API endpoints in the template_data
    if (formData.template_data) {
      setFormData((prev) => ({
        ...prev,
        template_data: {
          ...prev.template_data!,
          api: {
            endpoints: data.endpoints,
          },
        },
      }));
    }

    setCurrentStep("review");
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

      // Create new project with all collected data
      const newProject: ProjectCreate = {
        name: formData.name || "",
        description: formData.description || "",
        template_type: formData.template_type || "web_app",
        business_goals: formData.business_goals || [],
        target_users: formData.target_users || [],
        domain: formData.domain,
        organization: formData.organization,
        project_lead: formData.project_lead,
        functional_requirements: formData.functional_requirements || [],
        non_functional_requirements: formData.non_functional_requirements || [],
        template_id: formData.template_id,
        template_data: formData.template_data,
      };

      const result = await createProject(newProject);

      if (result) {
        navigate(`/projects/${result.id}`);
      } else {
        // Handle error case
        setError("Failed to create project. Please try again.");
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      setError("An unexpected error occurred. Please try again.");
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
              <div className="animate-pulse inline-block h-8 w-8 rounded-full bg-primary-200 dark:bg-primary-900"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Loading template...
              </p>
            </div>
          );
        }

        // Show error state
        if (error) {
          return (
            <div className="py-10 text-center">
              <div className="text-red-600 dark:text-red-400 mb-4">
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
            </div>
          );
        }

        return (
          <div>
            <div className="mb-6 text-center">
              <button
                className="mx-auto px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-800 dark:text-slate-200 font-medium transition-colors"
                onClick={handleBlankProjectSelect}
              >
                Start with a Blank Project
              </button>
            </div>

            <div className="relative py-4 my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white dark:bg-slate-800 text-sm text-slate-500 dark:text-slate-400">
                  Or select a template
                </span>
              </div>
            </div>

            <TemplateSelector
              onTemplateSelect={handleTemplateSelect}
              selectedTemplateId={templateId || undefined}
            />

            {selectedTemplate && (
              <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <TemplateDetails template={selectedTemplate} />
              </div>
            )}
          </div>
        );
      case "basics":
        return (
          <ProjectBasicsForm
            initialData={{
              name: formData.name || "",
              description: formData.description || "",
              business_goals: formData.business_goals?.join(", ") || "",
              target_users: formData.target_users?.join(", ") || "",
              domain: formData.domain || "",
              organization: formData.organization || "",
              project_lead: formData.project_lead || "",
            }}
            onSubmit={handleBasicsSubmit}
          />
        );
      case "tech-stack":
        return (
          <TechStackForm
            initialData={{
              frontend: formData.template_data?.tech_stack?.frontend || "",
              backend: formData.template_data?.tech_stack?.backend || "",
              database: formData.template_data?.tech_stack?.database || "",
              // Include other tech stack fields as needed
              frontend_language: "",
              ui_library: "",
              state_management: "",
              backend_provider: "",
              database_provider: "",
              auth_provider: "",
              auth_methods: "",
            }}
            onSubmit={handleTechStackSubmit}
            onBack={() => setCurrentStep("basics")}
          />
        );
      case "requirements":
        return (
          <RequirementsForm
            initialData={{
              functional_requirements: formData.functional_requirements || [],
              non_functional_requirements:
                formData.non_functional_requirements || [],
            }}
            onSubmit={handleRequirementsSubmit}
            onBack={() => setCurrentStep("tech-stack")}
          />
        );
      case "features":
        return (
          <FeaturesForm
            initialData={{
              core_modules:
                formData.template_data?.features?.core_modules || [],
            }}
            onSubmit={handleFeaturesSubmit}
            onBack={() => setCurrentStep("requirements")}
          />
        );
      case "pages":
        return (
          <PagesForm
            initialData={{
              public: formData.template_data?.pages?.public || [],
              authenticated: formData.template_data?.pages?.authenticated || [],
              admin: formData.template_data?.pages?.admin || [],
            }}
            onSubmit={handlePagesSubmit}
            onBack={() => setCurrentStep("features")}
          />
        );
      case "api":
        return (
          <ApiEndpointsForm
            initialData={{
              endpoints: formData.template_data?.api?.endpoints || [],
            }}
            onSubmit={handleApiEndpointsSubmit}
            onBack={() => setCurrentStep("pages")}
          />
        );
      case "review":
        return (
          <ProjectReviewForm
            projectData={formData}
            onSubmit={handleCreateProject}
            onBack={() => setCurrentStep("api")}
            onEdit={(section) => setCurrentStep(section)}
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
    if (currentStep === "template") {
      // For the template step, either use the selected template or start with a blank project
      if (isBlankProject) {
        setCurrentStep("basics");
        return;
      } else if (selectedTemplate) {
        setCurrentStep("basics");
        return;
      }
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

  // Check if we can continue from the template step
  const canContinueFromTemplate =
    isBlankProject || (currentStep === "template" && selectedTemplate !== null);

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
            Define your project specifications to generate an architecture plan
          </p>
        </div>

        {/* Main content card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Steps indicator */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <ProgressBar
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Form content */}
          <div className="p-6">{renderStepContent()}</div>

          {/* Footer with navigation buttons */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex justify-between">
            <button
              onClick={() => {
                if (!isFirstStep) {
                  const prevStepId = steps[currentStepIndex - 1].id;
                  setCurrentStep(prevStepId);
                } else {
                  navigate("/");
                }
              }}
              className="flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <ChevronLeft size={16} className="mr-1" />
              {isFirstStep ? "Cancel" : "Previous"}
            </button>

            <button
              onClick={submitCurrentForm}
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentStep === "template" &&
                !selectedTemplate &&
                !isBlankProject
                  ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 text-white"
              }`}
              disabled={
                currentStep === "template" &&
                !selectedTemplate &&
                !isBlankProject
              }
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
