export interface ProjectBase {
  id: string;
  name: string;
  description: string;
  business_goals?: string[];
  target_users?: string;
  domain?: string;
  user_id?: string;
  template_id?: string;
  version: string;
  created_at?: string;
  updated_at?: string;
}
