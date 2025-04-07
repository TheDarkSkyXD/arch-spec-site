import React from 'react';
import { SectionId, ViewMode } from '../../hooks/useSectionState';
import ProjectSection from './ProjectSection';
import TestCasesForm from '../forms/TestCasesForm';
import TestCasesPreview from '../previews/TestCasesPreview';
import { markdownService } from '../../services/markdown';
import { TestCasesData } from '../../services/testCasesService';

interface TestCasesSectionProps {
  testCases: TestCasesData | null;
  projectId?: string;
  projectName: string;
  sectionId: SectionId.TEST_CASES;
  isExpanded: boolean;
  viewMode: ViewMode;
  isLoading: boolean;
  onToggle: (sectionId: SectionId) => void;
  onViewModeChange: (sectionId: SectionId, viewMode: ViewMode) => void;
  onSuccess: (updatedTestCases: TestCasesData) => void;
}

const TestCasesSection: React.FC<TestCasesSectionProps> = ({
  testCases,
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
      title="Test Cases"
      description="Define test cases for your application"
      sectionId={sectionId}
      isExpanded={isExpanded}
      onToggle={onToggle}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      isLoading={isLoading}
      markdown={testCases ? markdownService.generateTestCasesMarkdown(testCases) : undefined}
      markdownFileName={markdownService.generateFileName(projectName, 'test-cases')}
      editContent={
        <TestCasesForm
          initialData={testCases || undefined}
          projectId={projectId}
          onSuccess={onSuccess}
        />
      }
      previewContent={
        <TestCasesPreview data={testCases} projectName={projectName} isLoading={isLoading} />
      }
    />
  );
};

export default TestCasesSection;
