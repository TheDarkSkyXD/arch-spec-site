import { Dispatch, SetStateAction } from "react";
import { ProjectWizardFormData, BasicsFormData } from "../../components/project/ProjectWizardTypes";

interface ProjectBasicsSectionProps {
  formData: ProjectWizardFormData;
  setFormData: Dispatch<SetStateAction<ProjectWizardFormData>>;
  setCurrentStep: Dispatch<SetStateAction<string>>;
}

export function useProjectBasicsSection({
  formData,
  setFormData,
  setCurrentStep,
}: ProjectBasicsSectionProps) {
  
  const handleBasicsSubmit = (data: BasicsFormData) => {
    // Convert string arrays or comma-separated strings to arrays
    const parseStringToArray = (value: string | string[] | undefined): string[] => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    };

    // Update form data with basics section values
    setFormData(prevData => ({
      ...prevData,
      name: data.name,
      description: data.description,
      business_goals: parseStringToArray(data.business_goals),
      target_users: parseStringToArray(data.target_users),
      domain: data.domain,
      organization: data.organization,
      project_lead: data.project_lead,
    }));

    // Move to the next step
    setCurrentStep("tech-stack");
  };

  return {
    handleBasicsSubmit,
    basicValues: {
      name: formData.name || "",
      description: formData.description || "",
      business_goals: formData.business_goals || [],
      target_users: formData.target_users || [],
      domain: formData.domain || "",
      organization: formData.organization || "",
      project_lead: formData.project_lead || "",
    }
  };
}