import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import DataModelForm from "../DataModelForm";
import { dataModelService } from "../../../services/dataModelService";
import { DataModel } from "../../../types/templates";

// Mock the dataModelService
vi.mock("../../../services/dataModelService", () => ({
  dataModelService: {
    getDataModel: vi.fn(),
    saveDataModel: vi.fn(),
  },
}));

describe("DataModelForm", () => {
  const mockProjectId = "test-project-id";
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("loads initial data correctly", async () => {
    const initialData: DataModel = {
      entities: [
        {
          name: "User",
          description: "User entity",
          fields: [
            { name: "id", type: "uuid", primaryKey: true, generated: true },
            { name: "email", type: "string", unique: true, required: true },
          ],
        },
      ],
      relationships: [],
    };

    render(
      <DataModelForm
        initialData={initialData}
        projectId={mockProjectId}
        onSuccess={mockOnSuccess}
      />
    );

    // Check that entity is displayed
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  test("handles entity creation correctly", async () => {
    (dataModelService.saveDataModel as any).mockResolvedValue({
      entities: [
        { name: "Product", description: "Product entity", fields: [] },
      ],
      relationships: [],
    });

    render(
      <DataModelForm projectId={mockProjectId} onSuccess={mockOnSuccess} />
    );

    // Click "Add Entity" button
    fireEvent.click(screen.getByText("Add Entity"));

    // Fill entity form
    fireEvent.change(screen.getByLabelText("Entity Name"), {
      target: { value: "Product" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Product entity" },
    });

    // Add entity
    fireEvent.click(screen.getByText("Add Entity").closest("button")!);

    // Submit form
    fireEvent.click(screen.getByText("Save Data Model"));

    await waitFor(() => {
      expect(dataModelService.saveDataModel).toHaveBeenCalledWith(
        mockProjectId,
        expect.objectContaining({
          entities: [
            expect.objectContaining({
              name: "Product",
              description: "Product entity",
            }),
          ],
          relationships: [],
        })
      );
    });
  });

  test("handles relationship creation with correct field names", async () => {
    const initialData: DataModel = {
      entities: [
        { name: "User", description: "User entity", fields: [] },
        { name: "Profile", description: "Profile entity", fields: [] },
      ],
      relationships: [],
    };

    (dataModelService.saveDataModel as any).mockResolvedValue({
      ...initialData,
      relationships: [
        {
          type: "oneToOne",
          from_entity: "User",
          to_entity: "Profile",
          field: "user_id",
        },
      ],
    });

    render(
      <DataModelForm
        initialData={initialData}
        projectId={mockProjectId}
        onSuccess={mockOnSuccess}
      />
    );

    // Click "Add Relationship" button
    fireEvent.click(screen.getByText("Add Relationship"));

    // Fill relationship form
    // Select relationship type
    const typeSelect = screen
      .getByLabelText("Relationship Type")
      .closest("button")!;
    fireEvent.click(typeSelect);
    fireEvent.click(screen.getByText("oneToOne"));

    // Select from entity
    const fromSelect = screen.getByLabelText("From Entity").closest("button")!;
    fireEvent.click(fromSelect);
    fireEvent.click(screen.getByText("User"));

    // Select to entity
    const toSelect = screen.getByLabelText("To Entity").closest("button")!;
    fireEvent.click(toSelect);
    fireEvent.click(screen.getByText("Profile"));

    // Enter field name
    fireEvent.change(screen.getByLabelText("Foreign Key Field"), {
      target: { value: "user_id" },
    });

    // Add relationship
    fireEvent.click(screen.getByText("Add Relationship").closest("button")!);

    // Submit form
    fireEvent.click(screen.getByText("Save Data Model"));

    await waitFor(() => {
      expect(dataModelService.saveDataModel).toHaveBeenCalledWith(
        mockProjectId,
        expect.objectContaining({
          entities: initialData.entities,
          relationships: [
            expect.objectContaining({
              type: "oneToOne",
              from_entity: "User",
              to_entity: "Profile",
              field: "user_id",
            }),
          ],
        })
      );
    });
  });

  test("converts numeric default values to strings", async () => {
    const mockSave = vi.fn().mockResolvedValue({
      entities: [
        {
          name: "Counter",
          description: "Counter entity",
          fields: [
            {
              name: "count",
              type: "integer",
              default: "0", // This should be sent as a string
            },
          ],
        },
      ],
      relationships: [],
    });

    (dataModelService.saveDataModel as any).mockImplementation(mockSave);

    render(
      <DataModelForm projectId={mockProjectId} onSuccess={mockOnSuccess} />
    );

    // Click "Add Entity" button
    fireEvent.click(screen.getByText("Add Entity"));

    // Fill entity form
    fireEvent.change(screen.getByLabelText("Entity Name"), {
      target: { value: "Counter" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Counter entity" },
    });

    // Add a field
    fireEvent.click(screen.getByText("Add Field"));
    fireEvent.change(screen.getByLabelText("Field Name"), {
      target: { value: "count" },
    });

    // Select field type
    const typeSelect = screen.getByLabelText("Field Type").closest("button")!;
    fireEvent.click(typeSelect);
    fireEvent.click(screen.getByText("integer"));

    // Set default value to 0 (numeric value)
    fireEvent.change(screen.getByLabelText("Default Value (optional)"), {
      target: { value: 0 },
    });

    // Add field
    fireEvent.click(screen.getByText("Add Field"));

    // Add entity
    fireEvent.click(screen.getByText("Add Entity"));

    // Submit form
    fireEvent.click(screen.getByText("Save Data Model"));

    await waitFor(() => {
      // The default value should be passed as a string
      expect(mockSave).toHaveBeenCalledWith(
        mockProjectId,
        expect.objectContaining({
          entities: [
            expect.objectContaining({
              fields: [
                expect.objectContaining({
                  default: "0", // Should be a string
                }),
              ],
            }),
          ],
        })
      );
    });
  });
});
