import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader, Search } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import ProjectCard from "../components/dashboard/ProjectCard";
import { useProjectStore } from "../store/projectStore";

const Projects = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, isLoading } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your software specification projects
            </p>
          </div>

          <button
            onClick={() => navigate("/new-project")}
            className="btn btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" />
            New Project
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="input pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin h-8 w-8 text-primary-600" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              No projects yet
            </h3>
            <p className="mt-2 text-gray-600">
              Create your first project to get started
            </p>
            <button
              onClick={() => navigate("/new-project")}
              className="btn btn-primary mt-4"
            >
              Create Project
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Projects;
