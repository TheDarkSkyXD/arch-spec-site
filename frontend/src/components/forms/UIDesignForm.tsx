import { useState, useEffect } from "react";
import {
  Loader2,
  Save,
  Palette,
  Type,
  Layout,
  Grid,
  Check,
  Copy,
} from "lucide-react";
import { UIDesign } from "../../types/templates";
import { uiDesignService } from "../../services/uiDesignService";
import { useToast } from "../../contexts/ToastContext";

// Import shadcn UI components
import Button from "../ui/Button";
import Input from "../ui/Input";
import Card from "../ui/Card";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";

// Define initial UI design state
const initialDesign: UIDesign = {
  colors: {
    primary: "#3b82f6",
    secondary: "#6366f1",
    accent: "#f59e0b",
    background: "#ffffff",
    textPrimary: "#1f2937",
    textSecondary: "#4b5563",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",
    surface: "#ffffff",
    border: "#e5e7eb",
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    headingFont: "Inter, sans-serif",
    fontSize: "16px",
    lineHeight: 1.5,
    fontWeight: 400,
    headingSizes: {
      h1: "2.5rem",
      h2: "2rem",
      h3: "1.75rem",
      h4: "1.5rem",
      h5: "1.25rem",
      h6: "1rem",
    },
  },
  spacing: {
    unit: "4px",
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
  },
  borderRadius: {
    small: "2px",
    medium: "4px",
    large: "8px",
    xl: "12px",
    pill: "9999px",
  },
  shadows: {
    small: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    medium:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    large:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  layout: {
    containerWidth: "1280px",
    responsive: true,
    sidebarWidth: "240px",
    topbarHeight: "64px",
    gridColumns: 12,
    gutterWidth: "16px",
  },
  components: {
    buttonStyle: "rounded", // rounded, square, pill
    inputStyle: "outline", // outline, filled, underline
    cardStyle: "shadow", // shadow, outline, flat
    tableStyle: "bordered", // bordered, striped, minimal
    navStyle: "pills", // pills, tabs, links
  },
  darkMode: {
    enabled: true,
    colors: {
      background: "#1f2937",
      textPrimary: "#f9fafb",
      textSecondary: "#e5e7eb",
      surface: "#374151",
      border: "#4b5563",
    },
  },
  animations: {
    transitionDuration: "150ms",
    transitionTiming: "ease-in-out",
    hoverScale: 1.05,
    enableAnimations: true,
  },
};

// Font options
const fontOptions = [
  "Inter, sans-serif",
  "Roboto, sans-serif",
  "Open Sans, sans-serif",
  "Montserrat, sans-serif",
  "Poppins, sans-serif",
  "Lato, sans-serif",
  "Source Sans Pro, sans-serif",
  "Raleway, sans-serif",
  "Nunito, sans-serif",
  "System UI, sans-serif",
];

// Component style options
const buttonStyles = ["rounded", "square", "pill"];
const inputStyles = ["outline", "filled", "underline"];
const cardStyles = ["shadow", "outline", "flat"];
const tableStyles = ["bordered", "striped", "minimal"];
const navStyles = ["pills", "tabs", "links"];

interface UIDesignFormProps {
  initialData?: UIDesign;
  projectId?: string;
  projectName?: string;
  onSuccess?: (data: UIDesign) => void;
}

export default function UIDesignForm({
  initialData,
  projectId,
  onSuccess,
}: UIDesignFormProps) {
  const { showToast } = useToast();
  const [uiDesign, setUIDesign] = useState<UIDesign>(
    initialData || initialDesign
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Effect to update local state when initial data changes
  useEffect(() => {
    if (initialData) {
      setUIDesign(initialData);
    }
  }, [initialData]);

  // Fetch UI design if projectId is provided but no initialData
  useEffect(() => {
    const fetchUIDesign = async () => {
      if (projectId && !initialData) {
        setIsLoading(true);
        try {
          const uiDesignData = await uiDesignService.getUIDesign(projectId);
          if (uiDesignData) {
            console.log("Fetched UI design data:", uiDesignData);
            setUIDesign(uiDesignData);
          }
        } catch (error) {
          console.error("Error fetching UI design:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUIDesign();
  }, [projectId, initialData]);

  // Handle color change
  const handleColorChange = (
    colorSection: "colors" | "darkMode.colors",
    colorName: string,
    value: string
  ) => {
    if (colorSection === "colors") {
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
  const handleTypographyChange = (
    typographyType: string,
    value: string | number
  ) => {
    if (typographyType.startsWith("headingSizes.")) {
      const headingKey = typographyType.split(".")[1];
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
  const handleSpacingChange = (
    spacingType: string,
    value: string | number[]
  ) => {
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
  const handleLayoutChange = (
    layoutType: string,
    value: string | number | boolean
  ) => {
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
  const handleAnimationsChange = (
    animationType: string,
    value: string | number | boolean
  ) => {
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
      title: "Copied!",
      description: "CSS variables copied to clipboard",
      type: "success",
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    if (!projectId) {
      const errorMessage =
        "Project must be saved before UI design can be saved";
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
      const result = await uiDesignService.saveUIDesign(projectId, uiDesign);

      if (result) {
        const successMessage = "UI design saved successfully";
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
        const errorMessage = "Failed to save UI design";
        showToast({
          title: "Error",
          description: errorMessage,
          type: "error",
        });
        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Error saving UI design:", error);
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

  // Render color picker component
  const renderColorPicker = (
    section: "colors" | "darkMode.colors",
    colorName: string,
    label: string
  ) => {
    const colorValue =
      section === "colors"
        ? uiDesign.colors[colorName as keyof typeof uiDesign.colors]
        : uiDesign.darkMode.colors[
            colorName as keyof typeof uiDesign.darkMode.colors
          ];

    return (
      <div className="mb-4">
        <Label className="block mb-1">{label}</Label>
        <div className="flex space-x-2">
          <Input
            type="color"
            value={colorValue}
            onChange={(e) =>
              handleColorChange(section, colorName, e.target.value)
            }
            className="w-12 h-10 p-1"
          />
          <Input
            type="text"
            value={colorValue}
            onChange={(e) =>
              handleColorChange(section, colorName, e.target.value)
            }
            className="flex-1"
          />
        </div>
      </div>
    );
  };

  // Render select component
  const renderSelect = (
    options: string[],
    value: string,
    onChange: (value: string) => void,
    label: string
  ) => {
    return (
      <div className="mb-4">
        <Label className="block mb-1">{label}</Label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-slate-800 dark:border-slate-600"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Render number input component
  const renderNumberInput = (
    value: number,
    onChange: (value: number) => void,
    label: string,
    min: number,
    max: number,
    step: number = 1
  ) => {
    return (
      <div className="mb-4">
        <Label className="block mb-1">{label}</Label>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          min={min}
          max={max}
          step={step}
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 text-primary-600 animate-spin mr-3" />
        <span className="text-slate-600 dark:text-slate-300">
          Loading UI design data...
        </span>
      </div>
    );
  }

  return (
    <form id="ui-design-form" onSubmit={handleSubmit} className="space-y-6">
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
            UI Design
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Define the visual design system for your application.
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span>{copied ? "Copied!" : "Copy CSS Variables"}</span>
          </Button>
        </div>

        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="w-full flex justify-start overflow-x-auto mb-4 overflow-y-hidden">
            <TabsTrigger value="colors" className="flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center">
              <Type className="h-4 w-4 mr-2" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center">
              <Layout className="h-4 w-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center">
              <Grid className="h-4 w-4 mr-2" />
              Components
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Color Palette</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {renderColorPicker("colors", "primary", "Primary")}
                {renderColorPicker("colors", "secondary", "Secondary")}
                {renderColorPicker("colors", "accent", "Accent")}
                {renderColorPicker("colors", "background", "Background")}
                {renderColorPicker("colors", "textPrimary", "Text Primary")}
                {renderColorPicker("colors", "textSecondary", "Text Secondary")}
                {renderColorPicker("colors", "success", "Success")}
                {renderColorPicker("colors", "warning", "Warning")}
                {renderColorPicker("colors", "error", "Error")}
                {renderColorPicker("colors", "info", "Info")}
                {renderColorPicker("colors", "surface", "Surface")}
                {renderColorPicker("colors", "border", "Border")}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Dark Mode</h3>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="dark-mode-toggle">Enable Dark Mode</Label>
                  <Switch
                    id="dark-mode-toggle"
                    checked={uiDesign.darkMode.enabled}
                    onCheckedChange={(checked: boolean) =>
                      handleDarkModeToggle(checked)
                    }
                  />
                </div>
              </div>

              {uiDesign.darkMode.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderColorPicker(
                    "darkMode.colors",
                    "background",
                    "Background"
                  )}
                  {renderColorPicker(
                    "darkMode.colors",
                    "textPrimary",
                    "Text Primary"
                  )}
                  {renderColorPicker(
                    "darkMode.colors",
                    "textSecondary",
                    "Text Secondary"
                  )}
                  {renderColorPicker("darkMode.colors", "surface", "Surface")}
                  {renderColorPicker("darkMode.colors", "border", "Border")}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Typography Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSelect(
                  fontOptions,
                  uiDesign.typography.fontFamily,
                  (value) => handleTypographyChange("fontFamily", value),
                  "Font Family"
                )}

                {renderSelect(
                  fontOptions,
                  uiDesign.typography.headingFont,
                  (value) => handleTypographyChange("headingFont", value),
                  "Heading Font"
                )}

                <div className="mb-4">
                  <Label className="block mb-1">Base Font Size</Label>
                  <Input
                    type="text"
                    value={uiDesign.typography.fontSize}
                    onChange={(e) =>
                      handleTypographyChange("fontSize", e.target.value)
                    }
                    placeholder="16px"
                  />
                </div>

                {renderNumberInput(
                  uiDesign.typography.lineHeight,
                  (value) => handleTypographyChange("lineHeight", value),
                  "Line Height",
                  1,
                  3,
                  0.1
                )}

                {renderNumberInput(
                  uiDesign.typography.fontWeight,
                  (value) => handleTypographyChange("fontWeight", value),
                  "Base Font Weight",
                  300,
                  900,
                  100
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Heading Sizes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="mb-4">
                  <Label className="block mb-1">H1 Size</Label>
                  <Input
                    type="text"
                    value={uiDesign.typography.headingSizes.h1}
                    onChange={(e) =>
                      handleTypographyChange("headingSizes.h1", e.target.value)
                    }
                    placeholder="2.5rem"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">H2 Size</Label>
                  <Input
                    type="text"
                    value={uiDesign.typography.headingSizes.h2}
                    onChange={(e) =>
                      handleTypographyChange("headingSizes.h2", e.target.value)
                    }
                    placeholder="2rem"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">H3 Size</Label>
                  <Input
                    type="text"
                    value={uiDesign.typography.headingSizes.h3}
                    onChange={(e) =>
                      handleTypographyChange("headingSizes.h3", e.target.value)
                    }
                    placeholder="1.75rem"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">H4 Size</Label>
                  <Input
                    type="text"
                    value={uiDesign.typography.headingSizes.h4}
                    onChange={(e) =>
                      handleTypographyChange("headingSizes.h4", e.target.value)
                    }
                    placeholder="1.5rem"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">H5 Size</Label>
                  <Input
                    type="text"
                    value={uiDesign.typography.headingSizes.h5}
                    onChange={(e) =>
                      handleTypographyChange("headingSizes.h5", e.target.value)
                    }
                    placeholder="1.25rem"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">H6 Size</Label>
                  <Input
                    type="text"
                    value={uiDesign.typography.headingSizes.h6}
                    onChange={(e) =>
                      handleTypographyChange("headingSizes.h6", e.target.value)
                    }
                    placeholder="1rem"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Layout Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <Label className="block mb-1">Container Width</Label>
                  <Input
                    type="text"
                    value={uiDesign.layout.containerWidth}
                    onChange={(e) =>
                      handleLayoutChange("containerWidth", e.target.value)
                    }
                    placeholder="1280px"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">Sidebar Width</Label>
                  <Input
                    type="text"
                    value={uiDesign.layout.sidebarWidth}
                    onChange={(e) =>
                      handleLayoutChange("sidebarWidth", e.target.value)
                    }
                    placeholder="240px"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">Topbar Height</Label>
                  <Input
                    type="text"
                    value={uiDesign.layout.topbarHeight}
                    onChange={(e) =>
                      handleLayoutChange("topbarHeight", e.target.value)
                    }
                    placeholder="64px"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">Gutter Width</Label>
                  <Input
                    type="text"
                    value={uiDesign.layout.gutterWidth}
                    onChange={(e) =>
                      handleLayoutChange("gutterWidth", e.target.value)
                    }
                    placeholder="16px"
                  />
                </div>

                {renderNumberInput(
                  uiDesign.layout.gridColumns,
                  (value) => handleLayoutChange("gridColumns", value),
                  "Grid Columns",
                  1,
                  24,
                  1
                )}

                <div className="mb-4 flex items-center space-x-2">
                  <Switch
                    id="responsive-toggle"
                    checked={uiDesign.layout.responsive}
                    onCheckedChange={(checked: boolean) =>
                      handleLayoutChange("responsive", checked)
                    }
                  />
                  <Label htmlFor="responsive-toggle">Responsive Layout</Label>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Spacing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <Label className="block mb-1">Base Unit</Label>
                  <Input
                    type="text"
                    value={uiDesign.spacing.unit}
                    onChange={(e) =>
                      handleSpacingChange("unit", e.target.value)
                    }
                    placeholder="4px"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">Spacing Scale</Label>
                  <Input
                    type="text"
                    value={uiDesign.spacing.scale.join(", ")}
                    onChange={(e) => {
                      const scaleValues = e.target.value
                        .split(",")
                        .map((val) => parseInt(val.trim()))
                        .filter((val) => !isNaN(val));
                      handleSpacingChange("scale", scaleValues);
                    }}
                    placeholder="0, 1, 2, 4, 8, 16, ..."
                  />
                  <span className="text-xs text-slate-500 mt-1 block">
                    Comma-separated values
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Border Radius</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="mb-4">
                  <Label className="block mb-1">Small Radius</Label>
                  <Input
                    type="text"
                    value={uiDesign.borderRadius.small}
                    onChange={(e) =>
                      handleBorderRadiusChange("small", e.target.value)
                    }
                    placeholder="2px"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">Medium Radius</Label>
                  <Input
                    type="text"
                    value={uiDesign.borderRadius.medium}
                    onChange={(e) =>
                      handleBorderRadiusChange("medium", e.target.value)
                    }
                    placeholder="4px"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">Large Radius</Label>
                  <Input
                    type="text"
                    value={uiDesign.borderRadius.large}
                    onChange={(e) =>
                      handleBorderRadiusChange("large", e.target.value)
                    }
                    placeholder="8px"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">Extra Large Radius</Label>
                  <Input
                    type="text"
                    value={uiDesign.borderRadius.xl}
                    onChange={(e) =>
                      handleBorderRadiusChange("xl", e.target.value)
                    }
                    placeholder="12px"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">Pill Radius</Label>
                  <Input
                    type="text"
                    value={uiDesign.borderRadius.pill}
                    onChange={(e) =>
                      handleBorderRadiusChange("pill", e.target.value)
                    }
                    placeholder="9999px"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Shadows</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <Label className="block mb-1">Small Shadow</Label>
                  <Input
                    type="text"
                    value={uiDesign.shadows.small}
                    onChange={(e) =>
                      handleShadowsChange("small", e.target.value)
                    }
                    placeholder="0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">Medium Shadow</Label>
                  <Input
                    type="text"
                    value={uiDesign.shadows.medium}
                    onChange={(e) =>
                      handleShadowsChange("medium", e.target.value)
                    }
                    placeholder="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">Large Shadow</Label>
                  <Input
                    type="text"
                    value={uiDesign.shadows.large}
                    onChange={(e) =>
                      handleShadowsChange("large", e.target.value)
                    }
                    placeholder="0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">Extra Large Shadow</Label>
                  <Input
                    type="text"
                    value={uiDesign.shadows.xl}
                    onChange={(e) => handleShadowsChange("xl", e.target.value)}
                    placeholder="0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Component Styles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSelect(
                  buttonStyles,
                  uiDesign.components.buttonStyle,
                  (value) => handleComponentStyleChange("buttonStyle", value),
                  "Button Style"
                )}

                {renderSelect(
                  inputStyles,
                  uiDesign.components.inputStyle,
                  (value) => handleComponentStyleChange("inputStyle", value),
                  "Input Style"
                )}

                {renderSelect(
                  cardStyles,
                  uiDesign.components.cardStyle,
                  (value) => handleComponentStyleChange("cardStyle", value),
                  "Card Style"
                )}

                {renderSelect(
                  tableStyles,
                  uiDesign.components.tableStyle,
                  (value) => handleComponentStyleChange("tableStyle", value),
                  "Table Style"
                )}

                {renderSelect(
                  navStyles,
                  uiDesign.components.navStyle,
                  (value) => handleComponentStyleChange("navStyle", value),
                  "Navigation Style"
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Animations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <Label className="block mb-1">Transition Duration</Label>
                  <Input
                    type="text"
                    value={uiDesign.animations.transitionDuration}
                    onChange={(e) =>
                      handleAnimationsChange(
                        "transitionDuration",
                        e.target.value
                      )
                    }
                    placeholder="150ms"
                  />
                </div>

                <div className="mb-4">
                  <Label className="block mb-1">Transition Timing</Label>
                  <Input
                    type="text"
                    value={uiDesign.animations.transitionTiming}
                    onChange={(e) =>
                      handleAnimationsChange("transitionTiming", e.target.value)
                    }
                    placeholder="ease-in-out"
                  />
                </div>

                {renderNumberInput(
                  uiDesign.animations.hoverScale,
                  (value) => handleAnimationsChange("hoverScale", value),
                  "Hover Scale",
                  1,
                  2,
                  0.01
                )}

                <div className="mb-4 flex items-center space-x-2">
                  <Switch
                    id="animations-toggle"
                    checked={uiDesign.animations.enableAnimations}
                    onCheckedChange={(checked: boolean) =>
                      handleAnimationsChange("enableAnimations", checked)
                    }
                  />
                  <Label htmlFor="animations-toggle">Enable Animations</Label>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Preview section */}
        {/* TODO: This is where the preview of the actual UI Design will go. Not the previuew of the UI Design spec in Markdown format which is handled by UIDesignPreview.tsx */}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !projectId}
          className="flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save UI Design
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
