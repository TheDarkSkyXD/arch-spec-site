import { describe, it, expect } from "vitest";
import { generateUIDesignMarkdown } from "../uiDesign";
import { UIDesign } from "../../../types/templates";

describe("generateUIDesignMarkdown", () => {
  it("should generate markdown for UI design data", () => {
    const uiDesignData: UIDesign = {
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
        scale: [0, 1, 2, 4, 8, 16, 24, 32, 48, 64],
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
        medium: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        large: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
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
        buttonStyle: "rounded",
        inputStyle: "outline",
        cardStyle: "shadow",
        tableStyle: "bordered",
        navStyle: "pills",
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

    const markdown = generateUIDesignMarkdown(uiDesignData);

    // Verify the markdown includes all sections
    expect(markdown).toContain("# UI Design Specification");
    expect(markdown).toContain("## Colors");
    expect(markdown).toContain("Primary: `#3b82f6`");
    expect(markdown).toContain("## Typography");
    expect(markdown).toContain("Font Family: `Inter, sans-serif`");
    expect(markdown).toContain("### Heading Sizes");
    expect(markdown).toContain("H1: `2.5rem`");
    expect(markdown).toContain("## Spacing");
    expect(markdown).toContain("Base Unit: `4px`");
    expect(markdown).toContain("## Border Radius");
    expect(markdown).toContain("Small: `2px`");
    expect(markdown).toContain("## Shadows");
    expect(markdown).toContain("Small: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`");
    expect(markdown).toContain("## Layout");
    expect(markdown).toContain("Container Width: `1280px`");
    expect(markdown).toContain("## Component Styles");
    expect(markdown).toContain("Buttonstyle: `rounded`");
    expect(markdown).toContain("## Dark Mode");
    expect(markdown).toContain("Enabled: `true`");
    expect(markdown).toContain("### Dark Mode Colors");
    expect(markdown).toContain("Background: `#1f2937`");
    expect(markdown).toContain("## Animations");
    expect(markdown).toContain("Transition Duration: `150ms`");
  });

  it("should handle null input", () => {
    const markdown = generateUIDesignMarkdown(null);
    expect(markdown).toBe("");
  });

  it("should handle partial data", () => {
    const partialData = {
      colors: {
        primary: "#3b82f6",
        secondary: "#6366f1",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
      },
    } as unknown as UIDesign;

    const markdown = generateUIDesignMarkdown(partialData);

    expect(markdown).toContain("# UI Design Specification");
    expect(markdown).toContain("Primary: `#3b82f6`");
    expect(markdown).toContain("Secondary: `#6366f1`");
    expect(markdown).toContain("Font Family: `Inter, sans-serif`");

    // Sections with missing data should have placeholders
    expect(markdown).toContain("*No spacing defined*");
    expect(markdown).toContain("*No border radius defined*");
    expect(markdown).toContain("*No shadows defined*");
    expect(markdown).toContain("*No layout defined*");
    expect(markdown).toContain("*No component styles defined*");
    expect(markdown).toContain("*No dark mode settings defined*");
    expect(markdown).toContain("*No animation settings defined*");
  });
});
