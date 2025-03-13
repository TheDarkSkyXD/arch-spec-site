import { generateProjectBasicsMarkdown } from "./projectBasics";
import { generateTechStackMarkdown } from "./techStack";
import { generateRequirementsMarkdown } from "./requirements";
import { generateFeaturesMarkdown } from "./features";
import { generatePagesMarkdown } from "./pages";
import { generateDataModelMarkdown } from "./dataModel";
import { generateApiEndpointsMarkdown } from "./apiEndpoints";
import { generateTestCasesMarkdown } from "./testCases";
import { formatObject, generateFileName } from "./utils";
import { generateMarkdownZip } from "./markdownZip";

/**
 * Markdown service - generates markdown representations of project data
 */
export const markdownService = {
  formatObject,
  generateProjectBasicsMarkdown,
  generateTechStackMarkdown,
  generateRequirementsMarkdown,
  generateFeaturesMarkdown,
  generatePagesMarkdown,
  generateDataModelMarkdown,
  generateApiEndpointsMarkdown,
  generateTestCasesMarkdown,
  generateFileName,
  generateMarkdownZip,
};

// Also export individual functions for direct imports
export {
  formatObject,
  generateProjectBasicsMarkdown,
  generateTechStackMarkdown,
  generateRequirementsMarkdown,
  generateFeaturesMarkdown,
  generatePagesMarkdown,
  generateDataModelMarkdown,
  generateApiEndpointsMarkdown,
  generateTestCasesMarkdown,
  generateFileName,
};
