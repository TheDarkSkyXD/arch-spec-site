import { Api, ApiEndpoint } from "../../types/templates";
import { formatMarkdownTable } from "./tableFormatter";

/**
 * Generate markdown for API endpoints
 */
export function generateApiEndpointsMarkdown(
  data: Partial<Api> | null
): string {
  if (!data) return "";

  let markdown = `# API Endpoints\n\n`;

  if (!Array.isArray(data.endpoints) || data.endpoints.length === 0) {
    return markdown + `*No API endpoints defined*\n`;
  }

  // Group endpoints by resource path for better organization
  const endpointsByPath = groupEndpointsByPath(data.endpoints);

  // Generate a table of contents for quick navigation
  markdown += generateTableOfContents(endpointsByPath);

  // Generate detailed endpoint documentation
  markdown += generateEndpointDetails(endpointsByPath);

  return markdown;
}

/**
 * Group endpoints by their path for better organization
 */
function groupEndpointsByPath(
  endpoints: ApiEndpoint[]
): Record<string, ApiEndpoint[]> {
  const result: Record<string, ApiEndpoint[]> = {};

  endpoints.forEach((endpoint) => {
    const path = endpoint.path;
    if (!result[path]) {
      result[path] = [];
    }
    result[path].push(endpoint);
  });

  return result;
}

/**
 * Generate a table of contents for API endpoints
 */
function generateTableOfContents(
  endpointsByPath: Record<string, ApiEndpoint[]>
): string {
  const toc = `## API Overview\n\n`;

  // Define headers
  const headers = ["Endpoint", "Methods", "Description", "Authentication"];

  // Create rows
  const rows = Object.entries(endpointsByPath).map(([path, endpoints]) => {
    const methods = endpoints
      .map((e) => e.methods)
      .flat()
      .map((m) => `\`${m}\``)
      .join(" ");
    const desc = endpoints[0].description.split(".")[0]; // Just use the first sentence
    const auth = endpoints.some((e) => e.auth) ? "Yes" : "No";

    return [`\`${path}\``, methods, desc, auth];
  });

  // Custom separators for the table header
  const separators = [
    "----------",
    "---------",
    "-------------",
    "---------------",
  ];

  return toc + formatMarkdownTable(headers, rows, separators);
}

/**
 * Generate detailed endpoint documentation
 */
function generateEndpointDetails(
  endpointsByPath: Record<string, ApiEndpoint[]>
): string {
  let details = `## API Details\n\n`;

  Object.entries(endpointsByPath).forEach(([path, endpoints]) => {
    details += `### \`${path}\`\n\n`;

    endpoints.forEach((endpoint) => {
      // Format methods in a simple, compact way
      const methodsText = endpoint.methods
        .map((method) => {
          return `\`${method}\``;
        })
        .join(" ");

      details += `#### ${methodsText} \`${path}\`\n\n`;
      details += `${endpoint.description}\n\n`;

      // Add parameter tables if there are any
      if (endpoint.parameters && endpoint.parameters.length > 0) {
        details += `**Parameters**\n\n`;

        const paramHeaders = ["Name", "Type", "Required", "Description"];
        const paramRows = endpoint.parameters.map((param) => [
          param.name,
          param.type,
          param.required ? "Yes" : "No",
          param.description || "",
        ]);
        const paramSeparators = ["----", "----", "--------", "-----------"];

        details += formatMarkdownTable(
          paramHeaders,
          paramRows,
          paramSeparators
        );
      }

      // Add response format if available
      if (endpoint.responses && endpoint.responses.length > 0) {
        details += `**Responses**\n\n`;

        const responseHeaders = ["Status", "Description", "Schema"];
        const responseRows = endpoint.responses.map((resp) => [
          `${resp.status}`,
          resp.description || "",
          resp.schema ? `\`${resp.schema}\`` : "",
        ]);
        const responseSeparators = ["------", "-----------", "------"];

        details += formatMarkdownTable(
          responseHeaders,
          responseRows,
          responseSeparators
        );
      }

      if (endpoint.auth) {
        details += `**🔒 Authentication Required**\n\n`;

        if (endpoint.roles && endpoint.roles.length > 0) {
          details += `**Required Roles**: ${endpoint.roles.join(", ")}\n\n`;
        }
      } else {
        details += `**🔓 Public Endpoint**\n\n`;
      }

      details += `---\n\n`;
    });
  });

  return details;
}
