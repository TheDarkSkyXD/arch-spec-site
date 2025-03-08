export interface Requirement {
  id: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "proposed" | "approved" | "implemented" | "verified" | "deferred";
  category?: string;
  tags: string[];
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
  organization?: string;
  project_lead?: string;
  functional_requirements: Requirement[];
  non_functional_requirements: Requirement[];
  metadata: {
    [key: string]: any;
  };
  version: number;
  timeline?: {
    [key: string]: any;
  };
  budget?: {
    [key: string]: any;
  };
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  project_defaults: {
    name: string;
    description: string;
    business_goals: string[];
    target_users: string[];
  };
  tech_stack: {
    frontend: string;
    backend: string;
    database: string;
    [key: string]: string;
  };
  features: {
    core_modules: Array<{
      name: string;
      description: string;
      enabled: boolean;
      optional: boolean;
      providers: string[];
    }>;
  };
  tags?: string[];
  thumbnail?: string;
}

export interface ProjectCreate {
  name: string;
  description: string;
  template_type: string;
  business_goals: string[];
  target_users: string[];
  domain?: string;
  organization?: string;
  project_lead?: string;
  timeline?: {
    [key: string]: any;
  };
  budget?: {
    [key: string]: any;
  };
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
  organization?: string;
  project_lead?: string;
  timeline?: {
    [key: string]: any;
  };
  budget?: {
    [key: string]: any;
  };
  functional_requirements?: Requirement[];
  non_functional_requirements?: Requirement[];
  metadata?: {
    [key: string]: any;
  };
  template_data?: {
    [key: string]: any;
  };
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

export interface ApiEndpoint {
  path: string;
  method: string;
  request_body?: string;
  response?: string;
  description: string;
}

export interface Artifact {
  id: string;
  specification_id: string;
  type: "diagram" | "schema" | "document";
  format: "mermaid" | "json" | "markdown";
  content: string;
  created_at: string;
}
