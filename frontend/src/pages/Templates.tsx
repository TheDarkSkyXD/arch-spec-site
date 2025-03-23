import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Package,
  Grid3X3,
  List,
  Star,
  Loader2,
  Eye,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useTemplates } from "../hooks/useDataQueries";
import TemplateDetails from "../components/templates/TemplateDetails";
import { ProjectTemplate } from "../types/templates";

const Templates = () => {
  const navigate = useNavigate();
  const { data: templates = [], isLoading, error: queryError } = useTemplates();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ProjectTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set error if query fails
  if (queryError && !error) {
    console.error("Failed to fetch templates:", queryError);
    setError("Failed to load templates. Please try again later.");
  }

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.tags &&
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  const handleTemplateSelect = (templateId: string) => {
    navigate(`/new-project?template=${templateId}`);
  };

  const handleViewDetails = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <MainLayout>
      <div className="w-full h-full">
        {/* Header section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-heading">
              Templates
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Choose a template to start your architecture project
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <Grid3X3 size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list"
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Search and filters bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full py-2 pl-10 pr-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <Loader2
                size={32}
                className="text-primary-600 dark:text-primary-400 animate-spin"
              />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Loading templates
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Please wait while we fetch available templates
            </p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <Package size={24} className="text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Error loading templates
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {error}
            </p>
          </div>
        )}

        {/* Templates grid */}
        {!isLoading && !error && filteredTemplates.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                : "space-y-4"
            }
          >
            {filteredTemplates.map((template) =>
              viewMode === "grid" ? (
                <div
                  key={template.name}
                  className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="h-32 bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 flex items-center justify-center relative">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                      <Package
                        size={24}
                        className="text-primary-600 dark:text-primary-400"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                      {template.description}
                    </p>
                    {/* Development mode debugging info - remove in production */}
                    {import.meta.env.DEV && (
                      <div className="mb-2 text-xs text-slate-400 dark:text-slate-500">
                        <p>ID: {template.id || "Not set"}</p>
                        <p>Version: {template.version}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags &&
                        template.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleTemplateSelect(template.id || template.version)
                        }
                        className="flex-1 bg-primary-600 dark:bg-primary-900 hover:bg-primary-700 dark:hover:bg-primary-800 text-white py-2 rounded-lg"
                      >
                        Use This Template
                      </button>
                      <button
                        onClick={() => handleViewDetails(template)}
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                        aria-label="View details"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={template.name}
                  className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow duration-200 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <Package
                        size={20}
                        className="text-primary-600 dark:text-primary-400"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                          {template.name}
                        </h3>
                        <div className="bg-white dark:bg-slate-800 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 border border-slate-100 dark:border-slate-700">
                          <Star
                            size={12}
                            className="fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400"
                          />
                          <span>4.8</span>
                        </div>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                        {template.description}
                      </p>
                      {/* Development mode debugging info - remove in production */}
                      {import.meta.env.DEV && (
                        <div className="mb-2 text-xs text-slate-400 dark:text-slate-500">
                          <p>ID: {template.id || "Not set"}</p>
                          <p>Version: {template.version}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags &&
                          template.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleTemplateSelect(
                              template.id || template.version
                            )
                          }
                          className="inline-flex px-4 py-2 bg-primary-600 dark:bg-primary-900 hover:bg-primary-700 dark:hover:bg-primary-800 text-white rounded-lg"
                        >
                          Use This Template
                        </button>
                        <button
                          onClick={() => handleViewDetails(template)}
                          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                          aria-label="View details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : !isLoading && !error ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Package
                size={24}
                className="text-slate-500 dark:text-slate-400"
              />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
              {searchQuery
                ? `No templates matching "${searchQuery}"`
                : "No templates available"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {searchQuery
                ? "Try using different search terms"
                : "Check back later for new templates"}
            </p>
          </div>
        ) : null}

        {/* Template Details Modal */}
        {isModalOpen && selectedTemplate && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={closeModal}
            ></div>
            <div className="relative min-h-screen flex items-center justify-center">
              <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4 scrollbar-custom">
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
                <div className="sticky top-0 bg-white dark:bg-slate-900 z-10 flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                    Template Details
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
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
                  <TemplateDetails template={selectedTemplate} />
                </div>
                <div className="sticky bottom-0 bg-white dark:bg-slate-900 z-10 border-t border-slate-200 dark:border-slate-700 p-4 flex justify-end">
                  <button
                    onClick={() => {
                      closeModal();
                      handleTemplateSelect(
                        selectedTemplate.id || selectedTemplate.version
                      );
                    }}
                    className="px-4 py-2 bg-primary-600 dark:bg-primary-900 hover:bg-primary-700 dark:hover:bg-primary-800 text-white rounded-lg"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Templates;
