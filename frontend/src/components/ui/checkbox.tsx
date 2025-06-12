import * as React from 'react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, onCheckedChange, checked, onChange, ...props }, ref) => {
    // Handle both onChange and onCheckedChange
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    return (
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            type="checkbox"
            className={cn(
              'h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'dark:border-slate-600 dark:bg-slate-800 dark:checked:bg-primary-600 dark:focus:ring-primary-500',
              className
            )}
            ref={ref}
            checked={checked}
            onChange={handleChange}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="ml-2 text-sm">
            {label && (
              <label htmlFor={props.id} className="font-medium text-slate-700 dark:text-slate-300">
                {label}
              </label>
            )}
            {description && <p className="text-slate-500 dark:text-slate-400">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
