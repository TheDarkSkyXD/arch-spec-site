import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectsService } from "../services/projectsService";
import { ProjectBase } from "../types/project";
import ProjectBasicsForm from "../components/forms/ProjectBasicsForm";
import { ChevronLeft, Loader2 } from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);

      if (!id) {
        setError("Project ID is missing");
        setLoading(false);
        return;
      }

      try {
        const projectData = await projectsService.getProjectById(id);
        if (projectData) {
          setProject(projectData);
        } else {
          setError("Project not found");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleProjectUpdate = (projectId: string) => {
    // Refresh project data after successful update
    projectsService.getProjectById(projectId).then((data) => {
      if (data) {
        setProject(data);
      }
    });
  };

  // Process arrays from the backend's comma-separated strings
  const processProjectData = (project: ProjectBase) => {
    return {
      ...project,
      // Convert arrays to comma-separated strings for the form
      business_goals: Array.isArray(project.business_goals)
        ? project.business_goals.join(", ")
        : "",
      target_users: Array.isArray(project.target_users)
        ? project.target_users.join(", ")
        : "",
      domain: project.domain || "",
    };
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/projects")}
          className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 mr-3"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {loading ? "Loading Project..." : project?.name || "Project Details"}
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <Loader2 className="h-8 w-8 text-primary-600 animate-spin mr-3" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Loading project details...
          </span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
              {error}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              There was a problem loading the project details.
            </p>
            <button
              onClick={() => navigate("/projects")}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm"
            >
              Return to Projects
            </button>
          </div>
        </div>
      ) : project ? (
        <div className="space-y-6">
          {/* Project Basics */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                Project Details
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Update the basic information about your project
              </p>
            </div>
            <div className="p-6">
              <ProjectBasicsForm
                initialData={processProjectData(project)}
                onSuccess={handleProjectUpdate}
              />
            </div>
          </div>

          {/* More project sections can be added here later */}
        </div>
      ) : null}
    </div>
  );
};

export default ProjectDetails;
