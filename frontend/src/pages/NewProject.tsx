import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/userApi';
import ApiEndpointsForm from '../components/forms/ApiEndpointsForm';
import DataModelForm from '../components/forms/DataModelForm';
import FeaturesForm from '../components/forms/FeaturesForm';
import ImplementationPromptsForm from '../components/forms/ImplementationPromptsForm';
import PagesForm from '../components/forms/PagesForm';
import ProjectBasicsForm from '../components/forms/ProjectBasicsForm';
import RequirementsForm from '../components/forms/RequirementsForm';
import TechStackForm from '../components/forms/TechStackForm';
import TestCasesForm from '../components/forms/TestCasesForm';
import UIDesignForm from '../components/forms/UIDesignForm';
import TemplateSelectionStep from '../components/project/TemplateSelectionStep';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useToast } from '../contexts/ToastContext';
import { useProjectTemplateSection } from '../hooks/useProjectTemplateSection';
import MainLayout from '../layouts/MainLayout';

// Import services for saving template data
import { apiEndpointsService } from '../services/apiEndpointsService';
import { dataModelService } from '../services/dataModelService';
import { featuresService } from '../services/featuresService';
import { implementationPromptsService } from '../services/implementationPromptsService';
import { pagesService } from '../services/pagesService';
import { requirementsService } from '../services/requirementsService';
import { techStackService } from '../services/techStackService';
import { testCasesService } from '../services/testCasesService';
import { uiDesignService } from '../services/uiDesignService';

// Import shadcn UI components
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// Import template types
import { BaaSBackend, FrameworkBackend, ServerlessBackend, SQLDatabase } from '../types/templates';

// Import tech stack form data type
import { TechStackFormData } from '../components/forms/tech-stack/techStackSchema';

// Define section IDs for consistency
enum SectionId {
  TEMPLATE = 'template',
  BASICS = 'basics',
  TECH_STACK = 'techStack',
  REQUIREMENTS = 'requirements',
  FEATURES = 'features',
  PAGES = 'pages',
  DATA_MODEL = 'dataModel',
  API_ENDPOINTS = 'apiEndpoints',
  TEST_CASES = 'testCases',
  IMPLEMENTATION_PROMPTS = 'implementationPrompts',
  UI_DESIGN = 'uiDesign',
}

const NewProject = () => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  const { refreshSubscriptionData } = useSubscription();
  const { showToast } = useToast();
  const [isSavingTemplateData, setIsSavingTemplateData] = useState(false);

  // State to track expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<SectionId, boolean>>({
    [SectionId.TEMPLATE]: true,
    [SectionId.BASICS]: true,
    [SectionId.TECH_STACK]: false,
    [SectionId.REQUIREMENTS]: false,
    [SectionId.FEATURES]: false,
    [SectionId.PAGES]: false,
    [SectionId.DATA_MODEL]: false,
    [SectionId.API_ENDPOINTS]: false,
    [SectionId.TEST_CASES]: false,
    [SectionId.IMPLEMENTATION_PROMPTS]: false,
    [SectionId.UI_DESIGN]: false,
  });

  // Function to toggle section expansion
  const toggleSection = (sectionId: SectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const { selectedTemplate, loading, error, handleTemplateSelect, handleBlankProjectSelect } =
    useProjectTemplateSection();

  // Load subscription data when component mounts
  useEffect(() => {
    const loadUserProfile = async () => {
      await userApi.getCurrentUserProfile();
      refreshSubscriptionData();
    };
    loadUserProfile();
  }, [refreshSubscriptionData]);

  // Function to save all template data to a project
  const saveAllTemplateData = async (projectId: string) => {
    if (!selectedTemplate || !projectId) return;

    try {
      setIsSavingTemplateData(true);

      // Create an array of promises to save all specs in parallel
      const savePromises = [];

      // Save requirements if they exist in template
      if (selectedTemplate.requirements) {
        savePromises.push(
          requirementsService.saveRequirements(projectId, {
            functional: selectedTemplate.requirements.functional || [],
            non_functional: selectedTemplate.requirements.non_functional || [],
          })
        );
      }

      // Save tech stack if it exists in template
      if (selectedTemplate.techStack) {
        // Create a tech stack object with proper type definition
        const convertedTechStack: TechStackFormData = {
          frontend: selectedTemplate.techStack.frontend?.framework || '',
          frontend_language: selectedTemplate.techStack.frontend?.language || '',
          backend_type: selectedTemplate.techStack.backend?.type || '',
          ui_library: selectedTemplate.techStack.frontend?.uiLibrary,
          state_management: selectedTemplate.techStack.frontend?.stateManagement,
        };

        // Add backend properties conditionally based on type
        if (selectedTemplate.techStack.backend?.type === 'framework') {
          // Only framework type has framework and language
          const frameworkBackend = selectedTemplate.techStack.backend as FrameworkBackend;
          convertedTechStack.backend_framework = frameworkBackend.framework;
          convertedTechStack.backend_language = frameworkBackend.language;
        } else if (
          selectedTemplate.techStack.backend?.type === 'baas' ||
          selectedTemplate.techStack.backend?.type === 'serverless'
        ) {
          // BaaS and Serverless have service
          const backendWithService = selectedTemplate.techStack.backend as
            | BaaSBackend
            | ServerlessBackend;
          convertedTechStack.backend_service = backendWithService.service;

          // Only Serverless has language
          if (selectedTemplate.techStack.backend?.type === 'serverless') {
            const serverlessBackend = selectedTemplate.techStack.backend as ServerlessBackend;
            convertedTechStack.backend_language = serverlessBackend.language;
          }
        }

        // Database properties - only SQL database has ORM
        if (selectedTemplate.techStack.database) {
          convertedTechStack.database_type = selectedTemplate.techStack.database.type;
          convertedTechStack.database_system = selectedTemplate.techStack.database.system;

          if (selectedTemplate.techStack.database.type === 'sql') {
            const sqlDatabase = selectedTemplate.techStack.database as SQLDatabase;
            convertedTechStack.database_orm = sqlDatabase.orm || undefined;
          }
        }

        // Add the rest of the properties
        if (selectedTemplate.techStack.authentication) {
          convertedTechStack.auth_provider = selectedTemplate.techStack.authentication.provider;
        }

        if (selectedTemplate.techStack.hosting) {
          convertedTechStack.hosting_frontend = selectedTemplate.techStack.hosting.frontend;
          convertedTechStack.hosting_backend = selectedTemplate.techStack.hosting.backend;
          convertedTechStack.hosting_database = selectedTemplate.techStack.hosting.database;
        }

        if (selectedTemplate.techStack.storage) {
          convertedTechStack.storage_type = selectedTemplate.techStack.storage.type;
          convertedTechStack.storage_service = selectedTemplate.techStack.storage.service;
        }

        if (selectedTemplate.techStack.deployment) {
          convertedTechStack.deployment_ci_cd =
            selectedTemplate.techStack.deployment.ci_cd || undefined;
          convertedTechStack.deployment_containerization =
            selectedTemplate.techStack.deployment.containerization || undefined;
        }

        savePromises.push(techStackService.saveTechStack(projectId, convertedTechStack));
      }

      // Save features if they exist in template
      if (selectedTemplate.features) {
        savePromises.push(featuresService.saveFeatures(projectId, selectedTemplate.features));
      }

      // Save pages if they exist in template
      if (selectedTemplate.pages) {
        savePromises.push(pagesService.savePages(projectId, selectedTemplate.pages));
      }

      // Save data model if it exists in template
      if (selectedTemplate.dataModel) {
        savePromises.push(dataModelService.saveDataModel(projectId, selectedTemplate.dataModel));
      }

      // Save API endpoints if they exist in template
      if (selectedTemplate.api) {
        savePromises.push(apiEndpointsService.saveApiEndpoints(projectId, selectedTemplate.api));
      }

      // Save UI design if it exists in template
      if (selectedTemplate.uiDesign) {
        savePromises.push(uiDesignService.saveUIDesign(projectId, selectedTemplate.uiDesign));
      }

      // Save test cases if they exist in template
      if (selectedTemplate.testing && selectedTemplate.testing.e2e?.scenarios) {
        // Convert the string array to the proper GherkinTestCase format
        const formattedTestCases = (selectedTemplate.testing.e2e.scenarios || []).map(
          (scenario) => ({
            feature: 'Generated Feature',
            title: scenario,
            description: '',
            given: [`Given ${scenario}`],
            when: ['When the feature is used'],
            then: ['Then the expected outcome is achieved'],
            scenarios: [],
          })
        );

        savePromises.push(
          testCasesService.saveTestCases(projectId, {
            testCases: formattedTestCases,
          })
        );
      }

      // Save implementation prompts if needed
      savePromises.push(
        implementationPromptsService.saveImplementationPrompts(projectId, {
          data: {},
        })
      );

      // Execute all save operations in parallel
      await Promise.all(savePromises);

      showToast({
        title: 'Success',
        description: 'All template data saved to the project',
        type: 'success',
      });

      console.log('All template data saved to project successfully');
    } catch (error) {
      console.error('Error saving template data to project:', error);
      showToast({
        title: 'Warning',
        description: 'Some template data could not be saved to the project',
        type: 'warning',
      });
    } finally {
      setIsSavingTemplateData(false);
    }
  };

  useEffect(() => {
    console.log('Is saving template data:', isSavingTemplateData);
  }, [isSavingTemplateData]);

  useEffect(() => {
    console.log('Selected Template:', selectedTemplate);
  }, [selectedTemplate]);

  // Reusable section header component
  const SectionHeader = ({
    title,
    description,
    sectionId,
    isExpanded,
    required = false,
    disabled = false,
  }: {
    title: string;
    description: string;
    sectionId: SectionId;
    isExpanded: boolean;
    required?: boolean;
    disabled?: boolean;
  }) => (
    <div
      className={`flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-700 ${
        !disabled ? 'cursor-pointer' : ''
      }`}
      onClick={() => !disabled && toggleSection(sectionId)}
    >
      <div>
        <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
          {title} {required && <span className="text-red-500">*</span>}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description}
          {disabled && (
            <span className="ml-1 text-amber-500">(Save project basics first to enable)</span>
          )}
        </p>
      </div>
      {!disabled && (
        <div className="text-slate-400 dark:text-slate-500">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      )}
    </div>
  );

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl">
        {/* Header with back button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="mb-2 flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </Button>
          <h1 className="font-heading text-2xl font-bold text-slate-800 dark:text-slate-100">
            Create New Project
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Fill in the required information to create your project. You can update other sections
            anytime.
          </p>
        </div>

        {/* Project Sections */}
        <div className="space-y-8">
          {/* Template Selection */}
          <Card className="overflow-hidden">
            <SectionHeader
              title="Template Selection"
              description="Choose a template or start from scratch"
              sectionId={SectionId.TEMPLATE}
              isExpanded={expandedSections[SectionId.TEMPLATE]}
            />
            {expandedSections[SectionId.TEMPLATE] && (
              <div className="p-6">
                <TemplateSelectionStep
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                  onBlankProjectSelect={handleBlankProjectSelect}
                  loading={loading}
                  error={error}
                />
              </div>
            )}
          </Card>

          {/* Project Basics (Required) */}
          <Card className="overflow-hidden">
            <SectionHeader
              title="Project Basics"
              description="Required information about your project"
              sectionId={SectionId.BASICS}
              isExpanded={expandedSections[SectionId.BASICS]}
              required={true}
            />
            {expandedSections[SectionId.BASICS] && (
              <div className="p-6">
                <ProjectBasicsForm
                  onSuccess={(newProjectId) => {
                    // Check if this is an initial project creation
                    const isNewProject = projectId === undefined;

                    // Store the project ID in state
                    setProjectId(newProjectId);
                    console.log('Project created/updated successfully with ID:', newProjectId);

                    // Only save template data on initial project creation
                    if (isNewProject && selectedTemplate) {
                      saveAllTemplateData(newProjectId);
                    }
                  }}
                />
              </div>
            )}
          </Card>

          {/* Requirements (Optional) */}
          <Card className="overflow-hidden">
            <SectionHeader
              title="Requirements"
              description="Define functional and non-functional requirements"
              sectionId={SectionId.REQUIREMENTS}
              isExpanded={expandedSections[SectionId.REQUIREMENTS]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.REQUIREMENTS] && (
              <div className="p-6">
                <RequirementsForm
                  initialData={
                    selectedTemplate?.requirements || {
                      functional: [],
                      non_functional: [],
                    }
                  }
                  projectId={projectId}
                  onSuccess={(updatedRequirements) => {
                    console.log('Requirements updated:', updatedRequirements);
                  }}
                />
              </div>
            )}
          </Card>

          {/* Features (Optional) */}
          <Card className="overflow-hidden">
            <SectionHeader
              title="Features"
              description="Define core modules and features"
              sectionId={SectionId.FEATURES}
              isExpanded={expandedSections[SectionId.FEATURES]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.FEATURES] && (
              <div className="p-6">
                <FeaturesForm
                  initialData={
                    selectedTemplate?.features || {
                      coreModules: [],
                    }
                  }
                  projectId={projectId}
                  onSuccess={(updatedFeatures) => {
                    console.log('Features updated:', updatedFeatures);
                  }}
                />
              </div>
            )}
          </Card>

          {/* UI Design (Optional) */}
          <Card className="overflow-hidden">
            <SectionHeader
              title="UI Design"
              description="Define your project's visual design system"
              sectionId={SectionId.UI_DESIGN}
              isExpanded={expandedSections[SectionId.UI_DESIGN]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.UI_DESIGN] && (
              <div className="p-6">
                <UIDesignForm
                  initialData={selectedTemplate?.uiDesign}
                  projectId={projectId}
                  onSuccess={(updatedUIDesign) => {
                    console.log('UI Design updated:', updatedUIDesign);
                  }}
                />
              </div>
            )}
          </Card>

          {/* Tech Stack (Optional) */}
          <Card className="overflow-hidden">
            <SectionHeader
              title="Tech Stack"
              description="Define your project's technology stack"
              sectionId={SectionId.TECH_STACK}
              isExpanded={expandedSections[SectionId.TECH_STACK]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.TECH_STACK] && (
              <div className="p-6">
                <TechStackForm
                  initialData={selectedTemplate?.techStack}
                  projectId={projectId}
                  onSuccess={() => {
                    console.log('Tech stack updated');
                  }}
                />
              </div>
            )}
          </Card>

          {/* Pages (Optional) */}
          <Card className="overflow-hidden">
            <SectionHeader
              title="Pages"
              description="Define pages for your application"
              sectionId={SectionId.PAGES}
              isExpanded={expandedSections[SectionId.PAGES]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.PAGES] && (
              <div className="p-6">
                <PagesForm
                  initialData={
                    selectedTemplate?.pages || {
                      public: [],
                      authenticated: [],
                      admin: [],
                    }
                  }
                  projectId={projectId}
                  onSuccess={(updatedPages) => {
                    console.log('Pages updated:', updatedPages);
                  }}
                />
              </div>
            )}
          </Card>

          {/* Data Model (Optional) */}
          <Card className="overflow-hidden">
            <SectionHeader
              title="Data Model"
              description="Define database entities and relationships"
              sectionId={SectionId.DATA_MODEL}
              isExpanded={expandedSections[SectionId.DATA_MODEL]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.DATA_MODEL] && (
              <div className="p-6">
                <DataModelForm
                  initialData={
                    selectedTemplate?.dataModel || {
                      entities: [],
                      relationships: [],
                    }
                  }
                  projectId={projectId}
                  onSuccess={(updatedDataModel) => {
                    console.log('Data Model updated:', updatedDataModel);
                  }}
                />
              </div>
            )}
          </Card>

          {/* API Endpoints (Optional) */}
          <Card className="overflow-hidden">
            <SectionHeader
              title="API Endpoints"
              description="Define API endpoints for your application"
              sectionId={SectionId.API_ENDPOINTS}
              isExpanded={expandedSections[SectionId.API_ENDPOINTS]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.API_ENDPOINTS] && (
              <div className="p-6">
                <ApiEndpointsForm
                  initialData={
                    selectedTemplate?.api || {
                      endpoints: [],
                    }
                  }
                  projectId={projectId}
                  onSuccess={(updatedApiEndpoints) => {
                    console.log('API Endpoints updated:', updatedApiEndpoints);
                  }}
                />
              </div>
            )}
          </Card>

          {/* Test Cases (Optional) */}
          <Card className="overflow-hidden">
            <SectionHeader
              title="Test Cases"
              description="Define Gherkin-style test cases to document expected behavior"
              sectionId={SectionId.TEST_CASES}
              isExpanded={expandedSections[SectionId.TEST_CASES]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.TEST_CASES] && (
              <div className="p-6">
                <TestCasesForm
                  initialData={{
                    testCases: [],
                  }}
                  projectId={projectId}
                  onSuccess={(updatedTestCases) => {
                    console.log('Test Cases updated:', updatedTestCases);
                  }}
                />
              </div>
            )}
          </Card>

          {/* Implementation Prompts (Optional) */}
          <Card className="overflow-hidden">
            <SectionHeader
              title="Implementation Prompts"
              description="Define prompts for implementing different aspects of your project"
              sectionId={SectionId.IMPLEMENTATION_PROMPTS}
              isExpanded={expandedSections[SectionId.IMPLEMENTATION_PROMPTS]}
              disabled={!projectId}
            />
            {expandedSections[SectionId.IMPLEMENTATION_PROMPTS] && (
              <div className="p-6">
                <ImplementationPromptsForm
                  initialData={{
                    data: {},
                  }}
                  projectId={projectId}
                  onSuccess={(updatedImplementationPrompts) => {
                    console.log('Implementation Prompts updated:', updatedImplementationPrompts);
                  }}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewProject;
