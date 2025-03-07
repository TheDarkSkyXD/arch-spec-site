import React, { useState } from "react";
import TechStackSelector from "../components/TechStackSelector";
import { TechStackSelection } from "../types/techStack";

/**
 * Page for tech stack compatibility selection.
 */
const TechStackCompatibilityPage: React.FC = () => {
  const [isCompatible, setIsCompatible] = useState<boolean>(true);
  const [currentSelection, setCurrentSelection] = useState<TechStackSelection>(
    {}
  );

  // Handle selection change
  const handleSelectionChange = (
    selection: TechStackSelection,
    compatible: boolean
  ) => {
    setCurrentSelection(selection);
    setIsCompatible(compatible);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Tech Stack Compatibility Checker
        </h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              Select technologies to build your stack and check compatibility
              between your choices. The system will automatically filter options
              based on compatibility and show any issues.
            </p>

            <TechStackSelector
              initialSelection={currentSelection}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>

        {Object.keys(currentSelection).length > 0 && (
          <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Your Current Selection</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(currentSelection).map(
                  ([key, value]) =>
                    value && (
                      <div key={key} className="border p-3 rounded">
                        <span className="font-medium text-gray-700">
                          {key
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                          :
                        </span>
                        <span className="ml-2">{value}</span>
                      </div>
                    )
                )}
              </div>

              <div
                className={`mt-6 p-3 rounded ${
                  isCompatible ? "bg-green-100" : "bg-yellow-100"
                }`}
              >
                <p className="font-medium">
                  Status:{" "}
                  {isCompatible ? "Compatible ✓" : "Compatibility Issues ⚠️"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechStackCompatibilityPage;
