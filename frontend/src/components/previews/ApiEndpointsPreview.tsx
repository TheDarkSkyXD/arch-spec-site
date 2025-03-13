import { Api } from "../../types/templates";
import Card from "../ui/Card";
import { markdownService } from "../../services/markdown";
import PreviewFactory from "./PreviewFactory";

interface ApiEndpointsPreviewProps {
  data: Api | null;
  projectName: string;
  isLoading: boolean;
}

const ApiEndpointsPreview = ({
  data,
  projectName,
  isLoading,
}: ApiEndpointsPreviewProps) => {
  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6 mb-6"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-2/4 mb-3"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="text-center p-8">
        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
          No API Endpoints Data Available
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Fill out the API endpoints form to generate a preview.
        </p>
      </Card>
    );
  }

  const markdown = markdownService.generateApiEndpointsMarkdown(data);
  const fileName = markdownService.generateFileName(
    projectName,
    "api-endpoints"
  );

  return <PreviewFactory markdown={markdown} fileName={fileName} />;
};

export default ApiEndpointsPreview;
