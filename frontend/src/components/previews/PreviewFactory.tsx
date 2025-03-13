import ReactMarkdown from "react-markdown";
import Card from "../ui/Card";
import MarkdownActions from "../common/MarkdownActions";

interface PreviewFactoryProps {
  markdown: string;
  fileName: string;
  isLoading?: boolean;
}

/**
 * A reusable preview component factory that renders markdown content with copy and download buttons
 */
const PreviewFactory = ({
  markdown,
  fileName,
  isLoading = false,
}: PreviewFactoryProps) => {
  if (isLoading) {
    return (
      <Card className="p-6 text-slate-400 dark:text-slate-500 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (!markdown) {
    return (
      <Card className="p-6 text-slate-400 dark:text-slate-500 text-center italic">
        No data available to preview
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <MarkdownActions markdown={markdown} fileName={fileName} />
      </div>
      <div className="prose dark:prose-invert prose-slate max-w-none">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default PreviewFactory;
