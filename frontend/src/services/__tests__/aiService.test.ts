import { aiService } from '../aiService';
import apiClient from '../../api/apiClient';
import { FeatureModule } from '../featuresService';

// Mock the API client
jest.mock('../../api/apiClient');
const mockedAxios = apiClient as jest.Mocked<typeof apiClient>;

describe('aiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('enhanceReadme', () => {
    it('should return enhanced README when API call is successful', async () => {
      // Mock data
      const projectName = 'Test Project';
      const projectDescription = 'This is a test project description';
      const businessGoals = ['Goal 1', 'Goal 2'];
      const requirements = {
        functional: ['Functional Req 1', 'Functional Req 2'],
        non_functional: ['Non-functional Req 1'],
      };
      const features = {
        coreModules: [
          {
            name: 'Authentication',
            description: 'User authentication',
            enabled: true,
            optional: false,
          } as FeatureModule,
        ],
        optionalModules: [
          {
            name: 'Analytics',
            description: 'User analytics',
            enabled: false,
            optional: true,
          } as FeatureModule,
        ],
      };
      const techStack = {
        frontend: {
          framework: 'React',
          language: 'TypeScript',
        },
        backend: {
          type: 'API',
          service: 'Node.js',
        },
      };

      // Expected enhanced README
      const enhancedReadme = '# Test Project\n\nThis is an enhanced README';

      // Mock API response
      mockedAxios.post.mockResolvedValueOnce({
        data: { enhanced_readme: enhancedReadme },
      });

      // Call the service method
      const result = await aiService.enhanceReadme(
        projectName,
        projectDescription,
        businessGoals,
        requirements,
        features,
        techStack
      );

      // Assertions
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/ai-text/enhance-readme', {
        project_name: projectName,
        project_description: projectDescription,
        business_goals: businessGoals,
        requirements: requirements,
        features: features,
        tech_stack: techStack,
      });
      expect(result).toEqual(enhancedReadme);
    });

    it('should return null when API call fails', async () => {
      // Mock data
      const projectName = 'Test Project';
      const projectDescription = 'This is a test project description';
      const businessGoals = ['Goal 1', 'Goal 2'];
      const requirements = {
        functional: ['Functional Req 1', 'Functional Req 2'],
        non_functional: ['Non-functional Req 1'],
      };
      const features = {
        coreModules: [] as FeatureModule[],
        optionalModules: [] as FeatureModule[],
      };
      const techStack = {};

      // Mock API error
      mockedAxios.post.mockRejectedValueOnce(new Error('API error'));

      // Call the service method
      const result = await aiService.enhanceReadme(
        projectName,
        projectDescription,
        businessGoals,
        requirements,
        features,
        techStack
      );

      // Assertions
      expect(mockedAxios.post).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  // Add tests for other AI service methods as needed
});
