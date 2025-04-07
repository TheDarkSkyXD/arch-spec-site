import { ProjectBase } from '../../types/project';
import Card from '../ui/Card';
import { markdownService } from '../../services/markdown';
import PreviewFactory from './PreviewFactory';

interface ProjectBasicsPreviewProps {
  data: Partial<ProjectBase> | null;
  isLoading?: boolean;
}

const ProjectBasicsPreview = ({ data, isLoading = false }: ProjectBasicsPreviewProps) => {
  if (isLoading) {
    return <PreviewFactory markdown="" fileName="" isLoading={true} />;
  }

  if (!data) {
    return (
      <Card className="p-6 text-center italic text-slate-400 dark:text-slate-500">
        No project data available to preview
      </Card>
    );
  }

  // Generate markdown using the service
  const markdown = markdownService.generateProjectBasicsMarkdown(data);
  const fileName = markdownService.generateFileName(data.name, 'basics');

  return <PreviewFactory markdown={markdown} fileName={fileName} />;
};

export default ProjectBasicsPreview;
