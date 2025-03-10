import {
  Technology,
  UILibrary,
  StateManagement,
  FrontendFramework,
} from "../types/techStack";

/**
 * Filters language options based on selected technologies
 */
export const filterLanguageOptions = (
  selectedFramework: string | undefined,
  selectedUILibrary: string | undefined,
  selectedStateManagement: string | undefined,
  frontendFrameworks: Technology[],
  uiLibraryOptions: UILibrary[],
  stateManagementOptions: StateManagement[]
): string[] => {
  // Default language options
  const defaultLanguages = ["JavaScript", "TypeScript"];

  if (!selectedFramework && !selectedUILibrary && !selectedStateManagement) {
    return defaultLanguages;
  }

  // Get the selected framework object
  const selectedFrameworkObj = selectedFramework
    ? (frontendFrameworks.find((f) => f.id === selectedFramework) as
        | FrontendFramework
        | undefined)
    : undefined;

  // If framework is selected, filter by its compatible languages
  if (selectedFrameworkObj?.languages) {
    return selectedFrameworkObj.languages;
  }

  // If UI library is selected, filter frameworks by compatibility
  if (selectedUILibrary) {
    const compatibleLib = uiLibraryOptions.find(
      (lib) => lib.id === selectedUILibrary
    );
    if (compatibleLib?.compatibleWith) {
      // Get compatible frameworks
      const frameworks = Array.isArray(compatibleLib.compatibleWith)
        ? compatibleLib.compatibleWith
        : Object.keys(compatibleLib.compatibleWith);

      // Get all languages supported by compatible frameworks
      const languages = new Set<string>();
      frameworks.forEach((fwId) => {
        const fw = frontendFrameworks.find((f) => f.id === fwId) as
          | FrontendFramework
          | undefined;
        if (fw?.languages) {
          fw.languages.forEach((lang) => languages.add(lang));
        }
      });

      return languages.size > 0 ? Array.from(languages) : defaultLanguages;
    }
  }

  // Similar for state management
  if (selectedStateManagement) {
    const compatibleSM = stateManagementOptions.find(
      (sm) => sm.id === selectedStateManagement
    );
    if (compatibleSM?.compatibleWith) {
      // Get compatible frameworks
      const frameworks = Array.isArray(compatibleSM.compatibleWith)
        ? compatibleSM.compatibleWith
        : Object.keys(compatibleSM.compatibleWith);

      // Get all languages supported by compatible frameworks
      const languages = new Set<string>();
      frameworks.forEach((fwId) => {
        const fw = frontendFrameworks.find((f) => f.id === fwId) as
          | FrontendFramework
          | undefined;
        if (fw?.languages) {
          fw.languages.forEach((lang) => languages.add(lang));
        }
      });

      return languages.size > 0 ? Array.from(languages) : defaultLanguages;
    }
  }

  return defaultLanguages;
};

/**
 * Filters framework options based on selected technologies
 */
export const filterFrameworkOptions = (
  selectedLanguage: string | undefined,
  selectedUILibrary: string | undefined,
  selectedStateManagement: string | undefined,
  frontendFrameworks: Technology[],
  uiLibraryOptions: UILibrary[],
  stateManagementOptions: StateManagement[]
): Technology[] => {
  // If nothing selected, show all frameworks
  if (!selectedLanguage && !selectedUILibrary && !selectedStateManagement) {
    return frontendFrameworks;
  }

  // Start with all frameworks
  let filtered = [...frontendFrameworks];

  // Filter by language if selected
  if (selectedLanguage) {
    filtered = filtered.filter((fw) => {
      const fwObj = fw as FrontendFramework;
      return fwObj.languages?.includes(selectedLanguage);
    });
  }

  // Filter by UI library if selected
  if (selectedUILibrary) {
    const compatibleLib = uiLibraryOptions.find(
      (lib) => lib.id === selectedUILibrary
    );
    if (compatibleLib?.compatibleWith) {
      const compatibleFrameworks = Array.isArray(compatibleLib.compatibleWith)
        ? compatibleLib.compatibleWith
        : Object.keys(compatibleLib.compatibleWith);

      filtered = filtered.filter((fw) =>
        compatibleFrameworks.includes(fw.id as string)
      );
    }
  }

  // Filter by state management if selected
  if (selectedStateManagement) {
    const compatibleSM = stateManagementOptions.find(
      (sm) => sm.id === selectedStateManagement
    );
    if (compatibleSM?.compatibleWith) {
      const compatibleFrameworks = Array.isArray(compatibleSM.compatibleWith)
        ? compatibleSM.compatibleWith
        : Object.keys(compatibleSM.compatibleWith);

      filtered = filtered.filter((fw) =>
        compatibleFrameworks.includes(fw.id as string)
      );
    }
  }

  return filtered;
};

/**
 * Filters UI library options based on selected technologies
 */
export const filterUILibraryOptions = (
  selectedFramework: string | undefined,
  selectedLanguage: string | undefined,
  selectedStateManagement: string | undefined,
  frontendFrameworks: Technology[],
  uiLibraryOptions: UILibrary[],
  stateManagementOptions: StateManagement[]
): UILibrary[] => {
  // If nothing selected, show all UI libraries
  if (!selectedFramework && !selectedLanguage && !selectedStateManagement) {
    return uiLibraryOptions;
  }

  let compatibleLibraries: string[] = [];

  // If framework is selected, get compatible UI libraries
  if (selectedFramework) {
    const framework = frontendFrameworks.find(
      (f) => f.id === selectedFramework
    ) as FrontendFramework;
    if (framework?.compatibleWith?.uiLibraries) {
      compatibleLibraries = framework.compatibleWith.uiLibraries;
    }
  }

  // Filter UI libraries
  return uiLibraryOptions.filter((lib) => {
    // If framework selected, check if library is compatible
    if (selectedFramework && compatibleLibraries.length > 0) {
      return compatibleLibraries.includes(lib.id as string);
    }

    // Check if library is compatible with selected language via framework
    if (selectedLanguage) {
      // Find frameworks that support this language
      const langFrameworks = frontendFrameworks.filter((fw) => {
        const fwObj = fw as FrontendFramework;
        return fwObj.languages?.includes(selectedLanguage);
      });

      // Check if any of these frameworks are compatible with this UI library
      const libCompatible = Array.isArray(lib.compatibleWith)
        ? lib.compatibleWith
        : Object.keys(lib.compatibleWith);

      return langFrameworks.some((fw) =>
        libCompatible.includes(fw.id as string)
      );
    }

    // Check if library is compatible with selected state management
    if (selectedStateManagement) {
      const sm = stateManagementOptions.find(
        (s) => s.id === selectedStateManagement
      );
      if (!sm) return true;

      const smCompatible = Array.isArray(sm.compatibleWith)
        ? sm.compatibleWith
        : Object.keys(sm.compatibleWith);

      const libCompatible = Array.isArray(lib.compatibleWith)
        ? lib.compatibleWith
        : Object.keys(lib.compatibleWith);

      // Check if there's at least one framework compatible with both
      return frontendFrameworks.some(
        (fw) =>
          smCompatible.includes(fw.id as string) &&
          libCompatible.includes(fw.id as string)
      );
    }

    return true;
  });
};

/**
 * Filters state management options based on selected technologies
 */
export const filterStateManagementOptions = (
  selectedFramework: string | undefined,
  selectedLanguage: string | undefined,
  selectedUILibrary: string | undefined,
  frontendFrameworks: Technology[],
  uiLibraryOptions: UILibrary[],
  stateManagementOptions: StateManagement[]
): StateManagement[] => {
  // If nothing selected, show all state management options
  if (!selectedFramework && !selectedLanguage && !selectedUILibrary) {
    return stateManagementOptions;
  }

  let compatibleSM: string[] = [];

  // If framework is selected, get compatible state management
  if (selectedFramework) {
    const framework = frontendFrameworks.find(
      (f) => f.id === selectedFramework
    ) as FrontendFramework;
    if (framework?.compatibleWith?.stateManagement) {
      compatibleSM = framework.compatibleWith.stateManagement;
    }
  }

  // Filter state management options
  return stateManagementOptions.filter((sm) => {
    // If framework selected, check if state management is compatible
    if (selectedFramework && compatibleSM.length > 0) {
      return compatibleSM.includes(sm.id as string);
    }

    // Check if state management is compatible with selected language via framework
    if (selectedLanguage) {
      // Find frameworks that support this language
      const langFrameworks = frontendFrameworks.filter((fw) => {
        const fwObj = fw as FrontendFramework;
        return fwObj.languages?.includes(selectedLanguage);
      });

      // Check if any of these frameworks are compatible with this state management
      const smCompatible = Array.isArray(sm.compatibleWith)
        ? sm.compatibleWith
        : Object.keys(sm.compatibleWith);

      return langFrameworks.some((fw) =>
        smCompatible.includes(fw.id as string)
      );
    }

    // Check if state management is compatible with selected UI library
    if (selectedUILibrary) {
      const lib = uiLibraryOptions.find((l) => l.id === selectedUILibrary);
      if (!lib) return true;

      const libCompatible = Array.isArray(lib.compatibleWith)
        ? lib.compatibleWith
        : Object.keys(lib.compatibleWith);

      const smCompatible = Array.isArray(sm.compatibleWith)
        ? sm.compatibleWith
        : Object.keys(sm.compatibleWith);

      // Check if there's at least one framework compatible with both
      return frontendFrameworks.some(
        (fw) =>
          libCompatible.includes(fw.id as string) &&
          smCompatible.includes(fw.id as string)
      );
    }

    return true;
  });
};

/**
 * Gets the selected framework object
 */
export const getSelectedFrameworkObject = (
  selectedFramework: string | undefined,
  frontendFrameworks: Technology[]
): FrontendFramework | null => {
  if (!selectedFramework) return null;
  return frontendFrameworks.find(
    (f) => f.id === selectedFramework
  ) as FrontendFramework | null;
};
