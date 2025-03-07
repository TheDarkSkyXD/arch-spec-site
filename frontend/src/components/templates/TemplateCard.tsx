import React from "react";
import { CheckCircle } from "lucide-react";
import { ProjectTemplate } from "../../types";

interface TemplateCardProps {
  template: ProjectTemplate;
  isSelected: boolean;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
}) => {
  // Get icon based on template type
  const getTemplateIcon = () => {
    if (template.techStack.frontend.framework === "React") {
      return "⚛️";
    } else if (template.techStack.frontend.framework === "Vue.js") {
      return "🟢";
    } else if (template.techStack.frontend.framework === "Angular") {
      return "🔴";
    } else {
      return "🧩";
    }
  };

  const getFeaturesText = () => {
    const enabledFeatures = template.features.coreModules
      .filter((feature) => feature.enabled)
      .map((feature) => feature.name);

    return (
      enabledFeatures.slice(0, 3).join(", ") +
      (enabledFeatures.length > 3
        ? `, +${enabledFeatures.length - 3} more`
        : "")
    );
  };

  return (
    <div
      className={`border rounded-lg p-5 cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? "border-primary-500 ring-2 ring-primary-100 bg-primary-50"
          : "border-slate-200 hover:border-primary-300"
      }`}
      onClick={onSelect}
    >
      <div className="h-32 bg-slate-100 rounded flex items-center justify-center mb-4 relative">
        <span className="text-5xl">{getTemplateIcon()}</span>
        {isSelected && (
          <div className="absolute top-2 right-2">
            <CheckCircle size={20} className="text-primary-600 fill-white" />
          </div>
        )}
      </div>

      <h3 className="font-medium text-slate-800">{template.name}</h3>
      <p className="text-sm text-slate-600 mt-1 line-clamp-2">
        {template.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
          {template.techStack.frontend.framework}
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
          {template.techStack.backend.type}
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
          {template.techStack.database.type}
        </span>
      </div>

      <div className="mt-3 text-xs text-slate-600">
        <span className="font-medium">Features:</span> {getFeaturesText()}
      </div>
    </div>
  );
};

export default TemplateCard;
