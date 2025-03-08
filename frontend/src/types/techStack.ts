/**
 * Types for tech stack compatibility.
 */

export interface TechStackSelection {
  frontend_framework?: string;
  state_management?: string;
  ui_library?: string;
  form_handling?: string;
  backend_framework?: string;
  database?: string;
  orm?: string;
  auth?: string;
  hosting_frontend?: string;
  hosting_backend?: string;
  hosting_database?: string;
}

export interface CompatibilityResult {
  is_compatible: boolean;
  compatibility_issues: string[];
  compatible_options: Record<string, string[]>;
}

export interface CompatibleOptionsRequest {
  category: string;
  technology: string;
}

export interface CompatibleOptionsResponse {
  options: Record<string, string[]>;
}

/**
 * Technology compatibility options
 */
export interface TechnologyCompatibility {
  stateManagement?: string[];
  uiLibraries?: string[];
  formHandling?: string[];
  routing?: string[];
  apiClients?: string[];
  metaFrameworks?: string[];
  databases?: string[];
  orms?: string[];
  auth?: string[];
  hosting?: string[];
  storage?: string[];
  functions?: string[];
}

/**
 * Generic technology interface
 */
export interface Technology {
  name: string;
  description: string;
  language?: string;
  compatibility: TechnologyCompatibility;
}

export interface FrontendOptions {
  frameworks: Technology[];
}

export interface BackendOptions {
  frameworks: Technology[];
  baas: Technology[];
}

export interface DatabaseType {
  sql: Technology[];
  nosql: Technology[];
}

export interface TechStackData {
  frontend: FrontendOptions;
  backend: BackendOptions;
  database: DatabaseType;
  hosting: Record<string, string[]>;
  authentication: Record<string, string[]>;
}

export interface AllTechOptionsResponse {
  frontend: Record<string, string[] | Technology[]>;
  backend: Record<string, string[] | Technology[]>;
  database: Record<string, string[] | Technology[]>;
  hosting: Record<string, string[]>;
  authentication: Record<string, string[]>;
}
