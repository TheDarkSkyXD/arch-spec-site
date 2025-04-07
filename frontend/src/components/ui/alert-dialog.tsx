import * as React from 'react';
import { cn } from '../../lib/utils';

interface AlertDialogProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialog = ({ children, className }: AlertDialogProps) => {
  return <div className={cn('relative', className)}>{children}</div>;
};

interface AlertDialogTriggerProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
}

const AlertDialogTrigger = ({ children, onClick }: AlertDialogTriggerProps) => {
  return <div onClick={onClick}>{children}</div>;
};

interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ children, className, isOpen, onClose }, ref) => {
    if (!isOpen) return null;

    return (
      <>
        <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
        <div
          ref={ref}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform',
            'w-full max-w-md rounded-lg bg-white shadow-lg dark:bg-slate-900',
            'animate-in fade-in zoom-in space-y-4 p-6 duration-300',
            className
          )}
        >
          {children}
        </div>
      </>
    );
  }
);
AlertDialogContent.displayName = 'AlertDialogContent';

interface AlertDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialogHeader = ({ children, className }: AlertDialogHeaderProps) => {
  return <div className={cn('space-y-1.5', className)}>{children}</div>;
};

interface AlertDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialogTitle = ({ children, className }: AlertDialogTitleProps) => {
  return (
    <h2 className={cn('text-xl font-semibold text-slate-900 dark:text-slate-50', className)}>
      {children}
    </h2>
  );
};

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialogDescription = ({ children, className }: AlertDialogDescriptionProps) => {
  return (
    <div className={cn('text-sm text-slate-600 dark:text-slate-400', className)}>{children}</div>
  );
};

interface AlertDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

const AlertDialogFooter = ({ children, className }: AlertDialogFooterProps) => {
  return <div className={cn('flex justify-end space-x-2 pt-4', className)}>{children}</div>;
};

type AlertDialogActionProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
AlertDialogAction.displayName = 'AlertDialogAction';

type AlertDialogCancelProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'rounded-md border border-slate-200 px-4 py-2 text-slate-700',
        'hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        className
      )}
      {...props}
    >
      {children || 'Cancel'}
    </button>
  )
);
AlertDialogCancel.displayName = 'AlertDialogCancel';

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};
