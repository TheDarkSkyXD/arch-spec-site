/**
 * Utility functions for markdown generation
 */

/**
 * Format object properties recursively for markdown display
 */
export function formatObject(
  obj: Record<string, unknown> | null | undefined,
  indentLevel = 0
): string {
  if (!obj) return "*Not specified*";

  const indent = "  ".repeat(indentLevel);

  return Object.entries(obj)
    .map(([key, value]) => {
      if (value === null || value === undefined) return null;

      // Format key for better readability (snake_case to Title Case)
      const formattedKey = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      if (typeof value === "object" && value !== null) {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            return `${indent}- **${formattedKey}**: *None*`;
          } else {
            return `${indent}- **${formattedKey}**: ${value.join(", ")}`;
          }
        } else {
          // For nested objects, format them with increased indentation
          // Use type assertion to handle object types correctly
          const nestedProps = formatObject(
            value as Record<string, unknown>,
            indentLevel + 1
          );
          if (nestedProps.trim() === "") {
            return `${indent}- **${formattedKey}**: *Empty object*`;
          }
          return `${indent}- **${formattedKey}**:\n${nestedProps}`;
        }
      }

      // For primitive values
      return `${indent}- **${formattedKey}**: ${value || "*Not specified*"}`;
    })
    .filter(Boolean) // Remove null entries
    .join("\n");
}

/**
 * Generate a filename based on project data
 */
export function generateFileName(
  projectName: string | undefined,
  section: string
): string {
  const sanitizedName = (projectName || "project")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-");

  return `${sanitizedName}-${section}.md`;
}
