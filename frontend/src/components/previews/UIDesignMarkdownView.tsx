import { UIDesign } from "../../types/templates";
import Card from "../ui/Card";
import { markdownService } from "../../services/markdown";
import PreviewFactory from "./PreviewFactory";

interface UIDesignPreviewProps {
  data: UIDesign | null;
  projectName?: string;
  isLoading?: boolean;
}

const UIDesignPreview = ({
  data,
  projectName,
  isLoading = false,
}: UIDesignPreviewProps) => {
  if (isLoading) {
    return <PreviewFactory markdown="" fileName="" isLoading={true} />;
  }

  if (!data) {
    return (
      <Card className="p-6 text-slate-400 dark:text-slate-500 text-center italic">
        No UI design data available to preview
      </Card>
    );
  }

  // Generate markdown using the service
  const markdown = markdownService.generateUIDesignMarkdown(data);
  const fileName = markdownService.generateFileName(projectName, "ui-design");

  return <PreviewFactory markdown={markdown} fileName={fileName} />;
};

export default UIDesignPreview;
