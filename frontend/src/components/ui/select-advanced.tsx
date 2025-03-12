import * as React from "react"
import { cn } from "../../lib/utils"
import { Check, ChevronDown } from "lucide-react"

/* Root Select Provider Component */
interface SelectContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  onValueChange?: (value: string) => void
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined)

interface SelectProps {
  children: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
}

const Select = ({ 
  children, 
  value: controlledValue, 
  defaultValue = "", 
  onValueChange,
  disabled = false 
}: SelectProps) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(controlledValue || defaultValue)

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue)
    }
  }, [controlledValue])

  React.useEffect(() => {
    if (onValueChange && value !== controlledValue) {
      onValueChange(value)
    }
  }, [value, onValueChange, controlledValue])

  return (
    <SelectContext.Provider value={{ open, setOpen, value, setValue, onValueChange }}>
      <div className={cn("relative w-full", disabled && "opacity-50 pointer-events-none")}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

/* Trigger Component */
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  placeholder?: string
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, placeholder, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error('SelectTrigger must be used within Select')

    const { open, setOpen, value } = context
    
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-slate-300",
          "px-3 py-2 text-sm bg-white text-slate-900",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100",
          className
        )}
        {...props}
      >
        <span className={cn(
          "truncate",
          !value && "text-slate-500 dark:text-slate-400"
        )}>
          {children || value || placeholder || "Select..."}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

/* Content Component */
type SelectContentProps = React.HTMLAttributes<HTMLDivElement>

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error('SelectContent must be used within Select')

    const { open, setOpen } = context
    
    // Create a local ref that we'll use for click outside detection
    const contentRef = React.useRef<HTMLDivElement | null>(null)
    const mergedRef = React.useMemo(() => {
      return (node: HTMLDivElement | null) => {
        // Update our local ref
        contentRef.current = node
        
        // Forward the ref
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      }
    }, [ref])

    // Declare effect outside of conditional but use open to control functionality
    React.useEffect(() => {
      // Only add listeners if the dropdown is open
      if (!open) return;
      
      const handleClickOutside = (e: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [open, setOpen]) // Dependencies include open state

    if (!open) return null

    return (
      <div
        ref={mergedRef}
        className={cn(
          "absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border",
          "bg-white text-slate-950 shadow-md",
          "dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700",
          "top-full left-0 mt-1",
          "animate-in fade-in-80",
          className
        )}
        {...props}
      />
    )
  }
)
SelectContent.displayName = "SelectContent"

/* Item Component */
interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value: itemValue, disabled, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error('SelectItem must be used within Select')

    const { value, setValue, setOpen } = context
    const isSelected = value === itemValue

    const handleSelect = () => {
      if (!disabled) {
        setValue(itemValue)
        setOpen(false)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm",
          "hover:bg-slate-100 dark:hover:bg-slate-700",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          isSelected && "bg-slate-100 dark:bg-slate-700",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        onClick={handleSelect}
        {...props}
      >
        <span className="flex-1">{children || itemValue}</span>
        {isSelected && (
          <Check className="h-4 w-4 ml-2 text-primary-600 dark:text-primary-400" />
        )}
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

/* Value Component */
interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string; // Added placeholder prop
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, children, placeholder, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error('SelectValue must be used within Select')

    const { value } = context

    return (
      <span
        ref={ref}
        className={cn("truncate", !value && "text-slate-500 dark:text-slate-400", className)}
        {...props}
      >
        {children || value || placeholder || "Select..."}
      </span>
    )
  }
)
SelectValue.displayName = "SelectValue"

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
}