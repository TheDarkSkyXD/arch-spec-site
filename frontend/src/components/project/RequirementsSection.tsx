import React from 'react';
import { SectionId, ViewMode } from '../../hooks/useSectionState';
import ProjectSection from './ProjectSection';
import RequirementsForm from '../forms/RequirementsForm';
import RequirementsPreview from '../previews/RequirementsPreview';
import { Requirements } from '../../types/templates';
import { markdownService } from '../../services/markdown';

interface RequirementsSectionProps {
  requirements: Partial<Requirements> | null;
  projectId?: string;
  projectName: string;
  sectionId: SectionId.REQUIREMENTS;
  isExpanded: boolean;
  viewMode: ViewMode;
  isLoading: boolean;
  onToggle: (sectionId: SectionId) => void;
  onViewModeChange: (sectionId: SectionId, viewMode: ViewMode) => void;
  onSuccess: (updatedRequirements: Partial<Requirements>) => void;
}

const RequirementsSection: React.FC<RequirementsSectionProps> = ({
  requirements,
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
      title="Requirements"
      description="Define functional and non-functional requirements for your project"
      sectionId={sectionId}
      isExpanded={isExpanded}
      onToggle={onToggle}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      isLoading={isLoading}
      markdown={
        requirements
          ? markdownService.generateRequirementsMarkdown(requirements as Requirements)
          : undefined
      }
      markdownFileName={markdownService.generateFileName(projectName, 'requirements')}
      editContent={
        <RequirementsForm
          initialData={requirements || undefined}
          projectId={projectId}
          onSuccess={onSuccess}
        />
      }
      previewContent={
        <RequirementsPreview
          data={requirements as Requirements | null}
          projectName={projectName}
          isLoading={isLoading}
        />
      }
    />
  );
};

export default RequirementsSection;
