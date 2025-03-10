import { Categories, Technologies, TechStackData, SimpleCompatibility } from '../types/techStack';

/**
 * Find all compatible technologies from one category based on a selected technology
 * 
 * @param techStackData The complete tech stack data
 * @param selectedCategory The category of the selected technology (e.g. 'frameworks', 'databases')
 * @param selectedTechnology The name of the selected technology
 * @param targetCategory The category to find compatible technologies from
 * @returns Array of compatible technology names
 */
export function getCompatibleTechnologies(
  techStackData: TechStackData,
  selectedCategory: string,
  selectedTechnology: string,
  targetCategory: string
): string[] {
  // Get the technology object
  const category = selectedCategory as keyof TechStackData['technologies'];
  const technologies = techStackData.technologies[category];
  if (!technologies) return [];

  const technology = technologies[selectedTechnology];
  if (!technology) return [];
  
  // Access the compatibleWith property
  const compatibleWith = (technology as SimpleCompatibility).compatibleWith;
  if (!compatibleWith) return [];
  
  // If compatibleWith is an array, return it directly
  if (Array.isArray(compatibleWith)) {
    return compatibleWith;
  }
  
  // If it's an object with the target category, return that array
  if (compatibleWith[targetCategory]) {
    return compatibleWith[targetCategory];
  }
  
  return [];
}

/**
 * Filter all available technologies in a specific category based on multiple selections
 * 
 * @param techStackData The complete tech stack data
 * @param selections Map of category to selected technology (e.g. { 'frameworks': 'React', 'databases': 'MongoDB' })
 * @param targetCategory The category to filter options for
 * @returns Array of compatible technology names that work with all selections
 */
export function filterCompatibleTechnologies(
  techStackData: TechStackData,
  selections: Record<string, string>,
  targetCategory: string
): string[] {
  // If no selections have been made, return all technologies in the target category
  const selectionEntries = Object.entries(selections);
  if (selectionEntries.length === 0) {
    const categoryKey = findCategoryKeyForSubcategory(techStackData, targetCategory);
    if (categoryKey) {
      const categoryObj = techStackData.categories[categoryKey as keyof Categories];
      if (categoryObj && targetCategory in categoryObj) {
        // Use a safer type assertion by first converting to unknown
        return ((categoryObj as unknown) as Record<string, string[]>)[targetCategory];
      }
    }
    return Object.keys(techStackData.technologies[targetCategory as keyof Technologies] || {});
  }
  
  // For each selection, get compatible technologies
  const compatibleSets = selectionEntries.map(([category, technology]) => {
    return new Set(getCompatibleTechnologies(techStackData, category, technology, targetCategory));
  });
  
  // Find intersection of all sets
  if (compatibleSets.length === 0) return [];
  
  // Start with the first set
  const intersection = Array.from(compatibleSets[0]);
  
  // Filter by each subsequent set
  for (let i = 1; i < compatibleSets.length; i++) {
    const set = compatibleSets[i];
    for (let j = intersection.length - 1; j >= 0; j--) {
      if (!set.has(intersection[j])) {
        intersection.splice(j, 1);
      }
    }
  }
  
  return intersection;
}

/**
 * Find which top-level category contains a specific subcategory
 */
function findCategoryKeyForSubcategory(techStackData: TechStackData, subcategory: string): string | null {
  const categories = techStackData.categories;
  
  for (const [key, value] of Object.entries(categories)) {
    if (value && typeof value === 'object' && subcategory in value) {
      return key;
    }
  }
  
  return null;
}

/**
 * Create a sample default tech stack data structure
 */
export function createDefaultTechStackData(): TechStackData {
  return {
    categories: {
      frontend: {
        frameworks: ['React', 'Vue', 'Angular'],
        languages: ['JavaScript', 'TypeScript'],
        stateManagement: ['Redux', 'MobX', 'Vuex'],
        uiLibraries: ['Material-UI', 'Tailwind CSS', 'Bootstrap'],
        formHandling: ['Formik', 'React Hook Form', 'Final Form'],
        routing: ['React Router', 'Vue Router', 'Angular Router'],
        apiClients: ['Axios', 'Fetch API', 'Apollo Client'],
        metaFrameworks: ['Next.js', 'Nuxt.js', 'Gatsby']
      },
      backend: {
        frameworks: ['Express.js', 'NestJS', 'Django', 'Flask', 'Rails'],
        languages: ['JavaScript', 'TypeScript', 'Python', 'Ruby', 'Go'],
        baas: ['Firebase', 'Supabase', 'Amplify'],
        serverless: ['AWS Lambda', 'Vercel Functions', 'Netlify Functions'],
        realtime: ['Socket.io', 'Firebase Realtime DB', 'Pusher']
      },
      database: {
        sql: ['PostgreSQL', 'MySQL', 'SQLite'],
        nosql: ['MongoDB', 'DynamoDB', 'Firestore'],
        providers: ['AWS RDS', 'Google Cloud SQL', 'Azure SQL'],
        clients: ['Prisma', 'Sequelize', 'TypeORM']
      },
      authentication: {
        providers: ['Auth0', 'Firebase Auth', 'Okta'],
        methods: ['OAuth', 'JWT', 'Session']
      },
      deployment: {
        platforms: ['Vercel', 'Netlify', 'Heroku'],
        containerization: ['Docker', 'Kubernetes'],
        ci_cd: ['GitHub Actions', 'CircleCI', 'Jenkins']
      },
      storage: {
        objectStorage: ['AWS S3', 'Google Cloud Storage', 'Azure Blob Storage'],
        fileSystem: ['Local Storage', 'NFS', 'Azure Files']
      },
      hosting: {
        frontend: ['Vercel', 'Netlify', 'GitHub Pages'],
        backend: ['Heroku', 'AWS EC2', 'Digital Ocean'],
        database: ['AWS RDS', 'MongoDB Atlas', 'Supabase']
      },
      testing: {
        unitTesting: ['Jest', 'Mocha', 'Vitest'],
        e2eTesting: ['Cypress', 'Playwright', 'Selenium'],
        apiTesting: ['Postman', 'Insomnia', 'REST Client']
      }
    },
    technologies: {
      // This is just a placeholder structure. In a real implementation,
      // you would need to fill in the compatibility data for each technology.
      frameworks: {
        "React": {
          type: "frontend",
          description: "A JavaScript library for building user interfaces",
          languages: ["JavaScript", "TypeScript"],
          compatibleWith: {
            stateManagement: ["Redux", "MobX", "Zustand"],
            uiLibraries: ["Material-UI", "Tailwind CSS", "Chakra UI"],
            formHandling: ["Formik", "React Hook Form"],
            routing: ["React Router"],
            apiClients: ["Axios", "React Query", "SWR"],
            metaFrameworks: ["Next.js", "Gatsby"],
            hosting: ["Vercel", "Netlify", "GitHub Pages"],
            testing: ["Jest", "React Testing Library", "Cypress"]
          }
        },
        "Express.js": {
          type: "backend",
          description: "Fast, unopinionated, minimalist web framework for Node.js",
          language: "JavaScript",
          compatibleWith: {
            databases: ["MongoDB", "PostgreSQL", "MySQL"],
            orms: ["Mongoose", "Sequelize", "Prisma"],
            auth: ["Passport.js", "JWT", "OAuth"],
            hosting: ["Heroku", "AWS", "Digital Ocean"],
            testing: ["Mocha", "Jest", "Supertest"]
          }
        }
      },
      // Other technology categories would be defined here
      stateManagement: {
        "Redux": {
          description: "A predictable state container for JavaScript apps",
          compatibleWith: {
            frameworks: ["React", "Angular"]
          }
        }
      },
      databases: {
        "MongoDB": {
          type: "nosql",
          description: "Document-oriented NoSQL database",
          compatibleWith: {
            hosting: ["MongoDB Atlas", "AWS", "Self-hosted"],
            orms: ["Mongoose", "Prisma"],
            frameworks: ["Express.js", "NestJS", "Flask"],
            baas: ["Firebase", "Supabase"]
          }
        }
      },
      // Other technologies would be defined here...
      baas: {},
      uiLibraries: {},
      formHandling: {},
      routing: {},
      apiClients: {},
      metaFrameworks: {},
      orms: {},
      auth: {},
      hosting: {},
      testing: {},
      storage: {},
      serverless: {},
      realtime: {}
    }
  };
}
