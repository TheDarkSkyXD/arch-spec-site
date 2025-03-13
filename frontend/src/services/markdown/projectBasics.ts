import { ProjectBase } from "../../types/project";

/**
 * Generate markdown for project basics
 */
export function generateProjectBasicsMarkdown(
  data: Partial<ProjectBase> | null
): string {
  if (!data) return "";

  return `
# ${data.name || "Untitled Project"}

${data.description || ""}

## Business Goals
${
  Array.isArray(data.business_goals) && data.business_goals.length > 0
    ? data.business_goals.map((goal) => `- ${goal}`).join("\n")
    : "*No business goals defined*"
}

## Target Users
${data.target_users || "*No target users defined*"}

## Domain
${data.domain || "*No domain defined*"}
`;
}
