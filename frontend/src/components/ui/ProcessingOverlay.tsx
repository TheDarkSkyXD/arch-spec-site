import React from "react";
import { Loader2 } from "lucide-react";

interface ProcessingOverlayProps {
  isVisible: boolean;
  message?: string;
  opacity?: number;
  spinnerSize?: number;
  zIndex?: number;
}

/**
 * A reusable overlay component that displays a loading spinner and message
 * while an operation is in progress.
 */
export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  isVisible,
  message = "Please wait...",
  opacity = 0.7,
  spinnerSize = 24,
  zIndex = 50,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        backgroundColor: `rgba(15, 23, 42, ${opacity})`,
        backdropFilter: "blur(2px)",
        zIndex,
      }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg flex flex-col items-center max-w-md">
        <Loader2 className="animate-spin text-primary-600" size={spinnerSize} />
        <p className="mt-3 text-slate-700 dark:text-slate-200 text-center">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
