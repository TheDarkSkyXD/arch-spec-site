import React from "react";
import { Requirements } from "../../types/templates";
import CollapsibleSection from "./CollapsibleSection";

interface RequirementsSectionProps {
  requirements: Requirements;
}

const RequirementsSection: React.FC<RequirementsSectionProps> = ({
  requirements,
}) => {
  return (
    <CollapsibleSection title="Requirements">
      <div className="space-y-6">
        {/* Functional Requirements */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Functional Requirements
          </h4>
          {requirements.functional && requirements.functional.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {requirements.functional.map((requirement, index) => (
                <li
                  key={index}
                  className="text-sm text-slate-600 dark:text-slate-400"
                >
                  {requirement}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              No functional requirements specified
            </p>
          )}
        </div>

        {/* Non-Functional Requirements */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Non-Functional Requirements
          </h4>
          {requirements.non_functional &&
          requirements.non_functional.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {requirements.non_functional.map((requirement, index) => (
                <li
                  key={index}
                  className="text-sm text-slate-600 dark:text-slate-400"
                >
                  {requirement}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              No non-functional requirements specified
            </p>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default RequirementsSection;
