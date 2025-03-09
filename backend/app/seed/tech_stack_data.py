'''
This is a comprehensive tech stack data structure with bidirectional compatibility. The new structure has several key advantages:

1. **Complete Technology Mapping**: Includes all technologies from the original dataset organized by type and relationship.

2. **Bidirectional References**: All technologies reference their compatible counterparts, making it possible to query relationships from either direction.

3. **Hierarchical Navigation**: The top-level `categories` object preserves the original hierarchical organization for easy navigation.

4. **Rich Compatibility Data**: Each technology entry contains detailed compatibility information with other components in the stack.

5. **Single Source of Truth**: Each technology is defined once with all its compatibility information in one place.

This structure allows you to build a dynamic tech selector that can:

1. Start with any component (e.g., React, PostgreSQL, Redux)
2. Instantly identify all compatible technologies
3. Filter options in other categories based on selected technologies
4. Maintain consistency regardless of selection order

For example, if a user selects React first, you can filter state management to show only Redux, MobX, etc. Conversely, if they select Redux first, you can show React as the compatible framework.

You can implement this with relatively simple queries:

```javascript
// If user selects React
const reactCompatibleStateManagement = TECH_STACK_DATA.technologies.frameworks["React"].compatibleWith.stateManagement;

// If user selects Redux
const reduxCompatibleFrameworks = TECH_STACK_DATA.technologies.stateManagement["Redux"].compatibleWith;

// Finding all compatible databases for Express.js
const expressCompatibleDatabases = TECH_STACK_DATA.technologies.frameworks["Express.js"].compatibleWith.databases;
```

This structure also makes it easy to add new technologies or update compatibility information as the tech landscape evolves.
'''
TECH_STACK_DATA = {
  # Original categories maintained for hierarchical navigation
  "categories": {
    "frontend": {
      "frameworks": [
        "React",
        "Vue.js",
        "Angular",
        "Svelte",
        "Next.js"
      ]
    },
    "backend": {
      "frameworks": [
        "Express.js",
        "NestJS",
        "Django",
        "Flask",
        "Spring Boot",
        "Laravel",
        "ASP.NET Core"
      ],
      "baas": [
        "Supabase",
        "Firebase",
        "AWS Amplify",
        "Appwrite"
      ]
    },
    "database": {
      "sql": [
        "PostgreSQL",
        "MySQL", 
        "SQLite",
        "SQL Server"
      ],
      "nosql": [
        "MongoDB",
        "Firestore",
        "DynamoDB",
        "Redis"
      ]
    },
    "authentication": {
      "providers": [
        "JWT",
        "Passport.js",
        "Auth0",
        "OAuth2",
        "OIDC",
        "Django Auth",
        "Flask-Login",
        "Spring Security",
        "Laravel Breeze",
        "Laravel Sanctum",
        "Laravel Passport",
        "ASP.NET Identity",
        "Supabase Auth",
        "Firebase Auth",
        "Amazon Cognito",
        "Appwrite Auth"
      ]
    },
    "hosting": {
      "frontend": [
        "Vercel",
        "Netlify",
        "AWS Amplify",
        "Azure App Service",
        "Self-hosted"
      ],
      "backend": [
        "Self-hosted",
        "AWS Lambda",
        "Azure Functions",
        "Google Cloud Functions",
        "Heroku",
        "Railway",
        "Render"
      ],
      "database": [
        "Self-hosted",
        "AWS RDS",
        "Azure SQL",
        "Google Cloud SQL",
        "PlanetScale",
        "Neon",
        "Railway",
        "Render",
        "Heroku",
        "MongoDB Atlas",
        "Firebase",
        "AWS",
        "Redis Labs",
        "AWS ElastiCache",
        "Upstash"
      ]
    }
  },
  
  # Detailed technologies with bidirectional compatibility information
  "technologies": {
    # Frontend Frameworks
    "frameworks": {
      "React": {
        "type": "frontend",
        "description": "A JavaScript library for building user interfaces",
        "compatibleWith": {
          "stateManagement": ["Redux", "MobX", "Zustand", "Recoil", "Context API"],
          "uiLibraries": ["Material UI", "Chakra UI", "Ant Design", "Tailwind CSS", "Bootstrap"],
          "formHandling": ["React Hook Form", "Formik"],
          "routing": ["React Router"],
          "apiClients": ["Axios", "TanStack Query", "SWR", "Apollo Client", "urql"],
          "metaFrameworks": ["Next.js", "Remix", "Gatsby"],
          "hosting": ["Vercel", "Netlify", "AWS Amplify", "Azure App Service", "Self-hosted"]
        }
      },
      "Vue.js": {
        "type": "frontend",
        "description": "The Progressive JavaScript Framework",
        "compatibleWith": {
          "stateManagement": ["Pinia", "Vuex"],
          "uiLibraries": ["Vuetify", "PrimeVue", "Quasar", "Tailwind CSS", "Bootstrap"],
          "formHandling": ["VeeValidate", "FormKit"],
          "routing": ["Vue Router"],
          "apiClients": ["Axios", "Apollo Client", "Vue Query"],
          "metaFrameworks": ["Nuxt.js", "Vite"],
          "hosting": ["Vercel", "Netlify", "AWS Amplify", "Azure App Service", "Self-hosted"]
        }
      },
      "Angular": {
        "type": "frontend",
        "description": "Platform for building mobile and desktop web applications",
        "compatibleWith": {
          "stateManagement": ["NgRx", "Akita", "NGXS"],
          "uiLibraries": ["Angular Material", "PrimeNG", "NG Bootstrap", "Tailwind CSS"],
          "formHandling": ["Angular Forms", "NgxFormly"],
          "routing": ["Angular Router"],
          "apiClients": ["Axios", "Angular HttpClient", "Apollo Angular"],
          "metaFrameworks": [],
          "hosting": ["Vercel", "Netlify", "AWS Amplify", "Azure App Service", "Self-hosted"]
        }
      },
      "Svelte": {
        "type": "frontend",
        "description": "Cybernetically enhanced web apps",
        "compatibleWith": {
          "stateManagement": ["Svelte Store"],
          "uiLibraries": ["Svelte Material UI", "Tailwind CSS", "Bootstrap"],
          "formHandling": ["Svelte Forms", "Felte"],
          "routing": ["SvelteKit Routing", "Svelte Navigator"],
          "apiClients": ["Axios", "SvelteQuery"],
          "metaFrameworks": ["SvelteKit"],
          "hosting": ["Vercel", "Netlify", "AWS Amplify", "Azure App Service", "Self-hosted"]
        }
      },
      "Next.js": {
        "type": "frontend",
        "description": "The React Framework for Production",
        "compatibleWith": {
          "stateManagement": ["Redux", "MobX", "Zustand", "Recoil", "Context API"],
          "uiLibraries": ["Material UI", "Chakra UI", "Ant Design", "Tailwind CSS", "Bootstrap"],
          "formHandling": ["React Hook Form", "Formik"],
          "routing": ["Next.js Routing"],
          "apiClients": ["Axios", "TanStack Query", "SWR", "Apollo Client", "urql"],
          "metaFrameworks": [],
          "hosting": ["Vercel", "Netlify", "AWS Amplify", "Azure App Service", "Self-hosted"]
        }
      },
      # Backend Frameworks
      "Express.js": {
        "type": "backend",
        "description": "Fast, unopinionated, minimalist web framework for Node.js",
        "language": "JavaScript/TypeScript",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis", "SQL Server"],
          "orms": ["Prisma", "TypeORM", "Sequelize", "Mongoose", "Drizzle"],
          "auth": ["JWT", "Passport.js", "Auth0", "OAuth2"],
          "hosting": ["Self-hosted", "AWS Lambda", "Azure Functions", "Google Cloud Functions", "Heroku", "Railway", "Render"]
        }
      },
      "NestJS": {
        "type": "backend",
        "description": "A progressive Node.js framework for building efficient and scalable server-side applications",
        "language": "TypeScript",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis", "SQL Server"],
          "orms": ["Prisma", "TypeORM", "Sequelize", "Mongoose"],
          "auth": ["JWT", "Passport.js", "Auth0", "OAuth2"],
          "hosting": ["Self-hosted", "AWS Lambda", "Azure Functions", "Google Cloud Functions", "Heroku", "Railway", "Render"]
        }
      },
      "Django": {
        "type": "backend",
        "description": "The web framework for perfectionists with deadlines",
        "language": "Python",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "SQLite", "Oracle", "SQL Server"],
          "orms": ["Django ORM"],
          "auth": ["Django Auth", "JWT", "OAuth2", "Auth0"],
          "hosting": ["Self-hosted", "AWS Lambda", "Azure Functions", "Google Cloud Functions", "Heroku", "Railway", "Render"]
        }
      },
      "Flask": {
        "type": "backend",
        "description": "Python Micro web framework",
        "language": "Python",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "SQL Server"],
          "orms": ["SQLAlchemy", "MongoDB PyMongo"],
          "auth": ["Flask-Login", "JWT", "OAuth2", "Auth0"],
          "hosting": ["Self-hosted", "AWS Lambda", "Azure Functions", "Google Cloud Functions", "Heroku", "Railway", "Render"]
        }
      },
      "Spring Boot": {
        "type": "backend",
        "description": "Java-based framework for creating stand-alone, production-grade applications",
        "language": "Java",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "Oracle", "MongoDB", "Redis", "SQL Server"],
          "orms": ["Hibernate", "Spring Data JPA"],
          "auth": ["Spring Security", "JWT", "OAuth2", "OIDC"],
          "hosting": ["Self-hosted", "AWS Lambda", "Azure Functions", "Google Cloud Functions", "Heroku", "Railway", "Render"]
        }
      },
      "Laravel": {
        "type": "backend",
        "description": "PHP Framework for Web Artisans",
        "language": "PHP",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "SQLite", "SQL Server"],
          "orms": ["Eloquent ORM"],
          "auth": ["Laravel Breeze", "Laravel Sanctum", "Laravel Passport"],
          "hosting": ["Self-hosted", "Heroku", "Railway", "Render"]
        }
      },
      "ASP.NET Core": {
        "type": "backend",
        "description": "Cross-platform, high-performance framework for building modern cloud-based applications",
        "language": "C#",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "SQL Server", "SQLite", "MongoDB"],
          "orms": ["Entity Framework Core", "Dapper"],
          "auth": ["ASP.NET Identity", "JWT", "OAuth2", "OIDC"],
          "hosting": ["Self-hosted", "Azure Functions", "AWS Lambda", "Google Cloud Functions", "Heroku", "Railway", "Render"]
        }
      }
    },
    
    # Backend as a Service (BaaS)
    "baas": {
      "Supabase": {
        "type": "backend",
        "description": "Open source Firebase alternative with PostgreSQL",
        "compatibleWith": {
          "databases": ["PostgreSQL"],
          "auth": ["Supabase Auth"],
          "storage": ["Supabase Storage"],
          "functions": ["Edge Functions"],
          "frontendFrameworks": ["React", "Vue.js", "Angular", "Svelte", "Next.js"]
        }
      },
      "Firebase": {
        "type": "backend",
        "description": "Google's platform for app development",
        "compatibleWith": {
          "databases": ["Firestore", "Realtime Database"],
          "auth": ["Firebase Auth"],
          "storage": ["Firebase Storage"],
          "functions": ["Cloud Functions"],
          "frontendFrameworks": ["React", "Vue.js", "Angular", "Svelte", "Next.js"]
        }
      },
      "AWS Amplify": {
        "type": "backend",
        "description": "Build full-stack web and mobile apps on AWS",
        "compatibleWith": {
          "databases": ["DynamoDB", "Aurora", "RDS"],
          "auth": ["Amazon Cognito"],
          "storage": ["Amazon S3"],
          "functions": ["AWS Lambda"],
          "frontendFrameworks": ["React", "Vue.js", "Angular", "Next.js"]
        }
      },
      "Appwrite": {
        "type": "backend",
        "description": "Open source backend server for web, mobile, and Flutter developers",
        "compatibleWith": {
          "databases": ["MariaDB (internal)"],
          "auth": ["Appwrite Auth"],
          "storage": ["Appwrite Storage"],
          "functions": ["Appwrite Functions"],
          "frontendFrameworks": ["React", "Vue.js", "Angular", "Svelte", "Next.js"]
        }
      }
    },
    
    # State Management Libraries
    "stateManagement": {
      "Redux": {
        "description": "A Predictable State Container for JS Apps",
        "compatibleWith": ["React", "Next.js"]
      },
      "MobX": {
        "description": "Simple, scalable state management",
        "compatibleWith": ["React", "Next.js"]
      },
      "Zustand": {
        "description": "Small, fast and scalable state-management solution",
        "compatibleWith": ["React", "Next.js"]
      },
      "Recoil": {
        "description": "A state management library for React",
        "compatibleWith": ["React", "Next.js"]
      },
      "Context API": {
        "description": "React's built-in state management",
        "compatibleWith": ["React", "Next.js"]
      },
      "Pinia": {
        "description": "Intuitive, type safe, light and flexible Store for Vue",
        "compatibleWith": ["Vue.js"]
      },
      "Vuex": {
        "description": "State management pattern + library for Vue.js applications",
        "compatibleWith": ["Vue.js"]
      },
      "NgRx": {
        "description": "Reactive State for Angular",
        "compatibleWith": ["Angular"]
      },
      "Akita": {
        "description": "State Management Tailored-Made for JS Applications",
        "compatibleWith": ["Angular"]
      },
      "NGXS": {
        "description": "State management pattern + library for Angular",
        "compatibleWith": ["Angular"]
      },
      "Svelte Store": {
        "description": "Built-in reactive stores for Svelte",
        "compatibleWith": ["Svelte"]
      }
    },
    
    # UI Libraries
    "uiLibraries": {
      "Material UI": {
        "description": "React components for faster and easier web development",
        "compatibleWith": ["React", "Next.js"]
      },
      "Chakra UI": {
        "description": "Simple, modular and accessible component library for React",
        "compatibleWith": ["React", "Next.js"]
      },
      "Ant Design": {
        "description": "A design system for enterprise-level products",
        "compatibleWith": ["React", "Next.js"]
      },
      "Tailwind CSS": {
        "description": "A utility-first CSS framework",
        "compatibleWith": ["React", "Vue.js", "Angular", "Svelte", "Next.js"]
      },
      "Bootstrap": {
        "description": "The world's most popular framework for building responsive sites",
        "compatibleWith": ["React", "Vue.js", "Svelte"]
      },
      "Vuetify": {
        "description": "Material Design component framework for Vue",
        "compatibleWith": ["Vue.js"]
      },
      "PrimeVue": {
        "description": "UI component library for Vue",
        "compatibleWith": ["Vue.js"]
      },
      "Quasar": {
        "description": "Build high-performance VueJS user interfaces",
        "compatibleWith": ["Vue.js"]
      },
      "Angular Material": {
        "description": "UI component infrastructure and Material Design components for Angular",
        "compatibleWith": ["Angular"]
      },
      "PrimeNG": {
        "description": "UI component library for Angular",
        "compatibleWith": ["Angular"]
      },
      "NG Bootstrap": {
        "description": "Angular widgets built from the ground up using Bootstrap CSS",
        "compatibleWith": ["Angular"]
      },
      "Svelte Material UI": {
        "description": "Material UI components for Svelte",
        "compatibleWith": ["Svelte"]
      }
    },
    
    # Form Handling Libraries
    "formHandling": {
      "React Hook Form": {
        "description": "Performant, flexible and extensible forms with easy-to-use validation",
        "compatibleWith": ["React", "Next.js"]
      },
      "Formik": {
        "description": "Build forms in React, without the tears",
        "compatibleWith": ["React", "Next.js"]
      },
      "VeeValidate": {
        "description": "Form validation for Vue.js",
        "compatibleWith": ["Vue.js"]
      },
      "FormKit": {
        "description": "The form framework for Vue developers",
        "compatibleWith": ["Vue.js"]
      },
      "Angular Forms": {
        "description": "Angular's built-in forms module",
        "compatibleWith": ["Angular"]
      },
      "NgxFormly": {
        "description": "Dynamic form library for Angular",
        "compatibleWith": ["Angular"]
      },
      "Svelte Forms": {
        "description": "Form handling for Svelte",
        "compatibleWith": ["Svelte"]
      },
      "Felte": {
        "description": "An extensible form library for Svelte",
        "compatibleWith": ["Svelte"]
      }
    },
    
    # Routing Solutions
    "routing": {
      "React Router": {
        "description": "Declarative routing for React",
        "compatibleWith": ["React"]
      },
      "Next.js Routing": {
        "description": "File-system based routing built into Next.js",
        "compatibleWith": ["Next.js"]
      },
      "Vue Router": {
        "description": "The official router for Vue.js",
        "compatibleWith": ["Vue.js"]
      },
      "Angular Router": {
        "description": "Angular's built-in routing module",
        "compatibleWith": ["Angular"]
      },
      "SvelteKit Routing": {
        "description": "File-system based routing for SvelteKit",
        "compatibleWith": ["Svelte"]
      },
      "Svelte Navigator": {
        "description": "Routing library for Svelte",
        "compatibleWith": ["Svelte"]
      }
    },
    
    # API Clients
    "apiClients": {
      "Axios": {
        "description": "Promise based HTTP client for the browser and node.js",
        "compatibleWith": ["React", "Vue.js", "Angular", "Svelte", "Next.js"]
      },
      "TanStack Query": {
        "description": "Powerful asynchronous state management for TS/JS",
        "compatibleWith": ["React", "Next.js"]
      },
      "SWR": {
        "description": "React Hooks for data fetching",
        "compatibleWith": ["React", "Next.js"]
      },
      "Apollo Client": {
        "description": "Comprehensive state management library for GraphQL",
        "compatibleWith": ["React", "Vue.js", "Angular", "Next.js"]
      },
      "urql": {
        "description": "Highly customizable and versatile GraphQL client",
        "compatibleWith": ["React", "Next.js"]
      },
      "Vue Query": {
        "description": "TanStack Query for Vue",
        "compatibleWith": ["Vue.js"]
      },
      "Angular HttpClient": {
        "description": "Angular's built-in HTTP client",
        "compatibleWith": ["Angular"]
      },
      "Apollo Angular": {
        "description": "Angular integration for Apollo Client",
        "compatibleWith": ["Angular"]
      },
      "SvelteQuery": {
        "description": "TanStack Query for Svelte",
        "compatibleWith": ["Svelte"]
      }
    },
    
    # Meta Frameworks
    "metaFrameworks": {
      "Next.js": {
        "description": "The React Framework for Production",
        "compatibleWith": ["React"]
      },
      "Remix": {
        "description": "Full stack web framework for React",
        "compatibleWith": ["React"]
      },
      "Gatsby": {
        "description": "React framework for building static sites",
        "compatibleWith": ["React"]
      },
      "Nuxt.js": {
        "description": "The intuitive Vue framework",
        "compatibleWith": ["Vue.js"]
      },
      "Vite": {
        "description": "Next generation frontend tooling",
        "compatibleWith": ["Vue.js"]
      },
      "SvelteKit": {
        "description": "Web development, streamlined",
        "compatibleWith": ["Svelte"]
      }
    },
    
    # Database Systems
    "databases": {
      # SQL Databases
      "PostgreSQL": {
        "type": "sql",
        "description": "Powerful, open source object-relational database system",
        "compatibleWith": {
          "hosting": ["Self-hosted", "Supabase", "AWS RDS", "Neon", "Railway", "Render", "Heroku"],
          "orms": ["Prisma", "TypeORM", "Sequelize", "Django ORM", "SQLAlchemy", "Hibernate", "Entity Framework Core"],
          "frameworks": ["Express.js", "NestJS", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET Core"],
          "baas": ["Supabase"]
        }
      },
      "MySQL": {
        "type": "sql",
        "description": "Open-source relational database management system",
        "compatibleWith": {
          "hosting": ["Self-hosted", "AWS RDS", "PlanetScale", "Railway", "Managed Instance"],
          "orms": ["Prisma", "TypeORM", "Sequelize", "Django ORM", "SQLAlchemy", "Hibernate", "Entity Framework Core"],
          "frameworks": ["Express.js", "NestJS", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET Core"]
        }
      },
      "SQLite": {
        "type": "sql",
        "description": "Self-contained, serverless SQL database engine",
        "compatibleWith": {
          "hosting": ["Local file", "Embedded"],
          "orms": ["Prisma", "TypeORM", "Sequelize", "Django ORM", "SQLAlchemy", "Entity Framework Core"],
          "frameworks": ["Express.js", "NestJS", "Django", "Flask", "Laravel", "ASP.NET Core"]
        }
      },
      "SQL Server": {
        "type": "sql",
        "description": "Microsoft's relational database management system",
        "compatibleWith": {
          "hosting": ["Self-hosted", "AWS RDS", "Azure SQL", "Managed Instance"],
          "orms": ["Prisma", "TypeORM", "Sequelize", "Django ORM", "SQLAlchemy", "Entity Framework Core"],
          "frameworks": ["Express.js", "NestJS", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET Core"]
        }
      },
      "Oracle": {
        "type": "sql",
        "description": "Enterprise database management system",
        "compatibleWith": {
          "hosting": ["Self-hosted", "Oracle Cloud"],
          "orms": ["Hibernate", "Spring Data JPA", "Django ORM"],
          "frameworks": ["Django", "Spring Boot"]
        }
      },
      
      # NoSQL Databases
      "MongoDB": {
        "type": "nosql",
        "description": "Document-based distributed database",
        "compatibleWith": {
          "hosting": ["Self-hosted", "MongoDB Atlas", "Railway", "Managed Instance"],
          "orms": ["Mongoose", "MongoDB Node.js Driver", "PyMongo", "Spring Data MongoDB"],
          "frameworks": ["Express.js", "NestJS", "Flask", "Spring Boot", "ASP.NET Core"]
        }
      },
      "Firestore": {
        "type": "nosql",
        "description": "Cloud-hosted NoSQL database from Firebase",
        "compatibleWith": {
          "hosting": ["Firebase"],
          "orms": ["Firebase"],
          "baas": ["Firebase"]
        }
      },
      "DynamoDB": {
        "type": "nosql",
        "description": "Fast and flexible NoSQL database service by AWS",
        "compatibleWith": {
          "hosting": ["AWS"],
          "orms": ["AWS SDK", "Dynamoose"],
          "baas": ["AWS Amplify"]
        }
      },
      "Redis": {
        "type": "nosql",
        "description": "In-memory data structure store",
        "compatibleWith": {
          "hosting": ["Self-hosted", "Redis Labs", "AWS ElastiCache", "Upstash"],
          "orms": ["Redis Node.js client", "ioredis"],
          "frameworks": ["Express.js", "NestJS", "Spring Boot"]
        }
      },
      "Realtime Database": {
        "type": "nosql",
        "description": "Cloud-hosted NoSQL database from Firebase",
        "compatibleWith": {
          "hosting": ["Firebase"],
          "orms": ["Firebase"],
          "baas": ["Firebase"]
        }
      },
      "MariaDB": {
        "type": "sql",
        "description": "Community-developed fork of MySQL",
        "compatibleWith": {
          "hosting": ["Self-hosted", "Managed Instance"],
          "baas": ["Appwrite"]
        }
      }
    },
    
    # ORM Systems
    "orms": {
      "Prisma": {
        "description": "Next-generation Node.js and TypeScript ORM",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "SQLite", "SQL Server", "MongoDB"],
          "frameworks": ["Express.js", "NestJS"]
        }
      },
      "TypeORM": {
        "description": "ORM for TypeScript and JavaScript",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "SQLite", "SQL Server"],
          "frameworks": ["Express.js", "NestJS"]
        }
      },
      "Sequelize": {
        "description": "Promise-based Node.js ORM",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "SQLite", "SQL Server"],
          "frameworks": ["Express.js", "NestJS"]
        }
      },
      "Mongoose": {
        "description": "MongoDB object modeling for Node.js",
        "compatibleWith": {
          "databases": ["MongoDB"],
          "frameworks": ["Express.js", "NestJS"]
        }
      },
      "Drizzle": {
        "description": "Lightweight TypeScript ORM",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "SQLite"],
          "frameworks": ["Express.js"]
        }
      },
      "Django ORM": {
        "description": "Django's built-in ORM",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "SQLite", "Oracle", "SQL Server"],
          "frameworks": ["Django"]
        }
      },
      "SQLAlchemy": {
        "description": "Python SQL toolkit and ORM",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "SQLite", "SQL Server"],
          "frameworks": ["Flask"]
        }
      },
      "MongoDB PyMongo": {
        "description": "Python driver for MongoDB",
        "compatibleWith": {
          "databases": ["MongoDB"],
          "frameworks": ["Flask"]
        }
      },
      "Hibernate": {
        "description": "ORM for Java",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "Oracle", "SQL Server"],
          "frameworks": ["Spring Boot"]
        }
      },
      "Spring Data JPA": {
        "description": "JPA based repositories for Spring",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "Oracle", "SQL Server"],
          "frameworks": ["Spring Boot"]
        }
      },
      "Eloquent ORM": {
        "description": "Laravel's built-in ORM",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "SQLite", "SQL Server"],
          "frameworks": ["Laravel"]
        }
      },
      "Entity Framework Core": {
        "description": "Modern ORM for .NET",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "SQL Server", "SQLite"],
          "frameworks": ["ASP.NET Core"]
        }
      },
      "Dapper": {
        "description": "Simple object mapper for .NET",
        "compatibleWith": {
          "databases": ["PostgreSQL", "MySQL", "SQL Server", "SQLite"],
          "frameworks": ["ASP.NET Core"]
        }
      }
    },
    
    # Authentication Methods
    "auth": {
      "JWT": {
        "description": "JSON Web Token",
        "compatibleWith": {
          "frameworks": ["Express.js", "NestJS", "Django", "Flask", "Spring Boot", "ASP.NET Core"]
        }
      },
      "Passport.js": {
        "description": "Authentication middleware for Node.js",
        "compatibleWith": {
          "frameworks": ["Express.js", "NestJS"]
        }
      },
      "Auth0": {
        "description": "Authentication and authorization as a service",
        "compatibleWith": {
          "frameworks": ["Express.js", "NestJS", "Django", "Flask", "ASP.NET Core"]
        }
      },
      "OAuth2": {
        "description": "Industry-standard protocol for authorization",
        "compatibleWith": {
          "frameworks": ["Express.js", "NestJS", "Django", "Flask", "Spring Boot", "ASP.NET Core"]
        }
      },
      "OIDC": {
        "description": "OpenID Connect authentication protocol",
        "compatibleWith": {
          "frameworks": ["Spring Boot", "ASP.NET Core"]
        }
      },
      "Django Auth": {
        "description": "Django's built-in authentication system",
        "compatibleWith": {
          "frameworks": ["Django"]
        }
      },
      "Flask-Login": {
        "description": "User session management for Flask",
        "compatibleWith": {
          "frameworks": ["Flask"]
        }
      },
      "Spring Security": {
        "description": "Authentication and access control for Spring applications",
        "compatibleWith": {
          "frameworks": ["Spring Boot"]
        }
      },
      "Laravel Breeze": {
        "description": "Minimal authentication implementation for Laravel",
        "compatibleWith": {
          "frameworks": ["Laravel"]
        }
      },
      "Laravel Sanctum": {
        "description": "Lightweight authentication for SPAs, mobile apps, and simple APIs",
        "compatibleWith": {
          "frameworks": ["Laravel"]
        }
      },
      "Laravel Passport": {
        "description": "Full OAuth2 server implementation for Laravel",
        "compatibleWith": {
          "frameworks": ["Laravel"]
        }
      },
      "ASP.NET Identity": {
        "description": "Authentication and user management system for .NET",
        "compatibleWith": {
          "frameworks": ["ASP.NET Core"]
        }
      },
      "Supabase Auth": {
        "description": "Authentication service provided by Supabase",
        "compatibleWith": {
          "baas": ["Supabase"]
        }
      },
      "Firebase Auth": {
        "description": "Authentication service provided by Firebase",
        "compatibleWith": {
          "baas": ["Firebase"]
        }
      },
      "Amazon Cognito": {
        "description": "Authentication, authorization, and user management for web and mobile apps",
        "compatibleWith": {
          "baas": ["AWS Amplify"]
        }
      },
      "Appwrite Auth": {
        "description": "Authentication service provided by Appwrite",
        "compatibleWith": {
          "baas": ["Appwrite"]
        }
      }
    },
    
    # Hosting Services
    "hosting": {
      # Frontend Hosting
      "Vercel": {
        "type": "frontend",
        "description": "Platform for frontend frameworks and static sites",
        "compatibleWith": ["React", "Vue.js", "Angular", "Svelte", "Next.js"]
      },
      "Netlify": {
        "type": "frontend",
        "description": "Platform for modern web projects",
        "compatibleWith": ["React", "Vue.js", "Angular", "Svelte", "Next.js"]
      },
      # Backend Hosting
      "Self-hosted": {
        "type": "multiple",
        "description": "Running software on your own infrastructure",
        "compatibleWith": {
          "frontend": ["React", "Vue.js", "Angular", "Svelte", "Next.js"],
          "backend": ["Express.js", "NestJS", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET Core"],
          "database": ["PostgreSQL", "MySQL", "SQLite", "SQL Server", "MongoDB", "Redis"]
        }
      },
      "AWS Lambda": {
        "type": "backend",
        "description": "Serverless compute service",
        "compatibleWith": ["Express.js", "NestJS", "Django", "Flask", "Spring Boot", "ASP.NET Core"]
      },
      "Azure Functions": {
        "type": "backend",
        "description": "Serverless compute service from Microsoft",
        "compatibleWith": ["Express.js", "NestJS", "ASP.NET Core"]
      },
      "Google Cloud Functions": {
        "type": "backend",
        "description": "Serverless compute service from Google",
        "compatibleWith": ["Express.js", "NestJS", "Django", "Flask"]
      },
      "Heroku": {
        "type": "multiple",
        "description": "Cloud platform as a service",
        "compatibleWith": {
          "backend": ["Express.js", "NestJS", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET Core"],
          "database": ["PostgreSQL", "MySQL", "Redis"]
        }
      },
      "Railway": {
        "type": "multiple",
        "description": "Infrastructure platform to build, ship, and monitor apps",
        "compatibleWith": {
          "backend": ["Express.js", "NestJS", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET Core"],
          "database": ["PostgreSQL", "MySQL", "MongoDB"]
        }
      },
      "Render": {
        "type": "multiple",
        "description": "Unified platform to build and run all your apps",
        "compatibleWith": {
          "backend": ["Express.js", "NestJS", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET Core"],
          "database": ["PostgreSQL"]
        }
      },
      # Database Hosting
      "AWS RDS": {
        "type": "database",
        "description": "Managed relational database service",
        "compatibleWith": ["PostgreSQL", "MySQL", "SQL Server"]
      },
      "Azure SQL": {
        "type": "database",
        "description": "Managed SQL database service",
        "compatibleWith": ["SQL Server"]
      },
      "Google Cloud SQL": {
        "type": "database",
        "description": "Fully managed relational database service",
        "compatibleWith": ["PostgreSQL", "MySQL", "SQL Server"]
      },
      "PlanetScale": {
        "type": "database",
        "description": "MySQL-compatible serverless database platform",
        "compatibleWith": ["MySQL"]
      },
      "Neon": {
        "type": "database",
        "description": "Serverless Postgres",
        "compatibleWith": ["PostgreSQL"]
      },
      "MongoDB Atlas": {
        "type": "database",
        "description": "Fully-managed cloud database service",
        "compatibleWith": ["MongoDB"]
      },
      "Redis Labs": {
        "type": "database",
        "description": "Fully-managed Redis cloud service",
        "compatibleWith": ["Redis"]
      },
      "AWS ElastiCache": {
        "type": "database",
        "description": "In-memory caching service",
        "compatibleWith": ["Redis"]
      },
      "Upstash": {
        "type": "database",
        "description": "Serverless data platform",
        "compatibleWith": ["Redis"]
      }
    }
  }
};
