/**
 * Utility functions for formatting markdown tables
 */

/**
 * Pads a string to a specific length with the specified padding character
 * @param str The string to pad
 * @param length The target length
 * @param padChar The character to use for padding (default: space)
 * @returns The padded string
 */
export function padString(str: string, length: number, padChar: string = ' '): string {
  const padding = length - str.length;
  if (padding <= 0) return str;
  return str + padChar.repeat(padding);
}

/**
 * Calculate the optimal width for a column based on its content
 * @param values Array of string values in the column
 * @returns The calculated width with padding
 */
export function calculateColumnWidth(values: string[]): number {
  return Math.max(...values.map((s) => s.length)) + 2;
}

/**
 * Generate a markdown table with precise column spacing
 * @param headers Array of column headers
 * @param rows Array of row data (each row is an array of strings)
 * @param separators Optional custom separator strings for the header row
 * @returns Formatted markdown table as a string
 */
export function formatMarkdownTable(
  headers: string[],
  rows: string[][],
  separators?: string[]
): string {
  // Default separators if not provided
  const defaultSeparators = headers.map((header) => '-'.repeat(Math.max(4, header.length)));

  const finalSeparators = separators || defaultSeparators;

  // Calculate column widths including header values
  const columnValues: string[][] = [];

  // Initialize with headers
  for (let i = 0; i < headers.length; i++) {
    columnValues[i] = [headers[i]];
  }

  // Add all row values to respective column arrays
  rows.forEach((row) => {
    row.forEach((cell, index) => {
      if (index < columnValues.length) {
        columnValues[index].push(cell);
      }
    });
  });

  // Calculate column widths
  const columnWidths = columnValues.map((column) => calculateColumnWidth(column));

  // Build the table
  let table = '```\n';

  // Header row
  table += '| ';
  headers.forEach((header, index) => {
    table += padString(header, columnWidths[index]) + ' | ';
  });
  table += '\n';

  // Separator row
  table += '| ';
  finalSeparators.forEach((separator, index) => {
    table += padString(separator, columnWidths[index], '-') + ' | ';
  });
  table += '\n';

  // Data rows
  rows.forEach((row) => {
    table += '| ';
    row.forEach((cell, index) => {
      if (index < columnWidths.length) {
        table += padString(cell, columnWidths[index]) + ' | ';
      }
    });
    table += '\n';
  });

  table += '```\n\n';
  return table;
}
