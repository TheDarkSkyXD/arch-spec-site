import { createContext, ReactNode, useContext } from "react";
import { useToast as useToastHook, Toast } from "../hooks/useToast";

type ToastContextType = {
  toasts: Toast[];
  showToast: (toast: Toast) => string;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const toastHook = useToastHook();

  return (
    <ToastContext.Provider value={toastHook}>{children}</ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
