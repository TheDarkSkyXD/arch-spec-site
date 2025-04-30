import { ChevronDown, ChevronLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DownloadAllMarkdown from '../components/common/DownloadAllMarkdown';
import {
  useApiEndpoints,
  useDataModel,
  useFeatures,
  usePages,
  useRequirements,
  useTestCases,
  useUIDesign,
} from '../hooks/useDataQueries';
import MainLayout from '../layouts/MainLayout';
import { FeaturesData } from '../services/featuresService';
import { projectsService } from '../services/projectsService';
import { techStackService } from '../services/techStackService';
import { TestCasesData } from '../services/testCasesService';
import { ProjectBase } from '../types/project';
import {
  Api,
  DataModel,
  Pages,
  ProjectTechStack,
  Requirements,
  UIDesign,
} from '../types/templates';

// Import shadcn UI components
import Button from '@ui/Button';
import Card from '@ui/Card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { userApi } from '../api/userApi';
import { useSubscription } from '../contexts/SubscriptionContext';
import { implementationPromptsService } from '../services/implementationPromptsService';
import { ImplementationPrompts } from '../types/templates';

// Import custom hook and section components
import ApiEndpointsSection from '../components/project/ApiEndpointsSection';
import DataModelSection from '../components/project/DataModelSection';
import FeaturesSection from '../components/project/FeaturesSection';
import ImplementationPromptsSection from '../components/project/ImplementationPromptsSection';
import PagesSection from '../components/project/PagesSection';
import ProjectBasicsSection from '../components/project/ProjectBasicsSection';
import RequirementsSection from '../components/project/RequirementsSection';
import TechStackSection from '../components/project/TechStackSection';
import TestCasesSection from '../components/project/TestCasesSection';
import UIDesignSection from '../components/project/UIDesignSection';
import { SectionId, useSectionState } from '../hooks/useSectionState';

// Map section IDs to display names
const sectionDisplayNames: Record<SectionId, string> = {
  [SectionId.BASICS]: 'Project Details',
  [SectionId.TECH_STACK]: 'Technology Stack',
  [SectionId.REQUIREMENTS]: 'Requirements',
  [SectionId.FEATURES]: 'Features',
  [SectionId.PAGES]: 'Pages',
  [SectionId.DATA_MODEL]: 'Data Model',
  [SectionId.API_ENDPOINTS]: 'API Endpoints',
  [SectionId.TEST_CASES]: 'Test Cases',
  [SectionId.UI_DESIGN]: 'UI Design',
  [SectionId.IMPLEMENTATION_PROMPTS]: 'Implementation Prompts',
};

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectBase | null>(null);
  const [techStack, setTechStack] = useState<ProjectTechStack | null>(null);
  const [loading, setLoading] = useState(true);
  const [techStackLoading, setTechStackLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshSubscriptionData } = useSubscription();
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionId>(SectionId.BASICS);

  // Use our custom hook for section state
  const { expandedSections, sectionViewModes, toggleSection, changeViewMode } = useSectionState();

  // Use the hooks
  const { data: requirements, isLoading: requirementsLoading } = useRequirements(id);
  const { data: features, isLoading: featuresLoading } = useFeatures(id);
  const { data: pages, isLoading: pagesLoading } = usePages(id);
  const { data: fetchedDataModel, isLoading: dataModelLoading } = useDataModel(id);
  const [localDataModel, setLocalDataModel] = useState<Partial<DataModel> | null>(null);
  const { data: fetchedApiEndpoints, isLoading: apiEndpointsLoading } = useApiEndpoints(id);
  const [localApiEndpoints, setLocalApiEndpoints] = useState<Api | null>(null);
  const { data: testCases, isLoading: testCasesLoading } = useTestCases(id);

  // Add UI Design hook
  const { data: uiDesign, isLoading: uiDesignLoading } = useUIDesign(id);

  // Add implementation prompts state
  const [implementationPrompts, setImplementationPrompts] = useState<ImplementationPrompts | null>(
    null
  );
  const [implementationPromptsLoading, setImplementationPromptsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      await userApi.getCurrentUserProfile();
      refreshSubscriptionData();
    };
    loadUserProfile();
  }, [refreshSubscriptionData]);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);

      if (!id) {
        setError('Project ID is missing');
        setLoading(false);
        return;
      }

      try {
        const projectData = await projectsService.getProjectById(id);
        if (projectData) {
          setProject(projectData);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details');
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
        console.error('Error fetching tech stack:', err);
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
        const data = await implementationPromptsService.getImplementationPrompts(id);
        setImplementationPrompts(data);
      } catch (err) {
        console.error('Error fetching implementation prompts:', err);
      } finally {
        setImplementationPromptsLoading(false);
      }
    };

    fetchImplementationPrompts();
  }, [id]);

  // Effect to initialize localDataModel when fetchedDataModel loads
  useEffect(() => {
    if (fetchedDataModel) {
      setLocalDataModel(fetchedDataModel);
    }
  }, [fetchedDataModel]);

  // Effect to initialize localApiEndpoints when fetchedApiEndpoints loads
  useEffect(() => {
    if (fetchedApiEndpoints) {
      setLocalApiEndpoints(fetchedApiEndpoints);
    }
  }, [fetchedApiEndpoints]);

  // Add scroll handler to detect when to show sticky header
  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = 150; // Approximate height of the initial header area
      setIsHeaderSticky(window.scrollY > headerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add intersection observer to track which section is currently visible
  useEffect(() => {
    if (!project || loading) return;

    const options = {
      root: null,
      rootMargin: '-100px 0px -80% 0px', // Consider element in view when it's 100px below viewport top and not more than 80% scrolled past
      threshold: 0,
    };

    const sectionIds = Object.values(SectionId);
    const observers: IntersectionObserver[] = [];

    const handleIntersect = (entries: IntersectionObserverEntry[], sectionId: SectionId) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(sectionId);
        }
      });
    };

    sectionIds.forEach((sectionId) => {
      const sectionElement = document.getElementById(`section-${sectionId}`);
      if (sectionElement) {
        const observer = new IntersectionObserver(
          (entries) => handleIntersect(entries, sectionId as SectionId),
          options
        );
        observer.observe(sectionElement);
        observers.push(observer);
      }
    });

    // Cleanup function
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [project, loading]);

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

  const handleRequirementsUpdate = (_updatedRequirements: Partial<Requirements>) => {
    // Update is handled by refetching from the backend
    console.log('Requirements updated:', _updatedRequirements);
  };

  const handleFeaturesUpdate = (_updatedFeatures: FeaturesData) => {
    // Update is handled by refetching from the backend
    console.log('Features updated:', _updatedFeatures);
  };

  const handlePagesUpdate = (_updatedPages: Pages) => {
    // Update is handled by refetching from the backend
    console.log('Pages updated:', _updatedPages);
  };

  const handleDataModelUpdate = (updatedDataModel: Partial<DataModel>) => {
    setLocalDataModel(updatedDataModel);
    console.log('Data Model updated locally:', updatedDataModel);
  };

  const handleApiEndpointsUpdate = (updatedApiEndpoints: Api) => {
    setLocalApiEndpoints(updatedApiEndpoints);
    console.log('API Endpoints updated locally:', updatedApiEndpoints);
  };

  const handleTestCasesUpdate = (_updatedTestCases: TestCasesData) => {
    // Update is handled by refetching from the backend
    console.log('Test Cases updated:', _updatedTestCases);
  };

  const handleUIDesignUpdate = (_updatedUIDesign: UIDesign) => {
    // Update is handled by refetching from the backend
    console.log('UI Design updated:', _updatedUIDesign);
  };

  const handleImplementationPromptsUpdate = (updatedPrompts: Partial<ImplementationPrompts>) => {
    // Update local state immediately so the preview shows the latest changes
    setImplementationPrompts(updatedPrompts as ImplementationPrompts);
    console.log('Implementation Prompts updated:', updatedPrompts);
  };

  const scrollToSection = (sectionId: SectionId) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      // Get the sticky header element
      const headerElement = document.querySelector<HTMLElement>('.fixed.left-0.right-0.top-0.z-50');
      const headerHeight = headerElement ? headerElement.offsetHeight : 0;
      // Calculate position relative to the viewport, add current scroll offset, subtract header height and a small margin
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 16; // 16px margin

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <MainLayout>
      {/* Sticky project header */}
      {project && !loading && (
        <div
          className={`fixed left-0 right-0 top-0 z-50 bg-white shadow-md transition-transform duration-300 dark:bg-slate-900 ${
            isHeaderSticky ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="container mx-auto flex max-w-6xl items-center px-4 py-3">
            <Button
              onClick={() => navigate('/projects')}
              variant="ghost"
              size="icon"
              className="mr-2 h-8 w-8 shrink-0 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <ChevronLeft size={18} />
              <span className="sr-only">Back to Projects</span>
            </Button>
            <div className="flex min-w-0 flex-1 items-center">
              <h2 className="mr-2 hidden truncate text-lg font-bold text-slate-900 dark:text-white sm:block">
                {project?.name}
              </h2>
              <h2 className="mr-2 block truncate text-lg font-bold text-slate-900 dark:text-white sm:hidden">
                {project?.name.length > 15 ? `${project?.name.substring(0, 15)}...` : project?.name}
              </h2>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="-ml-2 flex items-center px-2 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <span className="mr-1 hidden sm:inline-block">•</span>
                    <span className="truncate">{sectionDisplayNames[currentSection]}</span>
                    <ChevronDown size={16} className="ml-1 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {Object.entries(sectionDisplayNames).map(([id, name]) => (
                    <DropdownMenuItem
                      key={id}
                      onSelect={() => scrollToSection(id as SectionId)}
                      className={
                        currentSection === id
                          ? 'font-semibold text-primary-600 dark:text-primary-400'
                          : ''
                      }
                    >
                      {name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center">
          <Button
            onClick={() => navigate('/projects')}
            variant="ghost"
            className="mr-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {loading ? 'Loading Project...' : project?.name || 'Project Details'}
          </h1>
          {project && !loading && (
            <div className="ml-auto">
              <DownloadAllMarkdown
                project={project}
                techStack={techStack}
                requirements={requirements as Requirements | null}
                features={features || null}
                uiDesign={uiDesign || null}
                pages={pages || null}
                dataModel={localDataModel || null}
                apiEndpoints={localApiEndpoints || null}
                testCases={testCases || null}
                implementationPrompts={implementationPrompts || null}
              />
            </div>
          )}
        </div>

        {loading ? (
          <Card className="flex items-center justify-center py-16">
            <Loader2 className="mr-3 h-8 w-8 animate-spin text-primary-600" />
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Loading project details...
            </span>
          </Card>
        ) : error ? (
          <Card className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mb-4 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-16 w-16"
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
              <h3 className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
                {error}
              </h3>
              <p className="mb-6 text-slate-500 dark:text-slate-400">
                There was a problem loading the project details.
              </p>
              <Button
                onClick={() => navigate('/projects')}
                className="rounded-lg bg-primary-600 px-5 py-2 text-white shadow-sm hover:bg-primary-700"
              >
                Return to Projects
              </Button>
            </div>
          </Card>
        ) : project ? (
          <div className="space-y-6">
            {/* Project Basics Section */}
            <div id={`section-${SectionId.BASICS}`}>
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
            </div>

            {/* Tech Stack Section */}
            <div id={`section-${SectionId.TECH_STACK}`}>
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
            </div>

            {/* Requirements Section */}
            <div id={`section-${SectionId.REQUIREMENTS}`}>
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
            </div>

            {/* Features Section */}
            <div id={`section-${SectionId.FEATURES}`}>
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
            </div>

            {/* UI Design Section */}
            <div id={`section-${SectionId.UI_DESIGN}`}>
              <UIDesignSection
                uiDesign={uiDesign}
                projectId={id}
                projectName={project.name}
                sectionId={SectionId.UI_DESIGN}
                isExpanded={expandedSections[SectionId.UI_DESIGN]}
                viewMode={sectionViewModes[SectionId.UI_DESIGN]}
                isLoading={uiDesignLoading}
                onToggle={toggleSection}
                onViewModeChange={changeViewMode}
                onSuccess={handleUIDesignUpdate}
              />
            </div>

            {/* Pages Section */}
            <div id={`section-${SectionId.PAGES}`}>
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
            </div>

            {/* Data Model Section */}
            <div id={`section-${SectionId.DATA_MODEL}`}>
              <DataModelSection
                dataModel={localDataModel}
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
            </div>

            {/* API Endpoints Section */}
            <div id={`section-${SectionId.API_ENDPOINTS}`}>
              <ApiEndpointsSection
                apiEndpoints={localApiEndpoints}
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
            </div>

            {/* Test Cases Section */}
            <div id={`section-${SectionId.TEST_CASES}`}>
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
            </div>

            {/* Implementation Prompts Section */}
            <div id={`section-${SectionId.IMPLEMENTATION_PROMPTS}`}>
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
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default ProjectDetails;
