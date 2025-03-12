import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DataModelForm from "./DataModelForm";
import { dataModelService } from "../../services/dataModelService";

// Mock the dataModelService
jest.mock("../../services/dataModelService", () => ({
  dataModelService: {
    getDataModel: jest.fn(),
    saveDataModel: jest.fn(),
  },
}));

describe("DataModelForm Component", () => {
  const mockProjectId = "project-123";
  const mockInitialData = {
    entities: [
      {
        name: "User",
        description: "Application user information",
        fields: [
          {
            name: "id",
            type: "uuid",
            primaryKey: true,
            generated: true,
          },
          {
            name: "email",
            type: "string",
            unique: true,
            required: true,
          },
        ],
      },
    ],
    relationships: [
      {
        type: "oneToMany",
        from: "User",
        to: "Post",
        field: "user_id",
      },
    ],
  };

  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the dataModelService.getDataModel to return the mockInitialData
    (dataModelService.getDataModel as jest.Mock).mockResolvedValue(
      mockInitialData
    );
    (dataModelService.saveDataModel as jest.Mock).mockResolvedValue(
      mockInitialData
    );
  });

  test("renders with loading state and then shows form", async () => {
    render(<DataModelForm projectId={mockProjectId} />);

    // Initially shows loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Then shows form content
    await waitFor(() => {
      expect(screen.getByText(/Entities/i)).toBeInTheDocument();
    });
  });

  test("renders with initial data", async () => {
    render(<DataModelForm initialData={mockInitialData} />);

    // Shows entity from initial data
    await waitFor(() => {
      expect(screen.getByText("User")).toBeInTheDocument();
    });
  });

  test("allows adding a new entity", async () => {
    render(
      <DataModelForm projectId={mockProjectId} onSuccess={mockOnSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByText(/Add Entity/i)).toBeInTheDocument();
    });

    // Click "Add Entity" button
    fireEvent.click(screen.getByText(/Add Entity/i));

    // Fill in entity form
    fireEvent.change(screen.getByLabelText(/Entity Name/i), {
      target: { value: "Product" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Product information" },
    });

    // Submit the entity form
    fireEvent.click(screen.getByText(/Add Entity/i).closest("button")!);

    // Check that the entity was added
    await waitFor(() => {
      expect(screen.getByText("Product")).toBeInTheDocument();
    });
  });

  test("allows adding fields to an entity", async () => {
    render(
      <DataModelForm initialData={mockInitialData} projectId={mockProjectId} />
    );

    await waitFor(() => {
      expect(screen.getByText(/Add Entity/i)).toBeInTheDocument();
    });

    // Click "Add Entity" button
    fireEvent.click(screen.getByText(/Add Entity/i));

    // Fill in entity form
    fireEvent.change(screen.getByLabelText(/Entity Name/i), {
      target: { value: "Product" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Product information" },
    });

    // Add a field
    fireEvent.click(screen.getByText(/Add Field/i));

    // Fill in field form
    fireEvent.change(screen.getByLabelText(/Field Name/i), {
      target: { value: "name" },
    });

    // Submit the field form
    fireEvent.click(screen.getByText(/Add Field/i).closest("button")!);

    // Check that the field was added
    expect(screen.getByText("name")).toBeInTheDocument();
  });

  test("allows editing an entity", async () => {
    render(
      <DataModelForm initialData={mockInitialData} projectId={mockProjectId} />
    );

    await waitFor(() => {
      expect(screen.getByText("User")).toBeInTheDocument();
    });

    // Find and click the edit button for the User entity
    const editButtons = screen.getAllByRole("button", { name: "" }); // Lucide icons don't have accessible names
    fireEvent.click(editButtons[0]); // First edit button should be for the entity

    // Change the entity name
    fireEvent.change(screen.getByLabelText(/Entity Name/i), {
      target: { value: "UpdatedUser" },
    });

    // Submit the edit
    fireEvent.click(screen.getByText(/Update Entity/i));

    // Check that the entity was updated
    await waitFor(() => {
      expect(screen.getByText("UpdatedUser")).toBeInTheDocument();
    });
  });

  test("saves the data model when form is submitted", async () => {
    render(
      <DataModelForm
        initialData={mockInitialData}
        projectId={mockProjectId}
        onSuccess={mockOnSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Save Data Model/i)).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Save Data Model/i));

    // Check that saveDataModel was called
    await waitFor(() => {
      expect(dataModelService.saveDataModel).toHaveBeenCalledWith(
        mockProjectId,
        expect.objectContaining({
          entities: expect.any(Array),
          relationships: expect.any(Array),
        })
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  test("displays validation errors for entity form", async () => {
    render(<DataModelForm projectId={mockProjectId} />);

    await waitFor(() => {
      expect(screen.getByText(/Add Entity/i)).toBeInTheDocument();
    });

    // Click "Add Entity" button
    fireEvent.click(screen.getByText(/Add Entity/i));

    // Submit without filling required fields
    fireEvent.click(screen.getByText(/Add Entity/i).closest("button")!);

    // Check for validation error
    expect(screen.getByText(/Entity name is required/i)).toBeInTheDocument();
  });
});
