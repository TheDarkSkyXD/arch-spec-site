/**
 * Types for project templates.
 */

export interface ProjectDefaults {
  name: string;
  description: string;
  businessGoals: string[];
  targetUsers: string[];
}

export interface TechStackFrontend {
  framework: string;
  language: string;
  stateManagement?: string;
  uiLibrary?: string;
  formHandling?: string;
  routing?: string;
  options: string[];
}

export interface TechStackBackend {
  type: string;
  provider?: string;
  options: string[];
}

export interface TechStackDatabase {
  type: string;
  provider?: string;
  options: string[];
}

export interface TechStackAuthentication {
  provider: string;
  methods: string[];
  options: string[];
}

export interface TechStackHosting {
  frontend?: string;
  backend?: string;
  options: string[];
}

export interface TechStack {
  frontend: TechStackFrontend;
  backend: TechStackBackend;
  database: TechStackDatabase;
  authentication: TechStackAuthentication;
  hosting: TechStackHosting;
}

export interface FeatureModule {
  name: string;
  description: string;
  enabled: boolean;
  optional?: boolean;
  providers?: string[];
}

export interface Features {
  coreModules: FeatureModule[];
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

export interface EntityField {
  name: string;
  type: string;
  primaryKey?: boolean;
  generated?: boolean;
  unique?: boolean;
  required?: boolean;
  default?: string;
  enum?: string[];
  foreignKey?: Record<string, any>;
}

export interface Entity {
  name: string;
  description: string;
  fields: EntityField[];
}

export interface Relationship {
  type: string;
  from: string;
  to: string;
  field: string;
}

export interface DataModel {
  entities: Entity[];
  relationships: Relationship[];
}

export interface ApiEndpoint {
  path: string;
  description: string;
  methods: string[];
  auth: boolean;
  roles?: string[];
}

export interface Api {
  endpoints: ApiEndpoint[];
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
  frontend: {
    directories: string[];
    files: string[];
  };
}

export interface DeploymentVariable {
  name: string;
  value: string;
  secret: boolean;
}

export interface DeploymentEnvironment {
  name: string;
  url: string;
  variables: DeploymentVariable[];
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

export interface ProjectTemplate {
  id?: string;
  name: string;
  version: string;
  description: string;
  tags?: string[];
  projectDefaults: ProjectDefaults;
  techStack: TechStack;
  features: Features;
  pages: Pages;
  dataModel: DataModel;
  api: Api;
  testing: Testing;
  projectStructure: ProjectStructure;
  deployment: Deployment;
  documentation: Documentation;
}
