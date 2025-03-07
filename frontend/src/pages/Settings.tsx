import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import MainLayout from "../layouts/MainLayout";
import TemplateManagement from "../components/settings/TemplateManagement";
import TechStackView from "../components/settings/TechStackView";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("templates");

  return (
    <MainLayout>
      <div className="w-full py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 font-heading">
            Settings
          </h1>
          <p className="text-slate-500 mt-1">
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
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="tech-stack">Tech Stack</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <TemplateManagement />
          </TabsContent>

          <TabsContent value="tech-stack">
            <TechStackView />
          </TabsContent>

          <TabsContent value="general">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <p className="text-slate-500">
                General settings will be available in a future update.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="account">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <p className="text-slate-500">
                Account settings will be available in a future update.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="api">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold mb-4">API Settings</h2>
              <p className="text-slate-500">
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
