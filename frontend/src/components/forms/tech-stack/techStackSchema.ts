import { z } from "zod";

export const techStackSchema = z.object({
  frontend: z.string().min(1, "Frontend framework is required"),
  frontend_language: z.string().min(1, "Frontend language is required"),
  ui_library: z.string().optional(),
  state_management: z.string().optional(),
  backend: z.string().min(1, "Backend type is required"),
  backend_provider: z.string().optional(),
  database: z.string().min(1, "Database type is required"),
  orm: z.string().optional(),
  database_provider: z.string().optional(),
  auth_provider: z.string().optional(),
  auth_methods: z.string().optional(),
});

export type TechStackFormData = z.infer<typeof techStackSchema>;