import React from 'react';
import { SectionId, ViewMode } from '../../hooks/useSectionState';
import ProjectSection from './ProjectSection';
import ProjectBasicsForm from '../forms/ProjectBasicsForm';
import ProjectBasicsPreview from '../previews/ProjectBasicsPreview';
import { ProjectBase } from '../../types/project';
import { markdownService } from '../../services/markdown';

interface ProjectBasicsSectionProps {
  project: ProjectBase;
  sectionId: SectionId.BASICS;
  isExpanded: boolean;
  viewMode: ViewMode;
  isLoading: boolean;
  onToggle: (sectionId: SectionId) => void;
  onViewModeChange: (sectionId: SectionId, viewMode: ViewMode) => void;
  onSuccess: (projectId: string) => void;
}

const ProjectBasicsSection: React.FC<ProjectBasicsSectionProps> = ({
  project,
  sectionId,
  isExpanded,
  viewMode,
  isLoading,
  onToggle,
  onViewModeChange,
  onSuccess,
}) => {
  // Process arrays from the backend's comma-separated strings
  const processProjectData = (project: ProjectBase) => {
    return {
      ...project,
      // Convert arrays to comma-separated strings for the form
      business_goals: project.business_goals || [],
      target_users: project.target_users || '',
      domain: project.domain || '',
    };
  };

  return (
    <ProjectSection
      title="Project Details"
      description="Update the basic information about your project"
      sectionId={sectionId}
      isExpanded={isExpanded}
      onToggle={onToggle}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      isLoading={isLoading}
      markdown={markdownService.generateProjectBasicsMarkdown(project)}
      markdownFileName={markdownService.generateFileName(project.name, 'basics')}
      editContent={
        <ProjectBasicsForm initialData={processProjectData(project)} onSuccess={onSuccess} />
      }
      previewContent={<ProjectBasicsPreview data={project} isLoading={isLoading} />}
    />
  );
};

export default ProjectBasicsSection;
