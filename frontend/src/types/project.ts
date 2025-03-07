export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  template_type: string;
  status: "draft" | "in_progress" | "completed";
  metadata: {
    version: string;
    author: string;
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

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  tech_stack: {
    frontend: string;
    backend: string;
    database: string;
  };
  tags: string[];
  thumbnail: string;
}
