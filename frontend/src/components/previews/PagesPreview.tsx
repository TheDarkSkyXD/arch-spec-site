import { Pages } from "../../types/templates";
import Card from "../ui/Card";
import { markdownService } from "../../services/markdown";
import PreviewFactory from "./PreviewFactory";

interface PagesPreviewProps {
  data: Pages | null;
  projectName?: string;
  isLoading?: boolean;
}

const PagesPreview = ({
  data,
  projectName,
  isLoading = false,
}: PagesPreviewProps) => {
  if (isLoading) {
    return <PreviewFactory markdown="" fileName="" isLoading={true} />;
  }

  if (!data) {
    return (
      <Card className="p-6 text-slate-400 dark:text-slate-500 text-center italic">
        No pages data available to preview
      </Card>
    );
  }

  // Generate markdown using the service
  const markdown = markdownService.generatePagesMarkdown(data);
  const fileName = markdownService.generateFileName(projectName, "pages");

  return <PreviewFactory markdown={markdown} fileName={fileName} />;
};

export default PagesPreview;
