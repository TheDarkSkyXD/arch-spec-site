import { useState } from "react";
import { Download, Loader2, Wand2, Lock } from "lucide-react";
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
  UIDesign,
} from "../../types/templates";
import { FeaturesData } from "../../services/featuresService";
import { TestCasesData } from "../../services/testCasesService";
import { useSubscription } from "../../contexts/SubscriptionContext";
import { useUserProfile } from "../../hooks/useUserProfile";
import AIInstructionsModal from "../ui/AIInstructionsModal";

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
  uiDesign?: UIDesign | null;
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
  uiDesign = null,
  className = "",
  variant = "default",
  size = "default",
}: DownloadAllMarkdownProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { showToast } = useToast();
  const { hasAIFeatures } = useSubscription();
  const { aiCreditsRemaining } = useUserProfile();

  // State for AI modal
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [generateAIReadme, setGenerateAIReadme] = useState(true);
  const [generateAIRules, setGenerateAIRules] = useState(true);

  const handleDownloadClick = () => {
    // Check if user has AI features before showing modal
    if (hasAIFeatures && aiCreditsRemaining > 0) {
      setIsAIModalOpen(true);
    } else {
      // Just proceed with regular download if user doesn't have AI features
      handleDownload();
    }
  };

  const handleModalConfirm = async (additionalInstructions?: string) => {
    await handleDownload(
      additionalInstructions,
      generateAIReadme,
      generateAIRules
    );
  };

  const handleDownload = async (
    additionalInstructions?: string,
    useAIReadme = false,
    useAIRules = false
  ) => {
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
        uiDesign,
        useAIReadme,
        useAIRules,
        additionalInstructions,
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
        implementationPrompts,
        uiDesign,
        useAIReadme,
        useAIRules,
        additionalInstructions
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
    <>
      <AIInstructionsModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onConfirm={handleModalConfirm}
        title="AI-Enhanced Documentation Options"
        description="Choose which AI-enhanced documentation to include in your download. This will use AI credits."
        confirmText="Download with AI Enhancements"
        defaultInstructions=""
        additionalOptions={
          <div className="space-y-4 mb-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="generate-readme"
                checked={generateAIReadme}
                onChange={(e) => setGenerateAIReadme(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="generate-readme" className="text-sm">
                Generate AI-enhanced README.md
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="generate-ai-rules"
                checked={generateAIRules}
                onChange={(e) => setGenerateAIRules(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="generate-ai-rules" className="text-sm">
                Generate AI assistant rules files (.cursorrules, .windsurfrules,
                and CLAUDE.md)
              </label>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Note: Each option will consume AI credits when enabled
            </div>
          </div>
        }
      />

      <Button
        onClick={handleDownloadClick}
        variant={variant}
        size={size}
        className={`flex items-center gap-1 ${className}`}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : hasAIFeatures && aiCreditsRemaining > 0 ? (
          <Wand2 size={16} />
        ) : (
          <Download size={16} />
        )}
        <span>
          {isDownloading
            ? "Preparing download..."
            : hasAIFeatures && aiCreditsRemaining > 0
            ? "Download with AI"
            : "Download All"}
        </span>
        {!hasAIFeatures && (
          <span className="ml-1">
            <Lock size={12} />
          </span>
        )}
      </Button>
    </>
  );
};

export default DownloadAllMarkdown;
