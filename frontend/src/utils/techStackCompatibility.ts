/**
 * Utility functions for tech stack compatibility.
 */
import { TechStackSelection, CompatibilityResult } from "../types/techStack";
import { techStackService } from "../services/techStackService";

/**
 * Check if a technology selection is compatible.
 *
 * @param selection - The current tech stack selection
 * @returns Promise containing compatibility result
 */
export const checkTechStackCompatibility = async (
  selection: TechStackSelection
): Promise<CompatibilityResult> => {
  try {
    return await techStackService.checkCompatibility(selection);
  } catch (error) {
    console.error("Error checking tech stack compatibility:", error);
    return {
      is_compatible: false,
      compatibility_issues: ["Failed to check compatibility"],
      compatible_options: {},
    };
  }
};

/**
 * Get compatible options for a selected technology.
 *
 * @param category - The technology category (e.g., 'frontend_framework')
 * @param technology - The selected technology
 * @returns Object containing compatible options
 */
export const getCompatibleOptions = async (
  category: string,
  technology: string
): Promise<Record<string, string[]>> => {
  try {
    const response = await techStackService.getCompatibleOptions(
      category,
      technology
    );
    return response.options;
  } catch (error) {
    console.error("Error getting compatible options:", error);
    return {};
  }
};

/**
 * Filter options based on compatibility with current selection.
 *
 * @param options - All available options
 * @param compatibleOptions - Compatible options based on current selection
 * @returns Filtered options that are compatible
 */
export const filterCompatibleOptions = (
  options: string[],
  compatibleOptions: string[]
): string[] => {
  if (!compatibleOptions || compatibleOptions.length === 0) {
    return options;
  }
  return options.filter((option) => compatibleOptions.includes(option));
};

/**
 * Generate a human-readable message for compatibility issues.
 *
 * @param issues - Array of compatibility issues
 * @returns String with formatted compatibility issues
 */
export const formatCompatibilityIssues = (issues: string[]): string => {
  if (!issues || issues.length === 0) {
    return "";
  }

  return `Compatibility Issues:\n${issues
    .map((issue) => `• ${issue}`)
    .join("\n")}`;
};
