import React from "react";
import CollapsibleSection from "./CollapsibleSection";

interface HeaderSectionProps {
  name: string;
  description: string;
  version: string;
  businessGoals: string[];
  targetUsers: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  name,
  description,
  version,
  businessGoals,
  targetUsers,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {name}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">{description}</p>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
          Version: {version}
        </div>
      </div>

      <CollapsibleSection title="Project Details">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Business Goals
            </h4>
            {Array.isArray(businessGoals) ? (
              <ul className="list-disc pl-5 space-y-1">
                {businessGoals.map((goal, index) => (
                  <li
                    key={index}
                    className="text-sm text-slate-600 dark:text-slate-400"
                  >
                    {goal}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {businessGoals}
              </p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Target Users
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {targetUsers}
            </p>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default HeaderSection;
