import { FeaturesData } from "../../services/featuresService";
import Card from "../ui/Card";
import { markdownService } from "../../services/markdown";
import PreviewFactory from "./PreviewFactory";

interface FeaturesPreviewProps {
  data: Partial<FeaturesData> | null;
  projectName?: string;
  isLoading?: boolean;
}

const FeaturesPreview = ({
  data,
  projectName,
  isLoading = false,
}: FeaturesPreviewProps) => {
  if (isLoading) {
    return <PreviewFactory markdown="" fileName="" isLoading={true} />;
  }

  if (!data) {
    return (
      <Card className="p-6 text-slate-400 dark:text-slate-500 text-center italic">
        No features data available to preview
      </Card>
    );
  }

  // Generate markdown using the service
  const markdown = markdownService.generateFeaturesMarkdown(data);
  const fileName = markdownService.generateFileName(projectName, "features");

  return <PreviewFactory markdown={markdown} fileName={fileName} />;
};

export default FeaturesPreview;
