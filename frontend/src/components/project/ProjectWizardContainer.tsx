import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectWizardSteps, { projectWizardSteps } from "./ProjectWizardSteps";
import ProjectWizardNavigation from "./ProjectWizardNavigation";

interface ProjectWizardContainerProps {
  children: ReactNode;
  currentStep: string;
  onStepClick: (stepId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  canContinue?: boolean;
}

const ProjectWizardContainer = ({
  children,
  currentStep,
  onStepClick,
  onPrevious,
  onNext,
  canContinue = true,
}: ProjectWizardContainerProps) => {
  const navigate = useNavigate();
  
  // Determine current step index
  const currentStepIndex = projectWizardSteps.findIndex((step) => step.id === currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === projectWizardSteps.length - 1;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 mb-2 text-sm font-medium"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-heading">
          Create New Project
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Define your project specifications to generate an architecture plan
        </p>
      </div>

      {/* Main content card */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Steps indicator */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <ProjectWizardSteps currentStep={currentStep} onStepClick={onStepClick} />
        </div>

        {/* Form content */}
        <div className="p-6">{children}</div>

        {/* Footer with navigation buttons */}
        <ProjectWizardNavigation
          steps={projectWizardSteps}
          currentStep={currentStep}
          onPrevious={onPrevious}
          onNext={onNext}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          canContinue={canContinue}
        />
      </div>
    </div>
  );
};

export default ProjectWizardContainer;