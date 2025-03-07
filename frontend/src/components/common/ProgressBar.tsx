import { Check } from "lucide-react";

interface Step {
  id: string;
  name: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;
}

const ProgressBar = ({ steps, currentStep, onStepClick }: ProgressBarProps) => {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="w-full py-6">
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;
            const isClickable =
              onStepClick && (isCompleted || index === currentStepIndex + 1);

            return (
              <li
                key={step.id}
                className={`relative ${index !== 0 ? "flex-1" : ""}`}
              >
                {index !== 0 && (
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-0.5 w-full ${
                        index <= currentStepIndex
                          ? "bg-primary-600"
                          : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}

                <div
                  className={`relative flex items-center justify-center ${
                    isClickable ? "cursor-pointer group" : ""
                  }`}
                  onClick={isClickable ? () => onStepClick(step.id) : undefined}
                >
                  {isCompleted ? (
                    <span className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                      <Check
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  ) : isActive ? (
                    <span className="h-8 w-8 rounded-full border-2 border-primary-600 bg-white flex items-center justify-center">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                    </span>
                  ) : (
                    <span
                      className={`h-8 w-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center ${
                        isClickable ? "group-hover:border-gray-400" : ""
                      }`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                    </span>
                  )}

                  <span
                    className={`ml-2 text-sm font-medium ${
                      isActive
                        ? "text-primary-600"
                        : isCompleted
                        ? "text-gray-900"
                        : "text-gray-500"
                    } ${isClickable ? "group-hover:text-gray-700" : ""}`}
                  >
                    {step.name}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default ProgressBar;
