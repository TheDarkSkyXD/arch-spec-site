import { useState } from 'react';
import TemplateSelector from '../templates/TemplateSelector';
import TemplateDetailsModal from '../modals/TemplateDetailsModal';
import { ProjectTemplate } from '../../types/templates';

interface TemplateSelectionStepProps {
  selectedTemplate: ProjectTemplate | null;
  onTemplateSelect: (template: ProjectTemplate | null) => void;
  onBlankProjectSelect: () => void;
  loading?: boolean;
  error?: string | null;
}

const TemplateSelectionStep = ({
  selectedTemplate,
  onTemplateSelect,
  onBlankProjectSelect,
  loading = false,
  error = null,
}: TemplateSelectionStepProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show loading state when fetching template
  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block h-8 w-8 animate-pulse rounded-full bg-primary-200 dark:bg-primary-900"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading template...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="py-10 text-center">
        <div className="mb-4 text-red-600 dark:text-red-400">
          <p>{error}</p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            onClick={() => (window.location.href = '/templates')}
          >
            Browse all templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <button
          className="mx-auto rounded-lg bg-slate-100 px-6 py-3 font-medium text-slate-800 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          onClick={onBlankProjectSelect}
        >
          Start with a Blank Project
        </button>
      </div>

      <div className="relative my-4 py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Or select a template
          </span>
        </div>
      </div>

      <TemplateSelector
        onTemplateSelect={onTemplateSelect}
        selectedTemplateId={selectedTemplate?.id}
        initialSelectedTemplate={selectedTemplate}
      />

      {selectedTemplate && (
        <div className="mt-8 flex justify-center border-t border-slate-200 pt-6 dark:border-slate-700">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary-100 px-4 py-2 text-primary-600 transition-colors hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Preview Template Details
          </button>
        </div>
      )}

      {selectedTemplate && (
        <TemplateDetailsModal
          template={selectedTemplate}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUseTemplate={() => {
            setIsModalOpen(false);
            // The template is already selected, so no need to call onTemplateSelect again
          }}
        />
      )}
    </div>
  );
};

export default TemplateSelectionStep;
