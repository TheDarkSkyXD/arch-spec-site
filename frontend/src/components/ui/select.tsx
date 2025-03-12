import * as React from "react"
import { cn } from "../../lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={cn(
              "block w-full rounded-md border border-slate-300 px-3 py-2 pr-8", 
              "shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500",
              "text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:border-slate-600",
              error ? "border-red-500 focus:ring-red-500" : "",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export { Select }