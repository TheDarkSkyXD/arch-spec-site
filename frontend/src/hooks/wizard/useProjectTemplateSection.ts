import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { templatesService } from "../../services/templatesService";
import { ProjectTemplate } from "../../types/templates";
import { ProjectWizardFormData } from "../../components/project/ProjectWizardTypes";

interface ProjectTemplateSectionProps {
  templateId: string | null;
  formData: ProjectWizardFormData;
  setFormData: Dispatch<SetStateAction<ProjectWizardFormData>>;
  setCurrentStep: Dispatch<SetStateAction<string>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
}

export function useProjectTemplateSection({
  templateId,
  setFormData,
  setCurrentStep,
  setLoading,
  setError,
}: ProjectTemplateSectionProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplate | null>(null);
  const [isBlankProject, setIsBlankProject] = useState<boolean>(false);

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
  }, [templateId, setLoading, setError]);

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
        selectedTemplate.projectDefaults?.business_goals || [];
      const targetUsers = selectedTemplate.projectDefaults?.target_users || [];

      // Update form data with template values
      setFormData({
        name: selectedTemplate.projectDefaults?.name || "",
        description: selectedTemplate.projectDefaults?.description || "",
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
  }, [selectedTemplate, templateId, setFormData]);

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
        projectDefaults: {
          name: "",
          description: "",
          business_goals: [],
          target_users: [],
        },
        techStack: {
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

  return {
    selectedTemplate,
    isBlankProject,
    handleTemplateSelect,
    handleBlankProjectSelect,
  };
}
