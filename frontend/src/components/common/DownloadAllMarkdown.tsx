import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import Button from "../ui/Button";
import { useToast } from "../../contexts/ToastContext";
import { generateMarkdownZip } from "../../services/markdown/markdownZip";
import { ProjectBase } from "../../types/project";
import {
  ProjectTechStack,
  Requirements,
  Pages,
  DataModel,
  Api,
  ImplementationPrompts,
} from "../../types/templates";
import { FeaturesData } from "../../services/featuresService";
import { TestCasesData } from "../../services/testCasesService";

interface DownloadAllMarkdownProps {
  project: ProjectBase;
  techStack: ProjectTechStack | null;
  requirements: Requirements | null;
  features: FeaturesData | null;
  pages: Pages | null;
  dataModel: Partial<DataModel> | null;
  apiEndpoints: Api | null;
  testCases?: TestCasesData | null;
  implementationPrompts?: ImplementationPrompts | null;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
}

const DownloadAllMarkdown = ({
  project,
  techStack,
  requirements,
  features,
  pages,
  dataModel,
  apiEndpoints,
  testCases = null,
  implementationPrompts = null,
  className = "",
  variant = "default",
  size = "default",
}: DownloadAllMarkdownProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { showToast } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      console.log("Preparing to generate zip with data:", {
        project,
        techStack,
        requirements,
        features,
        pages,
        dataModel,
        apiEndpoints,
        testCases,
        implementationPrompts,
      });

      const zipBlob = await generateMarkdownZip(
        project,
        techStack,
        requirements,
        features,
        pages,
        dataModel,
        apiEndpoints,
        testCases,
        implementationPrompts
      );

      console.log(
        "Zip file created successfully, size:",
        zipBlob.size,
        "bytes"
      );

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;

      // Create a sanitized filename
      const sanitizedName = project.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");
      a.download = `${sanitizedName}-specification.zip`;

      document.body.appendChild(a);
      a.click();

      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast({
        title: "Downloaded!",
        description: `Project specification downloaded as ${sanitizedName}-specification.zip`,
        type: "success",
      });
    } catch (err) {
      console.error("Failed to download specification: ", err);

      showToast({
        title: "Error",
        description: "Failed to download project specification",
        type: "error",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant={variant}
      size={size}
      className={`flex items-center gap-1 ${className}`}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Download size={16} />
      )}
      <span>{isDownloading ? "Downloading..." : "Download All"}</span>
    </Button>
  );
};

export default DownloadAllMarkdown;
