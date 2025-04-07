import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UIDesignService } from '../uiDesignService';
import apiClient from '../../api/apiClient';

// Mock the apiClient
vi.mock('../../api/apiClient', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe('UIDesignService', () => {
  const mockProjectId = 'test-project-id';
  const mockUIDesignData = {
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#f59e0b',
      background: '#ffffff',
      textPrimary: '#1f2937',
      textSecondary: '#4b5563',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      surface: '#ffffff',
      border: '#e5e7eb',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headingFont: 'Inter, sans-serif',
      fontSize: '16px',
      lineHeight: 1.5,
      fontWeight: 400,
      headingSizes: {
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.75rem',
        h4: '1.5rem',
        h5: '1.25rem',
        h6: '1rem',
      },
    },
    spacing: {
      unit: '4px',
      scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
    },
    borderRadius: {
      small: '2px',
      medium: '4px',
      large: '8px',
      xl: '12px',
      pill: '9999px',
    },
    shadows: {
      small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    layout: {
      containerWidth: '1280px',
      responsive: true,
      sidebarWidth: '240px',
      topbarHeight: '64px',
      gridColumns: 12,
      gutterWidth: '16px',
    },
    components: {
      buttonStyle: 'rounded',
      inputStyle: 'outline',
      cardStyle: 'shadow',
      tableStyle: 'bordered',
      navStyle: 'pills',
    },
    darkMode: {
      enabled: true,
      colors: {
        background: '#1f2937',
        textPrimary: '#f9fafb',
        textSecondary: '#e5e7eb',
        surface: '#374151',
        border: '#4b5563',
      },
    },
    animations: {
      transitionDuration: '150ms',
      transitionTiming: 'ease-in-out',
      hoverScale: 1.05,
      enableAnimations: true,
    },
  };

  const mockApiResponse = {
    data: {
      id: 'test-id',
      project_id: mockProjectId,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      version: 1,
      data: mockUIDesignData,
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getUIDesign', () => {
    it('should fetch UI design data successfully', async () => {
      // Mock API response
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockApiResponse);

      // Call the service
      const result = await UIDesignService.getUIDesign(mockProjectId);

      // Assertions
      expect(apiClient.get).toHaveBeenCalledWith('/api/project-specs/test-project-id/ui-design');
      expect(result).toEqual(mockUIDesignData);
    });

    it('should return null when API returns 404', async () => {
      // Mock API response for 404
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: null,
        status: 404,
        statusText: 'Not Found',
      });

      // Call the service
      const result = await UIDesignService.getUIDesign(mockProjectId);

      // Assertions
      expect(apiClient.get).toHaveBeenCalledWith('/api/project-specs/test-project-id/ui-design');
      expect(result).toBeNull();
    });

    it('should throw an error when API fails', async () => {
      // Mock API error response
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('API Error'));

      // Call the service and expect it to throw
      await expect(UIDesignService.getUIDesign(mockProjectId)).rejects.toThrow('API Error');
      expect(apiClient.get).toHaveBeenCalledWith('/api/project-specs/test-project-id/ui-design');
    });
  });

  describe('saveUIDesign', () => {
    it('should save UI design data successfully', async () => {
      // Mock API response
      vi.mocked(apiClient.put).mockResolvedValueOnce({
        data: mockUIDesignData,
      });

      // Call the service
      const result = await UIDesignService.saveUIDesign(mockProjectId, mockUIDesignData);

      // Assertions
      expect(apiClient.put).toHaveBeenCalledWith('/api/project-specs/test-project-id/ui-design', {
        data: mockUIDesignData,
      });
      expect(result).toEqual(mockUIDesignData);
    });

    it('should throw an error when API fails', async () => {
      // Mock API error response
      vi.mocked(apiClient.put).mockRejectedValueOnce(new Error('API Error'));

      // Call the service and expect it to throw
      await expect(UIDesignService.saveUIDesign(mockProjectId, mockUIDesignData)).rejects.toThrow(
        'API Error'
      );
      expect(apiClient.put).toHaveBeenCalledWith('/api/project-specs/test-project-id/ui-design', {
        data: mockUIDesignData,
      });
    });
  });
});
