import { Filter, Search } from 'lucide-react';
import Button from '../../../ui/Button';
import { Checkbox } from '../../../ui/checkbox';
import Input from '../../../ui/Input';

interface ApiEndpointHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedMethods: string[];
  onMethodFilterChange: (method: string) => void;
  showAuthOnly: boolean;
  onAuthFilterChange: (value: boolean) => void;
  onAddNewClick: () => void;
}

export const ApiEndpointHeader = ({
  searchTerm,
  onSearchChange,
  selectedMethods,
  onMethodFilterChange,
  showAuthOnly,
  onAuthFilterChange,
  onAddNewClick,
}: ApiEndpointHeaderProps) => {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  return (
    <div className="sticky top-0 z-10 mb-6 space-y-4 bg-white p-4 shadow-sm dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">API Endpoints</h2>
        <Button type="button" onClick={onAddNewClick}>
          Add New Endpoint
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search endpoints..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Filter:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {methods.map((method) => (
              <button
                key={method}
                onClick={() => onMethodFilterChange(method)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedMethods.includes(method)
                    ? method === 'GET'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : method === 'POST'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : method === 'PUT'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : method === 'DELETE'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="auth-filter"
              checked={showAuthOnly}
              onCheckedChange={(checked) => onAuthFilterChange(checked as boolean)}
            />
            <label
              htmlFor="auth-filter"
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              Protected Only
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}; 