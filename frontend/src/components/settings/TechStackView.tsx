import { useState, useEffect } from "react";
import { Loader, RefreshCw, Download, Save } from "lucide-react";
import JsonEditor from "../common/JsonEditor";
import { useTechStack, useRefreshTechStack } from "../../hooks/useDataQueries";
import { TechStackData } from "../../types/techStack";
import { techStackService } from "../../services/techStackService";

// Use a type assertion to make TechStackData compatible with Record<string, unknown>
// This is needed because JsonEditor expects a Record<string, unknown>
type TechStackDataAsRecord = TechStackData & Record<string, unknown>;

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
    }
  }, [apiTechStackData]);

  // Check if there are changes
  useEffect(() => {
    if (techStackData && originalData) {
      const isEqual =
        JSON.stringify(techStackData) === JSON.stringify(originalData);
      setHasChanges(!isEqual);
    }
  }, [techStackData, originalData]);

  const handleJsonEdit = (edit: { updated_src: TechStackData }) => {
    setTechStackData(edit.updated_src);
  };

  const handleSaveChanges = async () => {
    if (!techStackData) return;

    try {
      setError(null);
      await techStackService.updateTechStack(techStackData);
      setOriginalData(JSON.parse(JSON.stringify(techStackData)));
      setHasChanges(false);
    } catch (err) {
      console.error("Error saving tech stack data:", err);
      setError("Failed to save changes. Please try again.");
    }
  };

  const handleDownloadJson = () => {
    if (!techStackData) return;

    try {
      const jsonStr = JSON.stringify(techStackData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tech-stack-data.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading JSON:", err);
      setError("Failed to download JSON. Please try again.");
    }
  };

  const fetchTechStackData = () => {
    refreshTechStack();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b dark:border-slate-700 pb-4">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Tech Stack Management
        </h2>
        <div className="flex space-x-2">
          <button
            className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded flex items-center gap-1"
            onClick={fetchTechStackData}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>Refresh</span>
          </button>
          <button
            className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded flex items-center gap-1"
            onClick={handleDownloadJson}
            disabled={!techStackData}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          <button
            className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded flex items-center gap-1"
            onClick={handleSaveChanges}
            disabled={!hasChanges}
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {queryError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
          Error loading tech stack data. Please refresh the page or try again
          later.
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {hasChanges && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-800 dark:text-yellow-300">
          You have unsaved changes.
        </div>
      )}

      {isLoading ? (
        <div className="p-20 flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="p-6 pt-0">
          {techStackData && (
            <JsonEditor<TechStackDataAsRecord>
              data={techStackData as TechStackDataAsRecord}
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
