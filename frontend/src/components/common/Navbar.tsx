import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Implementation for dark mode toggle would go here
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-xl font-bold flex items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="bg-primary-600 text-white p-1.5 rounded-md">
              <FileCode size={20} />
            </div>
            <span className="font-heading font-bold tracking-tight text-slate-800">
              ArchSpec
            </span>
          </Link>

          <div className="hidden lg:flex items-center ml-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search for projects..."
                className="border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
              />
            </div>
          </div>
        </div>

        <div className="flex md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded text-slate-500"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              isActive("/")
                ? "bg-slate-100 text-primary-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link
            to="/projects"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              isActive("/projects")
                ? "bg-slate-100 text-primary-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <FileCode size={18} />
              <span>Projects</span>
            </div>
          </Link>
          <Link
            to="/templates"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              isActive("/templates")
                ? "bg-slate-100 text-primary-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Package size={18} />
              <span>Templates</span>
            </div>
          </Link>

          <div className="flex items-center pl-3 space-x-1 ml-2 border-l border-slate-200">
            <button className="p-2 rounded text-slate-500 hover:bg-slate-50 relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full border border-white"></span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded text-slate-500 hover:bg-slate-50"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative group ml-1">
              <button className="flex items-center gap-1 p-1 rounded hover:bg-slate-50">
                <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
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
        <div className="md:hidden bg-white border-t border-slate-200 absolute w-full">
          <div className="p-4">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="border border-slate-200 rounded-md py-2 pl-9 pr-4 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full"
              />
            </div>

            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive("/")
                    ? "bg-slate-100 text-primary-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </div>
              </Link>
              <Link
                to="/projects"
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive("/projects")
                    ? "bg-slate-100 text-primary-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode size={18} />
                  <span>Projects</span>
                </div>
              </Link>
              <Link
                to="/templates"
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive("/templates")
                    ? "bg-slate-100 text-primary-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package size={18} />
                  <span>Templates</span>
                </div>
              </Link>
            </nav>

            <div className="flex justify-between mt-4 pt-4 border-t border-slate-200">
              <button className="flex items-center gap-2 text-slate-600 py-2 px-3 rounded-md hover:bg-slate-50">
                <User size={18} />
                <span>Profile</span>
              </button>
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 text-slate-600 py-2 px-3 rounded-md hover:bg-slate-50"
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
