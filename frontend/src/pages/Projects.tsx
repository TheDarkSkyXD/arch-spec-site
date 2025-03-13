import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Loader,
  Search,
  FolderPlus,
  Filter,
  AlertCircle,
  Trash2,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useProjectStore } from "../store/projectStore";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "../components/ui/alert-dialog";

const Projects = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, deleteProject, isLoading, error } =
    useProjectStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProjects(
        projects.filter(
          (project) =>
            project.name.toLowerCase().includes(query) ||
            project.description.toLowerCase().includes(query) ||
            project.domain?.toLowerCase().includes(query) ||
            project.business_goals?.some((goal: string) =>
              goal.toLowerCase().includes(query)
            ) ||
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

  return (
    <MainLayout>
      {/* Main content container */}
      <div className="w-full h-full">
        {/* Header with title and action button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-heading">
              Projects
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage your software architecture specification projects
            </p>
          </div>
          <button
            onClick={() => navigate("/new-project")}
            className="btn bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm"
          >
            <Plus size={18} />
            <span>New Project</span>
          </button>
        </div>

        {/* Search and filters bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full py-2 pl-10 pr-4 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600">
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
                This will permanently delete the project and all its associated
                data including requirements, specifications, and diagrams. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Projects content */}
        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <Loader className="animate-spin h-8 w-8 text-primary-600 mr-3" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Loading projects...
              </span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Error loading projects. Please try again.
              </span>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                      {project.description}
                    </p>

                    {/* Project metadata */}
                    <div className="space-y-2 mb-4">
                      {project.domain && (
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-medium mr-2">Domain:</span>
                          {project.domain}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <span>
                        Updated{" "}
                        {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'N/A'}
                      </span>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openDeleteDialog(project.id)}
                          className="text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                        >
                          View Project
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <FolderPlus
                  size={24}
                  className="text-slate-400 dark:text-slate-500"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                No projects yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                Create your first project to get started building your
                architecture specifications
              </p>
              <button
                onClick={() => navigate("/new-project")}
                className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm flex items-center gap-2 mx-auto"
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
