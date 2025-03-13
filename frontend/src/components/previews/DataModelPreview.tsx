import { DataModel } from "../../types/templates";
import Card from "../ui/Card";
import { markdownService } from "../../services/markdown";
import PreviewFactory from "./PreviewFactory";

interface DataModelPreviewProps {
  data: Partial<DataModel> | null;
  projectName?: string;
  isLoading?: boolean;
}

const DataModelPreview = ({
  data,
  projectName,
  isLoading = false,
}: DataModelPreviewProps) => {
  if (isLoading) {
    return <PreviewFactory markdown="" fileName="" isLoading={true} />;
  }

  if (!data) {
    return (
      <Card className="p-6 text-slate-400 dark:text-slate-500 text-center italic">
        No data model available to preview
      </Card>
    );
  }

  // Generate markdown using the service
  const markdown = markdownService.generateDataModelMarkdown(data);
  const fileName = markdownService.generateFileName(projectName, "data-model");

  return <PreviewFactory markdown={markdown} fileName={fileName} />;
};

export default DataModelPreview;
