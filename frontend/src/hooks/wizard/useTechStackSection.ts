import { Dispatch, SetStateAction } from "react";
import { ProjectWizardFormData, TechStackFormData } from "../../components/project/ProjectWizardTypes";

interface TechStackSectionProps {
  formData: ProjectWizardFormData;
  setFormData: Dispatch<SetStateAction<ProjectWizardFormData>>;
  setCurrentStep: Dispatch<SetStateAction<string>>;
}

export function useTechStackSection({
  formData,
  setFormData,
  setCurrentStep,
}: TechStackSectionProps) {
  
  const handleTechStackSubmit = (data: TechStackFormData) => {
    // Update form data with tech stack choices
    setFormData(prevData => ({
      ...prevData,
      tech_stack: {
        ...(prevData.tech_stack || {}),
        frontend: data.frontend,
        backend: data.backend,
        database: data.database,
        frontend_language: data.frontend_language,
        ui_library: data.ui_library,
        state_management: data.state_management,
        backend_provider: data.backend_provider,
        database_provider: data.database_provider,
        auth_provider: data.auth_provider,
        auth_methods: data.auth_methods,
      }
    }));

    // Move to the next step
    setCurrentStep("requirements");
  };

  return {
    handleTechStackSubmit,
    techStackValues: {
      frontend: formData.tech_stack?.frontend || "",
      backend: formData.tech_stack?.backend || "",
      database: formData.tech_stack?.database || "",
      frontend_language: formData.tech_stack?.frontend_language || "",
      ui_library: formData.tech_stack?.ui_library || "",
      state_management: formData.tech_stack?.state_management || "",
      backend_provider: formData.tech_stack?.backend_provider || "",
      database_provider: formData.tech_stack?.database_provider || "",
      auth_provider: formData.tech_stack?.auth_provider || "",
      auth_methods: formData.tech_stack?.auth_methods || "",
    }
  };
}