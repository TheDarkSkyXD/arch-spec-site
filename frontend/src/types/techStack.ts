// Common compatibility interfaces for different technology types
export interface FrameworkCompatibility {
  stateManagement?: string[];
  uiLibraries?: string[];
  formHandling?: string[];
  routing?: string[];
  apiClients?: string[];
  metaFrameworks?: string[];
  hosting?: string[];
  testing?: string[];
  languages?: string[];
}

export interface BackendFrameworkCompatibility {
  databases?: string[];
  orms?: string[];
  auth?: string[];
  hosting?: string[];
  testing?: string[];
}

export interface BaaSCompatibility {
  databases?: string[];
  auth?: string[];
  storage?: string[];
  functions?: string[];
  frontendFrameworks?: string[];
  realtime?: string[];
}

export interface DatabaseCompatibility {
  hosting?: string[];
  orms?: string[];
  frameworks?: string[];
  baas?: string[];
}

export interface SimpleCompatibility {
  compatibleWith?: string[] | Record<string, string[]>;
}

export interface HostingCompatibility {
  frontend?: string[];
  backend?: string[];
  database?: string[];
}

export interface TestingCompatibility {
  frameworks?: string[];
}

export interface StorageCompatibility {
  frameworks?: string[];
  baas?: string[];
}

export interface ServerlessCompatibility {
  frameworks?: string[];
  baas?: string[];
}

export interface RealtimeCompatibility {
  frameworks?: string[];
  baas?: string[];
}

// Technology interfaces for different types
export interface FrontendFramework {
  id?: string;
  type: "frontend";
  description: string;
  languages?: string[];
  compatibleWith: FrameworkCompatibility;
}

export interface BackendFramework {
  id?: string;
  type: "backend";
  description: string;
  language?: string;
  compatibleWith: BackendFrameworkCompatibility;
}

export interface BaaS {
  id?: string;
  type: "backend";
  description: string;
  compatibleWith: BaaSCompatibility;
}

export interface Database {
  id?: string;
  type: string;
  description: string;
  compatibleWith: DatabaseCompatibility;
}

export interface StateManagement {
  id?: string;
  description: string;
  compatibleWith: string[] | Record<string, string[]>;
}

export interface UILibrary {
  id?: string;
  description: string;
  compatibleWith: string[] | Record<string, string[]>;
}

export interface FormHandling {
  id?: string;
  description: string;
  compatibleWith: string[] | Record<string, string[]>;
}

export interface Routing {
  id?: string;
  description: string;
  compatibleWith: string[] | Record<string, string[]>;
}

export interface APIClient {
  id?: string;
  description: string;
  compatibleWith: string[] | Record<string, string[]>;
}

export interface MetaFramework {
  id?: string;
  description: string;
  compatibleWith: string[] | Record<string, string[]>;
}

export interface ORM {
  id?: string;
  description: string;
  compatibleWith: Record<string, string[]>;
}

export interface Auth {
  id?: string;
  description: string;
  compatibleWith: Record<string, string[]>;
}

export interface Hosting {
  id?: string;
  type: string;
  description: string;
  compatibleWith: string[] | Record<string, string[]>;
}

export interface Testing {
  id?: string;
  type: string;
  description: string;
  compatibleWith: Record<string, string[]>;
}

export interface Storage {
  id?: string;
  type: string;
  description: string;
  compatibleWith: Record<string, string[]>;
}

export interface Serverless {
  id?: string;
  type: string;
  description: string;
  compatibleWith: Record<string, string[]>;
}

export interface Realtime {
  id?: string;
  type: string;
  description: string;
  compatibleWith: Record<string, string[]>;
}

// Categories for hierarchical navigation
export interface FrontendCategories {
  frameworks: string[];
  languages: string[];
  stateManagement: string[];
  uiLibraries: string[];
  formHandling: string[];
  routing: string[];
  apiClients: string[];
  metaFrameworks: string[];
}

export interface BackendCategories {
  frameworks: string[];
  languages: string[];
  baas: string[];
  serverless: string[];
  realtime: string[];
}

export interface DatabaseCategories {
  sql: string[];
  nosql: string[];
  providers: string[];
  clients: string[];
}

export interface AuthenticationCategories {
  providers: string[];
  methods: string[];
}

export interface DeploymentCategories {
  platforms: string[];
  containerization: string[];
  ci_cd: string[];
}

export interface StorageCategories {
  objectStorage: string[];
  fileSystem: string[];
}

export interface HostingCategories {
  frontend: string[];
  backend: string[];
  database: string[];
}

export interface TestingCategories {
  unitTesting: string[];
  e2eTesting: string[];
  apiTesting: string[];
}

export interface Categories {
  frontend: FrontendCategories;
  backend: BackendCategories;
  database: DatabaseCategories;
  authentication: AuthenticationCategories;
  deployment: DeploymentCategories;
  storage: StorageCategories;
  hosting: HostingCategories;
  testing: TestingCategories;
}

// Technologies with detailed information and compatibility
export interface Technologies {
  frameworks: Record<string, FrontendFramework | BackendFramework>;
  baas: Record<string, BaaS>;
  stateManagement: Record<string, StateManagement>;
  uiLibraries: Record<string, UILibrary>;
  formHandling: Record<string, FormHandling>;
  routing: Record<string, Routing>;
  apiClients: Record<string, APIClient>;
  metaFrameworks: Record<string, MetaFramework>;
  databases: Record<string, Database>;
  orms: Record<string, ORM>;
  auth: Record<string, Auth>;
  hosting: Record<string, Hosting>;
  testing: Record<string, Testing>;
  storage: Record<string, Storage>;
  serverless: Record<string, Serverless>;
  realtime: Record<string, Realtime>;
}

// Technology type alias to represent any technology
export type Technology =
  | FrontendFramework
  | BackendFramework
  | BaaS
  | Database
  | StateManagement
  | UILibrary
  | FormHandling
  | Routing
  | APIClient
  | MetaFramework
  | ORM
  | Auth
  | Hosting
  | Testing
  | Storage
  | Serverless
  | Realtime;

// Main tech stack data interface
export interface TechStackData {
  categories: Categories;
  technologies: Technologies;
}
