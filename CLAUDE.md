# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# ArchSpec Development Guidelines

## Build & Test Commands
- **Backend (cd backend)**
  - Run server: `uvicorn app.main:app --reload`
  - Run tests: `uv run pytest tests`
  - Run single test: `uv run pytest tests/path/to/test_file.py::TestClass::test_method -v`
  - Docker: `docker compose up -d`

- **Frontend (cd frontend)**
  - Start dev server: `pnpm dev`
  - Build: `pnpm build`
  - Lint: `pnpm lint`
  - Run tests: `pnpm test`
  - Run single test: `pnpm test -- -t "test name pattern"`

## System Architecture

### Backend Architecture
- **Application Startup**: Uses FastAPI lifespan events for database seeding and connection management
- **Database Connection**: Singleton pattern with Motor (async MongoDB driver) in `app/db/base.py`
- **Configuration**: Hierarchical settings using Pydantic in `app/core/config.py` with nested settings classes
- **API Structure**: Modular router system in `app/api/api.py` with individual route modules for each domain
- **Authentication**: Firebase Auth integration with custom middleware
- **AI Integration**: Multi-provider LLM support (Anthropic/OpenRouter) with failover capability
- **Data Seeding**: Automated seeding of tech stack, templates, and implementation prompts on startup

### Frontend Architecture
- **Routing**: React Router v7 with protected route wrapper pattern
- **State Management**: Zustand for project state, React Query for server state
- **Authentication**: Firebase Auth with React context pattern
- **UI Components**: Custom component library built on Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation schemas
- **API Layer**: Centralized API client with TypeScript interfaces

### Key Domain Models
- **Projects**: Core entity with specification sections (requirements, features, pages, data model, etc.)
- **Templates**: Reusable project specifications with tech stack validation
- **Tech Stack**: Central registry of technology options with compatibility matrix
- **Implementation Prompts**: AI prompts for guided development phases
- **User Management**: Firebase-based authentication with subscription tracking

## Code Style Guidelines
- Monorepo structure with separate frontend/backend directories
- Backend: FastAPI + MongoDB, Python 3.12+, follows PEP8, uses `uv` package manager
- Frontend: React + TypeScript + Vite, uses TailwindCSS, uses `pnpm` package manager
- Error handling: Use try/catch with specific exception types and logging
- Naming: camelCase for JS/TS, snake_case for Python
- Types: Strong typing in both TypeScript and Python (type annotations)
- Testing: Unit tests with pytest (backend) and vitest (frontend)
- Imports: Group by standard library, external packages, then local modules
- Green field project: No backward compatibility concerns, update everything as needed