import { BaaS, BackendFramework, Realtime, Serverless, Technology } from "../types/techStack";

/**
 * Filters backend framework options based on selected language
 */
export const filterBackendFrameworkOptions = (
  selectedLanguage: string | undefined,
  backendFrameworks: BackendFramework[],
): Technology[] => {
  // If no language selected, show all frameworks
  if (!selectedLanguage) {
    return backendFrameworks;
  }

  // Filter frameworks that support the selected language
  return backendFrameworks.filter((framework) => {
    return (
      !framework.language || framework.language.includes(selectedLanguage)
    );
  });
};

/**
 * Filters backend realtime options based on the backend type and selected service/framework
 */
export const filterBackendRealtimeOptions = (
  backendType: string | undefined,
  selectedFramework: string | undefined,
  selectedService: string | undefined,
  backendFrameworks: BackendFramework[],
  backendRealtime: Realtime[]
): Technology[] => {
  // If no type selected, show no options
  if (!backendType) {
    return [];
  }

  // Filter realtime options based on backend type
  if (backendType === "framework") {
    // Return framework-compatible realtime options
    if (!selectedFramework) return backendRealtime;

    // Find compatible realtime options for this framework
    const framework = backendFrameworks.find(
      (fw) => fw.id === selectedFramework
    );

    if (!framework || !framework.compatibleWith?.realtime) {
      return backendRealtime; // If no specific compatibility, return all
    }

    // Return only compatible realtime options
    return backendRealtime.filter((rt) =>
      framework.compatibleWith?.realtime?.includes(rt.id as string)
    );
  } else if (backendType === "baas") {
    // Return BaaS-specific realtime options
    if (!selectedService) return backendRealtime;

    // Filter realtime options that match the selected BaaS
    return backendRealtime.filter((rt) =>
      rt.compatibleWith?.baas?.includes(selectedService)
    );
  }

  // For serverless, don't show realtime options
  return [];
};

/**
 * Filters backend serverless function options based on selected BaaS service
 */
export const filterBackendFunctionsOptions = (
  selectedService: string | undefined,
  backendFunctions: Serverless[]
): Technology[] => {
  // If no service selected, show no options
  if (!selectedService) {
    return [];
  }

  // Return functions compatible with selected BaaS
  return backendFunctions.filter((func) =>
    func.compatibleWith?.baas?.includes(selectedService)
  );
};

/**
 * Filters backend BaaS options based on selected functions or realtime needs
 */
export const filterBackendBaaSOptions = (
  selectedRealtime: string | undefined,
  selectedFunctions: string | undefined,
  backendBaaS: BaaS[]
): Technology[] => {
  // If nothing selected, show all BaaS options
  if (!selectedRealtime && !selectedFunctions) {
    return backendBaaS;
  }

  let filtered = [...backendBaaS];

  // Filter by realtime capability if selected
  if (selectedRealtime) {
    filtered = filtered.filter(
      (baas) =>
        baas.compatibleWith?.realtime?.includes(selectedRealtime)
    );
  }

  // Filter by functions capability if selected
  if (selectedFunctions) {
    filtered = filtered.filter(
      (baas) =>
        baas.compatibleWith?.functions?.includes(selectedFunctions)
    );
  }

  return filtered;
};

/**
 * Gets suitable backend services based on backend type
 */
export const getBackendServiceOptions = (
  backendType: string | undefined,
  backendBaaS: Technology[],
  backendServerless: Technology[]
): Technology[] => {
  if (!backendType) return [];

  if (backendType === "baas") {
    return backendBaaS;
  } else if (backendType === "serverless") {
    return backendServerless;
  }

  return [];
};
