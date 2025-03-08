/**
 * TypeScript definitions for the Tech Registry schema
 * Based on backend/app/schemas/tech_registry_schema.py
 */

/**
 * Frontend technologies in the registry
 */
export interface FrontendTechnologies {
  frameworks: string[];
  languages: string[];
  stateManagement: string[];
  uiLibraries: string[];
  formHandling: string[];
  routing: string[];
  apiClients: string[];
  metaFrameworks: string[];
}

/**
 * Backend technologies in the registry
 */
export interface BackendTechnologies {
  frameworks: string[];
  languages: string[];
  orms: string[];
  authFrameworks: string[];
}

/**
 * Database technologies in the registry
 */
export interface DatabaseTechnologies {
  relational: string[];
  noSql: string[];
  providers: string[];
}

/**
 * Authentication technologies in the registry
 */
export interface AuthenticationTechnologies {
  providers: string[];
  methods: string[];
}

/**
 * Deployment technologies in the registry
 */
export interface DeploymentTechnologies {
  platforms: string[];
  containerization: string[];
  ci_cd: string[];
}

/**
 * Testing technologies in the registry
 */
export interface TestingTechnologies {
  unitTesting: string[];
  e2eTesting: string[];
  apiTesting: string[];
}

/**
 * Storage technologies in the registry
 */
export interface StorageTechnologies {
  objectStorage: string[];
  fileSystem: string[];
}

/**
 * Serverless technologies in the registry
 */
export interface ServerlessTechnologies {
  functions: string[];
  platforms: string[];
}

/**
 * Complete technology registry
 */
export interface TechRegistrySchema {
  frontend: FrontendTechnologies;
  backend: BackendTechnologies;
  database: DatabaseTechnologies;
  authentication: AuthenticationTechnologies;
  deployment: DeploymentTechnologies;
  testing: TestingTechnologies;
  storage: StorageTechnologies;
  serverless: ServerlessTechnologies;
  all_technologies: Set<string>;
}
