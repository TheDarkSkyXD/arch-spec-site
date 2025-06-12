import React, { ReactNode } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { SectionId, ViewMode } from '../../hooks/useSectionState';
import Card from '../ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import MarkdownActions from '../common/MarkdownActions';

interface ProjectSectionProps {
  title: string;
  description: string;
  sectionId: SectionId;
  isExpanded: boolean;
  onToggle: (sectionId: SectionId) => void;
  viewMode: ViewMode;
  onViewModeChange: (sectionId: SectionId, viewMode: ViewMode) => void;
  isLoading?: boolean;
  markdown?: string;
  markdownFileName?: string;
  children?: ReactNode;
  editContent: ReactNode;
  previewContent: ReactNode;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({
  title,
  description,
  sectionId,
  isExpanded,
  onToggle,
  viewMode,
  onViewModeChange,
  isLoading = false,
  markdown,
  markdownFileName,
  editContent,
  previewContent,
}) => {
  // Reusable section header component
  const SectionHeader = () => (
    <div
      className="flex cursor-pointer items-center justify-between border-b border-slate-100 p-4 dark:border-slate-700"
      onClick={() => onToggle(sectionId)}
    >
      <div>
        <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="text-slate-400 dark:text-slate-500">
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <SectionHeader />
      {isExpanded && (
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary-600" />
              <span className="text-slate-600 dark:text-slate-300">Loading data...</span>
            </div>
          ) : (
            <Tabs
              value={viewMode}
              onValueChange={(value) => onViewModeChange(sectionId, value as ViewMode)}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value={ViewMode.EDIT}>Edit</TabsTrigger>
                <TabsTrigger value={ViewMode.PREVIEW}>Preview</TabsTrigger>
              </TabsList>

              <TabsContent value={ViewMode.EDIT}>
                {markdown && markdownFileName && (
                  <div className="mb-4 flex justify-end">
                    <MarkdownActions markdown={markdown} fileName={markdownFileName} />
                  </div>
                )}
                {editContent}
              </TabsContent>

              <TabsContent
                value={ViewMode.PREVIEW}
                className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50"
              >
                {previewContent}
              </TabsContent>
            </Tabs>
          )}
        </div>
      )}
    </Card>
  );
};

export default ProjectSection;
