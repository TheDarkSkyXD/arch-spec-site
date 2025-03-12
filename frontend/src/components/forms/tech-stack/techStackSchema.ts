import { z } from "zod";

export const techStackSchema = z
  .object({
    // Frontend fields
    frontend: z.string().min(1, "Frontend framework is required"),
    frontend_language: z.string().min(1, "Frontend language is required"),
    ui_library: z.string().optional(),
    state_management: z.string().optional(),

    // Backend fields
    backend_type: z.enum(["framework", "baas", "serverless", ""], {
      required_error: "Backend type is required",
    }),
    backend_framework: z.string().optional(),
    backend_language: z.string().optional(),
    backend_service: z.string().optional(),
    backend_realtime: z.string().optional(),
    backend_functions: z.string().optional(),

    // Database fields
    database_type: z.string().optional(),
    database_system: z.string().optional(),
    database_hosting: z.string().optional(),
    database_orm: z.string().optional(),

    // Auth fields
    auth_provider: z.string().optional(),
    auth_methods: z.string().optional(),

    // Hosting fields
    hosting_frontend: z.string().optional(),
    hosting_backend: z.string().optional(),

    // Storage fields
    storage_type: z.string().optional(),
    storage_service: z.string().optional(),

    // Deployment fields
    deployment_ci_cd: z.string().optional(),
    deployment_containerization: z.string().optional(),
  })
  .refine(
    (data) => {
      // If backend type is framework, require framework
      if (data.backend_type === "framework") {
        return !!data.backend_framework;
      }
      // If backend type is baas, require service
      else if (data.backend_type === "baas") {
        return !!data.backend_service;
      }
      // If backend type is serverless, require service
      else if (data.backend_type === "serverless") {
        return !!data.backend_service;
      }
      return true;
    },
    {
      message:
        "Please complete all required fields for the selected backend type",
      path: ["backend_type"], // This will highlight the backend_type field for the error
    }
  );

export type TechStackFormData = z.infer<typeof techStackSchema>;
