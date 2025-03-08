import { Dispatch, SetStateAction } from "react";
import { ProjectWizardFormData, ApiEndpointsFormData } from "../../components/project/ProjectWizardTypes";

interface ApiEndpointsSectionProps {
  formData: ProjectWizardFormData;
  setFormData: Dispatch<SetStateAction<ProjectWizardFormData>>;
  setCurrentStep: Dispatch<SetStateAction<string>>;
}

export function useApiEndpointsSection({
  formData,
  setFormData,
  setCurrentStep,
}: ApiEndpointsSectionProps) {
  
  const handleApiEndpointsSubmit = (data: ApiEndpointsFormData) => {
    // Update form data with API endpoints
    setFormData(prevData => ({
      ...prevData,
      template_data: {
        ...(prevData.template_data || {}),
        api: {
          endpoints: data.endpoints || []
        }
      }
    }));

    // Move to the final review step
    setCurrentStep("review");
  };

  return {
    handleApiEndpointsSubmit,
    apiEndpointsValues: {
      endpoints: formData.template_data?.api?.endpoints || []
    }
  };
}