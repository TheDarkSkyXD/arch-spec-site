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
  const [filteredTechnologies, setFilteredTechnologies] = useState<string[]>([]);
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
        if (["_id", "all_technologies", "last_updated", "version"].includes(category)) {
          return;
        }
        
        // Only process objects (categories with subcategories)
        if (typeof subcategories === "object" && subcategories !== null && !Array.isArray(subcategories)) {
          Object.values(subcategories).forEach(techs => {
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
      <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="text-base font-medium text-gray-700 mb-3">
          Filter Technologies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter technology name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-9 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <svg
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
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
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("");
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Subcategory
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={!selectedCategory}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
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
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
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

  // Render technologies in a grid or list layout
  const renderTechnologiesView = () => {
    if (isLoading) {
      return <div className="text-center py-8">Loading technologies...</div>;
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-600">
          Error loading technologies: {error}
        </div>
      );
    }

    if (!filteredTechnologies || filteredTechnologies.length === 0) {
      return (
        <div className="text-center py-8 text-gray-600">
          No technologies found matching your criteria. Try adjusting your
          filters.
        </div>
      );
    }

    // Handler for clicking on category/subcategory labels
    const handleCategoryClick = (category: string) => {
      setSelectedCategory(category);
      setSelectedSubcategory(""); // Reset subcategory when changing category
      setActiveTab("browse"); // Ensure we're on browse tab
    };

    const handleSubcategoryClick = (category: string, subcategory: string) => {
      setSelectedCategory(category);
      setSelectedSubcategory(subcategory);
      setActiveTab("browse"); // Ensure we're on browse tab
    };

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredTechnologies.map((tech) => {
          const techInfo = techInfoMap.get(tech);
          return (
            <div
              key={tech}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className="font-medium text-gray-900 mb-1">{tech}</div>
              {techInfo?.category ? (
                <button
                  onClick={() => handleCategoryClick(techInfo.category)}
                  className="text-xs text-gray-500 hover:text-indigo-600 hover:underline transition-colors"
                  aria-label={`Filter by category: ${techInfo.category}`}
                  title={`Filter by category: ${techInfo.category}`}
                >
                  {techInfo.category}
                </button>
              ) : (
                <div className="text-xs text-gray-500">
                  {selectedCategory || "Unknown"}
                </div>
              )}
              {techInfo?.subcategory ? (
                <button
                  onClick={() => handleSubcategoryClick(techInfo.category, techInfo.subcategory)}
                  className="text-xs text-indigo-500 hover:text-indigo-700 hover:underline transition-colors mt-0.5"
                  aria-label={`Filter by subcategory: ${techInfo.subcategory}`}
                  title={`Filter by subcategory: ${techInfo.subcategory}`}
                >
                  {techInfo.subcategory}
                </button>
              ) : (
                <div className="text-xs text-indigo-500 mt-0.5">
                  {selectedSubcategory || "General"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render JSON view with syntax highlighting
  const renderJsonView = () => {
    if (!registryData) {
      return (
        <div className="text-center py-8 text-gray-600">
          No registry data available
        </div>
      );
    }

    // Format JSON with indentation
    const formattedJson = JSON.stringify(registryData, null, 2);

    return (
      <div className="relative">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Source: <span className="font-mono text-gray-700">{source}</span>
          </div>
          <button
            onClick={handleDownloadJson}
            className="px-3 py-1 text-sm text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
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
            Download JSON
          </button>
        </div>

        <pre className="bg-gray-50 p-4 border rounded-md overflow-auto max-h-[600px] text-sm">
          <code>{formattedJson}</code>
        </pre>
      </div>
    );
  };

  // Render metadata and stats about the tech registry
  const renderMetadataView = () => {
    if (!registryData) {
      return (
        <div className="text-center py-8 text-gray-600">
          No registry data available
        </div>
      );
    }

    // Calculate total technologies by category
    const techCountsByCategory: Record<string, number> = {};
    const specialProperties = [
      "_id",
      "all_technologies",
      "last_updated",
      "version",
    ];

    Object.entries(registryData).forEach(([category, data]) => {
      // Skip special properties
      if (specialProperties.includes(category)) return;

      if (typeof data === "object" && !Array.isArray(data) && data !== null) {
        let count = 0;
        Object.values(data).forEach((techs) => {
          if (Array.isArray(techs)) {
            count += techs.length;
          }
        });
        techCountsByCategory[category] = count;
      }
    });

    const totalTechs =
      registryData.all_technologies?.length ||
      Object.values(techCountsByCategory).reduce((a, b) => a + b, 0);

    // Count subcategories
    let totalSubcategories = 0;
    Object.entries(registryData).forEach(([category, data]) => {
      // Skip special properties
      if (specialProperties.includes(category)) return;

      if (typeof data === "object" && !Array.isArray(data) && data !== null) {
        totalSubcategories += Object.keys(data).length;
      }
    });

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
              <div className="mt-1 text-xl font-semibold text-indigo-600">
                {source}
              </div>
            </div>

            <div className="p-5 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Categories
              </div>
              <div className="mt-1 text-xl font-semibold text-indigo-600">
                {Object.keys(techCountsByCategory).length}
              </div>
            </div>

            <div className="p-5 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Subcategories
              </div>
              <div className="mt-1 text-xl font-semibold text-indigo-600">
                {totalSubcategories}
              </div>
            </div>

            <div className="p-5 text-center">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Technologies
              </div>
              <div className="mt-1 text-xl font-semibold text-indigo-600">
                {totalTechs}
              </div>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white border rounded-md shadow-sm overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <h3 className="text-lg font-medium">Categories Breakdown</h3>
            <p className="text-sm text-gray-500 mt-1">
              Distribution of technologies across categories
            </p>
          </div>

          <div className="divide-y">
            {Object.entries(techCountsByCategory).map(([category, count]) => (
              <div key={category} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{category}</h4>
                  <span className="text-sm text-gray-600">
                    {count} technologies
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{
                      width: `${(count / totalTechs) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Tech Registry</h2>
          <p className="text-sm text-gray-600 mt-1">
            Browse and filter available technologies in the registry
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="p-4 mb-6 bg-red-50 text-red-800 rounded-md border border-red-200 flex items-start">
          <svg
            className="h-5 w-5 text-red-400 mr-2 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
            <p className="text-sm mt-1">
              Try refreshing the page or contact an administrator.
            </p>
          </div>
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
