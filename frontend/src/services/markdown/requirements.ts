import { Requirements } from "../../types/templates";

/**
 * Generate markdown for requirements
 */
export function generateRequirementsMarkdown(
  data: Partial<Requirements> | null
): string {
  if (!data) return "";

  let markdown = `# Project Requirements\n\n`;

  // Functional Requirements
  markdown += `## Functional Requirements\n\n`;
  if (data.functional && data.functional.length > 0) {
    data.functional.forEach((req, index) => {
      markdown += `* FR${index + 1}: ${req}\n`;
    });
    markdown += `\n`;
  } else {
    markdown += `No functional requirements defined.\n\n`;
  }

  // Non-Functional Requirements
  markdown += `## Non-Functional Requirements\n\n`;
  if (data.non_functional && data.non_functional.length > 0) {
    data.non_functional.forEach((req, index) => {
      markdown += `* NFR${index + 1}: ${req}\n`;
    });
    markdown += `\n`;
  } else {
    markdown += `No non-functional requirements defined.\n\n`;
  }

  return markdown;
}
