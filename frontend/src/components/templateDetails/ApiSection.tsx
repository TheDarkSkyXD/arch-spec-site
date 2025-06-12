import React from 'react';
import { Api } from '../../types/templates';
import CollapsibleSection from './CollapsibleSection';

interface ApiSectionProps {
  api: Api;
  isOpen: boolean;
  onToggle: () => void;
}

const ApiSection: React.FC<ApiSectionProps> = ({ api, isOpen, onToggle }) => {
  if (!api || !api.endpoints || api.endpoints.length === 0) {
    return null;
  }

  return (
    <CollapsibleSection title="API Endpoints" isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-4">
        {api.endpoints.map((endpoint, index) => (
          <div key={index} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex space-x-1">
                {endpoint.methods.map((method) => (
                  <span
                    key={method}
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      method === 'GET'
                        ? 'bg-green-100 text-green-800'
                        : method === 'POST'
                          ? 'bg-blue-100 text-blue-800'
                          : method === 'PUT'
                            ? 'bg-yellow-100 text-yellow-800'
                            : method === 'DELETE'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {method}
                  </span>
                ))}
              </div>
              <span className="font-medium">{endpoint.path}</span>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {endpoint.description}
            </p>

            {endpoint.auth && (
              <div className="mt-2 flex items-center text-xs text-slate-500 dark:text-slate-500">
                <span className="mr-2 font-medium">Auth Required</span>
                {endpoint.roles && endpoint.roles.length > 0 && (
                  <span>Roles: {endpoint.roles.join(', ')}</span>
                )}
              </div>
            )}

            {/* Additional API endpoint details */}
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <div className="mt-3">
                <div className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  Parameters:
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700/30">
                        <th className="px-2 py-1 text-left font-medium text-slate-700 dark:text-slate-300">
                          Name
                        </th>
                        <th className="px-2 py-1 text-left font-medium text-slate-700 dark:text-slate-300">
                          Type
                        </th>
                        <th className="px-2 py-1 text-left font-medium text-slate-700 dark:text-slate-300">
                          Required
                        </th>
                        <th className="px-2 py-1 text-left font-medium text-slate-700 dark:text-slate-300">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.parameters.map((param, paramIndex) => (
                        <tr
                          key={paramIndex}
                          className="border-t border-slate-200 dark:border-slate-700"
                        >
                          <td className="px-2 py-1 text-slate-800 dark:text-slate-200">
                            {param.name}
                          </td>
                          <td className="px-2 py-1 text-slate-600 dark:text-slate-400">
                            {param.type}
                          </td>
                          <td className="px-2 py-1">
                            {param.required ? (
                              <span className="text-green-600 dark:text-green-400">Yes</span>
                            ) : (
                              <span className="text-slate-500 dark:text-slate-500">No</span>
                            )}
                          </td>
                          <td className="px-2 py-1 text-slate-600 dark:text-slate-400">
                            {param.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {endpoint.responses && endpoint.responses.length > 0 && (
              <div className="mt-3">
                <div className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  Responses:
                </div>
                <div className="space-y-1">
                  {endpoint.responses.map((response, responseIndex) => (
                    <div key={responseIndex} className="flex text-xs">
                      <span
                        className={`w-12 rounded-sm px-1 py-0.5 text-center ${
                          response.status < 300
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : response.status < 400
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}
                      >
                        {response.status}
                      </span>
                      <span className="ml-2 text-slate-700 dark:text-slate-300">
                        {response.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
};

export default ApiSection;
