import { UIDesign } from '../../types/templates';

/**
 * Generate markdown for UI Design
 */
export function generateUIDesignMarkdown(data: UIDesign | null): string {
  if (!data) return '';

  let markdown = `# UI Design Specification\n\n`;

  // Colors section
  markdown += `## Colors\n`;
  if (data.colors) {
    Object.entries(data.colors).forEach(([colorName, colorValue]) => {
      markdown += `- ${
        colorName.charAt(0).toUpperCase() + colorName.slice(1)
      }: \`${colorValue}\`\n`;
    });
  } else {
    markdown += `*No colors defined*\n`;
  }
  markdown += `\n`;

  // Typography section
  markdown += `## Typography\n`;
  if (data.typography) {
    markdown += `- Font Family: \`${data.typography.fontFamily}\`\n`;
    markdown += `- Heading Font: \`${data.typography.headingFont}\`\n`;
    markdown += `- Base Font Size: \`${data.typography.fontSize}\`\n`;
    markdown += `- Line Height: \`${data.typography.lineHeight}\`\n`;
    markdown += `- Base Font Weight: \`${data.typography.fontWeight}\`\n`;

    if (data.typography.headingSizes) {
      markdown += `\n### Heading Sizes\n`;
      Object.entries(data.typography.headingSizes).forEach(([size, value]) => {
        markdown += `- ${size.toUpperCase()}: \`${value}\`\n`;
      });
    }
  } else {
    markdown += `*No typography defined*\n`;
  }
  markdown += `\n`;

  // Spacing section
  markdown += `## Spacing\n`;
  if (data.spacing) {
    markdown += `- Base Unit: \`${data.spacing.unit}\`\n`;
    markdown += `- Scale: ${JSON.stringify(data.spacing.scale)}\n`;
  } else {
    markdown += `*No spacing defined*\n`;
  }
  markdown += `\n`;

  // Border Radius section
  markdown += `## Border Radius\n`;
  if (data.borderRadius) {
    Object.entries(data.borderRadius).forEach(([size, value]) => {
      markdown += `- ${size.charAt(0).toUpperCase() + size.slice(1)}: \`${value}\`\n`;
    });
  } else {
    markdown += `*No border radius defined*\n`;
  }
  markdown += `\n`;

  // Shadows section
  markdown += `## Shadows\n`;
  if (data.shadows) {
    Object.entries(data.shadows).forEach(([size, value]) => {
      markdown += `- ${size.charAt(0).toUpperCase() + size.slice(1)}: \`${value}\`\n`;
    });
  } else {
    markdown += `*No shadows defined*\n`;
  }
  markdown += `\n`;

  // Layout section
  markdown += `## Layout\n`;
  if (data.layout) {
    markdown += `- Container Width: \`${data.layout.containerWidth}\`\n`;
    markdown += `- Responsive: \`${data.layout.responsive}\`\n`;
    markdown += `- Sidebar Width: \`${data.layout.sidebarWidth}\`\n`;
    markdown += `- Topbar Height: \`${data.layout.topbarHeight}\`\n`;
    markdown += `- Grid Columns: \`${data.layout.gridColumns}\`\n`;
    markdown += `- Gutter Width: \`${data.layout.gutterWidth}\`\n`;
  } else {
    markdown += `*No layout defined*\n`;
  }
  markdown += `\n`;

  // Component Styles section
  markdown += `## Component Styles\n`;
  if (data.components) {
    Object.entries(data.components).forEach(([component, style]) => {
      markdown += `- ${component.charAt(0).toUpperCase() + component.slice(1)}: \`${style}\`\n`;
    });
  } else {
    markdown += `*No component styles defined*\n`;
  }
  markdown += `\n`;

  // Dark Mode section
  markdown += `## Dark Mode\n`;
  if (data.darkMode) {
    markdown += `- Enabled: \`${data.darkMode.enabled}\`\n`;

    if (data.darkMode.colors) {
      markdown += `\n### Dark Mode Colors\n`;
      Object.entries(data.darkMode.colors).forEach(([colorName, colorValue]) => {
        markdown += `- ${
          colorName.charAt(0).toUpperCase() + colorName.slice(1)
        }: \`${colorValue}\`\n`;
      });
    }
  } else {
    markdown += `*No dark mode settings defined*\n`;
  }
  markdown += `\n`;

  // Animations section
  markdown += `## Animations\n`;
  if (data.animations) {
    markdown += `- Transition Duration: \`${data.animations.transitionDuration}\`\n`;
    markdown += `- Transition Timing: \`${data.animations.transitionTiming}\`\n`;
    markdown += `- Hover Scale: \`${data.animations.hoverScale}\`\n`;
    markdown += `- Animations Enabled: \`${data.animations.enableAnimations}\`\n`;
  } else {
    markdown += `*No animation settings defined*\n`;
  }

  return markdown;
}
