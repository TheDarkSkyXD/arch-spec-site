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
            "React", "Vue.js", "Angular", "Svelte", "Solid.js", "Preact", "Lit", "Alpine.js"  # Added Alpine.js as a test
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
            "Custom Express", "Serverless"  # Added from templates
        ],
        "languages": [
            "JavaScript", "TypeScript", "Python", "Java", "PHP", "Ruby", "C#", "Go", "Rust"
        ],
        "orms": [
            "Sequelize", "TypeORM", "Prisma", "Django ORM", "SQLAlchemy", "Hibernate", 
            "Eloquent", "Entity Framework", "GORM",
            "Eloquent ORM", "Entity Framework Core", "Mongoose", "Drizzle", "Dapper",
            "MongoDB PyMongo", "Spring Data JPA"  # Added from tech stack
        ],
        "authFrameworks": [
            "Passport.js", "NextAuth.js", "Django Auth", "Spring Security", 
            "Laravel Sanctum", "ASP.NET Identity",
            "JWT", "OAuth2", "OIDC", "Flask-Login", "Laravel Passport",
            "Laravel Breeze"  # Added from tech stack
        ]
    },
    "database": {
        "relational": [
            "PostgreSQL", "MySQL", "MariaDB", "SQLite", "Oracle", "SQL Server"
        ],
        "noSql": [
            "MongoDB", "Firestore", "DynamoDB", "Cassandra", "Redis", "Elasticsearch"
        ],
        "providers": [
            "Supabase", "Firebase", "MongoDB Atlas", "AWS RDS", "Planetscale", "Fauna"
        ]
    },
    "authentication": {
        "providers": [
            "Supabase Auth", "Firebase Auth", "Auth0", "Clerk", "Okta", "Cognito", "Custom JWT"
        ],
        "methods": [
            "Email/Password", "Google", "GitHub", "Twitter", "Facebook", "Apple", "Microsoft",
            "SAML", "LDAP", "OAuth 2.0", "OpenID Connect", "Magic Link", "2FA"
        ]
    },
    "deployment": {
        "platforms": [
            "Vercel", "Netlify", "Render", "Heroku", "AWS", "GCP", "Azure", "DigitalOcean",
            "Cloudflare", "Railway", "Fly.io"
        ],
        "containerization": [
            "Docker", "Kubernetes", "AWS ECS", "GCP Cloud Run"
        ],
        "ci_cd": [
            "GitHub Actions", "GitLab CI", "CircleCI", "Jenkins", "Travis CI"
        ]
    },
    "testing": {
        "unitTesting": [
            "Jest", "Vitest", "Mocha", "Jasmine", "pytest", "JUnit", "PHPUnit", "RSpec", "TestCafe Unit"  # Added TestCafe Unit as a test
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