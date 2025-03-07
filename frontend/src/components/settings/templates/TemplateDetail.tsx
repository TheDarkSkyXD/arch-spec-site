import {
  Edit,
  Info,
  Plus,
  ChevronDown,
  ChevronUp,
  Save,
  X,
} from "lucide-react";
import { ProjectTemplate } from "../../../types";
import { useState, useEffect } from "react";
import JsonEditor from "../../common/JsonEditor";
import { templatesService } from "../../../services/templatesService";

interface TemplateDetailProps {
  selectedTemplate: ProjectTemplate | null;
  isCreating: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onCreateNew: () => void;
  onCancel: () => void;
  onTemplateUpdated?: () => void;
}

const TemplateDetail = ({
  selectedTemplate,
  isCreating,
  isEditing: _isEditing, // Prefix with _ to avoid linter warnings
  onEdit,
  onCreateNew,
  onCancel: _onCancel, // Prefix with _ to avoid linter warnings
  onTemplateUpdated,
}: TemplateDetailProps) => {
  const [isJsonExpanded, setIsJsonExpanded] = useState(false);
  const [isJsonEditing, setIsJsonEditing] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState<ProjectTemplate | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Update editedTemplate when selectedTemplate changes
  useEffect(() => {
    setEditedTemplate(selectedTemplate);
    setIsJsonEditing(false);
    setSaveError(null);
  }, [selectedTemplate]);

  // No template selected and not creating a new one
  if (!selectedTemplate && !isCreating) {
    return (
      <div className="text-center py-12">
        <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Info className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          Select a template
        </h3>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          Select a template from the list to view its details or create a new
          template.
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

  // Handle JSON edit action
  const handleJsonEdit = (edit: { updated_src: Record<string, unknown> }) => {
    setEditedTemplate(edit.updated_src as unknown as ProjectTemplate);
  };

  // Handle save action for template edited in JSON view
  const handleSaveTemplateJson = async () => {
    if (!editedTemplate || !selectedTemplate?.id) return;

    try {
      setIsSaving(true);
      setSaveError(null);

      const result = await templatesService.updateTemplate(
        selectedTemplate.id,
        editedTemplate
      );

      if (result) {
        // Success - update view state
        setIsJsonEditing(false);
        // Notify parent component that template was updated
        if (onTemplateUpdated) {
          onTemplateUpdated();
        }
      } else {
        setSaveError("Failed to save template. See console for details.");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      setSaveError(
        `Error saving template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Template is selected - show detail view
  if (selectedTemplate) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold">{selectedTemplate.name}</h2>
          <div className="flex space-x-3">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
            >
              <Edit className="w-4 h-4 mr-1.5" />
              Edit
            </button>
          </div>
        </div>

        {/* Main template summary view */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">
              Description
            </h3>
            <p className="text-slate-800">{selectedTemplate.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Version</h3>
            <p className="text-slate-800">{selectedTemplate.version}</p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            Template Structure
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                Tech Stack
              </h4>
              <div className="bg-slate-50 p-3 rounded-md">
                {selectedTemplate.techStack ? (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500">Frontend:</span>{" "}
                      <span className="font-medium">
                        {selectedTemplate.techStack.frontend?.framework ||
                          "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Backend:</span>{" "}
                      <span className="font-medium">
                        {selectedTemplate.techStack.backend?.type ||
                          "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Database:</span>{" "}
                      <span className="font-medium">
                        {selectedTemplate.techStack.database?.type ||
                          "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Authentication:</span>{" "}
                      <span className="font-medium">
                        {selectedTemplate.techStack.authentication?.provider ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-500 text-sm">
                    No tech stack defined
                  </span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                Features
              </h4>
              <div className="bg-slate-50 p-3 rounded-md">
                {selectedTemplate.features?.coreModules &&
                selectedTemplate.features.coreModules.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {selectedTemplate.features.coreModules
                      .slice(0, 5)
                      .map((feature) => (
                        <div
                          key={feature.name}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              feature.enabled ? "bg-green-500" : "bg-slate-300"
                            }`}
                          ></span>
                          <span className="font-medium">{feature.name}</span>
                          <span className="text-slate-500 text-xs">
                            {feature.description}
                          </span>
                        </div>
                      ))}
                    {selectedTemplate.features.coreModules.length > 5 && (
                      <div className="text-xs text-slate-500 italic">
                        + {selectedTemplate.features.coreModules.length - 5}{" "}
                        more features
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-500 text-sm">
                    No features defined
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible JSON Editor section */}
        <div className="mt-8 border-t border-slate-200 pt-4">
          <button
            onClick={() => setIsJsonExpanded(!isJsonExpanded)}
            className="w-full flex items-center justify-between text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors"
          >
            <span className="flex items-center">
              <span className="mr-2">View/Edit JSON Data</span>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                Developer
              </span>
              {isJsonEditing && (
                <span className="ml-2 text-xs bg-yellow-100 px-2 py-0.5 rounded text-yellow-700">
                  Editing
                </span>
              )}
            </span>
            {isJsonExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {isJsonExpanded && (
            <div className="mt-4 animate-slideDown overflow-hidden">
              {/* JSON Editor and controls */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <h4 className="text-sm font-medium text-slate-700">
                    Template JSON
                  </h4>
                  {!isJsonEditing && (
                    <button
                      onClick={() => setIsJsonEditing(true)}
                      className="ml-4 px-3 py-1 text-xs border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 flex items-center"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Edit JSON
                    </button>
                  )}
                </div>

                {isJsonEditing && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setIsJsonEditing(false);
                        setEditedTemplate(selectedTemplate); // Reset to original
                        setSaveError(null);
                      }}
                      className="px-3 py-1.5 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 flex items-center"
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4 mr-1.5" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveTemplateJson}
                      className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="animate-spin h-4 w-4 mr-1.5 border-2 border-white border-t-transparent rounded-full"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1.5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {saveError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {saveError}
                </div>
              )}

              <JsonEditor
                data={
                  editedTemplate ||
                  (selectedTemplate as unknown as Record<string, unknown>)
                }
                onEdit={isJsonEditing ? handleJsonEdit : undefined}
                readOnly={!isJsonEditing}
              />

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-700">
                  {isJsonEditing ? (
                    <strong>Warning:</strong>
                  ) : (
                    <strong>Note:</strong>
                  )}{" "}
                  {isJsonEditing
                    ? "Editing the JSON directly can modify the template structure. Make sure to maintain valid data formats."
                    : "This is a read-only view of the template data. Click Edit JSON to make changes."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default TemplateDetail;
