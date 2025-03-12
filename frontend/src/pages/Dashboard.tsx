import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Loader,
  PlusCircle,
  ArrowRight,
  Calendar,
  LayoutDashboard,
  FileCode,
  ArrowUpRight,
  Package,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useProjectStore } from "../store/projectStore";
import { useTemplates } from "../hooks/useDataQueries";

const Dashboard = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, isLoading } = useProjectStore();
  const {
    data: templates = [],
    isLoading: templatesLoading,
    error: queryError,
  } = useTemplates();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleTemplateSelect = (templateId: string) => {
    navigate(`/new-project?template=${templateId}`);
  };

  return (
    <MainLayout>
      <div className="w-full h-full">
        {/* Welcome header */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-heading mb-2">
                Architecture Specifications
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Create, manage, and export your software architecture
                specifications with ease.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/new-project")}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
              >
                <PlusCircle size={18} />
                <span>New Project</span>
              </button>
              <button
                onClick={() => navigate("/templates")}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
              >
                <Package size={18} />
                <span>Browse Templates</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Projects
              </h3>
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <FileCode
                  size={16}
                  className="text-primary-600 dark:text-primary-400"
                />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {projects.length}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Total architecture projects
            </p>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => navigate("/projects")}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1"
              >
                View all projects
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Templates
              </h3>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Package
                  size={16}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>
            {templatesLoading ? (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                  Loading...
                </span>
              </div>
            ) : queryError ? (
              <div className="text-red-500 dark:text-red-400 text-sm">
                Error loading templates
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {templates.length}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Available project templates
                </p>
              </>
            )}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => navigate("/templates")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
              >
                Browse templates
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Documentation
              </h3>
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <LayoutDashboard
                  size={16}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
            </div>
            <div className="text-sm mb-1 text-slate-500 dark:text-slate-400">
              Learn how to create effective architecture specs
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => navigate("/docs")}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium flex items-center gap-1"
              >
                View documentation
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Templates section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Templates
            </h2>
            <button
              onClick={() => navigate("/templates")}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm flex items-center gap-1"
            >
              View all
              <ArrowRight size={16} />
            </button>
          </div>

          {templatesLoading ? (
            <div className="flex justify-center items-center py-12 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
              <Loader className="animate-spin h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Loading templates...
              </span>
            </div>
          ) : queryError ? (
            <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
              <p className="text-red-600 dark:text-red-400 mb-2">
                {queryError.message || String(queryError)}
              </p>
              <button
                onClick={() => navigate("/templates")}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Browse all templates
              </button>
            </div>
          ) : templates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.slice(0, 3).map((template) => (
                <div
                  key={template.name}
                  className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="h-32 bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 flex items-center justify-center">
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
                    <button
                      onClick={() =>
                        handleTemplateSelect(template.id || template.version)
                      }
                      className="w-full bg-primary-600 dark:bg-primary-900 hover:bg-primary-700 dark:hover:bg-primary-800 text-white py-2 rounded-lg"
                    >
                      Use This Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                No templates available
              </p>
              <button
                onClick={() => navigate("/new-project")}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                Create a project from scratch
              </button>
            </div>
          )}
        </div>

        {/* Recent projects section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Recent Projects
            </h2>
            <button
              onClick={() => navigate("/new-project")}
              className="bg-primary-600 dark:bg-primary-900 hover:bg-primary-700 dark:hover:bg-primary-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5"
            >
              <Plus size={16} />
              New Project
            </button>
          </div>

          <div>
            {isLoading ? (
              <div className="flex justify-center items-center py-12 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                <Loader className="animate-spin h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Loading projects...
                </span>
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
                        {project.name}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                        {project.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span>
                          Updated{" "}
                          {new Date(project.updated_at).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1"
                        >
                          View
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Calendar
                    size={24}
                    className="text-slate-400 dark:text-slate-300"
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  No projects yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                  Create your first project to start building your architecture
                  specifications
                </p>
                <button
                  onClick={() => navigate("/new-project")}
                  className="px-5 py-2 bg-primary-600 dark:bg-primary-900 hover:bg-primary-700 dark:hover:bg-primary-800 text-white rounded-lg shadow-sm flex items-center gap-2 mx-auto"
                >
                  <PlusCircle size={18} />
                  Create Your First Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
