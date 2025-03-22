import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectsService } from "../services/projectsService";
import { techStackService } from "../services/techStackService";
import { ProjectBase } from "../types/project";
import ProjectBasicsForm from "../components/forms/ProjectBasicsForm";
import TechStackForm from "../components/forms/TechStackForm";
import RequirementsForm from "../components/forms/RequirementsForm";
import FeaturesForm from "../components/forms/FeaturesForm";
import PagesForm from "../components/forms/PagesForm";
import ApiEndpointsForm from "../components/forms/ApiEndpointsForm";
import DataModelForm from "../components/forms/DataModelForm";
import TestCasesForm from "../components/forms/TestCasesForm";
import { ChevronLeft, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { Api, ProjectTechStack, Requirements } from "../types/templates";
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
import { Pages } from "../types/templates";
import { DataModel } from "../types/templates";
import ProjectBasicsPreview from "../components/previews/ProjectBasicsPreview";
import TechStackPreview from "../components/previews/TechStackPreview";
import RequirementsPreview from "../components/previews/RequirementsPreview";
import FeaturesPreview from "../components/previews/FeaturesPreview";
import PagesPreview from "../components/previews/PagesPreview";
import DataModelPreview from "../components/previews/DataModelPreview";
import ApiEndpointsPreview from "../components/previews/ApiEndpointsPreview";
import TestCasesPreview from "../components/previews/TestCasesPreview";
import MarkdownActions from "../components/common/MarkdownActions";
import DownloadAllMarkdown from "../components/common/DownloadAllMarkdown";
import { markdownService } from "../services/markdown";

// Import shadcn UI components
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { userApi } from "../api/userApi";
import { useSubscription } from "../contexts/SubscriptionContext";
import ImplementationPromptsForm from "../components/forms/ImplementationPromptsForm";
import ImplementationPromptsPreview from "../components/previews/ImplementationPromptsPreview";
import { implementationPromptsService } from "../services/implementationPromptsService";
import { ImplementationPrompts } from "../types/templates";

// Define section IDs for consistency
enum SectionId {
  BASICS = "basics",
  TECH_STACK = "techStack",
  REQUIREMENTS = "requirements",
  FEATURES = "features",
  PAGES = "pages",
  DATA_MODEL = "dataModel",
  API_ENDPOINTS = "apiEndpoints",
  TEST_CASES = "testCases",
  IMPLEMENTATION_PROMPTS = "implementationPrompts",
}

// Define view modes
enum ViewMode {
  EDIT = "edit",
  PREVIEW = "preview",
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectBase | null>(null);
  const [techStack, setTechStack] = useState<ProjectTechStack | null>(null);
  const [loading, setLoading] = useState(true);
  const [techStackLoading, setTechStackLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshSubscriptionData } = useSubscription();

  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState<
    Record<SectionId, boolean>
  >({
    [SectionId.BASICS]: true,
    [SectionId.TECH_STACK]: false,
    [SectionId.REQUIREMENTS]: false,
    [SectionId.FEATURES]: false,
    [SectionId.PAGES]: false,
    [SectionId.DATA_MODEL]: false,
    [SectionId.API_ENDPOINTS]: false,
    [SectionId.TEST_CASES]: false,
    [SectionId.IMPLEMENTATION_PROMPTS]: false,
  });

  // State to track view mode (edit or preview) for each section
  const [sectionViewModes, setSectionViewModes] = useState<
    Record<SectionId, ViewMode>
  >({
    [SectionId.BASICS]: ViewMode.EDIT,
    [SectionId.TECH_STACK]: ViewMode.EDIT,
    [SectionId.REQUIREMENTS]: ViewMode.EDIT,
    [SectionId.FEATURES]: ViewMode.EDIT,
    [SectionId.PAGES]: ViewMode.EDIT,
    [SectionId.DATA_MODEL]: ViewMode.EDIT,
    [SectionId.API_ENDPOINTS]: ViewMode.EDIT,
    [SectionId.TEST_CASES]: ViewMode.EDIT,
    [SectionId.IMPLEMENTATION_PROMPTS]: ViewMode.EDIT,
  });

  // Function to toggle section expansion
  const toggleSection = (sectionId: SectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Function to change view mode
  const changeViewMode = (sectionId: SectionId, viewMode: ViewMode) => {
    setSectionViewModes((prev) => ({
      ...prev,
      [sectionId]: viewMode,
    }));
  };

  // Use the hooks
  const { data: requirements, isLoading: requirementsLoading } =
    useRequirements(id);

  const { data: features, isLoading: featuresLoading } = useFeatures(id);

  const { data: pages, isLoading: pagesLoading } = usePages(id);

  const { data: dataModel, isLoading: dataModelLoading } = useDataModel(id);

  const { data: apiEndpoints, isLoading: apiEndpointsLoading } =
    useApiEndpoints(id);

  const { data: testCases, isLoading: testCasesLoading } = useTestCases(id);

  // const { data: implementationPrompts, isLoading: implementationPromptsLoading } = useImplementationPrompts(id);

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
    // We could implement a more sophisticated state management approach if needed
    console.log("Requirements updated:", _updatedRequirements);
  };

  const handleFeaturesUpdate = (_updatedFeatures: FeaturesData) => {
    // Update is handled by refetching from the backend
    // We could implement a more sophisticated state management approach if needed
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

  const handleApiEndpointsUpdate = (updatedApiEndpoints: Api) => {
    // Update is handled by refetching from the backend
    console.log("API Endpoints updated:", updatedApiEndpoints);
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

  // Process arrays from the backend's comma-separated strings
  const processProjectData = (project: ProjectBase) => {
    return {
      ...project,
      // Convert arrays to comma-separated strings for the form
      business_goals: project.business_goals || [],
      target_users: project.target_users || "",
      domain: project.domain || "",
    };
  };

  // Reusable section header component
  const SectionHeader = ({
    title,
    description,
    sectionId,
    isExpanded,
  }: {
    title: string;
    description: string;
    sectionId: SectionId;
    isExpanded: boolean;
  }) => (
    <div
      className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center cursor-pointer"
      onClick={() => toggleSection(sectionId)}
    >
      <div>
        <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
          {title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <div className="text-slate-400 dark:text-slate-500">
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
    </div>
  );

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
            {/* Project Basics */}
            <Card className="overflow-hidden">
              <SectionHeader
                title="Project Details"
                description="Update the basic information about your project"
                sectionId={SectionId.BASICS}
                isExpanded={expandedSections[SectionId.BASICS]}
              />
              {expandedSections[SectionId.BASICS] && (
                <div className="p-6">
                  <Tabs
                    value={sectionViewModes[SectionId.BASICS]}
                    onValueChange={(value) =>
                      changeViewMode(SectionId.BASICS, value as ViewMode)
                    }
                    className="w-full"
                  >
                    <TabsList className="mb-4">
                      <TabsTrigger value={ViewMode.EDIT}>Edit</TabsTrigger>
                      <TabsTrigger value={ViewMode.PREVIEW}>
                        Preview
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value={ViewMode.EDIT}>
                      {project && (
                        <div className="flex justify-end mb-4">
                          <MarkdownActions
                            markdown={markdownService.generateProjectBasicsMarkdown(
                              project
                            )}
                            fileName={markdownService.generateFileName(
                              project.name,
                              "basics"
                            )}
                          />
                        </div>
                      )}
                      <ProjectBasicsForm
                        initialData={processProjectData(project)}
                        onSuccess={handleProjectUpdate}
                      />
                    </TabsContent>

                    <TabsContent
                      value={ViewMode.PREVIEW}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                    >
                      <ProjectBasicsPreview
                        data={project}
                        isLoading={loading}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </Card>

            {/* Requirements Section */}
            <Card className="overflow-hidden">
              <SectionHeader
                title="Requirements"
                description="Define functional and non-functional requirements for your project"
                sectionId={SectionId.REQUIREMENTS}
                isExpanded={expandedSections[SectionId.REQUIREMENTS]}
              />
              {expandedSections[SectionId.REQUIREMENTS] && (
                <div className="p-6">
                  {requirementsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
                      <span className="text-slate-600 dark:text-slate-300">
                        Loading requirements data...
                      </span>
                    </div>
                  ) : (
                    <Tabs
                      value={sectionViewModes[SectionId.REQUIREMENTS]}
                      onValueChange={(value) =>
                        changeViewMode(
                          SectionId.REQUIREMENTS,
                          value as ViewMode
                        )
                      }
                      className="w-full"
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger value={ViewMode.EDIT}>Edit</TabsTrigger>
                        <TabsTrigger value={ViewMode.PREVIEW}>
                          Preview
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value={ViewMode.EDIT}>
                        {requirements && (
                          <div className="flex justify-end mb-4">
                            <MarkdownActions
                              markdown={markdownService.generateRequirementsMarkdown(
                                requirements
                              )}
                              fileName={markdownService.generateFileName(
                                project.name,
                                "requirements"
                              )}
                            />
                          </div>
                        )}
                        <RequirementsForm
                          initialData={requirements || undefined}
                          projectId={id}
                          onSuccess={handleRequirementsUpdate}
                        />
                      </TabsContent>

                      <TabsContent
                        value={ViewMode.PREVIEW}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <RequirementsPreview
                          data={requirements}
                          projectName={project.name}
                          isLoading={requirementsLoading}
                        />
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              )}
            </Card>

            {/* Features Section */}
            <Card className="overflow-hidden">
              <SectionHeader
                title="Features"
                description="Configure the features and modules for your project"
                sectionId={SectionId.FEATURES}
                isExpanded={expandedSections[SectionId.FEATURES]}
              />
              {expandedSections[SectionId.FEATURES] && (
                <div className="p-6">
                  {featuresLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
                      <span className="text-slate-600 dark:text-slate-300">
                        Loading features data...
                      </span>
                    </div>
                  ) : (
                    <Tabs
                      value={sectionViewModes[SectionId.FEATURES]}
                      onValueChange={(value) =>
                        changeViewMode(SectionId.FEATURES, value as ViewMode)
                      }
                      className="w-full"
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger value={ViewMode.EDIT}>Edit</TabsTrigger>
                        <TabsTrigger value={ViewMode.PREVIEW}>
                          Preview
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value={ViewMode.EDIT}>
                        {features && (
                          <div className="flex justify-end mb-4">
                            <MarkdownActions
                              markdown={markdownService.generateFeaturesMarkdown(
                                features
                              )}
                              fileName={markdownService.generateFileName(
                                project.name,
                                "features"
                              )}
                            />
                          </div>
                        )}
                        <FeaturesForm
                          initialData={features || undefined}
                          projectId={id}
                          onSuccess={handleFeaturesUpdate}
                        />
                      </TabsContent>

                      <TabsContent
                        value={ViewMode.PREVIEW}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <FeaturesPreview
                          data={features}
                          projectName={project.name}
                          isLoading={featuresLoading}
                        />
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              )}
            </Card>

            {/* Tech Stack */}
            <Card className="overflow-hidden">
              <SectionHeader
                title="Technology Stack"
                description="Configure the technology stack for your project"
                sectionId={SectionId.TECH_STACK}
                isExpanded={expandedSections[SectionId.TECH_STACK]}
              />
              {expandedSections[SectionId.TECH_STACK] && (
                <div className="p-6">
                  {techStackLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
                      <span className="text-slate-600 dark:text-slate-300">
                        Loading tech stack data...
                      </span>
                    </div>
                  ) : (
                    <Tabs
                      value={sectionViewModes[SectionId.TECH_STACK]}
                      onValueChange={(value) =>
                        changeViewMode(SectionId.TECH_STACK, value as ViewMode)
                      }
                      className="w-full"
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger value={ViewMode.EDIT}>Edit</TabsTrigger>
                        <TabsTrigger value={ViewMode.PREVIEW}>
                          Preview
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value={ViewMode.EDIT}>
                        {techStack && (
                          <div className="flex justify-end mb-4">
                            <MarkdownActions
                              markdown={markdownService.generateTechStackMarkdown(
                                techStack
                              )}
                              fileName={markdownService.generateFileName(
                                project.name,
                                "tech-stack"
                              )}
                            />
                          </div>
                        )}
                        <TechStackForm
                          initialData={techStack || undefined}
                          projectId={id}
                          onSuccess={handleTechStackUpdate}
                        />
                      </TabsContent>

                      <TabsContent
                        value={ViewMode.PREVIEW}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <TechStackPreview
                          data={techStack}
                          projectName={project.name}
                          isLoading={techStackLoading}
                        />
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              )}
            </Card>

            {/* Pages Section */}
            <Card className="overflow-hidden">
              <SectionHeader
                title="Pages"
                description="Configure the pages for your application"
                sectionId={SectionId.PAGES}
                isExpanded={expandedSections[SectionId.PAGES]}
              />
              {expandedSections[SectionId.PAGES] && (
                <div className="p-6">
                  {pagesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
                      <span className="text-slate-600 dark:text-slate-300">
                        Loading pages data...
                      </span>
                    </div>
                  ) : (
                    <Tabs
                      value={sectionViewModes[SectionId.PAGES]}
                      onValueChange={(value) =>
                        changeViewMode(SectionId.PAGES, value as ViewMode)
                      }
                      className="w-full"
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger value={ViewMode.EDIT}>Edit</TabsTrigger>
                        <TabsTrigger value={ViewMode.PREVIEW}>
                          Preview
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value={ViewMode.EDIT}>
                        {pages && (
                          <div className="flex justify-end mb-4">
                            <MarkdownActions
                              markdown={markdownService.generatePagesMarkdown(
                                pages
                              )}
                              fileName={markdownService.generateFileName(
                                project.name,
                                "pages"
                              )}
                            />
                          </div>
                        )}
                        <PagesForm
                          initialData={pages || undefined}
                          projectId={id}
                          onSuccess={handlePagesUpdate}
                        />
                      </TabsContent>

                      <TabsContent
                        value={ViewMode.PREVIEW}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <PagesPreview
                          data={pages}
                          projectName={project.name}
                          isLoading={pagesLoading}
                        />
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              )}
            </Card>

            {/* Data Model Section */}
            <Card className="overflow-hidden">
              <SectionHeader
                title="Data Model"
                description="Configure the database entities and relationships"
                sectionId={SectionId.DATA_MODEL}
                isExpanded={expandedSections[SectionId.DATA_MODEL]}
              />
              {expandedSections[SectionId.DATA_MODEL] && (
                <div className="p-6">
                  {dataModelLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
                      <span className="text-slate-600 dark:text-slate-300">
                        Loading data model...
                      </span>
                    </div>
                  ) : (
                    <Tabs
                      value={sectionViewModes[SectionId.DATA_MODEL]}
                      onValueChange={(value) =>
                        changeViewMode(SectionId.DATA_MODEL, value as ViewMode)
                      }
                      className="w-full"
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger value={ViewMode.EDIT}>Edit</TabsTrigger>
                        <TabsTrigger value={ViewMode.PREVIEW}>
                          Preview
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value={ViewMode.EDIT}>
                        {dataModel && (
                          <div className="flex justify-end mb-4">
                            <MarkdownActions
                              markdown={markdownService.generateDataModelMarkdown(
                                dataModel
                              )}
                              fileName={markdownService.generateFileName(
                                project.name,
                                "data-model"
                              )}
                            />
                          </div>
                        )}
                        <DataModelForm
                          initialData={dataModel || undefined}
                          projectId={id}
                          onSuccess={handleDataModelUpdate}
                        />
                      </TabsContent>

                      <TabsContent
                        value={ViewMode.PREVIEW}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <DataModelPreview
                          data={dataModel}
                          projectName={project.name}
                          isLoading={dataModelLoading}
                        />
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              )}
            </Card>

            {/* API Endpoints Section */}
            <Card className="overflow-hidden">
              <SectionHeader
                title="API Endpoints"
                description="Configure the API endpoints for your application"
                sectionId={SectionId.API_ENDPOINTS}
                isExpanded={expandedSections[SectionId.API_ENDPOINTS]}
              />
              {expandedSections[SectionId.API_ENDPOINTS] && (
                <div className="p-6">
                  {apiEndpointsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
                      <span className="text-slate-600 dark:text-slate-300">
                        Loading API endpoints data...
                      </span>
                    </div>
                  ) : (
                    <Tabs
                      value={sectionViewModes[SectionId.API_ENDPOINTS]}
                      onValueChange={(value) =>
                        changeViewMode(
                          SectionId.API_ENDPOINTS,
                          value as ViewMode
                        )
                      }
                      className="w-full"
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger value={ViewMode.EDIT}>Edit</TabsTrigger>
                        <TabsTrigger value={ViewMode.PREVIEW}>
                          Preview
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value={ViewMode.EDIT}>
                        {apiEndpoints && (
                          <div className="flex justify-end mb-4">
                            <MarkdownActions
                              markdown={markdownService.generateApiEndpointsMarkdown(
                                apiEndpoints
                              )}
                              fileName={markdownService.generateFileName(
                                project.name,
                                "api-endpoints"
                              )}
                            />
                          </div>
                        )}
                        <ApiEndpointsForm
                          initialData={apiEndpoints || undefined}
                          projectId={id}
                          onSuccess={handleApiEndpointsUpdate}
                        />
                      </TabsContent>

                      <TabsContent
                        value={ViewMode.PREVIEW}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <ApiEndpointsPreview
                          data={apiEndpoints}
                          projectName={project.name}
                          isLoading={apiEndpointsLoading}
                        />
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              )}
            </Card>

            {/* Test Cases Section */}
            <Card className="overflow-hidden">
              <SectionHeader
                title="Test Cases"
                description="Define Gherkin-style test cases to document expected behavior"
                sectionId={SectionId.TEST_CASES}
                isExpanded={expandedSections[SectionId.TEST_CASES]}
              />
              {expandedSections[SectionId.TEST_CASES] && (
                <div className="p-6">
                  {testCasesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
                      <span className="text-slate-600 dark:text-slate-300">
                        Loading test cases data...
                      </span>
                    </div>
                  ) : (
                    <Tabs
                      value={sectionViewModes[SectionId.TEST_CASES]}
                      onValueChange={(value) =>
                        changeViewMode(SectionId.TEST_CASES, value as ViewMode)
                      }
                      className="w-full"
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger value={ViewMode.EDIT}>Edit</TabsTrigger>
                        <TabsTrigger value={ViewMode.PREVIEW}>
                          Preview
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value={ViewMode.EDIT}>
                        {testCases && (
                          <div className="flex justify-end mb-4">
                            <MarkdownActions
                              markdown={markdownService.generateTestCasesMarkdown(
                                testCases
                              )}
                              fileName={markdownService.generateFileName(
                                project.name,
                                "test-cases"
                              )}
                            />
                          </div>
                        )}
                        <TestCasesForm
                          initialData={testCases || undefined}
                          projectId={id}
                          onSuccess={handleTestCasesUpdate}
                        />
                      </TabsContent>

                      <TabsContent
                        value={ViewMode.PREVIEW}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <TestCasesPreview
                          data={testCases}
                          projectName={project.name}
                          isLoading={testCasesLoading}
                        />
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              )}
            </Card>

            {/* Implementation Prompts Section */}
            <Card className="overflow-hidden">
              <SectionHeader
                title="Implementation Prompts"
                description="Define prompts for implementing different aspects of your project using AI tools."
                sectionId={SectionId.IMPLEMENTATION_PROMPTS}
                isExpanded={expandedSections[SectionId.IMPLEMENTATION_PROMPTS]}
              />

              {expandedSections[SectionId.IMPLEMENTATION_PROMPTS] && (
                <div className="p-6">
                  {implementationPromptsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
                      <span className="text-slate-600 dark:text-slate-300">
                        Loading implementation prompts data...
                      </span>
                    </div>
                  ) : (
                    <Tabs
                      value={sectionViewModes[SectionId.IMPLEMENTATION_PROMPTS]}
                      onValueChange={(value) =>
                        changeViewMode(
                          SectionId.IMPLEMENTATION_PROMPTS,
                          value as ViewMode
                        )
                      }
                      className="w-full"
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger value={ViewMode.EDIT}>Edit</TabsTrigger>
                        <TabsTrigger value={ViewMode.PREVIEW}>
                          Preview
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value={ViewMode.EDIT}>
                        <ImplementationPromptsForm
                          projectId={id}
                          initialData={implementationPrompts || undefined}
                          onSuccess={handleImplementationPromptsUpdate}
                        />
                      </TabsContent>

                      <TabsContent
                        value={ViewMode.PREVIEW}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                      >
                        <ImplementationPromptsPreview
                          data={implementationPrompts || undefined}
                          isLoading={implementationPromptsLoading}
                        />
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              )}
            </Card>

            {/* More project sections can be added here later */}
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default ProjectDetails;
