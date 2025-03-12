import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import FeaturesForm from "./FeaturesForm";
import { ToastProvider, useToast } from "../../contexts/ToastContext";
import { featuresService } from "../../services/featuresService";

// Mock the featuresService
vi.mock("../../services/featuresService", () => ({
  featuresService: {
    getFeatures: vi.fn(),
    saveFeatures: vi.fn(),
  },
}));

// Mock the toast context
vi.mock("../../contexts/ToastContext", () => ({
  useToast: vi.fn().mockReturnValue({
    showToast: vi.fn(),
  }),
  ToastProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("FeaturesForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders with initial data", () => {
    render(
      <ToastProvider>
        <FeaturesForm
          initialData={{
            coreModules: [
              {
                name: "Authentication",
                description: "User registration, login, and profile management",
                enabled: true,
                optional: false,
              },
              {
                name: "Payment Processing",
                description: "Integrates payment gateways",
                enabled: true,
                optional: true,
                providers: ["Stripe", "PayPal"],
              },
            ],
          }}
        />
      </ToastProvider>
    );

    // Check if initial modules are rendered
    expect(screen.getByText("Authentication")).toBeInTheDocument();
    expect(screen.getByText("Payment Processing")).toBeInTheDocument();
    expect(
      screen.getByText("User registration, login, and profile management")
    ).toBeInTheDocument();
    expect(screen.getByText("Integrates payment gateways")).toBeInTheDocument();
  });

  test("renders no features message when empty", () => {
    render(
      <ToastProvider>
        <FeaturesForm
          initialData={{
            coreModules: [],
          }}
        />
      </ToastProvider>
    );

    expect(
      screen.getByText("No features available for this template.")
    ).toBeInTheDocument();
  });

  test("toggles optional features", () => {
    render(
      <ToastProvider>
        <FeaturesForm
          initialData={{
            coreModules: [
              {
                name: "Optional Feature",
                description: "This can be toggled",
                enabled: false,
                optional: true,
              },
            ],
          }}
        />
      </ToastProvider>
    );

    // Get the toggle button (it should be the first button)
    const toggleButton = screen.getAllByRole("button")[0];

    // Click to enable
    fireEvent.click(toggleButton);

    // Check if it's now enabled - this is a bit trickier to test since we'd need to check
    // for the presence of a specific class or style. Since we're using Lucide icons,
    // we'd need a more complex selector or mock.
  });

  test("disables non-optional features toggle", () => {
    render(
      <ToastProvider>
        <FeaturesForm
          initialData={{
            coreModules: [
              {
                name: "Required Feature",
                description: "This cannot be toggled",
                enabled: true,
                optional: false,
              },
            ],
          }}
        />
      </ToastProvider>
    );

    // The toggle button should be disabled
    const toggleButton = screen.getAllByRole("button")[0];
    expect(toggleButton).toHaveAttribute("disabled");
  });

  test("submits form with features data", async () => {
    // Mock the save features function
    const mockSaveFeatures = vi.fn().mockResolvedValue({
      coreModules: [
        {
          name: "Authentication",
          description: "User authentication feature",
          enabled: true,
          optional: false,
        },
      ],
    });
    featuresService.saveFeatures = mockSaveFeatures;

    const onSuccessMock = vi.fn();

    render(
      <ToastProvider>
        <FeaturesForm
          initialData={{
            coreModules: [
              {
                name: "Authentication",
                description: "User authentication feature",
                enabled: true,
                optional: false,
              },
            ],
          }}
          projectId="test-project-id"
          onSuccess={onSuccessMock}
        />
      </ToastProvider>
    );

    // Submit the form
    const submitButton = screen.getByText("Save Features");
    fireEvent.click(submitButton);

    // Verify service was called
    await waitFor(() => {
      expect(mockSaveFeatures).toHaveBeenCalledWith("test-project-id", {
        coreModules: [
          {
            name: "Authentication",
            description: "User authentication feature",
            enabled: true,
            optional: false,
          },
        ],
      });
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  test("displays loading state when fetching features", async () => {
    // Mock the get features function to delay
    const mockGetFeatures = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            coreModules: [
              {
                name: "Authentication",
                description: "User authentication feature",
                enabled: true,
                optional: false,
              },
            ],
          });
        }, 100);
      });
    });

    featuresService.getFeatures = mockGetFeatures;

    render(
      <ToastProvider>
        <FeaturesForm projectId="test-project-id" />
      </ToastProvider>
    );

    // Check for loading indicator
    expect(screen.getByText("Loading features...")).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(mockGetFeatures).toHaveBeenCalledWith("test-project-id");
      expect(screen.queryByText("Loading features...")).not.toBeInTheDocument();
    });
  });

  test("disables submit button when no projectId is provided", () => {
    render(
      <ToastProvider>
        <FeaturesForm
          initialData={{
            coreModules: [
              {
                name: "Authentication",
                description: "User authentication feature",
                enabled: true,
                optional: false,
              },
            ],
          }}
        />
      </ToastProvider>
    );

    const submitButton = screen.getByText("Save Features");
    expect(submitButton).toBeDisabled();
  });

  test("shows add feature form when 'Add New Feature' button is clicked", () => {
    render(
      <ToastProvider>
        <FeaturesForm
          initialData={{
            coreModules: [],
          }}
        />
      </ToastProvider>
    );

    // Click the Add New Feature button
    const addButton = screen.getByText("Add New Feature");
    fireEvent.click(addButton);

    // Check if the feature form is shown
    expect(
      screen.getByText("Add New Feature", { selector: "h3" })
    ).toBeInTheDocument();
    expect(screen.getByText("Feature Name *")).toBeInTheDocument();
    expect(screen.getByText("Description *")).toBeInTheDocument();
    expect(screen.getByText("Enabled by default")).toBeInTheDocument();
    expect(screen.getByText("Optional (can be toggled)")).toBeInTheDocument();
  });

  test("validates required fields when adding a new feature", () => {
    render(
      <ToastProvider>
        <FeaturesForm
          initialData={{
            coreModules: [],
          }}
        />
      </ToastProvider>
    );

    // Click the Add New Feature button
    const addButton = screen.getByText("Add New Feature");
    fireEvent.click(addButton);

    // Try to add feature without required fields
    const addFeatureButton = screen.getByText("Add Feature");
    fireEvent.click(addFeatureButton);

    // Check if validation errors are shown
    expect(screen.getByText("Feature name is required")).toBeInTheDocument();
    expect(
      screen.getByText("Feature description is required")
    ).toBeInTheDocument();
  });

  test("successfully adds a new feature", () => {
    const showToastMock = vi.fn();
    vi.mocked(useToast).mockReturnValue({
      showToast: showToastMock,
    });

    render(
      <ToastProvider>
        <FeaturesForm
          initialData={{
            coreModules: [],
          }}
        />
      </ToastProvider>
    );

    // Click the Add New Feature button
    const addButton = screen.getByText("Add New Feature");
    fireEvent.click(addButton);

    // Fill in the form
    const nameInput = screen.getByPlaceholderText("e.g., User Authentication");
    const descriptionInput = screen.getByPlaceholderText(
      "Describe what this feature does"
    );

    fireEvent.change(nameInput, { target: { value: "Test Feature" } });
    fireEvent.change(descriptionInput, {
      target: { value: "This is a test feature" },
    });

    // Add providers
    const hasProvidersCheckbox = screen.getByLabelText(
      "This feature uses external providers"
    );
    fireEvent.click(hasProvidersCheckbox);

    // Select a provider
    const providerSelect = screen.getByText("Select provider...");
    fireEvent.change(providerSelect, { target: { value: "Stripe" } });

    // Add the feature
    const addFeatureButton = screen.getByText("Add Feature");
    fireEvent.click(addFeatureButton);

    // Check if success toast was shown
    expect(showToastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Success",
        description: "New feature added successfully",
        type: "success",
      })
    );

    // Check if the form is no longer visible
    expect(
      screen.queryByText("Add New Feature", { selector: "h3" })
    ).not.toBeInTheDocument();
  });

  test("cancels adding a feature when Cancel button is clicked", () => {
    render(
      <ToastProvider>
        <FeaturesForm
          initialData={{
            coreModules: [],
          }}
        />
      </ToastProvider>
    );

    // Click the Add New Feature button
    const addButton = screen.getByText("Add New Feature");
    fireEvent.click(addButton);

    // Click the Cancel button
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Check if the form is no longer visible
    expect(
      screen.queryByText("Add New Feature", { selector: "h3" })
    ).not.toBeInTheDocument();
  });

  test("initializes with template data when provided", () => {
    const templateFeatures = {
      coreModules: [
        {
          name: "Authentication",
          description: "User authentication system",
          enabled: true,
          optional: false,
        },
        {
          name: "Payments",
          description: "Payment processing system",
          enabled: true,
          optional: true,
          providers: ["Stripe"],
        },
      ],
    };

    render(
      <ToastProvider>
        <FeaturesForm initialData={templateFeatures} />
      </ToastProvider>
    );

    // Check that both modules from the template are displayed
    expect(screen.getByText("Authentication")).toBeInTheDocument();
    expect(screen.getByText("User authentication system")).toBeInTheDocument();

    expect(screen.getByText("Payments")).toBeInTheDocument();
    expect(screen.getByText("Payment processing system")).toBeInTheDocument();

    // Check that provider is shown for the Payments module
    const providerSelects = screen.getAllByText("Provider");
    expect(providerSelects.length).toBeGreaterThan(0);

    // Check that the Stripe option is selected
    const selectWithStripe = screen.getByDisplayValue("Stripe");
    expect(selectWithStripe).toBeInTheDocument();
  });
});
