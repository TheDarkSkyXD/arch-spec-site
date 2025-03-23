import React from 'react';
import { SectionId, ViewMode } from '../../hooks/useSectionState';
import ProjectSection from './ProjectSection';
import ImplementationPromptsForm from '../forms/ImplementationPromptsForm';
import ImplementationPromptsPreview from '../previews/ImplementationPromptsPreview';
import { markdownService } from '../../services/markdown';
import { ImplementationPrompts } from '../../types/templates';

interface ImplementationPromptsSectionProps {
  implementationPrompts: ImplementationPrompts | null;
  projectId?: string;
  projectName: string;
  sectionId: SectionId.IMPLEMENTATION_PROMPTS;
  isExpanded: boolean;
  viewMode: ViewMode;
  isLoading: boolean;
  onToggle: (sectionId: SectionId) => void;
  onViewModeChange: (sectionId: SectionId, viewMode: ViewMode) => void;
  onSuccess: (updatedPrompts: Partial<ImplementationPrompts>) => void;
}

const ImplementationPromptsSection: React.FC<ImplementationPromptsSectionProps> = ({
  implementationPrompts,
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
      title="Implementation Prompts"
      description="Configure prompts for code implementation"
      sectionId={sectionId}
      isExpanded={isExpanded}
      onToggle={onToggle}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      isLoading={isLoading}
      markdown={implementationPrompts ? markdownService.generateImplementationPromptsMarkdown(implementationPrompts) : undefined}
      markdownFileName={markdownService.generateFileName(projectName, "implementation-prompts")}
      editContent={
        <ImplementationPromptsForm
          initialData={implementationPrompts || undefined}
          projectId={projectId}
          onSuccess={onSuccess}
        />
      }
      previewContent={
        <ImplementationPromptsPreview 
          data={implementationPrompts || undefined} 
          projectName={projectName}
          isLoading={isLoading} 
        />
      }
    />
  );
};

export default ImplementationPromptsSection;