import { ReactNode } from "react";
import Sidebar from "../components/common/Sidebar";
import Navigation from "../components/Navigation";

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
      <Navigation />

      <div className="pt-16 flex-1 flex">
        {showSidebar && <Sidebar projectId={projectId} />}

        <main className={`flex-1 ${showSidebar ? "md:ml-64" : ""}`}>
          <div className="p-5 md:p-8 h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
