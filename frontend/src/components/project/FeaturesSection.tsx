import React from 'react';
import { SectionId, ViewMode } from '../../hooks/useSectionState';
import ProjectSection from './ProjectSection';
import FeaturesForm from '../forms/FeaturesForm';
import FeaturesPreview from '../previews/FeaturesPreview';
import { markdownService } from '../../services/markdown';
import { FeaturesData } from '../../services/featuresService';

interface FeaturesSectionProps {
  features: FeaturesData | null;
  projectId?: string;
  projectName: string;
  sectionId: SectionId.FEATURES;
  isExpanded: boolean;
  viewMode: ViewMode;
  isLoading: boolean;
  onToggle: (sectionId: SectionId) => void;
  onViewModeChange: (sectionId: SectionId, viewMode: ViewMode) => void;
  onSuccess: (updatedFeatures: FeaturesData) => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features,
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
      title="Features"
      description="Define the key features of your application"
      sectionId={sectionId}
      isExpanded={isExpanded}
      onToggle={onToggle}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      isLoading={isLoading}
      markdown={features ? markdownService.generateFeaturesMarkdown(features) : undefined}
      markdownFileName={markdownService.generateFileName(projectName, 'features')}
      editContent={
        <FeaturesForm
          initialData={features || undefined}
          projectId={projectId}
          onSuccess={onSuccess}
        />
      }
      previewContent={
        <FeaturesPreview data={features} projectName={projectName} isLoading={isLoading} />
      }
    />
  );
};

export default FeaturesSection;
