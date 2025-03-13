import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ProjectBasicsForm from "../ProjectBasicsForm";
import { projectsService } from "../../../services/projectsService";
import { aiService } from "../../../services/aiService";
import { ToastProvider } from "../../../contexts/ToastContext";

// Mock the services
jest.mock("../../../services/projectsService");
jest.mock("../../../services/aiService");

describe("ProjectBasicsForm", () => {
  const mockProjectsService = projectsService as jest.Mocked<
    typeof projectsService
  >;
  const mockAiService = aiService as jest.Mocked<typeof aiService>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock implementations
    mockProjectsService.createProject.mockResolvedValue({
      id: "test-id",
      name: "Test Project",
      description: "Test Description",
      business_goals: ["Goal 1"],
      target_users: "Test Users",
      domain: "Test Domain",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    mockProjectsService.updateProject.mockResolvedValue({
      id: "test-id",
      name: "Updated Project",
      description: "Updated Description",
      business_goals: ["Updated Goal"],
      target_users: "Updated Users",
      domain: "Updated Domain",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    mockAiService.enhanceDescription.mockResolvedValue(
      "Enhanced project description with improved clarity and technical precision."
    );

    mockAiService.enhanceBusinessGoals.mockResolvedValue([
      "Achieve 10,000 daily active users within six months of launch",
      "Generate $50,000 in monthly recurring revenue through premium subscriptions by Q4 2023",
      "Maintain a user retention rate of at least 70% after 30 days",
    ]);
  });

  // Helper function to render the component with ToastProvider
  const renderForm = (props = {}) => {
    return render(
      <ToastProvider>
        <ProjectBasicsForm {...props} />
      </ToastProvider>
    );
  };

  test("renders form with initial empty fields", () => {
    renderForm();

    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/business goals/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target users/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/domain/i)).toBeInTheDocument();
  });

  test("renders form with initial data", () => {
    const initialData = {
      id: "test-id",
      name: "Test Project",
      description: "Test Description",
      business_goals: ["Goal 1"],
      target_users: "Test Users",
      domain: "Test Domain",
    };

    renderForm({ initialData });

    expect(screen.getByLabelText(/project name/i)).toHaveValue("Test Project");
    expect(screen.getByLabelText(/description/i)).toHaveValue(
      "Test Description"
    );
    expect(screen.getByText("Goal 1")).toBeInTheDocument();
    expect(screen.getByLabelText(/target users/i)).toHaveValue("Test Users");
    expect(screen.getByLabelText(/domain/i)).toHaveValue("Test Domain");
  });

  test("submits form and creates new project", async () => {
    const onSuccessMock = jest.fn();
    renderForm({ onSuccess: onSuccessMock });

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/project name/i), {
      target: { value: "New Project" },
    });

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "New Description with enough characters" },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/save project/i));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(mockProjectsService.createProject).toHaveBeenCalledWith({
        name: "New Project",
        description: "New Description with enough characters",
        business_goals: [],
        target_users: "",
        domain: "",
      });
      expect(onSuccessMock).toHaveBeenCalledWith("test-id");
    });
  });

  test("enhances description when enhance button is clicked", async () => {
    renderForm();

    // Fill in the description field
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A basic app for tracking workouts" },
    });

    // Click the enhance button (Sparkles icon)
    const enhanceButton = screen.getByTitle("Enhance with AI");
    fireEvent.click(enhanceButton);

    // Wait for the enhancement to complete
    await waitFor(() => {
      expect(mockAiService.enhanceDescription).toHaveBeenCalledWith(
        "A basic app for tracking workouts"
      );

      // Check if the description field was updated with the enhanced text
      expect(screen.getByLabelText(/description/i)).toHaveValue(
        "Enhanced project description with improved clarity and technical precision."
      );
    });
  });

  test("shows loading indicator while enhancing description", async () => {
    // Mock a delayed response from the AI service
    mockAiService.enhanceDescription.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return "Enhanced project description with improved clarity and technical precision.";
    });

    renderForm();

    // Fill in the description field
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A basic app for tracking workouts" },
    });

    // Click the enhance button
    const enhanceButton = screen.getByTitle("Enhance with AI");
    fireEvent.click(enhanceButton);

    // Check for loading indicator
    expect(screen.getByText(/enhancing description/i)).toBeInTheDocument();

    // Wait for the enhancement to complete
    await waitFor(() => {
      expect(screen.getByLabelText(/description/i)).toHaveValue(
        "Enhanced project description with improved clarity and technical precision."
      );

      // Loading indicator should be gone
      expect(
        screen.queryByText(/enhancing description/i)
      ).not.toBeInTheDocument();
    });
  });

  test("adds and removes business goals", async () => {
    renderForm();

    // No business goals initially
    expect(screen.queryByText("Test Goal")).not.toBeInTheDocument();

    // Type a new goal
    fireEvent.change(screen.getByPlaceholderText(/add a business goal/i), {
      target: { value: "Test Goal" },
    });

    // Click the add button
    fireEvent.click(screen.getByRole("button", { name: /plusCircle/i }));

    // Goal should now be visible
    expect(screen.getByText("Test Goal")).toBeInTheDocument();

    // Now remove it
    fireEvent.click(screen.getByRole("button", { name: /trash2/i }));

    // Goal should be gone
    expect(screen.queryByText("Test Goal")).not.toBeInTheDocument();
  });

  test("enhances business goals when enhance goals button is clicked", async () => {
    renderForm();

    // Fill in the description field
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A fitness tracking application for mobile devices" },
    });

    // Add a business goal
    fireEvent.change(screen.getByPlaceholderText(/add a business goal/i), {
      target: { value: "Make money" },
    });
    fireEvent.click(screen.getByRole("button", { name: /plusCircle/i }));

    // Add another goal
    fireEvent.change(screen.getByPlaceholderText(/add a business goal/i), {
      target: { value: "Get users" },
    });
    fireEvent.click(screen.getByRole("button", { name: /plusCircle/i }));

    // The enhance goals button should now be visible with text "Enhance Goals"
    const enhanceGoalsButton = screen.getByText(/enhance goals/i);
    expect(enhanceGoalsButton).toBeInTheDocument();

    // Click the enhance goals button
    fireEvent.click(enhanceGoalsButton);

    // Wait for the enhancement to complete
    await waitFor(() => {
      expect(mockAiService.enhanceBusinessGoals).toHaveBeenCalledWith(
        "A fitness tracking application for mobile devices",
        ["Make money", "Get users"]
      );

      // Check if the business goals were updated
      expect(
        screen.getByText(
          "Achieve 10,000 daily active users within six months of launch"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Generate $50,000 in monthly recurring revenue through premium subscriptions by Q4 2023"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Maintain a user retention rate of at least 70% after 30 days"
        )
      ).toBeInTheDocument();
    });
  });

  test("generates business goals without existing goals", async () => {
    renderForm();

    // Fill in the description field
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A fitness tracking application for mobile devices" },
    });

    // The button should show "Generate Goals" when no goals exist
    const generateGoalsButton = screen.getByText(/generate goals/i);
    expect(generateGoalsButton).toBeInTheDocument();

    // Click the generate goals button
    fireEvent.click(generateGoalsButton);

    // Wait for the generation to complete
    await waitFor(() => {
      expect(mockAiService.enhanceBusinessGoals).toHaveBeenCalledWith(
        "A fitness tracking application for mobile devices",
        [] // Empty array for goals
      );

      // Check if the business goals were added
      expect(
        screen.getByText(
          "Achieve 10,000 daily active users within six months of launch"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Generate $50,000 in monthly recurring revenue through premium subscriptions by Q4 2023"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Maintain a user retention rate of at least 70% after 30 days"
        )
      ).toBeInTheDocument();
    });
  });

  test("shows loading indicator while enhancing business goals", async () => {
    // Mock a delayed response from the AI service
    mockAiService.enhanceBusinessGoals.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return [
        "Achieve 10,000 daily active users within six months of launch",
        "Generate $50,000 in monthly recurring revenue through premium subscriptions by Q4 2023",
      ];
    });

    renderForm();

    // Fill in the description field
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A fitness tracking application for mobile devices" },
    });

    // Add a business goal
    fireEvent.change(screen.getByPlaceholderText(/add a business goal/i), {
      target: { value: "Make money" },
    });
    fireEvent.click(screen.getByRole("button", { name: /plusCircle/i }));

    // Click the enhance goals button
    const enhanceGoalsButton = screen.getByText(/enhance goals/i);
    fireEvent.click(enhanceGoalsButton);

    // Check for loading indicator
    expect(screen.getByText(/enhancing business goals/i)).toBeInTheDocument();

    // Wait for the enhancement to complete
    await waitFor(() => {
      expect(
        screen.getByText(
          "Achieve 10,000 daily active users within six months of launch"
        )
      ).toBeInTheDocument();

      // Loading indicator should be gone
      expect(
        screen.queryByText(/enhancing business goals/i)
      ).not.toBeInTheDocument();
    });
  });

  test("shows generating indicator while generating business goals", async () => {
    // Mock a delayed response from the AI service
    mockAiService.enhanceBusinessGoals.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return [
        "Achieve 10,000 daily active users within six months of launch",
        "Generate $50,000 in monthly recurring revenue through premium subscriptions by Q4 2023",
      ];
    });

    renderForm();

    // Fill in the description field
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A fitness tracking application for mobile devices" },
    });

    // Click the generate goals button
    const generateGoalsButton = screen.getByText(/generate goals/i);
    fireEvent.click(generateGoalsButton);

    // Check for loading indicator specific to generation
    expect(screen.getByText(/generating business goals/i)).toBeInTheDocument();

    // Wait for the generation to complete
    await waitFor(() => {
      expect(
        screen.getByText(
          "Achieve 10,000 daily active users within six months of launch"
        )
      ).toBeInTheDocument();

      // Loading indicator should be gone
      expect(
        screen.queryByText(/generating business goals/i)
      ).not.toBeInTheDocument();
    });
  });
});
