import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts";
import UserAccountDropdown from "./UserAccountDropdown";
import { Settings } from "lucide-react";

const Navigation = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Dashboard", path: "/", icon: null },
    { name: "Projects", path: "/projects", icon: null },
    { name: "Templates", path: "/templates", icon: null },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="/assets/images/arch-spec-logo-horizontal.png"
                  alt="ArchSpec Logo"
                  className="h-12 w-auto rounded-md"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(item.path)
                      ? "border-primary-500 text-slate-900 dark:text-white"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {currentUser ? (
              <UserAccountDropdown />
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:hover:bg-slate-700 dark:hover:text-white"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(item.path)
                    ? "bg-primary-50 border-primary-500 text-primary-700 dark:bg-slate-700 dark:border-primary-400 dark:text-primary-400"
                    : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon && <item.icon className="h-5 w-5 mr-3" />}
                {item.name}
              </Link>
            ))}
          </div>

          {currentUser ? (
            <div className="pt-4 pb-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    {currentUser.photoURL ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={currentUser.photoURL}
                        alt=""
                      />
                    ) : (
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {currentUser.displayName
                          ? currentUser.displayName.charAt(0).toUpperCase()
                          : currentUser.email
                          ? currentUser.email.charAt(0).toUpperCase()
                          : "U"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-slate-800 dark:text-white">
                    {currentUser.displayName || "User"}
                  </div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/user-settings"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  to="/security-settings"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Security
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    // Call signOut function from the UserAccountDropdown
                    const dropdown = document.querySelector(
                      '[aria-expanded="true"]'
                    );
                    if (dropdown) {
                      (dropdown as HTMLElement).click();
                    }
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-slate-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-slate-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-slate-200 dark:border-slate-700">
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-primary-600 hover:text-primary-800 hover:bg-slate-100 dark:text-primary-400 dark:hover:text-primary-300 dark:hover:bg-slate-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
