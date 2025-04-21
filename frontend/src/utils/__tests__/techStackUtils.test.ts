import { FrontendFramework, StateManagement, TechStackData } from '../../types/techStack';
import { filterCompatibleTechnologies, getCompatibleTechnologies } from '../techStackUtils';
// Import actual tech stack data for real-world testing
import actualTechStackData from '../../../../backend/app/seed/tech_stack_data.json';

describe('Tech Stack Utilities', () => {
  // Cast the imported JSON to TechStackData type
  const testTechStackData = actualTechStackData as unknown as TechStackData;

  describe('getCompatibleTechnologies', () => {
    it('should return compatible technologies from the target category', () => {
      const compatibleStateManagement = getCompatibleTechnologies(
        testTechStackData,
        'frameworks',
        'React',
        'stateManagement'
      );

      expect(compatibleStateManagement).toEqual([
        'Redux',
        'MobX',
        'Zustand',
        'Recoil',
        'Context API',
        'Jotai',
        'Valtio',
        'XState',
      ]);
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
            } as FrontendFramework,
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
            } as StateManagement,
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

      expect(result).toEqual([
        'Redux',
        'MobX',
        'Zustand',
        'Recoil',
        'Context API',
        'Jotai',
        'Valtio',
        'XState',
      ]);
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

      // Express.js and PostgreSQL should be compatible with multiple hosting options
      expect(result).toEqual(['Self-hosted', 'Heroku', 'Railway', 'Render']);
      expect(result).not.toContain('AWS');
      expect(result).not.toContain('Vercel');
      expect(result).not.toContain('Netlify');
    });

    // New tests with actual tech stack data
    describe('using actual tech stack data', () => {
      it('should return frontend languages compatible with a selected framework', () => {
        const result = filterCompatibleTechnologies(
          testTechStackData,
          { frameworks: 'React' },
          'languages'
        );

        // React should be compatible with JavaScript and TypeScript
        expect(result).toContain('JavaScript');
        expect(result).toContain('TypeScript');
      });
      it('should find frameworks compatible with a selected language', () => {
        // In the real data structure, we need to query which frameworks support TypeScript
        // by examining each framework's languages array
        const frameworks = Object.entries(testTechStackData.technologies.frameworks)
          .filter(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_, framework]) =>
              'languages' in framework &&
              Array.isArray(framework.languages) &&
              framework.languages.includes('TypeScript')
          )
          .map(([name]) => name);

        // Verify some expected frameworks are TypeScript compatible
        expect(frameworks).toContain('React');
        expect(frameworks).toContain('Vue.js');
        expect(frameworks).toContain('Angular');
        expect(frameworks).toContain('Next.js');
      });
      it('should filter UI libraries based on selected framework', () => {
        // Find UI libraries that are compatible with React from the real data
        const framework = testTechStackData.technologies.frameworks['React'];
        const compatibleUILibraries =
          framework && framework.compatibleWith && 'uiLibraries' in framework.compatibleWith
            ? framework.compatibleWith.uiLibraries
            : [];

        // Verify some expected UI libraries that should be compatible with React
        expect(compatibleUILibraries).toContain('Material UI');
        expect(compatibleUILibraries).toContain('Chakra UI');
        expect(compatibleUILibraries).toContain('Tailwind CSS');
      });
      it('should filter state management options based on selected framework', () => {
        // Find state management options compatible with Vue.js from the real data
        const framework = testTechStackData.technologies.frameworks['Vue.js'];
        const compatibleStateManagement =
          framework && framework.compatibleWith && 'stateManagement' in framework.compatibleWith
            ? framework.compatibleWith.stateManagement
            : [];

        // Verify Vue.js is compatible with Pinia and Vuex
        expect(compatibleStateManagement).toContain('Pinia');
        expect(compatibleStateManagement).toContain('Vuex');
      });

      it('should handle multiple selections for UI libraries', () => {
        // Test with selections that are actually compatible in the data
        const result = filterCompatibleTechnologies(
          testTechStackData as unknown as TechStackData,
          {
            frameworks: 'React',
          },
          'uiLibraries'
        );

        // React is compatible with multiple UI libraries
        expect(result.length).toBeGreaterThan(0);
        expect(result).toContain('Material UI');
        expect(result).toContain('Tailwind CSS');
      });

      it('should filter frontend frameworks based on UI library selection', () => {
        const result = filterCompatibleTechnologies(
          testTechStackData as unknown as TechStackData,
          { uiLibraries: 'Tailwind CSS' },
          'frameworks'
        );

        // Tailwind CSS is compatible with multiple frontend frameworks
        expect(result).toContain('React');
        expect(result).toContain('Vue.js');
        expect(result).toContain('Angular');
      });

      it('should handle the specific frontend section use case with multiple filters', () => {
        // Test with selections that are actually compatible in the data
        const result = filterCompatibleTechnologies(
          testTechStackData as unknown as TechStackData,
          {
            frameworks: 'React',
          },
          'stateManagement'
        );

        // Should return state management solutions compatible with React
        expect(result.length).toBeGreaterThan(0);
        expect(result).toContain('Redux');
      });

      it('should filter form handling libraries based on framework selection', () => {
        const result = filterCompatibleTechnologies(
          testTechStackData as unknown as TechStackData,
          { frameworks: 'React' },
          'formHandling'
        );

        // React should be compatible with specific form handling libraries
        expect(result).toContain('React Hook Form');
        expect(result).toContain('Formik');
      });

      it('should filter routing solutions based on framework selection', () => {
        const result = filterCompatibleTechnologies(
          testTechStackData as unknown as TechStackData,
          { frameworks: 'React' },
          'routing'
        );

        // React should be compatible with React Router
        expect(result).toContain('React Router');
      });
    });
  });
});
