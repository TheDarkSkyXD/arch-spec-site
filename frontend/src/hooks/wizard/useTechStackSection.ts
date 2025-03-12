import { Dispatch, SetStateAction } from "react";
import { ProjectWizardFormData } from "../../components/project/ProjectWizardTypes";
import { ProjectTechStack } from "../../types/templates";

// TODO This hook should no longer be needed

interface TechStackSectionProps {
  formData: ProjectWizardFormData;
  setFormData: Dispatch<SetStateAction<ProjectWizardFormData>>;
  setCurrentStep: Dispatch<SetStateAction<string>>;
}

export function useTechStackSection({
  formData,
  setFormData,
}: TechStackSectionProps) {
  const handleTechStackSubmit = (data: ProjectTechStack) => {
    // Update form data with tech stack data in structured format
    setFormData((prevData) => ({
      ...prevData,
      tech_stack_data: data,
    }));

    // Move to the next step (optional)
    // setCurrentStep("requirements");
  };

  return {
    handleTechStackSubmit,
    techStackValues: formData.tech_stack_data,
  };
}
