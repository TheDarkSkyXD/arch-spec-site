import { generateProjectBasicsMarkdown } from './projectBasics';
import { generateTechStackMarkdown } from './techStack';
import { generateRequirementsMarkdown } from './requirements';
import { generateFeaturesMarkdown } from './features';
import { generatePagesMarkdown } from './pages';
import { generateDataModelMarkdown } from './dataModel';
import { generateApiEndpointsMarkdown } from './apiEndpoints';
import { generateTestCasesMarkdown } from './testCases';
import { generateImplementationPromptsMarkdown } from './implementationPrompts';
import { generateUIDesignMarkdown } from './uiDesign';
import { formatObject, generateFileName } from './utils';
import { generateMarkdownZip } from './markdownZip';
// import { sanitizeFileName } from "./utils";
// import { downloadMarkdown } from "./markdownZip";
// import { ImplementationPrompts } from "../../types/templates";

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
  generateImplementationPromptsMarkdown,
  generateUIDesignMarkdown,
  // downloadImplementationPromptsMarkdown: (
  //   projectName: string,
  //   implementationPrompts: ImplementationPrompts
  // ) => {
  //   const markdown = generateImplementationPromptsMarkdown(
  //     implementationPrompts
  //   );
  //   const sanitizedName = sanitizeFileName(projectName);
  //   downloadMarkdown(`${sanitizedName}-implementation-prompts`, markdown);
  // },
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
  generateImplementationPromptsMarkdown,
  generateUIDesignMarkdown,
};
