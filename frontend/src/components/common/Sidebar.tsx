import { Link, useLocation } from "react-router-dom";
import {
  FileCode,
  Package,
  FileOutput,
  Sliders,
  Users,
  Database,
  PlusCircle,
  BookOpen,
  ChevronRight,
  Home,
  Settings,
  HelpCircle,
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
    <aside className="hidden md:block w-64 bg-white border-r border-slate-200 h-[calc(100vh-4rem)] fixed left-0 top-16 z-10">
      <div className="h-full flex flex-col overflow-y-auto">
        <nav className="flex-1 p-3 space-y-6 pt-4">
          <div className="space-y-1">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                isActive("/")
                  ? "bg-slate-100 text-primary-600 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
              }`}
            >
              <Home className="h-4 w-4 mr-3" />
              Dashboard
            </Link>

            <Link
              to="/projects"
              className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                isActive("/projects")
                  ? "bg-slate-100 text-primary-600 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
              }`}
            >
              <FileCode className="h-4 w-4 mr-3" />
              Projects
            </Link>

            <Link
              to="/templates"
              className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                isActive("/templates")
                  ? "bg-slate-100 text-primary-600 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
              }`}
            >
              <Package className="h-4 w-4 mr-3" />
              Templates
            </Link>

            <Link
              to="/export"
              className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                isActive("/export")
                  ? "bg-slate-100 text-primary-600 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
              }`}
            >
              <FileOutput className="h-4 w-4 mr-3" />
              Export
            </Link>

            <Link
              to="/docs"
              className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                isActive("/docs")
                  ? "bg-slate-100 text-primary-600 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary-600"
              }`}
            >
              <BookOpen className="h-4 w-4 mr-3" />
              Documentation
            </Link>
          </div>

          {projectId && (
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider px-3 mb-2">
                Current Project
              </p>
              <div className="bg-slate-50 rounded-md p-2">
                <Link
                  to={`/projects/${projectId}/basics`}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                    isActive(`/projects/${projectId}/basics`)
                      ? "bg-white text-primary-600 shadow-sm font-medium"
                      : "text-slate-600 hover:bg-white hover:text-primary-600"
                  }`}
                >
                  <Sliders className="h-4 w-4 mr-3" />
                  <span>Project Basics</span>
                  {isActive(`/projects/${projectId}/basics`) && (
                    <ChevronRight className="ml-auto h-4 w-4 text-primary-500" />
                  )}
                </Link>

                <Link
                  to={`/projects/${projectId}/tech-stack`}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                    isActive(`/projects/${projectId}/tech-stack`)
                      ? "bg-white text-primary-600 shadow-sm font-medium"
                      : "text-slate-600 hover:bg-white hover:text-primary-600"
                  }`}
                >
                  <Package className="h-4 w-4 mr-3" />
                  <span>Tech Stack</span>
                  {isActive(`/projects/${projectId}/tech-stack`) && (
                    <ChevronRight className="ml-auto h-4 w-4 text-primary-500" />
                  )}
                </Link>

                <Link
                  to={`/projects/${projectId}/features`}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                    isActive(`/projects/${projectId}/features`)
                      ? "bg-white text-primary-600 shadow-sm font-medium"
                      : "text-slate-600 hover:bg-white hover:text-primary-600"
                  }`}
                >
                  <Users className="h-4 w-4 mr-3" />
                  <span>Features</span>
                  {isActive(`/projects/${projectId}/features`) && (
                    <ChevronRight className="ml-auto h-4 w-4 text-primary-500" />
                  )}
                </Link>

                <Link
                  to={`/projects/${projectId}/data-model`}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                    isActive(`/projects/${projectId}/data-model`)
                      ? "bg-white text-primary-600 shadow-sm font-medium"
                      : "text-slate-600 hover:bg-white hover:text-primary-600"
                  }`}
                >
                  <Database className="h-4 w-4 mr-3" />
                  <span>Data Model</span>
                  {isActive(`/projects/${projectId}/data-model`) && (
                    <ChevronRight className="ml-auto h-4 w-4 text-primary-500" />
                  )}
                </Link>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <Link
              to="/settings"
              className="flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 text-slate-600 hover:bg-slate-50 hover:text-primary-600"
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Link>
            <Link
              to="/help"
              className="flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 text-slate-600 hover:bg-slate-50 hover:text-primary-600"
            >
              <HelpCircle className="h-4 w-4 mr-3" />
              Help & Resources
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link
            to="/new-project"
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-md py-2 px-4 w-full flex items-center justify-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>New Project</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
