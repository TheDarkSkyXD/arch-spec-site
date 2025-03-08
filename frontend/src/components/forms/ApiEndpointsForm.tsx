import { useState } from "react";
import { PlusCircle, Trash2, ChevronDown, ChevronUp, Lock } from "lucide-react";

interface ApiEndpoint {
  path: string;
  description: string;
  methods: string[];
  auth: boolean;
  roles: string[];
}

interface ApiEndpointsFormProps {
  initialData: {
    endpoints: ApiEndpoint[];
  };
  onSubmit: (data: { endpoints: ApiEndpoint[] }) => void;
  onBack: () => void;
}

export default function ApiEndpointsForm({
  initialData,
  onSubmit,
  onBack,
}: ApiEndpointsFormProps) {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(
    initialData.endpoints || []
  );
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(null);

  // New endpoint form state
  const [newEndpoint, setNewEndpoint] = useState<ApiEndpoint>({
    path: "",
    description: "",
    methods: ["GET"],
    auth: false,
    roles: [],
  });
  const [showNewEndpointForm, setShowNewEndpointForm] = useState(false);
  const [newRole, setNewRole] = useState("");

  const toggleEndpointExpand = (index: number) => {
    setExpandedEndpoint(expandedEndpoint === index ? null : index);
  };

  const handleAddEndpoint = () => {
    if (!newEndpoint.path.trim() || !newEndpoint.description.trim()) return;

    setEndpoints([...endpoints, { ...newEndpoint }]);
    setNewEndpoint({
      path: "",
      description: "",
      methods: ["GET"],
      auth: false,
      roles: [],
    });
    setShowNewEndpointForm(false);
  };

  const handleRemoveEndpoint = (index: number) => {
    setEndpoints(endpoints.filter((_, i) => i !== index));
    if (expandedEndpoint === index) {
      setExpandedEndpoint(null);
    }
  };

  const handleMethodToggle = (method: string) => {
    const methods = [...newEndpoint.methods];
    if (methods.includes(method)) {
      setNewEndpoint({
        ...newEndpoint,
        methods: methods.filter((m) => m !== method),
      });
    } else {
      setNewEndpoint({
        ...newEndpoint,
        methods: [...methods, method],
      });
    }
  };

  const handleAuthToggle = () => {
    setNewEndpoint({
      ...newEndpoint,
      auth: !newEndpoint.auth,
      roles: !newEndpoint.auth ? newEndpoint.roles : [],
    });
  };

  const handleAddRole = () => {
    if (!newRole.trim() || newEndpoint.roles.includes(newRole.trim())) return;

    setNewEndpoint({
      ...newEndpoint,
      roles: [...newEndpoint.roles, newRole.trim()],
    });
    setNewRole("");
  };

  const handleRemoveRole = (role: string) => {
    setNewEndpoint({
      ...newEndpoint,
      roles: newEndpoint.roles.filter((r) => r !== role),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ endpoints });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            API Endpoints
          </h2>
          <p className="text-slate-600 mb-6">
            Define the API endpoints for your application.
          </p>
        </div>

        {/* Endpoints List */}
        <div className="space-y-4">
          {endpoints.length === 0 ? (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <p className="text-slate-600">No API endpoints defined yet</p>
            </div>
          ) : (
            endpoints.map((endpoint, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-lg overflow-hidden"
              >
                <div
                  className="flex justify-between items-center p-3 bg-slate-50 cursor-pointer hover:bg-slate-100"
                  onClick={() => toggleEndpointExpand(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-1">
                      {endpoint.methods.map((method) => (
                        <span
                          key={method}
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            method === "GET"
                              ? "bg-green-100 text-green-800"
                              : method === "POST"
                              ? "bg-blue-100 text-blue-800"
                              : method === "PUT"
                              ? "bg-yellow-100 text-yellow-800"
                              : method === "DELETE"
                              ? "bg-red-100 text-red-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                    <span className="font-medium text-slate-800">
                      {endpoint.path}
                    </span>
                    {endpoint.auth && (
                      <span className="flex items-center text-xs text-slate-500">
                        <Lock size={12} className="mr-1" />
                        Protected
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveEndpoint(index);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                    {expandedEndpoint === index ? (
                      <ChevronUp size={16} className="text-slate-500" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-500" />
                    )}
                  </div>
                </div>

                {expandedEndpoint === index && (
                  <div className="p-3 border-t border-slate-200">
                    <div className="mb-3">
                      <label className="block text-xs text-slate-500 mb-1">
                        Description
                      </label>
                      <p className="text-sm text-slate-700">
                        {endpoint.description}
                      </p>
                    </div>

                    {endpoint.roles.length > 0 && (
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">
                          Required Roles
                        </label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {endpoint.roles.map((role) => (
                            <span
                              key={role}
                              className="inline-flex px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add New Endpoint Button */}
        {!showNewEndpointForm && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowNewEndpointForm(true)}
              className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              <PlusCircle size={16} />
              Add API Endpoint
            </button>
          </div>
        )}

        {/* New Endpoint Form */}
        {showNewEndpointForm && (
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
            <h3 className="text-lg font-medium text-slate-800 mb-4">
              Add New Endpoint
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="path"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Path
                </label>
                <input
                  id="path"
                  type="text"
                  value={newEndpoint.path}
                  onChange={(e) =>
                    setNewEndpoint({ ...newEndpoint, path: e.target.value })
                  }
                  placeholder="/api/users"
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={newEndpoint.description}
                  onChange={(e) =>
                    setNewEndpoint({
                      ...newEndpoint,
                      description: e.target.value,
                    })
                  }
                  placeholder="What this endpoint does..."
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  HTTP Methods
                </label>
                <div className="flex flex-wrap gap-2">
                  {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => handleMethodToggle(method)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        newEndpoint.methods.includes(method)
                          ? method === "GET"
                            ? "bg-green-100 text-green-800 border-2 border-green-300"
                            : method === "POST"
                            ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                            : method === "PUT"
                            ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                            : method === "DELETE"
                            ? "bg-red-100 text-red-800 border-2 border-red-300"
                            : "bg-purple-100 text-purple-800 border-2 border-purple-300"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <div className="flex items-center mb-2">
                  <input
                    id="auth"
                    type="checkbox"
                    checked={newEndpoint.auth}
                    onChange={handleAuthToggle}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
                  />
                  <label
                    htmlFor="auth"
                    className="ml-2 block text-sm text-slate-700"
                  >
                    Requires Authentication
                  </label>
                </div>

                {newEndpoint.auth && (
                  <div className="mt-3 pl-6">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Required Roles
                      </label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {newEndpoint.roles.map((role) => (
                          <span
                            key={role}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {role}
                            <button
                              type="button"
                              onClick={() => handleRemoveRole(role)}
                              className="ml-1 text-purple-600 hover:text-purple-800"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          placeholder="Add a role (e.g. admin)"
                          className="flex-1 p-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddRole}
                          disabled={!newRole.trim()}
                          className={`p-1.5 rounded flex items-center ${
                            !newRole.trim()
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-purple-600 text-white hover:bg-purple-700"
                          }`}
                        >
                          <PlusCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewEndpointForm(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddEndpoint}
                  disabled={
                    !newEndpoint.path.trim() ||
                    !newEndpoint.description.trim() ||
                    newEndpoint.methods.length === 0
                  }
                  className={`px-3 py-1.5 rounded text-sm ${
                    !newEndpoint.path.trim() ||
                    !newEndpoint.description.trim() ||
                    newEndpoint.methods.length === 0
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  }`}
                >
                  Add Endpoint
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
