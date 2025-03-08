import MainLayout from "../layouts/MainLayout";
import ProjectBasicsForm from "../components/forms/ProjectBasicsForm";
import TechStackForm from "../components/forms/TechStackForm";
import RequirementsForm from "../components/forms/RequirementsForm";
import FeaturesForm from "../components/forms/FeaturesForm";
import PagesForm from "../components/forms/PagesForm";
import ApiEndpointsForm from "../components/forms/ApiEndpointsForm";
import ProjectReviewForm from "../components/forms/ProjectReviewForm";
import { useProjectWizard } from "../hooks/useProjectWizard";
import TemplateSelectionStep from "../components/project/TemplateSelectionStep";
import ProjectWizardContainer from "../components/project/ProjectWizardContainer";

const NewProject = () => {
  const {
    currentStep,
    selectedTemplate,
    loading,
    error,
    formData,
    handleTemplateSelect,
    handleBlankProjectSelect,
    handleBasicsSubmit,
    handleTechStackSubmit,
    handleRequirementsSubmit,
    handleFeaturesSubmit,
    handlePagesSubmit,
    handleApiEndpointsSubmit,
    handleCreateProject,
    handleStepClick,
    submitCurrentForm,
    goToPreviousStep,
    canContinueFromTemplate,
  } = useProjectWizard();

  const renderStepContent = () => {
    switch (currentStep) {
      case "template":
        return (
          <TemplateSelectionStep
            selectedTemplate={selectedTemplate}
            templateId={formData.template_id}
            onTemplateSelect={handleTemplateSelect}
            onBlankProjectSelect={handleBlankProjectSelect}
            loading={loading}
            error={error}
          />
        );
      case "basics":
        return (
          <ProjectBasicsForm
            initialData={{
              name: formData.name || "",
              description: formData.description || "",
              business_goals: formData.business_goals?.join(", ") || "",
              target_users: formData.target_users?.join(", ") || "",
              domain: formData.domain || "",
              organization: formData.organization || "",
              project_lead: formData.project_lead || "",
            }}
            onSubmit={handleBasicsSubmit}
          />
        );
      case "tech-stack":
        return (
          <TechStackForm
            initialData={{
              frontend: formData.template_data?.tech_stack?.frontend || "",
              backend: formData.template_data?.tech_stack?.backend || "",
              database: formData.template_data?.tech_stack?.database || "",
              frontend_language: "",
              ui_library: "",
              state_management: "",
              backend_provider: "",
              database_provider: "",
              auth_provider: "",
              auth_methods: "",
            }}
            onSubmit={handleTechStackSubmit}
            onBack={() => goToPreviousStep()}
          />
        );
      case "requirements":
        return (
          <RequirementsForm
            initialData={{
              functional_requirements: formData.functional_requirements || [],
              non_functional_requirements:
                formData.non_functional_requirements || [],
            }}
            onSubmit={handleRequirementsSubmit}
            onBack={() => goToPreviousStep()}
          />
        );
      case "features":
        return (
          <FeaturesForm
            initialData={{
              core_modules:
                formData.template_data?.features?.core_modules || [],
            }}
            onSubmit={handleFeaturesSubmit}
            onBack={() => goToPreviousStep()}
          />
        );
      case "pages":
        return (
          <PagesForm
            initialData={{
              public: formData.template_data?.pages?.public || [],
              authenticated: formData.template_data?.pages?.authenticated || [],
              admin: formData.template_data?.pages?.admin || [],
            }}
            onSubmit={handlePagesSubmit}
            onBack={() => goToPreviousStep()}
          />
        );
      case "api":
        return (
          <ApiEndpointsForm
            initialData={{
              endpoints: formData.template_data?.api?.endpoints || [],
            }}
            onSubmit={handleApiEndpointsSubmit}
            onBack={() => goToPreviousStep()}
          />
        );
      case "review":
        return (
          <ProjectReviewForm
            projectData={formData}
            onSubmit={handleCreateProject}
            onBack={() => goToPreviousStep()}
            onEdit={(section) => handleStepClick(section)}
          />
        );
      default:
        return <div>Step not implemented yet</div>;
    }
  };

  // Determine if we can continue based on the current step
  const canContinue =
    currentStep === "template" ? canContinueFromTemplate : true;

  return (
    <MainLayout showSidebar={false}>
      <ProjectWizardContainer
        currentStep={currentStep}
        onStepClick={handleStepClick}
        onPrevious={goToPreviousStep}
        onNext={submitCurrentForm}
        canContinue={canContinue}
      >
        {renderStepContent()}
      </ProjectWizardContainer>
    </MainLayout>
  );
};

export default NewProject;
