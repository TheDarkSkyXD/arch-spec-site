import { useState, useEffect } from "react";
import { Plus, Edit, Info, Loader } from "lucide-react";
import { templatesService } from "../../services/templatesService";
import { ProjectTemplate } from "../../types";

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

  const handleEditTemplate = () => {
    setIsEditing(true);
    setIsCreating(false);
  };

  const renderTemplateList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 text-primary-500 animate-spin mr-2" />
          <span>Loading templates...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <button
            onClick={fetchTemplates}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      );
    }

    if (templates.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-slate-500 mb-4">No templates available</p>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center justify-center mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Template
          </button>
        </div>
      );
    }

    return (
      <div className="divide-y divide-slate-200">
        {templates.map((template) => (
          <div
            key={template.id || template.name}
            className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
              selectedTemplate?.id === template.id ? "bg-slate-50" : ""
            }`}
            onClick={() => handleSelectTemplate(template)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-slate-800">{template.name}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {template.description}
                </p>
                <div className="mt-2 text-xs text-slate-400">
                  Version: {template.version}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(template);
                    handleEditTemplate();
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

  const renderTemplateDetail = () => {
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
            onClick={handleCreateNew}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center justify-center mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Template
          </button>
        </div>
      );
    }

    if (isCreating) {
      return (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-6">Create New Template</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <p className="text-sm text-blue-700">
              Template management feature is coming soon. This UI demonstrates
              how it will work.
            </p>
          </div>
          {/* Template form would go here */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Template Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="My Template"
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
              />
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                onClick={() => {
                  alert("This feature is coming soon!");
                  setIsCreating(false);
                }}
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (isEditing && selectedTemplate) {
      return (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-6">Edit Template</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <p className="text-sm text-blue-700">
              Template editing feature is coming soon. This UI demonstrates how
              it will work.
            </p>
          </div>
          {/* Template edit form would go here */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Template Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedTemplate.name}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Version
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedTemplate.version}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedTemplate.description}
                rows={3}
                readOnly
              />
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                onClick={() => {
                  alert("This feature is coming soon!");
                  setIsEditing(false);
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      );
    }

    // View template details
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold">{selectedTemplate?.name}</h2>
          <div className="space-x-2">
            <button
              onClick={handleEditTemplate}
              className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
            >
              <Edit className="w-4 h-4 mr-1.5" />
              Edit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">
              Description
            </h3>
            <p className="text-slate-800">{selectedTemplate?.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Version</h3>
            <p className="text-slate-800">{selectedTemplate?.version}</p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            Template Structure
          </h3>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <p className="text-sm text-blue-700">
              In the future, this section will allow editing the full template
              structure, including tech stack, features, pages, and more.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                Tech Stack
              </h4>
              <div className="bg-slate-50 p-3 rounded-md">
                {selectedTemplate?.techStack ? (
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
                {selectedTemplate?.features?.coreModules &&
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
      </div>
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
          {renderTemplateList()}
        </div>
      </div>
      <div className="lg:col-span-2">{renderTemplateDetail()}</div>
    </div>
  );
};

export default TemplateManagement;
