import { ProjectTemplate } from "../../../types";

interface TemplateEditFormProps {
  template: ProjectTemplate;
  onCancel: () => void;
  onSave: () => void;
}

const TemplateEditForm = ({
  template,
  onCancel,
  onSave,
}: TemplateEditFormProps) => {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-100">
        Edit Template
      </h2>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-6">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          To edit the actual template, use the JSON editor (Cancel or Save to
          exit edit mode).
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Template Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
            value={template.name}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Version
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
            value={template.version}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
            value={template.description}
            rows={3}
            readOnly
          />
        </div>
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            onClick={onSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditForm;
