import { DataModel, Entity, EntityField } from '../../types/templates';
import { formatMarkdownTable } from './tableFormatter';

/**
 * Generate markdown for data model with precise column formatting
 */
export function generateDataModelMarkdown(data: Partial<DataModel> | null): string {
  if (!data) return '';

  let markdown = `# Data Model\n\n`;

  // Helper function to render entity fields as a code block table
  const renderEntityFieldsTable = (fields: EntityField[]) => {
    if (!fields || fields.length === 0) {
      return '*No fields defined*\n\n';
    }

    // Define headers
    const headers = ['Field', 'Type', 'Required', 'Unique', 'Primary Key', 'Default'];

    // Create rows
    const rows = fields.map((field) => [
      field.name,
      field.type,
      field.required ? 'Yes' : 'No',
      field.unique ? 'Yes' : 'No',
      field.primaryKey ? 'Yes' : 'No',
      field.default !== undefined ? `${field.default}` : 'null',
    ]);

    // Custom separators for the table header
    const separators = ['-----', '----', '--------', '------', '-----------', '-------'];

    return formatMarkdownTable(headers, rows, separators);
  };

  // Entities section
  if (data.entities && data.entities.length > 0) {
    markdown += `## Entities\n\n`;

    data.entities.forEach((entity: Entity) => {
      markdown += `### ${entity.name}\n\n`;

      if (entity.description) {
        markdown += `${entity.description}\n\n`;
      }

      if (entity.fields && entity.fields.length > 0) {
        markdown += `#### Fields\n\n`;
        markdown += renderEntityFieldsTable(entity.fields);
      } else {
        markdown += `*No fields defined*\n\n`;
      }

      markdown += `---\n\n`;
    });
  } else {
    markdown += `*No entities defined*\n\n`;
  }

  // Relationships section
  if (data.relationships && data.relationships.length > 0) {
    markdown += `## Relationships\n\n`;

    // Define headers
    const headers = ['Type', 'From Entity', 'To Entity', 'Field', 'Description'];

    // Create rows
    const rows = data.relationships.map((rel) => [
      rel.type,
      rel.from_entity || '-',
      rel.to_entity || '-',
      rel.field || '-',
      rel.throughTable ? `Via ${rel.throughTable}` : '',
    ]);

    // Custom separators for the table header
    const separators = ['----', '-----------', '---------', '-----', '-----------'];

    markdown += formatMarkdownTable(headers, rows, separators);
  } else {
    markdown += `*No relationships defined*\n\n`;
  }

  return markdown;
}
