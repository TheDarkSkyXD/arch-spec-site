import React from 'react';
import { Requirements } from '../../types/templates';
import CollapsibleSection from './CollapsibleSection';

interface RequirementsSectionProps {
  requirements: Requirements;
  isOpen: boolean;
  onToggle: () => void;
}

const RequirementsSection: React.FC<RequirementsSectionProps> = ({
  requirements,
  isOpen,
  onToggle,
}) => {
  return (
    <CollapsibleSection title="Requirements" isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-6">
        {/* Functional Requirements */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Functional Requirements
          </h4>
          {requirements.functional && requirements.functional.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5">
              {requirements.functional.map((requirement, index) => (
                <li key={index} className="text-sm text-slate-600 dark:text-slate-400">
                  {requirement}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No functional requirements specified</p>
          )}
        </div>

        {/* Non-Functional Requirements */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Non-Functional Requirements
          </h4>
          {requirements.non_functional && requirements.non_functional.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5">
              {requirements.non_functional.map((requirement, index) => (
                <li key={index} className="text-sm text-slate-600 dark:text-slate-400">
                  {requirement}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No non-functional requirements specified</p>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default RequirementsSection;
