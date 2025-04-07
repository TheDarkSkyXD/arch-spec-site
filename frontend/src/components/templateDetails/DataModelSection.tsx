import React from 'react';
import { DataModel } from '../../types/templates';
import CollapsibleSection from './CollapsibleSection';

interface DataModelSectionProps {
  dataModel: DataModel;
  isOpen: boolean;
  onToggle: () => void;
}

const DataModelSection: React.FC<DataModelSectionProps> = ({ dataModel, isOpen, onToggle }) => {
  return (
    <CollapsibleSection title="Data Model" isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-6">
        {/* Entities */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">Entities</h4>
          {dataModel.entities && dataModel.entities.length > 0 ? (
            <div className="space-y-4">
              {dataModel.entities.map((entity, index) => (
                <div key={index} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/30">
                  <h5 className="mb-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                    {entity.name}
                  </h5>

                  {entity.description && (
                    <p className="mb-2 text-xs text-slate-600 dark:text-slate-400">
                      {entity.description}
                    </p>
                  )}

                  <div className="mt-2">
                    <div className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      Fields:
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-600/30">
                            <th className="px-2 py-1 text-left font-medium text-slate-700 dark:text-slate-300">
                              Name
                            </th>
                            <th className="px-2 py-1 text-left font-medium text-slate-700 dark:text-slate-300">
                              Type
                            </th>
                            <th className="px-2 py-1 text-left font-medium text-slate-700 dark:text-slate-300">
                              Attributes
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {entity.fields.map((field, fieldIndex) => (
                            <tr
                              key={fieldIndex}
                              className="border-t border-slate-200 dark:border-slate-700"
                            >
                              <td className="px-2 py-1.5 text-slate-800 dark:text-slate-200">
                                {field.name}
                                {field.primaryKey && <span className="ml-1 text-blue-500">🔑</span>}
                              </td>
                              <td className="px-2 py-1.5 text-slate-600 dark:text-slate-300">
                                {field.type}
                              </td>
                              <td className="px-2 py-1.5 text-slate-600 dark:text-slate-400">
                                {[
                                  field.required && 'required',
                                  field.unique && 'unique',
                                  field.generated && 'generated',
                                  field.default !== undefined && `default: ${field.default}`,
                                ]
                                  .filter(Boolean)
                                  .join(', ')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No entities defined</p>
          )}
        </div>

        {/* Relationships */}
        {dataModel.relationships && dataModel.relationships.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Relationships
            </h4>
            <div className="space-y-2">
              {dataModel.relationships.map((relationship, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-700/30"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {relationship.from_entity}
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                      {relationship.type}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {relationship.to_entity}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    via field: <span className="font-mono">{relationship.field}</span>
                    {relationship.throughTable && (
                      <span className="ml-2">
                        through: <span className="font-mono">{relationship.throughTable}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
};

export default DataModelSection;
