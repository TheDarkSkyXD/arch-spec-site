import React from 'react';
import { Features } from '../../types/templates';
import CollapsibleSection from './CollapsibleSection';

interface FeaturesSectionProps {
  features: Features;
  isOpen: boolean;
  onToggle: () => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features, isOpen, onToggle }) => {
  return (
    <CollapsibleSection title="Features" isOpen={isOpen} onToggle={onToggle}>
      {features?.coreModules && features.coreModules.length > 0 ? (
        <div className="space-y-4">
          {features.coreModules.map((feature, index) => (
            <div
              key={index}
              className={`rounded p-3 ${
                feature.enabled
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-slate-50 dark:bg-slate-700/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {feature.name}
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
                <div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      feature.enabled
                        ? 'bg-green-100 text-green-800 dark:bg-green-700/50 dark:text-green-100'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200'
                    }`}
                  >
                    {feature.enabled ? 'Enabled' : 'Optional'}
                  </span>
                </div>
              </div>

              {feature.providers && feature.providers.length > 0 && (
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-medium">Providers:</span> {feature.providers.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No features specified</p>
      )}
    </CollapsibleSection>
  );
};

export default FeaturesSection;
