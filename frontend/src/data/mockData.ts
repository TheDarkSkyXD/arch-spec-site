import { Project, ProjectTemplate } from "../types/project";

export const mockTemplates: ProjectTemplate[] = [
  {
    id: "1",
    name: "React Web App with Supabase",
    description: "React, TypeScript, Supabase Auth & DB",
    tech_stack: {
      frontend: "React",
      backend: "Supabase Functions",
      database: "PostgreSQL (Supabase)",
    },
    tags: ["React", "Supabase", "Web"],
    thumbnail: "/templates/react-supabase.png",
  },
  {
    id: "2",
    name: "Next.js E-commerce",
    description: "Next.js, Prisma, Stripe Integration",
    tech_stack: {
      frontend: "Next.js",
      backend: "Next.js API Routes",
      database: "PostgreSQL (Prisma)",
    },
    tags: ["Next.js", "Prisma", "Shop"],
    thumbnail: "/templates/nextjs-ecommerce.png",
  },
  {
    id: "3",
    name: "Custom Project",
    description: "Start from scratch with custom settings",
    tech_stack: {
      frontend: "Custom",
      backend: "Custom",
      database: "Custom",
    },
    tags: [],
    thumbnail: "/templates/custom.png",
  },
];

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Budget Tracker",
    description:
      "A web application for tracking personal expenses and income, with budget planning and reporting features.",
    created_at: "2025-03-05T10:30:00Z",
    updated_at: "2025-03-05T15:45:00Z",
    template_type: "web_app",
    status: "in_progress",
    metadata: {
      version: "0.1",
      author: "John Doe",
    },
  },
  {
    id: "2",
    name: "Inventory System",
    description: "An inventory management system for small businesses.",
    created_at: "2025-02-28T08:20:00Z",
    updated_at: "2025-03-01T14:10:00Z",
    template_type: "web_app",
    status: "draft",
    metadata: {
      version: "0.1",
      author: "John Doe",
    },
  },
];
