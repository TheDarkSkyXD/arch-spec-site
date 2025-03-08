import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FileCode } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-primary-600 text-white p-1.5 rounded-md">
                  <FileCode size={20} />
                </div>
                <span className="font-heading font-bold tracking-tight text-slate-800 text-xl">
                  ArchSpec
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center">
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <div className="text-slate-600 text-sm">
                &copy; {new Date().getFullYear()} ArchSpec. All rights reserved.
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link
                to="/terms"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Privacy
              </Link>
              <Link
                to="/help"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;