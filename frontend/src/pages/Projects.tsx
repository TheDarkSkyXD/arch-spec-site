import { useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Loader,
  Search,
  FolderPlus,
  Filter,
  AlertCircle,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useProjectStore } from '../store/projectStore';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '../components/ui/alert-dialog';

const Projects = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, deleteProject, isLoading, error } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProjects(projects);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProjects(
        projects.filter(
          (project) =>
            project.name.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query) ||
            project.domain?.toLowerCase().includes(query) ||
            project.business_goals?.some((goal: string) => goal.toLowerCase().includes(query)) ||
            project.target_users?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, projects]);

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete);
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const openDeleteDialog = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  const handleCardClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const toggleMenu = (e: MouseEvent<HTMLButtonElement>, projectId: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === projectId ? null : projectId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <MainLayout>
      {/* Main content container */}
      <div className="h-full w-full">
        {/* Header with title and action button */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-800 dark:text-slate-100">
              Projects
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Manage your software architecture specification projects
            </p>
          </div>
          <button
            onClick={() => navigate('/new-project')}
            className="btn flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white shadow-sm hover:bg-primary-700"
          >
            <Plus size={18} />
            <span>New Project</span>
          </button>
        </div>

        {/* Search and filters bar */}
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Delete confirmation dialog */}
        <AlertDialog>
          <AlertDialogContent
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the project and all its associated data including
                requirements, specifications, and diagrams. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Projects content */}
        <div className="w-full">
          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-16 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <Loader className="mr-3 h-8 w-8 animate-spin text-primary-600" />
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Loading projects...
              </span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-white py-16 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <AlertCircle className="mr-3 h-8 w-8 text-red-600" />
              <span className="font-medium text-slate-600 dark:text-slate-300">
                Error loading projects. Please try again.
              </span>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                  onClick={() => handleCardClick(project.id)}
                >
                  <div className="relative p-4">
                    <div className="absolute right-4 top-4 z-10">
                      <div className="relative">
                        <button
                          className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={(e) => toggleMenu(e, project.id)}
                        >
                          <MoreVertical size={18} className="text-slate-500 dark:text-slate-400" />
                        </button>

                        {openMenuId === project.id && (
                          <div className="absolute right-0 z-20 mt-1 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                            <button
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteDialog(project.id);
                                setOpenMenuId(null);
                              }}
                            >
                              <Trash2 size={14} />
                              Delete Project
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="mb-1 pr-8 text-lg font-semibold text-slate-800 dark:text-slate-100">
                      {project.name}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                      {project.description}
                    </p>

                    {/* Project metadata */}
                    <div className="mb-4 space-y-2">
                      {project.domain && (
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <span className="mr-2 font-medium">Domain:</span>
                          {project.domain}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      <span>
                        Updated{' '}
                        {project.updated_at
                          ? new Date(project.updated_at).toLocaleDateString()
                          : 'N/A'}
                      </span>
                      <span className="font-medium text-primary-600 group-hover:text-primary-700">
                        View Project
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                <FolderPlus size={24} className="text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
                No projects yet
              </h3>
              <p className="mx-auto mb-6 max-w-md text-slate-500 dark:text-slate-400">
                Create your first project to get started building your architecture specifications
              </p>
              <button
                onClick={() => navigate('/new-project')}
                className="mx-auto flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-white shadow-sm hover:bg-primary-700"
              >
                <Plus size={18} />
                Create Project
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Projects;
