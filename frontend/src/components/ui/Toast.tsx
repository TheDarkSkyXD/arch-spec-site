import { useEffect } from 'react';
import { Toast as ToastType } from '../../hooks/useToast';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

const Toast = ({ toast, onDismiss }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (toast.id) {
        onDismiss(toast.id);
      }
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getToastClasses = () => {
    const baseClasses =
      'flex items-center p-4 rounded-md shadow-md transition-all duration-300 w-full';

    switch (toast.type) {
      case 'success':
        return `${baseClasses} bg-green-500 text-white`;
      case 'error':
        return `${baseClasses} bg-red-500 text-white`;
      case 'warning':
        return `${baseClasses} bg-yellow-500 text-white`;
      case 'info':
      default:
        return `${baseClasses} bg-blue-500 text-white`;
    }
  };

  return (
    <div className={getToastClasses()}>
      <div className="flex-1">
        <h3 className="font-bold">{toast.title}</h3>
        <p className="text-sm">{toast.description}</p>
      </div>
      <button
        onClick={() => toast.id && onDismiss(toast.id)}
        className="ml-4 text-white hover:text-gray-200"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
