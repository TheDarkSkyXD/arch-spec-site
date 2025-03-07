import { Project } from "../../types/project";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  // Format the date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "draft":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="card p-4 hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {project.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>

        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            project.status
          )}`}
        >
          {project.status.replace("_", " ")}
        </span>
      </div>

      <div className="flex items-center mt-4 text-sm text-gray-500">
        <Clock size={16} className="mr-1" />
        <span>Last updated: {formatDate(project.updated_at)}</span>
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to={`/projects/${project.id}`}
          className="btn btn-secondary flex items-center text-sm"
        >
          View Project
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
