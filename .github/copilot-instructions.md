# GitHub Copilot Instructions for ArchSpec

## Project Overview

ArchSpec is an AI-powered software specification system that creates comprehensive, implementation-ready specifications before code writing begins. The system consists of:

- Frontend: React/TypeScript SPA
- Backend: Python FastAPI service
- Database: MongoDB
- Authentication: Firebase
- Payments: LemonSqueezy integration
- AI: Anthropic Claude API integration

## Development Guidelines

### Architecture & Code Organization

1. **Backend Structure**
   - Follow the FastAPI project structure with routes in `app/api/routes/`
   - Services layer in `app/services/` for business logic
   - Database models and schemas in `app/schemas/`
   - Core configurations in `app/core/`
   - AI-related code in `app/ai/`

2. **Frontend Structure**
   - Components are organized by feature in `src/components/`
   - Pages in `src/pages/`
   - Reusable hooks in `src/hooks/`
   - API client code in `src/api/`
   - TypeScript types in `src/types/`

### Coding Standards

1. **Python (Backend)**
   - Python 3.12+ compatibility required
   - Use type hints consistently
   - Follow PEP 8 style guide
   - Use async/await for database and external API calls
   - Implement proper error handling with custom exceptions

2. **TypeScript (Frontend)**
   - Strict TypeScript mode
   - Use functional components with hooks
   - Implement proper error boundaries
   - Use React Query for API data fetching
   - Implement loading states for async operations

### Data Management

1. **Tech Stack Data**
   - Maintained in `backend/app/seed/tech_stack_data.py`
   - Follows bidirectional compatibility structure
   - Categories: frontend, backend, database, authentication, deployment, testing
   - Update compatibility relationships when adding new technologies

2. **Project Templates**
   - Stored in `backend/app/seed/template_data/`
   - Must validate against tech stack data
   - Include all required sections: requirements, features, API endpoints, etc.

### Testing Requirements

1. **Unit Testing Guidelines**
   - Follow the comprehensive testing guidelines in [Rules for Effective Unit Testing](copilot-test-instructions.md)
   - Focus on behavior, not implementation details
   - Minimize mocking to essential dependencies
   - Create test doubles that accurately reflect real behavior
   - Use test fixtures intelligently
   - Ensure tests are deterministic and independent
   - Document test scenarios clearly

2. **Backend Tests**
   - Write pytest tests for all API endpoints
   - Include service layer unit tests
   - Test AI integration with proper mocking
   - Maintain high test coverage for core functionality

3. **Frontend Tests**
   - Write React Testing Library tests for components
   - Include integration tests for main user flows
   - Test form validation and error states
   - Mock API calls in tests

### AI Integration Guidelines

1. **Prompt Engineering**
   - Keep prompts in `backend/app/ai/prompts/`
   - Structure prompts for consistent output format
   - Include validation for AI responses
   - Implement fallback strategies for AI failures

2. **Implementation Generation**
   - Validate generated code against tech stack
   - Include proper error handling
   - Generate comprehensive docstrings
   - Follow project's coding standards

### Development Workflow

1. **Setup**
   - Use `uv` for Python dependency management
   - Use `pnpm` for frontend package management
   - Run MongoDB via Docker Compose
   - Set up all required environment variables

2. **Running the Project**
   - Backend: `uvicorn app.main:app --reload`
   - Frontend: `pnpm dev`
   - Tests: `pytest` (backend) or `pnpm test` (frontend)

3. **Deployment**
   - Backend deploys to fly.io
   - Frontend deploys to Vercel
   - Database runs on MongoDB Atlas
   - Follow the deployment checklist in respective READMEs

### Error Handling

1. **Backend Errors**
   - Use proper HTTP status codes
   - Return structured error responses
   - Log errors with appropriate severity
   - Handle AI service failures gracefully

2. **Frontend Errors**
   - Implement error boundaries
   - Show user-friendly error messages
   - Handle network errors appropriately
   - Log client-side errors

### Security Considerations

1. **Authentication**
   - Use Firebase Authentication
   - Implement proper token validation
   - Handle session expiration
   - Secure all API endpoints

2. **Data Protection**
   - Validate all user inputs
   - Implement rate limiting
   - Handle sensitive data securely
   - Follow GDPR guidelines

### Performance Guidelines

1. **Backend Optimization**
   - Implement proper database indexing
   - Cache frequently accessed data
   - Optimize AI API calls
   - Use async operations effectively

2. **Frontend Optimization**
   - Implement code splitting
   - Optimize bundle size
   - Use proper React memo and callbacks
   - Implement proper loading states

## Tool Usage and Scripts

1. **Development Scripts**
   - Use `start-dev.sh` or `start-dev.ps1` for setup
   - Use `stop-dev.sh` or `stop-dev.ps1` for teardown
   - Follow `dev-scripts-README.md` for details

2. **Database Scripts**
   - Use scripts in `backend/app/scripts/` for data management
   - Follow proper backup procedures
   - Use seed scripts for initial data setup

Remember to:
- Check existing implementations before creating new components
- Update documentation when making significant changes
- Follow the core principles outlined in the main README
- Use the project templates as reference for new features
