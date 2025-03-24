import React from 'react';
import { SectionId, ViewMode } from '../../hooks/useSectionState';
import ProjectSection from './ProjectSection';
import PagesForm from '../forms/PagesForm';
import PagesPreview from '../previews/PagesPreview';
import { markdownService } from '../../services/markdown';
import { Pages } from '../../types/templates';

interface PagesSectionProps {
  pages: Pages | null;
  projectId?: string;
  projectName: string;
  sectionId: SectionId.PAGES;
  isExpanded: boolean;
  viewMode: ViewMode;
  isLoading: boolean;
  onToggle: (sectionId: SectionId) => void;
  onViewModeChange: (sectionId: SectionId, viewMode: ViewMode) => void;
  onSuccess: (updatedPages: Pages) => void;
}

const PagesSection: React.FC<PagesSectionProps> = ({
  pages,
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
      title="Pages"
      description="Define the pages and routing for your application"
      sectionId={sectionId}
      isExpanded={isExpanded}
      onToggle={onToggle}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      isLoading={isLoading}
      markdown={pages ? markdownService.generatePagesMarkdown(pages) : undefined}
      markdownFileName={markdownService.generateFileName(projectName, "pages")}
      editContent={
        <PagesForm
          initialData={pages || undefined}
          projectId={projectId}
          onSuccess={onSuccess}
        />
      }
      previewContent={
        <PagesPreview 
          data={pages} 
          projectName={projectName}
          isLoading={isLoading} 
        />
      }
    />
  );
};

export default PagesSection;