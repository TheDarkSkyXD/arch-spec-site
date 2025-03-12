export interface ProjectBase {
  id: string;
  name: string;
  version: string;
  description: string;
  business_goals: string[];
  target_users: string[];
  domain: string;
}

export interface RequirementsData {
  functional_requirements: string[];
  non_functional_requirements: string[];
}
