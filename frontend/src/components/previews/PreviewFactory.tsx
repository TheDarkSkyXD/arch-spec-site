import ReactMarkdown from 'react-markdown';
import Card from '../ui/Card';
import MarkdownActions from '../common/MarkdownActions';

interface PreviewFactoryProps {
  markdown: string;
  fileName: string;
  isLoading?: boolean;
}

/**
 * A reusable preview component factory that renders markdown content with copy and download buttons
 */
const PreviewFactory = ({ markdown, fileName, isLoading = false }: PreviewFactoryProps) => {
  if (isLoading) {
    return (
      <Card className="p-6 text-center text-slate-400 dark:text-slate-500">
        <div className="flex animate-pulse flex-col items-center">
          <div className="mb-2 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
          <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </Card>
    );
  }

  if (!markdown) {
    return (
      <Card className="p-6 text-center italic text-slate-400 dark:text-slate-500">
        No data available to preview
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <MarkdownActions markdown={markdown} fileName={fileName} />
      </div>
      <div className="prose prose-slate max-w-none dark:prose-invert">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default PreviewFactory;
