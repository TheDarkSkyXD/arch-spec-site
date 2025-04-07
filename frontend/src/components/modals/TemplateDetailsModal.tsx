import React from 'react';
import { ProjectTemplate } from '../../types/templates';
import TemplateDetails from '../templates/TemplateDetails';

interface TemplateDetailsModalProps {
  template: ProjectTemplate;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (templateId: string) => void;
}

const TemplateDetailsModal: React.FC<TemplateDetailsModalProps> = ({
  template,
  isOpen,
  onClose,
  onUseTemplate,
}) => {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="scrollbar-custom relative m-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-slate-900">
          <style>
            {`
            .scrollbar-custom {
              scrollbar-width: thin;
              scrollbar-color: rgba(203, 213, 225, 0.4) transparent;
            }

            .scrollbar-custom::-webkit-scrollbar {
              width: 5px;
            }

            .scrollbar-custom::-webkit-scrollbar-track {
              background: transparent;
              margin: 3px;
            }

            .scrollbar-custom::-webkit-scrollbar-thumb {
              background-image: linear-gradient(
                to bottom,
                rgba(203, 213, 225, 0.3),
                rgba(148, 163, 184, 0.5)
              );
              border-radius: 20px;
              border: 1px solid transparent;
              background-clip: padding-box;
            }

            .dark .scrollbar-custom::-webkit-scrollbar-thumb {
              background-image: linear-gradient(
                to bottom,
                rgba(51, 65, 85, 0.5),
                rgba(71, 85, 105, 0.8)
              );
            }

            .scrollbar-custom::-webkit-scrollbar-thumb:hover {
              background-image: linear-gradient(
                to bottom,
                rgba(148, 163, 184, 0.6),
                rgba(100, 116, 139, 0.8)
              );
            }

            .dark .scrollbar-custom::-webkit-scrollbar-thumb:hover {
              background-image: linear-gradient(
                to bottom,
                rgba(71, 85, 105, 0.7),
                rgba(100, 116, 139, 0.9)
              );
            }
            `}
          </style>
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Template Details
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <TemplateDetails template={template} />
          </div>
          <div className="sticky bottom-0 z-10 flex justify-end border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <button
              onClick={() => {
                onClose();
                onUseTemplate(template.id || template.version);
              }}
              className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 dark:bg-primary-900 dark:hover:bg-primary-800"
            >
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailsModal;
