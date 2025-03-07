import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Loader,
  Search,
  FolderPlus,
  Filter,
  MoreVertical,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import ProjectCard from "../components/dashboard/ProjectCard";
import { useProjectStore } from "../store/projectStore";

const Projects = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, isLoading } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <MainLayout>
      {/* Main content container */}
      <div className="w-full h-full">
        {/* Header with title and action button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 font-heading">
              Projects
            </h1>
            <p className="text-slate-500 mt-1">
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
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
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

        {/* Projects content */}
        <div className="w-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-16 bg-white rounded-lg shadow-sm border border-slate-200">
              <Loader className="animate-spin h-8 w-8 text-primary-600 mr-3" />
              <span className="text-slate-600 font-medium">
                Loading projects...
              </span>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {project.status === "in_progress" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                        )}
                        {project.status === "completed" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                        )}
                        {project.status === "draft" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5"></span>
                        )}
                        {project.status.replace("_", " ")}
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      {project.name}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    <div className="flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-slate-100">
                      <span>
                        Updated{" "}
                        {new Date(project.updated_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                      >
                        View Project
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FolderPlus size={24} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No projects yet
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
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
