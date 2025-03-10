// Example 1: Supabase + React Template (BaaS-based)
const supabaseReactTemplate = {
  frontend: {
    framework: "React",
    language: "TypeScript",
    stateManagement: "Context API",
    uiLibrary: "Tailwind CSS",
    formHandling: "React Hook Form",
    routing: "React Router",
    apiClient: "Axios",
    metaFramework: null,
  },
  backend: {
    type: "baas",
    service: "Supabase",
    functions: "Edge Functions",
    realtime: "Supabase Realtime",
  },
  database: {
    type: "sql",
    system: "PostgreSQL",
    hosting: "Supabase",
    orm: null,
  },
  authentication: {
    provider: "Supabase Auth",
    methods: ["Email/Password", "Google", "GitHub"],
  },
  hosting: {
    frontend: "Vercel",
    backend: "Supabase",
    database: "Supabase",
  },
  storage: {
    type: "objectStorage",
    service: "Supabase Storage",
  },
  deployment: {
    ci_cd: "GitHub Actions",
    containerization: null,
  },
};

// Example 2: Framework-based Backend Template (Django + React)
const djangoReactTemplate = {
  frontend: {
    framework: "React",
    language: "TypeScript",
    stateManagement: "Redux",
    uiLibrary: "Material UI",
    formHandling: "Formik",
    routing: "React Router",
    apiClient: "Axios",
    metaFramework: null,
  },
  backend: {
    type: "framework",
    framework: "Django",
    language: "Python",
    realtime: "Channels",
  },
  database: {
    type: "sql",
    system: "PostgreSQL",
    hosting: "AWS RDS",
    orm: "Django ORM",
  },
  authentication: {
    provider: "Django Auth",
    methods: ["Email/Password", "OAuth2"],
  },
  hosting: {
    frontend: "Netlify",
    backend: "Heroku",
    database: "AWS RDS",
  },
  storage: {
    type: "objectStorage",
    service: "AWS S3",
  },
  deployment: {
    ci_cd: "GitHub Actions",
    containerization: "Docker",
  },
};

// Example 3: Serverless Template (AWS Serverless + React)
const serverlessReactTemplate = {
  frontend: {
    framework: "React",
    language: "TypeScript",
    stateManagement: "Redux",
    uiLibrary: "Chakra UI",
    formHandling: "React Hook Form",
    routing: "React Router",
    apiClient: "TanStack Query",
    metaFramework: null,
  },
  backend: {
    type: "serverless",
    service: "AWS Lambda",
    language: "TypeScript",
  },
  database: {
    type: "nosql",
    system: "DynamoDB",
    hosting: "AWS",
    client: null,
  },
  authentication: {
    provider: "Amazon Cognito",
    methods: ["Email/Password", "Google", "Facebook"],
  },
  hosting: {
    frontend: "AWS Amplify",
    backend: "AWS Lambda",
    database: "AWS",
  },
  storage: {
    type: "objectStorage",
    service: "AWS S3",
  },
  deployment: {
    ci_cd: "AWS CodePipeline",
    containerization: null,
  },
};
