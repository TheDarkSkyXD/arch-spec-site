import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  PlusCircle,
  ArrowRight,
  Calendar,
  LayoutDashboard,
  FileCode,
  ArrowUpRight,
  Package,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useProjectStore } from '../store/projectStore';
import { useTemplates } from '../hooks/useDataQueries';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { Badge } from '../components/ui/badge';

const Dashboard = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, isLoading } = useProjectStore();
  const { data: templates = [], isLoading: templatesLoading, error: queryError } = useTemplates();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleTemplateSelect = (templateId: string) => {
    navigate(`/new-project?template=${templateId}`);
  };

  return (
    <MainLayout>
      <div className="h-full w-full">
        {/* Welcome header */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h1 className="mb-2 font-heading text-2xl font-bold text-slate-800 dark:text-slate-100">
                Architecture Specifications
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Create, manage, and export your software architecture specifications with ease.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => navigate('/new-project')}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <PlusCircle size={18} />
                <span>New Project</span>
              </Button>
              <Button
                onClick={() => navigate('/templates')}
                variant="outline"
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Package size={18} />
                <span>Browse Templates</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Projects</h3>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <FileCode size={16} className="text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">
              {projects.length}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total architecture projects
            </p>
            <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
              <Button
                onClick={() => navigate('/projects')}
                variant="link"
                className="flex h-auto items-center gap-1 p-0 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                View all projects
                <ArrowUpRight size={14} />
              </Button>
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Templates
              </h3>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Package size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            {templatesLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Loading...</span>
              </div>
            ) : queryError ? (
              <div className="text-sm text-red-500 dark:text-red-400">Error loading templates</div>
            ) : (
              <>
                <div className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {templates.length}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Available project templates
                </p>
              </>
            )}
            <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
              <Button
                onClick={() => navigate('/templates')}
                variant="link"
                className="flex h-auto items-center gap-1 p-0 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Browse templates
                <ArrowUpRight size={14} />
              </Button>
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Documentation
              </h3>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <LayoutDashboard size={16} className="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mb-1 text-sm text-slate-500 dark:text-slate-400">
              Learn how to create effective architecture specs
            </div>
            <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
              <Button
                onClick={() => navigate('/docs')}
                variant="link"
                className="flex h-auto items-center gap-1 p-0 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                View documentation
                <ArrowUpRight size={14} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Templates section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Templates</h2>
            <Button
              onClick={() => navigate('/templates')}
              variant="link"
              className="flex h-auto items-center gap-1 p-0 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              View all
              <ArrowRight size={16} />
            </Button>
          </div>

          {templatesLoading ? (
            <Card className="flex items-center justify-center py-12">
              <Spinner size="lg" className="mr-3 text-primary-600 dark:text-primary-400" />
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Loading templates...
              </span>
            </Card>
          ) : queryError ? (
            <Card className="py-8 text-center">
              <p className="mb-2 text-red-600 dark:text-red-400">
                {queryError.message || String(queryError)}
              </p>
              <Button
                onClick={() => navigate('/templates')}
                variant="link"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Browse all templates
              </Button>
            </Card>
          ) : templates.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {templates.slice(0, 3).map((template) => (
                <Card
                  key={template.name}
                  className="overflow-hidden p-0 transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="flex h-32 items-center justify-center bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30">
                    <div className="rounded-lg bg-white p-3 dark:bg-slate-800">
                      <Package size={24} className="text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-semibold text-slate-800 dark:text-slate-100">
                      {template.name}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                      {template.description}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-1">
                      {template.tags &&
                        template.tags.map((tag, index) => (
                          <Badge key={index} variant="default">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                    <Button
                      onClick={() => handleTemplateSelect(template.id || template.version)}
                      className="w-full"
                    >
                      Use This Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="py-8 text-center">
              <p className="mb-2 text-slate-600 dark:text-slate-300">No templates available</p>
              <Button
                onClick={() => navigate('/new-project')}
                variant="link"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Create a project from scratch
              </Button>
            </Card>
          )}
        </div>

        {/* Recent projects section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Recent Projects
            </h2>
            <Button onClick={() => navigate('/new-project')} className="flex items-center gap-1.5">
              <Plus size={16} />
              New Project
            </Button>
          </div>

          <div>
            {isLoading ? (
              <Card className="flex items-center justify-center py-12">
                <Spinner size="lg" className="mr-3 text-primary-600 dark:text-primary-400" />
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Loading projects...
                </span>
              </Card>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 3).map((project) => (
                  <Card
                    key={project.id}
                    className="cursor-pointer overflow-hidden p-4 transition-shadow duration-200 hover:shadow-md"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <h3 className="mb-1 text-lg font-semibold text-slate-800 dark:text-slate-100">
                      {project.name}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      <span>
                        Updated{' '}
                        {project.updated_at
                          ? new Date(project.updated_at).toLocaleDateString()
                          : 'N/A'}
                      </span>
                      <Button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        variant="link"
                        className="flex h-auto items-center gap-1 p-0 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <Calendar size={24} className="text-slate-400 dark:text-slate-300" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
                  No projects yet
                </h3>
                <p className="mx-auto mb-6 max-w-md text-slate-500 dark:text-slate-400">
                  Create your first project to start building your architecture specifications
                </p>
                <Button
                  onClick={() => navigate('/new-project')}
                  className="mx-auto flex items-center gap-2 px-5 py-2"
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
