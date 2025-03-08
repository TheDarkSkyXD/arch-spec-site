import { useState } from "react";
import {
  PlusCircle,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Layers,
} from "lucide-react";

interface PageComponent {
  name: string;
  path: string;
  components: string[];
  enabled: boolean;
}

interface PagesFormProps {
  initialData: {
    public: PageComponent[];
    authenticated: PageComponent[];
    admin: PageComponent[];
  };
  onSubmit: (data: {
    public: PageComponent[];
    authenticated: PageComponent[];
    admin: PageComponent[];
  }) => void;
}

export default function PagesForm({ initialData, onSubmit }: PagesFormProps) {
  const [publicPages, setPublicPages] = useState<PageComponent[]>(
    initialData.public || []
  );
  const [authenticatedPages, setAuthenticatedPages] = useState<PageComponent[]>(
    initialData.authenticated || []
  );
  const [adminPages, setAdminPages] = useState<PageComponent[]>(
    initialData.admin || []
  );
  const [activeTab, setActiveTab] = useState<
    "public" | "authenticated" | "admin"
  >("public");
  const [newPageName, setNewPageName] = useState("");
  const [newPagePath, setNewPagePath] = useState("");

  const handleTogglePage = (
    type: "public" | "authenticated" | "admin",
    index: number
  ) => {
    let pages: PageComponent[] = [];
    let setPages: React.Dispatch<React.SetStateAction<PageComponent[]>>;

    if (type === "public") {
      pages = [...publicPages];
      setPages = setPublicPages;
    } else if (type === "authenticated") {
      pages = [...authenticatedPages];
      setPages = setAuthenticatedPages;
    } else {
      pages = [...adminPages];
      setPages = setAdminPages;
    }

    pages[index] = {
      ...pages[index],
      enabled: !pages[index].enabled,
    };

    setPages(pages);
  };

  const handleAddPage = () => {
    if (!newPageName.trim() || !newPagePath.trim()) return;

    const newPage: PageComponent = {
      name: newPageName,
      path: newPagePath,
      components: [],
      enabled: true,
    };

    if (activeTab === "public") {
      setPublicPages([...publicPages, newPage]);
    } else if (activeTab === "authenticated") {
      setAuthenticatedPages([...authenticatedPages, newPage]);
    } else {
      setAdminPages([...adminPages, newPage]);
    }

    setNewPageName("");
    setNewPagePath("");
  };

  const handleRemovePage = (
    type: "public" | "authenticated" | "admin",
    index: number
  ) => {
    if (type === "public") {
      setPublicPages(publicPages.filter((_, i) => i !== index));
    } else if (type === "authenticated") {
      setAuthenticatedPages(authenticatedPages.filter((_, i) => i !== index));
    } else {
      setAdminPages(adminPages.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      public: publicPages,
      authenticated: authenticatedPages,
      admin: adminPages,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Application Pages
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Define the pages that will be included in your application.
          </p>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab("public")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "public"
                  ? "bg-white dark:bg-slate-800 text-primary-600 border-b-2 border-primary-600"
                  : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              } flex-1`}
            >
              Public Pages
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("authenticated")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "authenticated"
                  ? "bg-white dark:bg-slate-800 text-primary-600 border-b-2 border-primary-600"
                  : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              } flex-1`}
            >
              Authenticated Pages
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "admin"
                  ? "bg-white dark:bg-slate-800 text-primary-600 border-b-2 border-primary-600"
                  : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              } flex-1`}
            >
              Admin Pages
            </button>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900">
            {activeTab === "public" && (
              <div className="space-y-4">
                {publicPages.length === 0 ? (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                      No public pages defined
                    </p>
                  </div>
                ) : (
                  publicPages.map((page, index) => (
                    <div
                      key={index}
                      className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between items-center bg-white dark:bg-slate-800"
                    >
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {page.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            ({page.path})
                          </span>
                        </div>
                        {page.components.length > 0 && (
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <Layers size={12} className="mr-1" />
                            <span>{page.components.length} components</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePage("public", index)}
                          className="p-1 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-500"
                          title={page.enabled ? "Disable page" : "Enable page"}
                        >
                          {page.enabled ? (
                            <ToggleRight
                              size={20}
                              className="text-primary-600 dark:text-primary-500"
                            />
                          ) : (
                            <ToggleLeft size={20} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePage("public", index)}
                          className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
                          title="Remove page"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "authenticated" && (
              <div className="space-y-4">
                {authenticatedPages.length === 0 ? (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                      No authenticated pages defined
                    </p>
                  </div>
                ) : (
                  authenticatedPages.map((page, index) => (
                    <div
                      key={index}
                      className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between items-center bg-white dark:bg-slate-800"
                    >
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {page.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            ({page.path})
                          </span>
                        </div>
                        {page.components.length > 0 && (
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <Layers size={12} className="mr-1" />
                            <span>{page.components.length} components</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleTogglePage("authenticated", index)
                          }
                          className="p-1 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-500"
                          title={page.enabled ? "Disable page" : "Enable page"}
                        >
                          {page.enabled ? (
                            <ToggleRight
                              size={20}
                              className="text-primary-600 dark:text-primary-500"
                            />
                          ) : (
                            <ToggleLeft size={20} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemovePage("authenticated", index)
                          }
                          className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
                          title="Remove page"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "admin" && (
              <div className="space-y-4">
                {adminPages.length === 0 ? (
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                      No admin pages defined
                    </p>
                  </div>
                ) : (
                  adminPages.map((page, index) => (
                    <div
                      key={index}
                      className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between items-center bg-white dark:bg-slate-800"
                    >
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {page.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            ({page.path})
                          </span>
                        </div>
                        {page.components.length > 0 && (
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <Layers size={12} className="mr-1" />
                            <span>{page.components.length} components</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePage("admin", index)}
                          className="p-1 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-500"
                          title={page.enabled ? "Disable page" : "Enable page"}
                        >
                          {page.enabled ? (
                            <ToggleRight
                              size={20}
                              className="text-primary-600 dark:text-primary-500"
                            />
                          ) : (
                            <ToggleLeft size={20} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePage("admin", index)}
                          className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
                          title="Remove page"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Add new page form */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Add a New{" "}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Page
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="pageName"
                    className="block text-xs text-slate-500 dark:text-slate-400 mb-1"
                  >
                    Page Name
                  </label>
                  <input
                    id="pageName"
                    type="text"
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    placeholder="e.g. Dashboard"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pagePath"
                    className="block text-xs text-slate-500 dark:text-slate-400 mb-1"
                  >
                    Path
                  </label>
                  <input
                    id="pagePath"
                    type="text"
                    value={newPagePath}
                    onChange={(e) => setNewPagePath(e.target.value)}
                    placeholder="e.g. /dashboard"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddPage}
                  disabled={!newPageName.trim() || !newPagePath.trim()}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
                    !newPageName.trim() || !newPagePath.trim()
                      ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                      : "bg-primary-600 text-white hover:bg-primary-700 dark:hover:bg-primary-500"
                  }`}
                >
                  <PlusCircle size={14} />
                  Add Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
