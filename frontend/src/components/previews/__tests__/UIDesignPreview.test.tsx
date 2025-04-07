import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import UIDesignPreview from '../UIDesignMarkdownView';
import { markdownService } from '../../../services/markdown';
import PreviewFactory from '../PreviewFactory';

// Mock dependencies
vi.mock('../../../services/markdown', () => ({
  markdownService: {
    generateUIDesignMarkdown: vi.fn(() => 'Mocked UI Design Markdown'),
    generateFileName: vi.fn(() => 'project-ui-design.md'),
  },
}));

vi.mock('../PreviewFactory', () => ({
  default: vi.fn(() => <div data-testid="preview-factory">Mocked Preview Factory</div>),
}));

describe('UIDesignPreview', () => {
  const mockUIDesign = {
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
      scale: [0, 1, 2, 4, 8, 16, 24, 32, 48, 64],
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
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
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

  it('should render loading state correctly', () => {
    render(<UIDesignPreview data={null} isLoading={true} />);
    expect(PreviewFactory).toHaveBeenCalledWith(
      expect.objectContaining({
        markdown: '',
        fileName: '',
        isLoading: true,
      }),
      expect.anything()
    );
  });

  it('should render empty state when no data is provided', () => {
    render(<UIDesignPreview data={null} />);
    expect(screen.getByText('No UI design data available to preview')).toBeInTheDocument();
  });

  it('should render preview with data correctly', () => {
    render(<UIDesignPreview data={mockUIDesign} projectName="Test Project" />);

    // Verify markdown service was called with the right parameters
    expect(markdownService.generateUIDesignMarkdown).toHaveBeenCalledWith(mockUIDesign);
    expect(markdownService.generateFileName).toHaveBeenCalledWith('Test Project', 'ui-design');

    // Verify PreviewFactory was called with the right parameters
    expect(PreviewFactory).toHaveBeenCalledWith(
      expect.objectContaining({
        markdown: 'Mocked UI Design Markdown',
        fileName: 'project-ui-design.md',
        isLoading: false,
      }),
      expect.anything()
    );
  });
});
