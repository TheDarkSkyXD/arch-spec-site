import React, { useState } from "react";
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
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface TemplateDetailsProps {
  template: ProjectTemplate;
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({ template }) => {
  // Add state to track section collapse states
  const [sectionsOpen, setSectionsOpen] = useState({
    header: true,
    requirements: true,
    techStack: true,
    features: true,
    dataModel: true,
    pages: true,
    api: true,
  });

  // Track if all sections are expanded
  const [allExpanded, setAllExpanded] = useState(true);

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleExpandAll = () => {
    setSectionsOpen({
      header: true,
      requirements: true,
      techStack: true,
      features: true,
      dataModel: true,
      pages: true,
      api: true,
    });
    setAllExpanded(true);
  };

  const handleCollapseAll = () => {
    setSectionsOpen({
      header: false,
      requirements: false,
      techStack: false,
      features: false,
      dataModel: false,
      pages: false,
      api: false,
    });
    setAllExpanded(false);
  };

  const toggleExpandCollapse = () => {
    if (allExpanded) {
      handleCollapseAll();
    } else {
      handleExpandAll();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          {template.name}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {template.description}
        </p>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
          Version: {template.version}
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={toggleExpandCollapse}
          className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md transition-colors flex items-center space-x-1"
        >
          {allExpanded ? (
            <>
              <ChevronUpIcon className="h-4 w-4" />
              <span>Collapse All</span>
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-4 w-4" />
              <span>Expand All</span>
            </>
          )}
        </button>
      </div>

      <HeaderSection
        businessGoals={template.businessGoals}
        targetUsers={template.targetUsers}
        isOpen={sectionsOpen.header}
        onToggle={() => toggleSection("header")}
      />

      {template.requirements && (
        <RequirementsSection
          requirements={template.requirements}
          isOpen={sectionsOpen.requirements}
          onToggle={() => toggleSection("requirements")}
        />
      )}

      {template.techStack && (
        <TechStackSection
          techStack={template.techStack}
          isOpen={sectionsOpen.techStack}
          onToggle={() => toggleSection("techStack")}
        />
      )}

      {template.features && (
        <FeaturesSection
          features={template.features}
          isOpen={sectionsOpen.features}
          onToggle={() => toggleSection("features")}
        />
      )}

      {template.dataModel && (
        <DataModelSection
          dataModel={template.dataModel}
          isOpen={sectionsOpen.dataModel}
          onToggle={() => toggleSection("dataModel")}
        />
      )}

      {template.pages && (
        <PagesSection
          pages={template.pages}
          isOpen={sectionsOpen.pages}
          onToggle={() => toggleSection("pages")}
        />
      )}

      {template.api && (
        <ApiSection
          api={template.api}
          isOpen={sectionsOpen.api}
          onToggle={() => toggleSection("api")}
        />
      )}
    </div>
  );
};

export default TemplateDetails;
