import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

/**
 * A reusable error message component with consistent styling
 */
const ErrorMessage = ({
  message,
  className = "",
  onDismiss,
}: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <div
      className={`bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 
                p-4 rounded-md flex items-start border-l-4 border-red-500 
                dark:border-red-400 animate-fadeIn ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
      <div className="flex-1 text-sm">{message}</div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-auto -mx-1.5 -my-1.5 bg-red-50 dark:bg-red-900/30 
                   text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 
                   p-1.5 inline-flex items-center justify-center h-8 w-8
                   hover:bg-red-100 dark:hover:bg-red-900/50"
          aria-label="Dismiss"
        >
          <span className="sr-only">Dismiss</span>
          <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
