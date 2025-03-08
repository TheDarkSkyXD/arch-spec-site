"""
Technology Registry - Single Source of Truth for Technology Names and Categories.

This module defines the canonical list of technologies and their categories used throughout
the application. It provides validation and retrieval functions to ensure consistency
between templates and tech stack selection.

IMPORTANT: This file serves as the main source of truth for all technology names.
When adding new technologies:
1. Add them to the appropriate category and subcategory
2. Follow the existing format and naming conventions
3. The application will automatically update the database on restart
4. Run the sync_tech_data.py script to check for inconsistencies

See /app/seed/README.md for more detailed documentation.
"""
import logging
from typing import Dict, List, Set, Optional, Any, Union

from ..schemas.tech_stack import TechStackData
from ..schemas.tech_registry_schema import (
    TechRegistrySchema,
    InvalidTechnology,
    TechStackValidationResult
)

logger = logging.getLogger(__name__)

# The master registry of all technologies organized by category
# This hierarchical structure defines valid technologies and their categorization
# ============================================================================
# TECH REGISTRY STRUCTURE:
# ========================
# {
#   "category": {                  # Main technology category (e.g., frontend)
#     "subcategory": [             # Specific group within category (e.g., frameworks)
#       "TechnologyName", ...      # Valid technology names in this subcategory
#     ],
#   }
# }
# ============================================================================
TECH_REGISTRY = {
    "frontend": {
        "frameworks": [
            "React", "Vue.js", "Angular", "Svelte", "Solid.js", "Preact", "Lit", "Alpine.js"
        ],
        "languages": [
            "JavaScript", "TypeScript"
        ],
        "stateManagement": [
            "Redux", "MobX", "Zustand", "Recoil", "Context API",  # React
            "Pinia", "Vuex",  # Vue
            "NgRx", "Akita", "NGXS",  # Angular
            "Jotai", "Valtio",  # React/others
            "Svelte Store",  # Svelte
            "XState"  # Framework agnostic
        ],
        "uiLibraries": [
            "Material UI", "MUI", "Chakra UI", "Ant Design", "Tailwind CSS", "Bootstrap",  # React/general
            "Vuetify", "PrimeVue", "Quasar",  # Vue
            "Angular Material", "PrimeNG", "NG Bootstrap",  # Angular
            "Svelte Material UI",  # Svelte
            "Styled Components", "Emotion", "Mantine"  # React/general
        ],
        "formHandling": [
            "React Hook Form", "Formik",  # React
            "VeeValidate", "FormKit", "Felte",  # Vue
            "Angular Forms", "NgxFormly",  # Angular
            "Svelte Forms",  # Svelte
            "Zod", "Yup", "TanStack Form"  # Cross-framework
        ],
        "routing": [
            "React Router",  # React
            "Vue Router",  # Vue
            "Angular Router",  # Angular
            "Next.js Routing",  # Next.js
            "SvelteKit Routing", "Svelte Navigator",  # Svelte
            "TanStack Router"  # Cross-framework
        ],
        "apiClients": [
            "Axios", "TanStack Query", "SWR", "Apollo Client", "urql",  # React/general
            "Vue Query",  # Vue
            "SvelteQuery",  # Svelte
            "Angular HttpClient", "Apollo Angular"  # Angular
        ],
        "metaFrameworks": [
            "Next.js", "Remix", "Gatsby",  # React
            "Nuxt.js",  # Vue
            "Angular Universal",  # Angular
            "SvelteKit",  # Svelte
            "Vite", "Astro"  # General
        ]
    },
    "backend": {
        "frameworks": [
            "Express.js", "NestJS", "Django", "FastAPI", "Spring Boot", "Laravel", 
            "Flask", "Ruby on Rails", "ASP.NET Core", "Fiber", "Echo",
            "Custom Express", "Serverless"
        ],
        "languages": [
            "JavaScript", "TypeScript", "Python", "Java", "PHP", "Ruby", "C#", "Go", "Rust"
        ],
        "orms": [
            "Sequelize", "TypeORM", "Prisma", "Django ORM", "SQLAlchemy", "Hibernate", 
            "Eloquent", "Entity Framework", "GORM",
            "Eloquent ORM", "Entity Framework Core", "Mongoose", "Drizzle", "Dapper",
            "MongoDB PyMongo", "Spring Data JPA", "AWS SDK",
            "MongoDB Node.js Driver", "PyMongo", "Spring Data MongoDB", "Dynamoose"
        ],
        "authFrameworks": [
            "Passport.js", "NextAuth.js", "Django Auth", "Spring Security", 
            "Laravel Sanctum", "ASP.NET Identity",
            "JWT", "OAuth2", "OIDC", "Flask-Login", "Laravel Passport",
            "Laravel Breeze", "Amazon Cognito", "Appwrite Auth"
        ],
        "serverless": [
            "AWS Lambda", "Azure Functions", "Google Cloud Functions", "Vercel Functions",
            "Netlify Functions", "Cloudflare Workers", "Deno Deploy", "Edge Functions"
        ],
        "realtime": [
            "Socket.io", "Pusher", "Firebase Realtime Database", "Supabase Realtime", "Ably",
            "Realtime Database"
        ]
    },
    "database": {
        "relational": [
            "PostgreSQL", "MySQL", "MariaDB", "SQLite", "Oracle", "SQL Server",
            "Aurora", "RDS", "Azure SQL", "Google Cloud SQL", "Neon", "MariaDB (internal)"
        ],
        "noSql": [
            "MongoDB", "Firestore", "DynamoDB", "Cassandra", "Redis", "Elasticsearch",
            "Redis Labs", "AWS ElastiCache", "Upstash"
        ],
        "providers": [
            "Supabase", "Firebase", "MongoDB Atlas", "AWS RDS", "PlanetScale", "Fauna",
            "Appwrite", "Managed Instance", "Self-hosted", "Local file", "Embedded"
        ],
        "clients": [
            "Redis Node.js client", "ioredis"
        ]
    },
    "authentication": {
        "providers": [
            "Supabase Auth", "Firebase Auth", "Auth0", "Clerk", "Okta", "Cognito", "Custom JWT",
            "Amazon Cognito", "Appwrite Auth"
        ],
        "methods": [
            "Email/Password", "Google", "GitHub", "Twitter", "Facebook", "Apple", "Microsoft",
            "SAML", "LDAP", "OAuth 2.0", "OpenID Connect", "Magic Link", "2FA"
        ]
    },
    "deployment": {
        "platforms": [
            "Vercel", "Netlify", "Render", "Heroku", "AWS", "GCP", "Azure", "DigitalOcean App Platform",
            "Cloudflare", "Railway", "Fly.io",
            "AWS Amplify", "Azure App Service"
        ],
        "containerization": [
            "Docker", "Kubernetes", "AWS ECS", "GCP Cloud Run"
        ],
        "ci_cd": [
            "GitHub Actions", "GitLab CI", "CircleCI", "Jenkins", "Travis CI"
        ]
    },
    "storage": {
        "objectStorage": [
            "AWS S3", "Google Cloud Storage", "Azure Blob Storage",
            "Supabase Storage", "Firebase Storage", "Appwrite Storage", "Amazon S3"
        ],
        "fileSystem": [
            "Local File System", "Network File System", "Self-hosted"
        ]
    },
    "serverless": {
        "functions": [
            "AWS Lambda", "Azure Functions", "Google Cloud Functions",
            "Vercel Functions", "Netlify Functions", "Cloudflare Workers",
            "Appwrite Functions", "Cloud Functions"
        ],
        "platforms": [
            "AWS Amplify", "Serverless Framework", "Firebase Cloud Functions"
        ]
    },
    "testing": {
        "unitTesting": [
            "Jest", "Vitest", "Mocha", "Jasmine", "pytest", "JUnit", "PHPUnit", "RSpec"
        ],
        "e2eTesting": [
            "Cypress", "Playwright", "Selenium", "Puppeteer", "TestCafe"
        ],
        "apiTesting": [
            "Postman", "REST Assured", "SuperTest", "Pactum"
        ]
    }
}

# Flat list of all technologies for quick validation
ALL_TECHNOLOGIES: Set[str] = set()

# Initialize the flat list
for category, subcategories in TECH_REGISTRY.items():
    for subcategory, technologies in subcategories.items():
        for tech in technologies:
            ALL_TECHNOLOGIES.add(tech)


# Create a schema-based registry representation
def get_tech_registry_schema() -> TechRegistrySchema:
    """
    Convert the TECH_REGISTRY dictionary to a TechRegistrySchema instance.
    
    Returns:
        TechRegistrySchema: A Pydantic model representing the tech registry.
    """
    # Create a new TechRegistrySchema instance
    registry_schema = TechRegistrySchema()
    
    # Populate the frontend technologies
    if "frontend" in TECH_REGISTRY:
        frontend = TECH_REGISTRY["frontend"]
        if "frameworks" in frontend:
            registry_schema.frontend.frameworks = frontend["frameworks"]
        if "languages" in frontend:
            registry_schema.frontend.languages = frontend["languages"]
        if "stateManagement" in frontend:
            registry_schema.frontend.stateManagement = frontend["stateManagement"]
        if "uiLibraries" in frontend:
            registry_schema.frontend.uiLibraries = frontend["uiLibraries"]
        if "formHandling" in frontend:
            registry_schema.frontend.formHandling = frontend["formHandling"]
        if "routing" in frontend:
            registry_schema.frontend.routing = frontend["routing"]
        if "apiClients" in frontend:
            registry_schema.frontend.apiClients = frontend["apiClients"]
        if "metaFrameworks" in frontend:
            registry_schema.frontend.metaFrameworks = frontend["metaFrameworks"]
    
    # Populate the backend technologies
    if "backend" in TECH_REGISTRY:
        backend = TECH_REGISTRY["backend"]
        if "frameworks" in backend:
            registry_schema.backend.frameworks = backend["frameworks"]
        if "languages" in backend:
            registry_schema.backend.languages = backend["languages"]
        if "orms" in backend:
            registry_schema.backend.orms = backend["orms"]
        if "authFrameworks" in backend:
            registry_schema.backend.authFrameworks = backend["authFrameworks"]
    
    # Populate the database technologies
    if "database" in TECH_REGISTRY:
        database = TECH_REGISTRY["database"]
        if "relational" in database:
            registry_schema.database.relational = database["relational"]
        if "noSql" in database:
            registry_schema.database.noSql = database["noSql"]
        if "providers" in database:
            registry_schema.database.providers = database["providers"]
    
    # Populate the authentication technologies
    if "authentication" in TECH_REGISTRY:
        auth = TECH_REGISTRY["authentication"]
        if "providers" in auth:
            registry_schema.authentication.providers = auth["providers"]
        if "methods" in auth:
            registry_schema.authentication.methods = auth["methods"]
    
    # Populate the deployment technologies
    if "deployment" in TECH_REGISTRY:
        deployment = TECH_REGISTRY["deployment"]
        if "platforms" in deployment:
            registry_schema.deployment.platforms = deployment["platforms"]
        if "containerization" in deployment:
            registry_schema.deployment.containerization = deployment["containerization"]
        if "ci_cd" in deployment:
            registry_schema.deployment.ci_cd = deployment["ci_cd"]
    
    # Populate the testing technologies
    if "testing" in TECH_REGISTRY:
        testing = TECH_REGISTRY["testing"]
        if "unitTesting" in testing:
            registry_schema.testing.unitTesting = testing["unitTesting"]
        if "e2eTesting" in testing:
            registry_schema.testing.e2eTesting = testing["e2eTesting"]
        if "apiTesting" in testing:
            registry_schema.testing.apiTesting = testing["apiTesting"]

    # Populate the storage technologies
    if "storage" in TECH_REGISTRY:
        storage = TECH_REGISTRY["storage"]
        if "objectStorage" in storage:
            registry_schema.storage.objectStorage = storage["objectStorage"]
        if "fileSystem" in storage:
            registry_schema.storage.fileSystem = storage["fileSystem"]

    # Populate the serverless technologies
    if "serverless" in TECH_REGISTRY:
        serverless = TECH_REGISTRY["serverless"]
        if "functions" in serverless:
            registry_schema.serverless.functions = serverless["functions"]
        if "platforms" in serverless:
            registry_schema.serverless.platforms = serverless["platforms"]
    
    # Set the all_technologies set
    registry_schema.all_technologies = ALL_TECHNOLOGIES
    
    return registry_schema


def is_valid_tech(tech_name: str) -> bool:
    """
    Check if a technology name exists in the registry.
    
    Args:
        tech_name: Name of the technology to validate
        
    Returns:
        bool: True if the technology exists in the registry
    """
    return tech_name in ALL_TECHNOLOGIES


def get_category_for_tech(tech_name: str) -> Optional[Dict[str, str]]:
    """
    Find the category and subcategory for a given technology.
    
    Args:
        tech_name: Name of the technology
        
    Returns:
        Optional[Dict[str, str]]: Dictionary with 'category' and 'subcategory' if found,
                                 None otherwise
    """
    for category, subcategories in TECH_REGISTRY.items():
        for subcategory, technologies in subcategories.items():
            if tech_name in technologies:
                return {"category": category, "subcategory": subcategory}
    return None


def get_technologies_in_category(category: str, subcategory: Optional[str] = None) -> List[str]:
    """
    Get all technologies in a specific category and optional subcategory.
    
    Args:
        category: Main technology category (e.g., 'frontend', 'backend')
        subcategory: Optional subcategory (e.g., 'frameworks', 'languages')
        
    Returns:
        List[str]: List of technology names in the specified category/subcategory
    """
    if category not in TECH_REGISTRY:
        return []
    
    if subcategory is None:
        # Return all technologies in all subcategories of this category
        result = []
        for subcat, technologies in TECH_REGISTRY[category].items():
            result.extend(technologies)
        return result
    
    if subcategory not in TECH_REGISTRY[category]:
        return []
    
    return TECH_REGISTRY[category][subcategory]


def validate_template_tech_stack(template_tech_stack: Union[Dict[str, Any], TechStackData]) -> Dict[str, Any]:
    """
    Validate that all technologies in a template's tech stack exist in the registry.
    
    Args:
        template_tech_stack: The tech stack section of a project template
                            Can be a Dict or a TechStackData pydantic model
        
    Returns:
        Dict with validation results:
        {
            "is_valid": bool,
            "invalid_technologies": List[Dict[str, str]]  # Contains category, tech name
        }
    """
    results = {
        "is_valid": True,
        "invalid_technologies": []
    }
    
    # Convert TechStackData to dict if needed
    tech_stack_dict = template_tech_stack
    if isinstance(template_tech_stack, TechStackData):
        tech_stack_dict = template_tech_stack.dict()
    
    # Debug print for technology registry
    logger.debug(f"Technology registry contains {len(ALL_TECHNOLOGIES)} technologies")
    
    # Check frontend technologies
    if "frontend" in tech_stack_dict:
        frontend = tech_stack_dict["frontend"]
        if "frameworks" in frontend:
            for fw in frontend["frameworks"]:
                name = fw.get("name", "")
                if name and not is_valid_tech(name):
                    results["is_valid"] = False
                    results["invalid_technologies"].append({
                        "section": "frontend",
                        "key": "frameworks",
                        "technology": name
                    })
                
                # Check compatibility options
                if "compatibility" in fw:
                    comp = fw["compatibility"]
                    for key, value_list in comp.items():
                        if isinstance(value_list, list):
                            for tech in value_list:
                                if tech and not is_valid_tech(tech):
                                    results["is_valid"] = False
                                    results["invalid_technologies"].append({
                                        "section": "frontend.compatibility",
                                        "key": key,
                                        "technology": tech
                                    })
    
    # Check backend technologies
    if "backend" in tech_stack_dict:
        backend = tech_stack_dict["backend"]
        # Check frameworks
        if "frameworks" in backend:
            for fw in backend["frameworks"]:
                name = fw.get("name", "")
                if name and not is_valid_tech(name):
                    results["is_valid"] = False
                    results["invalid_technologies"].append({
                        "section": "backend",
                        "key": "frameworks",
                        "technology": name
                    })
                
                # Check compatibility options
                if "compatibility" in fw:
                    comp = fw["compatibility"]
                    for key, value_list in comp.items():
                        if isinstance(value_list, list):
                            for tech in value_list:
                                if tech and not is_valid_tech(tech):
                                    results["is_valid"] = False
                                    results["invalid_technologies"].append({
                                        "section": "backend.compatibility",
                                        "key": key,
                                        "technology": tech
                                    })
        
        # Check backend as a service
        if "baas" in backend:
            for baas in backend["baas"]:
                name = baas.get("name", "")
                if name and not is_valid_tech(name):
                    results["is_valid"] = False
                    results["invalid_technologies"].append({
                        "section": "backend",
                        "key": "baas",
                        "technology": name
                    })
                
                # Check compatibility options
                if "compatibility" in baas:
                    comp = baas["compatibility"]
                    for key, value_list in comp.items():
                        if isinstance(value_list, list):
                            for tech in value_list:
                                if tech and not is_valid_tech(tech):
                                    results["is_valid"] = False
                                    results["invalid_technologies"].append({
                                        "section": "backend.baas.compatibility",
                                        "key": key,
                                        "technology": tech
                                    })
    
    # Check database technologies
    if "database" in tech_stack_dict:
        database = tech_stack_dict["database"]
        # Check SQL databases
        if "sql" in database:
            for db in database["sql"]:
                name = db.get("name", "")
                if name and not is_valid_tech(name):
                    results["is_valid"] = False
                    results["invalid_technologies"].append({
                        "section": "database",
                        "key": "sql",
                        "technology": name
                    })
                
                # Check compatibility options
                if "compatibility" in db:
                    comp = db["compatibility"]
                    for key, value_list in comp.items():
                        if isinstance(value_list, list):
                            for tech in value_list:
                                if tech and not is_valid_tech(tech):
                                    results["is_valid"] = False
                                    results["invalid_technologies"].append({
                                        "section": "database.sql.compatibility",
                                        "key": key,
                                        "technology": tech
                                    })
        
        # Check NoSQL databases
        if "nosql" in database:
            for db in database["nosql"]:
                name = db.get("name", "")
                if name and not is_valid_tech(name):
                    results["is_valid"] = False
                    results["invalid_technologies"].append({
                        "section": "database",
                        "key": "nosql",
                        "technology": name
                    })
                
                # Check compatibility options
                if "compatibility" in db:
                    comp = db["compatibility"]
                    for key, value_list in comp.items():
                        if isinstance(value_list, list):
                            for tech in value_list:
                                if tech and not is_valid_tech(tech):
                                    results["is_valid"] = False
                                    results["invalid_technologies"].append({
                                        "section": "database.nosql.compatibility",
                                        "key": key,
                                        "technology": tech
                                    })
    
    # Check hosting options
    if "hosting" in tech_stack_dict:
        hosting = tech_stack_dict["hosting"]
        for key, value_list in hosting.items():
            if isinstance(value_list, list):
                for tech in value_list:
                    if tech and not is_valid_tech(tech):
                        results["is_valid"] = False
                        results["invalid_technologies"].append({
                            "section": "hosting",
                            "key": key,
                            "technology": tech
                        })
    
    # Check authentication options
    if "authentication" in tech_stack_dict:
        auth = tech_stack_dict["authentication"]
        for key, value_list in auth.items():
            if isinstance(value_list, list):
                for tech in value_list:
                    if tech and not is_valid_tech(tech):
                        results["is_valid"] = False
                        results["invalid_technologies"].append({
                            "section": "authentication",
                            "key": key,
                            "technology": tech
                        })
    
    # Debug output
    logger.debug(f"Validation result: {results}")
    if not results['is_valid']:
        logger.debug(f"Found invalid technologies: {results['invalid_technologies']}")
    
    return results


def validate_tech_stack_with_schema(template_tech_stack: Union[Dict[str, Any], TechStackData]) -> TechStackValidationResult:
    """
    Validate a tech stack using the schema classes.
    
    This is a wrapper around validate_template_tech_stack that returns a TechStackValidationResult instead.
    
    Args:
        template_tech_stack: The tech stack to validate
        
    Returns:
        TechStackValidationResult: Validation results as a Pydantic model
    """
    results = validate_template_tech_stack(template_tech_stack)
    
    # Convert the dict-based results to a schema-based result
    invalid_technologies = []
    for tech in results["invalid_technologies"]:
        invalid_technologies.append(InvalidTechnology(
            section=tech["section"],
            key=tech["key"],
            technology=tech["technology"]
        ))
    
    return TechStackValidationResult(
        is_valid=results["is_valid"],
        invalid_technologies=invalid_technologies
    )


def get_all_technologies_in_category_with_schema(category_name: str) -> Optional[List[str]]:
    """
    Get all technologies in a category using the schema.
    
    Args:
        category_name: Name of the category
        
    Returns:
        Optional[List[str]]: List of all technologies in the category, or None if category not found
    """
    registry = get_tech_registry_schema()
    
    # Get the appropriate category based on the name
    if category_name == 'frontend':
        category_model = registry.frontend
        # Get all technologies from all subcategories
        techs = []
        techs.extend(category_model.frameworks)
        techs.extend(category_model.languages)
        techs.extend(category_model.stateManagement)
        techs.extend(category_model.uiLibraries)
        techs.extend(category_model.formHandling)
        techs.extend(category_model.routing)
        techs.extend(category_model.apiClients)
        techs.extend(category_model.metaFrameworks)
        return techs
    elif category_name == 'backend':
        category_model = registry.backend
        techs = []
        techs.extend(category_model.frameworks)
        techs.extend(category_model.languages)
        techs.extend(category_model.orms)
        techs.extend(category_model.authFrameworks)
        return techs
    elif category_name == 'database':
        category_model = registry.database
        techs = []
        techs.extend(category_model.relational)
        techs.extend(category_model.noSql)
        techs.extend(category_model.providers)
        return techs
    elif category_name == 'authentication':
        category_model = registry.authentication
        techs = []
        techs.extend(category_model.providers)
        techs.extend(category_model.methods)
        return techs
    elif category_name == 'deployment':
        category_model = registry.deployment
        techs = []
        techs.extend(category_model.platforms)
        techs.extend(category_model.containerization)
        techs.extend(category_model.ci_cd)
        return techs
    elif category_name == 'testing':
        category_model = registry.testing
        techs = []
        techs.extend(category_model.unitTesting)
        techs.extend(category_model.e2eTesting)
        techs.extend(category_model.apiTesting)
        return techs
    
    return None


def get_all_subcategories_with_schema(category_name: str) -> Optional[List[str]]:
    """
    Get all subcategories in a category using the schema.
    
    Args:
        category_name: Name of the category
        
    Returns:
        Optional[List[str]]: List of all subcategory names in the category, or None if category not found
    """
    # Return subcategories based on category name
    if category_name == 'frontend':
        return ['frameworks', 'languages', 'stateManagement', 'uiLibraries', 
                'formHandling', 'routing', 'apiClients', 'metaFrameworks']
    elif category_name == 'backend':
        return ['frameworks', 'languages', 'orms', 'authFrameworks']
    elif category_name == 'database':
        return ['relational', 'noSql', 'providers']
    elif category_name == 'authentication':
        return ['providers', 'methods']
    elif category_name == 'deployment':
        return ['platforms', 'containerization', 'ci_cd']
    elif category_name == 'testing':
        return ['unitTesting', 'e2eTesting', 'apiTesting']
    
    return None


def get_technologies_in_subcategory_with_schema(category_name: str, subcategory_name: str) -> Optional[List[str]]:
    """
    Get all technologies in a specific subcategory using the schema.
    
    Args:
        category_name: Name of the category
        subcategory_name: Name of the subcategory
        
    Returns:
        Optional[List[str]]: List of technologies in the subcategory, or None if category/subcategory not found
    """
    registry = get_tech_registry_schema()
    
    # Get the appropriate subcategory based on the category and subcategory names
    if category_name == 'frontend':
        if subcategory_name == 'frameworks':
            return registry.frontend.frameworks
        elif subcategory_name == 'languages':
            return registry.frontend.languages
        elif subcategory_name == 'stateManagement':
            return registry.frontend.stateManagement
        elif subcategory_name == 'uiLibraries':
            return registry.frontend.uiLibraries
        elif subcategory_name == 'formHandling':
            return registry.frontend.formHandling
        elif subcategory_name == 'routing':
            return registry.frontend.routing
        elif subcategory_name == 'apiClients':
            return registry.frontend.apiClients
        elif subcategory_name == 'metaFrameworks':
            return registry.frontend.metaFrameworks
    elif category_name == 'backend':
        if subcategory_name == 'frameworks':
            return registry.backend.frameworks
        elif subcategory_name == 'languages':
            return registry.backend.languages
        elif subcategory_name == 'orms':
            return registry.backend.orms
        elif subcategory_name == 'authFrameworks':
            return registry.backend.authFrameworks
    elif category_name == 'database':
        if subcategory_name == 'relational':
            return registry.database.relational
        elif subcategory_name == 'noSql':
            return registry.database.noSql
        elif subcategory_name == 'providers':
            return registry.database.providers
    elif category_name == 'authentication':
        if subcategory_name == 'providers':
            return registry.authentication.providers
        elif subcategory_name == 'methods':
            return registry.authentication.methods
    elif category_name == 'deployment':
        if subcategory_name == 'platforms':
            return registry.deployment.platforms
        elif subcategory_name == 'containerization':
            return registry.deployment.containerization
        elif subcategory_name == 'ci_cd':
            return registry.deployment.ci_cd
    elif category_name == 'testing':
        if subcategory_name == 'unitTesting':
            return registry.testing.unitTesting
        elif subcategory_name == 'e2eTesting':
            return registry.testing.e2eTesting
        elif subcategory_name == 'apiTesting':
            return registry.testing.apiTesting
    
    return None 