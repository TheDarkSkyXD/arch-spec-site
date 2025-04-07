import { CheckCircle } from 'lucide-react';

interface Step {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;
}

const ProgressBar = ({ steps, currentStep, onStepClick }: ProgressBarProps) => {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="w-full py-4">
      <nav aria-label="Progress">
        <ol className="flex flex-wrap items-center justify-center md:justify-start">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;
            const isClickable = onStepClick && (isCompleted || index === currentStepIndex + 1);

            return (
              <li key={step.id} className="flex items-center">
                <div
                  className={`flex items-center ${
                    isClickable ? 'cursor-pointer hover:opacity-90' : ''
                  } ${
                    currentStepIndex >= index
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-400 dark:text-slate-500'
                  } transition-colors duration-200`}
                  onClick={isClickable ? () => onStepClick(step.id) : undefined}
                >
                  <div
                    className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${
                      isActive
                        ? 'border-2 border-primary-600 bg-primary-100 dark:border-primary-500 dark:bg-primary-900/30'
                        : isCompleted
                          ? 'bg-primary-600 text-white dark:bg-primary-700'
                          : 'bg-slate-100 dark:bg-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={16} />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isActive || isCompleted
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-10 ${
                      index < currentStepIndex
                        ? 'bg-primary-600 dark:bg-primary-700'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  ></div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default ProgressBar;
