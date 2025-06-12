import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300',
        secondary:
          'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/50 dark:text-secondary-300',
        destructive: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        outline: 'border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      },
      size: {
        default: 'h-6 text-xs',
        sm: 'h-5 text-[10px]',
        lg: 'h-7 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, removable, onRemove, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props}>
        <span className="truncate">{children}</span>
        {removable && onRemove && (
          <button
            type="button"
            className="-mr-1 ml-1 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <span className="sr-only">Remove</span>
            <svg
              width="6"
              height="6"
              viewBox="0 0 6 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current"
            >
              <path d="M1 1L5 5M1 5L5 1" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
