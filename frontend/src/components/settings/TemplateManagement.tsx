import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { templatesService } from "../../services/templatesService";
import { ProjectTemplate } from "../../types";
import {
  TemplateList,
  TemplateDetail,
  TemplateEditForm,
  TemplateCreateForm,
} from "./templates";

const TemplateManagement = () => {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const templatesData = await templatesService.getTemplates();
      setTemplates(templatesData);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
      setError("Failed to load templates. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleSaveEdit = () => {
    alert("This feature is coming soon!");
    setIsEditing(false);
  };

  const handleSaveCreate = () => {
    alert("This feature is coming soon!");
    setIsCreating(false);
  };

  const renderMainContent = () => {
    if (isCreating) {
      return (
        <TemplateCreateForm onCancel={handleCancel} onSave={handleSaveCreate} />
      );
    }

    if (isEditing && selectedTemplate) {
      return (
        <TemplateEditForm
          template={selectedTemplate}
          onCancel={handleCancel}
          onSave={handleSaveEdit}
        />
      );
    }

    return (
      <TemplateDetail
        selectedTemplate={selectedTemplate}
        isCreating={isCreating}
        isEditing={isEditing}
        onEdit={() => handleEditTemplate()}
        onCreateNew={handleCreateNew}
        onCancel={handleCancel}
      />
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-medium text-slate-800">Templates</h2>
          <button
            onClick={handleCreateNew}
            className="p-1.5 rounded-md text-slate-600 hover:text-primary-600 hover:bg-primary-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
          <TemplateList
            templates={templates}
            loading={loading}
            error={error}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
            onCreateNew={handleCreateNew}
            onEditTemplate={handleEditTemplate}
          />
        </div>
      </div>
      <div className="lg:col-span-2">{renderMainContent()}</div>
    </div>
  );
};

export default TemplateManagement;
