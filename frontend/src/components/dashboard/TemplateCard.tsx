import { ProjectTemplate } from "../../types/project";
import { ArrowRight, Clock, Star } from "lucide-react";

interface TemplateCardProps {
  template: ProjectTemplate;
  onSelect: (templateId: string) => void;
}

const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
  // Get template metadata safely
  const getTemplateRating = () => {
    if (template.metadata && typeof template.metadata === "object") {
      // @ts-expect-error: Safely check if rating exists in metadata
      return template.metadata.rating || 4.5;
    }
    return 4.5;
  };

  const getTemplateDate = () => {
    if (template.metadata && typeof template.metadata === "object") {
      // @ts-expect-error: Safely check if created exists in metadata
      return template.metadata.created || "recently";
    }
    return "recently";
  };

  const getTemplateComplexity = () => {
    if (template.metadata && typeof template.metadata === "object") {
      // @ts-ignore: Safely check if complexity exists in metadata
      return template.metadata.complexity || "Intermediate";
    }
    return "Intermediate";
  };

  return (
    <div className="card overflow-hidden transition-all hover:shadow-xl group relative">
      <div
        className="h-48 bg-gradient-to-br from-primary-600 to-primary-700 relative"
        style={{
          backgroundImage: template.thumbnail
            ? `url(${template.thumbnail})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!template.thumbnail && (
          <div className="absolute inset-0 bg-gradient-mesh-dark opacity-40"></div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-lg font-semibold text-white">{template.name}</h3>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-slate-600 mb-3">{template.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {template.tags.map((tag, index) => (
            <span key={index} className="tag text-xs">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>Added {getTemplateDate()}</span>
          </div>
          <div className="text-xs">{getTemplateComplexity()}</div>
        </div>

        <button
          onClick={() => onSelect(template.id)}
          className="btn bg-gradient-to-r from-primary-600 to-primary-700 text-white w-full group-hover:shadow-lg group-hover:shadow-primary-500/20 transition-all"
        >
          <span>Use This Template</span>
          <ArrowRight
            size={16}
            className="ml-2 transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
