import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCode,
  Package,
  Moon,
  Bell,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Sun,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold transition-transform hover:scale-105"
          >
            <div className="rounded-md bg-primary-600 p-1.5 text-white">
              <FileCode size={20} />
            </div>
            <span className="font-heading font-bold tracking-tight text-slate-800 dark:text-white">
              ArchSpec
            </span>
          </Link>

          <div className="ml-8 hidden items-center lg:flex">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search for projects..."
                className="w-64 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded p-2 text-slate-500 dark:text-slate-400"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="hidden items-center space-x-1 md:flex">
          <Link
            to="/"
            className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
              isActive('/')
                ? 'bg-slate-100 text-primary-600 dark:bg-slate-800'
                : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link
            to="/projects"
            className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
              isActive('/projects')
                ? 'bg-slate-100 text-primary-600 dark:bg-slate-800'
                : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <FileCode size={18} />
              <span>Projects</span>
            </div>
          </Link>
          <Link
            to="/templates"
            className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
              isActive('/templates')
                ? 'bg-slate-100 text-primary-600 dark:bg-slate-800'
                : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Package size={18} />
              <span>Templates</span>
            </div>
          </Link>

          <div className="ml-2 flex items-center space-x-1 border-l border-slate-200 pl-3 dark:border-slate-700">
            <button className="relative rounded p-2 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800">
              <Bell size={18} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full border border-white bg-primary-600 dark:border-slate-900"></span>
            </button>
            <button
              onClick={toggleTheme}
              className="rounded p-2 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="group relative ml-1">
              <button className="flex items-center gap-1 rounded p-1 hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white">
                  A
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute w-full border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <div className="p-4">
            <div className="relative mb-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-slate-100 text-primary-600 dark:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </div>
              </Link>
              <Link
                to="/projects"
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive('/projects')
                    ? 'bg-slate-100 text-primary-600 dark:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode size={18} />
                  <span>Projects</span>
                </div>
              </Link>
              <Link
                to="/templates"
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive('/templates')
                    ? 'bg-slate-100 text-primary-600 dark:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package size={18} />
                  <span>Templates</span>
                </div>
              </Link>
            </nav>

            <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
              <button className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                <User size={18} />
                <span>Profile</span>
              </button>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {isDarkMode ? (
                  <>
                    <Sun size={18} />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={18} />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
