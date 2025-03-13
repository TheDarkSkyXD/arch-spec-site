import * as React from "react"
import { cn } from "../../lib/utils"

interface AlertDialogProps {
  children: React.ReactNode
  className?: string
}

const AlertDialog = ({ children, className }: AlertDialogProps) => {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  )
}

interface AlertDialogTriggerProps {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent) => void
}

const AlertDialogTrigger = ({ children, onClick }: AlertDialogTriggerProps) => {
  return (
    <div onClick={onClick}>
      {children}
    </div>
  )
}

interface AlertDialogContentProps {
  children: React.ReactNode
  className?: string
  isOpen: boolean
  onClose: () => void
}

const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  AlertDialogContentProps
>(({ children, className, isOpen, onClose }, ref) => {
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div
        ref={ref}
        className={cn(
          "fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "w-full max-w-md bg-white dark:bg-slate-900 rounded-lg shadow-lg",
          "p-6 space-y-4 animate-in fade-in zoom-in duration-300",
          className
        )}
      >
        {children}
      </div>
    </>
  )
})
AlertDialogContent.displayName = "AlertDialogContent"

interface AlertDialogHeaderProps {
  children: React.ReactNode
  className?: string
}

const AlertDialogHeader = ({ children, className }: AlertDialogHeaderProps) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      {children}
    </div>
  )
}

interface AlertDialogTitleProps {
  children: React.ReactNode
  className?: string
}

const AlertDialogTitle = ({ children, className }: AlertDialogTitleProps) => {
  return (
    <h2 className={cn("text-xl font-semibold text-slate-900 dark:text-slate-50", className)}>
      {children}
    </h2>
  )
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

const AlertDialogDescription = ({ children, className }: AlertDialogDescriptionProps) => {
  return (
    <div className={cn("text-sm text-slate-600 dark:text-slate-400", className)}>
      {children}
    </div>
  )
}

interface AlertDialogFooterProps {
  children: React.ReactNode
  className?: string
}

const AlertDialogFooter = ({ children, className }: AlertDialogFooterProps) => {
  return (
    <div className={cn("flex justify-end space-x-2 pt-4", className)}>
      {children}
    </div>
  )
}

type AlertDialogActionProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)
AlertDialogAction.displayName = "AlertDialogAction"

type AlertDialogCancelProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 border border-slate-200 text-slate-700 rounded-md", 
        "hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children || "Cancel"}
    </button>
  )
)
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
}