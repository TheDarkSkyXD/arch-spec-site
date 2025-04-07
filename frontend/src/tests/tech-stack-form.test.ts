import { describe, it, expect, vi, beforeEach } from 'vitest';
import { techStackService } from '../services/techStackService';
import { TechStackFormData } from '../components/forms/tech-stack/techStackSchema';
import { ProjectTechStack } from '../types/templates';

// Mock the techStackService
vi.mock('../services/techStackService', () => ({
  techStackService: {
    saveTechStack: vi.fn(),
  },
}));

describe('TechStackForm functionality', () => {
  const mockProjectId = 'test-project-id';
  const mockFormData: TechStackFormData = {
    frontend: 'react',
    frontend_language: 'typescript',
    ui_library: 'mui',
    state_management: 'redux',
    backend_type: 'framework',
    backend_framework: 'express',
    backend_language: 'typescript',
    database_type: 'sql',
    database_system: 'postgresql',
    database_hosting: 'aws-rds',
    auth_provider: 'auth0',
    auth_methods: 'oauth',
    hosting_frontend: 'vercel',
    hosting_backend: 'heroku',
  };

  const expectedApiData: ProjectTechStack = {
    frontend: {
      framework: 'react',
      language: 'typescript',
      uiLibrary: 'mui',
      stateManagement: 'redux',
    },
    backend: {
      type: 'framework',
      framework: 'express',
      language: 'typescript',
      realtime: null,
    },
    database: {
      type: 'sql',
      system: 'postgresql',
      hosting: 'aws-rds',
      orm: null,
    },
    authentication: {
      provider: 'auth0',
      methods: ['oauth'],
    },
    hosting: {
      frontend: 'vercel',
      backend: 'heroku',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should convert form data to API format correctly', async () => {
    // Setup the mock to return success
    vi.mocked(techStackService.saveTechStack).mockResolvedValueOnce(expectedApiData);

    // Call the service with mock data
    const result = await techStackService.saveTechStack(mockProjectId, mockFormData);

    // Verify service was called with correct data
    expect(techStackService.saveTechStack).toHaveBeenCalledWith(mockProjectId, mockFormData);

    // Verify the result matches expected format
    expect(result).toEqual(expectedApiData);
  });

  it('should handle errors when saving tech stack', async () => {
    // Setup the mock to return error
    vi.mocked(techStackService.saveTechStack).mockRejectedValueOnce(new Error('API error'));

    // Call and verify error is thrown
    await expect(techStackService.saveTechStack(mockProjectId, mockFormData)).rejects.toThrow(
      'API error'
    );
  });
});
