import JSZip from "jszip";
import { ProjectBase } from "../../types/project";
import {
  ProjectTechStack,
  Requirements,
  Pages,
  DataModel,
  Api,
} from "../../types/templates";
import { FeaturesData } from "../featuresService";
import { TestCasesData } from "../testCasesService";
import { aiService } from "../aiService";
import { generateApiEndpointsMarkdown } from "./apiEndpoints";
import { generateDataModelMarkdown } from "./dataModel";
import { generateFeaturesMarkdown } from "./features";
import { generatePagesMarkdown } from "./pages";
import { generateProjectBasicsMarkdown } from "./projectBasics";
import { generateRequirementsMarkdown } from "./requirements";
import { generateTechStackMarkdown } from "./techStack";
import { generateTestCasesMarkdown } from "./testCases";
import { generateFileName } from "./utils";

/**
 * Creates a zip file containing all markdown files for a project
 *
 * @param project The project data
 * @param techStack The tech stack data
 * @param requirements The requirements data
 * @param features The features data
 * @param pages The pages data
 * @param dataModel The data model
 * @param apiEndpoints The API endpoints
 * @param testCases The test cases
 * @returns Promise that resolves to a Blob containing the zip file
 */
export async function generateMarkdownZip(
  project: ProjectBase,
  techStack: ProjectTechStack | null,
  requirements: Requirements | null,
  features: FeaturesData | null,
  pages: Pages | null,
  dataModel: Partial<DataModel> | null,
  apiEndpoints: Api | null,
  testCases: TestCasesData | null
): Promise<Blob> {
  const zip = new JSZip();

  // Add each markdown file to the zip
  if (project) {
    const basicsMarkdown = generateProjectBasicsMarkdown(project);
    zip.file(generateFileName(project.name, "basics"), basicsMarkdown);
  }

  if (techStack) {
    const techStackMarkdown = generateTechStackMarkdown(techStack);
    zip.file(generateFileName(project.name, "tech-stack"), techStackMarkdown);
  }

  if (requirements) {
    const requirementsMarkdown = generateRequirementsMarkdown(requirements);
    zip.file(
      generateFileName(project.name, "requirements"),
      requirementsMarkdown
    );
  }

  if (features) {
    const featuresMarkdown = generateFeaturesMarkdown(features);
    zip.file(generateFileName(project.name, "features"), featuresMarkdown);
  }

  if (pages) {
    const pagesMarkdown = generatePagesMarkdown(pages);
    zip.file(generateFileName(project.name, "pages"), pagesMarkdown);
  }

  if (dataModel) {
    const dataModelMarkdown = generateDataModelMarkdown(dataModel);
    zip.file(generateFileName(project.name, "data-model"), dataModelMarkdown);
  }

  if (apiEndpoints) {
    const apiEndpointsMarkdown = generateApiEndpointsMarkdown(apiEndpoints);
    zip.file(
      generateFileName(project.name, "api-endpoints"),
      apiEndpointsMarkdown
    );
  }

  if (testCases) {
    const testCasesMarkdown = generateTestCasesMarkdown(testCases);
    zip.file(generateFileName(project.name, "test-cases"), testCasesMarkdown);
  }

  // Generate a README file for the zip using AI
  let readme = "";

  try {
    // Attempt to generate an AI-enhanced README
    const enhancedReadme = await aiService.enhanceReadme(
      project.name,
      project.description,
      project.business_goals || [],
      {
        functional: requirements?.functional || [],
        non_functional: requirements?.non_functional || [],
      },
      {
        coreModules: features?.coreModules || [],
        optionalModules: features?.optionalModules || [],
      },
      techStack ? { ...techStack } : {}
    );

    // Use the AI-enhanced README if available
    if (enhancedReadme) {
      readme = enhancedReadme;
    } else {
      // Fallback to basic README if AI enhancement fails
      readme =
        `# ${project.name} Project Specification\n\n` +
        `This archive contains markdown files for all sections of the ${project.name} project specification.\n\n` +
        `## Contents\n\n` +
        `- Project Basics\n` +
        `- Tech Stack\n` +
        `- Requirements\n` +
        `- Features\n` +
        `- Pages\n` +
        `- Data Model\n` +
        `- API Endpoints\n` +
        `- Test Cases\n\n` +
        `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    }
  } catch (error) {
    console.error("Error generating AI README:", error);

    // Fallback to basic README if any error occurs
    readme =
      `# ${project.name} Project Specification\n\n` +
      `This archive contains markdown files for all sections of the ${project.name} project specification.\n\n` +
      `## Contents\n\n` +
      `- Project Basics\n` +
      `- Tech Stack\n` +
      `- Requirements\n` +
      `- Features\n` +
      `- Pages\n` +
      `- Data Model\n` +
      `- API Endpoints\n` +
      `- Test Cases\n\n` +
      `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
  }

  zip.file("README.md", readme);

  // Generate the zip file
  return await zip.generateAsync({ type: "blob" });
}
