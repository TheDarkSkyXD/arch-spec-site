import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";
import Card from "../components/ui/Card";

interface ProfileLayoutProps {
  children: ReactNode;
  title: string;
}

const ProfileLayout = ({ children, title }: ProfileLayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Profile", path: "/profile" },
    { name: "Subscription", path: "/subscription-plan" },
    { name: "Settings", path: "/user-settings" },
    { name: "Security", path: "/security-settings" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-white">
      <Navigation />

      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <Card>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-2 rounded-md text-sm font-medium ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
