import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import React from 'react';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
  className = '',
}) => {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      <button className="flex w-full items-center justify-between p-5 text-left" onClick={onToggle}>
        <h3 className="font-medium text-slate-800 dark:text-slate-100">{title}</h3>
        <span>
          {isOpen ? (
            <ChevronDownIcon className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-slate-400" />
          )}
        </span>
      </button>

      {isOpen && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
