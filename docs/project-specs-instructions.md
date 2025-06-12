# Instructions when creating, modifying, or simply working project artifacts or specifications

## Project specifications

In this codebase, project specifications refer to artifacts or specifications related to a project. Each specification represents a different aspect of the software system:

1. Project basic information (name, description, business goals, target users)
2. Tech Stack
3. Requirements (functional and non-functional)
4. Features (core modules and optional modules)
5. UI Design (design system specifications)
6. Pages (public, authenticated, and admin routes)
7. Data Model (entities and relationships)
8. API Endpoints
9. Test Cases (in Gherkin format)
10. Implementation Prompts

## Specification Structure

Each specification follows a consistent pattern across the codebase. Using Data Model as an example:

### 1. Types/Interfaces

Located in `frontend/src/types/templates.ts`:
```typescript
export interface EntityField {
  name: string;
  type: string;
  primaryKey?: boolean;
  generated?: boolean;
  unique?: boolean;
  required?: boolean;
  default?: string | number | boolean;
}

export interface Entity {
  name: string;
  description: string;
  fields: EntityField[];
}

export interface Relationship {
  type: string;
  from_entity: string;
  to_entity: string;
  field: string;
  throughTable?: string;
}

export interface DataModel {
  entities: Entity[];
  relationships: Relationship[];
}
```

### 2. Backend Schema

Located in `backend/app/schemas/`:
- Base schemas in `shared_schemas.py`
- Spec-specific schemas in `project_specs.py`
- Response/update models for API endpoints

### 3. Frontend Components

Each spec has three main component types:
1. Form Component (`frontend/src/components/forms/`)
   - Handles data input and validation
   - Integrates with AI enhancement features
   - Manages state and API interactions

2. Preview Component (`frontend/src/components/previews/`)
   - Displays read-only view of the specification
   - Handles markdown generation for export

3. Section Component (`frontend/src/components/project/`)
   - Manages the spec section in the project view
   - Handles toggling between edit/preview modes
   - Controls expansion/collapse states

### 4. Services

Located in `frontend/src/services/`:
- API interaction methods (GET, PUT, POST)
- Data transformation and validation
- AI enhancement capabilities

### 5. API Routes

Located in `backend/app/api/routes/project_specs.py`:
- CRUD operations for each specification
- Validation and error handling
- AI enhancement endpoints

## Working with Specifications

### Creating New Specifications

1. Define the data structure:
   - Add interfaces in `frontend/src/types/templates.ts`
   - Create schemas in `backend/app/schemas/`
   - Update API response types

2. Create components:
   - Form component with validation
   - Preview component for read-only view
   - Section component for project integration

3. Add services:
   - API integration methods
   - Data transformation utilities
   - AI enhancement features if needed

### Modifying Existing Specifications

1. Update schemas/interfaces if the data structure changes
2. Modify affected components:
   - Update form validation
   - Adjust preview rendering
   - Update AI enhancement logic

3. Test changes:
   - Verify form functionality
   - Check preview rendering
   - Test AI enhancement features
   - Validate API interactions

### AI Enhancement Features

Each specification can be enhanced using AI. Implementation includes:

1. AI Button Integration:
   - Add AI enhancement buttons in form components
   - Include loading states and error handling
   - Show premium feature badges when required

2. Enhancement Logic:
   - Define enhancement prompt templates
   - Handle context gathering from other specs
   - Process and validate AI responses

3. User Experience:
   - Show clear feedback during enhancement
   - Allow user modifications of AI suggestions
   - Maintain undo/redo capability

## Best Practices

1. **Data Consistency**
   - Follow established type definitions
   - Validate data at both frontend and backend
   - Maintain bidirectional relationships between specs

2. **Component Structure**
   - Keep forms focused on single responsibility
   - Implement proper error boundaries
   - Use shared UI components from the component library

3. **State Management**
   - Use appropriate state management based on scope
   - Handle loading and error states consistently
   - Maintain clear data flow between components

4. **Testing**
   - Write unit tests for critical functionality
   - Include integration tests for form submissions
   - Test AI enhancement features thoroughly

5. **Documentation**
   - Keep type definitions up to date
   - Document AI enhancement capabilities
   - Maintain clear component documentation

## Common Tasks

1. **Adding a New Field**
   - Update relevant interfaces/schemas
   - Modify form component
   - Update preview rendering
   - Add validation rules
   - Test changes thoroughly

2. **Implementing AI Enhancement**
   - Add AI button to form
   - Create enhancement prompt
   - Implement error handling
   - Add loading states
   - Test enhancement logic

3. **Modifying Validation Rules**
   - Update schema validation
   - Modify form validation
   - Test edge cases
   - Verify error messages

Remember to:
- Follow the established patterns in existing implementations
- Maintain consistency across different specifications
- Test changes thoroughly before deployment
- Update documentation when making significant changes

