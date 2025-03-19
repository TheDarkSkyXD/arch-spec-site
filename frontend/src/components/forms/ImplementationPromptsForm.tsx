import { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  AlertCircle,
  Loader2,
  Sparkles,
  Copy,
  FileDown,
  Check,
} from "lucide-react";
import { implementationPromptsService } from "../../services/implementationPromptsService";
import { useToast } from "../../contexts/ToastContext";
import { useSubscription } from "../../contexts/SubscriptionContext";
import {
  ImplementationPrompts,
  ImplementationPrompt,
  ImplementationPromptType,
} from "../../types/templates";
import {
  IMPLEMENTATION_CATEGORIES,
  CATEGORY_LABELS,
  PROMPT_TYPE_LABELS,
} from "../../constants/implementationPrompts";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { PremiumFeatureBadge } from "../ui/index";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";

interface ImplementationPromptsFormProps {
  initialData?: Partial<ImplementationPrompts>;
  projectId?: string;
  onSuccess?: (data: Partial<ImplementationPrompts>) => void;
}

export default function ImplementationPromptsForm({
  initialData,
  projectId,
  onSuccess,
}: ImplementationPromptsFormProps) {
  const { showToast } = useToast();
  const { hasAIFeatures } = useSubscription();
  const [promptsData, setPromptsData] = useState<
    Record<string, ImplementationPrompt[]>
  >(initialData?.data || {});
  const [currentCategory, setCurrentCategory] = useState<string>(
    IMPLEMENTATION_CATEGORIES[0]
  );
  const [currentPromptType, setCurrentPromptType] =
    useState<ImplementationPromptType>(ImplementationPromptType.MAIN);
  const [newPromptContent, setNewPromptContent] = useState<string>("");
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const [editPromptContent, setEditPromptContent] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [generatingCategories, setGeneratingCategories] = useState<
    Record<string, boolean>
  >({});
  const [loadingSampleCategories, setLoadingSampleCategories] = useState<
    Record<string, boolean>
  >({});

  // Effect to update local state when initial data changes
  useEffect(() => {
    if (initialData?.data) {
      setPromptsData(initialData.data);
    }
  }, [initialData]);

  // Fetch implementation prompts if projectId is provided but no initialData
  useEffect(() => {
    const fetchImplementationPrompts = async () => {
      if (projectId && !initialData) {
        setIsLoading(true);
        try {
          const data =
            await implementationPromptsService.getImplementationPrompts(
              projectId
            );
          if (data) {
            setPromptsData(data.data || {});
          }
        } catch (error) {
          console.error("Error fetching implementation prompts:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchImplementationPrompts();
  }, [projectId, initialData]);

  // Initialize categories with empty arrays if they don't exist
  useEffect(() => {
    const initializedData = { ...promptsData };
    let changed = false;

    IMPLEMENTATION_CATEGORIES.forEach((category) => {
      if (!initializedData[category]) {
        initializedData[category] = [];
        changed = true;
      }
    });

    if (changed) {
      setPromptsData(initializedData);
    }
  }, [promptsData]);

  // Add a helper function to find the next available prompt type for a category
  const getNextAvailablePromptType = (category: string) => {
    if (!promptsData[category]) {
      return ImplementationPromptType.MAIN;
    }

    const hasMain = promptsData[category].some(
      (p) => p.type === ImplementationPromptType.MAIN
    );
    const hasFollowup1 = promptsData[category].some(
      (p) => p.type === ImplementationPromptType.FOLLOWUP_1
    );
    const hasFollowup2 = promptsData[category].some(
      (p) => p.type === ImplementationPromptType.FOLLOWUP_2
    );

    if (!hasMain) {
      return ImplementationPromptType.MAIN;
    } else if (!hasFollowup1) {
      return ImplementationPromptType.FOLLOWUP_1;
    } else if (!hasFollowup2) {
      return ImplementationPromptType.FOLLOWUP_2;
    }

    // If all types exist, default to MAIN (though the add section won't be visible in this case)
    return ImplementationPromptType.MAIN;
  };

  const addPrompt = () => {
    if (!newPromptContent.trim()) return;

    const updatedPrompts = { ...promptsData };

    // Initialize category array if it doesn't exist
    if (!updatedPrompts[currentCategory]) {
      updatedPrompts[currentCategory] = [];
    }

    // Create new prompt
    const newPrompt: ImplementationPrompt = {
      id: crypto.randomUUID(),
      content: newPromptContent,
      type: currentPromptType,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Find if there's already a prompt of the same type
    const existingPromptIndex = updatedPrompts[currentCategory].findIndex(
      (p) => p.type === currentPromptType
    );

    // Replace or add the new prompt
    if (existingPromptIndex >= 0) {
      updatedPrompts[currentCategory][existingPromptIndex] = newPrompt;
    } else {
      updatedPrompts[currentCategory].push(newPrompt);
    }

    setPromptsData(updatedPrompts);
    setNewPromptContent("");

    // Call onSuccess to update the parent component's state
    if (onSuccess) {
      onSuccess({ data: updatedPrompts });
    }

    // Select the next available prompt type automatically
    const hasMain = updatedPrompts[currentCategory].some(
      (p) => p.type === ImplementationPromptType.MAIN
    );
    const hasFollowup1 = updatedPrompts[currentCategory].some(
      (p) => p.type === ImplementationPromptType.FOLLOWUP_1
    );
    const hasFollowup2 = updatedPrompts[currentCategory].some(
      (p) => p.type === ImplementationPromptType.FOLLOWUP_2
    );

    if (!hasMain) {
      setCurrentPromptType(ImplementationPromptType.MAIN);
    } else if (!hasFollowup1) {
      setCurrentPromptType(ImplementationPromptType.FOLLOWUP_1);
    } else if (!hasFollowup2) {
      setCurrentPromptType(ImplementationPromptType.FOLLOWUP_2);
    }
  };

  const startEditingPrompt = (category: string, promptId: string) => {
    const prompt = promptsData[category]?.find((p) => p.id === promptId);
    if (prompt) {
      setEditingPrompt(promptId);
      setEditPromptContent(prompt.content);
    }
  };

  const saveEditedPrompt = (category: string, promptId: string) => {
    if (!editPromptContent.trim()) return;

    const updatedPrompts = { ...promptsData };
    const promptIndex = updatedPrompts[category]?.findIndex(
      (p) => p.id === promptId
    );

    if (promptIndex !== undefined && promptIndex >= 0) {
      updatedPrompts[category][promptIndex] = {
        ...updatedPrompts[category][promptIndex],
        content: editPromptContent,
        updated_at: new Date().toISOString(),
      };

      setPromptsData(updatedPrompts);
      setEditingPrompt(null);
      setEditPromptContent("");

      // Call onSuccess to update the parent component's state
      if (onSuccess) {
        onSuccess({ data: updatedPrompts });
      }
    }
  };

  const cancelEditingPrompt = () => {
    setEditingPrompt(null);
    setEditPromptContent("");
  };

  const removePrompt = (category: string, promptId: string) => {
    const prompt = promptsData[category]?.find((p) => p.id === promptId);
    if (!prompt) return;

    // Store the type of the prompt being removed
    const removedPromptType = prompt.type;

    const updatedPrompts = { ...promptsData };
    updatedPrompts[category] = updatedPrompts[category].filter(
      (p) => p.id !== promptId
    );

    setPromptsData(updatedPrompts);

    // Set the current prompt type to the one that was just removed
    setCurrentPromptType(removedPromptType);

    // Call onSuccess to update the parent component's state
    if (onSuccess) {
      onSuccess({ data: updatedPrompts });
    }
  };

  const copyPromptToClipboard = async (content: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedPromptId(promptId);
      showToast({
        title: "Copied",
        description: "Prompt copied to clipboard",
        type: "success",
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedPromptId(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      showToast({
        title: "Error",
        description: "Failed to copy prompt to clipboard",
        type: "error",
      });
    }
  };

  const downloadAllPrompts = () => {
    try {
      // Create a properly formatted text for download
      let content = "# IMPLEMENTATION PROMPTS\n\n";

      IMPLEMENTATION_CATEGORIES.forEach((category) => {
        if (promptsData[category] && promptsData[category].length > 0) {
          content += `## ${CATEGORY_LABELS[category]}\n\n`;

          // Sort prompts by type: MAIN first, then FOLLOWUP_1, then FOLLOWUP_2
          const sortedPrompts = [...promptsData[category]].sort((a, b) => {
            const typeOrder = {
              [ImplementationPromptType.MAIN]: 0,
              [ImplementationPromptType.FOLLOWUP_1]: 1,
              [ImplementationPromptType.FOLLOWUP_2]: 2,
            };
            return typeOrder[a.type] - typeOrder[b.type];
          });

          sortedPrompts.forEach((prompt) => {
            content += `### ${PROMPT_TYPE_LABELS[prompt.type]}\n\n`;
            content += `${prompt.content}\n\n`;
          });

          content += "\n";
        }
      });

      // Create a blob and download link
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "implementation_prompts.md";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast({
        title: "Downloaded",
        description: "Implementation prompts downloaded successfully",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to download prompts: ", err);
      showToast({
        title: "Error",
        description: "Failed to download implementation prompts",
        type: "error",
      });
    }
  };

  const loadSamplePromptsForCategory = async (category: string) => {
    setLoadingSampleCategories((prev) => ({ ...prev, [category]: true }));
    try {
      const samplePrompts =
        await implementationPromptsService.getSampleImplementationPrompts();

      if (samplePrompts && samplePrompts.data && samplePrompts.data[category]) {
        // Only update the specific category with samples
        const updatedPrompts = { ...promptsData };
        updatedPrompts[category] = samplePrompts.data[category];

        setPromptsData(updatedPrompts);

        // Call onSuccess to update the parent component's state
        if (onSuccess) {
          onSuccess({ data: updatedPrompts });
        }

        showToast({
          title: "Success",
          description: `Sample implementation prompts for ${CATEGORY_LABELS[category]} loaded successfully`,
          type: "success",
        });
      } else {
        showToast({
          title: "Error",
          description: `No sample implementation prompts found for ${CATEGORY_LABELS[category]}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error(`Error loading sample prompts for ${category}:`, error);
      showToast({
        title: "Error",
        description: `Failed to load sample implementation prompts for ${CATEGORY_LABELS[category]}`,
        type: "error",
      });
    } finally {
      setLoadingSampleCategories((prev) => ({ ...prev, [category]: false }));
    }
  };

  const generatePromptsForCategory = async (category: string) => {
    if (!projectId) {
      const errorMessage =
        "Project must be saved before prompts can be generated";
      showToast({
        title: "Error",
        description: errorMessage,
        type: "error",
      });
      setErrors({ general: errorMessage });
      return;
    }

    // Check if user has access to AI features
    if (!hasAIFeatures) {
      showToast({
        title: "Premium Feature",
        description:
          "AI prompt generation is only available on Premium and Open Source plans. Please upgrade to use this feature.",
        type: "warning",
      });
      return;
    }

    // Set loading state for this category
    setGeneratingCategories((prev) => ({ ...prev, [category]: true }));

    try {
      // Call the API to generate prompts for this category
      const generatedPrompts =
        await implementationPromptsService.generateImplementationPrompts(
          projectId,
          category
        );

      if (generatedPrompts && generatedPrompts.length > 0) {
        // Update the prompts data with the generated prompts
        const updatedPrompts = { ...promptsData };

        // Initialize category array if it doesn't exist
        if (!updatedPrompts[category]) {
          updatedPrompts[category] = [];
        }

        // For each generated prompt, either add it or replace an existing one of the same type
        generatedPrompts.forEach((newPrompt) => {
          const existingIndex = updatedPrompts[category].findIndex(
            (p) => p.type === newPrompt.type
          );

          if (existingIndex >= 0) {
            // Replace existing prompt of the same type
            updatedPrompts[category][existingIndex] = newPrompt;
          } else {
            // Add new prompt
            updatedPrompts[category].push(newPrompt);
          }
        });

        setPromptsData(updatedPrompts);

        // Call onSuccess to update the parent component's state
        if (onSuccess) {
          onSuccess({ data: updatedPrompts });
        }

        showToast({
          title: "Success",
          description: `Implementation prompts for ${CATEGORY_LABELS[category]} generated successfully`,
          type: "success",
        });
      } else {
        showToast({
          title: "Error",
          description: `Failed to generate implementation prompts for ${CATEGORY_LABELS[category]}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error(
        `Error generating prompts for category ${category}:`,
        error
      );
      showToast({
        title: "Error",
        description: `Failed to generate implementation prompts for ${CATEGORY_LABELS[category]}`,
        type: "error",
      });
    } finally {
      // Reset loading state for this category
      setGeneratingCategories((prev) => ({ ...prev, [category]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous error/success messages
    setError("");
    setSuccess("");

    if (!projectId) {
      const errorMessage = "Project must be saved before prompts can be saved";
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
      const data: ImplementationPrompts = {
        data: promptsData,
      };

      const result =
        await implementationPromptsService.saveImplementationPrompts(
          projectId,
          data
        );

      if (result) {
        const successMessage = "Implementation prompts saved successfully";
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
        const errorMessage = "Failed to save implementation prompts";
        showToast({
          title: "Error",
          description: errorMessage,
          type: "error",
        });
        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Error saving implementation prompts:", error);
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

  const allPromptTypesExistForCategory = (category: string) => {
    if (!promptsData[category] || promptsData[category].length === 0) {
      return false;
    }

    // Check if all three prompt types exist for this category
    const hasMain = promptsData[category].some(
      (p) => p.type === ImplementationPromptType.MAIN
    );
    const hasFollowup1 = promptsData[category].some(
      (p) => p.type === ImplementationPromptType.FOLLOWUP_1
    );
    const hasFollowup2 = promptsData[category].some(
      (p) => p.type === ImplementationPromptType.FOLLOWUP_2
    );

    return hasMain && hasFollowup1 && hasFollowup2;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
        <span className="text-slate-600 dark:text-slate-300">
          Loading implementation prompts...
        </span>
      </div>
    );
  }

  return (
    <form
      id="implementation-prompts-form"
      onSubmit={handleSubmit}
      className="space-y-8"
    >
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

      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Implementation Prompts
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Define prompts for implementing different aspects of your project.
          Each category should have a main prompt and follow-up prompts to be
          used in sequence. The numbered sections indicate the recommended order
          of implementation.
        </p>
      </div>

      {/* Download All Button */}
      <div className="flex justify-end items-center gap-3 mb-4">
        {!hasAIFeatures && <PremiumFeatureBadge />}
        <Button
          type="button"
          onClick={downloadAllPrompts}
          variant="outline"
          className="flex items-center gap-2 relative"
          title="Download all prompts as a markdown file"
        >
          <FileDown className="h-4 w-4" />
          <span>Download All</span>
        </Button>
      </div>

      {/* Category Selection */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {IMPLEMENTATION_CATEGORIES.map((category) => (
            <Button
              key={category}
              type="button"
              variant={currentCategory === category ? "default" : "outline"}
              onClick={() => {
                setCurrentCategory(category);
                // Set the prompt type to the next available one for this category
                setCurrentPromptType(getNextAvailablePromptType(category));
              }}
              className={
                errors[category] ? "border-red-500 dark:border-red-700" : ""
              }
            >
              {CATEGORY_LABELS[category]}
              {promptsData[category] && promptsData[category].length > 0 && (
                <span className="ml-2 bg-primary-700 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {promptsData[category].length}
                </span>
              )}
            </Button>
          ))}
        </div>

        {errors[currentCategory] && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-2 text-red-700 dark:text-red-400">
            <AlertCircle size={16} className="mt-0.5" />
            <span>{errors[currentCategory]}</span>
          </div>
        )}
      </div>

      {/* Prompts for the selected category */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">
            {CATEGORY_LABELS[currentCategory]} Prompts
          </h3>

          {/* Category-level buttons */}
          <div className="flex gap-2">
            {/* Use Sample Prompts button */}
            <Button
              type="button"
              onClick={() => loadSamplePromptsForCategory(currentCategory)}
              disabled={loadingSampleCategories[currentCategory]}
              variant="outline"
              className="flex items-center gap-2"
              title={`Load sample prompts for ${CATEGORY_LABELS[currentCategory]}`}
            >
              {loadingSampleCategories[currentCategory] ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M2 15h10" />
                    <path d="m9 18 3-3-3-3" />
                  </svg>
                  <span>Use Sample Prompts</span>
                </>
              )}
            </Button>

            {/* Generate Prompts button */}
            {hasAIFeatures && (
              <Button
                type="button"
                onClick={() => generatePromptsForCategory(currentCategory)}
                disabled={generatingCategories[currentCategory] || !projectId}
                variant="outline"
                className="flex items-center gap-2"
                title={`Generate prompts for ${CATEGORY_LABELS[currentCategory]} using AI`}
              >
                {generatingCategories[currentCategory] ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Prompts</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {promptsData[currentCategory]?.map((prompt) => (
            <Card
              key={prompt.id}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="inline-block px-2 py-1 text-xs rounded bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                  {PROMPT_TYPE_LABELS[prompt.type]}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyPromptToClipboard(prompt.content, prompt.id)
                    }
                    className="text-slate-500 hover:text-primary-500"
                    title="Copy prompt to clipboard"
                  >
                    {copiedPromptId === prompt.id ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                  {editingPrompt !== prompt.id && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          startEditingPrompt(currentCategory, prompt.id)
                        }
                        className="text-slate-500 hover:text-blue-500"
                        title="Edit prompt"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePrompt(currentCategory, prompt.id)}
                        className="text-slate-500 hover:text-red-500"
                        title="Delete prompt"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {editingPrompt === prompt.id ? (
                <div className="mt-2 space-y-3">
                  <Textarea
                    value={editPromptContent}
                    onChange={(e) => setEditPromptContent(e.target.value)}
                    rows={6}
                    className="w-full"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={cancelEditingPrompt}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={() =>
                        saveEditedPrompt(currentCategory, prompt.id)
                      }
                      disabled={!editPromptContent.trim()}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 text-sm mt-2">
                  {prompt.content}
                </p>
              )}
            </Card>
          ))}
        </div>

        {/* Add New Prompt - only show if not all prompt types exist for this category */}
        {!allPromptTypesExistForCategory(currentCategory) && (
          <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
            <h4 className="text-md font-medium text-slate-700 dark:text-slate-200">
              Add New Prompt
            </h4>

            <div className="flex gap-4 mb-2">
              <Select
                id="prompt-type"
                value={currentPromptType}
                onChange={(e) =>
                  setCurrentPromptType(
                    e.target.value as ImplementationPromptType
                  )
                }
                className="w-40"
              >
                {/* Only show prompt types that don't exist for this category */}
                {!promptsData[currentCategory]?.some(
                  (p) => p.type === ImplementationPromptType.MAIN
                ) && (
                  <option value={ImplementationPromptType.MAIN}>
                    Main Prompt
                  </option>
                )}
                {!promptsData[currentCategory]?.some(
                  (p) => p.type === ImplementationPromptType.FOLLOWUP_1
                ) && (
                  <option value={ImplementationPromptType.FOLLOWUP_1}>
                    Follow-up 1
                  </option>
                )}
                {!promptsData[currentCategory]?.some(
                  (p) => p.type === ImplementationPromptType.FOLLOWUP_2
                ) && (
                  <option value={ImplementationPromptType.FOLLOWUP_2}>
                    Follow-up 2
                  </option>
                )}
              </Select>
            </div>

            <Textarea
              value={newPromptContent}
              onChange={(e) => setNewPromptContent(e.target.value)}
              placeholder={`Enter a prompt for ${CATEGORY_LABELS[currentCategory]}...`}
              rows={5}
              className="w-full"
            />

            <Button
              type="button"
              onClick={addPrompt}
              disabled={!newPromptContent.trim()}
              variant={!newPromptContent.trim() ? "outline" : "default"}
              className={`flex gap-2 ${
                !newPromptContent.trim() ? "cursor-not-allowed" : ""
              }`}
            >
              <PlusCircle size={18} />
              <span>Add Prompt</span>
            </Button>
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
          {isSubmitting ? "Saving..." : "Save Implementation Prompts"}
        </Button>
      </div>
    </form>
  );
}
