import { useState, useEffect } from "react";
import {
  Loader2,
  PlusCircle,
  X,
  Edit,
  Trash2,
  Sparkles,
  RefreshCw,
  Plus,
  Tag,
  Lock,
} from "lucide-react";
import {
  GherkinTestCase,
  TestCasesData,
  testCasesService,
} from "../../services/testCasesService";
import { useToast } from "../../contexts/ToastContext";
import { aiService } from "../../services/aiService";
import { requirementsService } from "../../services/requirementsService";
import { FeatureModule, featuresService } from "../../services/featuresService";
import { useSubscription } from "../../contexts/SubscriptionContext";

// Import shadcn UI components
import Button from "../ui/Button";
import Input from "../ui/Input";
import { Textarea } from "../ui/textarea";
import Card from "../ui/Card";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { projectsService } from "../../services/projectsService";
import PremiumFeatureBadge from "../ui/PremiumFeatureBadge";

interface TestCasesFormProps {
  initialData?: TestCasesData;
  projectId?: string;
  onSuccess?: (testCasesData: TestCasesData) => void;
}

type ScenarioType = {
  name: string;
  steps: Array<{
    type: string;
    text: string;
  }>;
};

export default function TestCasesForm({
  initialData,
  projectId,
  onSuccess,
}: TestCasesFormProps) {
  const { showToast } = useToast();
  const { hasAIFeatures } = useSubscription();
  const [testCases, setTestCases] = useState<GherkinTestCase[]>(
    initialData?.testCases || []
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Add state for form-level error and success messages
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // State for test case form
  const [isAddingTestCase, setIsAddingTestCase] = useState(false);
  const [isEditingTestCase, setIsEditingTestCase] = useState(false);
  const [editingTestCaseIndex, setEditingTestCaseIndex] = useState<
    number | null
  >(null);
  const [testCaseForm, setTestCaseForm] = useState<{
    feature: string;
    title: string;
    description: string;
    tags: string[];
    newTag: string;
    scenarios: Array<{
      name: string;
      steps: Array<{
        type: "given" | "when" | "then" | "and" | "but";
        text: string;
      }>;
    }>;
  }>({
    feature: "",
    title: "",
    description: "",
    tags: [],
    newTag: "",
    scenarios: [
      {
        name: "",
        steps: [{ type: "given", text: "" }],
      },
    ],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for AI enhancement
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [isGeneratingTestCases, setIsGeneratingTestCases] =
    useState<boolean>(false);
  const [projectRequirements, setProjectRequirements] = useState<string[]>([]);
  const [projectFeatures, setProjectFeatures] = useState<FeatureModule[]>([]);

  // Effect to update local state when initial data changes
  useEffect(() => {
    if (initialData) {
      setTestCases(initialData.testCases || []);
    }
  }, [initialData]);

  // Fetch test cases if projectId is provided but no initialData
  useEffect(() => {
    const fetchTestCases = async () => {
      if (projectId && !initialData) {
        setIsLoading(true);
        try {
          const testCasesData = await testCasesService.getTestCases(projectId);
          if (testCasesData) {
            setTestCases(testCasesData.testCases || []);
          }
        } catch (error) {
          console.error("Error fetching test cases:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTestCases();
  }, [projectId, initialData]);

  // Fetch project info for AI enhancement
  useEffect(() => {
    const fetchProjectInfo = async () => {
      if (!projectId) return;

      try {
        // Fetch project details including description
        const projectDetails = await projectsService.getProjectById(projectId);
        if (projectDetails) {
          setProjectDescription(projectDetails.description || "");
        }

        // Fetch requirements
        const requirementsData = await requirementsService.getRequirements(
          projectId
        );
        if (requirementsData) {
          const allRequirements = [
            ...(requirementsData.functional || []),
            ...(requirementsData.non_functional || []),
          ];
          setProjectRequirements(allRequirements);
        }

        // Fetch features
        const featuresData = await featuresService.getFeatures(projectId);
        if (featuresData) {
          setProjectFeatures(featuresData.coreModules || []);
        }
      } catch (error) {
        console.error("Error fetching project information:", error);
      }
    };

    fetchProjectInfo();
  }, [projectId]);

  const handleTestCaseFormChange = (
    field: string,
    value: string | string[] | FeatureModule[] | ScenarioType[]
  ) => {
    setTestCaseForm({
      ...testCaseForm,
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

  const addTag = () => {
    if (!testCaseForm.newTag.trim()) return;

    // Don't add duplicate tags
    if (testCaseForm.tags.includes(testCaseForm.newTag.trim())) {
      showToast({
        title: "Warning",
        description: "This tag already exists",
        type: "warning",
      });
      return;
    }

    const updatedTags = [...testCaseForm.tags, testCaseForm.newTag.trim()];
    handleTestCaseFormChange("tags", updatedTags);
    handleTestCaseFormChange("newTag", "");
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = testCaseForm.tags.filter((tag) => tag !== tagToRemove);
    handleTestCaseFormChange("tags", updatedTags);
  };

  const handleScenarioChange = (
    scenarioIndex: number,
    field: string,
    value: string
  ) => {
    const updatedScenarios = [...testCaseForm.scenarios];
    updatedScenarios[scenarioIndex] = {
      ...updatedScenarios[scenarioIndex],
      [field]: value,
    };
    handleTestCaseFormChange("scenarios", updatedScenarios);
  };

  const handleStepChange = (
    scenarioIndex: number,
    stepIndex: number,
    field: string,
    value: string
  ) => {
    const updatedScenarios = [...testCaseForm.scenarios];
    updatedScenarios[scenarioIndex].steps[stepIndex] = {
      ...updatedScenarios[scenarioIndex].steps[stepIndex],
      [field]: value,
    };
    handleTestCaseFormChange("scenarios", updatedScenarios);
  };

  const addStep = (
    scenarioIndex: number,
    type: "given" | "when" | "then" | "and" | "but" = "and"
  ) => {
    const updatedScenarios = [...testCaseForm.scenarios];
    updatedScenarios[scenarioIndex].steps.push({ type, text: "" });
    handleTestCaseFormChange("scenarios", updatedScenarios);
  };

  const removeStep = (scenarioIndex: number, stepIndex: number) => {
    const updatedScenarios = [...testCaseForm.scenarios];
    updatedScenarios[scenarioIndex].steps.splice(stepIndex, 1);
    handleTestCaseFormChange("scenarios", updatedScenarios);
  };

  const addScenario = () => {
    const updatedScenarios = [
      ...testCaseForm.scenarios,
      {
        name: "",
        steps: [{ type: "given", text: "" }],
      },
    ];
    handleTestCaseFormChange("scenarios", updatedScenarios);
  };

  const removeScenario = (scenarioIndex: number) => {
    if (testCaseForm.scenarios.length <= 1) {
      showToast({
        title: "Warning",
        description: "Test case must have at least one scenario",
        type: "warning",
      });
      return;
    }

    const updatedScenarios = [...testCaseForm.scenarios];
    updatedScenarios.splice(scenarioIndex, 1);
    handleTestCaseFormChange("scenarios", updatedScenarios);
  };

  const validateTestCaseForm = () => {
    const newErrors: Record<string, string> = {};

    if (!testCaseForm.feature.trim()) {
      newErrors.feature = "Feature name is required";
    }

    if (!testCaseForm.title.trim()) {
      newErrors.title = "Test case title is required";
    }

    // Validate scenarios
    testCaseForm.scenarios.forEach((scenario, index) => {
      if (!scenario.name.trim()) {
        newErrors[`scenario_${index}_name`] = "Scenario name is required";
      }

      // Validate steps
      scenario.steps.forEach((step, stepIndex) => {
        if (!step.text.trim()) {
          newErrors[`scenario_${index}_step_${stepIndex}`] =
            "Step text is required";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTestCase = () => {
    if (!validateTestCaseForm()) return;

    // Create a new test case from the form data
    const testCaseToAdd: GherkinTestCase = {
      feature: testCaseForm.feature.trim(),
      title: testCaseForm.title.trim(),
      description: testCaseForm.description.trim(),
      tags: testCaseForm.tags,
      scenarios: testCaseForm.scenarios.map((scenario) => ({
        name: scenario.name.trim(),
        steps: scenario.steps.map((step) => ({
          type: step.type,
          text: step.text.trim(),
        })),
      })),
    };

    // Add to test cases
    setTestCases([...testCases, testCaseToAdd]);

    // Reset the form
    resetTestCaseForm();

    // Show success toast
    showToast({
      title: "Success",
      description: "New test case added successfully",
      type: "success",
    });
  };

  const handleEditTestCase = () => {
    if (editingTestCaseIndex === null || !validateTestCaseForm()) return;

    // Create an updated test case
    const updatedTestCase: GherkinTestCase = {
      feature: testCaseForm.feature.trim(),
      title: testCaseForm.title.trim(),
      description: testCaseForm.description.trim(),
      tags: testCaseForm.tags,
      scenarios: testCaseForm.scenarios.map((scenario) => ({
        name: scenario.name.trim(),
        steps: scenario.steps.map((step) => ({
          type: step.type,
          text: step.text.trim(),
        })),
      })),
    };

    // Update the test case
    const updatedTestCases = [...testCases];
    updatedTestCases[editingTestCaseIndex] = updatedTestCase;
    setTestCases(updatedTestCases);

    // Reset the form
    resetTestCaseForm();

    // Show success toast
    showToast({
      title: "Success",
      description: "Test case updated successfully",
      type: "success",
    });
  };

  const handleDeleteTestCase = (index: number) => {
    // Remove the test case at the specified index
    const updatedTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(updatedTestCases);

    // Show success toast
    showToast({
      title: "Success",
      description: "Test case removed successfully",
      type: "success",
    });
  };

  const handleStartEditTestCase = (index: number) => {
    const testCase = testCases[index];

    // Set form data based on selected test case
    setTestCaseForm({
      feature: testCase.feature,
      title: testCase.title,
      description: testCase.description || "",
      tags: testCase.tags || [],
      newTag: "",
      scenarios: testCase.scenarios || [
        {
          name: "",
          steps: [{ type: "given", text: "" }],
        },
      ],
    });

    // Set editing state
    setEditingTestCaseIndex(index);
    setIsEditingTestCase(true);
  };

  const resetTestCaseForm = () => {
    setTestCaseForm({
      feature: "",
      title: "",
      description: "",
      tags: [],
      newTag: "",
      scenarios: [
        {
          name: "",
          steps: [{ type: "given", text: "" }],
        },
      ],
    });
    setIsAddingTestCase(false);
    setIsEditingTestCase(false);
    setEditingTestCaseIndex(null);
  };

  // Function to generate test cases using AI based on requirements and features
  const generateTestCases = async () => {
    if (!projectId) {
      showToast({
        title: "Error",
        description: "Project must be saved before test cases can be generated",
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

    if (projectRequirements.length === 0 && projectFeatures.length === 0) {
      showToast({
        title: "Warning",
        description: "No requirements or features found to base test cases on",
        type: "warning",
      });
      return;
    }

    setIsGeneratingTestCases(true);
    try {
      // This is a placeholder for the actual AI service call
      // We would need to implement this in the AI service
      const generatedTestCases = await aiService.generateTestCases(
        projectDescription,
        projectRequirements,
        projectFeatures
      );

      if (generatedTestCases && generatedTestCases.testCases) {
        // Add new test cases to existing ones
        setTestCases([...testCases, ...generatedTestCases.testCases]);

        showToast({
          title: "Success",
          description: `Generated ${generatedTestCases.testCases.length} test cases`,
          type: "success",
        });
      } else {
        showToast({
          title: "Warning",
          description: "No test cases were generated",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error generating test cases:", error);
      showToast({
        title: "Error",
        description: "Failed to generate test cases",
        type: "error",
      });
    } finally {
      setIsGeneratingTestCases(false);
    }
  };

  // Function to enhance existing test cases using AI
  const enhanceTestCases = async () => {
    if (!projectId) {
      showToast({
        title: "Error",
        description: "Project must be saved before test cases can be enhanced",
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

    if (testCases.length === 0) {
      showToast({
        title: "Warning",
        description: "No test cases to enhance",
        type: "warning",
      });
      return;
    }

    setIsEnhancing(true);
    try {
      // This is a placeholder for the actual AI service call
      const enhancedTestCases = await aiService.enhanceTestCases(
        projectDescription,
        testCases,
        projectRequirements,
        projectFeatures
      );

      if (enhancedTestCases && enhancedTestCases.testCases) {
        // Replace existing test cases with enhanced ones
        setTestCases(enhancedTestCases.testCases);

        showToast({
          title: "Success",
          description: "Test cases enhanced successfully",
          type: "success",
        });
      } else {
        showToast({
          title: "Warning",
          description: "No enhanced test cases returned",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error enhancing test cases:", error);
      showToast({
        title: "Error",
        description: "Failed to enhance test cases",
        type: "error",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    if (!projectId) {
      const errorMessage =
        "Project must be saved before test cases can be saved";
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
        testCases: testCases,
      };

      const result = await testCasesService.saveTestCases(projectId, data);

      if (result) {
        const successMessage = "Test cases saved successfully";
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
        const errorMessage = "Failed to save test cases";
        showToast({
          title: "Error",
          description: errorMessage,
          type: "error",
        });
        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Error saving test cases:", error);
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
          Loading test cases...
        </span>
      </div>
    );
  }

  return (
    <form id="test-cases-form" onSubmit={handleSubmit} className="space-y-8">
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
            Test Cases
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Define test cases using Gherkin format to document expected behavior
          </p>
        </div>

        {/* AI Generation Buttons */}
        <div className="flex justify-end items-center gap-3 mb-4">
          {!hasAIFeatures && <PremiumFeatureBadge />}
          <Button
            type="button"
            onClick={generateTestCases}
            disabled={
              isGeneratingTestCases ||
              isEnhancing ||
              !projectId ||
              !hasAIFeatures
            }
            variant={hasAIFeatures ? "outline" : "ghost"}
            className={`flex items-center gap-2 relative ${
              !hasAIFeatures ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={
              hasAIFeatures
                ? "Generate new test cases based on requirements and features"
                : "Upgrade to Premium to use AI-powered features"
            }
          >
            {isGeneratingTestCases ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                {hasAIFeatures ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span>Generate Test Cases</span>
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={enhanceTestCases}
            disabled={
              isEnhancing ||
              isGeneratingTestCases ||
              !projectId ||
              testCases.length === 0 ||
              !hasAIFeatures
            }
            variant={hasAIFeatures ? "outline" : "ghost"}
            className={`flex items-center gap-2 relative ${
              !hasAIFeatures ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={
              hasAIFeatures
                ? "Enhance existing test cases with AI"
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
                <span>Enhance Test Cases</span>
              </>
            )}
          </Button>
        </div>

        {/* Add new test case button */}
        {!isAddingTestCase && !isEditingTestCase && (
          <div className="mb-6">
            <Button
              type="button"
              variant="default"
              className="flex items-center"
              onClick={() => setIsAddingTestCase(true)}
            >
              <PlusCircle size={16} className="mr-2" />
              Add New Test Case
            </Button>
          </div>
        )}

        {/* Test case form for adding new test cases */}
        {(isAddingTestCase || isEditingTestCase) && (
          <Card className="bg-slate-50 dark:bg-slate-700/30 p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-slate-800 dark:text-slate-100">
                {isEditingTestCase ? "Edit Test Case" : "Add New Test Case"}
              </h3>
              <button
                type="button"
                onClick={resetTestCaseForm}
                className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Feature name */}
              <div>
                <Label htmlFor="feature-name">
                  Feature <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="feature-name"
                  type="text"
                  value={testCaseForm.feature}
                  onChange={(e) =>
                    handleTestCaseFormChange("feature", e.target.value)
                  }
                  placeholder="e.g., User Authentication"
                  className={errors.feature ? "border-red-500" : ""}
                />
                {errors.feature && (
                  <p className="mt-1 text-sm text-red-500">{errors.feature}</p>
                )}
              </div>

              {/* Test case title */}
              <div>
                <Label htmlFor="test-case-title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="test-case-title"
                  type="text"
                  value={testCaseForm.title}
                  onChange={(e) =>
                    handleTestCaseFormChange("title", e.target.value)
                  }
                  placeholder="e.g., Login with valid credentials"
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Test case description */}
              <div>
                <Label htmlFor="test-case-description">Description</Label>
                <Textarea
                  id="test-case-description"
                  value={testCaseForm.description}
                  onChange={(e) =>
                    handleTestCaseFormChange("description", e.target.value)
                  }
                  rows={3}
                  placeholder="Describe the test case in more detail"
                />
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {testCaseForm.tags.map((tag, index) => (
                    <Badge key={index} className="flex items-center gap-1">
                      @{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-xs"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={testCaseForm.newTag}
                    onChange={(e) =>
                      handleTestCaseFormChange("newTag", e.target.value)
                    }
                    placeholder="Add a tag"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    size="sm"
                  >
                    <Tag size={16} />
                  </Button>
                </div>
              </div>

              {/* Scenarios */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Scenarios</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addScenario}
                    className="text-sm"
                  >
                    <Plus size={14} className="mr-1" /> Add Scenario
                  </Button>
                </div>

                {testCaseForm.scenarios.map((scenario, scenarioIndex) => (
                  <Card
                    key={scenarioIndex}
                    className="mb-4 p-4 bg-white dark:bg-slate-800"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-full">
                        <Label htmlFor={`scenario-name-${scenarioIndex}`}>
                          Scenario Name <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={`scenario-name-${scenarioIndex}`}
                            type="text"
                            value={scenario.name}
                            onChange={(e) =>
                              handleScenarioChange(
                                scenarioIndex,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Successful login"
                            className={
                              errors[`scenario_${scenarioIndex}_name`]
                                ? "border-red-500"
                                : ""
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeScenario(scenarioIndex)}
                            disabled={testCaseForm.scenarios.length <= 1}
                            className="text-red-500"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        {errors[`scenario_${scenarioIndex}_name`] && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors[`scenario_${scenarioIndex}_name`]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="mt-4">
                      <Label>Steps</Label>
                      {scenario.steps.map((step, stepIndex) => (
                        <div
                          key={stepIndex}
                          className="flex gap-2 items-start mt-2"
                        >
                          <Select
                            value={step.type}
                            onChange={(e) =>
                              handleStepChange(
                                scenarioIndex,
                                stepIndex,
                                "type",
                                e.target.value as
                                  | "given"
                                  | "when"
                                  | "then"
                                  | "and"
                                  | "but"
                              )
                            }
                            className="w-24"
                          >
                            <option value="given">Given</option>
                            <option value="when">When</option>
                            <option value="then">Then</option>
                            <option value="and">And</option>
                            <option value="but">But</option>
                          </Select>
                          <Input
                            type="text"
                            value={step.text}
                            onChange={(e) =>
                              handleStepChange(
                                scenarioIndex,
                                stepIndex,
                                "text",
                                e.target.value
                              )
                            }
                            placeholder="e.g., the user enters valid credentials"
                            className={
                              errors[
                                `scenario_${scenarioIndex}_step_${stepIndex}`
                              ]
                                ? "border-red-500 flex-1"
                                : "flex-1"
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStep(scenarioIndex, stepIndex)}
                            disabled={scenario.steps.length <= 1}
                            className="text-red-500"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                      {errors[`scenario_${scenarioIndex}_step_0`] && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[`scenario_${scenarioIndex}_step_0`]}
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addStep(scenarioIndex)}
                        className="mt-2 text-sm"
                      >
                        <Plus size={14} className="mr-1" /> Add Step
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetTestCaseForm}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="default"
                  onClick={
                    isEditingTestCase ? handleEditTestCase : handleAddTestCase
                  }
                >
                  {isEditingTestCase ? "Save Changes" : "Add Test Case"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Test cases list */}
        {testCases.length === 0 && !isAddingTestCase && !isEditingTestCase ? (
          <Card className="bg-slate-50 dark:bg-slate-800 text-center p-6">
            <p className="text-slate-600 dark:text-slate-400">
              No test cases available. Add your first test case to get started.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {testCases.map((testCase, index) => (
              <Card key={index} className="p-4 bg-white dark:bg-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-slate-100">
                      {testCase.feature}: {testCase.title}
                    </h3>
                    {testCase.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {testCase.description}
                      </p>
                    )}
                    {testCase.tags && testCase.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {testCase.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline">
                            @{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleStartEditTestCase(index)}
                      className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      title="Edit test case"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTestCase(index)}
                      className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete test case"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Collapsible scenarios section */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <Tabs defaultValue="scenario0">
                    <TabsList className="mb-2">
                      {testCase.scenarios.map((_scenario, scenarioIndex) => (
                        <TabsTrigger
                          key={scenarioIndex}
                          value={`scenario${scenarioIndex}`}
                        >
                          Scenario {scenarioIndex + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {testCase.scenarios.map((scenario, scenarioIndex) => (
                      <TabsContent
                        key={scenarioIndex}
                        value={`scenario${scenarioIndex}`}
                      >
                        <div className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded">
                          <h4 className="font-medium mb-2">{scenario.name}</h4>
                          <ul className="space-y-1">
                            {scenario.steps.map((step, stepIndex) => (
                              <li
                                key={stepIndex}
                                className="text-sm text-slate-600 dark:text-slate-300"
                              >
                                <span className="font-medium capitalize">
                                  {step.type}
                                </span>{" "}
                                {step.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </Card>
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
          {isSubmitting ? "Saving..." : "Save Test Cases"}
        </Button>
      </div>
    </form>
  );
}
