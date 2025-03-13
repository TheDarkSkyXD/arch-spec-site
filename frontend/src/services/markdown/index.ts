import { generateProjectBasicsMarkdown } from "./projectBasics";
import { generateTechStackMarkdown } from "./techStack";
import { generateRequirementsMarkdown } from "./requirements";
import { generateFeaturesMarkdown } from "./features";
import { generatePagesMarkdown } from "./pages";
import { generateDataModelMarkdown } from "./dataModel";
import { generateApiEndpointsMarkdown } from "./apiEndpoints";
import { formatObject, generateFileName } from "./utils";

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
  generateFileName,
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
  generateFileName,
};
