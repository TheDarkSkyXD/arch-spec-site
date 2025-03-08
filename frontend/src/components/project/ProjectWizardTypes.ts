import { ProjectCreate, ProjectTemplate, Requirement } from "../../types/project";

// Type definitions for form data
export interface FeatureModule {
  name: string;
  description: string;
  enabled: boolean;
  optional: boolean;
  providers: string[];
}

export interface PageComponent {
  name: string;
  path: string;
  components: string[];
  enabled: boolean;
}

export interface ApiEndpoint {
  path: string;
  description: string;
  methods: string[];
  auth: boolean;
  roles: string[];
}

export interface ProjectMetadata {
  version: string;
  author: string;
  template?: {
    name: string;
    version: string;
  };
}

export interface ProjectWizardFormData extends Partial<ProjectCreate> {
  template_data?: ProjectTemplate & {
    features?: {
      core_modules: FeatureModule[];
    };
    pages?: {
      public: PageComponent[];
      authenticated: PageComponent[];
      admin: PageComponent[];
    };
    api?: {
      endpoints: ApiEndpoint[];
    };
  };
}

export interface BasicsFormData {
  name: string;
  description: string;
  business_goals: string | string[];
  target_users: string | string[];
  domain: string;
  organization: string;
  project_lead: string;
}

export interface TechStackFormData {
  frontend: string;
  backend: string;
  database: string;
  frontend_language: string;
  ui_library: string;
  state_management: string;
  backend_provider: string;
  database_provider: string;
  auth_provider: string;
  auth_methods: string;
}

export interface RequirementsFormData {
  functional_requirements: Requirement[];
  non_functional_requirements: Requirement[];
}

export interface FeaturesFormData {
  core_modules: FeatureModule[];
}

export interface PagesFormData {
  public: PageComponent[];
  authenticated: PageComponent[];
  admin: PageComponent[];
}

export interface ApiEndpointsFormData {
  endpoints: ApiEndpoint[];
}