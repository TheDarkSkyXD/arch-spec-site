import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextDefinition";
import { useProjectStore } from "../store/projectStore";
import { templatesService } from "../services/templatesService";
import { ProjectTemplate, ProjectCreate } from "../types/project";
import {
  ProjectWizardFormData,
  BasicsFormData,
  TechStackFormData,
  RequirementsFormData,
  FeaturesFormData,
  PagesFormData,
  ApiEndpointsFormData
} from "../components/project/ProjectWizardTypes";
import { projectWizardSteps } from "../components/project/ProjectWizardSteps";

export function useProjectWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");
  const { currentUser } = useAuth();
  const { createProject } = useProjectStore();

  const [currentStep, setCurrentStep] = useState("template");
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [isBlankProject, setIsBlankProject] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectWizardFormData>({
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
            console.log(`Successfully loaded template: ${template.name} (${template.version})`);
            setSelectedTemplate(template);
          } else {
            console.error(`Template with ID ${templateId} not found in API response`);
            setError(`Template with ID ${templateId} not found. Please try browsing all templates.`);
          }
        } catch (err) {
          console.error("Error loading template:", err);
          setError("Failed to load the selected template. Please try again later.");
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
      const parseStringToArray = (value: string | string[] | undefined): string[] => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      };

      // Extract values from project defaults
      const businessGoals = selectedTemplate.project_defaults?.business_goals || [];
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

  const handleBasicsSubmit = (data: BasicsFormData) => {
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
      name: data.name,
      description: data.description,
      domain: data.domain,
      organization: data.organization,
      project_lead: data.project_lead,
      business_goals: businessGoals,
      target_users: targetUsers,
    }));

    setCurrentStep("tech-stack");
  };

  const handleTechStackSubmit = (data: TechStackFormData) => {
    // Update the tech stack in the template_data
    if (formData.template_data) {
      setFormData((prev) => ({
        ...prev,
        template_data: {
          ...prev.template_data!,
          tech_stack: {
            ...prev.template_data!.tech_stack,
            frontend: data.frontend,
            backend: data.backend,
            database: data.database,
          },
        },
      }));
    }

    setCurrentStep("requirements");
  };

  const handleRequirementsSubmit = (data: RequirementsFormData) => {
    setFormData((prev) => ({
      ...prev,
      functional_requirements: data.functional_requirements,
      non_functional_requirements: data.non_functional_requirements,
    }));

    setCurrentStep("features");
  };

  const handleFeaturesSubmit = (data: FeaturesFormData) => {
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

  const handlePagesSubmit = (data: PagesFormData) => {
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

  const handleApiEndpointsSubmit = (data: ApiEndpointsFormData) => {
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
      setLoading(true);
      setError(null);

      // Make sure we have required fields
      if (!formData.name || !formData.description) {
        setError("Project name and description are required");
        setLoading(false);
        return;
      }

      // Prepare project data
      const projectData: ProjectCreate = {
        name: formData.name!,
        description: formData.description!,
        template_type: formData.template_type || "web_app",
        business_goals: formData.business_goals || [],
        target_users: formData.target_users || [],
        domain: formData.domain,
        organization: formData.organization,
        project_lead: formData.project_lead,
        functional_requirements: formData.functional_requirements || [],
        non_functional_requirements: formData.non_functional_requirements || [],
      };

      // Add template id if using a template
      if (selectedTemplate && !isBlankProject) {
        projectData.template_id = selectedTemplate.id;

        // Include metadata with template info
        projectData.metadata = {
          version: "0.1",
          author: currentUser?.displayName || currentUser?.email || "Anonymous",
          template: {
            name: selectedTemplate.name,
            version: selectedTemplate.version,
          },
        };
      } else {
        // Include basic metadata
        projectData.metadata = {
          version: "0.1",
          author: currentUser?.displayName || currentUser?.email || "Anonymous",
        };
      }

      // Handle sections data if available
      if (formData.timeline) {
        projectData.timeline = formData.timeline;
      }

      if (formData.budget) {
        projectData.budget = formData.budget;
      }

      // Add template data if we're using a template
      if (selectedTemplate && !isBlankProject) {
        projectData.template_data = selectedTemplate;
      }

      console.log("Creating project with data:", projectData);
      const newProject = await createProject(projectData);

      if (newProject) {
        console.log("Project created successfully:", newProject);
        navigate(`/projects/${newProject.id}`);
      } else {
        setError("Failed to create project. Please try again.");
      }
    } catch (err) {
      console.error("Error creating project:", err);
      setError("An error occurred while creating the project.");
    } finally {
      setLoading(false);
    }
  };

  const handleStepClick = (stepId: string) => {
    // Only allow going back to previous steps or to the next step
    const currentIndex = projectWizardSteps.findIndex((step) => step.id === currentStep);
    const targetIndex = projectWizardSteps.findIndex((step) => step.id === stepId);

    if (targetIndex <= currentIndex || targetIndex === currentIndex + 1) {
      setCurrentStep(stepId);
    }
  };

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

  // Navigation helpers
  const goToNextStep = () => {
    const currentIndex = projectWizardSteps.findIndex((step) => step.id === currentStep);
    if (currentIndex < projectWizardSteps.length - 1) {
      setCurrentStep(projectWizardSteps[currentIndex + 1].id);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = projectWizardSteps.findIndex((step) => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(projectWizardSteps[currentIndex - 1].id);
    } else {
      navigate("/");
    }
  };

  // Check if we can continue from the template step
  const canContinueFromTemplate = isBlankProject || (currentStep === "template" && selectedTemplate !== null);

  return {
    currentStep,
    setCurrentStep,
    selectedTemplate,
    isBlankProject,
    loading,
    error,
    formData,
    handleTemplateSelect,
    handleBlankProjectSelect,
    handleBasicsSubmit,
    handleTechStackSubmit,
    handleRequirementsSubmit,
    handleFeaturesSubmit,
    handlePagesSubmit,
    handleApiEndpointsSubmit,
    handleCreateProject,
    handleStepClick,
    submitCurrentForm,
    goToNextStep,
    goToPreviousStep,
    canContinueFromTemplate,
  };
}