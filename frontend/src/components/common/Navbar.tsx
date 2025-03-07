import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileCode,
  Settings,
  Package,
  FileOutput,
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-primary-600 text-white">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <FileCode size={28} />
            <span>ArchSpec</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive("/") ? "bg-primary-700" : "hover:bg-primary-500"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/projects"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive("/projects") ? "bg-primary-700" : "hover:bg-primary-500"
            }`}
          >
            Projects
          </Link>
          <Link
            to="/templates"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive("/templates") ? "bg-primary-700" : "hover:bg-primary-500"
            }`}
          >
            Templates
          </Link>
        </nav>

        <div className="flex items-center">
          <button className="p-2 rounded-full hover:bg-primary-500">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
