import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import MainLayout from '../layouts/MainLayout';
// import TemplateManagement from "../components/settings/TemplateManagement";

const Settings = () => {
  const [activeTab, setActiveTab] = useState('templates');

  return (
    <MainLayout>
      <div className="w-full py-6">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-slate-800 dark:text-slate-100">
            Settings
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Configure your application settings and manage templates
          </p>
        </div>

        <Tabs
          defaultValue="templates"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-8">
            {/* <TabsTrigger value="templates">Templates</TabsTrigger> */}
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          {/* TODO: Add back in when templates are implemented */}
          {/* <TabsContent value="templates">
            <TemplateManagement />
          </TabsContent> */}

          <TabsContent value="general">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-100">
                General Settings
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                General settings will be available in a future update.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="account">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-100">
                Account Settings
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Account settings will be available in a future update.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="api">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-100">
                API Settings
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                API settings will be available in a future update.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
