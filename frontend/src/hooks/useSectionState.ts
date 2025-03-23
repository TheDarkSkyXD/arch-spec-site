import { useState } from 'react';

// Define view modes
export enum ViewMode {
  EDIT = 'edit',
  PREVIEW = 'preview',
}

// Define section IDs for consistency
export enum SectionId {
  BASICS = 'basics',
  TECH_STACK = 'techStack',
  REQUIREMENTS = 'requirements',
  FEATURES = 'features',
  PAGES = 'pages',
  DATA_MODEL = 'dataModel',
  API_ENDPOINTS = 'apiEndpoints',
  TEST_CASES = 'testCases',
  IMPLEMENTATION_PROMPTS = 'implementationPrompts',
}

// Create default states for initialization
const DEFAULT_EXPANDED_STATE: Record<SectionId, boolean> = {
  [SectionId.BASICS]: true,
  [SectionId.TECH_STACK]: false,
  [SectionId.REQUIREMENTS]: false,
  [SectionId.FEATURES]: false,
  [SectionId.PAGES]: false,
  [SectionId.DATA_MODEL]: false,
  [SectionId.API_ENDPOINTS]: false,
  [SectionId.TEST_CASES]: false,
  [SectionId.IMPLEMENTATION_PROMPTS]: false,
};

const DEFAULT_VIEW_MODES: Record<SectionId, ViewMode> = {
  [SectionId.BASICS]: ViewMode.EDIT,
  [SectionId.TECH_STACK]: ViewMode.EDIT,
  [SectionId.REQUIREMENTS]: ViewMode.EDIT,
  [SectionId.FEATURES]: ViewMode.EDIT,
  [SectionId.PAGES]: ViewMode.EDIT,
  [SectionId.DATA_MODEL]: ViewMode.EDIT,
  [SectionId.API_ENDPOINTS]: ViewMode.EDIT,
  [SectionId.TEST_CASES]: ViewMode.EDIT,
  [SectionId.IMPLEMENTATION_PROMPTS]: ViewMode.EDIT,
};

export const useSectionState = (initialExpanded?: Partial<Record<SectionId, boolean>>) => {
  // State to track expanded sections with default values
  const [expandedSections, setExpandedSections] = useState<Record<SectionId, boolean>>({
    ...DEFAULT_EXPANDED_STATE,
    ...(initialExpanded || {}),
  });

  // State to track view mode (edit or preview) for each section
  const [sectionViewModes, setSectionViewModes] = useState<Record<SectionId, ViewMode>>(DEFAULT_VIEW_MODES);

  // Function to toggle section expansion
  const toggleSection = (sectionId: SectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Function to change view mode
  const changeViewMode = (sectionId: SectionId, viewMode: ViewMode) => {
    setSectionViewModes((prev) => ({
      ...prev,
      [sectionId]: viewMode,
    }));
  };

  return {
    expandedSections,
    sectionViewModes,
    toggleSection,
    changeViewMode,
  };
};