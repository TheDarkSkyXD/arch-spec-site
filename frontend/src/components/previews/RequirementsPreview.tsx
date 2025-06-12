import { Requirements } from '../../types/templates';
import Card from '../ui/Card';
import { markdownService } from '../../services/markdown';
import PreviewFactory from './PreviewFactory';

interface RequirementsPreviewProps {
  data: Partial<Requirements> | null;
  projectName: string;
  isLoading: boolean;
}

const RequirementsPreview = ({ data, projectName, isLoading }: RequirementsPreviewProps) => {
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="mb-2 h-4 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="mb-2 h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="mb-6 h-4 w-4/6 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="mb-3 h-6 w-2/4 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="mb-2 h-4 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="mb-2 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center">
        <h3 className="mb-2 text-lg font-medium text-slate-700 dark:text-slate-300">
          No Requirements Data Available
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Fill out the requirements form to generate a preview.
        </p>
      </Card>
    );
  }

  const markdown = markdownService.generateRequirementsMarkdown(data);
  const fileName = markdownService.generateFileName(projectName, 'requirements');

  return <PreviewFactory markdown={markdown} fileName={fileName} />;
};

export default RequirementsPreview;
