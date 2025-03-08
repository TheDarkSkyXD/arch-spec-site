"""
Tech Stack Compatibility Data and Utilities.

This module provides functions to check compatibility between different technology choices.
"""
import logging
from typing import Dict, Union

from app.seed.tech_registry import (
    is_valid_tech
)
from app.schemas.tech_stack import (
    TechStackSelection, 
    CompatibilityResult, 
    TechStackData,
    CompatibleOptionsResponse
)

logger = logging.getLogger(__name__)

# Tech stack data - using dict for easier initialization
TECH_STACK_RAW_DATA = {
    "frontend": {
        "frameworks": [
            {
                "name": "React",
                "description": "A JavaScript library for building user interfaces",
                "compatibility": {
                    "stateManagement": ["Redux", "MobX", "Zustand", "Recoil", "Context API"],
                    "uiLibraries": ["Material UI", "Chakra UI", "Ant Design", "Tailwind CSS", "Bootstrap"],
                    "formHandling": ["React Hook Form", "Formik"],
                    "routing": ["React Router"],
                    "apiClients": ["Axios", "TanStack Query", "SWR", "Apollo Client", "urql"],
                    "metaFrameworks": ["Next.js", "Remix", "Gatsby"]
                }
            },
            {
                "name": "Vue.js",
                "description": "The Progressive JavaScript Framework",
                "compatibility": {
                    "stateManagement": ["Pinia", "Vuex"],
                    "uiLibraries": ["Vuetify", "PrimeVue", "Quasar", "Tailwind CSS", "Bootstrap"],
                    "formHandling": ["VeeValidate", "FormKit"],
                    "routing": ["Vue Router"],
                    "apiClients": ["Axios", "Apollo Client", "Vue Query"],
                    "metaFrameworks": ["Nuxt.js", "Vite"]
                }
            },
            {
                "name": "Angular",
                "description": "Platform for building mobile and desktop web applications",
                "compatibility": {
                    "stateManagement": ["NgRx", "Akita", "NGXS"],
                    "uiLibraries": ["Angular Material", "PrimeNG", "NG Bootstrap", "Tailwind CSS"],
                    "formHandling": ["Angular Forms", "NgxFormly"],
                    "routing": ["Angular Router"],
                    "apiClients": ["Axios", "Angular HttpClient", "Apollo Angular"],
                    "metaFrameworks": []
                }
            },
            {
                "name": "Svelte",
                "description": "Cybernetically enhanced web apps",
                "compatibility": {
                    "stateManagement": ["Svelte Store"],
                    "uiLibraries": ["Svelte Material UI", "Tailwind CSS", "Bootstrap"],
                    "formHandling": ["Svelte Forms", "Felte"],
                    "routing": ["SvelteKit Routing", "Svelte Navigator"],
                    "apiClients": ["Axios", "SvelteQuery"],
                    "metaFrameworks": ["SvelteKit"]
                }
            },
            {
                "name": "Next.js",
                "description": "The React Framework for Production",
                "compatibility": {
                    "stateManagement": ["Redux", "MobX", "Zustand", "Recoil", "Context API"],
                    "uiLibraries": ["Material UI", "Chakra UI", "Ant Design", "Tailwind CSS", "Bootstrap"],
                    "formHandling": ["React Hook Form", "Formik"],
                    "routing": ["Next.js Routing"],
                    "apiClients": ["Axios", "TanStack Query", "SWR", "Apollo Client", "urql"],
                    "metaFrameworks": []
                }
            }
        ]
    },
    "backend": {
        "frameworks": [
            {
                "name": "Express.js",
                "description": "Fast, unopinionated, minimalist web framework for Node.js",
                "language": "JavaScript/TypeScript",
                "compatibility": {
                    "databases": ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis", "SQL Server"],
                    "orms": ["Prisma", "TypeORM", "Sequelize", "Mongoose", "Drizzle"],
                    "auth": ["JWT", "Passport.js", "Auth0", "OAuth2"]
                }
            },
            {
                "name": "NestJS",
                "description": "A progressive Node.js framework for building efficient and scalable server-side applications",
                "language": "TypeScript",
                "compatibility": {
                    "databases": ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis", "SQL Server"],
                    "orms": ["Prisma", "TypeORM", "Sequelize", "Mongoose"],
                    "auth": ["JWT", "Passport.js", "Auth0", "OAuth2"]
                }
            },
            {
                "name": "Django",
                "description": "The web framework for perfectionists with deadlines",
                "language": "Python",
                "compatibility": {
                    "databases": ["PostgreSQL", "MySQL", "SQLite", "Oracle", "SQL Server"],
                    "orms": ["Django ORM"],
                    "auth": ["Django Auth", "JWT", "OAuth2", "Auth0"]
                }
            },
            {
                "name": "Flask",
                "description": "Python Micro web framework",
                "language": "Python",
                "compatibility": {
                    "databases": ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "SQL Server"],
                    "orms": ["SQLAlchemy", "MongoDB PyMongo"],
                    "auth": ["Flask-Login", "JWT", "OAuth2", "Auth0"]
                }
            },
            {
                "name": "Spring Boot",
                "description": "Java-based framework for creating stand-alone, production-grade applications",
                "language": "Java",
                "compatibility": {
                    "databases": ["PostgreSQL", "MySQL", "Oracle", "MongoDB", "Redis", "SQL Server"],
                    "orms": ["Hibernate", "Spring Data JPA"],
                    "auth": ["Spring Security", "JWT", "OAuth2", "OIDC"]
                }
            },
            {
                "name": "Laravel",
                "description": "PHP Framework for Web Artisans",
                "language": "PHP",
                "compatibility": {
                    "databases": ["PostgreSQL", "MySQL", "SQLite", "SQL Server"],
                    "orms": ["Eloquent ORM"],
                    "auth": ["Laravel Breeze", "Laravel Sanctum", "Laravel Passport"]
                }
            },
            {
                "name": "ASP.NET Core",
                "description": "Cross-platform, high-performance framework for building modern cloud-based applications",
                "language": "C#",
                "compatibility": {
                    "databases": ["PostgreSQL", "MySQL", "SQL Server", "SQLite", "MongoDB"],
                    "orms": ["Entity Framework Core", "Dapper"],
                    "auth": ["ASP.NET Identity", "JWT", "OAuth2", "OIDC"]
                }
            }
        ],
        "baas": [
            {
                "name": "Supabase",
                "description": "Open source Firebase alternative with PostgreSQL",
                "compatibility": {
                    "databases": ["PostgreSQL"],
                    "auth": ["Supabase Auth"],
                    "storage": ["Supabase Storage"],
                    "functions": ["Edge Functions"]
                }
            },
            {
                "name": "Firebase",
                "description": "Google's platform for app development",
                "compatibility": {
                    "databases": ["Firestore", "Realtime Database"],
                    "auth": ["Firebase Auth"],
                    "storage": ["Firebase Storage"],
                    "functions": ["Cloud Functions"]
                }
            },
            {
                "name": "AWS Amplify",
                "description": "Build full-stack web and mobile apps on AWS",
                "compatibility": {
                    "databases": ["DynamoDB", "Aurora", "RDS"],
                    "auth": ["Amazon Cognito"],
                    "storage": ["Amazon S3"],
                    "functions": ["AWS Lambda"]
                }
            },
            {
                "name": "Appwrite",
                "description": "Open source backend server for web, mobile, and Flutter developers",
                "compatibility": {
                    "databases": ["MariaDB (internal)"],
                    "auth": ["Appwrite Auth"],
                    "storage": ["Appwrite Storage"],
                    "functions": ["Appwrite Functions"]
                }
            }
        ]
    },
    "database": {
        "sql": [
            {
                "name": "PostgreSQL",
                "description": "Powerful, open source object-relational database system",
                "compatibility": {
                    "hosting": ["Self-hosted", "Supabase", "AWS RDS", "Neon", "Railway", "Render", "Heroku"],
                    "orms": ["Prisma", "TypeORM", "Sequelize", "Django ORM", "SQLAlchemy", "Hibernate", "Entity Framework Core"]
                }
            },
            {
                "name": "MySQL",
                "description": "Open-source relational database management system",
                "compatibility": {
                    "hosting": ["Self-hosted", "AWS RDS", "PlanetScale", "Railway", "Managed Instance"],
                    "orms": ["Prisma", "TypeORM", "Sequelize", "Django ORM", "SQLAlchemy", "Hibernate", "Entity Framework Core"]
                }
            },
            {
                "name": "SQLite",
                "description": "Self-contained, serverless SQL database engine",
                "compatibility": {
                    "hosting": ["Local file", "Embedded"],
                    "orms": ["Prisma", "TypeORM", "Sequelize", "Django ORM", "SQLAlchemy", "Entity Framework Core"]
                }
            },
            {
                "name": "SQL Server",
                "description": "Microsoft's relational database management system",
                "compatibility": {
                    "hosting": ["Self-hosted", "AWS RDS", "Azure SQL", "Managed Instance"],
                    "orms": ["Prisma", "TypeORM", "Sequelize", "Django ORM", "SQLAlchemy", "Entity Framework Core"]
                }
            }
        ],
        "nosql": [
            {
                "name": "MongoDB",
                "description": "Document-based distributed database",
                "compatibility": {
                    "hosting": ["Self-hosted", "MongoDB Atlas", "Railway", "Managed Instance"],
                    "orms": ["Mongoose", "MongoDB Node.js Driver", "PyMongo", "Spring Data MongoDB"]
                }
            },
            {
                "name": "Firestore",
                "description": "Cloud-hosted NoSQL database from Firebase",
                "compatibility": {
                    "hosting": ["Firebase"],
                    "orms": ["Firebase"]
                }
            },
            {
                "name": "DynamoDB",
                "description": "Fast and flexible NoSQL database service by AWS",
                "compatibility": {
                    "hosting": ["AWS"],
                    "orms": ["AWS SDK", "Dynamoose"]
                }
            },
            {
                "name": "Redis",
                "description": "In-memory data structure store",
                "compatibility": {
                    "hosting": ["Self-hosted", "Redis Labs", "AWS ElastiCache", "Upstash"],
                    "orms": ["Redis Node.js client", "ioredis"]
                }
            }
        ]
    },
    "authentication": {
        "providers": ["JWT", "Passport.js", "Auth0", "OAuth2", "OIDC"]
    },
    "hosting": {
        "frontend": ["Self-hosted", "Vercel", "Netlify", "AWS Amplify", "Azure App Service"],
        "backend": ["Self-hosted", "AWS Lambda", "Azure Functions", "Google Cloud Functions"],
        "database": ["Self-hosted", "AWS RDS", "Azure SQL", "Google Cloud SQL", "PlanetScale"]
    }
}

# Validate the raw data using Pydantic
try:
    TECH_STACK_DATA_MODEL = TechStackData(**TECH_STACK_RAW_DATA)
    # After validation, we can use the raw data or the model
    TECH_STACK_DATA = TECH_STACK_RAW_DATA  # Keep this for backward compatibility
    logger.info("Tech stack data validated successfully")
except Exception as e:
    logger.error(f"Error validating tech stack data: {str(e)}")
    raise ValueError(f"Tech stack data validation failed: {str(e)}")

def check_compatibility(tech_choice: Union[Dict[str, str], TechStackSelection]) -> CompatibilityResult:
    """
    Check compatibility between selected technology choices.
    
    Args:
        tech_choice: Dict or TechStackSelection containing selected technologies
            Example: {
                "frontend_framework": "React",
                "state_management": "Redux",
                "backend_framework": "Express.js",
                "database": "PostgreSQL",
                "orm": "Prisma"
            }
    
    Returns:
        CompatibilityResult with compatibility information
    """
    # Convert Pydantic model to dict if needed, removing None values
    if isinstance(tech_choice, TechStackSelection):
        tech_choice_dict = tech_choice.dict(exclude_none=True)
    else:
        tech_choice_dict = tech_choice

    # First validate that all technology choices exist in the registry
    for key, value in tech_choice_dict.items():
        if not is_valid_tech(value):
            return CompatibilityResult(
                is_compatible=False,
                compatibility_issues=[f"Unknown technology: {value}"],
                compatible_options={}
            )
    
    # Now continue with compatibility checking as before
    results = {
        "is_compatible": True,
        "compatibility_issues": [],
        "compatible_options": {}
    }
    
    # Check frontend compatibility
    if "frontend_framework" in tech_choice_dict and "state_management" in tech_choice_dict:
        frontend_framework = tech_choice_dict["frontend_framework"]
        state_management = tech_choice_dict["state_management"]
        
        # Find the framework in the data
        framework_data = None
        for fw in TECH_STACK_DATA["frontend"]["frameworks"]:
            if fw["name"] == frontend_framework:
                framework_data = fw
                break
        
        if framework_data:
            # Check if state management is compatible with frontend framework
            if state_management not in framework_data["compatibility"].get("stateManagement", []):
                results["is_compatible"] = False
                results["compatibility_issues"].append(
                    f"State management '{state_management}' is not compatible with '{frontend_framework}'"
                )
            
            # Add compatible options for this framework
            results["compatible_options"]["state_management"] = framework_data["compatibility"].get("stateManagement", [])
            results["compatible_options"]["ui_libraries"] = framework_data["compatibility"].get("uiLibraries", [])
            results["compatible_options"]["form_handling"] = framework_data["compatibility"].get("formHandling", [])
    
    # Check backend and database compatibility
    if "backend_framework" in tech_choice_dict and "database" in tech_choice_dict:
        backend_framework = tech_choice_dict["backend_framework"]
        database = tech_choice_dict["database"]
        
        # Find the backend framework in the data
        backend_data = None
        for fw in TECH_STACK_DATA["backend"]["frameworks"]:
            if fw["name"] == backend_framework:
                backend_data = fw
                break
        
        if backend_data:
            # Check if database is compatible with backend framework
            if database not in backend_data["compatibility"].get("databases", []):
                results["is_compatible"] = False
                results["compatibility_issues"].append(
                    f"Database '{database}' is not compatible with '{backend_framework}'"
                )
            
            # Add compatible options for this backend
            results["compatible_options"]["databases"] = backend_data["compatibility"].get("databases", [])
            results["compatible_options"]["orms"] = backend_data["compatibility"].get("orms", [])
            results["compatible_options"]["auth"] = backend_data["compatibility"].get("auth", [])
    
    # Check database and ORM compatibility
    if "database" in tech_choice_dict and "orm" in tech_choice_dict:
        database = tech_choice_dict["database"]
        orm = tech_choice_dict["orm"]
        
        # Find the database in the data
        database_data = None
        for db_type in ["sql", "nosql"]:
            for db in TECH_STACK_DATA["database"].get(db_type, []):
                if db["name"] == database:
                    database_data = db
                    break
            if database_data:
                break
        
        if database_data:
            # Check if ORM is compatible with database
            if orm not in database_data["compatibility"].get("orms", []):
                results["is_compatible"] = False
                results["compatibility_issues"].append(
                    f"ORM '{orm}' is not compatible with '{database}'"
                )
            
            # Add compatible options for this database
            results["compatible_options"]["orms"] = database_data["compatibility"].get("orms", [])
            results["compatible_options"]["hosting"] = database_data["compatibility"].get("hosting", [])
    
    # Return as a Pydantic model
    return CompatibilityResult(**results)

def get_compatible_options(category: str, technology: str) -> CompatibleOptionsResponse:
    """
    Get a list of compatible options for a given technology in a specific category.
    
    Args:
        category: The technology category (e.g., 'frontend_framework', 'database')
        technology: The specific technology name
    
    Returns:
        CompatibleOptionsResponse containing compatible options
    """
    options = {}
    
    if category == "frontend_framework":
        for fw in TECH_STACK_DATA["frontend"]["frameworks"]:
            if fw["name"] == technology:
                options = {
                    "state_management": fw["compatibility"].get("stateManagement", []),
                    "ui_libraries": fw["compatibility"].get("uiLibraries", []),
                    "form_handling": fw["compatibility"].get("formHandling", []),
                    "routing": fw["compatibility"].get("routing", []),
                    "api_clients": fw["compatibility"].get("apiClients", []),
                    "meta_frameworks": fw["compatibility"].get("metaFrameworks", [])
                }
                break
    
    elif category == "backend_framework":
        for fw in TECH_STACK_DATA["backend"]["frameworks"]:
            if fw["name"] == technology:
                options = {
                    "databases": fw["compatibility"].get("databases", []),
                    "orms": fw["compatibility"].get("orms", []),
                    "auth": fw["compatibility"].get("auth", [])
                }
                break
    
    elif category == "database":
        for db_type in ["sql", "nosql"]:
            for db in TECH_STACK_DATA["database"].get(db_type, []):
                if db["name"] == technology:
                    options = {
                        "orms": db["compatibility"].get("orms", []),
                        "hosting": db["compatibility"].get("hosting", [])
                    }
                    break
            if options:
                break
    
    # Return a properly validated Pydantic model
    return CompatibleOptionsResponse(options=options)
