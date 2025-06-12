// Helper to safely render tech stack info
export const renderTechStack = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  } else if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }
  return 'Not specified';
};
