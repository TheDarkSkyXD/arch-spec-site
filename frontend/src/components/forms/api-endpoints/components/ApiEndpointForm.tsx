import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import Button from '../../../ui/Button';
import Card from '../../../ui/Card';
import { Checkbox } from '../../../ui/checkbox';
import Input from '../../../ui/Input';
import { Textarea } from '../../../ui/textarea';
import { ApiEndpoint, ApiEndpointErrors, ApiEndpointFormData } from '../types';

interface ApiEndpointFormProps {
  endpoint?: ApiEndpoint;
  onSubmit: (endpoint: ApiEndpointFormData) => void;
  onCancel: () => void;
  validateEndpoint: (endpoint: ApiEndpointFormData) => ApiEndpointErrors;
}

export const ApiEndpointForm = ({
  endpoint,
  onSubmit,
  onCancel,
  validateEndpoint,
}: ApiEndpointFormProps) => {
  const [formData, setFormData] = useState<ApiEndpointFormData>({
    path: endpoint?.path || '',
    description: endpoint?.description || '',
    methods: endpoint?.methods || ['GET'],
    auth: endpoint?.auth || false,
    roles: endpoint?.roles || [],
  });

  const [newRole, setNewRole] = useState('');
  const [errors, setErrors] = useState<ApiEndpointErrors>({});

  const handleMethodToggle = (method: string) => {
    const methods = [...formData.methods];
    if (methods.includes(method)) {
      setFormData({
        ...formData,
        methods: methods.filter((m) => m !== method),
      });
    } else {
      setFormData({
        ...formData,
        methods: [...methods, method],
      });
    }

    // Clear any method-related error when methods change
    if (errors.methods) {
      setErrors({
        ...errors,
        methods: '',
      });
    }
  };

  const handleAuthToggle = () => {
    setFormData({
      ...formData,
      auth: !formData.auth,
      roles: !formData.auth ? formData.roles : [],
    });
  };

  const handleAddRole = () => {
    if (!newRole.trim() || formData.roles?.includes(newRole.trim())) return;

    setFormData({
      ...formData,
      roles: [...formData.roles, newRole.trim()],
    });
    setNewRole('');
  };

  const handleRemoveRole = (role: string) => {
    setFormData({
      ...formData,
      roles: formData.roles.filter((r) => r !== role),
    });
  };

  const handleSubmit = () => {
    const validationErrors = validateEndpoint(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-lg font-medium text-slate-800 dark:text-slate-200">
        {endpoint ? 'Edit Endpoint' : 'Add New Endpoint'}
      </h3>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="path"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Path <span className="text-red-500">*</span>
          </label>
          <Input
            id="path"
            type="text"
            value={formData.path}
            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
            placeholder="/api/users"
            error={errors.path}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What this endpoint does..."
            error={errors.description}
            rows={2}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            HTTP Methods <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => handleMethodToggle(method)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  formData.methods.includes(method)
                    ? method === 'GET'
                      ? 'border-2 border-green-300 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : method === 'POST'
                        ? 'border-2 border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        : method === 'PUT'
                          ? 'border-2 border-yellow-300 bg-yellow-100 text-yellow-800 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : method === 'DELETE'
                            ? 'border-2 border-red-300 bg-red-100 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : 'border-2 border-purple-300 bg-purple-100 text-purple-800 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
          {errors.methods && <p className="mt-1 text-sm text-red-500">{errors.methods}</p>}
        </div>

        <div className="mt-3">
          <div className="mb-2 flex items-center">
            <Checkbox id="auth" checked={formData.auth} onCheckedChange={handleAuthToggle} />
            <label
              htmlFor="auth"
              className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
            >
              Requires Authentication
            </label>
          </div>

          {formData.auth && (
            <div className="mt-3 pl-6">
              <div className="mb-2">
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Required Roles
                </label>
                <div className="mb-2 flex flex-wrap gap-1">
                  {formData.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(role)}
                        className="ml-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="Add a role (e.g. admin)"
                    className="flex-1 text-sm"
                  />
                  <Button
                    type="button"
                    onClick={handleAddRole}
                    disabled={!newRole.trim()}
                    variant={!newRole.trim() ? 'outline' : 'default'}
                    className={
                      !newRole.trim()
                        ? 'cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700 dark:hover:bg-purple-500'
                    }
                  >
                    <PlusCircle size={16} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!formData.path.trim() || !formData.description.trim() || formData.methods.length === 0}
            variant="default"
            className={
              !formData.path.trim() || !formData.description.trim() || formData.methods.length === 0
                ? 'cursor-not-allowed opacity-50'
                : ''
            }
          >
            {endpoint ? 'Save Changes' : 'Add Endpoint'}
          </Button>
        </div>
      </div>
    </Card>
  );
}; 