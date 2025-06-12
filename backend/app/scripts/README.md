# Tech Data Management Scripts

This directory contains utility scripts for managing and synchronizing technology data between code and the database.

## Available Scripts

### `correct_templates.py`

This script automatically corrects inconsistencies in template data based on the tech stack data.

#### Purpose

- Find technologies in templates that don't match the tech stack data
- Use fuzzy matching to find the closest matching technology in the tech stack data
- Generate corrected template data

#### Usage

```bash
cd backend
python -m app.scripts.correct_templates
```

#### Output

The script creates corrected version of the template data files in a `corrected_data` directory:

- `corrected_templates.py`

These files contain the same data but with technology names standardized to match the tech stack data.

### `sync_tech_data.sh`

A convenience script to run both tools in sequence.

#### Usage

```bash
./scripts/sync_tech_data.sh
```

### `seed_database.py`

This script allows you to manually seed the database with tech stack and template data, with an option to clean existing data first.

#### Purpose

- Seed the tech stack data in the database
- Seed the project templates in the database
- Optionally clean all existing data before seeding (full refresh)
- Selectively seed only specific data collections

#### Usage

```bash
cd backend
python -m app.scripts.seed_database [options]
```

##### Options

- `--clean-all`: Delete all existing records before seeding
- `--tech-stack-only`: Only seed tech stack data
- `--templates-only`: Only seed template data
- `--implementation-prompts-only`: Only seed implementation prompts data

##### Examples

```bash
# Seed all data (tech stack, templates), keeping existing data
python -m app.scripts.seed_database

# Completely refresh all data
python -m app.scripts.seed_database --clean-all

# Only refresh tech stack data, keeping other data unchanged
python -m app.scripts.seed_database --tech-stack-only --clean-all

# Only refresh templates, keeping other data unchanged
python -m app.scripts.seed_database --templates-only --clean-all

# Only refresh implementation prompts, keepint other data unchanged
python -m app.scripts.seed_database --implementation-prompts-only --clean-all

```

## Best Practices

- The tech stack data is stored in the `tech_stack` collection in the database.
