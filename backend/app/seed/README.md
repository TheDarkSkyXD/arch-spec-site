# Tech Registry and Seed Data Management

This directory contains the seed data and management systems for the application, including the centralized technology registry and project templates.

## Table of Contents

- [Tech Registry and Seed Data Management](#tech-registry-and-seed-data-management)
  - [Table of Contents](#table-of-contents)
  - [Tech Registry](#tech-registry)
    - [Purpose](#purpose)
    - [Structure](#structure)
    - [Adding New Technologies](#adding-new-technologies)
    - [Database Synchronization](#database-synchronization)
  - [Project Templates](#project-templates)
    - [Template Structure](#template-structure)
    - [Validation Against Tech Registry](#validation-against-tech-registry)
    - [Template Database Management](#template-database-management)
  - [Utilities and Scripts](#utilities-and-scripts)
  - [API Integration](#api-integration)

## Tech Registry

### Purpose

The Tech Registry (`tech_registry.py`) serves as the central source of truth for all technology names used throughout the application. It provides a consistent and validated set of technology names and categories to ensure:

1. No ambiguity or typos in technology names
2. Proper categorization of technologies
3. Consistency between tech stack selection options and project templates
4. Validation of user input against a known set of technologies

### Structure

The Tech Registry is organized as a hierarchical structure:

```
TECH_REGISTRY = {
    "category": {
        "subcategory": [
            "Technology1", "Technology2", ...
        ],
        ...
    },
    ...
}
```

Main categories include:

- `frontend`
- `backend`
- `database`
- `authentication`
- `deployment`
- `testing`

Each category contains multiple subcategories with lists of specific technologies.

### Adding New Technologies

To add new technologies to the registry:

1. Open `tech_registry.py`
2. Find the appropriate category and subcategory
3. Add the new technology to the list
4. The application will automatically update the database on the next restart

Example:

```python
"frontend": {
    "frameworks": [
        "React", "Vue.js", "Angular", "Svelte", "NextJS", "Your New Framework"  # Added new framework
    ],
}
```

### Database Synchronization

The tech registry is stored both in code and in the database. The application automatically keeps them in sync:

1. On application startup, `seed_tech_registry()` is called in `main.py`
2. This function compares the in-memory registry with the database version
3. It identifies new and removed technologies
4. The database is updated with any changes (additions or removals)
5. A log is generated showing what was added or removed

This mechanism ensures that when you add new technologies in the code, they're automatically available in the database without manual intervention.

## Project Templates

### Template Structure

Project templates (`templates.py`) define starter configurations for new projects. Each template includes:

- Basic project information (name, description, version)
- Default settings
- Tech stack configuration
- Features, pages, and other project-specific settings

### Validation Against Tech Registry

Templates are validated against the tech registry to ensure all technology references are valid:

1. During application startup, each template's tech stack is validated
2. Warnings are logged for any technologies not found in the registry
3. This helps prevent templates from referencing non-existent or misspelled technologies

### Template Database Management

Like the tech registry, templates are stored both in code and in the database:

1. On application startup, `seed_templates()` is called in `main.py`
2. New templates are added to the database
3. Existing templates are updated if they've changed
4. Templates that exist in the database but not in code are marked as deprecated (not deleted)

This approach preserves template history while ensuring that the latest templates are always available.

## Utilities and Scripts

Additional utilities and scripts for managing tech data:

- **Tech Validation** (`app/utils/tech_validation.py`):

  - Validates project tech stacks against the registry
  - Checks compatibility with templates
  - Provides tech suggestions based on partial selections

- **Synchronization Scripts** (`app/scripts/`):
  - `sync_tech_data.py`: Analyzes inconsistencies between code and templates
  - `correct_tech_data.py`: Automatically corrects tech names using fuzzy matching

## API Integration

The tech registry is exposed through several API endpoints:

- `/tech-registry/`: Get the full registry (from DB with fallback to code)
- `/tech-registry/categories/`: Get all categories
- `/tech-registry/technologies`: Get technologies by category/subcategory
- `/tech-registry/validate-tech`: Validate a specific technology name
- `/tech-registry/validate-tech-stack`: Validate a complete tech stack
- `/tech-registry/get-suggestions`: Get suggestions based on partial selection

These endpoints allow the frontend to access the registry data for validation and UI components.
