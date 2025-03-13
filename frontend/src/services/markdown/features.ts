import { FeatureModule } from "../../types/templates";
import { FeaturesData } from "../../services/featuresService";

/**
 * Generate markdown for features
 */
export function generateFeaturesMarkdown(
  data: Partial<FeaturesData> | null
): string {
  if (!data) return "";

  let markdown = `# Project Features\n\n`;

  // Helper function to render feature sections
  const renderFeatureSection = (
    title: string,
    features: FeatureModule[] | undefined
  ) => {
    if (!features || features.length === 0) {
      return `## ${title}\n*No ${title.toLowerCase()} defined*\n\n`;
    }

    let section = `## ${title}\n\n`;

    features.forEach((feature: FeatureModule, index: number) => {
      const statusLabel = feature.enabled ? "✅ Enabled" : "❌ Disabled";
      const optionalLabel = feature.optional ? "Optional" : "Required";

      section += `### ${index + 1}. ${
        feature.name
      } (${statusLabel}, ${optionalLabel})\n\n`;
      section += `${feature.description}\n\n`;

      if (feature.providers && feature.providers.length > 0) {
        section += `**Providers**: ${feature.providers.join(", ")}\n\n`;
      }
    });

    return section;
  };

  // Core Features
  markdown += renderFeatureSection("Core Features", data.coreModules);

  // Optional Features
  if (data.optionalModules && data.optionalModules.length > 0) {
    markdown += renderFeatureSection("Optional Features", data.optionalModules);
  }

  return markdown;
}
