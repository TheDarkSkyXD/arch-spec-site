import { useState, useEffect } from 'react';
import { templatesService } from '../services/templatesService';
import { ProjectTemplate } from '../types/templates';
import { useSearchParams } from 'react-router-dom';

export function useProjectTemplateSection() {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);

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
            setError(
              `Template with ID ${templateId} not found. Please try browsing all templates.`
            );
          }
        } catch (err) {
          console.error('Error loading template:', err);
          setError('Failed to load the selected template. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadTemplateFromApi();
  }, [templateId, setLoading, setError]);

  const handleTemplateSelect = (template: ProjectTemplate | null) => {
    setSelectedTemplate(template);
  };

  const handleBlankProjectSelect = () => {
    setSelectedTemplate(null);
  };

  return {
    loading,
    error,
    selectedTemplate,
    handleTemplateSelect,
    handleBlankProjectSelect,
  };
}
