import { ChevronLeft, ChevronRight } from "lucide-react";
import { Step } from "./ProjectWizardSteps";

interface ProjectWizardNavigationProps {
  steps: Step[];
  currentStep: string;
  onPrevious: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canContinue?: boolean;
}

const ProjectWizardNavigation = ({
  steps,
  currentStep,
  onPrevious,
  onNext,
  isFirstStep,
  isLastStep,
  canContinue = true,
}: ProjectWizardNavigationProps) => {
  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex justify-between">
      <button
        onClick={onPrevious}
        className="flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <ChevronLeft size={16} className="mr-1" />
        {isFirstStep ? "Cancel" : "Previous"}
      </button>

      <button
        onClick={onNext}
        className={`flex items-center px-4 py-2 rounded-lg ${
          !canContinue
            ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            : "bg-primary-600 hover:bg-primary-700 text-white"
        }`}
        disabled={!canContinue}
      >
        {isLastStep ? "Create Project" : "Continue"}
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );
};

export default ProjectWizardNavigation;