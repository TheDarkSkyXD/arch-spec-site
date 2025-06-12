import { Pages, PageComponent } from '../../types/templates';

/**
 * Generate markdown for pages
 */
export function generatePagesMarkdown(data: Pages | null): string {
  if (!data) return '';

  let markdown = `# Application Pages\n\n`;

  // Helper function to render page section
  const renderPageSection = (title: string, pages: PageComponent[] | undefined) => {
    if (!pages || pages.length === 0) {
      return `## ${title}\n*No ${title.toLowerCase()} pages defined*\n\n`;
    }

    let section = `## ${title}\n\n`;

    pages.forEach((page) => {
      const statusLabel = page.enabled ? '✅ Enabled' : '❌ Disabled';
      section += `### ${page.name} ${statusLabel}\n\n`;

      // For path property from PageComponent interface
      section += `**Path:** \`${page.path}\`\n\n`;

      if (page.components && page.components.length > 0) {
        section += `**Components:**\n`;
        page.components.forEach((component) => {
          section += `- ${component}\n`;
        });
        section += `\n`;
      }

      section += `---\n\n`;
    });

    return section;
  };

  // Render each section of pages
  markdown += renderPageSection('Public Pages', data.public);
  markdown += renderPageSection('Authenticated Pages', data.authenticated);
  markdown += renderPageSection('Admin Pages', data.admin);

  return markdown;
}
