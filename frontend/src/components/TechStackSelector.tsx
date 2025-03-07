import React, { useState, useEffect } from "react";
import {
  TechStackSelection,
  CompatibilityResult,
  TechStackData,
} from "../types/techStack";
import { techStackService } from "../services/techStackService";
import {
  checkTechStackCompatibility,
  getCompatibleOptions,
  filterCompatibleOptions,
  formatCompatibilityIssues,
} from "../utils/techStackCompatibility";

interface TechStackSelectorProps {
  initialSelection?: TechStackSelection;
  onSelectionChange?: (
    selection: TechStackSelection,
    isCompatible: boolean
  ) => void;
}

/**
 * A component for selecting compatible tech stack options.
 */
const TechStackSelector: React.FC<TechStackSelectorProps> = ({
  initialSelection = {},
  onSelectionChange,
}) => {
  // State for tech stack selection
  const [selection, setSelection] =
    useState<TechStackSelection>(initialSelection);

  // State for available options
  const [allOptions, setAllOptions] = useState<TechStackData | null>(null);

  // State for compatible options
  const [compatibleOptions, setCompatibleOptions] = useState<
    Record<string, string[]>
  >({});

  // State for compatibility result
  const [compatibilityResult, setCompatibilityResult] =
    useState<CompatibilityResult>({
      is_compatible: true,
      compatibility_issues: [],
      compatible_options: {},
    });

  // State for loading status
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch all technology options on component mount
  useEffect(() => {
    const fetchTechOptions = async () => {
      setLoading(true);
      try {
        const options = await techStackService.getAllTechnologyOptions();
        setAllOptions(options);
      } catch (error) {
        console.error("Error fetching tech options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechOptions();
  }, []);

  // Check compatibility when selection changes
  useEffect(() => {
    const checkCompatibility = async () => {
      // Skip empty selections
      if (
        Object.keys(selection).filter(
          (key) => selection[key as keyof TechStackSelection]
        ).length < 2
      ) {
        return;
      }

      setLoading(true);
      try {
        const result = await checkTechStackCompatibility(selection);
        setCompatibilityResult(result);

        // Update compatible options
        setCompatibleOptions(result.compatible_options || {});

        // Notify parent component of selection change
        if (onSelectionChange) {
          onSelectionChange(selection, result.is_compatible);
        }
      } catch (error) {
        console.error("Error checking compatibility:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCompatibility();
  }, [selection, onSelectionChange]);

  // Update compatible options when a specific technology is selected
  const updateCompatibleOptions = async (
    category: string,
    technology: string
  ) => {
    try {
      const options = await getCompatibleOptions(category, technology);
      setCompatibleOptions((prevOptions) => ({
        ...prevOptions,
        ...options,
      }));
    } catch (error) {
      console.error("Error updating compatible options:", error);
    }
  };

  // Handle selection change
  const handleSelectionChange = async (
    category: keyof TechStackSelection,
    value: string
  ) => {
    const newSelection = { ...selection, [category]: value };
    setSelection(newSelection);

    // Update compatible options for this category
    if (value) {
      await updateCompatibleOptions(category.toString(), value);
    }
  };

  // Render loading state
  if (loading && !allOptions) {
    return <div className="p-4">Loading tech stack options...</div>;
  }

  // Render error state if options couldn't be loaded
  if (!allOptions) {
    return (
      <div className="p-4 text-red-600">Failed to load tech stack options.</div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Tech Stack Selection</h2>

      {/* Display compatibility issues */}
      {!compatibilityResult.is_compatible &&
        compatibilityResult.compatibility_issues.length > 0 && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
            <h3 className="font-semibold">Compatibility Issues:</h3>
            <ul className="list-disc list-inside">
              {compatibilityResult.compatibility_issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

      {/* Frontend Framework Selection */}
      <div className="space-y-2">
        <label className="block font-medium">Frontend Framework</label>
        <select
          className="w-full p-2 border rounded"
          value={selection.frontend_framework || ""}
          onChange={(e) =>
            handleSelectionChange("frontend_framework", e.target.value)
          }
        >
          <option value="">Select Frontend Framework</option>
          {allOptions.frontend.frameworks.map((framework) => (
            <option key={framework.name} value={framework.name}>
              {framework.name}
            </option>
          ))}
        </select>
      </div>

      {/* State Management Selection (if frontend is selected) */}
      {selection.frontend_framework && (
        <div className="space-y-2">
          <label className="block font-medium">State Management</label>
          <select
            className="w-full p-2 border rounded"
            value={selection.state_management || ""}
            onChange={(e) =>
              handleSelectionChange("state_management", e.target.value)
            }
          >
            <option value="">Select State Management</option>
            {allOptions.frontend.frameworks
              .find((f) => f.name === selection.frontend_framework)
              ?.compatibility.stateManagement.map((sm) => (
                <option key={sm} value={sm}>
                  {sm}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Backend Framework Selection */}
      <div className="space-y-2">
        <label className="block font-medium">Backend Framework</label>
        <select
          className="w-full p-2 border rounded"
          value={selection.backend_framework || ""}
          onChange={(e) =>
            handleSelectionChange("backend_framework", e.target.value)
          }
        >
          <option value="">Select Backend Framework</option>
          {allOptions.backend.frameworks.map((framework) => (
            <option key={framework.name} value={framework.name}>
              {framework.name}
            </option>
          ))}
        </select>
      </div>

      {/* Database Selection (if backend is selected) */}
      {selection.backend_framework && (
        <div className="space-y-2">
          <label className="block font-medium">Database</label>
          <select
            className="w-full p-2 border rounded"
            value={selection.database || ""}
            onChange={(e) => handleSelectionChange("database", e.target.value)}
          >
            <option value="">Select Database</option>
            {/* Filter databases based on compatibility with selected backend */}
            {compatibleOptions.databases
              ? [...allOptions.database.sql, ...allOptions.database.nosql]
                  .filter((db) =>
                    compatibleOptions.databases?.includes(db.name)
                  )
                  .map((db) => (
                    <option key={db.name} value={db.name}>
                      {db.name}
                    </option>
                  ))
              : [...allOptions.database.sql, ...allOptions.database.nosql].map(
                  (db) => (
                    <option key={db.name} value={db.name}>
                      {db.name}
                    </option>
                  )
                )}
          </select>
        </div>
      )}

      {/* ORM Selection (if database and backend are selected) */}
      {selection.database && selection.backend_framework && (
        <div className="space-y-2">
          <label className="block font-medium">ORM / Database Access</label>
          <select
            className="w-full p-2 border rounded"
            value={selection.orm || ""}
            onChange={(e) => handleSelectionChange("orm", e.target.value)}
          >
            <option value="">Select ORM</option>
            {compatibleOptions.orms &&
              compatibleOptions.orms.map((orm) => (
                <option key={orm} value={orm}>
                  {orm}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Compatibility Status */}
      <div
        className={`p-3 rounded ${
          compatibilityResult.is_compatible
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        <p className="font-medium">
          {compatibilityResult.is_compatible
            ? "Your selected tech stack is compatible!"
            : "There are compatibility issues with your selection."}
        </p>
      </div>
    </div>
  );
};

export default TechStackSelector;
