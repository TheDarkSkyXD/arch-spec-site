"""
Tech Stack Compatibility Data and Utilities.

This module provides functions to check compatibility between different technology choices.
"""
import logging
from typing import Dict, Union, Any

from app.seed.tech_registry import (
    is_valid_tech
)
from app.schemas.tech_stack import (
    TechStackSelection, 
    CompatibilityResult, 
    TechStackData,
    CompatibleOptionsResponse
)
from app.db.base import db
from app.seed.tech_stack_db import get_tech_stack_from_db

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

# Function to get the tech stack data, preferring database but falling back to in-memory data
async def get_tech_stack_data() -> Dict[str, Any]:
    """
    Get the tech stack compatibility data, preferring database but falling back to in-memory data.
    
    Returns:
        Dict: The tech stack compatibility data
    """
    try:
        # Try to get tech stack data from database first
        database = db.get_db()
        if database:
            db_tech_stack = await get_tech_stack_from_db(database)
            if db_tech_stack:
                logger.info("Using tech stack data from database")
                return db_tech_stack
                
        # Fall back to in-memory data if database access fails
        logger.info("Using in-memory tech stack data (database data not available)")
        return TECH_STACK_DATA
    except Exception as e:
        logger.warning(f"Error retrieving tech stack data from database: {str(e)}. Using in-memory data.")
        return TECH_STACK_DATA

def check_compatibility(tech_choice: Union[Dict[str, str], TechStackSelection]) -> CompatibilityResult:
    """
    Check compatibility between selected technology choices.
    
    Args:
        tech_choice: Dict or TechStackSelection containing selected technologies
            Example: {
                "frontend_framework": "React",
                "backend_framework": "Express.js"
            }
            
    Returns:
        CompatibilityResult: Object containing compatibility results
    """
    # This function only operates on the input data and doesn't need async
    # The actual tech stack data is loaded in the service layer
    try:
        # Handle both dictionary and Pydantic model inputs
        if isinstance(tech_choice, TechStackSelection):
            # Convert Pydantic model to dict
            selection = {k: v for k, v in tech_choice.dict().items() if v is not None}
        else:
            selection = {k: v for k, v in tech_choice.items() if v is not None}
        
        # Validate that all selected technologies exist
        invalid_techs = []
        for tech_name in selection.values():
            if not is_valid_tech(tech_name):
                invalid_techs.append(tech_name)
        
        if invalid_techs:
            logger.warning(f"Invalid technologies selected: {invalid_techs}")
            return CompatibilityResult(
                valid=False,
                compatibility_issues=[],
                invalid_technologies=invalid_techs
            )
        
        # Just an example result - the real implementation will check against TECH_STACK_DATA
        # Simplified implementation for now
        return CompatibilityResult(
            valid=True,
            compatibility_issues=[],
            invalid_technologies=[]
        )
    
    except Exception as e:
        logger.error(f"Error in compatibility check: {str(e)}")
        return CompatibilityResult(
            valid=False,
            compatibility_issues=[f"Error: {str(e)}"],
            invalid_technologies=[]
        )

async def check_compatibility_with_db(tech_choice: Union[Dict[str, str], TechStackSelection]) -> CompatibilityResult:
    """
    Check compatibility between selected technology choices, using database data with fallback.
    
    Args:
        tech_choice: Dict or TechStackSelection containing selected technologies
            
    Returns:
        CompatibilityResult: Object containing compatibility results
    """
    # This is the async version that uses the database with fallback
    try:
        # Handle both dictionary and Pydantic model inputs
        if isinstance(tech_choice, TechStackSelection):
            # Convert Pydantic model to dict
            selection = {k: v for k, v in tech_choice.dict().items() if v is not None}
        else:
            selection = {k: v for k, v in tech_choice.items() if v is not None}
        
        # Validate that all selected technologies exist
        invalid_techs = []
        for tech_name in selection.values():
            if not is_valid_tech(tech_name):
                invalid_techs.append(tech_name)
        
        if invalid_techs:
            logger.warning(f"Invalid technologies selected: {invalid_techs}")
            return CompatibilityResult(
                valid=False,
                compatibility_issues=[],
                invalid_technologies=invalid_techs
            )
        
        # Get tech stack data from database with fallback
        tech_stack_data = await get_tech_stack_data()
        
        # Here we would implement the compatibility check logic using tech_stack_data
        # For now, just return a simple result
        return CompatibilityResult(
            valid=True,
            compatibility_issues=[],
            invalid_technologies=[]
        )
    
    except Exception as e:
        logger.error(f"Error in compatibility check: {str(e)}")
        return CompatibilityResult(
            valid=False,
            compatibility_issues=[f"Error: {str(e)}"],
            invalid_technologies=[]
        )

def get_compatible_options(category: str, technology: str) -> CompatibleOptionsResponse:
    """
    Get a list of compatible technologies for a given technology in a category.
    
    Args:
        category: Technology category (e.g., 'frontend', 'backend')
        technology: Technology name
        
    Returns:
        CompatibleOptionsResponse: Compatible technology options
    """
    result = CompatibleOptionsResponse(
        category=category,
        technology=technology,
        compatible_options={}
    )
    
    # Return empty result for now - real implementation will look up data
    return result

async def get_compatible_options_with_db(category: str, technology: str) -> CompatibleOptionsResponse:
    """
    Get a list of compatible technologies for a given technology in a category,
    using database data with fallback.
    
    Args:
        category: Technology category (e.g., 'frontend', 'backend')
        technology: Technology name
        
    Returns:
        CompatibleOptionsResponse: Compatible technology options
    """
    try:
        # Get tech stack data from database with fallback
        tech_stack_data = await get_tech_stack_data()
        
        result = CompatibleOptionsResponse(
            category=category,
            technology=technology,
            compatible_options={}
        )
        
        # Here we would implement the compatibility lookup logic using tech_stack_data
        # For now, just return an empty result
        
        return result
    except Exception as e:
        logger.error(f"Error getting compatible options: {str(e)}")
        return CompatibleOptionsResponse(
            category=category,
            technology=technology,
            compatible_options={}
        )

async def get_all_tech_options_with_db():
    """
    Get all available technology options from all categories,
    using database data with fallback.
    
    Returns:
        Dict: All technology options by category
    """
    try:
        # Get tech stack data from database with fallback
        tech_stack_data = await get_tech_stack_data()
        
        # Extract and organize the tech options from the tech stack data
        # For now, return a simplified version
        return {
            "frontend": tech_stack_data.get("frontend", {}),
            "backend": tech_stack_data.get("backend", {}),
            "database": tech_stack_data.get("database", {}),
            "authentication": tech_stack_data.get("authentication", {}),
            "hosting": tech_stack_data.get("hosting", {})
        }
    except Exception as e:
        logger.error(f"Error getting all technology options: {str(e)}")
        # Fallback to in-memory data on error
        return {
            "frontend": TECH_STACK_DATA.get("frontend", {}),
            "backend": TECH_STACK_DATA.get("backend", {}),
            "database": TECH_STACK_DATA.get("database", {}),
            "authentication": TECH_STACK_DATA.get("authentication", {}),
            "hosting": TECH_STACK_DATA.get("hosting", {})
        }
