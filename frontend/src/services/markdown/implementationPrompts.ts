import {
  ImplementationPrompts,
  ImplementationPrompt,
  ImplementationPromptType,
} from '../../types/templates';
import {
  IMPLEMENTATION_CATEGORIES,
  CATEGORY_LABELS,
  PROMPT_TYPE_LABELS,
} from '../../constants/implementationPrompts';

/**
 * Generate markdown for a category of implementation prompts
 *
 * @param categoryPrompts - The prompts for a category
 * @param categoryLabel - The label for the category
 * @returns The markdown string for the category
 */
function generateCategoryMarkdown(
  categoryPrompts: ImplementationPrompt[],
  categoryLabel: string
): string {
  if (!categoryPrompts || categoryPrompts.length === 0) {
    return '';
  }

  let markdown = `## ${categoryLabel}\n\n`;

  // Sort prompts by type: MAIN first, then FOLLOWUP_1, then FOLLOWUP_2
  const sortedPrompts = [...categoryPrompts].sort((a, b) => {
    const typeOrder = {
      [ImplementationPromptType.MAIN]: 0,
      [ImplementationPromptType.FOLLOWUP_1]: 1,
      [ImplementationPromptType.FOLLOWUP_2]: 2,
    };
    return typeOrder[a.type] - typeOrder[b.type];
  });

  sortedPrompts.forEach((prompt) => {
    markdown += `### ${PROMPT_TYPE_LABELS[prompt.type]}\n\n`;
    markdown += `\`\`\`\n${prompt.content}\n\`\`\`\n\n`;

    // Add a note for follow-up prompts
    if (prompt.type === ImplementationPromptType.FOLLOWUP_1) {
      markdown +=
        '_Use this prompt if the main prompt execution stopped before completing the task._\n\n';
    } else if (prompt.type === ImplementationPromptType.FOLLOWUP_2) {
      markdown +=
        "_Use this prompt as a last resort if the previous prompts didn't complete the task._\n\n";
    }
  });

  return markdown;
}

/**
 * Generate markdown for a specific category of implementation prompts
 *
 * @param implementationPrompts - The implementation prompts
 * @param category - The category to generate markdown for
 * @returns The markdown string for the specified category
 */
export function generateCategoryImplementationPromptsMarkdown(
  implementationPrompts: ImplementationPrompts,
  category: string
): string {
  if (!implementationPrompts || !implementationPrompts.data || !CATEGORY_LABELS[category]) {
    return `# ${
      CATEGORY_LABELS[category] || 'Unknown Category'
    }\n\nNo implementation prompts defined for this category.`;
  }

  let markdown = `# ${CATEGORY_LABELS[category]}\n\n`;

  if (implementationPrompts.data[category]) {
    markdown += generateCategoryMarkdown(
      implementationPrompts.data[category],
      CATEGORY_LABELS[category]
    );
  } else {
    markdown += 'No prompts defined for this category.';
  }

  return markdown;
}

/**
 * Generate markdown for implementation prompts
 *
 * @param implementationPrompts - The implementation prompts
 * @returns The markdown string
 */
export function generateImplementationPromptsMarkdown(
  implementationPrompts: ImplementationPrompts
): string {
  if (!implementationPrompts || !implementationPrompts.data) {
    return '# Implementation Prompts\n\nNo implementation prompts defined.';
  }

  let markdown = '# Implementation Prompts\n\n';
  markdown +=
    'This document contains prompts for implementing different aspects of your project using AI tools. ';
  markdown +=
    'The prompts are organized by implementation phase and should be used in the numbered sequence.\n\n';

  // Count total prompts
  const totalPrompts = Object.values(implementationPrompts.data).reduce(
    (total, prompts) => total + prompts.length,
    0
  );

  markdown += `**Total prompts:** ${totalPrompts}\n\n`;
  markdown += '---\n\n';

  // Generate markdown for each category that has prompts, in the original order
  IMPLEMENTATION_CATEGORIES.forEach((category) => {
    if (implementationPrompts.data[category] && implementationPrompts.data[category].length > 0) {
      markdown += generateCategoryMarkdown(
        implementationPrompts.data[category],
        CATEGORY_LABELS[category]
      );

      // Add a separator between categories
      markdown += '---\n\n';
    }
  });

  return markdown;
}
