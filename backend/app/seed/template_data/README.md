# Project Templates

This directory contains templates used for creating new projects in ArchSpec.

## Template Structure

Templates are stored as individual JSON files in the `templates` directory. This makes it easy to:

- Add new templates
- Modify existing templates
- Disable templates without removing them

## Adding a New Template

To add a new template:

1. Create a new JSON file in the `templates` directory with a descriptive name (e.g., `nextjs_mongodb.json`)
2. Use the following structure for your template:

```json
{
    "id": "auto_generate",
    "template": {
        "name": "Your Template Name",
        "version": "1.0.0",
        "description": "A brief description of your template",
        ...
    }
}
```

The `id` field can be set to `"auto_generate"` to have the system generate a unique ID when the template is loaded,
or you can provide a fixed ID if needed.

## Available Templates

- `react_supabase.json` - React web application with Supabase backend
- `sveltekit_prisma.json` - SvelteKit application with Prisma ORM
- `react_simple_web_app.json` - Simple React application with minimal dependencies

## Template Loading

Templates are automatically loaded from the JSON files in the `templates` directory when the application starts.
The system compares the loaded templates with the existing ones in the database and:

- Adds new templates
- Uses existing templates if they're already in the database
- Detects changes in templates (not implemented yet)

## Template Schema

Each template must follow the schema defined in `backend/app/schemas/templates.py` to ensure compatibility
with the application.
