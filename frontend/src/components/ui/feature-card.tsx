import * as React from "react"
import { cn } from "../../lib/utils"
import { Edit, Trash2, ToggleLeft, ToggleRight, Info } from "lucide-react"

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  isEnabled: boolean
  isRequired?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onToggle?: () => void
  children?: React.ReactNode
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ 
    className, 
    title, 
    description, 
    isEnabled, 
    isRequired = false,
    onEdit, 
    onDelete, 
    onToggle,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800",
          className
        )}
        {...props}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-slate-800 dark:text-slate-100">
              {title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {description}
            </p>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                title="Edit feature"
              >
                <Edit size={18} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                title="Remove feature"
              >
                <Trash2 size={18} />
              </button>
            )}
            {onToggle && (
              <button
                type="button"
                onClick={onToggle}
                disabled={!isRequired}
                className={`p-1 ${
                  isRequired
                    ? "cursor-not-allowed text-slate-400 dark:text-slate-600"
                    : "cursor-pointer"
                }`}
                title={
                  isRequired ? "Toggle feature" : "This feature is required"
                }
              >
                {isEnabled ? (
                  <ToggleRight size={24} className="text-primary-600" />
                ) : (
                  <ToggleLeft
                    size={24}
                    className="text-slate-400 dark:text-slate-500"
                  />
                )}
              </button>
            )}
          </div>
        </div>

        {!isRequired && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
            <Info size={12} />
            <span>This feature is required for implementation</span>
          </div>
        )}

        {children && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            {children}
          </div>
        )}
      </div>
    )
  }
)

FeatureCard.displayName = "FeatureCard"

export { FeatureCard }