import { useState, useEffect } from "react";
import {
  ToggleLeft,
  ToggleRight,
  Info,
  Loader2,
  PlusCircle,
  X,
  Edit,
  Trash2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  FeatureModule,
  FeaturesData,
  featuresService,
} from "../../services/featuresService";
import { useToast } from "../../contexts/ToastContext";
import { projectsService } from "../../services/projectsService";
import { requirementsService } from "../../services/requirementsService";
import { aiService } from "../../services/aiService";

// Import shadcn UI components
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Select } from "../ui/select";
import Card from "../ui/Card";
import { Label } from "../ui/label";

interface FeaturesFormProps {
  initialData?: FeaturesData;
  projectId?: string;
  onSuccess?: (featuresData: FeaturesData) => void;
}

export default function FeaturesForm({
  initialData,
  projectId,
  onSuccess,
}: FeaturesFormProps) {
  const { showToast } = useToast();
  const [coreModules, setCoreModules] = useState<FeatureModule[]>(
    initialData?.coreModules || []
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Add state for form-level error and success messages
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // State for feature form - used for both adding and editing
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [isEditingFeature, setIsEditingFeature] = useState(false);
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(
    null
  );
  const [featureForm, setFeatureForm] = useState<{
    name: string;
    description: string;
    enabled: boolean;
    optional?: boolean;
    providers?: string[];
  }>({
    name: "",
    description: "",
    enabled: true,
    optional: true,
    providers: [],
  });
  const [showProviders, setShowProviders] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add state for AI enhancement
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isAddingFeatures, setIsAddingFeatures] = useState<boolean>(false);
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [businessGoals, setBusinessGoals] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);

  // Add debug logging for initialData
  // useEffect(() => {
  //   console.log("FeaturesForm initialData:", initialData);
  // }, [initialData]);

  // Effect to update local state when initial data changes
  useEffect(() => {
    if (initialData) {
      // console.log(
      //   "Setting core modules from initialData:",
      //   initialData.coreModules
      // );
      setCoreModules(initialData.coreModules || []);
    }
  }, [initialData]);

  // Fetch features if projectId is provided but no initialData
  useEffect(() => {
    const fetchFeatures = async () => {
      if (projectId && !initialData) {
        setIsLoading(true);
        try {
          const featuresData = await featuresService.getFeatures(projectId);
          if (featuresData) {
            console.log("Fetched features data:", featuresData);
            setCoreModules(featuresData.coreModules || []);
          }
        } catch (error) {
          console.error("Error fetching features:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFeatures();
  }, [projectId, initialData]);

  // New function to fetch project info for AI enhancement
  const fetchProjectInfo = async () => {
    if (!projectId) return;

    try {
      // Fetch project details including description and business goals
      const projectDetails = await projectsService.getProjectById(projectId);

      if (projectDetails) {
        setProjectDescription(projectDetails.description || "");
        setBusinessGoals(projectDetails.business_goals || []);

        // Fetch requirements as well
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

  const handleFeatureFormChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFeatureForm({
      ...featureForm,
      [field]: value,
    });

    // Clear any error for this field when it changes
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const validateFeatureForm = () => {
    const newErrors: Record<string, string> = {};

    if (!featureForm.name.trim()) {
      newErrors.name = "Feature name is required";
    }

    if (!featureForm.description.trim()) {
      newErrors.description = "Feature description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFeature = () => {
    if (!validateFeatureForm()) return;

    // Create a new feature module from the form data
    const featureToAdd: FeatureModule = {
      name: featureForm.name.trim(),
      description: featureForm.description.trim(),
      enabled: featureForm.enabled,
      optional: featureForm.optional,
    };

    // Only add providers if they're being used
    if (
      showProviders &&
      featureForm.providers &&
      featureForm.providers.length > 0
    ) {
      featureToAdd.providers = featureForm.providers;
    }

    // Add to core modules
    setCoreModules([...coreModules, featureToAdd]);

    // Reset the form
    resetFeatureForm();

    // Show success toast
    showToast({
      title: "Success",
      description: "New feature added successfully",
      type: "success",
    });
  };

  const handleEditFeature = () => {
    if (editingFeatureIndex === null || !validateFeatureForm()) return;

    // Create an updated feature module
    const updatedFeature: FeatureModule = {
      name: featureForm.name.trim(),
      description: featureForm.description.trim(),
      enabled: featureForm.enabled,
      optional: featureForm.optional,
    };

    // Only add providers if they're being used
    if (
      showProviders &&
      featureForm.providers &&
      featureForm.providers.length > 0
    ) {
      updatedFeature.providers = featureForm.providers;
    }

    // Update the feature in coreModules
    const updatedModules = [...coreModules];
    updatedModules[editingFeatureIndex] = updatedFeature;
    setCoreModules(updatedModules);

    // Reset the form
    resetFeatureForm();

    // Show success toast
    showToast({
      title: "Success",
      description: "Feature updated successfully",
      type: "success",
    });
  };

  const handleDeleteFeature = (index: number) => {
    // Remove the feature at the specified index
    const updatedModules = coreModules.filter((_, i) => i !== index);
    setCoreModules(updatedModules);

    // Show success toast
    showToast({
      title: "Success",
      description: "Feature removed successfully",
      type: "success",
    });
  };

  const handleStartEditFeature = (index: number) => {
    const feature = coreModules[index];

    // Set form data based on selected feature
    setFeatureForm({
      name: feature.name,
      description: feature.description,
      enabled: feature.enabled,
      optional: feature.optional,
      providers: feature.providers || [],
    });

    // Set editing state
    setShowProviders(!!feature.providers && feature.providers.length > 0);
    setEditingFeatureIndex(index);
    setIsEditingFeature(true);
  };

  const resetFeatureForm = () => {
    setFeatureForm({
      name: "",
      description: "",
      enabled: true,
      optional: true,
      providers: [],
    });
    setShowProviders(false);
    setIsAddingFeature(false);
    setIsEditingFeature(false);
    setEditingFeatureIndex(null);
  };

  // New function to enhance features using AI (replace existing features)
  const enhanceFeatures = async () => {
    if (!projectId) {
      showToast({
        title: "Error",
        description: "Project must be saved before features can be enhanced",
        type: "error",
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: "Warning",
        description:
          "Project description is missing. Features may not be properly enhanced.",
        type: "warning",
      });
    }

    if (requirements.length === 0) {
      showToast({
        title: "Warning",
        description:
          "No requirements found. Features will be based only on project description.",
        type: "warning",
      });
    }

    setIsEnhancing(true);
    try {
      console.log("Enhancing features with AI...");
      console.log("Core modules:", coreModules);
      const enhancedFeatures = await aiService.enhanceFeatures(
        projectDescription,
        businessGoals,
        requirements,
        coreModules.length > 0 ? coreModules : undefined
      );

      if (enhancedFeatures) {
        // Replace existing features with enhanced ones
        setCoreModules(enhancedFeatures.coreModules || []);

        // If we have optional modules, we could handle them here too
        // For now, we'll focus on core modules

        showToast({
          title: "Success",
          description: "Features enhanced successfully",
          type: "success",
        });
      } else {
        showToast({
          title: "Warning",
          description: "No enhanced features returned",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error enhancing features:", error);
      showToast({
        title: "Error",
        description: "Failed to enhance features",
        type: "error",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  // New function to add AI-generated features without replacing existing ones
  const addAIFeatures = async () => {
    if (!projectId) {
      showToast({
        title: "Error",
        description: "Project must be saved before features can be enhanced",
        type: "error",
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: "Warning",
        description:
          "Project description is missing. Features may not be properly generated.",
        type: "warning",
      });
    }

    setIsAddingFeatures(true);
    try {
      // When adding new features, we don't pass the existing features to avoid duplication
      const enhancedFeatures = await aiService.enhanceFeatures(
        projectDescription,
        businessGoals,
        requirements
      );

      if (enhancedFeatures && enhancedFeatures.coreModules.length > 0) {
        // Add new features to existing ones
        setCoreModules([...coreModules, ...enhancedFeatures.coreModules]);

        showToast({
          title: "Success",
          description: `Added ${enhancedFeatures.coreModules.length} new features`,
          type: "success",
        });
      } else {
        showToast({
          title: "Warning",
          description: "No new features generated",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error adding AI features:", error);
      showToast({
        title: "Error",
        description: "Failed to generate new features",
        type: "error",
      });
    } finally {
      setIsAddingFeatures(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    if (!projectId) {
      const errorMessage = "Project must be saved before features can be saved";
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
        coreModules: coreModules,
      };

      const result = await featuresService.saveFeatures(projectId, data);

      if (result) {
        const successMessage = "Features saved successfully";
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
        const errorMessage = "Failed to save features";
        showToast({
          title: "Error",
          description: errorMessage,
          type: "error",
        });
        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Error saving features:", error);
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
          Loading features...
        </span>
      </div>
    );
  }

  return (
    <form id="features-form" onSubmit={handleSubmit} className="space-y-8">
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
            Features & Modules
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Define the features and modules to include in your project.
          </p>
        </div>

        {/* AI Enhancement Buttons */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <Button
            type="button"
            onClick={addAIFeatures}
            disabled={isAddingFeatures || isEnhancing || !projectId}
            variant="outline"
            className="flex items-center gap-2"
            title="Generate new features to complement existing ones"
          >
            {isAddingFeatures ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Add AI Features</span>
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={enhanceFeatures}
            disabled={isEnhancing || isAddingFeatures || !projectId}
            variant="outline"
            className="flex items-center gap-2"
            title="Replace all features with AI-generated ones"
          >
            {isEnhancing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Enhancing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Replace All</span>
              </>
            )}
          </Button>
        </div>

        {/* Add new feature button */}
        {!isAddingFeature && !isEditingFeature && (
          <div className="mb-6">
            <Button
              type="button"
              variant="default"
              className="flex items-center"
              onClick={() => setIsAddingFeature(true)}
            >
              <PlusCircle size={16} className="mr-2" />
              Add New Feature
            </Button>
          </div>
        )}

        {/* Feature form for adding new features only */}
        {isAddingFeature && (
          <Card className="bg-slate-50 dark:bg-slate-700/30 p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-slate-800 dark:text-slate-100">
                Add New Feature
              </h3>
              <button
                type="button"
                onClick={resetFeatureForm}
                className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Feature name */}
              <div>
                <Label htmlFor="feature-name">
                  Feature Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="feature-name"
                  type="text"
                  value={featureForm.name}
                  onChange={(e) =>
                    handleFeatureFormChange("name", e.target.value)
                  }
                  placeholder="e.g., User Authentication"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Feature description */}
              <div>
                <Label htmlFor="feature-description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="feature-description"
                  value={featureForm.description}
                  onChange={(e) =>
                    handleFeatureFormChange("description", e.target.value)
                  }
                  rows={3}
                  placeholder="Describe what this feature does"
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Feature options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Checkbox
                    id="feature-enabled"
                    checked={featureForm.enabled}
                    onCheckedChange={(checked) =>
                      handleFeatureFormChange("enabled", checked)
                    }
                    label="Enabled by default"
                  />
                </div>

                <div>
                  <Checkbox
                    id="feature-optional"
                    checked={featureForm.optional}
                    onCheckedChange={(checked) =>
                      handleFeatureFormChange("optional", checked)
                    }
                    label="Optional (not required for implementation)"
                  />
                </div>
              </div>

              {/* Provider options */}
              <div>
                <div className="mb-2">
                  <Checkbox
                    id="has-providers"
                    checked={showProviders}
                    onCheckedChange={(checked) => setShowProviders(checked)}
                    label="This feature uses external providers"
                  />
                </div>

                {showProviders && (
                  <div className="mt-2">
                    <Select
                      label="Available Providers"
                      value={
                        (featureForm.providers && featureForm.providers[0]) ||
                        ""
                      }
                      onChange={(e) =>
                        handleFeatureFormChange(
                          "providers",
                          e.target.value ? [e.target.value] : []
                        )
                      }
                    >
                      <option value="">Select provider...</option>
                      <option value="Stripe">Stripe</option>
                      <option value="PayPal">PayPal</option>
                      <option value="AWS">AWS</option>
                      <option value="Azure">Azure</option>
                      <option value="GCP">Google Cloud</option>
                      <option value="Firebase">Firebase</option>
                      <option value="Custom">Custom Implementation</option>
                    </Select>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFeatureForm}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleAddFeature}
                >
                  Add Feature
                </Button>
              </div>
            </div>
          </Card>
        )}

        {coreModules.length === 0 && !isAddingFeature && !isEditingFeature ? (
          <Card className="bg-slate-50 dark:bg-slate-800 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              No features available. Add your first feature to get started.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {coreModules.map((module, index) => (
              <div key={index}>
                <Card className="p-4 bg-white dark:bg-slate-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-slate-800 dark:text-slate-100">
                        {module.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {module.description}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleStartEditFeature(index)}
                        className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        title="Edit feature"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFeature(index)}
                        className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Remove feature"
                      >
                        <Trash2 size={18} />
                      </button>
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
                  </div>

                  {!module.optional && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <Info size={12} />
                      <span>This feature is required for implementation</span>
                    </div>
                  )}

                  {module.enabled &&
                    module.providers &&
                    module.providers.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <Select
                          label="Provider"
                          value={module.providers[0] || ""}
                          onChange={(e) =>
                            handleProviderChange(index, e.target.value)
                          }
                        >
                          <option value="">Select provider...</option>
                          <option value="Stripe">Stripe</option>
                          <option value="PayPal">PayPal</option>
                          <option value="AWS">AWS</option>
                          <option value="Azure">Azure</option>
                          <option value="GCP">Google Cloud</option>
                          <option value="Firebase">Firebase</option>
                          <option value="Custom">Custom Implementation</option>
                        </Select>
                      </div>
                    )}
                </Card>

                {/* Inline edit form */}
                {isEditingFeature && editingFeatureIndex === index && (
                  <Card className="bg-slate-50 dark:bg-slate-700/30 p-4 mt-2 mb-4 border-l-4 border-primary-500">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-slate-800 dark:text-slate-100">
                        Edit Feature
                      </h3>
                      <button
                        type="button"
                        onClick={resetFeatureForm}
                        className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Feature name */}
                      <div>
                        <Label htmlFor={`feature-name-${index}`}>
                          Feature Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`feature-name-${index}`}
                          type="text"
                          value={featureForm.name}
                          onChange={(e) =>
                            handleFeatureFormChange("name", e.target.value)
                          }
                          placeholder="e.g., User Authentication"
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Feature description */}
                      <div>
                        <Label htmlFor={`feature-description-${index}`}>
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id={`feature-description-${index}`}
                          value={featureForm.description}
                          onChange={(e) =>
                            handleFeatureFormChange(
                              "description",
                              e.target.value
                            )
                          }
                          rows={3}
                          placeholder="Describe what this feature does"
                          className={errors.description ? "border-red-500" : ""}
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.description}
                          </p>
                        )}
                      </div>

                      {/* Feature options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Checkbox
                            id={`feature-enabled-${index}`}
                            checked={featureForm.enabled}
                            onCheckedChange={(checked) =>
                              handleFeatureFormChange("enabled", checked)
                            }
                            label="Enabled by default"
                          />
                        </div>

                        <div>
                          <Checkbox
                            id={`feature-optional-${index}`}
                            checked={featureForm.optional}
                            onCheckedChange={(checked) =>
                              handleFeatureFormChange("optional", checked)
                            }
                            label="Optional (not required for implementation)"
                          />
                        </div>
                      </div>

                      {/* Provider options */}
                      <div>
                        <div className="mb-2">
                          <Checkbox
                            id={`has-providers-${index}`}
                            checked={showProviders}
                            onCheckedChange={(checked) =>
                              setShowProviders(checked)
                            }
                            label="This feature uses external providers"
                          />
                        </div>

                        {showProviders && (
                          <div className="mt-2">
                            <Select
                              label="Available Providers"
                              value={
                                (featureForm.providers &&
                                  featureForm.providers[0]) ||
                                ""
                              }
                              onChange={(e) =>
                                handleFeatureFormChange(
                                  "providers",
                                  e.target.value ? [e.target.value] : []
                                )
                              }
                            >
                              <option value="">Select provider...</option>
                              <option value="Stripe">Stripe</option>
                              <option value="PayPal">PayPal</option>
                              <option value="AWS">AWS</option>
                              <option value="Azure">Azure</option>
                              <option value="GCP">Google Cloud</option>
                              <option value="Firebase">Firebase</option>
                              <option value="Custom">
                                Custom Implementation
                              </option>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex justify-end space-x-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetFeatureForm}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          variant="default"
                          onClick={handleEditFeature}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !projectId}
          variant={!projectId || isSubmitting ? "outline" : "default"}
          className={
            !projectId || isSubmitting
              ? "bg-gray-400 text-white hover:bg-gray-400"
              : ""
          }
        >
          {isSubmitting ? "Saving..." : "Save Features"}
        </Button>
      </div>
    </form>
  );
}
