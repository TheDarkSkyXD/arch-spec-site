import React from 'react';
import { SectionId, ViewMode } from '../../hooks/useSectionState';
import ProjectSection from './ProjectSection';
import UIDesignForm from '../forms/UIDesignForm';
import UIDesignPreview from '../previews/UIDesignMarkdownView';
import { markdownService } from '../../services/markdown';
import { UIDesign } from '../../types/templates';

interface UIDesignSectionProps {
  uiDesign: UIDesign | null;
  projectId?: string;
  projectName?: string;
  sectionId: SectionId;
  isExpanded: boolean;
  viewMode: ViewMode;
  isLoading: boolean;
  onToggle: (sectionId: SectionId) => void;
  onViewModeChange: (sectionId: SectionId, viewMode: ViewMode) => void;
  onSuccess?: (data: UIDesign) => void;
}

const UIDesignSection: React.FC<UIDesignSectionProps> = ({
  uiDesign,
  projectId,
  projectName,
  sectionId,
  isExpanded,
  viewMode,
  isLoading,
  onToggle,
  onViewModeChange,
  onSuccess,
}) => {
  return (
    <ProjectSection
      title="UI Design"
      description="Define the visual design system for your application"
      sectionId={sectionId}
      isExpanded={isExpanded}
      onToggle={onToggle}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      isLoading={isLoading}
      markdown={uiDesign ? markdownService.generateUIDesignMarkdown(uiDesign) : undefined}
      markdownFileName={
        projectName ? markdownService.generateFileName(projectName, 'ui-design') : undefined
      }
      editContent={
        <UIDesignForm
          initialData={uiDesign || undefined}
          projectId={projectId}
          projectName={projectName}
          onSuccess={onSuccess}
        />
      }
      previewContent={
        <UIDesignPreview data={uiDesign} projectName={projectName} isLoading={isLoading} />
      }
    />
  );
};

export default UIDesignSection;
