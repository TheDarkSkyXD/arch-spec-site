import { Dispatch, SetStateAction } from "react";
import { ProjectWizardFormData, FeaturesFormData } from "../../components/project/ProjectWizardTypes";

interface FeaturesSectionProps {
  formData: ProjectWizardFormData;
  setFormData: Dispatch<SetStateAction<ProjectWizardFormData>>;
  setCurrentStep: Dispatch<SetStateAction<string>>;
}

export function useFeaturesSection({
  formData,
  setFormData,
  setCurrentStep,
}: FeaturesSectionProps) {
  
  const handleFeaturesSubmit = (data: FeaturesFormData) => {
    // Update form data with features
    setFormData(prevData => ({
      ...prevData,
      template_data: {
        ...(prevData.template_data || {}),
        features: {
          core_modules: data.core_modules || []
        }
      }
    }));

    // Move to the next step
    setCurrentStep("pages");
  };

  return {
    handleFeaturesSubmit,
    featuresValues: {
      core_modules: formData.template_data?.features?.core_modules || []
    }
  };
}