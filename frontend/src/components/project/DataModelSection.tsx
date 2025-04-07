import React from 'react';
import { SectionId, ViewMode } from '../../hooks/useSectionState';
import ProjectSection from './ProjectSection';
import DataModelForm from '../forms/DataModelForm';
import DataModelPreview from '../previews/DataModelPreview';
import { markdownService } from '../../services/markdown';
import { DataModel } from '../../types/templates';

interface DataModelSectionProps {
  dataModel: Partial<DataModel> | null;
  projectId?: string;
  projectName: string;
  sectionId: SectionId.DATA_MODEL;
  isExpanded: boolean;
  viewMode: ViewMode;
  isLoading: boolean;
  onToggle: (sectionId: SectionId) => void;
  onViewModeChange: (sectionId: SectionId, viewMode: ViewMode) => void;
  onSuccess: (updatedDataModel: Partial<DataModel>) => void;
}

const DataModelSection: React.FC<DataModelSectionProps> = ({
  dataModel,
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
      title="Data Model"
      description="Define the data models and database schema for your application"
      sectionId={sectionId}
      isExpanded={isExpanded}
      onToggle={onToggle}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      isLoading={isLoading}
      markdown={
        dataModel ? markdownService.generateDataModelMarkdown(dataModel as DataModel) : undefined
      }
      markdownFileName={markdownService.generateFileName(projectName, 'data-model')}
      editContent={
        <DataModelForm
          initialData={dataModel || undefined}
          projectId={projectId}
          onSuccess={onSuccess}
        />
      }
      previewContent={
        <DataModelPreview
          data={dataModel as DataModel | null}
          projectName={projectName}
          isLoading={isLoading}
        />
      }
    />
  );
};

export default DataModelSection;
