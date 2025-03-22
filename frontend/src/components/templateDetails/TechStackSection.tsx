import React from "react";
import { ProjectTechStack } from "../../types/templates";
import { renderTechStack } from "./utils";
import CollapsibleSection from "./CollapsibleSection";

interface TechStackSectionProps {
  techStack: ProjectTechStack;
}

const TechStackSection: React.FC<TechStackSectionProps> = ({ techStack }) => {
  // Create a reusable tech stack item component for consistent styling
  const TechStackItem = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-slate-800/90 dark:bg-slate-800 rounded-lg p-4">
      <h4 className="text-sm font-medium text-slate-200 dark:text-slate-200 mb-3 pb-2 border-b border-slate-700 dark:border-slate-700">
        {title}
      </h4>
      <div className="mt-2 space-y-3">{children}</div>
    </div>
  );

  // Create a reusable tech stack row component for displaying label-value pairs
  const TechStackRow = ({
    label,
    value,
  }: {
    label: string;
    value: unknown;
  }) => (
    <div className="grid grid-cols-[1fr,auto] gap-4 items-center">
      <span className="text-sm text-slate-400 dark:text-slate-400">
        {label}
      </span>
      <span className="text-sm font-medium text-white dark:text-white text-right">
        {renderTechStack(value)}
      </span>
    </div>
  );

  return (
    <CollapsibleSection title="Tech Stack">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Frontend */}
        <TechStackItem title="Frontend">
          <TechStackRow
            label="Framework"
            value={techStack.frontend.framework}
          />
          <TechStackRow label="Language" value={techStack.frontend.language} />
          {techStack.frontend.stateManagement && (
            <TechStackRow
              label="State Management"
              value={techStack.frontend.stateManagement}
            />
          )}
          {techStack.frontend.uiLibrary && (
            <TechStackRow
              label="UI Library"
              value={techStack.frontend.uiLibrary}
            />
          )}
          {techStack.frontend.formHandling && (
            <TechStackRow
              label="Form Handling"
              value={techStack.frontend.formHandling}
            />
          )}
          {techStack.frontend.routing && (
            <TechStackRow label="Routing" value={techStack.frontend.routing} />
          )}
          {techStack.frontend.apiClient && (
            <TechStackRow
              label="API Client"
              value={techStack.frontend.apiClient}
            />
          )}
          {techStack.frontend.metaFramework && (
            <TechStackRow
              label="Meta Framework"
              value={techStack.frontend.metaFramework}
            />
          )}
        </TechStackItem>

        {/* Backend */}
        <TechStackItem title="Backend">
          <TechStackRow label="Type" value={techStack.backend.type} />

          {techStack.backend.type === "framework" && (
            <>
              <TechStackRow
                label="Framework"
                value={techStack.backend.framework}
              />
              <TechStackRow
                label="Language"
                value={techStack.backend.language}
              />
              {techStack.backend.realtime && (
                <TechStackRow
                  label="Realtime"
                  value={techStack.backend.realtime}
                />
              )}
            </>
          )}

          {techStack.backend.type === "baas" && (
            <>
              <TechStackRow label="Service" value={techStack.backend.service} />
              {techStack.backend.functions && (
                <TechStackRow
                  label="Functions"
                  value={techStack.backend.functions}
                />
              )}
              {techStack.backend.realtime && (
                <TechStackRow
                  label="Realtime"
                  value={techStack.backend.realtime}
                />
              )}
            </>
          )}

          {techStack.backend.type === "serverless" && (
            <>
              <TechStackRow label="Service" value={techStack.backend.service} />
              <TechStackRow
                label="Language"
                value={techStack.backend.language}
              />
            </>
          )}
        </TechStackItem>

        {/* Database */}
        <TechStackItem title="Database">
          <TechStackRow label="Type" value={techStack.database.type} />
          <TechStackRow label="System" value={techStack.database.system} />
          <TechStackRow label="Hosting" value={techStack.database.hosting} />
          {techStack.database.type === "sql" && techStack.database.orm && (
            <TechStackRow label="ORM" value={techStack.database.orm} />
          )}
          {techStack.database.type === "nosql" && techStack.database.client && (
            <TechStackRow label="Client" value={techStack.database.client} />
          )}
        </TechStackItem>

        {/* Authentication */}
        <TechStackItem title="Authentication">
          <TechStackRow
            label="Provider"
            value={techStack.authentication.provider}
          />
          <TechStackRow
            label="Methods"
            value={
              Array.isArray(techStack.authentication.methods)
                ? techStack.authentication.methods.join(", ")
                : techStack.authentication.methods
            }
          />
        </TechStackItem>

        {/* Hosting */}
        <TechStackItem title="Hosting">
          <TechStackRow label="Frontend" value={techStack.hosting.frontend} />
          <TechStackRow label="Backend" value={techStack.hosting.backend} />
          {techStack.hosting.database && (
            <TechStackRow label="Database" value={techStack.hosting.database} />
          )}
        </TechStackItem>

        {/* Storage (Optional) */}
        {techStack.storage && (
          <TechStackItem title="Storage">
            <TechStackRow label="Type" value={techStack.storage.type} />
            <TechStackRow label="Service" value={techStack.storage.service} />
          </TechStackItem>
        )}

        {/* Deployment (Optional) */}
        {techStack.deployment && (
          <TechStackItem title="Deployment">
            {techStack.deployment.ci_cd && (
              <TechStackRow label="CI/CD" value={techStack.deployment.ci_cd} />
            )}
            {techStack.deployment.containerization && (
              <TechStackRow
                label="Containerization"
                value={techStack.deployment.containerization}
              />
            )}
          </TechStackItem>
        )}
      </div>
    </CollapsibleSection>
  );
};

export default TechStackSection;
