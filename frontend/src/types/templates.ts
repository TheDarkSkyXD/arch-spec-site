/**
 * Types for project templates.
 */

export interface ProjectDefaults {
  name: string;
  description: string;
  businessGoals: string[];
  targetUsers: string[];
}

// Frontend Types
export interface FrontendTechStack {
  framework: string;
  language: string;
  stateManagement?: string;
  uiLibrary?: string;
  formHandling?: string;
  routing?: string;
  apiClient?: string;
  metaFramework?: string | null;
}

// Backend Types
export interface FrameworkBackend {
  type: "framework";
  framework: string; // Express.js, NestJS, Django, etc.
  language: string; // JavaScript, TypeScript, Python, etc.
  realtime?: string | null;
}

export interface BaaSBackend {
  type: "baas";
  service: string; // Supabase, Firebase, etc.
  functions?: string | null;
  realtime?: string | null;
}

export interface ServerlessBackend {
  type: "serverless";
  service: string; // AWS Lambda, Azure Functions, etc.
  language: string; // JavaScript, TypeScript, Python, etc.
}

// Combined Backend
export type BackendTechStack =
  | FrameworkBackend
  | BaaSBackend
  | ServerlessBackend;

// Database Types
export interface SQLDatabase {
  type: "sql";
  system: string; // PostgreSQL, MySQL, etc.
  hosting: string; // Supabase, AWS RDS, etc.
  orm?: string | null;
}

export interface NoSQLDatabase {
  type: "nosql";
  system: string; // MongoDB, Firestore, etc.
  hosting: string; // MongoDB Atlas, Firebase, etc.
  client?: string | null;
}

// Combined Database
export type DatabaseTechStack = SQLDatabase | NoSQLDatabase;

// Authentication
export interface AuthenticationTechStack {
  provider: string;
  methods: string[];
}

// Hosting
export interface HostingTechStack {
  frontend: string;
  backend: string;
  database?: string;
}

// Storage
export interface StorageTechStack {
  type: string; // objectStorage, fileSystem
  service: string;
}

// Deployment
export interface DeploymentTechStack {
  ci_cd?: string | null;
  containerization?: string | null;
}

// Complete Project Template
export interface ProjectTechStack {
  frontend: FrontendTechStack;
  backend: BackendTechStack;
  database: DatabaseTechStack;
  authentication: AuthenticationTechStack;
  hosting: HostingTechStack;
  storage?: StorageTechStack;
  deployment?: DeploymentTechStack;
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
  default?: string | number | boolean;
  enum?: string[];
  foreignKey?: Record<string, string | number | boolean>;
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
  techStack: ProjectTechStack;
  features: Features;
  pages: Pages;
  dataModel: DataModel;
  api: Api;
  testing: Testing;
  projectStructure: ProjectStructure;
  deployment: Deployment;
  documentation: Documentation;
}

export interface ProjectTemplateResponse {
  id: string;
  template: ProjectTemplate;
}

export interface ProjectTemplateList {
  templates: ProjectTemplateResponse[];
}
