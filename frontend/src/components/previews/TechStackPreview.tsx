import { ProjectTechStack } from "../../types/templates";
import Card from "../ui/Card";
import { markdownService } from "../../services/markdown";
import PreviewFactory from "./PreviewFactory";

interface TechStackPreviewProps {
  data: Partial<ProjectTechStack> | null;
  projectName?: string;
  isLoading?: boolean;
}

const TechStackPreview = ({
  data,
  projectName,
  isLoading = false,
}: TechStackPreviewProps) => {
  if (isLoading) {
    return <PreviewFactory markdown="" fileName="" isLoading={true} />;
  }

  if (!data) {
    return (
      <Card className="p-6 text-slate-400 dark:text-slate-500 text-center italic">
        No tech stack data available to preview
      </Card>
    );
  }

  // Generate markdown using the service
  const markdown = markdownService.generateTechStackMarkdown(data);
  const fileName = markdownService.generateFileName(projectName, "tech-stack");

  return <PreviewFactory markdown={markdown} fileName={fileName} />;
};

export default TechStackPreview;
