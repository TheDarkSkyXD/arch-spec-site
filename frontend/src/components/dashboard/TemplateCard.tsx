import { ProjectTemplate } from "../../types/templates";
import { ArrowRight } from "lucide-react";

interface TemplateCardProps {
  template: ProjectTemplate;
  onSelect: (templateId: string) => void;
}

const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
  return (
    <div className="card overflow-hidden transition-all hover:shadow-xl group relative">
      <div
        className="h-48 bg-gradient-to-br from-primary-600 to-primary-700 relative"
      >
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-lg font-semibold text-white">{template.name}</h3>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-slate-600 mb-3">{template.description}</p>
        <button
          onClick={() => onSelect(template.id || "")}
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
