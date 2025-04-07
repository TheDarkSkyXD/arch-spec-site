import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts';
import UserAccountDropdown from './UserAccountDropdown';

const Navigation = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  type NavItem = {
    name: string;
    path: string;
    icon: React.ComponentType<{ className: string }> | null;
  };

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: null },
    { name: 'Projects', path: '/projects', icon: null },
    { name: 'Templates', path: '/templates', icon: null },
  ];

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/dashboard" className="flex items-center">
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
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    isActive(item.path)
                      ? 'border-primary-500 text-slate-900 dark:text-white'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
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
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:hover:bg-slate-700 dark:hover:text-white"
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
          <div className="space-y-1 pb-3 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                  isActive(item.path)
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-slate-700 dark:text-primary-400'
                    : 'border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                {item.name}
              </Link>
            ))}
          </div>

          {currentUser ? (
            <div className="border-t border-slate-200 pb-3 pt-4 dark:border-slate-700">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                    {currentUser.photoURL ? (
                      <img className="h-10 w-10 rounded-full" src={currentUser.photoURL} alt="" />
                    ) : (
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {currentUser.displayName
                          ? currentUser.displayName.charAt(0).toUpperCase()
                          : currentUser.email
                            ? currentUser.email.charAt(0).toUpperCase()
                            : 'U'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-slate-800 dark:text-white">
                    {currentUser.displayName || 'User'}
                  </div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {currentUser.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/subscription-plan"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Subscription
                </Link>
                <Link
                  to="/user-settings"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  to="/security-settings"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Security
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    // Call signOut function from the UserAccountDropdown
                    const dropdown = document.querySelector('[aria-expanded="true"]');
                    if (dropdown) {
                      (dropdown as HTMLElement).click();
                    }
                  }}
                  className="block w-full px-4 py-2 text-left text-base font-medium text-red-600 hover:bg-slate-100 hover:text-red-800 dark:text-red-400 dark:hover:bg-slate-700 dark:hover:text-red-300"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-slate-200 pb-3 pt-4 dark:border-slate-700">
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-primary-600 hover:bg-slate-100 hover:text-primary-800 dark:text-primary-400 dark:hover:bg-slate-700 dark:hover:text-primary-300"
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
