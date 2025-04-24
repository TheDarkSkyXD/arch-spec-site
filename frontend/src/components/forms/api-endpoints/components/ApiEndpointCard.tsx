import { ChevronDown, ChevronUp, Edit, Lock, Trash2 } from 'lucide-react';
import Button from '../../../ui/Button';
import Card from '../../../ui/Card';
import { ApiEndpoint } from '../types';

interface ApiEndpointCardProps {
  endpoint: ApiEndpoint;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

export const ApiEndpointCard = ({
  endpoint,
  isExpanded,
  onToggleExpand,
  onEdit,
  onRemove,
}: ApiEndpointCardProps) => {
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'POST':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-700">
      <div
        className="flex cursor-pointer items-center justify-between bg-slate-50 p-3 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-1">
            {endpoint.methods.map((method) => (
              <span
                key={method}
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getMethodColor(
                  method
                )}`}
              >
                {method}
              </span>
            ))}
          </div>
          <span className="font-medium text-slate-800 dark:text-slate-200">{endpoint.path}</span>
          {endpoint.auth && (
            <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <Lock size={12} className="mr-1" />
              Protected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-slate-400 hover:text-blue-500 dark:text-slate-500 dark:hover:text-blue-400"
          >
            <Edit size={16} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
          >
            <Trash2 size={16} />
          </Button>
          {isExpanded ? (
            <ChevronUp size={16} className="text-slate-500 dark:text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-500 dark:text-slate-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3">
            <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
              Description
            </label>
            <p className="text-sm text-slate-700 dark:text-slate-300">{endpoint.description}</p>
          </div>

          {endpoint.roles && endpoint.roles.length > 0 && (
            <div>
              <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">
                Required Roles
              </label>
              <div className="mt-1 flex flex-wrap gap-1">
                {endpoint.roles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}; 