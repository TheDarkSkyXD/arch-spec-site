import React from "react";
import { cn } from "../../lib/utils";

interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  (
    { checked, onCheckedChange, disabled = false, className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          checked
            ? "bg-primary-600 dark:bg-primary-600"
            : "bg-slate-200 dark:bg-slate-700",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={() => {
          if (!disabled && onCheckedChange) {
            onCheckedChange(!checked);
          }
        }}
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled && onCheckedChange) {
              onCheckedChange(!checked);
            }
          }
        }}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
          aria-hidden="true"
        />
      </div>
    );
  }
);

Switch.displayName = "Switch";
