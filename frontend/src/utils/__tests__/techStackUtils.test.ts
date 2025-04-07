import { getCompatibleTechnologies, filterCompatibleTechnologies } from '../techStackUtils';
import { TechStackData } from '../../types/techStack';

describe('Tech Stack Utilities', () => {
  let testTechStackData: TechStackData;

  beforeEach(() => {
    // Create a fresh test data structure before each test
    testTechStackData = {
      categories: {
        frontend: {
          frameworks: ['React', 'Vue', 'Angular'],
          languages: ['JavaScript', 'TypeScript'],
          stateManagement: ['Redux', 'MobX', 'Vuex'],
          uiLibraries: ['Material-UI', 'Tailwind CSS', 'Bootstrap'],
          formHandling: [],
          routing: [],
          apiClients: [],
          metaFrameworks: [],
        },
        backend: {
          frameworks: ['Express.js', 'NestJS', 'Django'],
          languages: ['JavaScript', 'TypeScript', 'Python'],
          baas: ['Firebase', 'Supabase'],
          serverless: [],
          realtime: [],
        },
        database: {
          sql: ['PostgreSQL', 'MySQL'],
          nosql: ['MongoDB', 'DynamoDB'],
          hosting: [],
          clients: [],
        },
        authentication: {
          providers: [],
          methods: [],
        },
        deployment: {
          platforms: [],
          containerization: [],
          ci_cd: [],
        },
        storage: {
          objectStorage: [],
          fileSystem: [],
        },
        hosting: {
          frontend: ['Vercel', 'Netlify'],
          backend: ['Heroku', 'AWS'],
          database: [],
        },
        testing: {
          unitTesting: [],
          e2eTesting: [],
          apiTesting: [],
        },
      },
      technologies: {
        frameworks: {
          React: {
            type: 'frontend',
            description: 'A JavaScript library for building user interfaces',
            languages: ['JavaScript', 'TypeScript'],
            compatibleWith: {
              stateManagement: ['Redux', 'MobX'],
              uiLibraries: ['Material-UI', 'Tailwind CSS'],
              hosting: ['Vercel', 'Netlify'],
            },
          },
          Vue: {
            type: 'frontend',
            description: 'Progressive JavaScript Framework',
            languages: ['JavaScript', 'TypeScript'],
            compatibleWith: {
              stateManagement: ['Vuex'],
              uiLibraries: ['Tailwind CSS', 'Bootstrap'],
              hosting: ['Vercel', 'Netlify'],
            },
          },
          'Express.js': {
            type: 'backend',
            description: 'Fast, unopinionated, minimalist web framework for Node.js',
            language: 'JavaScript',
            compatibleWith: {
              databases: ['MongoDB', 'PostgreSQL', 'MySQL'],
              hosting: ['Heroku', 'AWS'],
            },
          },
          Django: {
            type: 'backend',
            description: 'Python web framework',
            language: 'Python',
            compatibleWith: {
              databases: ['PostgreSQL', 'MySQL'],
              hosting: ['Heroku'],
            },
          },
        },
        stateManagement: {
          Redux: {
            description: 'A predictable state container for JavaScript apps',
            compatibleWith: ['React'],
          },
          MobX: {
            description: 'Simple, scalable state management',
            compatibleWith: {
              frameworks: ['React', 'Angular'],
            },
          },
          Vuex: {
            description: 'State management pattern + library for Vue.js applications',
            compatibleWith: {
              frameworks: ['Vue'],
            },
          },
        },
        databases: {
          MongoDB: {
            type: 'nosql',
            description: 'Document-oriented NoSQL database',
            compatibleWith: {
              frameworks: ['React', 'Express.js'],
              hosting: ['MongoDB Atlas', 'AWS'],
            },
          },
          PostgreSQL: {
            type: 'sql',
            description: 'Powerful, open source object-relational database',
            compatibleWith: {
              frameworks: ['React', 'Vue', 'Express.js', 'Django'],
              hosting: ['AWS RDS', 'Heroku'],
            },
          },
          MySQL: {
            type: 'sql',
            description: 'Open-source relational database management system',
            compatibleWith: {
              frameworks: ['Vue', 'Express.js', 'Django'],
              hosting: ['AWS RDS', 'Digital Ocean'],
            },
          },
        },
        uiLibraries: {
          'Material-UI': {
            description: 'React components for faster and easier web development',
            compatibleWith: {
              frameworks: ['React'],
            },
          },
          'Tailwind CSS': {
            description: 'A utility-first CSS framework',
            compatibleWith: {
              frameworks: ['React', 'Vue'],
            },
          },
          Bootstrap: {
            description: 'Open source toolkit for developing with HTML, CSS, and JS',
            compatibleWith: {
              frameworks: ['Vue', 'Angular'],
            },
          },
        },
        hosting: {
          Vercel: {
            type: 'frontend',
            description: 'Platform for frontend frameworks and static sites',
            compatibleWith: {
              frontend: ['React', 'Vue', 'Next.js'],
            },
          },
          Netlify: {
            type: 'frontend',
            description: 'Platform for modern web projects',
            compatibleWith: {
              frontend: ['React', 'Vue', 'Gatsby'],
            },
          },
          Heroku: {
            type: 'backend',
            description:
              'Cloud platform that lets companies build, deliver, monitor and scale apps',
            compatibleWith: {
              backend: ['Express.js', 'Django', 'Rails'],
            },
          },
          AWS: {
            type: 'backend',
            description: 'On-demand cloud computing platforms and APIs',
            compatibleWith: {
              backend: ['Express.js', 'NestJS'],
            },
          },
        },
        baas: {},
        formHandling: {},
        routing: {},
        apiClients: {},
        metaFrameworks: {},
        orms: {},
        auth: {},
        testing: {},
        storage: {},
        serverless: {},
        realtime: {},
      },
    };
  });

  describe('getCompatibleTechnologies', () => {
    it('should return compatible technologies from the target category', () => {
      const compatibleStateManagement = getCompatibleTechnologies(
        testTechStackData,
        'frameworks',
        'React',
        'stateManagement'
      );

      expect(compatibleStateManagement).toEqual(['Redux', 'MobX']);
    });

    it('should return an empty array if the technology is not found', () => {
      const result = getCompatibleTechnologies(
        testTechStackData,
        'frameworks',
        'NonExistentFramework',
        'stateManagement'
      );

      expect(result).toEqual([]);
    });

    it('should return an empty array if the category is not found', () => {
      const result = getCompatibleTechnologies(
        testTechStackData,
        'nonExistentCategory',
        'React',
        'stateManagement'
      );

      expect(result).toEqual([]);
    });

    it('should return an empty array if the compatibleWith property is missing', () => {
      // Create a tech with no compatibleWith property
      const brokenTechStackData: TechStackData = {
        ...testTechStackData,
        technologies: {
          ...testTechStackData.technologies,
          frameworks: {
            ...testTechStackData.technologies.frameworks,
            BrokenFramework: {
              type: 'frontend',
              description: 'A broken framework with no compatibility info',
              compatibleWith: {},
            } as any,
          },
        },
      };

      const result = getCompatibleTechnologies(
        brokenTechStackData,
        'frameworks',
        'BrokenFramework',
        'stateManagement'
      );

      expect(result).toEqual([]);
    });

    it('should handle when compatibleWith is an array', () => {
      // Create a tech with compatibleWith as an array
      const arrayCompatTechStackData: TechStackData = {
        ...testTechStackData,
        technologies: {
          ...testTechStackData.technologies,
          stateManagement: {
            ...testTechStackData.technologies.stateManagement,
            SimpleRedux: {
              description: 'Simplified state management',
              compatibleWith: ['React', 'Preact', 'Vue'],
            } as any,
          },
        },
      };

      const result = getCompatibleTechnologies(
        arrayCompatTechStackData,
        'stateManagement',
        'SimpleRedux',
        'frameworks'
      );

      expect(result).toEqual(['React', 'Preact', 'Vue']);
    });
  });

  describe('filterCompatibleTechnologies', () => {
    it('should return all technologies in a category when no selections are made', () => {
      const result = filterCompatibleTechnologies(testTechStackData, {}, 'stateManagement');

      // Should return all state management options
      expect(result).toContain('Redux');
      expect(result).toContain('MobX');
      expect(result).toContain('Vuex');
    });

    it('should filter technologies based on a single selection', () => {
      const result = filterCompatibleTechnologies(
        testTechStackData,
        { frameworks: 'React' },
        'stateManagement'
      );

      expect(result).toEqual(['Redux', 'MobX']);
      expect(result).not.toContain('Vuex');
    });

    it('should return an empty array when there are no compatible technologies', () => {
      const result = filterCompatibleTechnologies(
        testTechStackData,
        {
          frameworks: 'React',
          stateManagement: 'Vuex', // Vuex is not compatible with React
        },
        'databases'
      );

      expect(result).toEqual([]);
    });

    it('should handle complex intersections correctly', () => {
      const result = filterCompatibleTechnologies(
        testTechStackData,
        {
          frameworks: 'Express.js',
          databases: 'PostgreSQL',
        },
        'hosting'
      );

      // Only Heroku is compatible with both Express.js and PostgreSQL
      expect(result).toEqual(['Heroku']);
      expect(result).not.toContain('AWS');
      expect(result).not.toContain('Vercel');
      expect(result).not.toContain('Netlify');
    });
  });
});
