import * as React from "react"
import { cn } from "../../lib/utils"

export interface FormFieldProps {
  children: React.ReactNode
  label?: string
  htmlFor?: string
  error?: string
  className?: string
  required?: boolean
  description?: string
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ children, label, htmlFor, error, className, required, description }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-1", className)}>
        {label && (
          <label 
            htmlFor={htmlFor}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{description}</p>
        )}
        {children}
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

FormField.displayName = "FormField"

export { FormField }