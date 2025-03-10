// Export types as namespaces to avoid naming conflicts
import * as TechStackTypes from "./techStack";
import * as TemplatesTypes from "./templates";
import * as ProjectTypes from "./project";

// Re-export specific types that are used directly
export type { ProjectTemplate } from "./templates";

// Export namespaces for grouped access
export { TechStackTypes, TemplatesTypes, ProjectTypes };
// Export all types for convenience