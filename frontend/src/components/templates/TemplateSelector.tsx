import React, { useState, useEffect } from 'react';
import { ProjectTemplate } from '../../types/templates';
import { useTemplates } from '../../hooks/useDataQueries';
// Create inline version of TemplateCard component as a temporary solution
// Import will be fixed automatically when TypeScript environment is correctly set up

interface TemplateCardProps {
  template: ProjectTemplate;
  isSelected: boolean;
  onSelect: () => void;
}

// Temporarily duplicate TemplateCard component here until module resolution is fixed
const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onSelect }) => {
  // Get icon based on template type
  const getTemplateIcon = () => {
    try {
      if (!template.techStack || !template.techStack.frontend) {
        return '🧩';
      }

      // Frontend is now a string rather than an object with framework property
      const frontend = String(template.techStack.frontend).toLowerCase();
      if (frontend.includes('react')) {
        return '⚛️';
      } else if (frontend.includes('vue')) {
        return '🟢';
      } else if (frontend.includes('angular')) {
        return '🔴';
      } else {
        return '🧩';
      }
    } catch (error) {
      console.error('Error getting template icon:', error);
      return '🧩';
    }
  };

  const getFeaturesText = () => {
    // Add null checks to avoid accessing properties of undefined
    if (!template.features || !template.features.coreModules) {
      return 'No features available';
    }

    const enabledFeatures = template.features.coreModules
      .filter((feature) => feature.enabled)
      .map((feature) => feature.name);

    return enabledFeatures.length > 0
      ? enabledFeatures.slice(0, 3).join(', ') +
          (enabledFeatures.length > 3 ? `, +${enabledFeatures.length - 3} more` : '')
      : 'No enabled features';
  };

  return (
    <div
      className={`cursor-pointer rounded-lg border p-5 transition-all hover:shadow-md ${
        isSelected
          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-100 dark:bg-primary-900/20 dark:ring-primary-900/30'
          : 'border-slate-200 hover:border-primary-300 dark:border-slate-700 dark:hover:border-primary-600'
      }`}
      onClick={onSelect}
    >
      <div className="relative mb-4 flex h-32 items-center justify-center rounded bg-slate-100 dark:bg-slate-800">
        <span className="text-5xl">{getTemplateIcon()}</span>
        {isSelected && (
          <div className="absolute right-2 top-2">
            <div className="h-5 w-5 text-primary-600 dark:text-primary-400">✓</div>
          </div>
        )}
      </div>

      <h3 className="font-medium text-slate-800 dark:text-slate-100">
        {template.name || 'Unnamed Template'}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
        {template.description || 'No description available'}
      </p>

      <div className="mt-3 flex flex-wrap gap-1">
        {template.techStack?.frontend.framework && (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-200">
            {String(template.techStack.frontend.framework)}
          </span>
        )}
        {template.techStack?.backend && (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-200">
            {String(
              template.techStack.backend.type === 'framework'
                ? template.techStack.backend.framework
                : template.techStack.backend.service
            )}
          </span>
        )}
        {template.techStack?.database.system && (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-200">
            {String(template.techStack.database.system)}
          </span>
        )}
      </div>

      <div className="mt-3 text-xs text-slate-600">
        <span className="font-medium">Features:</span> {getFeaturesText()}
      </div>
    </div>
  );
};

interface TemplateSelectorProps {
  onTemplateSelect: (template: ProjectTemplate | null) => void;
  selectedTemplateId?: string;
  initialSelectedTemplate?: ProjectTemplate | null;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onTemplateSelect,
  selectedTemplateId,
  initialSelectedTemplate = null,
}) => {
  const { data: templates = [], isLoading, error: queryError } = useTemplates();

  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(
    initialSelectedTemplate
  );
  const [error, setError] = useState<string | null>(null);

  // Set error message if query fails
  useEffect(() => {
    if (queryError) {
      console.error('Error fetching templates:', queryError);
      setError('Failed to load templates. Please try again later.');
    }
  }, [queryError]);

  // Initialize with the passed in template if available
  useEffect(() => {
    if (initialSelectedTemplate) {
      setSelectedTemplate(initialSelectedTemplate);
    }
  }, [initialSelectedTemplate]);

  // Set selected template when templates are loaded or selectedTemplateId changes
  useEffect(() => {
    if (templates && templates.length > 0 && selectedTemplateId) {
      const template = templates.find(
        (t) =>
          t.id === selectedTemplateId ||
          t.version === selectedTemplateId ||
          t.name === selectedTemplateId
      );
      if (template) {
        setSelectedTemplate(template);
        onTemplateSelect(template);
      } else {
        console.warn(`Template with ID ${selectedTemplateId} not found`);
      }
    }
  }, [templates, selectedTemplateId, onTemplateSelect]);

  const handleCustomProject = () => {
    setSelectedTemplate(null);
    onTemplateSelect(null);
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block h-8 w-8 animate-pulse rounded-full bg-primary-200 dark:bg-primary-900/50"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-600 dark:text-red-400">
        <p>{error}</p>
        <button
          className="mt-4 rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Fallback if templates are empty but no error was set
  if (!templates || templates.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-slate-600 dark:text-slate-400">No project templates available.</p>
        <div className="mt-6">
          <div
            className="mx-auto max-w-md cursor-pointer rounded-lg border border-slate-200 p-5 transition-all hover:shadow-md dark:border-slate-700"
            onClick={handleCustomProject}
          >
            <div className="mb-4 flex h-32 items-center justify-center rounded bg-slate-100 dark:bg-slate-800">
              <span className="text-5xl text-slate-400 dark:text-slate-500">+</span>
            </div>
            <h3 className="font-medium text-slate-800 dark:text-slate-100">Custom Project</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Start from scratch with a blank project
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Select a Template
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Choose a template to jumpstart your project or start from scratch
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Template cards */}
        {templates.map((template) => (
          <TemplateCard
            key={template.id || template.name}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onSelect={() => {
              setSelectedTemplate(template);
              onTemplateSelect(template);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
