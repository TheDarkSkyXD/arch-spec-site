import { Edit, Info, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { ProjectTemplate } from "../../../types";
import { useState, useEffect } from "react";
import JsonEditor from "../../common/JsonEditor";

interface TemplateDetailProps {
  selectedTemplate: ProjectTemplate | null;
  isCreating: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onCreateNew: () => void;
  onCancel: () => void;
}

const TemplateDetail = ({
  selectedTemplate,
  isCreating,
  isEditing: _isEditing, // Prefix with _ to avoid linter warnings
  onEdit,
  onCreateNew,
  onCancel: _onCancel, // Prefix with _ to avoid linter warnings
}: TemplateDetailProps) => {
  const [isJsonExpanded, setIsJsonExpanded] = useState(false);

  // Remove unused state variables - note these are referenced in the linter warnings
  // const [temporaryTemplate, setTemporaryTemplate] = useState<ProjectTemplate | null>(selectedTemplate);

  // useEffect(() => {
  //   setTemporaryTemplate(selectedTemplate);
  // }, [selectedTemplate]);

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
              <span className="mr-2">View JSON Data</span>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                Developer
              </span>
            </span>
            {isJsonExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {isJsonExpanded && (
            <div className="mt-4 animate-slideDown overflow-hidden">
              <JsonEditor
                data={selectedTemplate as unknown as Record<string, unknown>}
                readOnly={true}
              />
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> This is a read-only view of the
                  template data. To make changes, click the Edit button above.
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
