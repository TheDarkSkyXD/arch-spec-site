import React from "react";
import { ProjectTemplate } from "../../types/templates";
import {
  HeaderSection,
  TechStackSection,
  FeaturesSection,
  PagesSection,
  ApiSection,
  RequirementsSection,
  DataModelSection,
} from "../templateDetails";

interface TemplateDetailsProps {
  template: ProjectTemplate;
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({ template }) => {
  return (
    <div className="space-y-6">
      <HeaderSection
        name={template.name}
        description={template.description}
        version={template.version}
        businessGoals={template.businessGoals}
        targetUsers={template.targetUsers}
      />

      {template.requirements && (
        <RequirementsSection requirements={template.requirements} />
      )}

      {template.techStack && (
        <TechStackSection techStack={template.techStack} />
      )}

      {template.features && <FeaturesSection features={template.features} />}

      {template.dataModel && (
        <DataModelSection dataModel={template.dataModel} />
      )}
      {template.pages && <PagesSection pages={template.pages} />}
      {template.api && <ApiSection api={template.api} />}
    </div>
  );
};

export default TemplateDetails;
