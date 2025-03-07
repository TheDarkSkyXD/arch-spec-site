import { useState, useEffect } from "react";
import { Loader, RefreshCw, Download, Save } from "lucide-react";
import axios from "axios";
import JsonEditor from "../common/JsonEditor";

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
}

const TechStackView = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [techStackData, setTechStackData] = useState<TechStackData | null>(
    null
  );
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchTechStackData();
  }, []);

  const fetchTechStackData = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await axios.get(`${API_URL}/api/tech-stack/options`);

      setTechStackData(response.data);
      setHasChanges(false);
    } catch (err) {
      console.error("Failed to fetch tech stack data:", err);
      setError("Failed to load tech stack data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadJson = () => {
    if (!techStackData) return;

    const dataStr = JSON.stringify(techStackData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataUri);
    downloadAnchorNode.setAttribute("download", "tech-stack-data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleJsonEdit = (edit: { updated_src: TechStackData }) => {
    setTechStackData(edit.updated_src);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // This is a placeholder for the actual API call
    // In a real implementation, you would send the updated data to the server
    alert(
      "This feature is coming soon! Changes will be saved to the backend in the future."
    );
    setHasChanges(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="w-8 h-8 text-primary-500 animate-spin mr-3" />
        <span className="text-lg text-slate-600">
          Loading tech stack data...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchTechStackData}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center mx-auto"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
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

      {techStackData && (
        <JsonEditor<TechStackData>
          data={techStackData}
          onEdit={handleJsonEdit}
          readOnly={false}
        />
      )}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> In a production environment, saving changes
          would update the tech stack configuration in the database. This
          feature is currently in preview mode and changes will not persist
          after refreshing.
        </p>
      </div>
    </div>
  );
};

export default TechStackView;
