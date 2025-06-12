import { Check, Copy, Grid, Layout, Loader2, Lock, Palette, Save, Sparkles, Type } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useToast } from '../../contexts/ToastContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { aiService } from '../../services/aiService';
import { FeatureModule, featuresService } from '../../services/featuresService';
import { projectsService } from '../../services/projectsService';
import { requirementsService } from '../../services/requirementsService';
import { uiDesignService } from '../../services/uiDesignService';
import { UIDesign } from '../../types/templates';
import AIInstructionsModal from '../ui/AIInstructionsModal';
import { PremiumFeatureBadge, ProcessingOverlay } from '../ui/index';

// Import components for each tab
import ColorSettings from './ui-design/ColorSettings';
import ComponentSettings from './ui-design/ComponentSettings';
import LayoutSettings from './ui-design/LayoutSettings';
import TypographySettings from './ui-design/TypographySettings';

// Import constants
import {
  buttonStyles,
  cardStyles,
  fontOptions,
  initialDesign,
  inputStyles,
  navStyles,
  tableStyles
} from './ui-design/constants';

// Import animations CSS
import '../../styles/animations.css';

// Import shadcn UI components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog';
import Button from '../ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface UIDesignFormProps {
  initialData?: UIDesign;
  projectId?: string;
  projectName?: string;
  onSuccess?: (data: UIDesign) => void;
}

export default function UIDesignForm({ initialData, projectId, onSuccess }: UIDesignFormProps) {
  const { showToast } = useToast();
  const { hasAIFeatures } = useSubscription();
  const [uiDesign, setUIDesign] = useState<UIDesign>(initialData || initialDesign);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const { aiCreditsRemaining } = useUserProfile();

  // Add state for unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [initialUIDesign, setInitialUIDesign] = useState<UIDesign | null>(null);
  const [activeTab, setActiveTab] = useState<string>('colors'); // Track active tab

  // Add state for tab change confirmation dialog
  const [isTabChangeDialogOpen, setIsTabChangeDialogOpen] = useState<boolean>(false);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);

  // Add state for AI enhancement
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [features, setFeatures] = useState<FeatureModule[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);

  // Add state for AI instructions modal
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  
  // Add state for tracking if the form has been saved at least once
  const [hasBeenSaved, setHasBeenSaved] = useState<boolean>(!!initialData);

  // Effect to update local state when initial data changes
  useEffect(() => {
    if (initialData) {
      setUIDesign(initialData);
      setInitialUIDesign(JSON.parse(JSON.stringify(initialData))); // Deep copy to avoid reference issues
      setHasBeenSaved(true);
    }
  }, [initialData]);

  // Effect to track unsaved changes
  useEffect(() => {
    if (!initialUIDesign) return;
    
    // Compare current design with initial design
    const currentDesignJson = JSON.stringify(uiDesign);
    const initialDesignJson = JSON.stringify(initialUIDesign);
    
    setHasUnsavedChanges(currentDesignJson !== initialDesignJson);
  }, [uiDesign, initialUIDesign]);

  // Fetch UI design if projectId is provided but no initialData
  useEffect(() => {
    const fetchUIDesign = async () => {
      if (projectId && !initialData) {
        setIsLoading(true);
        try {
          const uiDesignData = await uiDesignService.getUIDesign(projectId);
          if (uiDesignData) {
            console.log('Fetched UI design data:', uiDesignData);
            setUIDesign(uiDesignData);
            setInitialUIDesign(JSON.parse(JSON.stringify(uiDesignData))); // Deep copy
            setHasBeenSaved(true);
          }
        } catch (error) {
          console.error('Error fetching UI design:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUIDesign();
  }, [projectId, initialData]);

  // Fetch project info for AI enhancement
  const fetchProjectInfo = async () => {
    if (!projectId) return;

    try {
      // Fetch project details including description
      const projectDetails = await projectsService.getProjectById(projectId);

      if (projectDetails) {
        setProjectDescription(projectDetails.description || '');

        // Fetch requirements
        const requirementsData = await requirementsService.getRequirements(projectId);
        if (requirementsData) {
          // Combine functional and non-functional requirements
          const allRequirements = [
            ...(requirementsData.functional || []),
            ...(requirementsData.non_functional || []),
          ];
          setRequirements(allRequirements);
        }

        // Fetch features
        const featuresData = await featuresService.getFeatures(projectId);
        if (featuresData) {
          setFeatures(featuresData.coreModules || []);
        }
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  // Add effect to fetch project info
  useEffect(() => {
    if (projectId) {
      fetchProjectInfo();
    }
  }, [projectId]);

  // Function to handle tab changes
  const handleTabChange = (value: string) => {
    // Don't do anything if trying to switch to the current tab
    if (value === activeTab) return;
    
    // If there are unsaved changes, open the confirmation dialog
    if (hasUnsavedChanges) {
      setPendingTabChange(value);
      setIsTabChangeDialogOpen(true);
    } else {
      // No unsaved changes, switch tab directly
      setActiveTab(value);
    }
  };

  // Function to confirm tab change
  const confirmTabChange = () => {
    if (pendingTabChange && initialUIDesign) {
      // Reset the form to the initial data
      setUIDesign(JSON.parse(JSON.stringify(initialUIDesign)));
      setHasUnsavedChanges(false);
      setActiveTab(pendingTabChange);
    }
    
    // Close the dialog and reset pending tab
    setIsTabChangeDialogOpen(false);
    setPendingTabChange(null);
  };
  
  // Function to cancel tab change
  const cancelTabChange = () => {
    setIsTabChangeDialogOpen(false);
    setPendingTabChange(null);
  };

  // Function to open the AI design enhancement modal
  const openAIModal = () => {
    // Check if user has remaining AI credits
    if (aiCreditsRemaining <= 0) {
      showToast({
        title: 'Insufficient AI Credits',
        description: "You've used all your AI credits for this billing period",
        type: 'warning',
      });
      return;
    }

    // Check if user has access to AI features
    if (!hasAIFeatures) {
      showToast({
        title: 'Premium Feature',
        description: 'Upgrade to Premium to use AI-powered features',
        type: 'info',
      });
      return;
    }

    if (!projectId) {
      showToast({
        title: 'Error',
        description: 'Project must be saved before UI design can be enhanced',
        type: 'error',
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: 'Warning',
        description: 'Project description is missing. UI design may not be properly enhanced.',
        type: 'warning',
      });
    }

    setIsAIModalOpen(true);
  };

  // Modified function to enhance UI design using AI
  const enhanceUIDesign = async (additionalInstructions?: string) => {
    setIsEnhancing(true);
    setError('');

    try {
      const enhancedUIDesign = await aiService.enhanceUIDesign(
        projectDescription,
        features,
        requirements,
        uiDesign,
        additionalInstructions
      );

      if (enhancedUIDesign) {
        // Update UI design with enhanced version
        setUIDesign(enhancedUIDesign);

        showToast({
          title: 'Success',
          description: 'UI design enhanced successfully',
          type: 'success',
        });
      } else {
        showToast({
          title: 'Warning',
          description: 'No enhanced UI design returned',
          type: 'warning',
        });
      }
    } catch (error) {
      console.error('Error enhancing UI design:', error);
      showToast({
        title: 'Error',
        description: 'Failed to enhance UI design',
        type: 'error',
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  // Handle color change
  const handleColorChange = (
    colorSection: 'colors' | 'darkMode.colors',
    colorName: string,
    value: string
  ) => {
    if (colorSection === 'colors') {
      setUIDesign({
        ...uiDesign,
        colors: {
          ...uiDesign.colors,
          [colorName]: value,
        },
      });
    } else {
      setUIDesign({
        ...uiDesign,
        darkMode: {
          ...uiDesign.darkMode,
          colors: {
            ...uiDesign.darkMode.colors,
            [colorName]: value,
          },
        },
      });
    }
  };

  // Handle typography change
  const handleTypographyChange = (typographyType: string, value: string | number) => {
    if (typographyType.startsWith('headingSizes.')) {
      const headingKey = typographyType.split('.')[1];
      setUIDesign({
        ...uiDesign,
        typography: {
          ...uiDesign.typography,
          headingSizes: {
            ...uiDesign.typography.headingSizes,
            [headingKey]: value,
          },
        },
      });
    } else {
      setUIDesign({
        ...uiDesign,
        typography: {
          ...uiDesign.typography,
          [typographyType]: value,
        },
      });
    }
  };

  // Handle spacing change
  const handleSpacingChange = (spacingType: string, value: string | number[]) => {
    setUIDesign({
      ...uiDesign,
      spacing: {
        ...uiDesign.spacing,
        [spacingType]: value,
      },
    });
  };

  // Handle border radius change
  const handleBorderRadiusChange = (sizeType: string, value: string) => {
    setUIDesign({
      ...uiDesign,
      borderRadius: {
        ...uiDesign.borderRadius,
        [sizeType]: value,
      },
    });
  };

  // Handle shadows change
  const handleShadowsChange = (shadowType: string, value: string) => {
    setUIDesign({
      ...uiDesign,
      shadows: {
        ...uiDesign.shadows,
        [shadowType]: value,
      },
    });
  };

  // Handle layout change
  const handleLayoutChange = (layoutType: string, value: string | number | boolean) => {
    setUIDesign({
      ...uiDesign,
      layout: {
        ...uiDesign.layout,
        [layoutType]: value,
      },
    });
  };

  // Handle component style change
  const handleComponentStyleChange = (componentType: string, value: string) => {
    setUIDesign({
      ...uiDesign,
      components: {
        ...uiDesign.components,
        [componentType]: value,
      },
    });
  };

  // Handle dark mode toggle
  const handleDarkModeToggle = (enabled: boolean) => {
    setUIDesign({
      ...uiDesign,
      darkMode: {
        ...uiDesign.darkMode,
        enabled,
      },
    });
  };

  // Handle animations change
  const handleAnimationsChange = (animationType: string, value: string | number | boolean) => {
    setUIDesign({
      ...uiDesign,
      animations: {
        ...uiDesign.animations,
        [animationType]: value,
      },
    });
  };

  // Copy CSS variables to clipboard
  const copyToClipboard = () => {
    const cssVariables = `
/* Color Variables */
:root {
  --color-primary: ${uiDesign.colors.primary};
  --color-secondary: ${uiDesign.colors.secondary};
  --color-accent: ${uiDesign.colors.accent};
  --color-background: ${uiDesign.colors.background};
  --color-text-primary: ${uiDesign.colors.textPrimary};
  --color-text-secondary: ${uiDesign.colors.textSecondary};
  --color-success: ${uiDesign.colors.success};
  --color-warning: ${uiDesign.colors.warning};
  --color-error: ${uiDesign.colors.error};
  --color-info: ${uiDesign.colors.info};
  --color-surface: ${uiDesign.colors.surface};
  --color-border: ${uiDesign.colors.border};

  /* Typography */
  --font-family: ${uiDesign.typography.fontFamily};
  --heading-font: ${uiDesign.typography.headingFont};
  --font-size-base: ${uiDesign.typography.fontSize};
  --line-height: ${uiDesign.typography.lineHeight};
  --font-weight: ${uiDesign.typography.fontWeight};
  --h1-size: ${uiDesign.typography.headingSizes.h1};
  --h2-size: ${uiDesign.typography.headingSizes.h2};
  --h3-size: ${uiDesign.typography.headingSizes.h3};
  --h4-size: ${uiDesign.typography.headingSizes.h4};
  --h5-size: ${uiDesign.typography.headingSizes.h5};
  --h6-size: ${uiDesign.typography.headingSizes.h6};

  /* Spacing */
  --spacing-unit: ${uiDesign.spacing.unit};

  /* Border Radius */
  --radius-small: ${uiDesign.borderRadius.small};
  --radius-medium: ${uiDesign.borderRadius.medium};
  --radius-large: ${uiDesign.borderRadius.large};
  --radius-xl: ${uiDesign.borderRadius.xl};
  --radius-pill: ${uiDesign.borderRadius.pill};

  /* Shadows */
  --shadow-small: ${uiDesign.shadows.small};
  --shadow-medium: ${uiDesign.shadows.medium};
  --shadow-large: ${uiDesign.shadows.large};
  --shadow-xl: ${uiDesign.shadows.xl};

  /* Layout */
  --container-width: ${uiDesign.layout.containerWidth};
  --sidebar-width: ${uiDesign.layout.sidebarWidth};
  --topbar-height: ${uiDesign.layout.topbarHeight};
  --grid-columns: ${uiDesign.layout.gridColumns};
  --gutter-width: ${uiDesign.layout.gutterWidth};

  /* Animations */
  --transition-duration: ${uiDesign.animations.transitionDuration};
  --transition-timing: ${uiDesign.animations.transitionTiming};
  --hover-scale: ${uiDesign.animations.hoverScale};
}

/* Dark Mode Variables */
.dark-mode {
  --color-background: ${uiDesign.darkMode.colors.background};
  --color-text-primary: ${uiDesign.darkMode.colors.textPrimary};
  --color-text-secondary: ${uiDesign.darkMode.colors.textSecondary};
  --color-surface: ${uiDesign.darkMode.colors.surface};
  --color-border: ${uiDesign.darkMode.colors.border};
}`;

    navigator.clipboard.writeText(cssVariables);
    setCopied(true);

    showToast({
      title: 'Copied!',
      description: 'CSS variables copied to clipboard',
      type: 'success',
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if we're in the middle of a tab change operation
    // This prevents form submissions triggered by tab changes
    const activeElement = document.activeElement;
    const isTabElement = activeElement?.closest('[role="tab"]') || 
                          activeElement?.closest('.tab-container');
    if (isTabElement) {
      console.log('Preventing submit during tab interaction');
      return;
    }

    // Clear previous messages
    setError('');

    if (!projectId) {
      const errorMessage = 'Project must be saved before UI design can be saved';
      showToast({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      });
      setError(errorMessage);
      return;
    }

    // Check if there are actual changes to save
    if (!hasUnsavedChanges) {
      console.log('No changes to save, skipping submission');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await uiDesignService.saveUIDesign(projectId, uiDesign);

      if (result) {
        showToast({
          title: 'Success',
          description: 'UI design saved successfully',
          type: 'success',
        });
        
        // Update initial design to match current design, resetting unsaved changes
        setInitialUIDesign(JSON.parse(JSON.stringify(uiDesign)));
        setHasUnsavedChanges(false);
        setHasBeenSaved(true);

        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        const errorMessage = 'Failed to save UI design';
        showToast({
          title: 'Error',
          description: errorMessage,
          type: 'error',
        });
        setError(errorMessage);
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      console.error('Error saving UI design:', error);
      const errorMessage = 'An unexpected error occurred';
      showToast({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      });
      setError(errorMessage);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary-600" />
        <span className="text-slate-600 dark:text-slate-300">Loading UI design data...</span>
      </div>
    );
  }

  return (
    <form id="ui-design-form" onSubmit={handleSubmit} className="relative space-y-6">
      {/* Processing Overlay */}
      <ProcessingOverlay
        isVisible={isEnhancing}
        message="AI is analyzing your project to enhance the UI design. Please wait..."
        opacity={0.6}
      />

      {/* AI Instructions Modal */}
      <AIInstructionsModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onConfirm={(instructions) => enhanceUIDesign(instructions)}
        title="Enhance UI Design"
        description="The AI will analyze your project requirements and features to recommend optimal UI design settings that match your application's purpose."
        confirmText="Generate Recommendations"
      />

      {/* Tab Change Confirmation Dialog */}
      <AlertDialog>
        <AlertDialogContent 
          isOpen={isTabChangeDialogOpen} 
          onClose={cancelTabChange}
          className="max-w-md"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in this tab. These changes will be lost if you navigate away. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelTabChange}>Stay Here</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTabChange}>Discard Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      
      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && (
        <div className="mb-4 flex items-center justify-between rounded-md bg-amber-50 p-3 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          <span>You have unsaved changes. Don't forget to save your UI design.</span>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => {
                if (initialUIDesign) {
                  setUIDesign(JSON.parse(JSON.stringify(initialUIDesign)));
                  setHasUnsavedChanges(false);
                }
              }}
            >
              Discard
            </Button>
            <Button 
              type="submit" 
              variant="default" 
              size="sm"
              disabled={isSubmitting || !projectId}
            >
              {isSubmitting ? 'Saving...' : 'Save Now'}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-100">
            UI Design
          </h2>
          <p className="mb-6 text-slate-600 dark:text-slate-400">
            Define the visual design system for your application.
          </p>
        </div>

        <div className="mb-4 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Copy CSS Variables'}</span>
          </Button>
          <div className="mb-4 flex items-center justify-end gap-3">
            {!hasAIFeatures && <PremiumFeatureBadge />}
            <Button
              type="button"
              onClick={openAIModal}
              disabled={isEnhancing || !projectId || !hasAIFeatures}
              variant={hasAIFeatures ? 'outline' : 'ghost'}
              className={`relative flex items-center gap-2 ${
                !hasAIFeatures ? 'cursor-not-allowed opacity-50' : ''
              }`}
              title={
                hasAIFeatures
                  ? 'Get AI recommendations for UI design'
                  : 'Upgrade to Premium to use AI-powered features'
              }
            >
              {isEnhancing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Enhancing...</span>
                </>
              ) : (
                <>
                  {hasAIFeatures ? <Sparkles className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  <span>AI Recommendations</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Using a div to isolate tabs from form submission */}
        <div 
          className="tab-container" 
          onClick={(e: React.MouseEvent) => {
            // Stop propagation at the container level to prevent form events
            e.stopPropagation();
          }}
          onKeyDown={(e: React.KeyboardEvent) => {
            // Prevent Enter key from submitting the form
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => {
              // Use setTimeout to break the event chain
              setTimeout(() => handleTabChange(value), 0);
            }} 
            className="w-full"
          >
            <TabsList className="mb-4 flex w-full justify-start overflow-x-auto overflow-y-hidden">
              <TabsTrigger value="colors" className="flex items-center">
                <Palette className="mr-2 h-4 w-4" />
                Colors
                {hasUnsavedChanges && activeTab === 'colors' && <span className="ml-1 text-amber-500">*</span>}
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center">
                <Type className="mr-2 h-4 w-4" />
                Typography
                {hasUnsavedChanges && activeTab === 'typography' && <span className="ml-1 text-amber-500">*</span>}
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center">
                <Layout className="mr-2 h-4 w-4" />
                Layout
                {hasUnsavedChanges && activeTab === 'layout' && <span className="ml-1 text-amber-500">*</span>}
              </TabsTrigger>
              <TabsTrigger value="components" className="flex items-center">
                <Grid className="mr-2 h-4 w-4" />
                Components
                {hasUnsavedChanges && activeTab === 'components' && <span className="ml-1 text-amber-500">*</span>}
              </TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-4">
              <ColorSettings 
                uiDesign={uiDesign}
                handleColorChange={handleColorChange}
                handleDarkModeToggle={handleDarkModeToggle}
              />
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-4">
              <TypographySettings 
                uiDesign={uiDesign}
                fontOptions={fontOptions}
                handleTypographyChange={handleTypographyChange}
              />
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-4">
              <LayoutSettings 
                uiDesign={uiDesign}
                handleLayoutChange={handleLayoutChange}
                handleSpacingChange={handleSpacingChange}
                handleBorderRadiusChange={handleBorderRadiusChange}
                handleShadowsChange={handleShadowsChange}
              />
            </TabsContent>

            {/* Components Tab */}
            <TabsContent value="components" className="space-y-4">
              <ComponentSettings 
                uiDesign={uiDesign}
                buttonStyles={buttonStyles}
                inputStyles={inputStyles}
                cardStyles={cardStyles}
                tableStyles={tableStyles}
                navStyles={navStyles}
                handleComponentStyleChange={handleComponentStyleChange}
                handleAnimationsChange={handleAnimationsChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || !projectId || !hasUnsavedChanges}
          variant={!projectId || isSubmitting || !hasUnsavedChanges ? 'outline' : 'default'}
          className={
            !projectId || isSubmitting || !hasUnsavedChanges
              ? 'cursor-not-allowed opacity-50'
              : hasUnsavedChanges ? 'animate-pulse' : ''
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {hasUnsavedChanges && <Save className="mr-2 h-4 w-4" />}
              {hasBeenSaved ? 'Save Changes' : 'Save UI Design'}
              {hasUnsavedChanges && '*'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
