import { render, screen } from '@testing-library/react';
import RequirementsPreview from '../RequirementsPreview';
import { Requirements } from '../../../types/templates';
import { markdownService } from '../../../services/markdown';
import PreviewFactory from '../PreviewFactory';

// Mock dependencies
jest.mock('../../../services/markdownService', () => ({
  markdownService: {
    generateRequirementsMarkdown: jest.fn(),
    generateFileName: jest.fn(),
  },
}));

jest.mock('../PreviewFactory', () => {
  return jest.fn(() => <div data-testid="preview-factory">Preview Factory</div>);
});

describe('RequirementsPreview', () => {
  const mockProjectName = 'Test Project';
  const mockRequirementsData: Partial<Requirements> = {
    functional: ['User Authentication', 'User Registration'],
    non_functional: ['Performance'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (markdownService.generateRequirementsMarkdown as jest.Mock).mockReturnValue(
      '# Requirements Markdown'
    );
    (markdownService.generateFileName as jest.Mock).mockReturnValue('test-project-requirements.md');
  });

  test('should render loading state when isLoading is true', () => {
    render(<RequirementsPreview data={null} projectName={mockProjectName} isLoading={true} />);

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByRole('article').querySelector('.animate-pulse')).toBeInTheDocument();
  });

  test('should render message when no data is available', () => {
    render(<RequirementsPreview data={null} projectName={mockProjectName} isLoading={false} />);

    expect(screen.getByText('No Requirements Data Available')).toBeInTheDocument();
    expect(
      screen.getByText('Fill out the requirements form to generate a preview.')
    ).toBeInTheDocument();
  });

  test('should generate markdown and render PreviewFactory when data is available', () => {
    render(
      <RequirementsPreview
        data={mockRequirementsData}
        projectName={mockProjectName}
        isLoading={false}
      />
    );

    // Verify markdown service was called with the correct data
    expect(markdownService.generateRequirementsMarkdown).toHaveBeenCalledWith(mockRequirementsData);
    expect(markdownService.generateFileName).toHaveBeenCalledWith(mockProjectName, 'requirements');

    // Verify PreviewFactory was rendered with the correct props
    expect(PreviewFactory).toHaveBeenCalledWith(
      {
        markdown: '# Requirements Markdown',
        fileName: 'test-project-requirements.md',
      },
      {}
    );

    expect(screen.getByTestId('preview-factory')).toBeInTheDocument();
  });
});
