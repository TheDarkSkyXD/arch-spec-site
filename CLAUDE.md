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

## Code Style Guidelines
- Monorepo structure with separate frontend/backend directories
- Backend: FastAPI + MongoDB, Python 3.12+, follows PEP8
- Frontend: React + TypeScript + Vite, uses TailwindCSS
- Error handling: Use try/catch with specific exception types and logging
- Naming: camelCase for JS/TS, snake_case for Python
- Types: Strong typing in both TypeScript and Python (type annotations)
- Testing: Unit tests with pytest (backend) and vitest (frontend)
- Imports: Group by standard library, external packages, then local modules