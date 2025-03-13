import {
  TestCasesData,
  GherkinTestCase,
} from "../../services/testCasesService";

/**
 * Generate markdown for test cases using Gherkin format
 */
export function generateTestCasesMarkdown(
  data: Partial<TestCasesData> | null
): string {
  if (!data || !data.testCases || data.testCases.length === 0) return "";

  let markdown = `# Test Cases\n\n`;

  data.testCases.forEach((testCase: GherkinTestCase, index: number) => {
    // Add feature and title
    markdown += `## Feature: ${testCase.feature}\n\n`;
    markdown += `### ${index + 1}. ${testCase.title}\n\n`;

    // Add description if it exists
    if (testCase.description) {
      markdown += `${testCase.description}\n\n`;
    }

    // Add tags if they exist
    if (testCase.tags && testCase.tags.length > 0) {
      markdown += `**Tags**: ${testCase.tags
        .map((tag) => `@${tag}`)
        .join(", ")}\n\n`;
    }

    // Add scenarios
    testCase.scenarios.forEach((scenario) => {
      markdown += `#### Scenario: ${scenario.name}\n\n`;

      // Add steps with proper Gherkin formatting
      scenario.steps.forEach((step) => {
        const stepType = step.type.charAt(0).toUpperCase() + step.type.slice(1);
        markdown += `**${stepType}** ${step.text}\n\n`;
      });
    });

    // Add separator between test cases if not the last one
    if (index < data.testCases.length - 1) {
      markdown += `---\n\n`;
    }
  });

  return markdown;
}
