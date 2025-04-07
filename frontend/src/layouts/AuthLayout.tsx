import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white shadow-sm dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Logo size="medium" variant="horizontal" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col justify-center">{children}</div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                &copy; {new Date().getFullYear()} ArchSpec. All rights reserved.
              </div>
            </div>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <Link
                to="/terms"
                className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Privacy
              </Link>
              <Link
                to="/help"
                className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
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
