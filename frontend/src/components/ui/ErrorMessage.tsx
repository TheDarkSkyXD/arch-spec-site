import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

/**
 * A reusable error message component with consistent styling
 */
const ErrorMessage = ({ message, className = '', onDismiss }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <div
      className={`animate-fadeIn flex items-start rounded-md border-l-4 border-red-500 bg-red-50 p-4 text-red-700 dark:border-red-400 dark:bg-red-900/20 dark:text-red-400 ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
      <div className="flex-1 text-sm">{message}</div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:ring-2 focus:ring-red-400 dark:bg-red-900/30 dark:hover:bg-red-900/50"
          aria-label="Dismiss"
        >
          <span className="sr-only">Dismiss</span>
          <svg
            className="h-3 w-3"
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
