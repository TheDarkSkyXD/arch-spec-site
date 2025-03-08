import { Dispatch, SetStateAction } from "react";
import { ProjectWizardFormData, PagesFormData } from "../../components/project/ProjectWizardTypes";

interface PagesSectionProps {
  formData: ProjectWizardFormData;
  setFormData: Dispatch<SetStateAction<ProjectWizardFormData>>;
  setCurrentStep: Dispatch<SetStateAction<string>>;
}

export function usePagesSection({
  formData,
  setFormData,
  setCurrentStep,
}: PagesSectionProps) {
  
  const handlePagesSubmit = (data: PagesFormData) => {
    // Update form data with pages
    setFormData(prevData => ({
      ...prevData,
      template_data: {
        ...(prevData.template_data || {}),
        pages: {
          public: data.public || [],
          authenticated: data.authenticated || [],
          admin: data.admin || [],
        }
      }
    }));

    // Move to the next step
    setCurrentStep("api");
  };

  return {
    handlePagesSubmit,
    pagesValues: {
      public: formData.template_data?.pages?.public || [],
      authenticated: formData.template_data?.pages?.authenticated || [],
      admin: formData.template_data?.pages?.admin || [],
    }
  };
}