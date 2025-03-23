/**
 * Types for project templates.
 */

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

export interface Requirements {
  functional: string[];
  non_functional: string[];
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
  from_entity: string;
  to_entity: string;
  field: string;
  throughTable?: string;
}

export interface DataModel {
  entities: Entity[];
  relationships: Relationship[];
}

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface ApiResponse {
  status: number;
  description: string;
  schema: string;
}

export interface ApiEndpoint {
  path: string;
  parameters?: ApiParameter[];
  description: string;
  methods: string[];
  auth: boolean;
  roles?: string[];
  responses?: ApiResponse[];
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

export enum ImplementationPromptType {
  MAIN = "main",
  FOLLOWUP_1 = "followup_1",
  FOLLOWUP_2 = "followup_2",
}

export interface ImplementationPrompt {
  id: string;
  content: string;
  type: ImplementationPromptType;
  created_at?: string;
  updated_at?: string;
}

export interface ImplementationPrompts {
  data: Record<string, ImplementationPrompt[]>;
}

// UI Design Interfaces
export interface Colors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  surface: string;
  border: string;
}

export interface HeadingSizes {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
}

export interface Typography {
  fontFamily: string;
  headingFont: string;
  fontSize: string;
  lineHeight: number;
  fontWeight: number;
  headingSizes: HeadingSizes;
}

export interface Spacing {
  unit: string;
  scale: number[];
}

export interface BorderRadius {
  small: string;
  medium: string;
  large: string;
  xl: string;
  pill: string;
}

export interface Shadows {
  small: string;
  medium: string;
  large: string;
  xl: string;
}

export interface Layout {
  containerWidth: string;
  responsive: boolean;
  sidebarWidth: string;
  topbarHeight: string;
  gridColumns: number;
  gutterWidth: string;
}

export interface Components {
  buttonStyle: string;
  inputStyle: string;
  cardStyle: string;
  tableStyle: string;
  navStyle: string;
}

export interface DarkModeColors {
  background: string;
  textPrimary: string;
  textSecondary: string;
  surface: string;
  border: string;
}

export interface DarkMode {
  enabled: boolean;
  colors: DarkModeColors;
}

export interface Animations {
  transitionDuration: string;
  transitionTiming: string;
  hoverScale: number;
  enableAnimations: boolean;
}

export interface UIDesign {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  layout: Layout;
  components: Components;
  darkMode: DarkMode;
  animations: Animations;
}

export interface ProjectTemplate {
  id?: string;
  name: string;
  version: string;
  description: string;
  tags?: string[];
  businessGoals: string[];
  targetUsers: string;
  domain: string;
  techStack: ProjectTechStack;
  requirements: Requirements;
  features: Features;
  uiDesign: UIDesign;
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
