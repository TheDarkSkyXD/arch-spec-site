import React from 'react';
import { SectionId, ViewMode } from '../../hooks/useSectionState';
import ProjectSection from './ProjectSection';
import ApiEndpointsForm from '../forms/ApiEndpointsForm';
import ApiEndpointsPreview from '../previews/ApiEndpointsPreview';
import { markdownService } from '../../services/markdown';
import { Api } from '../../types/templates';

interface ApiEndpointsSectionProps {
  apiEndpoints: Api | null;
  projectId?: string;
  projectName: string;
  sectionId: SectionId.API_ENDPOINTS;
  isExpanded: boolean;
  viewMode: ViewMode;
  isLoading: boolean;
  onToggle: (sectionId: SectionId) => void;
  onViewModeChange: (sectionId: SectionId, viewMode: ViewMode) => void;
  onSuccess: (updatedApiEndpoints: Api) => void;
}

const ApiEndpointsSection: React.FC<ApiEndpointsSectionProps> = ({
  apiEndpoints,
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
      title="API Endpoints"
      description="Define the API endpoints for your application"
      sectionId={sectionId}
      isExpanded={isExpanded}
      onToggle={onToggle}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      isLoading={isLoading}
      markdown={
        apiEndpoints ? markdownService.generateApiEndpointsMarkdown(apiEndpoints) : undefined
      }
      markdownFileName={markdownService.generateFileName(projectName, 'api-endpoints')}
      editContent={
        <ApiEndpointsForm
          initialData={apiEndpoints || undefined}
          projectId={projectId}
          onSuccess={onSuccess}
        />
      }
      previewContent={
        <ApiEndpointsPreview data={apiEndpoints} projectName={projectName} isLoading={isLoading} />
      }
    />
  );
};

export default ApiEndpointsSection;
