import { ChevronDown, ChevronUp, Eye, Pencil } from "lucide-react";
import { UIDesign } from "../../types/templates";
import { SectionId, ViewMode } from "../../hooks/useSectionState";
import Card from "../ui/Card";
import UIDesignForm from "../forms/UIDesignForm";
import UIDesignPreview from "../previews/UIDesignMarkdownView";

interface UIDesignSectionProps {
  uiDesign: UIDesign | null;
  projectId?: string;
  projectName?: string;
  sectionId: SectionId;
  isExpanded: boolean;
  viewMode: ViewMode;
  isLoading: boolean;
  onToggle: (sectionId: SectionId) => void;
  onViewModeChange: (sectionId: SectionId, viewMode: ViewMode) => void;
  onSuccess?: (data: UIDesign) => void;
}

export default function UIDesignSection({
  uiDesign,
  projectId,
  projectName,
  sectionId,
  isExpanded,
  viewMode,
  isLoading,
  onToggle,
  onViewModeChange,
  onSuccess,
}: UIDesignSectionProps) {
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div
        className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center cursor-pointer"
        onClick={() => onToggle(sectionId)}
      >
        <div>
          <h2 className="text-lg font-medium text-slate-800 dark:text-slate-100">
            UI Design
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Define the visual design system for your application
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* View/Edit Mode Toggle */}
          {isExpanded && (
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-1 mr-2">
              <button
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  viewMode === "view"
                    ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onViewModeChange(sectionId, "view");
                }}
              >
                <Eye className="h-3.5 w-3.5 inline-block mr-1" />
                View
              </button>
              <button
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  viewMode === "edit"
                    ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onViewModeChange(sectionId, "edit");
                }}
              >
                <Pencil className="h-3.5 w-3.5 inline-block mr-1" />
                Edit
              </button>
            </div>
          )}

          {/* Expand/Collapse Button */}
          <div className="text-slate-400 dark:text-slate-500">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          {viewMode === "view" ? (
            <UIDesignPreview
              data={uiDesign}
              projectName={projectName}
              isLoading={isLoading}
            />
          ) : (
            <UIDesignForm
              initialData={uiDesign || undefined}
              projectId={projectId}
              projectName={projectName}
              onSuccess={onSuccess}
            />
          )}
        </div>
      )}
    </Card>
  );
}
