import { ProjectTemplate } from '../../types/templates';
import { ArrowRight } from 'lucide-react';

interface TemplateCardProps {
  template: ProjectTemplate;
  onSelect: (templateId: string) => void;
}

const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
  return (
    <div className="card group relative overflow-hidden transition-all hover:shadow-xl">
      <div className="relative h-48 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-lg font-semibold text-white">{template.name}</h3>
        </div>
      </div>

      <div className="p-5">
        <p className="mb-3 text-sm text-slate-600">{template.description}</p>
        <button
          onClick={() => onSelect(template.id || '')}
          className="btn w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white transition-all group-hover:shadow-lg group-hover:shadow-primary-500/20"
        >
          <span>Use This Template</span>
          <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
