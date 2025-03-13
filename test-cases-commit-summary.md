# Commit Summary: Add Test Cases Functionality and Enhance AI Integration

## Overview

This commit introduces comprehensive test cases functionality using the Gherkin format and enhances AI integration throughout the application. The changes span both backend and frontend components, adding new API endpoints, data models, UI components, and services for managing test cases.

## Backend Changes

### AI Prompts and Tools

- **app/ai/prompts/data_model.py**

  - Updated `get_data_model_user_prompt` to include `formatted_requirements` parameter
  - Enhanced prompt output to include project requirements

- **app/ai/prompts/test_cases.py** (New)

  - Added `get_test_cases_user_prompt` function for generating test cases in Gherkin format
  - Implemented detailed instructions for creating comprehensive test cases

- **app/ai/tools/print_test_cases.py** (New)
  - Added function to return input schema for formatting and displaying test cases in Gherkin format
  - Defined structured input schema for test cases data

### API Routes

- **app/api/routes/ai_text.py**

  - Added new endpoints: `/enhance-test-cases` and `/generate-test-cases`
  - Enhanced `extract_data_from_response` to handle empty responses for `TestCasesData`
  - Improved logging for response details and errors

- **app/api/routes/project_specs.py**

  - Introduced `TestCasesSpec` and `TestCasesSpecUpdate` to project specifications
  - Added routes: `get_test_cases_spec` and `create_or_update_test_cases_spec`

- **app/api/routes/projects.py**
  - Added `"test_cases_specs"` to specifications list in `delete_project` function

### Core Configuration

- **app/core/config.py**
  - Updated default model for `AnthropicSettings` from `claude-3-7-sonnet-20250219` to `claude-3-5-sonnet-20241022`

### Schemas

- **app/schemas/ai_text.py**

  - Added `TestCase` model for representing individual test cases in Gherkin format
  - Created `TestCasesData`, `TestCasesEnhanceRequest`, and `TestCasesEnhanceResponse` models

- **app/schemas/project_specs.py**

  - Updated `TestingSpec` to require a `Testing` data model instead of making it optional
  - Introduced `TestCasesSpec` and `TestCasesSpecUpdate` classes

- **app/schemas/shared_schemas.py**
  - Added `GherkinTestCase` and `TestCases` schemas for handling test cases

### Services

- **app/services/project_specs_service.py**
  - Implemented `get_test_cases_spec` and `create_or_update_test_cases_spec` methods
  - Updated imports to include new test cases schemas

### Tests

- **tests/api/test_extract_data.py** (New)
  - Added test suite for `extract_data_from_response` function
  - Implemented tests for various response formats and error handling

## Frontend Changes

### Components

- **src/components/common/DownloadAllMarkdown.tsx**

  - Added `testCases` prop to `DownloadAllMarkdownProps`
  - Updated logic to handle test cases when generating markdown zip

- **src/components/forms/TestCasesForm.tsx** (New)

  - Created form component for managing test cases
  - Implemented CRUD operations for test cases, scenarios, and steps
  - Added AI integration for generating and enhancing test cases

- **src/components/previews/TestCasesPreview.tsx** (New)
  - Created preview component for displaying test cases
  - Added handling for loading states and empty data scenarios
  - Integrated markdown generation for consistent formatting

### Hooks

- **src/hooks/useDataQueries.ts**
  - Added `useTestCases` hook for fetching and managing test cases state

### Pages

- **src/pages/ProjectDetails.tsx**
  - Added `TEST_CASES` to `SectionId` enum
  - Integrated test cases section in project details view
  - Implemented view mode switching and data handling

### Services

- **src/services/aiService.ts**

  - Added interfaces for test cases data structures
  - Implemented `generateTestCases` and `enhanceTestCases` methods

- **src/services/markdown/index.ts**

  - Added `generateTestCasesMarkdown` to markdown service

- **src/services/markdown/markdownZip.ts**

  - Updated `generateMarkdownZip` to include test cases parameter
  - Added logic to generate markdown for test cases

- **src/services/markdown/testCases.ts** (New)

  - Created function to generate markdown for test cases in Gherkin format
  - Implemented formatting for features, scenarios, and steps

- **src/services/testCasesService.ts** (New)
  - Defined interfaces for Gherkin test cases
  - Implemented API interaction functions: `getTestCases` and `saveTestCases`

## Key Integration Points

1. Backend now generates and processes test cases in Gherkin format
2. Frontend provides UI for creating, viewing, and managing test cases
3. AI integration enhances test case generation based on project requirements
4. Markdown generation includes test cases in documentation exports

## Considerations for Future Project Specs

- Ensure all components properly utilize the new test cases functionality
- Validate test cases format and data consistency across the application
- Consider expanding AI capabilities for test case analysis and improvement
- Ensure proper error handling and user feedback for test case operations
