"""
Seed data for project templates.
"""
import json
import logging
import os
from typing import Dict, List
from bson import ObjectId

logger = logging.getLogger(__name__)

# Sample project templates
PROJECT_TEMPLATES = [
    {
        "id": str(ObjectId()),
        "template": {
            "name": "React Web App with Supabase",
            "version": "1.0.0",
            "description": "A web application template using React for frontend and Supabase for authentication and database",
            "projectDefaults": {
                "name": "",
                "description": "",
                "businessGoals": [],
                "targetUsers": []
            },
            "techStack": {
                "frontend": {
                    "framework": "React",
                    "language": "TypeScript",
                    "stateManagement": "React Context API",
                    "uiLibrary": "Tailwind CSS",
                    "formHandling": "React Hook Form",
                    "routing": "React Router",
                    "options": ["Redux", "MUI", "Styled Components"]
                },
                "backend": {
                    "type": "Serverless",
                    "provider": "Supabase",
                    "options": ["Firebase", "Custom Express", "NestJS"]
                },
                "database": {
                    "type": "PostgreSQL",
                    "provider": "Supabase",
                    "options": ["Firestore", "MongoDB Atlas", "MySQL"]
                },
                "authentication": {
                    "provider": "Supabase Auth",
                    "methods": ["Email/Password", "Google", "GitHub"],
                    "options": ["Firebase Auth", "Auth0", "Custom JWT"]
                },
                "hosting": {
                    "frontend": "Vercel",
                    "backend": "Supabase",
                    "options": ["Netlify", "AWS Amplify", "Digital Ocean"]
                }
            },
            "features": {
                "coreModules": [
                    {
                        "name": "Authentication",
                        "description": "User registration, login, password reset, profile management",
                        "enabled": True
                    },
                    {
                        "name": "User Management",
                        "description": "User roles, permissions, and account administration",
                        "enabled": True
                    },
                    {
                        "name": "Data Management",
                        "description": "CRUD operations for application data",
                        "enabled": True
                    },
                    {
                        "name": "Notifications",
                        "description": "In-app notifications and email alerts",
                        "enabled": False,
                        "optional": True
                    },
                    {
                        "name": "Reports & Analytics",
                        "description": "Data visualization and reporting capabilities",
                        "enabled": False,
                        "optional": True
                    },
                    {
                        "name": "Payment Processing",
                        "description": "Integration with payment gateways",
                        "enabled": False,
                        "optional": True,
                        "providers": ["Stripe", "PayPal"]
                    }
                ]
            },
            "pages": {
                "public": [
                    {
                        "name": "Landing",
                        "path": "/",
                        "components": ["Hero", "Features", "Pricing", "Footer"],
                        "enabled": True
                    },
                    {
                        "name": "Login",
                        "path": "/login",
                        "components": ["LoginForm", "SocialLogin"],
                        "enabled": True
                    },
                    {
                        "name": "Register",
                        "path": "/register",
                        "components": ["RegistrationForm", "SocialLogin"],
                        "enabled": True
                    },
                    {
                        "name": "ForgotPassword",
                        "path": "/forgot-password",
                        "components": ["PasswordResetForm"],
                        "enabled": True
                    }
                ],
                "authenticated": [
                    {
                        "name": "Dashboard",
                        "path": "/dashboard",
                        "components": ["Summary", "RecentActivity", "QuickActions"],
                        "enabled": True
                    },
                    {
                        "name": "Profile",
                        "path": "/profile",
                        "components": ["UserInfo", "ProfileForm", "SecuritySettings"],
                        "enabled": True
                    },
                    {
                        "name": "Settings",
                        "path": "/settings",
                        "components": ["AppSettings", "Preferences", "Notifications"],
                        "enabled": True
                    }
                ],
                "admin": [
                    {
                        "name": "AdminDashboard",
                        "path": "/admin",
                        "components": ["Stats", "UserManagement", "ContentManagement"],
                        "enabled": True
                    },
                    {
                        "name": "UserManagement",
                        "path": "/admin/users",
                        "components": ["UserTable", "UserDetails", "UserEdit"],
                        "enabled": True
                    },
                    {
                        "name": "SystemSettings",
                        "path": "/admin/settings",
                        "components": ["GlobalSettings", "SecurityControls"],
                        "enabled": True
                    }
                ]
            },
            "dataModel": {
                "entities": [
                    {
                        "name": "User",
                        "description": "Application user information",
                        "fields": [
                            {
                                "name": "id",
                                "type": "uuid",
                                "primaryKey": True,
                                "generated": True
                            },
                            {
                                "name": "email",
                                "type": "string",
                                "unique": True,
                                "required": True
                            },
                            {
                                "name": "full_name",
                                "type": "string"
                            },
                            {
                                "name": "avatar_url",
                                "type": "string"
                            },
                            {
                                "name": "role",
                                "type": "string",
                                "enum": ["user", "admin"],
                                "default": "user"
                            },
                            {
                                "name": "created_at",
                                "type": "timestamp",
                                "default": "now()"
                            },
                            {
                                "name": "updated_at",
                                "type": "timestamp",
                                "default": "now()"
                            }
                        ]
                    },
                    {
                        "name": "Profile",
                        "description": "Extended user profile information",
                        "fields": [
                            {
                                "name": "id",
                                "type": "uuid",
                                "primaryKey": True,
                                "generated": True
                            },
                            {
                                "name": "user_id",
                                "type": "uuid",
                                "foreignKey": {
                                    "table": "User",
                                    "field": "id",
                                    "onDelete": "CASCADE"
                                }
                            },
                            {
                                "name": "bio",
                                "type": "text"
                            },
                            {
                                "name": "preferences",
                                "type": "jsonb"
                            },
                            {
                                "name": "created_at",
                                "type": "timestamp",
                                "default": "now()"
                            },
                            {
                                "name": "updated_at",
                                "type": "timestamp",
                                "default": "now()"
                            }
                        ]
                    },
                    {
                        "name": "Item",
                        "description": "Generic data item (customize based on app needs)",
                        "fields": [
                            {
                                "name": "id",
                                "type": "uuid",
                                "primaryKey": True,
                                "generated": True
                            },
                            {
                                "name": "user_id",
                                "type": "uuid",
                                "foreignKey": {
                                    "table": "User",
                                    "field": "id",
                                    "onDelete": "CASCADE"
                                }
                            },
                            {
                                "name": "title",
                                "type": "string",
                                "required": True
                            },
                            {
                                "name": "description",
                                "type": "text"
                            },
                            {
                                "name": "amount",
                                "type": "decimal",
                                "default": 0
                            },
                            {
                                "name": "date",
                                "type": "date",
                                "default": "now()"
                            },
                            {
                                "name": "category",
                                "type": "string"
                            },
                            {
                                "name": "status",
                                "type": "string",
                                "enum": ["active", "archived", "deleted"],
                                "default": "active"
                            },
                            {
                                "name": "metadata",
                                "type": "jsonb"
                            },
                            {
                                "name": "created_at",
                                "type": "timestamp",
                                "default": "now()"
                            },
                            {
                                "name": "updated_at",
                                "type": "timestamp",
                                "default": "now()"
                            }
                        ]
                    }
                ],
                "relationships": [
                    {
                        "type": "oneToOne",
                        "from": "User",
                        "to": "Profile",
                        "field": "user_id"
                    },
                    {
                        "type": "oneToMany",
                        "from": "User",
                        "to": "Item",
                        "field": "user_id"
                    }
                ]
            },
            "api": {
                "endpoints": [
                    {
                        "path": "/api/auth",
                        "description": "Authentication endpoints (handled by Supabase)",
                        "methods": ["POST", "GET"],
                        "auth": False
                    },
                    {
                        "path": "/api/users",
                        "description": "User management",
                        "methods": ["GET", "POST", "PUT", "DELETE"],
                        "auth": True,
                        "roles": ["admin"]
                    },
                    {
                        "path": "/api/users/me",
                        "description": "Current user profile",
                        "methods": ["GET", "PUT"],
                        "auth": True
                    },
                    {
                        "path": "/api/items",
                        "description": "Item management",
                        "methods": ["GET", "POST", "PUT", "DELETE"],
                        "auth": True
                    }
                ]
            },
            "testing": {
                "unit": {
                    "framework": "Jest",
                    "coverage": 80,
                    "directories": [
                        "components",
                        "hooks",
                        "utils"
                    ]
                },
                "integration": {
                    "framework": "React Testing Library",
                    "coverage": 70,
                    "focus": [
                        "Form submissions",
                        "Authentication flows",
                        "Data fetching"
                    ]
                },
                "e2e": {
                    "framework": "Cypress",
                    "coverage": 50,
                    "scenarios": [
                        "User registration",
                        "Login and logout",
                        "Basic CRUD operations",
                        "Admin workflows"
                    ]
                }
            },
            "projectStructure": {
                "frontend": {
                    "directories": [
                        "src/components",
                        "src/hooks",
                        "src/context",
                        "src/pages",
                        "src/utils",
                        "src/api",
                        "src/styles",
                        "src/types",
                        "src/tests"
                    ],
                    "files": [
                        "src/App.tsx",
                        "src/index.tsx",
                        "src/routes.tsx",
                        "src/supabaseClient.ts",
                        "src/types/index.d.ts"
                    ]
                }
            },
            "deployment": {
                "environments": [
                    {
                        "name": "Development",
                        "url": "${PROJECT_NAME}-dev.vercel.app",
                        "variables": [
                            {
                                "name": "REACT_APP_SUPABASE_URL",
                                "value": "https://your-project.supabase.co",
                                "secret": True
                            },
                            {
                                "name": "REACT_APP_SUPABASE_ANON_KEY",
                                "value": "",
                                "secret": True
                            }
                        ]
                    },
                    {
                        "name": "Production",
                        "url": "${PROJECT_NAME}.vercel.app",
                        "variables": [
                            {
                                "name": "REACT_APP_SUPABASE_URL",
                                "value": "https://your-project.supabase.co",
                                "secret": True
                            },
                            {
                                "name": "REACT_APP_SUPABASE_ANON_KEY",
                                "value": "",
                                "secret": True
                            }
                        ]
                    }
                ],
                "cicd": {
                    "provider": "GitHub Actions",
                    "steps": [
                        "Install dependencies",
                        "Run tests",
                        "Build application",
                        "Deploy to environment"
                    ]
                }
            },
            "documentation": {
                "sections": [
                    "Overview",
                    "Architecture",
                    "Data Model",
                    "API Reference",
                    "UI Components",
                    "Authentication",
                    "Deployment",
                    "Testing"
                ],
                "diagrams": [
                    {
                        "name": "Architecture Diagram",
                        "type": "mermaid",
                        "template": "flowchart TD\n  User[User] --> Frontend[React Frontend]\n  Frontend --> Supabase[Supabase]\n  Supabase --> Auth[Authentication]\n  Supabase --> DB[PostgreSQL Database]\n  Frontend --> API[API Layer]\n  API --> DB"
                    },
                    {
                        "name": "Entity Relationship",
                        "type": "mermaid",
                        "template": "erDiagram\n  USER ||--o{ ITEM : creates\n  USER ||--|| PROFILE : has"
                    },
                    {
                        "name": "Authentication Flow",
                        "type": "mermaid",
                        "template": "sequenceDiagram\n  participant User\n  participant Frontend\n  participant SupabaseAuth\n  participant Database\n  User->>Frontend: Login with credentials\n  Frontend->>SupabaseAuth: Authenticate\n  SupabaseAuth-->>Frontend: Return JWT\n  Frontend->>Database: Access with JWT\n  Database-->>Frontend: Return data"
                    }
                ]
            }
        }
    },
    # Additional template for MERN stack
    {
        "id": str(ObjectId()),
        "template": {
            "name": "MERN Stack Web App",
            "version": "1.0.0",
            "description": "A full-stack web application template using MongoDB, Express, React, and Node.js",
            "projectDefaults": {
                "name": "",
                "description": "",
                "businessGoals": [],
                "targetUsers": []
            },
            "techStack": {
                "frontend": {
                    "framework": "React",
                    "language": "JavaScript",
                    "stateManagement": "Redux",
                    "uiLibrary": "Material UI",
                    "formHandling": "Formik",
                    "routing": "React Router",
                    "options": ["Context API", "Bootstrap", "Tailwind CSS"]
                },
                "backend": {
                    "type": "Node.js",
                    "provider": "Express.js",
                    "options": ["Fastify", "Koa", "NestJS"]
                },
                "database": {
                    "type": "MongoDB",
                    "provider": "MongoDB Atlas",
                    "options": ["PostgreSQL", "MySQL", "SQLite"]
                },
                "authentication": {
                    "provider": "JWT",
                    "methods": ["Email/Password", "Google OAuth"],
                    "options": ["Passport.js", "Auth0", "Firebase Auth"]
                },
                "hosting": {
                    "frontend": "Netlify",
                    "backend": "Heroku",
                    "options": ["Vercel", "AWS EC2", "DigitalOcean"]
                }
            },
            "features": {
                "coreModules": [
                    {
                        "name": "Authentication",
                        "description": "User registration, login, and profile management",
                        "enabled": True
                    },
                    {
                        "name": "Admin Dashboard",
                        "description": "Admin panel for managing users and content",
                        "enabled": True
                    },
                    {
                        "name": "RESTful API",
                        "description": "API endpoints for CRUD operations",
                        "enabled": True
                    },
                    {
                        "name": "File Upload",
                        "description": "Media upload and management",
                        "enabled": False,
                        "optional": True,
                        "providers": ["AWS S3", "Cloudinary"]
                    }
                ]
            },
            "pages": {
                "public": [
                    {
                        "name": "Home",
                        "path": "/",
                        "components": ["Header", "Banner", "Features", "Footer"],
                        "enabled": True
                    },
                    {
                        "name": "Login",
                        "path": "/login",
                        "components": ["LoginForm"],
                        "enabled": True
                    },
                    {
                        "name": "Register",
                        "path": "/register",
                        "components": ["RegistrationForm"],
                        "enabled": True
                    }
                ],
                "authenticated": [
                    {
                        "name": "Dashboard",
                        "path": "/dashboard",
                        "components": ["UserStats", "ActivityFeed"],
                        "enabled": True
                    },
                    {
                        "name": "Profile",
                        "path": "/profile",
                        "components": ["UserProfile", "PasswordChange"],
                        "enabled": True
                    }
                ],
                "admin": [
                    {
                        "name": "AdminDashboard",
                        "path": "/admin",
                        "components": ["AdminStats", "UserManagement"],
                        "enabled": True
                    }
                ]
            },
            "dataModel": {
                "entities": [
                    {
                        "name": "User",
                        "description": "User model",
                        "fields": [
                            {
                                "name": "_id",
                                "type": "ObjectId",
                                "primaryKey": True,
                                "generated": True
                            },
                            {
                                "name": "email",
                                "type": "String",
                                "unique": True,
                                "required": True
                            },
                            {
                                "name": "password",
                                "type": "String",
                                "required": True
                            },
                            {
                                "name": "name",
                                "type": "String",
                                "required": True
                            },
                            {
                                "name": "role",
                                "type": "String",
                                "enum": ["user", "admin"],
                                "default": "user"
                            },
                            {
                                "name": "createdAt",
                                "type": "Date",
                                "default": "Date.now"
                            }
                        ]
                    },
                    {
                        "name": "Post",
                        "description": "Blog post model",
                        "fields": [
                            {
                                "name": "_id",
                                "type": "ObjectId",
                                "primaryKey": True,
                                "generated": True
                            },
                            {
                                "name": "title",
                                "type": "String",
                                "required": True
                            },
                            {
                                "name": "content",
                                "type": "String",
                                "required": True
                            },
                            {
                                "name": "author",
                                "type": "ObjectId",
                                "required": True,
                                "foreignKey": {
                                    "table": "User",
                                    "field": "_id",
                                    "onDelete": "CASCADE"
                                }
                            },
                            {
                                "name": "createdAt",
                                "type": "Date",
                                "default": "Date.now"
                            }
                        ]
                    }
                ],
                "relationships": [
                    {
                        "type": "oneToMany",
                        "from": "User",
                        "to": "Post",
                        "field": "author"
                    }
                ]
            },
            "api": {
                "endpoints": [
                    {
                        "path": "/api/auth",
                        "description": "Authentication endpoints",
                        "methods": ["POST"],
                        "auth": False
                    },
                    {
                        "path": "/api/users",
                        "description": "User management",
                        "methods": ["GET", "POST", "PUT", "DELETE"],
                        "auth": True,
                        "roles": ["admin"]
                    },
                    {
                        "path": "/api/posts",
                        "description": "Post management",
                        "methods": ["GET", "POST", "PUT", "DELETE"],
                        "auth": True
                    }
                ]
            },
            "testing": {
                "unit": {
                    "framework": "Jest",
                    "coverage": 70,
                    "directories": [
                        "components",
                        "reducers",
                        "utils"
                    ]
                },
                "integration": {
                    "framework": "Supertest",
                    "coverage": 60,
                    "focus": [
                        "API endpoints",
                        "Authentication flows"
                    ]
                },
                "e2e": {
                    "framework": "Cypress",
                    "coverage": 40,
                    "scenarios": [
                        "User signup",
                        "Login flow",
                        "Post creation"
                    ]
                }
            },
            "projectStructure": {
                "frontend": {
                    "directories": [
                        "src/components",
                        "src/pages",
                        "src/redux",
                        "src/api",
                        "src/utils",
                        "src/assets"
                    ],
                    "files": [
                        "src/App.js",
                        "src/index.js",
                        "src/routes.js",
                        "src/store.js"
                    ]
                }
            },
            "deployment": {
                "environments": [
                    {
                        "name": "Development",
                        "url": "dev-${PROJECT_NAME}.netlify.app",
                        "variables": [
                            {
                                "name": "REACT_APP_API_URL",
                                "value": "https://dev-api-${PROJECT_NAME}.herokuapp.com",
                                "secret": False
                            },
                            {
                                "name": "MONGODB_URI",
                                "value": "",
                                "secret": True
                            }
                        ]
                    },
                    {
                        "name": "Production",
                        "url": "${PROJECT_NAME}.netlify.app",
                        "variables": [
                            {
                                "name": "REACT_APP_API_URL",
                                "value": "https://api-${PROJECT_NAME}.herokuapp.com",
                                "secret": False
                            },
                            {
                                "name": "MONGODB_URI",
                                "value": "",
                                "secret": True
                            }
                        ]
                    }
                ],
                "cicd": {
                    "provider": "GitHub Actions",
                    "steps": [
                        "Install dependencies",
                        "Lint code",
                        "Run tests",
                        "Build frontend",
                        "Deploy to environment"
                    ]
                }
            },
            "documentation": {
                "sections": [
                    "Overview",
                    "Getting Started",
                    "API Reference",
                    "Components",
                    "Deployment Process"
                ],
                "diagrams": [
                    {
                        "name": "MERN Architecture",
                        "type": "mermaid",
                        "template": "flowchart LR\n  Client[React Client] --> API[Express API]\n  API --> DB[MongoDB]\n  API --> Auth[JWT Auth]"
                    }
                ]
            }
        }
    }
]

async def seed_templates(db):
    """
    Seed project templates into the database.
    
    Args:
        db: Database instance
    """
    try:
        # Check if templates collection exists and has data
        templates_collection = db.get_collection("templates")
        count = await templates_collection.count_documents({})
        
        if count == 0:
            logger.info("Seeding project templates...")
            
            # Insert templates
            result = await templates_collection.insert_many(PROJECT_TEMPLATES)
            logger.info(f"Inserted {len(result.inserted_ids)} project templates")
        else:
            logger.info(f"Found {count} existing project templates, skipping seed")
    
    except Exception as e:
        logger.error(f"Error seeding project templates: {str(e)}")

def get_templates() -> List[Dict]:
    """
    Get all project templates.
    
    Returns:
        List of project templates
    """
    return PROJECT_TEMPLATES

def get_template_by_id(template_id: str) -> Dict:
    """
    Get a project template by ID.
    
    Args:
        template_id: Template ID
        
    Returns:
        Project template or None if not found
    """
    for template in PROJECT_TEMPLATES:
        if template["id"] == template_id:
            return template
    return None 