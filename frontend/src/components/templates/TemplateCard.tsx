import React from 'react';
import { CheckCircle } from 'lucide-react';
import { ProjectTemplate } from '../../types';

interface TemplateCardProps {
  template: ProjectTemplate;
  isSelected: boolean;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isSelected, onSelect }) => {
  // Get icon based on template type
  const getTemplateIcon = () => {
    if (template.techStack.frontend.framework === 'React') {
      return '⚛️';
    } else if (template.techStack.frontend.framework === 'Vue.js') {
      return '🟢';
    } else if (template.techStack.frontend.framework === 'Angular') {
      return '🔴';
    } else {
      return '🧩';
    }
  };

  const getFeaturesText = () => {
    const enabledFeatures = template.features.coreModules
      .filter((feature) => feature.enabled)
      .map((feature) => feature.name);

    return (
      enabledFeatures.slice(0, 3).join(', ') +
      (enabledFeatures.length > 3 ? `, +${enabledFeatures.length - 3} more` : '')
    );
  };

  return (
    <div
      className={`cursor-pointer rounded-lg border p-5 transition-all hover:shadow-md ${
        isSelected
          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-100'
          : 'border-slate-200 hover:border-primary-300'
      }`}
      onClick={onSelect}
    >
      <div className="relative mb-4 flex h-32 items-center justify-center rounded bg-slate-100">
        <span className="text-5xl">{getTemplateIcon()}</span>
        {isSelected && (
          <div className="absolute right-2 top-2">
            <CheckCircle size={20} className="fill-white text-primary-600" />
          </div>
        )}
      </div>

      <h3 className="font-medium text-slate-800">{template.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{template.description}</p>

      <div className="mt-3 flex flex-wrap gap-1">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
          {template.techStack.frontend.framework}
        </span>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
          {template.techStack.backend.type}
        </span>
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800">
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
