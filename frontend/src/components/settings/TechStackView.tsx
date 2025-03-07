import { useState, useEffect } from "react";
import { Loader, RefreshCw, Download, Save } from "lucide-react";
import axios from "axios";
import JsonEditor from "../common/JsonEditor";
import { useTechStack, useRefreshTechStack } from "../../hooks/useDataQueries";

interface TechStackData {
  techStackOptions: {
    [key: string]: {
      frameworks?: Array<{
        name: string;
        description: string;
        compatibility: Record<string, string[]>;
        [key: string]: unknown;
      }>;
      [key: string]: unknown;
    };
  };
  [key: string]: unknown;
}

const TechStackView = () => {
  const {
    data: apiTechStackData,
    isLoading,
    error: queryError,
  } = useTechStack();
  const { refreshTechStack } = useRefreshTechStack();

  const [techStackData, setTechStackData] = useState<TechStackData | null>(
    null
  );
  const [originalData, setOriginalData] = useState<TechStackData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update state when data is fetched
  useEffect(() => {
    if (apiTechStackData) {
      setTechStackData(apiTechStackData);
      setOriginalData(JSON.parse(JSON.stringify(apiTechStackData)));
      setError(null);
    }
  }, [apiTechStackData]);

  // Set error message if query fails
  useEffect(() => {
    if (queryError) {
      console.error("Failed to fetch tech stack data:", queryError);
      setError("Failed to load tech stack data. Please try again later.");
    }
  }, [queryError]);

  const handleJsonEdit = (edit: { updated_src: TechStackData }) => {
    setTechStackData(edit.updated_src);
    // Detect if there are any changes compared to the original data
    setHasChanges(
      JSON.stringify(edit.updated_src) !== JSON.stringify(originalData)
    );
  };

  const handleSaveChanges = async () => {
    if (!techStackData) return;

    try {
      await axios.put("/api/tech-stack", techStackData);
      // Update the original data reference after saving
      setOriginalData(JSON.parse(JSON.stringify(techStackData)));
      setHasChanges(false);
      // Refresh the data to sync with the backend
      refreshTechStack();
    } catch (err) {
      console.error("Error saving tech stack data:", err);
      setError("Failed to save changes. Please try again.");
    }
  };

  const handleDownloadJson = () => {
    if (!techStackData) return;

    try {
      const jsonStr = JSON.stringify(techStackData, null, 2);
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "tech_stack.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (err) {
      console.error("Error exporting JSON:", err);
      setError("Failed to export JSON data");
    }
  };

  const fetchTechStackData = () => {
    // Use React Query's invalidation to refresh data
    refreshTechStack();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tech Stack Data</h2>
          <div className="flex space-x-3">
            {hasChanges && (
              <button
                onClick={handleSaveChanges}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <Save className="w-4 h-4 mr-1.5" />
                Save Changes
              </button>
            )}
            <button
              onClick={fetchTechStackData}
              className="px-3 py-1.5 text-sm border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Refresh
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download JSON
            </button>
          </div>
        </div>

        <div className="text-sm text-slate-500 mb-4">
          <p>
            This view allows you to explore and edit the tech stack data used
            for compatibility checking.
          </p>
          <p className="mt-1">
            Changes made here will affect which technologies are compatible with
            each other in the application.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 mx-6 mb-6 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="p-10 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto text-primary-500" />
          <p className="mt-2">Loading tech stack data...</p>
        </div>
      ) : (
        <div className="p-6 pt-0">
          {techStackData && (
            <JsonEditor<TechStackData>
              data={techStackData}
              onEdit={handleJsonEdit}
              readOnly={false}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TechStackView;
