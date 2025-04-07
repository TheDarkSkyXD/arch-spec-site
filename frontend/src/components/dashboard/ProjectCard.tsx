import { ProjectBase } from '../../types/project';
import { Clock, ArrowRight, Bookmark, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: ProjectBase;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  // Format the date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Get the project template name from metadata if available
  const getProjectType = () => {
    return 'Custom project';
  };

  return (
    <div className="card group p-5 transition-all duration-300 hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between">
            <div className="group/menu relative">
              <button className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900 transition-colors group-hover:text-primary-600">
            {project.name}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-slate-600">{project.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        if (project.updated_at){' '}
        {
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>Updated {formatDate(project.updated_at as string)}</span>
          </div>
        }
        <div>
          <button className="mr-1 rounded-full p-1 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600">
            <Bookmark size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-xs font-medium text-slate-500">{getProjectType()}</div>
        <Link
          to={`/projects/${project.id}`}
          className="btn btn-ghost flex items-center py-1.5 text-sm text-primary-600 shadow-none hover:bg-primary-50"
        >
          View Project
          <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
