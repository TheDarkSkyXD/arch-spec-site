import * as React from "react"
import { cn } from "../../lib/utils"
import { ChevronDown } from "lucide-react"

interface AccordionContextProps {
  value: string | null;
  onValueChange: (value: string) => void;
  collapsible?: boolean;
  type?: string;
}

const AccordionContext = React.createContext<AccordionContextProps | undefined>(undefined)

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
  type?: string;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, value: controlledValue, defaultValue, onValueChange, collapsible = false, type, children, ...props }, ref) => {
    const [value, setValue] = React.useState<string | null>(controlledValue || defaultValue || null)

    React.useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue)
      }
    }, [controlledValue])

    const handleValueChange = React.useCallback((newValue: string) => {
      setValue(newValue)
      onValueChange?.(newValue)
    }, [onValueChange])

    return (
      <AccordionContext.Provider
        value={{
          value,
          onValueChange: handleValueChange,
          collapsible,
          type
        }}
      >
        <div ref={ref} className={cn("space-y-2", className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = "Accordion"

interface AccordionItemContextProps {
  isOpen: boolean;
  toggle: () => void;
}

const AccordionItemContext = React.createContext<AccordionItemContextProps | undefined>(undefined)

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value: itemValue, children, ...props }, ref) => {
    const accordion = React.useContext(AccordionContext)
    if (!accordion) {
      throw new Error("AccordionItem must be used within an Accordion")
    }

    const isOpen = accordion.value === itemValue
    
    const toggle = React.useCallback(() => {
      if (isOpen && accordion.collapsible) {
        accordion.onValueChange("")
      } else {
        accordion.onValueChange(itemValue)
      }
    }, [isOpen, accordion, itemValue])

    return (
      <AccordionItemContext.Provider value={{ isOpen, toggle }}>
        <div
          ref={ref}
          className={cn(
            "border border-slate-200 rounded-md dark:border-slate-700",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    )
  }
)
AccordionItem.displayName = "AccordionItem"

type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const accordionItem = React.useContext(AccordionItemContext)
    if (!accordionItem) {
      throw new Error("AccordionTrigger must be used within an AccordionItem")
    }

    const { isOpen, toggle } = accordionItem
    
    return (
      <button
        ref={ref}
        onClick={toggle}
        className={cn(
          "flex w-full items-center justify-between px-4 py-3 text-left font-medium",
          "transition-all hover:bg-slate-100 dark:hover:bg-slate-800",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
          className
        )}
        type="button"
        {...props}
      >
        <span>{children}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-500 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
    )
  }
)
AccordionTrigger.displayName = "AccordionTrigger"

type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const accordionItem = React.useContext(AccordionItemContext)
    if (!accordionItem) {
      throw new Error("AccordionContent must be used within an AccordionItem")
    }

    const { isOpen } = accordionItem

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-96" : "max-h-0",
          className
        )}
        aria-hidden={!isOpen}
        {...props}
      >
        {isOpen && <div className="px-4 py-3">{children}</div>}
      </div>
    )
  }
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }