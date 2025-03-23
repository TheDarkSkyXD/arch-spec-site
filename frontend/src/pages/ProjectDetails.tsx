import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectsService } from "../services/projectsService";
import { techStackService } from "../services/techStackService";
import { ProjectBase } from "../types/project";
import { ChevronLeft, Loader2 } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { ProjectTechStack, Requirements, Api } from "../types/templates";
import {
  useRequirements,
  useFeatures,
  usePages,
  useApiEndpoints,
  useDataModel,
  useTestCases,
} from "../hooks/useDataQueries";
import { FeaturesData } from "../services/featuresService";
import { TestCasesData } from "../services/testCasesService";
import { Pages, DataModel } from "../types/templates";
import DownloadAllMarkdown from "../components/common/DownloadAllMarkdown";

// Import shadcn UI components
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { userApi } from "../api/userApi";
import { useSubscription } from "../contexts/SubscriptionContext";
import { implementationPromptsService } from "../services/implementationPromptsService";
import { ImplementationPrompts } from "../types/templates";

// Import custom hook and section components
import { SectionId, useSectionState } from "../hooks/useSectionState";
import ProjectBasicsSection from "../components/project/ProjectBasicsSection";
import TechStackSection from "../components/project/TechStackSection";
import RequirementsSection from "../components/project/RequirementsSection";
import FeaturesSection from "../components/project/FeaturesSection";
import PagesSection from "../components/project/PagesSection";
import DataModelSection from "../components/project/DataModelSection";
import ApiEndpointsSection from "../components/project/ApiEndpointsSection";
import TestCasesSection from "../components/project/TestCasesSection";
import ImplementationPromptsSection from "../components/project/ImplementationPromptsSection";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectBase | null>(null);
  const [techStack, setTechStack] = useState<ProjectTechStack | null>(null);
  const [loading, setLoading] = useState(true);
  const [techStackLoading, setTechStackLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshSubscriptionData } = useSubscription();

  // Use our custom hook for section state
  const {
    expandedSections,
    sectionViewModes,
    toggleSection,
    changeViewMode,
  } = useSectionState();

  // Use the hooks
  const { data: requirements, isLoading: requirementsLoading } =
    useRequirements(id);

  const { data: features, isLoading: featuresLoading } = useFeatures(id);

  const { data: pages, isLoading: pagesLoading } = usePages(id);

  const { data: dataModel, isLoading: dataModelLoading } = useDataModel(id);

  const { data: apiEndpoints, isLoading: apiEndpointsLoading } =
    useApiEndpoints(id);

  const { data: testCases, isLoading: testCasesLoading } = useTestCases(id);

  // Add implementation prompts state
  const [implementationPrompts, setImplementationPrompts] =
    useState<ImplementationPrompts | null>(null);
  const [implementationPromptsLoading, setImplementationPromptsLoading] =
    useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      await userApi.getCurrentUser();
      refreshSubscriptionData();
    };
    loadUserProfile();
  }, [refreshSubscriptionData]);

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

  // Fetch implementation prompts
  useEffect(() => {
    const fetchImplementationPrompts = async () => {
      if (!id) return;

      setImplementationPromptsLoading(true);
      try {
        const data =
          await implementationPromptsService.getImplementationPrompts(id);
        setImplementationPrompts(data);
      } catch (err) {
        console.error("Error fetching implementation prompts:", err);
      } finally {
        setImplementationPromptsLoading(false);
      }
    };

    fetchImplementationPrompts();
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

  const handleRequirementsUpdate = (
    _updatedRequirements: Partial<Requirements>
  ) => {
    // Update is handled by refetching from the backend
    console.log("Requirements updated:", _updatedRequirements);
  };

  const handleFeaturesUpdate = (_updatedFeatures: FeaturesData) => {
    // Update is handled by refetching from the backend
    console.log("Features updated:", _updatedFeatures);
  };

  const handlePagesUpdate = (_updatedPages: Pages) => {
    // Update is handled by refetching from the backend
    console.log("Pages updated:", _updatedPages);
  };

  const handleDataModelUpdate = (_updatedDataModel: Partial<DataModel>) => {
    // Update is handled by refetching from the backend
    console.log("Data Model updated:", _updatedDataModel);
  };

  const handleApiEndpointsUpdate = (_updatedApiEndpoints: Api) => {
    // Update is handled by refetching from the backend
    console.log("API Endpoints updated:", _updatedApiEndpoints);
  };

  const handleTestCasesUpdate = (_updatedTestCases: TestCasesData) => {
    // Update is handled by refetching from the backend
    console.log("Test Cases updated:", _updatedTestCases);
  };

  const handleImplementationPromptsUpdate = (
    updatedPrompts: Partial<ImplementationPrompts>
  ) => {
    // Update local state immediately so the preview shows the latest changes
    setImplementationPrompts(updatedPrompts as ImplementationPrompts);
    console.log("Implementation Prompts updated:", updatedPrompts);
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            onClick={() => navigate("/projects")}
            variant="ghost"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 mr-3"
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {loading
              ? "Loading Project..."
              : project?.name || "Project Details"}
          </h1>
          {project && !loading && (
            <div className="ml-auto">
              <DownloadAllMarkdown
                project={project}
                techStack={techStack}
                requirements={requirements as Requirements | null}
                features={features || null}
                pages={pages || null}
                dataModel={dataModel || null}
                apiEndpoints={apiEndpoints || null}
                testCases={testCases || null}
              />
            </div>
          )}
        </div>

        {loading ? (
          <Card className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 text-primary-600 animate-spin mr-3" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Loading project details...
            </span>
          </Card>
        ) : error ? (
          <Card className="flex justify-center items-center py-16">
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
              <Button
                onClick={() => navigate("/projects")}
                className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm"
              >
                Return to Projects
              </Button>
            </div>
          </Card>
        ) : project ? (
          <div className="space-y-6">
            {/* Project Basics Section */}
            <ProjectBasicsSection
              project={project}
              sectionId={SectionId.BASICS}
              isExpanded={expandedSections[SectionId.BASICS]}
              viewMode={sectionViewModes[SectionId.BASICS]}
              isLoading={loading}
              onToggle={toggleSection}
              onViewModeChange={changeViewMode}
              onSuccess={handleProjectUpdate}
            />

            {/* Tech Stack Section */}
            <TechStackSection
              techStack={techStack}
              projectId={id}
              projectName={project.name}
              sectionId={SectionId.TECH_STACK}
              isExpanded={expandedSections[SectionId.TECH_STACK]}
              viewMode={sectionViewModes[SectionId.TECH_STACK]}
              isLoading={techStackLoading}
              onToggle={toggleSection}
              onViewModeChange={changeViewMode}
              onSuccess={handleTechStackUpdate}
            />

            {/* Requirements Section */}
            <RequirementsSection
              requirements={requirements}
              projectId={id}
              projectName={project.name}
              sectionId={SectionId.REQUIREMENTS}
              isExpanded={expandedSections[SectionId.REQUIREMENTS]}
              viewMode={sectionViewModes[SectionId.REQUIREMENTS]}
              isLoading={requirementsLoading}
              onToggle={toggleSection}
              onViewModeChange={changeViewMode}
              onSuccess={handleRequirementsUpdate}
            />

            {/* Features Section */}
            <FeaturesSection
              features={features}
              projectId={id}
              projectName={project.name}
              sectionId={SectionId.FEATURES}
              isExpanded={expandedSections[SectionId.FEATURES]}
              viewMode={sectionViewModes[SectionId.FEATURES]}
              isLoading={featuresLoading}
              onToggle={toggleSection}
              onViewModeChange={changeViewMode}
              onSuccess={handleFeaturesUpdate}
            />

            {/* Pages Section */}
            <PagesSection
              pages={pages}
              projectId={id}
              projectName={project.name}
              sectionId={SectionId.PAGES}
              isExpanded={expandedSections[SectionId.PAGES]}
              viewMode={sectionViewModes[SectionId.PAGES]}
              isLoading={pagesLoading}
              onToggle={toggleSection}
              onViewModeChange={changeViewMode}
              onSuccess={handlePagesUpdate}
            />

            {/* Data Model Section */}
            <DataModelSection
              dataModel={dataModel}
              projectId={id}
              projectName={project.name}
              sectionId={SectionId.DATA_MODEL}
              isExpanded={expandedSections[SectionId.DATA_MODEL]}
              viewMode={sectionViewModes[SectionId.DATA_MODEL]}
              isLoading={dataModelLoading}
              onToggle={toggleSection}
              onViewModeChange={changeViewMode}
              onSuccess={handleDataModelUpdate}
            />

            {/* API Endpoints Section */}
            <ApiEndpointsSection
              apiEndpoints={apiEndpoints}
              projectId={id}
              projectName={project.name}
              sectionId={SectionId.API_ENDPOINTS}
              isExpanded={expandedSections[SectionId.API_ENDPOINTS]}
              viewMode={sectionViewModes[SectionId.API_ENDPOINTS]}
              isLoading={apiEndpointsLoading}
              onToggle={toggleSection}
              onViewModeChange={changeViewMode}
              onSuccess={handleApiEndpointsUpdate}
            />

            {/* Test Cases Section */}
            <TestCasesSection
              testCases={testCases}
              projectId={id}
              projectName={project.name}
              sectionId={SectionId.TEST_CASES}
              isExpanded={expandedSections[SectionId.TEST_CASES]}
              viewMode={sectionViewModes[SectionId.TEST_CASES]}
              isLoading={testCasesLoading}
              onToggle={toggleSection}
              onViewModeChange={changeViewMode}
              onSuccess={handleTestCasesUpdate}
            />

            {/* Implementation Prompts Section */}
            <ImplementationPromptsSection
              implementationPrompts={implementationPrompts}
              projectId={id}
              projectName={project.name}
              sectionId={SectionId.IMPLEMENTATION_PROMPTS}
              isExpanded={expandedSections[SectionId.IMPLEMENTATION_PROMPTS]}
              viewMode={sectionViewModes[SectionId.IMPLEMENTATION_PROMPTS]}
              isLoading={implementationPromptsLoading}
              onToggle={toggleSection}
              onViewModeChange={changeViewMode}
              onSuccess={handleImplementationPromptsUpdate}
            />
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default ProjectDetails;
