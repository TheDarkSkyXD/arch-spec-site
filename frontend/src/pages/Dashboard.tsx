import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
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
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import { Badge } from "../components/ui/badge";

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
        <Card className="mb-6">
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
              <Button
                onClick={() => navigate("/new-project")}
                className="flex items-center gap-2"
              >
                <PlusCircle size={18} />
                <span>New Project</span>
              </Button>
              <Button
                onClick={() => navigate("/templates")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Package size={18} />
                <span>Browse Templates</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card>
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
              <Button
                onClick={() => navigate("/projects")}
                variant="link"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-0 h-auto flex items-center gap-1"
              >
                View all projects
                <ArrowUpRight size={14} />
              </Button>
            </div>
          </Card>

          <Card>
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
                <Spinner
                  size="sm"
                  className="text-blue-600 dark:text-blue-400"
                />
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
              <Button
                onClick={() => navigate("/templates")}
                variant="link"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0 h-auto flex items-center gap-1"
              >
                Browse templates
                <ArrowUpRight size={14} />
              </Button>
            </div>
          </Card>

          <Card>
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
              <Button
                onClick={() => navigate("/docs")}
                variant="link"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 p-0 h-auto flex items-center gap-1"
              >
                View documentation
                <ArrowUpRight size={14} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Templates section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Templates
            </h2>
            <Button
              onClick={() => navigate("/templates")}
              variant="link"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-0 h-auto flex items-center gap-1"
            >
              View all
              <ArrowRight size={16} />
            </Button>
          </div>

          {templatesLoading ? (
            <Card className="flex justify-center items-center py-12">
              <Spinner
                size="lg"
                className="text-primary-600 dark:text-primary-400 mr-3"
              />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Loading templates...
              </span>
            </Card>
          ) : queryError ? (
            <Card className="text-center py-8">
              <p className="text-red-600 dark:text-red-400 mb-2">
                {queryError.message || String(queryError)}
              </p>
              <Button
                onClick={() => navigate("/templates")}
                variant="link"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Browse all templates
              </Button>
            </Card>
          ) : templates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.slice(0, 3).map((template) => (
                <Card
                  key={template.name}
                  className="overflow-hidden hover:shadow-md transition-shadow duration-200 p-0"
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
                          <Badge key={index} variant="default">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                    <Button
                      onClick={() =>
                        handleTemplateSelect(template.id || template.version)
                      }
                      className="w-full"
                    >
                      Use This Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                No templates available
              </p>
              <Button
                onClick={() => navigate("/new-project")}
                variant="link"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Create a project from scratch
              </Button>
            </Card>
          )}
        </div>

        {/* Recent projects section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Recent Projects
            </h2>
            <Button
              onClick={() => navigate("/new-project")}
              className="flex items-center gap-1.5"
            >
              <Plus size={16} />
              New Project
            </Button>
          </div>

          <div>
            {isLoading ? (
              <Card className="flex justify-center items-center py-12">
                <Spinner
                  size="lg"
                  className="text-primary-600 dark:text-primary-400 mr-3"
                />
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Loading projects...
                </span>
              </Card>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.slice(0, 3).map((project) => (
                  <Card
                    key={project.id}
                    className="overflow-hidden hover:shadow-md transition-shadow duration-200 p-4"
                  >
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span>
                        Updated{" "}
                        {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'N/A'}
                      </span>
                      <Button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        variant="link"
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-0 h-auto flex items-center gap-1"
                      >
                        View
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-16">
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
                <Button
                  onClick={() => navigate("/new-project")}
                  className="px-5 py-2 flex items-center gap-2 mx-auto"
                >
                  <PlusCircle size={18} />
                  Create Your First Project
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
