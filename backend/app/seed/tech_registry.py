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
            "Redux", "MobX", "Zustand", "Recoil", "Context API", "React Context API",  # React
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


def validate_template_tech_stack(template_tech_stack: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate that all technologies in a template's tech stack exist in the registry.
    
    Args:
        template_tech_stack: The tech stack section of a project template
        
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
    
    # Helper function to check all technology values
    def validate_tech_section(section: Dict[str, Any], section_name: str):
        for key, value in section.items():
            # Skip certain keys that aren't technology names
            if key in ["options", "type", "methods"]:
                # If it's a list of technologies, check each one
                if isinstance(value, list):
                    for tech in value:
                        if not is_valid_tech(tech):
                            results["is_valid"] = False
                            results["invalid_technologies"].append({
                                "section": section_name,
                                "key": key,
                                "technology": tech
                            })
            elif isinstance(value, str) and not is_valid_tech(value):
                results["is_valid"] = False
                results["invalid_technologies"].append({
                    "section": section_name,
                    "key": key,
                    "technology": value
                })
    
    # Check frontend technologies
    if "frontend" in template_tech_stack:
        validate_tech_section(template_tech_stack["frontend"], "frontend")
    
    # Check backend technologies
    if "backend" in template_tech_stack:
        validate_tech_section(template_tech_stack["backend"], "backend")
    
    # Check database technologies
    if "database" in template_tech_stack:
        validate_tech_section(template_tech_stack["database"], "database")
    
    # Check authentication technologies
    if "authentication" in template_tech_stack:
        validate_tech_section(template_tech_stack["authentication"], "authentication")
    
    # Check deployment technologies
    if "deployment" in template_tech_stack:
        validate_tech_section(template_tech_stack["deployment"], "deployment")
    
    # Check testing technologies
    if "testing" in template_tech_stack:
        validate_tech_section(template_tech_stack["testing"], "testing")
    
    return results 