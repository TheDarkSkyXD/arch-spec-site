import { useState } from "react";
import TemplateSelector from "../templates/TemplateSelector";
import TemplateDetailsModal from "../modals/TemplateDetailsModal";
import { ProjectTemplate } from "../../types/templates";

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
        <div className="animate-pulse inline-block h-8 w-8 rounded-full bg-primary-200 dark:bg-primary-900"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Loading template...
        </p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="py-10 text-center">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <p>{error}</p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            onClick={() => (window.location.href = "/templates")}
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
          className="mx-auto px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-800 dark:text-slate-200 font-medium transition-colors"
          onClick={onBlankProjectSelect}
        >
          Start with a Blank Project
        </button>
      </div>

      <div className="relative py-4 my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-white dark:bg-slate-800 text-sm text-slate-500 dark:text-slate-400">
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
        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-lg flex items-center gap-2 transition-colors"
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
