export interface Requirement {
  id: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "proposed" | "approved" | "implemented" | "verified" | "deferred";
  category?: string;
  tags: string[];
}

// Define common structured types for metadata
export interface TimelineItem {
  date: string;
  milestone: string;
  description?: string;
}

export interface BudgetItem {
  category: string;
  amount: number;
  notes?: string;
}

export interface MetadataValue {
  string?: string;
  number?: number;
  boolean?: boolean;
  object?: Record<string, unknown>;
  array?: unknown[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  template_type: string;
  status: "draft" | "in_progress" | "completed";
  business_goals: string[];
  target_users: string[];
  domain?: string;
  functional_requirements: Requirement[];
  non_functional_requirements: Requirement[];
  metadata: Record<string, unknown>;
  version: number;
  timeline?: Record<string, TimelineItem>;
  budget?: Record<string, BudgetItem>;
}

// Matching backend entities

export interface EntityField {
  name: string;
  type: string;
  primary_key?: boolean;
  generated?: boolean;
  unique?: boolean;
  required?: boolean;
  default?: string | number | boolean;
  enum?: string[];
  foreign_key?: Record<string, unknown>;
}

export interface TemplateEntity {
  name: string;
  description: string;
  fields: EntityField[];
}

export interface Relationship {
  type: string;
  from_entity: string;
  to: string;
  field: string;
}

export interface DataModel {
  entities: TemplateEntity[];
  relationships: Relationship[];
}

export interface ApiEndpoint {
  path: string;
  description: string;
  methods: string[];
  auth: boolean;
  roles: string[];
}

export interface Api {
  endpoints: ApiEndpoint[];
}

export interface PageComponent {
  name: string;
  path: string;
  components: string[];
  enabled: boolean;
}

export interface Pages {
  public: PageComponent[];
  authenticated: PageComponent[];
  admin: PageComponent[];
}

export interface FeatureModule {
  name: string;
  description: string;
  enabled: boolean;
  optional: boolean;
  providers: string[];
}

export interface Features {
  core_modules: FeatureModule[];
}

export interface TestingFramework {
  framework: string;
  coverage: number;
  directories?: string[];
  focus?: string[];
  scenarios?: string[];
}

export interface Testing {
  unit: TestingFramework;
  integration: TestingFramework;
  e2e: TestingFramework;
}

export interface ProjectStructure {
  frontend: Record<string, string[]>;
}

export interface DeploymentEnvironment {
  name: string;
  url: string;
  variables: Record<string, unknown>[];
}

export interface CICD {
  provider: string;
  steps: string[];
}

export interface Deployment {
  environments: DeploymentEnvironment[];
  cicd: CICD;
}

export interface Diagram {
  name: string;
  type: string;
  template: string;
}

export interface Documentation {
  sections: string[];
  diagrams: Diagram[];
}

export interface TechStackData {
  frontend: string;
  backend: string;
  database: string;
  [key: string]: unknown;
}

export interface ProjectDefaults {
  name: string;
  description: string;
  business_goals: string[];
  target_users: string[];
}

// Update ProjectTemplate to match the backend structure
export interface ProjectTemplate {
  id: string; // Added for frontend
  name: string;
  version: string;
  description: string;
  projectDefaults: ProjectDefaults;
  techStack: TechStackData;
  features: Features;
  pages: Pages;
  data_model: DataModel;
  api: Api;
  testing: Testing;
  project_structure: ProjectStructure;
  deployment: Deployment;
  documentation: Documentation;
  tags?: string[]; // Added for frontend
  thumbnail?: string; // Added for frontend
}

export interface ProjectCreate {
  metadata?: {
    version: string;
    author: string;
    template?: { name: string; version: string };
  };
  name: string;
  description: string;
  template_type: string;
  business_goals: string[];
  target_users: string[];
  domain?: string;
  timeline?: Record<string, TimelineItem>;
  budget?: Record<string, BudgetItem>;
  functional_requirements?: Requirement[];
  non_functional_requirements?: Requirement[];
  template_id?: string;
  template_data?: ProjectTemplate;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  template_type?: string;
  status?: string;
  business_goals?: string[];
  target_users?: string[];
  domain?: string;
  timeline?: Record<string, TimelineItem>;
  budget?: Record<string, BudgetItem>;
  functional_requirements?: Requirement[];
  non_functional_requirements?: Requirement[];
  metadata?: Record<string, unknown>;
  template_data?: ProjectTemplate; // Changed from Record<string, unknown> to ProjectTemplate for consistency
}

export interface Specification {
  id: string;
  project_id: string;
  requirements: {
    project_type: string;
    functional_requirements: string[];
    non_functional_requirements: string[];
    tech_stack: {
      frontend: string;
      backend: string;
      database: string;
    };
  };
  architecture: {
    pattern: string;
    components: string[];
    data_flow: string[];
    diagram?: string;
  };
  data_model: {
    entities: Entity[];
  };
  api_endpoints: ApiEndpoint[];
  implementation: {
    file_structure: string[];
    key_components: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface Entity {
  name: string;
  attributes: {
    name: string;
    type: string;
    constraints: string[];
  }[];
  relationships: string[];
}

export interface Artifact {
  id: string;
  specification_id: string;
  type: "diagram" | "schema" | "document";
  format: "mermaid" | "json" | "markdown";
  content: string;
  created_at: string;
}
