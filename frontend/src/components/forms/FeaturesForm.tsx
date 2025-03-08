import { useState } from "react";
import { ToggleLeft, ToggleRight, Info } from "lucide-react";

interface FeatureModule {
  name: string;
  description: string;
  enabled: boolean;
  optional: boolean;
  providers: string[];
}

interface FeaturesFormProps {
  initialData: {
    core_modules: FeatureModule[];
  };
  onSubmit: (data: { core_modules: FeatureModule[] }) => void;
  onBack?: () => void;
}

export default function FeaturesForm({
  initialData,
  onSubmit,
  onBack,
}: FeaturesFormProps) {
  const [coreModules, setCoreModules] = useState<FeatureModule[]>(
    initialData.core_modules || []
  );

  const handleToggleFeature = (index: number) => {
    if (!coreModules[index].optional) return; // Can't disable non-optional features

    const updatedModules = [...coreModules];
    updatedModules[index] = {
      ...updatedModules[index],
      enabled: !updatedModules[index].enabled,
    };
    setCoreModules(updatedModules);
  };

  const handleProviderChange = (moduleIndex: number, provider: string) => {
    const updatedModules = [...coreModules];
    updatedModules[moduleIndex] = {
      ...updatedModules[moduleIndex],
      providers: [provider], // Replace existing providers with the selected one
    };
    setCoreModules(updatedModules);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ core_modules: coreModules });
  };

  return (
    <form id="features-form" onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Features & Modules
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Select which features and modules to include in your project.
          </p>
        </div>

        {coreModules.length === 0 ? (
          <div className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
            <p className="text-slate-600 dark:text-slate-400">
              No features available for this template.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {coreModules.map((module, index) => (
              <div
                key={index}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-slate-100">
                      {module.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {module.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleFeature(index)}
                    disabled={!module.optional}
                    className={`p-1 ${
                      !module.optional
                        ? "cursor-not-allowed text-slate-400 dark:text-slate-600"
                        : "cursor-pointer"
                    }`}
                    title={
                      module.optional
                        ? "Toggle feature"
                        : "This feature is required"
                    }
                  >
                    {module.enabled ? (
                      <ToggleRight size={24} className="text-primary-600" />
                    ) : (
                      <ToggleLeft
                        size={24}
                        className="text-slate-400 dark:text-slate-500"
                      />
                    )}
                  </button>
                </div>

                {!module.optional && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <Info size={12} />
                    <span>This feature is required for this project type</span>
                  </div>
                )}

                {module.enabled && module.providers.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Provider
                    </label>
                    <select
                      value={module.providers[0] || ""}
                      onChange={(e) =>
                        handleProviderChange(index, e.target.value)
                      }
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      <option value="">Select provider...</option>
                      <option value="aws">AWS</option>
                      <option value="azure">Azure</option>
                      <option value="gcp">Google Cloud</option>
                      <option value="firebase">Firebase</option>
                      <option value="custom">Custom Implementation</option>
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
