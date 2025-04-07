import { ProjectTechStack, BackendTechStack, DatabaseTechStack } from '../../types/templates';
import { formatObject } from './utils';

/**
 * Generate markdown for tech stack
 */
export function generateTechStackMarkdown(data: Partial<ProjectTechStack> | null): string {
  if (!data) return '';

  let markdown = `# Technology Stack\n\n`;

  // Frontend
  markdown += `## Frontend\n`;
  if (data.frontend) {
    // Type assertion to avoid linter errors with record type
    markdown += formatObject(data.frontend as unknown as Record<string, unknown>);
  } else {
    markdown += '*No frontend technology specified*';
  }
  markdown += '\n\n';

  // Backend
  markdown += `## Backend\n`;
  if (data.backend) {
    // Check if backend is an object with 'type' property to use specialized formatting
    const backend = data.backend as BackendTechStack;
    if (backend.type) {
      markdown += `- **Type**: ${backend.type}\n`;

      if (backend.type === 'framework') {
        markdown += `- **Framework**: ${backend.framework || '*Not specified*'}\n`;
        markdown += `- **Language**: ${backend.language || '*Not specified*'}\n`;
        if (backend.realtime) {
          markdown += `- **Realtime**: ${backend.realtime}\n`;
        }
      } else if (backend.type === 'baas') {
        markdown += `- **Service**: ${backend.service || '*Not specified*'}\n`;
        if (backend.functions) {
          markdown += `- **Functions**: ${backend.functions}\n`;
        }
        if (backend.realtime) {
          markdown += `- **Realtime**: ${backend.realtime}\n`;
        }
      } else if (backend.type === 'serverless') {
        markdown += `- **Service**: ${backend.service || '*Not specified*'}\n`;
        markdown += `- **Language**: ${backend.language || '*Not specified*'}\n`;
      }
    } else {
      // Use generic object formatting if type property isn't present
      markdown += formatObject(data.backend as unknown as Record<string, unknown>);
    }
  } else {
    markdown += '*No backend technology specified*';
  }
  markdown += '\n\n';

  // Database
  markdown += `## Database\n`;
  if (data.database) {
    const database = data.database as DatabaseTechStack;
    if (database.type) {
      markdown += `- **Type**: ${database.type}\n`;
      markdown += `- **System**: ${database.system || '*Not specified*'}\n`;
      markdown += `- **Hosting**: ${database.hosting || '*Not specified*'}\n`;

      if (database.type === 'sql' && 'orm' in database && database.orm) {
        markdown += `- **ORM**: ${database.orm}\n`;
      } else if (database.type === 'nosql' && 'client' in database && database.client) {
        markdown += `- **Client**: ${database.client}\n`;
      }
    } else {
      markdown += formatObject(data.database as unknown as Record<string, unknown>);
    }
  } else {
    markdown += '*No database technology specified*';
  }
  markdown += '\n\n';

  // Authentication
  markdown += `## Authentication\n`;
  if (data.authentication) {
    markdown += formatObject(data.authentication as unknown as Record<string, unknown>);
  } else {
    markdown += '*No authentication technology specified*';
  }
  markdown += '\n\n';

  // Hosting
  markdown += `## Hosting\n`;
  if (data.hosting) {
    markdown += formatObject(data.hosting as unknown as Record<string, unknown>);
  } else {
    markdown += '*No hosting technology specified*';
  }
  markdown += '\n\n';

  // Optional: Storage
  if (data.storage) {
    markdown += `## Storage\n`;
    markdown += formatObject(data.storage as unknown as Record<string, unknown>);
    markdown += '\n\n';
  }

  // Optional: Deployment
  if (data.deployment) {
    markdown += `## Deployment\n`;
    markdown += formatObject(data.deployment as Record<string, unknown>);
    markdown += '\n';
  }

  return markdown;
}
