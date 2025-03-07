import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import TemplateCard from "../components/dashboard/TemplateCard";
import ProjectCard from "../components/dashboard/ProjectCard";
import { useProjectStore } from "../store/projectStore";
import { mockTemplates } from "../data/mockData";

const Dashboard = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, isLoading } = useProjectStore();
  const [templates] = useState(mockTemplates);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleTemplateSelect = (templateId: string) => {
    navigate(`/new-project?template=${templateId}`);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Start a New Project
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Choose a template or create from scratch
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleTemplateSelect}
            />
          ))}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Projects
            </h2>
            <button
              onClick={() => navigate("/new-project")}
              className="btn btn-primary flex items-center"
            >
              <Plus size={18} className="mr-1" />
              New Project
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin h-8 w-8 text-primary-600" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              No projects yet
            </h3>
            <p className="mt-2 text-gray-600">
              Create your first project to get started
            </p>
            <button
              onClick={() => navigate("/new-project")}
              className="btn btn-primary mt-4"
            >
              Create Project
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
