import { ReactNode } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  projectId?: string;
}

const MainLayout = ({
  children,
  showSidebar = true,
  projectId,
}: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-1">
        {showSidebar && <Sidebar projectId={projectId} />}

        <main className={`flex-1 p-6 ${showSidebar ? "ml-0" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
