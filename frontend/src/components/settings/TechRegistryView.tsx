import React, { useState, useEffect } from "react";
import { TechRegistry } from "../../api/techRegistryApi";
import {
  useTechRegistry,
  useRefreshTechRegistry,
} from "../../hooks/useDataQueries";

const TechRegistryView: React.FC = () => {
  // Use React Query for data fetching and caching
  const { data: response, isLoading, error: queryError } = useTechRegistry();
  const { refreshTechRegistry } = useRefreshTechRegistry();

  const [registryData, setRegistryData] = useState<TechRegistry | null>(null);
  const [source, setSource] = useState<string>("unknown");
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredTechnologies, setFilteredTechnologies] = useState<string[]>(
    []
  );
  const [activeTab, setActiveTab] = useState("browse");

  // Update component state when data is fetched
  useEffect(() => {
    if (response) {
      setRegistryData(response.data);
      setSource(response.source || "unknown");
      setError(null);
    }
  }, [response]);

  // Set error if query fails
  useEffect(() => {
    if (queryError) {
      console.error("Failed to fetch registry data:", queryError);
      setError("Failed to load tech registry. Please try again later.");
    }
  }, [queryError]);

  // Filter technologies when search query or selected category changes
  useEffect(() => {
    if (!registryData) return;

    try {
      let technologies: string[] = [];

      // If all_technologies exists, use it for filtering
      if (registryData.all_technologies) {
        technologies = [...registryData.all_technologies];
      } else {
        // Otherwise, build the list from categories and subcategories
        registryData.categories.forEach((category) => {
          category.subcategories.forEach((subcategory) => {
            technologies = [...technologies, ...subcategory.technologies];
          });
        });
      }

      // Filter by category if one is selected
      if (selectedCategory) {
        const category = registryData.categories.find(
          (c) => c.name === selectedCategory
        );
        if (category) {
          technologies = [];
          category.subcategories.forEach((subcategory) => {
            technologies = [...technologies, ...subcategory.technologies];
          });
        }
      }

      // Filter by search query
      if (searchQuery) {
        technologies = technologies.filter((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Remove duplicates and sort
      setFilteredTechnologies([...new Set(technologies)].sort());
    } catch (err) {
      console.error("Error processing tech registry data:", err);
      setError(
        "Error processing registry data. The data format may be unexpected."
      );
    }
  }, [registryData, searchQuery, selectedCategory]);

  const handleRefresh = () => {
    // Use React Query's invalidation to refresh data
    refreshTechRegistry();
  };

  const handleDownloadJson = () => {
    if (!registryData) return;

    try {
      const jsonStr = JSON.stringify(registryData, null, 2);
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "tech_registry.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (err) {
      console.error("Error exporting JSON:", err);
      setError("Failed to export JSON data");
    }
  };

  // Simple category selector
  const renderCategorySelector = () => {
    if (!registryData || !registryData.categories) return null;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Categories</option>
          {registryData.categories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Tab navigation
  const renderTabs = () => {
    return (
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6">
          {["browse", "json", "metadata"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
    );
  };

  // Render technologies in a grid
  const renderTechnologiesGrid = () => {
    if (filteredTechnologies.length === 0) {
      return (
        <div className="p-6 text-center text-gray-500 border rounded-md">
          No technologies found matching your criteria.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTechnologies.map((tech) => (
          <div
            key={tech}
            className="p-3 border rounded-md bg-gray-50 hover:bg-gray-100"
          >
            {tech}
          </div>
        ))}
      </div>
    );
  };

  // JSON view tab - Enhanced with better styling
  const renderJsonView = () => {
    if (!registryData) return null;

    return (
      <div className="bg-white border rounded-md shadow-sm">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-medium">Tech Registry - JSON Data</h3>
          <span className="text-xs text-gray-500">Source: {source}</span>
        </div>
        <div className="overflow-auto p-0 max-h-[600px]">
          <pre
            className="text-xs text-left p-4 m-0 font-mono whitespace-pre overflow-x-auto"
            style={{
              backgroundColor: "#f8f9fa",
              color: "#333",
              tabSize: 2,
            }}
          >
            {JSON.stringify(registryData, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  // Metadata tab - Improved styling
  const renderMetadataView = () => {
    if (!registryData) return null;

    // Calculate total technologies by category
    const techCountsByCategory: Record<string, number> = {};
    registryData.categories.forEach((category) => {
      techCountsByCategory[category.name] = category.subcategories.reduce(
        (sum, subcat) => sum + subcat.technologies.length,
        0
      );
    });

    const totalTechs =
      registryData.all_technologies?.length ||
      Object.values(techCountsByCategory).reduce((a, b) => a + b, 0);

    return (
      <div className="space-y-6">
        {/* Overview card */}
        <div className="bg-white border rounded-md shadow-sm overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <h3 className="text-lg font-medium">Registry Overview</h3>
            <p className="text-sm text-gray-500 mt-1">
              Information about the tech registry and its contents
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            <div className="p-5 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Data Source
              </div>
              <div className="mt-1 text-2xl font-semibold text-indigo-600">
                {source}
              </div>
            </div>
            <div className="p-5 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Version
              </div>
              <div className="mt-1 text-2xl font-semibold text-indigo-600">
                {registryData.version || "N/A"}
              </div>
            </div>
            <div className="p-5 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Total Technologies
              </div>
              <div className="mt-1 text-2xl font-semibold text-indigo-600">
                {totalTechs}
              </div>
            </div>
            <div className="p-5 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Last Updated
              </div>
              <div className="mt-1 text-sm font-medium text-gray-800">
                {registryData.last_updated
                  ? new Date(registryData.last_updated).toLocaleString()
                  : "Unknown"}
              </div>
            </div>
          </div>
        </div>

        {/* Categories breakdown */}
        <div className="bg-white border rounded-md shadow-sm">
          <div className="bg-gray-50 p-4 border-b">
            <h3 className="text-lg font-medium">Categories Breakdown</h3>
            <p className="text-sm text-gray-500 mt-1">
              Technologies organized by categories and subcategories
            </p>
          </div>

          <div className="divide-y">
            {registryData.categories.map((category) => (
              <div key={category.name} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{category.name}</h4>
                  <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">
                    {techCountsByCategory[category.name]} technologies
                  </span>
                </div>

                <div className="ml-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-3">
                  {category.subcategories.map((subcat) => (
                    <div
                      key={subcat.name}
                      className="bg-gray-50 p-3 rounded-md border border-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">
                          {subcat.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {subcat.technologies.length}
                        </span>
                      </div>
                      {subcat.technologies.length <= 3 && (
                        <div className="mt-2 text-xs text-gray-600">
                          {subcat.technologies.join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Tech registry data is automatically synchronized between code and
          database
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Tech Registry</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            onClick={handleDownloadJson}
            disabled={!registryData}
            className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Export JSON
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-800 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="p-10 text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2">Loading tech registry data...</p>
        </div>
      ) : (
        <>
          {renderTabs()}

          {activeTab === "browse" && (
            <div>
              {/* Search input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Technologies
                </label>
                <input
                  type="text"
                  placeholder="Enter technology name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {renderCategorySelector()}

              <div className="mt-4">
                <div className="mb-2 text-sm text-gray-500">
                  Showing {filteredTechnologies.length} technologies
                </div>
                {renderTechnologiesGrid()}
              </div>
            </div>
          )}

          {activeTab === "json" && renderJsonView()}

          {activeTab === "metadata" && renderMetadataView()}
        </>
      )}
    </div>
  );
};

export default TechRegistryView;
