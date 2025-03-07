import { useState } from "react";
import { Plus } from "lucide-react";
import { ProjectTemplate } from "../../types";
import {
  TemplateList,
  TemplateDetail,
  TemplateEditForm,
  TemplateCreateForm,
} from "./templates";
import { useTemplates, useRefreshTemplates } from "../../hooks/useDataQueries";

const TemplateManagement = () => {
  const { data: templates = [], isLoading, error: queryError } = useTemplates();
  const { refreshTemplates } = useRefreshTemplates();

  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Set error message if query fails
  if (queryError && !error) {
    console.error("Failed to fetch templates:", queryError);
    setError("Failed to load templates. Please try again later.");
  }

  const handleSelectTemplate = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleEditTemplate = (template?: ProjectTemplate) => {
    if (template) {
      setSelectedTemplate(template);
    }
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleTemplateUpdated = () => {
    // Use React Query's invalidation to refresh data
    refreshTemplates();
    setIsEditing(false);
    setIsCreating(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Project Templates</h2>
        <button
          onClick={handleCreateNew}
          className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center text-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TemplateList
            templates={templates}
            loading={isLoading}
            error={error}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
            onCreateNew={handleCreateNew}
            onEditTemplate={handleEditTemplate}
          />
        </div>
        <div className="lg:col-span-2">
          {isCreating ? (
            <TemplateCreateForm
              onCancel={handleCancel}
              onTemplateCreated={handleTemplateUpdated}
            />
          ) : isEditing && selectedTemplate ? (
            <TemplateEditForm
              template={selectedTemplate}
              onCancel={handleCancel}
              onSave={handleTemplateUpdated}
            />
          ) : (
            <TemplateDetail
              selectedTemplate={selectedTemplate}
              isCreating={isCreating}
              isEditing={isEditing}
              onEdit={() => handleEditTemplate(selectedTemplate)}
              onCreateNew={handleCreateNew}
              onCancel={handleCancel}
              onTemplateUpdated={handleTemplateUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateManagement;
