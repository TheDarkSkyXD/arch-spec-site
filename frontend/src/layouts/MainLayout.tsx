import { ReactNode } from "react";
import Navigation from "../components/Navigation";

interface MainLayoutProps {
  children: ReactNode;
  projectId?: string;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-white">
      <Navigation />

      <div className="pt-16 flex-1 flex">
        <main className={`flex-1`}>
          <div className="p-5 md:p-8 h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
