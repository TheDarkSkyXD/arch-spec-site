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

export interface TechStackData {
  frontend: {
    frameworks: TechStackFramework[];
  };
  backend: {
    frameworks: TechStackBackendFramework[];
    baas: TechStackBaaS[];
  };
  database: {
    sql: TechStackDatabase[];
    nosql: TechStackDatabase[];
  };
  // Add other categories as needed
}

export interface TechStackFramework {
  name: string;
  description: string;
  compatibility: {
    stateManagement: string[];
    uiLibraries: string[];
    formHandling: string[];
    routing: string[];
    apiClients: string[];
    metaFrameworks: string[];
  };
}

export interface TechStackBackendFramework {
  name: string;
  description: string;
  language: string;
  compatibility: {
    databases: string[];
    orms: string[];
    auth: string[];
  };
}

export interface TechStackBaaS {
  name: string;
  description: string;
  compatibility: {
    databases: string[];
    auth: string[];
    storage: string[];
    functions: string[];
  };
}

export interface TechStackDatabase {
  name: string;
  description: string;
  compatibility: {
    hosting: string[];
    orms: string[];
  };
}
