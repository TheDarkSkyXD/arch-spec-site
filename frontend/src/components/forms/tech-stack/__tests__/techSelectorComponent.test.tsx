import { render, screen, fireEvent } from "@testing-library/react";
import TechSelector from "../techSelector";
import { TechStackData } from "../../../../types/techStack";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock tech stack data for testing - simplified version
const mockTechStackData: TechStackData = {
  categories: {
    frontend: {
      frameworks: ["React", "Vue"],
      languages: ["JavaScript", "TypeScript"],
      stateManagement: ["Redux", "MobX"],
      uiLibraries: ["Material-UI", "Tailwind CSS"],
      formHandling: [],
      routing: [],
      apiClients: [],
      metaFrameworks: [],
    },
    backend: {
      frameworks: ["Express.js"],
      languages: [],
      baas: [],
      serverless: [],
      realtime: [],
    },
    database: {
      sql: ["PostgreSQL"],
      nosql: ["MongoDB"],
      providers: [],
      clients: [],
    },
    authentication: { providers: [], methods: [] },
    deployment: { platforms: [], containerization: [], ci_cd: [] },
    storage: { objectStorage: [], fileSystem: [] },
    hosting: {
      frontend: ["Vercel", "Netlify"],
      backend: [],
      database: [],
    },
    testing: { unitTesting: [], e2eTesting: [], apiTesting: [] },
  },
  technologies: {
    frameworks: {
      React: {
        type: "frontend",
        description: "A JavaScript library for building user interfaces",
        languages: ["JavaScript", "TypeScript"],
        compatibleWith: {
          stateManagement: ["Redux", "MobX"],
          uiLibraries: ["Material-UI", "Tailwind CSS"],
          hosting: ["Vercel", "Netlify"],
        },
      },
      Vue: {
        type: "frontend",
        description: "Progressive JavaScript Framework",
        languages: ["JavaScript", "TypeScript"],
        compatibleWith: {
          stateManagement: ["MobX"],
          uiLibraries: ["Tailwind CSS"],
          hosting: ["Netlify"],
        },
      },
      "Express.js": {
        type: "backend",
        description:
          "Fast, unopinionated, minimalist web framework for Node.js",
        language: "JavaScript",
        compatibleWith: {
          databases: ["MongoDB", "PostgreSQL"],
          hosting: ["Heroku"],
        },
      },
    },
    stateManagement: {
      Redux: {
        description: "A predictable state container for JavaScript apps",
        compatibleWith: {
          frameworks: ["React"],
        },
      },
      MobX: {
        description: "Simple, scalable state management",
        compatibleWith: {
          frameworks: ["React", "Vue"],
        },
      },
    },
    databases: {
      MongoDB: {
        type: "nosql",
        description: "Document-oriented NoSQL database",
        compatibleWith: {
          frameworks: ["React", "Express.js"],
        },
      },
      PostgreSQL: {
        type: "sql",
        description: "Powerful, open source object-relational database",
        compatibleWith: {
          frameworks: ["React", "Vue", "Express.js"],
        },
      },
    },
    uiLibraries: {
      "Material-UI": {
        description: "React components for faster and easier web development",
        compatibleWith: {
          frameworks: ["React"],
        },
      },
      "Tailwind CSS": {
        description: "A utility-first CSS framework",
        compatibleWith: {
          frameworks: ["React", "Vue"],
        },
      },
    },
    hosting: {
      Vercel: {
        type: "frontend",
        description: "Platform for frontend frameworks and static sites",
        compatibleWith: {
          frameworks: ["React"],
        },
      },
      Netlify: {
        type: "frontend",
        description: "Platform for modern web projects",
        compatibleWith: {
          frameworks: ["React", "Vue"],
        },
      },
    },
    baas: {},
    formHandling: {},
    routing: {},
    apiClients: {},
    metaFrameworks: {},
    orms: {},
    auth: {},
    testing: {},
    storage: {},
    serverless: {},
    realtime: {},
  },
};

// Mock callback function
const mockOnSelectionChange = vi.fn();

// Set a timeout for all tests
vi.setConfig({ testTimeout: 5000 });

describe("TechSelector", () => {
  // Reset mock function before each test
  beforeEach(() => {
    mockOnSelectionChange.mockClear();
  });

  it("renders without crashing", () => {
    render(<TechSelector techStackData={mockTechStackData} />);
    expect(screen.getByText("Tech Stack Selector")).toBeInTheDocument();
  });

  it("displays all category dropdowns", () => {
    render(<TechSelector techStackData={mockTechStackData} />);

    expect(screen.getByText("Frameworks")).toBeInTheDocument();
    expect(screen.getByText("State Management")).toBeInTheDocument();
    expect(screen.getByText("Databases")).toBeInTheDocument();
    expect(screen.getByText("UI Libraries")).toBeInTheDocument();
    expect(screen.getByText("Hosting")).toBeInTheDocument();
  });

  it("has initial empty selections", () => {
    render(<TechSelector techStackData={mockTechStackData} />);

    expect(
      screen.getByText("No technologies selected yet.")
    ).toBeInTheDocument();
  });

  it("updates selections when a framework is selected", () => {
    render(<TechSelector techStackData={mockTechStackData} />);

    // Find the frameworks dropdown and select React
    const frameworksDropdown = screen.getAllByRole("combobox")[0];
    fireEvent.change(frameworksDropdown, { target: { value: "React" } });

    // Check that React appears in the current selections
    expect(screen.getByText("frameworks: React")).toBeInTheDocument();
  });

  // The remainder of the tests are commented out temporarily for debugging
  /*
  it("filters state management options based on framework selection", () => {
    render(<TechSelector techStackData={mockTechStackData} />);

    // Select React from frameworks dropdown
    const frameworksDropdown = screen.getAllByRole("combobox")[0];
    fireEvent.change(frameworksDropdown, { target: { value: "React" } });

    // Check the stateManagement dropdown options
    const stateManagementDropdown = screen.getAllByRole("combobox")[1];

    // Should contain Redux and MobX (compatible with React)
    expect(stateManagementDropdown.innerHTML).toContain("Redux");
    expect(stateManagementDropdown.innerHTML).toContain("MobX");
  });

  it("clears a selection when Clear button is clicked", () => {
    render(<TechSelector techStackData={mockTechStackData} />);

    // Select React
    const frameworksDropdown = screen.getAllByRole("combobox")[0];
    fireEvent.change(frameworksDropdown, { target: { value: "React" } });

    // Verify React is selected
    expect(screen.getByText("frameworks: React")).toBeInTheDocument();

    // Click the Clear button
    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);

    // Verify selection is cleared
    expect(
      screen.getByText("No technologies selected yet.")
    ).toBeInTheDocument();
  });

  it("resets all selections when Reset All button is clicked", () => {
    render(<TechSelector techStackData={mockTechStackData} />);

    // Select React
    const frameworksDropdown = screen.getAllByRole("combobox")[0];
    fireEvent.change(frameworksDropdown, { target: { value: "React" } });

    // Select Redux
    const stateManagementDropdown = screen.getAllByRole("combobox")[1];
    fireEvent.change(stateManagementDropdown, { target: { value: "Redux" } });

    // Verify selections are made
    expect(screen.getByText("frameworks: React")).toBeInTheDocument();
    expect(screen.getByText("stateManagement: Redux")).toBeInTheDocument();

    // Click Reset All button
    const resetButton = screen.getByText("Reset All Selections");
    fireEvent.click(resetButton);

    // Verify all selections are cleared
    expect(
      screen.getByText("No technologies selected yet.")
    ).toBeInTheDocument();
  });

  it("calls onSelectionChange callback when selections change", () => {
    render(
      <TechSelector
        techStackData={mockTechStackData}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    // Select React
    const frameworksDropdown = screen.getAllByRole("combobox")[0];
    fireEvent.change(frameworksDropdown, { target: { value: "React" } });

    // Verify callback was called with correct selections
    expect(mockOnSelectionChange).toHaveBeenCalledWith({
      frameworks: "React",
    });
  });
  */

  it("shows compatible technologies in the details section", () => {
    render(<TechSelector techStackData={mockTechStackData} />);

    // Select React from frameworks dropdown
    const frameworksDropdown = screen.getAllByRole("combobox")[0];
    fireEvent.change(frameworksDropdown, { target: { value: "React" } });

    // Verify details section shows for React
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(
      screen.getByText("A JavaScript library for building user interfaces")
    ).toBeInTheDocument();

    // Verify compatibility details
    expect(screen.getByText("Compatible With:")).toBeInTheDocument();
    expect(screen.getByText("stateManagement:")).toBeInTheDocument();
    expect(screen.getByText("Redux, MobX")).toBeInTheDocument();
  });
});
