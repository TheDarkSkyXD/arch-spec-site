import { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Lock,
  Loader2,
  Edit,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  ApiEndpoint,
  apiEndpointsService,
} from "../../services/apiEndpointsService";
import { useToast } from "../../contexts/ToastContext";
import { Api } from "../../types/templates";
import { aiService } from "../../services/aiService";
import { projectsService } from "../../services/projectsService";
import { featuresService } from "../../services/featuresService";
import { dataModelService } from "../../services/dataModelService";
import { requirementsService } from "../../services/requirementsService";
import { useSubscription } from "../../contexts/SubscriptionContext";

// Import shadcn UI components
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import Card from "../ui/Card";

interface ApiEndpointsFormProps {
  initialData?: Api;
  projectId?: string;
  onSuccess?: (data: Api) => void;
}

export default function ApiEndpointsForm({
  initialData,
  projectId,
  onSuccess,
}: ApiEndpointsFormProps) {
  const { showToast } = useToast();
  const { hasAIFeatures } = useSubscription();
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(
    initialData?.endpoints || []
  );
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingEndpointIndex, setEditingEndpointIndex] = useState<
    number | null
  >(null);
  // Add state for form-level error and success messages
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // AI enhancement state
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isAddingEndpoints, setIsAddingEndpoints] = useState<boolean>(false);
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [features, setFeatures] = useState<any[]>([]);
  const [dataModels, setDataModels] = useState<any>({});
  const [requirements, setRequirements] = useState<string[]>([]);

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  // New function to enhance endpoints using AI (replace existing endpoints)
  const enhanceEndpoints = async () => {
    if (!projectId) {
      showToast({
        title: "Error",
        description: "Project must be saved before endpoints can be enhanced",
        type: "error",
      });
      return;
    }

    // Check if user has access to AI features
    if (!hasAIFeatures) {
      showToast({
        title: "Premium Feature",
        description: "Upgrade to Premium to use AI-powered features",
        type: "info",
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: "Warning",
        description:
          "Project description is missing. Endpoints may not be properly enhanced.",
        type: "warning",
      });
    }

    if (features.length === 0) {
      showToast({
        title: "Warning",
        description:
          "No features found. Endpoints will be based only on project description.",
        type: "warning",
      });
    }

    setIsEnhancing(true);
    try {
      const enhancedEndpoints = await aiService.enhanceApiEndpoints(
        projectDescription,
        features,
        dataModels,
        requirements,
        endpoints.length > 0 ? { endpoints } : undefined
      );

      if (enhancedEndpoints) {
        // Replace existing endpoints with enhanced ones
        setEndpoints(enhancedEndpoints.endpoints || []);

        showToast({
          title: "Success",
          description: "API endpoints enhanced successfully",
          type: "success",
        });
      } else {
        showToast({
          title: "Warning",
          description: "No enhanced endpoints returned",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error enhancing endpoints:", error);
      showToast({
        title: "Error",
        description: "Failed to enhance endpoints",
        type: "error",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  // New function to add AI-generated endpoints without replacing existing ones
  const addAIEndpoints = async () => {
    if (!projectId) {
      showToast({
        title: "Error",
        description: "Project must be saved before endpoints can be enhanced",
        type: "error",
      });
      return;
    }

    // Check if user has access to AI features
    if (!hasAIFeatures) {
      showToast({
        title: "Premium Feature",
        description: "Upgrade to Premium to use AI-powered features",
        type: "info",
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: "Warning",
        description:
          "Project description is missing. Endpoints may not be properly generated.",
        type: "warning",
      });
    }

    setIsAddingEndpoints(true);
    try {
      const enhancedEndpoints = await aiService.enhanceApiEndpoints(
        projectDescription,
        features,
        dataModels,
        requirements
      );

      if (enhancedEndpoints && enhancedEndpoints.endpoints.length > 0) {
        // Add new endpoints to existing ones
        setEndpoints([...endpoints, ...enhancedEndpoints.endpoints]);

        showToast({
          title: "Success",
          description: `Added ${enhancedEndpoints.endpoints.length} new endpoints`,
          type: "success",
        });
      } else {
        showToast({
          title: "Warning",
          description: "No new endpoints generated",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error adding AI endpoints:", error);
      showToast({
        title: "Error",
        description: "Failed to generate new endpoints",
        type: "error",
      });
    } finally {
      setIsAddingEndpoints(false);
    }
  };

  // Effect to update local state when initial data changes
  useEffect(() => {
    if (initialData) {
      setEndpoints(initialData.endpoints || []);
    }
  }, [initialData]);

  // Fetch API endpoints if projectId is provided but no initialData
  useEffect(() => {
    const fetchApiEndpoints = async () => {
      if (projectId && !initialData) {
        setIsLoading(true);
        try {
          const apiEndpointsData = await apiEndpointsService.getApiEndpoints(
            projectId
          );
          if (apiEndpointsData) {
            setEndpoints(apiEndpointsData.endpoints || []);
          }
        } catch (error) {
          console.error("Error fetching API endpoints:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchApiEndpoints();
  }, [projectId, initialData]);

  // New function to fetch project info for AI enhancement
  const fetchProjectInfo = async () => {
    if (!projectId) return;

    try {
      // Fetch project details including description
      const projectDetails = await projectsService.getProjectById(projectId);

      if (projectDetails) {
        setProjectDescription(projectDetails.description || "");

        // Fetch features
        const featuresData = await featuresService.getFeatures(projectId);
        if (featuresData?.coreModules) {
          setFeatures(featuresData.coreModules);
        }

        // Fetch data models
        const dataModelData = await dataModelService.getDataModel(projectId);
        if (dataModelData) {
          setDataModels(dataModelData);
        }

        // Fetch requirements
        const requirementsData = await requirementsService.getRequirements(
          projectId
        );
        if (requirementsData) {
          // Combine functional and non-functional requirements
          const allRequirements = [
            ...(requirementsData.functional || []),
            ...(requirementsData.non_functional || []),
          ];
          setRequirements(allRequirements);
        }
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  // Add effect to fetch project info
  useEffect(() => {
    if (projectId) {
      fetchProjectInfo();
    }
  }, [projectId]);

  const toggleEndpointExpand = (index: number) => {
    setExpandedEndpoint(expandedEndpoint === index ? null : index);
  };

  const validateEndpointForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newEndpoint.path.trim()) {
      newErrors.path = "Endpoint path is required";
    }

    if (!newEndpoint.description.trim()) {
      newErrors.description = "Endpoint description is required";
    }

    if (newEndpoint.methods.length === 0) {
      newErrors.methods = "At least one HTTP method must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEndpoint = () => {
    if (!validateEndpointForm()) return;

    setEndpoints([...endpoints, { ...newEndpoint }]);

    // Reset the form
    setNewEndpoint({
      path: "",
      description: "",
      methods: ["GET"],
      auth: false,
      roles: [],
    });
    setShowNewEndpointForm(false);
    setNewRole("");

    // Show success toast
    showToast({
      title: "Success",
      description: "New API endpoint added successfully",
      type: "success",
    });
  };

  const handleEditEndpoint = (index: number) => {
    // Close any expanded view
    setExpandedEndpoint(null);

    // Set the editing index
    setEditingEndpointIndex(index);

    // Populate the form with the endpoint data
    setNewEndpoint({ ...endpoints[index] });

    // If editing an endpoint that uses auth, make sure the roles are properly initialized
    if (endpoints[index].auth && !endpoints[index].roles) {
      setNewEndpoint({
        ...endpoints[index],
        roles: [],
      });
    }
  };

  const handleCancelEdit = () => {
    // Reset the editing state
    setEditingEndpointIndex(null);

    // Reset the form data
    setNewEndpoint({
      path: "",
      description: "",
      methods: ["GET"],
      auth: false,
      roles: [],
    });

    setNewRole("");
    setErrors({});
  };

  const handleSaveEdit = () => {
    if (!validateEndpointForm()) return;

    if (editingEndpointIndex !== null) {
      const updatedEndpoints = [...endpoints];
      updatedEndpoints[editingEndpointIndex] = { ...newEndpoint };
      setEndpoints(updatedEndpoints);

      // Reset the editing state
      setEditingEndpointIndex(null);

      // Reset the form
      setNewEndpoint({
        path: "",
        description: "",
        methods: ["GET"],
        auth: false,
        roles: [],
      });

      setNewRole("");

      // Show success toast
      showToast({
        title: "Success",
        description: "API endpoint updated successfully",
        type: "success",
      });
    }
  };

  const handleRemoveEndpoint = (index: number) => {
    setEndpoints(endpoints.filter((_, i) => i !== index));
    if (expandedEndpoint === index) {
      setExpandedEndpoint(null);
    }

    // Show success toast
    showToast({
      title: "Success",
      description: "API endpoint removed successfully",
      type: "success",
    });
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

    // Clear any method-related error when methods change
    if (errors.methods) {
      setErrors({
        ...errors,
        methods: "",
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
    if (!newRole.trim() || newEndpoint.roles?.includes(newRole.trim())) return;

    setNewEndpoint({
      ...newEndpoint,
      roles: [...(newEndpoint.roles || []), newRole.trim()],
    });
    setNewRole("");
  };

  const handleRemoveRole = (role: string) => {
    setNewEndpoint({
      ...newEndpoint,
      roles: newEndpoint.roles?.filter((r) => r !== role) || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    if (!projectId) {
      const errorMessage =
        "Project must be saved before API endpoints can be saved";
      showToast({
        title: "Error",
        description: errorMessage,
        type: "error",
      });
      setError(errorMessage);
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        endpoints: endpoints,
      };

      const result = await apiEndpointsService.saveApiEndpoints(
        projectId,
        data
      );

      if (result) {
        const successMessage = "API endpoints saved successfully";
        showToast({
          title: "Success",
          description: successMessage,
          type: "success",
        });
        setSuccess(successMessage);
        setTimeout(() => setSuccess(""), 3000);

        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        const errorMessage = "Failed to save API endpoints";
        showToast({
          title: "Error",
          description: errorMessage,
          type: "error",
        });
        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Error saving API endpoints:", error);
      const errorMessage = "An unexpected error occurred";
      showToast({
        title: "Error",
        description: errorMessage,
        type: "error",
      });
      setError(errorMessage);
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
        <span className="text-slate-600 dark:text-slate-300">
          Loading API endpoints...
        </span>
      </div>
    );
  }

  return (
    <form id="api-endpoints-form" onSubmit={handleSubmit} className="space-y-8">
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-md mb-4">
          {success}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            API Endpoints
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Define the API endpoints for your application.
          </p>
        </div>

        {/* AI Enhancement Buttons */}
        <div className="flex justify-end items-center gap-3 mb-4">
          {!hasAIFeatures && (
            <div className="mr-2 text-sm text-muted-foreground flex items-center">
              <span className="mr-1">✨</span>
              <span>AI features available with Premium plan</span>
            </div>
          )}
          <Button
            type="button"
            onClick={addAIEndpoints}
            disabled={
              isAddingEndpoints || isEnhancing || !projectId || !hasAIFeatures
            }
            variant={hasAIFeatures ? "outline" : "ghost"}
            className={`flex items-center gap-2 relative ${
              !hasAIFeatures ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={
              hasAIFeatures
                ? "Generate new endpoints to complement existing ones"
                : "Upgrade to Premium to use AI-powered features"
            }
          >
            {isAddingEndpoints ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                {hasAIFeatures ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span>Add AI Endpoints</span>
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={enhanceEndpoints}
            disabled={
              isEnhancing || isAddingEndpoints || !projectId || !hasAIFeatures
            }
            variant={hasAIFeatures ? "outline" : "ghost"}
            className={`flex items-center gap-2 relative ${
              !hasAIFeatures ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={
              hasAIFeatures
                ? "Replace all endpoints with AI-generated ones"
                : "Upgrade to Premium to use AI-powered features"
            }
          >
            {isEnhancing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Enhancing...</span>
              </>
            ) : (
              <>
                {hasAIFeatures ? (
                  <RefreshCw className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span>Replace All</span>
              </>
            )}
          </Button>
        </div>

        {/* Add new endpoint button */}
        {!showNewEndpointForm && editingEndpointIndex === null && (
          <div className="mb-6">
            <Button
              type="button"
              onClick={() => setShowNewEndpointForm(true)}
              className="flex items-center"
            >
              <PlusCircle size={16} className="mr-2" />
              Add New Endpoint
            </Button>
          </div>
        )}

        {/* New Endpoint Form */}
        {showNewEndpointForm && (
          <Card className="p-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
              Add New Endpoint
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="path"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Path <span className="text-red-500">*</span>
                </label>
                <Input
                  id="path"
                  type="text"
                  value={newEndpoint.path}
                  onChange={(e) =>
                    setNewEndpoint({ ...newEndpoint, path: e.target.value })
                  }
                  placeholder="/api/users"
                  error={errors.path}
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description"
                  value={newEndpoint.description}
                  onChange={(e) =>
                    setNewEndpoint({
                      ...newEndpoint,
                      description: e.target.value,
                    })
                  }
                  placeholder="What this endpoint does..."
                  error={errors.description}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  HTTP Methods <span className="text-red-500">*</span>
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
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-2 border-green-300 dark:border-green-700"
                            : method === "POST"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-700"
                            : method === "PUT"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-2 border-yellow-300 dark:border-yellow-700"
                            : method === "DELETE"
                            ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-2 border-red-300 dark:border-red-700"
                            : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-700"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                {errors.methods && (
                  <p className="mt-1 text-sm text-red-500">{errors.methods}</p>
                )}
              </div>

              <div className="mt-3">
                <div className="flex items-center mb-2">
                  <Checkbox
                    id="auth"
                    checked={newEndpoint.auth}
                    onCheckedChange={handleAuthToggle}
                  />
                  <label
                    htmlFor="auth"
                    className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
                  >
                    Requires Authentication
                  </label>
                </div>

                {newEndpoint.auth && (
                  <div className="mt-3 pl-6">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Required Roles
                      </label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {newEndpoint.roles?.map((role) => (
                          <span
                            key={role}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                          >
                            {role}
                            <button
                              type="button"
                              onClick={() => handleRemoveRole(role)}
                              className="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
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
                          variant={!newRole.trim() ? "outline" : "default"}
                          className={
                            !newRole.trim()
                              ? "cursor-not-allowed"
                              : "bg-purple-600 text-white hover:bg-purple-700 dark:hover:bg-purple-500"
                          }
                        >
                          <PlusCircle size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (showNewEndpointForm) {
                      setShowNewEndpointForm(false);
                    } else {
                      handleCancelEdit();
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={
                    editingEndpointIndex !== null
                      ? handleSaveEdit
                      : handleAddEndpoint
                  }
                  disabled={
                    !newEndpoint.path.trim() ||
                    !newEndpoint.description.trim() ||
                    newEndpoint.methods.length === 0
                  }
                  variant="default"
                  className={
                    !newEndpoint.path.trim() ||
                    !newEndpoint.description.trim() ||
                    newEndpoint.methods.length === 0
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }
                >
                  {editingEndpointIndex !== null
                    ? "Save Changes"
                    : "Add Endpoint"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Endpoints List */}
        {endpoints.length === 0 &&
        !showNewEndpointForm &&
        editingEndpointIndex === null ? (
          <Card className="p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              No API endpoints defined yet
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <Card
                key={index}
                className="border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <div
                  className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => toggleEndpointExpand(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-1">
                      {endpoint.methods.map((method) => (
                        <span
                          key={method}
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            method === "GET"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                              : method === "POST"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                              : method === "PUT"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                              : method === "DELETE"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {endpoint.path}
                    </span>
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
                        handleEditEndpoint(index);
                      }}
                      className="text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveEndpoint(index);
                      }}
                      className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </Button>
                    {expandedEndpoint === index ? (
                      <ChevronUp
                        size={16}
                        className="text-slate-500 dark:text-slate-400"
                      />
                    ) : (
                      <ChevronDown
                        size={16}
                        className="text-slate-500 dark:text-slate-400"
                      />
                    )}
                  </div>
                </div>

                {expandedEndpoint === index && (
                  <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <div className="mb-3">
                      <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Description
                      </label>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {endpoint.description}
                      </p>
                    </div>

                    {endpoint.roles && endpoint.roles.length > 0 && (
                      <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Required Roles
                        </label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {endpoint.roles.map((role) => (
                            <span
                              key={role}
                              className="inline-flex px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
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
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !projectId || editingEndpointIndex !== null}
          variant={
            !projectId || isSubmitting || editingEndpointIndex !== null
              ? "outline"
              : "default"
          }
          className={
            !projectId || isSubmitting || editingEndpointIndex !== null
              ? "bg-gray-400 text-white hover:bg-gray-400"
              : ""
          }
        >
          {isSubmitting ? "Saving..." : "Save API Endpoints"}
        </Button>
      </div>
    </form>
  );
}
