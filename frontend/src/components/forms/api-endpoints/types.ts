import { Api } from '../../../types/templates';

export interface ApiEndpoint {
  path: string;
  description: string;
  methods: string[];
  auth: boolean;
  roles?: string[];
}

export interface ApiEndpointsFormProps {
  initialData?: Api;
  projectId?: string;
  onSuccess?: (data: Api) => void;
}

export interface ApiEndpointFormData {
  path: string;
  description: string;
  methods: string[];
  auth: boolean;
  roles: string[];
}

export interface ApiEndpointErrors {
  path?: string;
  description?: string;
  methods?: string;
}

export type ApiEndpointCategory = {
  name: string;
  endpoints: ApiEndpoint[];
}; 