import { Plus, Edit, Loader } from "lucide-react";
import { ProjectTemplate } from "../../../types";

interface TemplateListProps {
  templates: ProjectTemplate[];
  loading: boolean;
  error: string | null;
  selectedTemplate: ProjectTemplate | null;
  onSelectTemplate: (template: ProjectTemplate) => void;
  onCreateNew: () => void;
  onEditTemplate: (template: ProjectTemplate) => void;
}

const TemplateList = ({
  templates,
  loading,
  error,
  selectedTemplate,
  onSelectTemplate,
  onCreateNew,
  onEditTemplate,
}: TemplateListProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-6 h-6 text-primary-500 animate-spin mr-2" />
        <span className="text-slate-700 dark:text-slate-300">
          Loading templates...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 dark:text-red-400">
        <p>{error}</p>
        <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
          Retry
        </button>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          No templates available
        </p>
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center justify-center mx-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Template
        </button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {templates.map((template) => (
        <div
          key={template.id || template.name}
          className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
            selectedTemplate?.id === template.id
              ? "bg-slate-50 dark:bg-slate-700/50"
              : ""
          }`}
          onClick={() => onSelectTemplate(template)}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-slate-800 dark:text-slate-100">
                {template.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {template.description}
              </p>
              <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                Version: {template.version}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTemplate(template);
                }}
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;
