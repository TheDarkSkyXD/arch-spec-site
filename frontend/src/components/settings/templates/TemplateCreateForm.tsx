import { useState } from "react";

interface TemplateCreateFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const TemplateCreateForm = ({ onCancel, onSave }: TemplateCreateFormProps) => {
  const [formState, setFormState] = useState({
    name: "",
    version: "1.0.0",
    description: "",
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold mb-6">Create New Template</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <p className="text-sm text-blue-700">
          Template management feature is coming soon. This UI demonstrates how it
          will work.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Template Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="My Template"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Version
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="1.0.0"
            value={formState.version}
            onChange={(e) =>
              setFormState({ ...formState, version: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Template description"
            rows={3}
            value={formState.description}
            onChange={(e) =>
              setFormState({ ...formState, description: e.target.value })
            }
          />
        </div>
        <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            onClick={onSave}
          >
            Create Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCreateForm;