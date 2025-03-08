import React, { useState, useEffect, useMemo } from "react";
import { TechRegistry } from "../../api/techRegistryApi";
import {
  useTechRegistry,
  useRefreshTechRegistry,
  useTechCategories,
  useTechnologies,
  useTechSubcategories,
} from "../../hooks/useDataQueries";

const TechRegistryView: React.FC = () => {
  // Use React Query for data fetching and caching
  const { data: response, isLoading, error: queryError } = useTechRegistry();
  const { data: categoriesData } = useTechCategories();
  const { refreshTechRegistry } = useRefreshTechRegistry();

  // Get subcategories when a category is selected
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const { data: subcategoriesData } = useTechSubcategories(selectedCategory);

  // Get technologies based on category/subcategory selection
  const { data: technologiesData } = useTechnologies(
    selectedCategory,
    selectedSubcategory
  );

  const [registryData, setRegistryData] = useState<TechRegistry | null>(null);
  const [source, setSource] = useState<string>("unknown");
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTechnologies, setFilteredTechnologies] = useState<string[]>(
    []
  );
  const [activeTab, setActiveTab] = useState("browse");

  // Process and prepare data when response is received
  useEffect(() => {
    if (response) {
      setRegistryData(response.data);
      setSource(response.source || "unknown");
      setError(null);
    } else if (queryError) {
      setError("Failed to load tech registry data");
      setRegistryData(null);
    }
  }, [response, queryError]);

  // Use effect to filter technologies based on search query and selection
  useEffect(() => {
    if (!registryData) {
      setFilteredTechnologies([]);
      return;
    }

    // If no category is selected or "All Categories" is selected, show all technologies
    let techsToFilter: string[] = [];

    if (!selectedCategory && registryData.all_technologies) {
      // Use all_technologies if available
      techsToFilter = registryData.all_technologies;
    } else if (!selectedCategory) {
      // Otherwise collect all technologies from all categories
      techsToFilter = [];
      Object.entries(registryData).forEach(([category, subcategories]) => {
        // Skip special properties
        if (
          ["_id", "all_technologies", "last_updated", "version"].includes(
            category
          )
        ) {
          return;
        }

        // Only process objects (categories with subcategories)
        if (
          typeof subcategories === "object" &&
          subcategories !== null &&
          !Array.isArray(subcategories)
        ) {
          Object.values(subcategories).forEach((techs) => {
            if (Array.isArray(techs)) {
              techsToFilter.push(...techs);
            }
          });
        }
      });
    } else if (technologiesData) {
      // Use the data from our hook if a category is selected
      techsToFilter = technologiesData;
    }

    // Filter technologies based on search query if provided
    if (searchQuery) {
      const filtered = techsToFilter.filter((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTechnologies(filtered);
    } else {
      setFilteredTechnologies(techsToFilter);
    }
  }, [searchQuery, technologiesData, selectedCategory, registryData]);

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

  // Create techInfoMap at the component level, not inside render function
  const techInfoMap = useMemo(() => {
    if (!response?.data)
      return new Map<string, { category: string; subcategory: string }>();

    const infoMap = new Map<
      string,
      { category: string; subcategory: string }
    >();
    Object.entries(response.data).forEach(([category, subcategories]) => {
      // Skip if this is not a category object with subcategories
      if (
        typeof subcategories !== "object" ||
        subcategories === null ||
        Array.isArray(subcategories)
      )
        return;

      // Skip special properties
      if (
        ["_id", "all_technologies", "last_updated", "version"].includes(
          category
        )
      )
        return;

      Object.entries(subcategories as Record<string, unknown>).forEach(
        ([subcategory, techs]) => {
          // Skip if not an array of technologies
          if (!Array.isArray(techs)) return;

          techs.forEach((tech: string) => {
            infoMap.set(tech, { category, subcategory });
          });
        }
      );
    });

    return infoMap;
  }, [response?.data]);

  // Enhanced category and subcategory selectors
  const renderFilters = () => {
    if (!response?.data) return null;

    return (
      <div className="mb-6 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-base font-medium text-gray-700 dark:text-slate-200 mb-3">
          Filter Technologies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter technology name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Category selector */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("");
              }}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-700 dark:text-slate-200"
            >
              <option value="">All Categories</option>
              {categoriesData &&
                categoriesData.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

          {/* Subcategory selector */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
              Subcategory
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={!selectedCategory}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-400 dark:disabled:cursor-not-allowed bg-white dark:bg-slate-700 dark:text-slate-200"
            >
              <option value="">All Subcategories</option>
              {subcategoriesData &&
                subcategoriesData.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
            </select>
          </div>

          {/* Reset button */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setSelectedSubcategory("");
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Tab navigation
  const renderTabs = () => {
    return (
      <div className="mb-4">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "browse"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600"
              }`}
              onClick={() => setActiveTab("browse")}
            >
              Browse Technologies
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "json"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600"
              }`}
              onClick={() => setActiveTab("json")}
            >
              JSON View
            </button>
            <button
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "metadata"
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600"
              }`}
              onClick={() => setActiveTab("metadata")}
            >
              Metadata
            </button>
          </nav>
        </div>
      </div>
    );
  };

  // Render technologies in a grid or list layout
  const renderTechnologiesView = () => {
    // Early return if no data
    if (!registryData) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-slate-400">
          No technology registry data available.
        </div>
      );
    }

    // Handle case with technologies to display
    if (filteredTechnologies.length > 0) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTechnologies.map((tech) => {
              // Get category and subcategory for this tech if available
              const techInfo = techInfoMap.get(tech);

              return (
                <div
                  key={tech}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <h4 className="font-medium text-slate-800 dark:text-slate-200">
                    {tech}
                  </h4>
                  {techInfo && (
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md">
                        {techInfo.category}
                      </span>
                      <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-md">
                        {techInfo.subcategory}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // No technologies match the filters
    return (
      <div className="text-center py-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
        <p className="text-slate-500 dark:text-slate-400">
          No technologies match the current filters
        </p>
        <button
          onClick={() => {
            setSearchQuery("");
            setSelectedCategory("");
            setSelectedSubcategory("");
          }}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
        >
          Clear Filters
        </button>
      </div>
    );
  };

  // Render JSON view with syntax highlighting
  const renderJsonView = () => {
    if (isLoading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin mx-auto h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          Error loading data. Please try again.
        </div>
      );
    }

    if (!registryData) {
      return (
        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
          No data available. Please try refreshing.
        </div>
      );
    }

    return (
      <div
        className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-auto"
        style={{ maxHeight: "calc(100vh - 16rem)" }}
      >
        <pre className="text-green-400 text-sm whitespace-pre-wrap text-left">
          {JSON.stringify(registryData, null, 2)}
        </pre>
      </div>
    );
  };

  // Render metadata and stats about the tech registry
  const renderMetadataView = () => {
    if (!registryData) {
      return (
        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
          No metadata available
        </div>
      );
    }

    // Extract metadata
    const metadata = {
      version: registryData.version || "Unknown",
      lastUpdated: registryData.last_updated
        ? new Date(registryData.last_updated).toLocaleString()
        : "Unknown",
      source: source || "Unknown",
      totalTechnologies: registryData.all_technologies?.length || "Unknown",
      categoryCount: Object.keys(registryData).filter(
        (key) =>
          !["_id", "all_technologies", "last_updated", "version"].includes(key)
      ).length,
    };

    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
          Registry Information
        </h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </dt>
              <dd className="text-base font-semibold text-slate-900 dark:text-slate-200">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
            Tech Registry
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
            Browse and filter available technologies in the registry
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-slate-300"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
          <button
            onClick={handleDownloadJson}
            disabled={!registryData}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export JSON
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center p-4 text-red-800 dark:text-red-400 rounded-lg bg-red-50 dark:bg-red-900/20 mb-4">
          <svg
            className="flex-shrink-0 w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-1 text-red-700 dark:text-red-300">
              Try refreshing the page or contact an administrator.
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="p-10 text-center text-slate-700 dark:text-slate-300">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-primary-600 dark:text-primary-400"
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
              {renderFilters()}
              {renderTechnologiesView()}
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
