import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileCode,
  Settings,
  Package,
  FileOutput,
  Sliders,
  Users,
  Database,
} from "lucide-react";

interface SidebarProps {
  projectId?: string;
}

const Sidebar = ({ projectId }: SidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Project Management
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="px-2 space-y-1">
          <Link
            to="/"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive("/")
                ? "bg-primary-50 text-primary-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>

          <Link
            to="/projects"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive("/projects")
                ? "bg-primary-50 text-primary-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FileCode className="mr-3 h-5 w-5" />
            Projects
          </Link>

          <Link
            to="/templates"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive("/templates")
                ? "bg-primary-50 text-primary-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Package className="mr-3 h-5 w-5" />
            Templates
          </Link>

          <Link
            to="/export"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive("/export")
                ? "bg-primary-50 text-primary-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FileOutput className="mr-3 h-5 w-5" />
            Export
          </Link>
        </div>

        {projectId && (
          <>
            <div className="mt-8 px-4">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Current Project
              </h3>
              <div className="mt-2 px-2 space-y-1">
                <Link
                  to={`/projects/${projectId}/basics`}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(`/projects/${projectId}/basics`)
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Sliders className="mr-3 h-5 w-5" />
                  Project Basics
                </Link>

                <Link
                  to={`/projects/${projectId}/tech-stack`}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(`/projects/${projectId}/tech-stack`)
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Package className="mr-3 h-5 w-5" />
                  Tech Stack
                </Link>

                <Link
                  to={`/projects/${projectId}/features`}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(`/projects/${projectId}/features`)
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Users className="mr-3 h-5 w-5" />
                  Features
                </Link>

                <Link
                  to={`/projects/${projectId}/data-model`}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(`/projects/${projectId}/data-model`)
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Database className="mr-3 h-5 w-5" />
                  Data Model
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Link
          to="/settings"
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            isActive("/settings")
              ? "bg-primary-50 text-primary-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
