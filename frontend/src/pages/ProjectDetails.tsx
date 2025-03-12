import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectsService } from "../services/projectsService";
import { techStackService } from "../services/techStackService";
import { ProjectBase, RequirementsData } from "../types/project";
import ProjectBasicsForm from "../components/forms/ProjectBasicsForm";
import TechStackForm from "../components/forms/TechStackForm";
import RequirementsForm from "../components/forms/RequirementsForm";
import FeaturesForm from "../components/forms/FeaturesForm";
import { ChevronLeft, Loader2 } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { ProjectTechStack } from "../types/templates";
import { useRequirements, useFeatures } from "../hooks/useDataQueries";
import { FeaturesData } from "../services/featuresService";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectBase | null>(null);
  const [techStack, setTechStack] = useState<ProjectTechStack | null>(null);
  const [loading, setLoading] = useState(true);
  const [techStackLoading, setTechStackLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the hooks
  const { data: requirements, isLoading: requirementsLoading } =
    useRequirements(id);

  const { data: features, isLoading: featuresLoading } = useFeatures(id);

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

  // Fetch tech stack data when project ID is available
  useEffect(() => {
    const fetchTechStack = async () => {
      if (!id) return;

      setTechStackLoading(true);
      try {
        const techStackData = await techStackService.getTechStack(id);
        setTechStack(techStackData);
      } catch (err) {
        console.error("Error fetching tech stack:", err);
        // Not setting an error state here as the project should still display
        // even if tech stack data fails to load
      } finally {
        setTechStackLoading(false);
      }
    };

    fetchTechStack();
  }, [id]);

  const handleProjectUpdate = (projectId: string) => {
    // Refresh project data after successful update
    projectsService.getProjectById(projectId).then((data) => {
      if (data) {
        setProject(data);
      }
    });
  };

  const handleTechStackUpdate = (updatedTechStack: ProjectTechStack) => {
    // Update local state with new tech stack data
    setTechStack(updatedTechStack);

    // Refresh project data after successful tech stack update
    if (id) {
      projectsService.getProjectById(id).then((data) => {
        if (data) {
          setProject(data);
        }
      });
    }
  };

  const handleRequirementsUpdate = (_updatedRequirements: RequirementsData) => {
    // Update is handled by refetching from the backend
    // We could implement a more sophisticated state management approach if needed
  };

  const handleFeaturesUpdate = (_updatedFeatures: FeaturesData) => {
    // Update is handled by refetching from the backend
    // We could implement a more sophisticated state management approach if needed
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
    <MainLayout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/projects")}
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 mr-3"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {loading
              ? "Loading Project..."
              : project?.name || "Project Details"}
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

            {/* Tech Stack */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                  Technology Stack
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Configure the technology stack for your project
                </p>
              </div>
              <div className="p-6">
                {techStackLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
                    <span className="text-slate-600 dark:text-slate-300">
                      Loading tech stack data...
                    </span>
                  </div>
                ) : (
                  <TechStackForm
                    initialData={techStack || undefined}
                    projectId={id}
                    onSuccess={handleTechStackUpdate}
                  />
                )}
              </div>
            </div>

            {/* Requirements Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                  Requirements
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Define functional and non-functional requirements for your
                  project
                </p>
              </div>
              <div className="p-6">
                {requirementsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
                    <span className="text-slate-600 dark:text-slate-300">
                      Loading requirements data...
                    </span>
                  </div>
                ) : (
                  <RequirementsForm
                    initialData={requirements || undefined}
                    projectId={id}
                    onSuccess={handleRequirementsUpdate}
                  />
                )}
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
                  Features
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Configure the features and modules for your project
                </p>
              </div>
              <div className="p-6">
                {featuresLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
                    <span className="text-slate-600 dark:text-slate-300">
                      Loading features data...
                    </span>
                  </div>
                ) : (
                  <FeaturesForm
                    initialData={features || undefined}
                    projectId={id}
                    onSuccess={handleFeaturesUpdate}
                  />
                )}
              </div>
            </div>

            {/* More project sections can be added here later */}
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default ProjectDetails;
