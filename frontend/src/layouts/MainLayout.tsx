import { ReactNode } from 'react';
import Navigation from '../components/Navigation';

interface MainLayoutProps {
  children: ReactNode;
  projectId?: string;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 dark:text-white">
      <Navigation />

      <div className="flex flex-1 pt-16">
        <main className={`flex-1`}>
          <div className="h-full p-5 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
