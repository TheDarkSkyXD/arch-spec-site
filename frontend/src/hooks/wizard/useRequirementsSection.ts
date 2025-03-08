import { Dispatch, SetStateAction } from "react";
import { ProjectWizardFormData, RequirementsFormData } from "../../components/project/ProjectWizardTypes";

interface RequirementsSectionProps {
  formData: ProjectWizardFormData;
  setFormData: Dispatch<SetStateAction<ProjectWizardFormData>>;
  setCurrentStep: Dispatch<SetStateAction<string>>;
}

export function useRequirementsSection({
  formData,
  setFormData,
  setCurrentStep,
}: RequirementsSectionProps) {
  
  const handleRequirementsSubmit = (data: RequirementsFormData) => {
    // Update form data with requirements
    setFormData(prevData => ({
      ...prevData,
      functional_requirements: data.functional_requirements || [],
      non_functional_requirements: data.non_functional_requirements || [],
    }));

    // Move to the next step
    setCurrentStep("features");
  };

  return {
    handleRequirementsSubmit,
    requirementsValues: {
      functional_requirements: formData.functional_requirements || [],
      non_functional_requirements: formData.non_functional_requirements || [],
    }
  };
}