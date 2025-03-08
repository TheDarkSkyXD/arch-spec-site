import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextDefinition";
import { useProjectStore } from "../store/projectStore";
import { ProjectCreate } from "../types/project";
import {
  ProjectWizardFormData} from "../components/project/ProjectWizardTypes";
import { projectWizardSteps } from "../components/project/ProjectWizardSteps";
import { useProjectTemplateSection } from "./wizard/useProjectTemplateSection";
import { useProjectBasicsSection } from "./wizard/useProjectBasicsSection";
import { useApiEndpointsSection } from "./wizard/useApiEndpointsSection";
import { useFeaturesSection } from "./wizard/useFeaturesSection";
import { usePagesSection } from "./wizard/usePagesSection";
import { useRequirementsSection } from "./wizard/useRequirementsSection";
import { useTechStackSection } from "./wizard/useTechStackSection";


export function useProjectWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");
  const { currentUser } = useAuth();
  const { createProject } = useProjectStore();

  const [currentStep, setCurrentStep] = useState("template");
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

  // Initialize section hooks
  const templateSection = useProjectTemplateSection({
    templateId,
    formData,
    setFormData,
    setCurrentStep,
    setLoading,
    setError
  });

  const basicsSection = useProjectBasicsSection({
    formData,
    setFormData,
    setCurrentStep
  });

  const techStackSection = useTechStackSection({
    formData,
    setFormData,
    setCurrentStep
  });

  const requirementsSection = useRequirementsSection({
    formData,
    setFormData,
    setCurrentStep
  });

  const featuresSection = useFeaturesSection({
    formData,
    setFormData,
    setCurrentStep
  });

  const pagesSection = usePagesSection({
    formData,
    setFormData,
    setCurrentStep
  });

  const apiEndpointsSection = useApiEndpointsSection({
    formData,
    setFormData,
    setCurrentStep
  });

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
      if (templateSection.selectedTemplate && !templateSection.isBlankProject) {
        projectData.template_id = templateSection.selectedTemplate.id;

        // Include metadata with template info
        projectData.metadata = {
          version: "0.1",
          author: currentUser?.displayName || currentUser?.email || "Anonymous",
          template: {
            name: templateSection.selectedTemplate.name,
            version: templateSection.selectedTemplate.version,
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
      if (templateSection.selectedTemplate && !templateSection.isBlankProject) {
        projectData.template_data = templateSection.selectedTemplate;
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
      if (templateSection.isBlankProject) {
        setCurrentStep("basics");
        return;
      } else if (templateSection.selectedTemplate) {
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
  const canContinueFromTemplate = templateSection.isBlankProject || (currentStep === "template" && templateSection.selectedTemplate !== null);

  return {
    currentStep,
    setCurrentStep,
    selectedTemplate: templateSection.selectedTemplate,
    isBlankProject: templateSection.isBlankProject,
    loading,
    error,
    formData,
    handleTemplateSelect: templateSection.handleTemplateSelect,
    handleBlankProjectSelect: templateSection.handleBlankProjectSelect,
    handleBasicsSubmit: basicsSection.handleBasicsSubmit,
    handleTechStackSubmit: techStackSection.handleTechStackSubmit,
    handleRequirementsSubmit: requirementsSection.handleRequirementsSubmit,
    handleFeaturesSubmit: featuresSection.handleFeaturesSubmit,
    handlePagesSubmit: pagesSection.handlePagesSubmit,
    handleApiEndpointsSubmit: apiEndpointsSection.handleApiEndpointsSubmit,
    handleCreateProject,
    handleStepClick,
    submitCurrentForm,
    goToNextStep,
    goToPreviousStep,
    canContinueFromTemplate,
  };
}