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
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useTemplates } from "../hooks/useDataQueries";

const Templates = () => {
  const navigate = useNavigate();
  const { data: templates = [], isLoading, error: queryError } = useTemplates();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [error, setError] = useState<string | null>(null);

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

  return (
    <MainLayout>
      <div className="w-full h-full">
        {/* Header section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-heading">
              Templates
            </h1>
            <p className="text-slate-500 mt-1">
              Choose a template to start your architecture project
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-primary-100 text-primary-600"
                  : "bg-white text-slate-400 border border-slate-200 hover:text-slate-600"
              }`}
            >
              <Grid3X3 size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list"
                  ? "bg-primary-100 text-primary-600"
                  : "bg-white text-slate-400 border border-slate-200 hover:text-slate-600"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Search and filters bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full py-2 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <Loader2 size={32} className="text-primary-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Loading templates
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Please wait while we fetch available templates
            </p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Package size={24} className="text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Error loading templates
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">{error}</p>
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
                  className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="h-32 bg-gradient-to-r from-primary-100 to-blue-100 flex items-center justify-center relative">
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium text-amber-600">
                      <Star
                        size={12}
                        className="fill-amber-500 text-amber-500"
                      />
                      <span>4.8</span>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <Package size={24} className="text-primary-600" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-3">
                      {template.description}
                    </p>
                    {/* Development mode debugging info - remove in production */}
                    {import.meta.env.DEV && (
                      <div className="mb-2 text-xs text-slate-400">
                        <p>ID: {template.id || "Not set"}</p>
                        <p>Version: {template.version}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags &&
                        template.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <button
                      onClick={() =>
                        handleTemplateSelect(template.id || template.version)
                      }
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg"
                    >
                      Use This Template
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={template.name}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Package size={20} className="text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {template.name}
                        </h3>
                        <div className="bg-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium text-amber-600 border border-slate-100">
                          <Star
                            size={12}
                            className="fill-amber-500 text-amber-500"
                          />
                          <span>4.8</span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm mb-3">
                        {template.description}
                      </p>
                      {/* Development mode debugging info - remove in production */}
                      {import.meta.env.DEV && (
                        <div className="mb-2 text-xs text-slate-400">
                          <p>ID: {template.id || "Not set"}</p>
                          <p>Version: {template.version}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags &&
                          template.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                      <button
                        onClick={() =>
                          handleTemplateSelect(template.id || template.version)
                        }
                        className="inline-flex px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                      >
                        Use This Template
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : !isLoading && !error ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Package size={24} className="text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {searchQuery
                ? `No templates matching "${searchQuery}"`
                : "No templates available"}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchQuery
                ? "Try using different search terms"
                : "Check back later for new templates"}
            </p>
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default Templates;
