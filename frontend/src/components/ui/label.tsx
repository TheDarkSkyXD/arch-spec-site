import * as React from 'react';
import { cn } from '../../lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  optional?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, optional, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        'text-slate-700 dark:text-slate-300',
        className
      )}
      {...props}
    >
      {children}
      {optional && <span className="ml-1 text-slate-500 dark:text-slate-400">(optional)</span>}
    </label>
  )
);
Label.displayName = 'Label';

export { Label };
