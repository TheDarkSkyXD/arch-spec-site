import { useState, useEffect, useRef } from "react";
import {
  Trash2,
  ToggleLeft,
  ToggleRight,
  Layers,
  Loader2,
  Edit,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  RefreshCw,
  Lock,
} from "lucide-react";
import { Pages } from "../../types/templates";
import { pagesService } from "../../services/pagesService";
import { useToast } from "../../contexts/ToastContext";
import { projectsService } from "../../services/projectsService";
import { featuresService } from "../../services/featuresService";
import { requirementsService } from "../../services/requirementsService";
import { aiService } from "../../services/aiService";
import { PageComponent } from "../../services/aiService";
import { useSubscription } from "../../contexts/SubscriptionContext";
import AIInstructionsModal from "../ui/AIInstructionsModal";

// Import shadcn UI components
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";
import { Label } from "../ui/label";
import { PremiumFeatureBadge, ProcessingOverlay } from "../ui/index";

interface PagesFormProps {
  initialData?: Pages;
  projectId?: string;
  onSuccess?: (data: Pages) => void;
}

export default function PagesForm({
  initialData,
  projectId,
  onSuccess,
}: PagesFormProps) {
  const { showToast } = useToast();
  const { hasAIFeatures } = useSubscription();
  const [publicPages, setPublicPages] = useState<PageComponent[]>(
    initialData?.public || []
  );
  const [authenticatedPages, setAuthenticatedPages] = useState<PageComponent[]>(
    initialData?.authenticated || []
  );
  const [adminPages, setAdminPages] = useState<PageComponent[]>(
    initialData?.admin || []
  );
  const [activeTab, setActiveTab] = useState<
    "public" | "authenticated" | "admin"
  >("public");
  const [newPageName, setNewPageName] = useState("");
  const [newPagePath, setNewPagePath] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Add state for error and success messages
  const [error, setError] = useState<string>("");

  // Add state for AI enhancement
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isAddingPages, setIsAddingPages] = useState<boolean>(false);
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [projectFeatures, setProjectFeatures] = useState<
    { name: string; description: string; enabled: boolean }[]
  >([]);
  const [requirements, setRequirements] = useState<string[]>([]);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingPageType, setEditingPageType] = useState<
    "public" | "authenticated" | "admin"
  >("public");
  const [editingPageIndex, setEditingPageIndex] = useState<number | null>(null);

  // Component management state
  const [expandedPageIndex, setExpandedPageIndex] = useState<number | null>(
    null
  );
  const [expandedPageType, setExpandedPageType] = useState<
    "public" | "authenticated" | "admin"
  >("public");
  const [newComponentName, setNewComponentName] = useState("");
  const [editingComponentIndex, setEditingComponentIndex] = useState<
    number | null
  >(null);

  // Add a ref for the new component input
  const newComponentInputRef = useRef<HTMLInputElement>(null);

  // Add state for AI instructions modals
  const [isEnhanceModalOpen, setIsEnhanceModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Effect to update local state when initial data changes
  useEffect(() => {
    if (initialData) {
      setPublicPages(initialData.public || []);
      setAuthenticatedPages(initialData.authenticated || []);
      setAdminPages(initialData.admin || []);
    }
  }, [initialData]);

  // Focus maintenance effect - moved from ComponentsEditor
  useEffect(() => {
    if (
      newComponentName &&
      newComponentInputRef.current &&
      expandedPageIndex !== null
    ) {
      newComponentInputRef.current.focus();
    }
  }, [newComponentName, expandedPageIndex]);

  // Fetch pages if projectId is provided but no initialData
  useEffect(() => {
    const fetchPages = async () => {
      if (projectId && !initialData) {
        setIsLoading(true);
        try {
          const pagesData = await pagesService.getPages(projectId);
          if (pagesData) {
            console.log("Fetched pages data:", pagesData);
            setPublicPages(pagesData.public || []);
            setAuthenticatedPages(pagesData.authenticated || []);
            setAdminPages(pagesData.admin || []);
          }
        } catch (error) {
          console.error("Error fetching pages:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPages();
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
        if (featuresData && featuresData.coreModules) {
          // Make sure each feature has the required 'enabled' property
          const formattedFeatures = featuresData.coreModules.map((feature) => ({
            ...feature,
            enabled: feature.enabled !== undefined ? feature.enabled : true,
          }));
          setProjectFeatures(formattedFeatures);
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

  // Function to open the enhance pages modal
  const openEnhanceModal = () => {
    // Return early if the user doesn't have access to AI features
    if (!hasAIFeatures) {
      showToast({
        title: "Premium Feature",
        description: "Upgrade to Premium to use AI-powered features",
        type: "info",
      });
      return;
    }

    if (!projectId) {
      showToast({
        title: "Error",
        description: "Project must be saved before pages can be enhanced",
        type: "error",
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: "Warning",
        description:
          "Project description is missing. Pages may not be properly enhanced.",
        type: "warning",
      });
    }

    if (projectFeatures.length === 0) {
      showToast({
        title: "Warning",
        description:
          "No features found. Pages will be based only on project description.",
        type: "warning",
      });
    }

    setIsEnhanceModalOpen(true);
  };

  // Function to open the add pages modal
  const openAddModal = () => {
    // Return early if the user doesn't have access to AI features
    if (!hasAIFeatures) {
      showToast({
        title: "Premium Feature",
        description: "Upgrade to Premium to use AI-powered features",
        type: "info",
      });
      return;
    }

    if (!projectId) {
      showToast({
        title: "Error",
        description: "Project must be saved before pages can be enhanced",
        type: "error",
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: "Warning",
        description:
          "Project description is missing. Pages may not be properly generated.",
        type: "warning",
      });
    }

    setIsAddModalOpen(true);
  };

  // Modified function to enhance pages using AI (replace existing pages)
  const enhancePages = async (additionalInstructions?: string) => {
    setIsEnhancing(true);
    try {
      console.log("Enhancing pages with AI...");

      // Create the current pages data to pass
      const currentPages = {
        public: publicPages,
        authenticated: authenticatedPages,
        admin: adminPages,
      };

      const enhancedPages = await aiService.enhancePages(
        projectDescription,
        projectFeatures,
        requirements,
        // Only pass existing pages if we have some
        publicPages.length > 0 ||
          authenticatedPages.length > 0 ||
          adminPages.length > 0
          ? currentPages
          : undefined,
        additionalInstructions
      );

      if (enhancedPages) {
        // Replace existing pages with enhanced ones
        setPublicPages(enhancedPages.public || []);
        setAuthenticatedPages(enhancedPages.authenticated || []);
        setAdminPages(enhancedPages.admin || []);

        showToast({
          title: "Success",
          description: "Pages enhanced successfully",
          type: "success",
        });
      } else {
        showToast({
          title: "Warning",
          description: "No enhanced pages returned",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error enhancing pages:", error);
      showToast({
        title: "Error",
        description: "Failed to enhance pages",
        type: "error",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  // Modified function to add AI-generated pages without replacing existing ones
  const addAIPages = async (additionalInstructions?: string) => {
    setIsAddingPages(true);
    try {
      // When adding new pages, we don't pass the existing pages to avoid duplication
      const enhancedPages = await aiService.enhancePages(
        projectDescription,
        projectFeatures,
        requirements,
        undefined,
        additionalInstructions
      );

      if (enhancedPages) {
        // Add new pages to existing ones (avoiding duplicates by path)
        const existingPublicPaths = new Set(publicPages.map((p) => p.path));
        const newPublicPages = enhancedPages.public.filter(
          (p) => !existingPublicPaths.has(p.path)
        );

        const existingAuthPaths = new Set(
          authenticatedPages.map((p) => p.path)
        );
        const newAuthPages = enhancedPages.authenticated.filter(
          (p) => !existingAuthPaths.has(p.path)
        );

        const existingAdminPaths = new Set(adminPages.map((p) => p.path));
        const newAdminPages = enhancedPages.admin.filter(
          (p) => !existingAdminPaths.has(p.path)
        );

        // Update state with combined pages
        setPublicPages([...publicPages, ...newPublicPages]);
        setAuthenticatedPages([...authenticatedPages, ...newAuthPages]);
        setAdminPages([...adminPages, ...newAdminPages]);

        const totalNewPages =
          newPublicPages.length + newAuthPages.length + newAdminPages.length;

        showToast({
          title: "Success",
          description: `Added ${totalNewPages} new pages`,
          type: "success",
        });
      } else {
        showToast({
          title: "Warning",
          description: "No new pages generated",
          type: "warning",
        });
      }
    } catch (error) {
      console.error("Error adding AI pages:", error);
      showToast({
        title: "Error",
        description: "Failed to generate new pages",
        type: "error",
      });
    } finally {
      setIsAddingPages(false);
    }
  };

  const handleTogglePage = (
    type: "public" | "authenticated" | "admin",
    index: number
  ) => {
    let pages: PageComponent[] = [];
    let setPages: React.Dispatch<React.SetStateAction<PageComponent[]>>;

    if (type === "public") {
      pages = [...publicPages];
      setPages = setPublicPages;
    } else if (type === "authenticated") {
      pages = [...authenticatedPages];
      setPages = setAuthenticatedPages;
    } else {
      pages = [...adminPages];
      setPages = setAdminPages;
    }

    pages[index] = {
      ...pages[index],
      enabled: !pages[index].enabled,
    };

    setPages(pages);
  };

  const validatePageForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newPageName.trim()) {
      newErrors.name = "Page name is required";
    }

    if (!newPagePath.trim()) {
      newErrors.path = "Page path is required";
    } else if (!newPagePath.startsWith("/")) {
      newErrors.path = "Path must start with /";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPage = () => {
    if (!validatePageForm()) return;

    const newPage: PageComponent = {
      name: newPageName.trim(),
      path: newPagePath.trim(),
      components: [],
      enabled: true,
    };

    if (activeTab === "public") {
      setPublicPages([...publicPages, newPage]);
    } else if (activeTab === "authenticated") {
      setAuthenticatedPages([...authenticatedPages, newPage]);
    } else {
      setAdminPages([...adminPages, newPage]);
    }

    resetPageForm();

    showToast({
      title: "Success",
      description: "New page added successfully",
      type: "success",
    });
  };

  const handleEditPage = () => {
    if (editingPageIndex === null || !validatePageForm()) return;

    const updatedPage: PageComponent = {
      name: newPageName.trim(),
      path: newPagePath.trim(),
      components: [],
      enabled: true,
    };

    // Preserve existing components if available
    if (editingPageType === "public" && publicPages[editingPageIndex]) {
      updatedPage.components = [...publicPages[editingPageIndex].components];
      updatedPage.enabled = publicPages[editingPageIndex].enabled;
    } else if (
      editingPageType === "authenticated" &&
      authenticatedPages[editingPageIndex]
    ) {
      updatedPage.components = [
        ...authenticatedPages[editingPageIndex].components,
      ];
      updatedPage.enabled = authenticatedPages[editingPageIndex].enabled;
    } else if (editingPageType === "admin" && adminPages[editingPageIndex]) {
      updatedPage.components = [...adminPages[editingPageIndex].components];
      updatedPage.enabled = adminPages[editingPageIndex].enabled;
    }

    // Update the appropriate pages array
    if (editingPageType === "public") {
      const updatedPages = [...publicPages];
      updatedPages[editingPageIndex] = updatedPage;
      setPublicPages(updatedPages);
    } else if (editingPageType === "authenticated") {
      const updatedPages = [...authenticatedPages];
      updatedPages[editingPageIndex] = updatedPage;
      setAuthenticatedPages(updatedPages);
    } else {
      const updatedPages = [...adminPages];
      updatedPages[editingPageIndex] = updatedPage;
      setAdminPages(updatedPages);
    }

    // Reset form and editing state
    resetPageForm();

    showToast({
      title: "Success",
      description: "Page updated successfully",
      type: "success",
    });
  };

  const handleStartEditPage = (
    type: "public" | "authenticated" | "admin",
    index: number
  ) => {
    // Set the active tab to match the page being edited
    setActiveTab(type);

    // Get the page to edit
    let pageToEdit: PageComponent | null = null;

    if (type === "public" && publicPages[index]) {
      pageToEdit = publicPages[index];
    } else if (type === "authenticated" && authenticatedPages[index]) {
      pageToEdit = authenticatedPages[index];
    } else if (type === "admin" && adminPages[index]) {
      pageToEdit = adminPages[index];
    }

    if (!pageToEdit) return;

    // Set form data with the page details
    setNewPageName(pageToEdit.name);
    setNewPagePath(pageToEdit.path);

    // Set editing state
    setIsEditing(true);
    setEditingPageType(type);
    setEditingPageIndex(index);

    // Close any expanded components section
    setExpandedPageIndex(null);
  };

  const resetPageForm = () => {
    setNewPageName("");
    setNewPagePath("");
    setIsEditing(false);
    setEditingPageIndex(null);
    setErrors({});
  };

  const handleRemovePage = (
    type: "public" | "authenticated" | "admin",
    index: number
  ) => {
    if (type === "public") {
      setPublicPages(publicPages.filter((_, i) => i !== index));
    } else if (type === "authenticated") {
      setAuthenticatedPages(authenticatedPages.filter((_, i) => i !== index));
    } else {
      setAdminPages(adminPages.filter((_, i) => i !== index));
    }

    // If the removed page was expanded, close the expanded section
    if (expandedPageIndex === index && expandedPageType === type) {
      setExpandedPageIndex(null);
    }

    showToast({
      title: "Success",
      description: "Page removed successfully",
      type: "success",
    });
  };

  // Component Management Functions
  const togglePageExpand = (
    type: "public" | "authenticated" | "admin",
    index: number
  ) => {
    if (expandedPageIndex === index && expandedPageType === type) {
      // Close if already open
      setExpandedPageIndex(null);
    } else {
      // Open new one
      setExpandedPageIndex(index);
      setExpandedPageType(type);
      // Close any editing
      setEditingComponentIndex(null);
    }

    // Reset new component form
    setNewComponentName("");
  };

  const getExpandedPage = (): PageComponent | null => {
    if (expandedPageIndex === null) return null;

    if (expandedPageType === "public" && publicPages[expandedPageIndex]) {
      return publicPages[expandedPageIndex];
    } else if (
      expandedPageType === "authenticated" &&
      authenticatedPages[expandedPageIndex]
    ) {
      return authenticatedPages[expandedPageIndex];
    } else if (expandedPageType === "admin" && adminPages[expandedPageIndex]) {
      return adminPages[expandedPageIndex];
    }

    return null;
  };

  const updatePageComponents = (components: string[]) => {
    if (expandedPageIndex === null) return;

    // Create a copy of the page with updated components
    let updatedPage: PageComponent;

    if (expandedPageType === "public") {
      updatedPage = { ...publicPages[expandedPageIndex], components };
      const updatedPages = [...publicPages];
      updatedPages[expandedPageIndex] = updatedPage;
      setPublicPages(updatedPages);
    } else if (expandedPageType === "authenticated") {
      updatedPage = { ...authenticatedPages[expandedPageIndex], components };
      const updatedPages = [...authenticatedPages];
      updatedPages[expandedPageIndex] = updatedPage;
      setAuthenticatedPages(updatedPages);
    } else {
      updatedPage = { ...adminPages[expandedPageIndex], components };
      const updatedPages = [...adminPages];
      updatedPages[expandedPageIndex] = updatedPage;
      setAdminPages(updatedPages);
    }
  };

  const handleAddComponent = () => {
    if (!newComponentName.trim()) {
      showToast({
        title: "Error",
        description: "Component name is required",
        type: "error",
      });
      return;
    }

    const expandedPage = getExpandedPage();
    if (!expandedPage) return;

    const updatedComponents = [
      ...expandedPage.components,
      newComponentName.trim(),
    ];
    updatePageComponents(updatedComponents);
    setNewComponentName("");

    showToast({
      title: "Success",
      description: "Component added successfully",
      type: "success",
    });
  };

  const handleEditComponent = (index: number, newName: string) => {
    if (!newName.trim()) return;

    const expandedPage = getExpandedPage();
    if (!expandedPage) return;

    const updatedComponents = [...expandedPage.components];
    updatedComponents[index] = newName.trim();

    updatePageComponents(updatedComponents);
    setEditingComponentIndex(null);

    showToast({
      title: "Success",
      description: "Component updated successfully",
      type: "success",
    });
  };

  const handleDeleteComponent = (index: number) => {
    const expandedPage = getExpandedPage();
    if (!expandedPage) return;

    const updatedComponents = expandedPage.components.filter(
      (_, i) => i !== index
    );
    updatePageComponents(updatedComponents);

    showToast({
      title: "Success",
      description: "Component removed successfully",
      type: "success",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setError("");

    if (!projectId) {
      const errorMessage = "Project must be saved before pages can be saved";
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
        public: publicPages,
        authenticated: authenticatedPages,
        admin: adminPages,
      };

      const result = await pagesService.savePages(projectId, data);

      if (result) {
        showToast({
          title: "Success",
          description: "Pages saved successfully",
          type: "success",
        });

        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        const errorMessage = "Failed to save pages";
        showToast({
          title: "Error",
          description: errorMessage,
          type: "error",
        });
        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Error saving pages:", error);
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

  // Component to render the components list and editor for a page
  const ComponentsEditor = () => {
    const page = getExpandedPage();
    if (!page) return null;

    return (
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Components
        </h4>

        {/* Components list */}
        {page.components.length === 0 ? (
          <div className="text-sm text-slate-500 dark:text-slate-400 italic">
            No components added yet
          </div>
        ) : (
          <ul className="space-y-2">
            {page.components.map((component, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
              >
                {editingComponentIndex === idx ? (
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      defaultValue={component}
                      className="flex-1 p-1 text-sm border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditComponent(idx, e.currentTarget.value);
                        } else if (e.key === "Escape") {
                          setEditingComponentIndex(null);
                        }
                      }}
                      onBlur={(e) => handleEditComponent(idx, e.target.value)}
                    />
                    <button
                      onClick={() => setEditingComponentIndex(null)}
                      className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {component}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingComponentIndex(idx)}
                        className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        title="Edit component"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteComponent(idx)}
                        className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Remove component"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Add new component form */}
        <div className="flex space-x-2 mt-2">
          <input
            ref={newComponentInputRef}
            type="text"
            value={newComponentName}
            onChange={(e) => setNewComponentName(e.target.value)}
            placeholder="New component name"
            className="flex-1 p-2 text-sm border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newComponentName.trim()) {
                e.preventDefault();
                handleAddComponent();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddComponent}
            disabled={!newComponentName.trim()}
            className={`flex items-center px-3 py-1 rounded text-sm ${
              !newComponentName.trim()
                ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700 dark:hover:bg-primary-500"
            }`}
          >
            <Plus size={14} className="mr-1" />
            Add
          </button>
        </div>
      </div>
    );
  };

  // Render page card
  const renderPageCard = (
    page: PageComponent,
    index: number,
    type: "public" | "authenticated" | "admin"
  ) => {
    const isExpanded = expandedPageIndex === index && expandedPageType === type;

    return (
      <div
        key={index}
        className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden"
      >
        <div className="p-3 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {page.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({page.path})
              </span>
            </div>
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
              <Layers size={12} className="mr-1" />
              <span>{page.components.length} components</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => togglePageExpand(type, index)}
              className="p-1 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-500"
              title={isExpanded ? "Collapse components" : "Expand components"}
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <button
              type="button"
              onClick={() => handleStartEditPage(type, index)}
              className="p-1 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-500"
              title="Edit page"
            >
              <Edit size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleTogglePage(type, index)}
              className="p-1 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-500"
              title={page.enabled ? "Disable page" : "Enable page"}
            >
              {page.enabled ? (
                <ToggleRight
                  size={20}
                  className="text-primary-600 dark:text-primary-500"
                />
              ) : (
                <ToggleLeft size={20} />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleRemovePage(type, index)}
              className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
              title="Remove page"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="px-3 pb-3">
            <ComponentsEditor />
          </div>
        )}
      </div>
    );
  };

  // Helper function to check if any AI operation is in progress
  const isAnyEnhancementInProgress = () => {
    return isEnhancing || isAddingPages;
  };

  // Helper to get the appropriate message for the overlay
  const getEnhancementMessage = () => {
    if (isEnhancing) {
      return "AI is analyzing your project to generate an optimal page structure. Please wait...";
    }
    if (isAddingPages) {
      return "AI is generating additional pages based on your project requirements. Please wait...";
    }
    return "AI enhancement in progress...";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
        <span className="text-slate-600 dark:text-slate-300">
          Loading pages...
        </span>
      </div>
    );
  }

  return (
    <form
      id="pages-form"
      onSubmit={handleSubmit}
      className="space-y-8 relative"
    >
      {/* Processing Overlay */}
      <ProcessingOverlay
        isVisible={isAnyEnhancementInProgress()}
        message={getEnhancementMessage()}
        opacity={0.6}
      />

      {/* AI Instructions Modals */}
      <AIInstructionsModal
        isOpen={isEnhanceModalOpen}
        onClose={() => setIsEnhanceModalOpen(false)}
        onConfirm={(instructions) => enhancePages(instructions)}
        title="Enhance All Pages"
        description="The AI will replace your current pages with an optimized structure based on your project requirements and features."
        confirmText="Replace Pages"
      />

      <AIInstructionsModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={(instructions) => addAIPages(instructions)}
        title="Generate Additional Pages"
        description="The AI will generate new pages to complement your existing ones based on your project requirements and features."
        confirmText="Add Pages"
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Application Pages
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Define the pages that will be included in your application.
          </p>
        </div>

        {/* AI Enhancement Buttons */}
        <div className="flex justify-end items-center gap-3 mb-4">
          {!hasAIFeatures && <PremiumFeatureBadge />}
          <Button
            type="button"
            onClick={openAddModal}
            disabled={
              isAddingPages || isEnhancing || !projectId || !hasAIFeatures
            }
            variant={hasAIFeatures ? "outline" : "ghost"}
            className={`flex items-center gap-2 relative ${
              !hasAIFeatures ? "opacity-50 cursor-not-allowed" : ""
            } ${isAddingPages ? "relative z-[60]" : ""}`}
            title={
              hasAIFeatures
                ? "Generate additional pages to complement existing ones"
                : "Upgrade to Premium to use AI-powered features"
            }
          >
            {isAddingPages ? (
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
                <span>Add AI Pages</span>
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={openEnhanceModal}
            disabled={
              isEnhancing || isAddingPages || !projectId || !hasAIFeatures
            }
            variant={hasAIFeatures ? "outline" : "ghost"}
            className={`flex items-center gap-2 relative ${
              !hasAIFeatures ? "opacity-50 cursor-not-allowed" : ""
            } ${isEnhancing ? "relative z-[60]" : ""}`}
            title={
              hasAIFeatures
                ? "Replace all pages with AI-generated ones"
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

        <Card className="overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab("public")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "public"
                  ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              Public Pages
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("authenticated")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "authenticated"
                  ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              Authenticated Pages
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "admin"
                  ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              Admin Pages
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-4">
            <div className={activeTab === "public" ? "block" : "hidden"}>
              {publicPages.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                  No public pages defined yet
                </p>
              ) : (
                <div className="space-y-2">
                  {publicPages.map((page, index) =>
                    renderPageCard(page, index, "public")
                  )}
                </div>
              )}
            </div>

            <div className={activeTab === "authenticated" ? "block" : "hidden"}>
              {authenticatedPages.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                  No authenticated pages defined yet
                </p>
              ) : (
                <div className="space-y-2">
                  {authenticatedPages.map((page, index) =>
                    renderPageCard(page, index, "authenticated")
                  )}
                </div>
              )}
            </div>

            <div className={activeTab === "admin" ? "block" : "hidden"}>
              {adminPages.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                  No admin pages defined yet
                </p>
              ) : (
                <div className="space-y-2">
                  {adminPages.map((page, index) =>
                    renderPageCard(page, index, "admin")
                  )}
                </div>
              )}
            </div>

            {/* Add/Edit Page Form */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isEditing
                    ? "Edit Page"
                    : `Add a New ${
                        activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                      } Page`}
                </h3>
                {isEditing && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={resetPageForm}
                    className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
                  >
                    <X size={18} />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pageName">Page Name</Label>
                  <Input
                    id="pageName"
                    type="text"
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    placeholder="e.g. Home, About, Dashboard"
                    error={errors.name}
                  />
                </div>

                <div>
                  <Label htmlFor="pagePath">Page Path</Label>
                  <Input
                    id="pagePath"
                    type="text"
                    value={newPagePath}
                    onChange={(e) => setNewPagePath(e.target.value)}
                    placeholder="e.g. /, /about, /dashboard"
                    error={errors.path}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                {isEditing ? (
                  <div className="space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetPageForm}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleEditPage}
                      disabled={!newPageName || !newPagePath}
                      variant={
                        !newPageName || !newPagePath ? "outline" : "default"
                      }
                      className={
                        !newPageName || !newPagePath
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    >
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={handleAddPage}
                    disabled={!newPageName || !newPagePath}
                    variant={
                      !newPageName || !newPagePath ? "outline" : "default"
                    }
                    className={
                      !newPageName || !newPagePath
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  >
                    Add Page
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
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
          {isSubmitting ? "Saving..." : "Save Pages"}
        </Button>
      </div>
    </form>
  );
}
