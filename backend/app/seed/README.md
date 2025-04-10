# Tech Stack and Seed Data Management

This directory contains the seed data and management systems for the application, including the centralized technology stack and project templates.

## Table of Contents

- [Tech Stack and Seed Data Management](#tech-stack-and-seed-data-management)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
    - [Purpose](#purpose)
    - [Structure](#structure)
    - [Adding New Technologies](#adding-new-technologies)
    - [Database Synchronization](#database-synchronization)
  - [Project Templates](#project-templates)
    - [Template Structure](#template-structure)
    - [Validation Against Tech Stack](#validation-against-tech-stack)
    - [Template Database Management](#template-database-management)
  - [Utilities and Scripts](#utilities-and-scripts)

## Tech Stack

### Purpose

The Tech Stack (`tech_stack_data.json`) serves as the central source of truth for all technology names and compatibility relationships used throughout the application. It provides a comprehensive mapping of technologies with bidirectional references to ensure:

1. No ambiguity or typos in technology names
2. Proper categorization of technologies
3. Complete compatibility mapping between different technology components
4. Dynamic filtering of compatible technologies based on user selections
5. Consistency regardless of selection order in the tech stack builder
6. Validation of user input against a known set of technologies

### Structure

The Tech Stack is organized as a bidirectional compatibility structure:

```
TECH_STACK_DATA = {
    "categories": {
        "category": {
            "subcategory": [
                "Technology1", "Technology2", ...
            ],
            ...
        },
        ...
    },
    "technologies": {
        "category": {
            "TechnologyName": {
                "name": "TechnologyName",
                "category": "category",
                "compatibleWith": {
                    "otherCategory1": ["Compatible1", "Compatible2", ...],
                    "otherCategory2": ["Compatible3", "Compatible4", ...],
                    ...
                }
            },
            ...
        },
        ...
    }
}
```

Main categories include:

- `frontend`
- `backend`
- `database`
- `authentication`
- `deployment`
- `testing`

The structure provides two key advantages:

1. Hierarchical navigation through the `categories` object for traditional filtering
2. Bidirectional references in the `technologies` object that allow querying compatibility relationships from any direction

### Adding New Technologies

To add new technologies to the tech stack:

1. Open `tech_stack_data.json`
2. Add the technology to the appropriate category and subcategory in the `categories` section
3. Create a new entry in the `technologies` section with complete compatibility information
4. Ensure bidirectional references are maintained by updating the compatibleWith sections of related technologies
5. The application will automatically update the database on the next restart

Example:

```python
# Adding a new framework in the categories section
"categories": {
    "frontend": {
        "frameworks": [
            "React", "Vue.js", "Angular", "Svelte", "NextJS", "Your New Framework"  # Added new framework
        ],
        ...
    },
    ...
},

# Adding the framework in the technologies section with compatibility data
"technologies": {
    "frameworks": {
        "Your New Framework": {
            "name": "Your New Framework",
            "category": "frontend",
            "compatibleWith": {
                "stateManagement": ["Redux", "MobX"],
                "database": ["MongoDB", "PostgreSQL"],
                ...
            }
        },
        ...
    },
    ...
}
```

### Database Synchronization

The tech stack is stored both in code and in the database. The application automatically updates the database if it's empty:

1. On application startup, `seed_tech_stack()` is called in `main.py`
2. If the tech stack is empty, it's seeded from the code
3. If the tech stack is not empty, it's not seeded again
4. The tech stack in the database can be updated elsewhere, and the application will not overwrite it by the seeding process
5. If there's a major version change in the tech stack, there's an existing script to do a clean all seeding

## Project Templates

### Template Structure

Project templates (`templates.py`) define starter configurations for new projects. Each template includes:

- Basic project information (name, description, version)
- Default settings
- Tech stack configuration
- Features, pages, and other project-specific settings

### Validation Against Tech Stack

Templates are validated against the tech stack to ensure all technology references are valid:

1. During application startup, each template's tech stack is validated
2. Warnings are logged for any technologies not found in the tech stack
3. This helps prevent templates from referencing non-existent or misspelled technologies

### Template Database Management

Like the tech stack, templates are stored both in code and in the database:

1. On application startup, `seed_templates()` is called in `main.py`
2. New templates are added to the database
3. Existing templates are updated if they've changed
4. Templates that exist in the database but not in code are marked as deprecated (not deleted)

This approach preserves template history while ensuring that the latest templates are always available.

## Utilities and Scripts

Additional utilities and scripts for managing tech data:

- **Synchronization Scripts** (`app/scripts/`):
  - `sync_tech_data.py`: Analyzes inconsistencies between code and templates
  - `correct_templates.py`: Automatically corrects tech names using fuzzy matching
