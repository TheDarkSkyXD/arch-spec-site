import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

/**
 * A reusable success message component with consistent styling
 */
const SuccessMessage = ({ message, className = '', onDismiss }: SuccessMessageProps) => {
  if (!message) return null;

  return (
    <div
      className={`animate-fadeIn flex items-start rounded-md border-l-4 border-green-500 bg-green-50 p-4 text-green-700 dark:border-green-400 dark:bg-green-900/20 dark:text-green-400 ${className}`}
      role="status"
      aria-live="polite"
    >
      <CheckCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
      <div className="flex-1 text-sm">{message}</div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:ring-2 focus:ring-green-400 dark:bg-green-900/30 dark:hover:bg-green-900/50"
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

export default SuccessMessage;
