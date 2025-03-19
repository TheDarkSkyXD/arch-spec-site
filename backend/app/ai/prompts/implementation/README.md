# Implementation Prompts Generation

This directory contains meta prompts used to generate implementation prompts for different aspects of a software project. These meta prompts are templates that guide the AI in generating high-quality, specialized implementation prompts.

## Structure

Each file in this directory follows a naming convention:

- `XX_category_gen_prompt.txt` where XX is a number indicating the order of implementation.

## Categories

The implementation is divided into these categories:

1. **Project Setup** - Foundation, configuration, and initial scaffolding
2. **Data Layer** - Database models, schemas, and data access components
3. **API Backend** - Server endpoints, controllers, and business logic
4. **Frontend Foundation** - UI structure, navigation, and core components
5. **Feature Implementation** - Specific features and user flows
6. **Testing Implementation** - Unit, integration, and end-to-end tests
7. **Deployment & DevOps** - Deployment, CI/CD, and infrastructure
8. **Component Completion** - Specialized components and modules
9. **Integration Implementation** - Third-party integrations and services

## How They Work

These meta prompts are used to:

1. Take project specifications as input (tech stack, data models, requirements, etc.)
2. Feed them to an AI model to generate implementation prompts
3. For each category, generate three types of prompts:
   - **Main** - The initial implementation prompt
   - **Follow-up 1** - Continuation after main prompt
   - **Follow-up 2** - Final completion prompt

## Input Variables

The meta prompts contain placeholders for project information:

- `{project_description}` - Description of the project
- `{architecture_spec}` - Architecture specifications
- `{tech_stack}` - Technology stack information
- `{data_models}` - Data model specifications
- `{api_endpoints}` - API endpoint definitions
- `{features}` - Feature specifications
- `{security_requirements}` - Security requirements
- ...etc.

## Usage

These meta prompts are used by the implementation prompt generation API to create actionable, context-aware implementation prompts for developers. The resulting implementation prompts guide AI coding agents to implement specific parts of the project.

## Extending

To add a new meta prompt category:

1. Create a new file following the naming convention
2. Update the `CATEGORY_TO_METAPROMPT` mapping in `implementation_prompts.py`
3. Ensure the frontend UI includes the new category
