import React, { useState } from 'react';
import { ProjectTemplate } from '../../types/templates';
import {
  HeaderSection,
  TechStackSection,
  FeaturesSection,
  PagesSection,
  ApiSection,
  RequirementsSection,
  DataModelSection,
  UIDesignSection,
} from '../templateDetails';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

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
    uiDesign: true,
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
      uiDesign: true,
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
      uiDesign: false,
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
        <p className="mt-1 text-slate-600 dark:text-slate-400">{template.description}</p>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-500">
          Version: {template.version}
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <button
          onClick={toggleExpandCollapse}
          className="flex items-center space-x-1 rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
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
        onToggle={() => toggleSection('header')}
      />

      {template.requirements && (
        <RequirementsSection
          requirements={template.requirements}
          isOpen={sectionsOpen.requirements}
          onToggle={() => toggleSection('requirements')}
        />
      )}

      {template.techStack && (
        <TechStackSection
          techStack={template.techStack}
          isOpen={sectionsOpen.techStack}
          onToggle={() => toggleSection('techStack')}
        />
      )}

      {template.features && (
        <FeaturesSection
          features={template.features}
          isOpen={sectionsOpen.features}
          onToggle={() => toggleSection('features')}
        />
      )}

      {template.uiDesign && (
        <UIDesignSection
          uiDesign={template.uiDesign}
          isOpen={sectionsOpen.uiDesign}
          onToggle={() => toggleSection('uiDesign')}
        />
      )}

      {template.dataModel && (
        <DataModelSection
          dataModel={template.dataModel}
          isOpen={sectionsOpen.dataModel}
          onToggle={() => toggleSection('dataModel')}
        />
      )}

      {template.pages && (
        <PagesSection
          pages={template.pages}
          isOpen={sectionsOpen.pages}
          onToggle={() => toggleSection('pages')}
        />
      )}

      {template.api && (
        <ApiSection
          api={template.api}
          isOpen={sectionsOpen.api}
          onToggle={() => toggleSection('api')}
        />
      )}
    </div>
  );
};

export default TemplateDetails;
