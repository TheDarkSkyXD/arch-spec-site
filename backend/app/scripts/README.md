# Tech Data Management Scripts

This directory contains utility scripts for managing and synchronizing technology data between code and the database.

## Available Scripts

### `sync_tech_data.py`

This script analyzes inconsistencies between the tech registry, tech stack compatibility data, and project templates.

#### Purpose

- Identify technologies used in tech stack data that aren't in the registry
- Identify technologies used in templates that aren't in the registry
- Find technologies missing from both sources
- Generate suggestions for updating the registry

#### Usage

```bash
cd backend
python -m app.scripts.sync_tech_data
```

#### Output

The script produces a report showing:

- Technologies in tech stack not in registry
- Technologies in templates not in registry
- Technologies in both but missing from registry
- Suggested registry updates with category placement

If inconsistencies are found, it also generates a `suggested_registry_updates.py` file with code snippets to update the registry.

### `correct_tech_data.py`

This script automatically corrects inconsistencies in tech stack and template data based on the technology registry.

#### Purpose

- Find technologies in tech stack and templates that don't match the registry
- Use fuzzy matching to find the closest matching technology in the registry
- Generate corrected versions of the data

#### Usage

```bash
cd backend
python -m app.scripts.correct_tech_data
```

#### Output

The script creates corrected versions of the tech stack and template data files in a `corrected_data` directory:

- `corrected_tech_stack.py`
- `corrected_templates.py`

These files contain the same data but with technology names standardized to match the registry.

### `sync_tech_data.sh`

A convenience script to run both tools in sequence.

#### Usage

```bash
./scripts/sync_tech_data.sh
```

### `seed_database.py`

This script allows you to manually seed the database with tech registry and template data, with an option to clean existing data first.

#### Purpose

- Seed the tech registry data in the database
- Seed the project templates in the database
- Seed the tech stack compatibility data in the database
- Optionally clean all existing data before seeding (full refresh)
- Selectively seed only specific data collections

#### Usage

```bash
cd backend
python -m app.scripts.seed_database [options]
```

##### Options

- `--clean-all`: Delete all existing records before seeding
- `--tech-registry-only`: Only seed tech registry data
- `--templates-only`: Only seed template data
- `--tech-stack-only`: Only seed tech stack compatibility data

##### Examples

```bash
# Seed all data (tech registry, templates, tech stack), keeping existing data
python -m app.scripts.seed_database

# Completely refresh all data
python -m app.scripts.seed_database --clean-all

# Only refresh the tech registry, keeping other data unchanged
python -m app.scripts.seed_database --tech-registry-only --clean-all

# Only refresh templates, keeping other data unchanged
python -m app.scripts.seed_database --templates-only --clean-all

# Only refresh tech stack data, keeping other data unchanged
python -m app.scripts.seed_database --tech-stack-only --clean-all
```

## Best Practices

1. **Before Adding New Technologies**:

   - Run `sync_tech_data.py` to check for existing inconsistencies
   - Review the suggested updates and apply them to the registry

2. **After Making Registry Changes**:

   - Run the full application to let the database synchronize
   - Verify in the logs that the changes were applied correctly

3. **If You Find Inconsistencies in Production**:
   - Use `correct_tech_data.py` to generate standardized data
   - Review the changes carefully before applying them
   - Consider adding missing technologies to the registry first

## Workflow Example

When adding support for a new technology:

1. Check for existing references:

   ```bash
   python -m app.scripts.sync_tech_data
   ```

2. If it's already referenced but not in the registry, add it to `tech_registry.py`

3. If it's completely new, add it to both:

   - `tech_registry.py` (in the appropriate category)
   - Update templates or tech stack compatibility data as needed

4. Restart the application to sync the database

## How The Synchronization Works

Both scripts use these core functions:

- `extract_tech_from_tech_stack()`: Extract all technology names from compatibility data
- `extract_tech_from_templates()`: Extract all technology names from templates
- `find_inconsistencies()`: Compare technologies against the registry
- `find_closest_match()`: Use fuzzy matching to find similar technology names

The database synchronization (part of the main application) uses:

- `seed_tech_registry()`: Compare and update the database
- `seed_templates()`: Manage templates in the database
