import { useMemo } from 'react';
import { ApiEndpoint, ApiEndpointCategory } from '../types';

export const useApiEndpointCategories = (endpoints: ApiEndpoint[]) => {
  const categories = useMemo(() => {
    const categorizedEndpoints = new Map<string, ApiEndpoint[]>();

    endpoints.forEach((endpoint) => {
      // Extract category from path (e.g., /api/v1/auth/login -> auth)
      const pathParts = endpoint.path.split('/').filter(Boolean);
      const categoryIndex = pathParts.findIndex((part) => part === 'v1') + 1;
      const category = pathParts[categoryIndex] || 'other';

      if (!categorizedEndpoints.has(category)) {
        categorizedEndpoints.set(category, []);
      }
      categorizedEndpoints.get(category)?.push(endpoint);
    });

    // Convert map to array and sort endpoints within each category
    const sortedCategories: ApiEndpointCategory[] = Array.from(categorizedEndpoints.entries())
      .map(([name, endpoints]) => ({
        name,
        endpoints: endpoints.sort((a, b) => a.path.localeCompare(b.path)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return sortedCategories;
  }, [endpoints]);

  const filterEndpoints = (
    categories: ApiEndpointCategory[],
    searchTerm: string,
    selectedMethods: string[],
    showAuthOnly: boolean
  ): ApiEndpointCategory[] => {
    return categories
      .map((category) => ({
        ...category,
        endpoints: category.endpoints.filter((endpoint) => {
          const matchesSearch =
            searchTerm === '' ||
            endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
            endpoint.description.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesMethods =
            selectedMethods.length === 0 ||
            endpoint.methods.some((method) => selectedMethods.includes(method));

          const matchesAuth = !showAuthOnly || endpoint.auth;

          return matchesSearch && matchesMethods && matchesAuth;
        }),
      }))
      .filter((category) => category.endpoints.length > 0);
  };

  return {
    categories,
    filterEndpoints,
  };
}; 