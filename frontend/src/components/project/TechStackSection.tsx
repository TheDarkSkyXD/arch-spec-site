import React from 'react';
import { SectionId, ViewMode } from '../../hooks/useSectionState';
import ProjectSection from './ProjectSection';
import TechStackForm from '../forms/TechStackForm';
import TechStackPreview from '../previews/TechStackPreview';
import { ProjectTechStack } from '../../types/templates';
import { markdownService } from '../../services/markdown';

interface TechStackSectionProps {
  techStack: ProjectTechStack | null;
  projectId?: string;
  projectName: string;
  sectionId: SectionId.TECH_STACK;
  isExpanded: boolean;
  viewMode: ViewMode;
  isLoading: boolean;
  onToggle: (sectionId: SectionId) => void;
  onViewModeChange: (sectionId: SectionId, viewMode: ViewMode) => void;
  onSuccess: (updatedTechStack: ProjectTechStack) => void;
}

const TechStackSection: React.FC<TechStackSectionProps> = ({
  techStack,
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
      title="Technology Stack"
      description="Configure the technology stack for your project"
      sectionId={sectionId}
      isExpanded={isExpanded}
      onToggle={onToggle}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      isLoading={isLoading}
      markdown={techStack ? markdownService.generateTechStackMarkdown(techStack) : undefined}
      markdownFileName={markdownService.generateFileName(projectName, "tech-stack")}
      editContent={
        <TechStackForm
          initialData={techStack || undefined}
          projectId={projectId}
          onSuccess={onSuccess}
        />
      }
      previewContent={
        <TechStackPreview 
          data={techStack} 
          projectName={projectName} 
          isLoading={isLoading} 
        />
      }
    />
  );
};

export default TechStackSection;