import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import PagesForm from "./PagesForm";
import { pagesService } from "../../services/pagesService";

// Mock the pagesService
vi.mock("../../services/pagesService", () => ({
  pagesService: {
    getPages: vi.fn(),
    savePages: vi.fn(),
  },
}));

// Mock the toast context
vi.mock("../../contexts/ToastContext", () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

describe("PagesForm", () => {
  const initialData = {
    public: [
      {
        name: "Home",
        path: "/",
        components: ["Header", "Footer"],
        enabled: true,
      },
    ],
    authenticated: [
      {
        name: "Dashboard",
        path: "/dashboard",
        components: ["Sidebar", "Main"],
        enabled: true,
      },
    ],
    admin: [
      {
        name: "Admin Dashboard",
        path: "/admin",
        components: ["AdminHeader", "AdminSidebar"],
        enabled: true,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with initial data", () => {
    render(<PagesForm initialData={initialData} />);

    // Check that the component renders with the initial data
    expect(screen.getByText("Home")).toBeInTheDocument();

    // Check other tabs
    fireEvent.click(screen.getByText("Authenticated Pages"));
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Admin Pages"));
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  it("adds a new page to the public list", () => {
    render(<PagesForm initialData={initialData} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText("Page Name"), {
      target: { value: "About" },
    });
    fireEvent.change(screen.getByLabelText("Path"), {
      target: { value: "/about" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add Page"));

    // Verify the new page is added
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText(/\/about/)).toBeInTheDocument();
  });

  it("removes a page from the list", () => {
    render(<PagesForm initialData={initialData} />);

    // Find the remove button for the first page and click it
    const removeButtons = screen.getAllByTitle("Remove page");
    fireEvent.click(removeButtons[0]);

    // Verify the page is removed
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });

  it("toggles a page's enabled state", () => {
    render(<PagesForm initialData={initialData} />);

    // Find the toggle button for the first page and click it
    const toggleButtons = screen.getAllByTitle("Disable page");
    fireEvent.click(toggleButtons[0]);

    // Verify the page is now disabled
    const toggleButton = screen.getByTitle("Enable page");
    expect(toggleButton).toBeInTheDocument();
  });

  it("edits an existing page", () => {
    render(<PagesForm initialData={initialData} />);

    // Find the edit button for the first page and click it
    const editButtons = screen.getAllByTitle("Edit page");
    fireEvent.click(editButtons[0]);

    // Check that form is in edit mode
    expect(screen.getByText("Edit Page")).toBeInTheDocument();

    // Change the page name and path
    fireEvent.change(screen.getByLabelText("Page Name"), {
      target: { value: "Updated Home" },
    });
    fireEvent.change(screen.getByLabelText("Path"), {
      target: { value: "/updated-home" },
    });

    // Save the changes
    fireEvent.click(screen.getByText("Save Changes"));

    // Verify the page is updated
    expect(screen.getByText("Updated Home")).toBeInTheDocument();
    expect(screen.getByText(/\/updated-home/)).toBeInTheDocument();
  });

  it("cancels editing a page", () => {
    render(<PagesForm initialData={initialData} />);

    // Find the edit button for the first page and click it
    const editButtons = screen.getAllByTitle("Edit page");
    fireEvent.click(editButtons[0]);

    // Check that form is in edit mode with initial data populated
    expect(screen.getByDisplayValue("Home")).toBeInTheDocument();
    expect(screen.getByDisplayValue("/")).toBeInTheDocument();

    // Change the page name and path
    fireEvent.change(screen.getByLabelText("Page Name"), {
      target: { value: "Changed Home" },
    });

    // Click cancel
    fireEvent.click(screen.getByText("Cancel"));

    // Verify the page was not changed
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.queryByText("Changed Home")).not.toBeInTheDocument();

    // Check form is reset to add mode
    expect(screen.getByText("Add a New Public Page")).toBeInTheDocument();
  });

  it("displays and manages page components", () => {
    render(<PagesForm initialData={initialData} />);

    // Expand the components section of the first page
    const expandButton = screen.getAllByTitle("Expand components")[0];
    fireEvent.click(expandButton);

    // Verify components are displayed
    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();

    // Add a new component
    fireEvent.change(screen.getByPlaceholderText("New component name"), {
      target: { value: "Navigation" },
    });
    fireEvent.click(screen.getByText("Add"));

    // Verify the new component is added
    expect(screen.getByText("Navigation")).toBeInTheDocument();

    // Edit a component
    const editComponentButtons = screen.getAllByTitle("Edit component");
    fireEvent.click(editComponentButtons[0]);

    // Find the input field and change the value
    const editInput = screen.getByDisplayValue("Header");
    fireEvent.change(editInput, { target: { value: "Updated Header" } });
    fireEvent.keyDown(editInput, { key: "Enter" });

    // Verify the component was updated
    expect(screen.getByText("Updated Header")).toBeInTheDocument();

    // Delete a component
    const deleteComponentButtons = screen.getAllByTitle("Remove component");
    fireEvent.click(deleteComponentButtons[1]); // Delete the Footer component

    // Verify the component was removed
    expect(screen.queryByText("Footer")).not.toBeInTheDocument();

    // Collapse the components section
    const collapseButton = screen.getByTitle("Collapse components");
    fireEvent.click(collapseButton);

    // Verify components are no longer displayed
    expect(screen.queryByText("Components")).not.toBeInTheDocument();
  });

  it("submits the form with updated data", async () => {
    // Mock the savePages method to return a successful response
    (pagesService.savePages as jest.Mock).mockResolvedValue(initialData);

    const mockOnSuccess = vi.fn();
    render(
      <PagesForm
        initialData={initialData}
        projectId="test-project-id"
        onSuccess={mockOnSuccess}
      />
    );

    // Submit the form
    fireEvent.submit(screen.getByRole("form"));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(pagesService.savePages).toHaveBeenCalledWith("test-project-id", {
        public: initialData.public,
        authenticated: initialData.authenticated,
        admin: initialData.admin,
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(initialData);
    });
  });

  it("displays loading state", () => {
    // Mock the getPages method to delay response
    (pagesService.getPages as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(<PagesForm projectId="test-project-id" />);

    // Verify loading state is displayed
    expect(screen.getByText("Loading pages...")).toBeInTheDocument();
  });

  it("validates the form before adding a page", () => {
    render(<PagesForm initialData={initialData} />);

    // Try to add a page without a name
    fireEvent.change(screen.getByLabelText("Page Name"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Path"), {
      target: { value: "/about" },
    });
    fireEvent.click(screen.getByText("Add Page"));

    // Verify validation error is displayed
    expect(screen.getByText("Page name is required")).toBeInTheDocument();

    // Try to add a page without a path
    fireEvent.change(screen.getByLabelText("Page Name"), {
      target: { value: "About" },
    });
    fireEvent.change(screen.getByLabelText("Path"), { target: { value: "" } });
    fireEvent.click(screen.getByText("Add Page"));

    // Verify validation error is displayed
    expect(screen.getByText("Page path is required")).toBeInTheDocument();

    // Try to add a page with an invalid path
    fireEvent.change(screen.getByLabelText("Path"), {
      target: { value: "about" },
    });
    fireEvent.click(screen.getByText("Add Page"));

    // Verify validation error is displayed
    expect(screen.getByText("Path must start with /")).toBeInTheDocument();
  });

  it("validates the form before editing a page", () => {
    render(<PagesForm initialData={initialData} />);

    // Find the edit button for the first page and click it
    const editButtons = screen.getAllByTitle("Edit page");
    fireEvent.click(editButtons[0]);

    // Clear the name
    fireEvent.change(screen.getByLabelText("Page Name"), {
      target: { value: "" },
    });

    // Try to save the changes
    fireEvent.click(screen.getByText("Save Changes"));

    // Verify validation error is displayed
    expect(screen.getByText("Page name is required")).toBeInTheDocument();

    // Add a name but set an invalid path
    fireEvent.change(screen.getByLabelText("Page Name"), {
      target: { value: "Updated Home" },
    });
    fireEvent.change(screen.getByLabelText("Path"), {
      target: { value: "invalid-path" },
    });

    // Try to save the changes
    fireEvent.click(screen.getByText("Save Changes"));

    // Verify validation error is displayed
    expect(screen.getByText("Path must start with /")).toBeInTheDocument();
  });

  it("validates component names before adding them", () => {
    render(<PagesForm initialData={initialData} />);

    // Expand the components section
    const expandButton = screen.getAllByTitle("Expand components")[0];
    fireEvent.click(expandButton);

    // Try to add a component with empty name
    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    // No new component should be added (still just Header and Footer)
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
    expect(screen.queryAllByTitle("Edit component").length).toBe(2);
  });

  it("handles editing component with escape key", () => {
    render(<PagesForm initialData={initialData} />);

    // Expand the components section
    const expandButton = screen.getAllByTitle("Expand components")[0];
    fireEvent.click(expandButton);

    // Start editing a component
    const editComponentButtons = screen.getAllByTitle("Edit component");
    fireEvent.click(editComponentButtons[0]);

    // Find the input field and change the value
    const editInput = screen.getByDisplayValue("Header");
    fireEvent.change(editInput, { target: { value: "Changed Header" } });

    // Press Escape to cancel edit
    fireEvent.keyDown(editInput, { key: "Escape" });

    // Original value should remain
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.queryByText("Changed Header")).not.toBeInTheDocument();
  });
});
