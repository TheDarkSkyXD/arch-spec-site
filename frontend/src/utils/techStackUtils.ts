import { Categories, Technologies, TechStackData } from '../types/techStack';

/**
 * Find all compatible technologies from one category based on a selected technology
 *
 * @param techStackData The complete tech stack data
 * @param selectedCategory The category of the selected technology (e.g. 'frameworks', 'databases')
 * @param selectedTechnology The name of the selected technology
 * @param targetCategory The category to find compatible technologies from
 * @returns Array of compatible technology names
 */
export function getCompatibleTechnologies(
  techStackData: TechStackData,
  selectedCategory: string,
  selectedTechnology: string,
  targetCategory: string
): string[] {
  // Get the technology object
  const category = selectedCategory as keyof TechStackData['technologies'];
  const technologies = techStackData.technologies[category];
  if (!technologies) return [];

  const technology = technologies[selectedTechnology];
  if (!technology) return [];

  // Access the compatibleWith property
  const compatibleWith = technology.compatibleWith;
  if (!compatibleWith) return [];

  // If compatibleWith is an array, return it directly
  if (Array.isArray(compatibleWith)) {
    return compatibleWith;
  }

  // If it's an object with the target category, return that array
  if (
    typeof compatibleWith === 'object' &&
    compatibleWith !== null &&
    targetCategory in compatibleWith
  ) {
    return compatibleWith[targetCategory as keyof typeof compatibleWith];
  }

  return [];
}

/**
 * Filter all available technologies in a specific category based on multiple selections
 *
 * @param techStackData The complete tech stack data
 * @param selections Map of category to selected technology (e.g. { 'frameworks': 'React', 'databases': 'MongoDB' })
 * @param targetCategory The category to filter options for
 * @returns Array of compatible technology names that work with all selections
 */
export function filterCompatibleTechnologies(
  techStackData: TechStackData,
  selections: Record<string, string>,
  targetCategory: string
): string[] {
  // If no selections have been made, return all technologies in the target category
  const selectionEntries = Object.entries(selections);
  if (selectionEntries.length === 0) {
    const categoryKey = findCategoryKeyForSubcategory(techStackData, targetCategory);
    if (categoryKey) {
      const categoryObj = techStackData.categories[categoryKey as keyof Categories];
      if (categoryObj && targetCategory in categoryObj) {
        // Use a safer type assertion by first converting to unknown
        return (categoryObj as unknown as Record<string, string[]>)[targetCategory];
      }
    }
    return Object.keys(techStackData.technologies[targetCategory as keyof Technologies] || {});
  }

  // For each selection, get compatible technologies
  const compatibleSets = selectionEntries.map(([category, technology]) => {
    return new Set(getCompatibleTechnologies(techStackData, category, technology, targetCategory));
  });

  // Find intersection of all sets
  if (compatibleSets.length === 0) return [];

  // Start with the first set
  const intersection = Array.from(compatibleSets[0]);

  // Filter by each subsequent set
  for (let i = 1; i < compatibleSets.length; i++) {
    const set = compatibleSets[i];
    for (let j = intersection.length - 1; j >= 0; j--) {
      if (!set.has(intersection[j])) {
        intersection.splice(j, 1);
      }
    }
  }

  return intersection;
}

/**
 * Find which top-level category contains a specific subcategory
 */
function findCategoryKeyForSubcategory(
  techStackData: TechStackData,
  subcategory: string
): string | null {
  const categories = techStackData.categories;

  for (const [key, value] of Object.entries(categories)) {
    if (value && typeof value === 'object' && subcategory in value) {
      return key;
    }
  }

  return null;
}
