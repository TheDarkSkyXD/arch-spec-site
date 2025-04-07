import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RequirementsForm from './RequirementsForm';
import { ToastProvider } from '../../contexts/ToastContext';
import { requirementsService } from '../../services/requirementsService';

// Mock the requirementsService
vi.mock('../../services/requirementsService', () => ({
  requirementsService: {
    getRequirements: vi.fn(),
    saveRequirements: vi.fn(),
  },
}));

// Mock the toast context
vi.mock('../../contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
  ToastProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('RequirementsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders with initial data', () => {
    render(
      <ToastProvider>
        <RequirementsForm
          initialData={{
            functional: ['User authentication', 'Dashboard view'],
            non_functional: ['Performance', 'Security'],
          }}
        />
      </ToastProvider>
    );

    // Check if initial requirements are rendered
    expect(screen.getByText('User authentication')).toBeInTheDocument();
    expect(screen.getByText('Dashboard view')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
  });

  test('adds and removes functional requirements', async () => {
    render(
      <ToastProvider>
        <RequirementsForm
          initialData={{
            functional: [],
            non_functional: [],
          }}
        />
      </ToastProvider>
    );

    // Add a new functional requirement
    const functionalInput = screen.getByPlaceholderText('Enter a functional requirement');
    fireEvent.change(functionalInput, { target: { value: 'New requirement' } });

    const addButton = screen.getAllByRole('button')[0]; // First add button
    fireEvent.click(addButton);

    // Verify it was added
    expect(screen.getByText('New requirement')).toBeInTheDocument();

    // Remove the requirement
    const removeButton = screen.getAllByRole('button')[1]; // First remove button
    fireEvent.click(removeButton);

    // Verify it was removed
    expect(screen.queryByText('New requirement')).not.toBeInTheDocument();
  });

  test('adds and removes non-functional requirements', async () => {
    render(
      <ToastProvider>
        <RequirementsForm
          initialData={{
            functional: [],
            non_functional: [],
          }}
        />
      </ToastProvider>
    );

    // Add a new non-functional requirement
    const nonFunctionalInput = screen.getByPlaceholderText('Enter a non-functional requirement');
    fireEvent.change(nonFunctionalInput, { target: { value: 'Scalability' } });

    const addButton = screen.getAllByRole('button')[1]; // Second add button
    fireEvent.click(addButton);

    // Verify it was added
    expect(screen.getByText('Scalability')).toBeInTheDocument();

    // Remove the requirement
    const removeButton = screen.getAllByRole('button')[1]; // First remove button
    fireEvent.click(removeButton);

    // Verify it was removed
    expect(screen.queryByText('Scalability')).not.toBeInTheDocument();
  });

  test('submits form with requirements data', async () => {
    // Mock the save requirements function
    const mockSaveRequirements = vi.fn().mockResolvedValue({
      functional: ['User authentication'],
      non_functional: ['Performance'],
    });
    requirementsService.saveRequirements = mockSaveRequirements;

    const onSuccessMock = vi.fn();

    render(
      <ToastProvider>
        <RequirementsForm
          initialData={{
            functional: ['User authentication'],
            non_functional: ['Performance'],
          }}
          projectId="test-project-id"
          onSuccess={onSuccessMock}
        />
      </ToastProvider>
    );

    // Submit the form
    const submitButton = screen.getByText('Save Requirements');
    fireEvent.click(submitButton);

    // Verify service was called
    await waitFor(() => {
      expect(mockSaveRequirements).toHaveBeenCalledWith('test-project-id', {
        functional: ['User authentication'],
        non_functional: ['Performance'],
      });
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  test('displays loading state when fetching requirements', async () => {
    // Mock the get requirements function to delay
    const mockGetRequirements = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            functional: ['User authentication'],
            non_functional: ['Performance'],
          });
        }, 100);
      });
    });

    requirementsService.getRequirements = mockGetRequirements;

    render(
      <ToastProvider>
        <RequirementsForm projectId="test-project-id" />
      </ToastProvider>
    );

    // Check for loading indicator
    expect(screen.getByText('Loading requirements...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(mockGetRequirements).toHaveBeenCalledWith('test-project-id');
      expect(screen.queryByText('Loading requirements...')).not.toBeInTheDocument();
    });
  });

  test('disables submit button when no projectId is provided', () => {
    render(
      <ToastProvider>
        <RequirementsForm
          initialData={{
            functional: ['User authentication'],
            non_functional: ['Performance'],
          }}
        />
      </ToastProvider>
    );

    const submitButton = screen.getByText('Save Requirements');
    expect(submitButton).toBeDisabled();
  });
});
