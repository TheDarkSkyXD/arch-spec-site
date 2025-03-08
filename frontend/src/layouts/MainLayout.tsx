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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-white">
      <Navbar />

      <div className="pt-16 flex-1">
        {showSidebar && <Sidebar projectId={projectId} />}

        <main className={`${showSidebar ? "md:ml-64" : ""}`}>
          <div className="p-5 md:p-8 h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
