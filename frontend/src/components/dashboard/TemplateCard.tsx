import { ProjectTemplate } from "../../types/project";

interface TemplateCardProps {
  template: ProjectTemplate;
  onSelect: (templateId: string) => void;
}

const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
  return (
    <div className="card overflow-hidden transition-all hover:shadow-md">
      <div
        className="h-32 bg-primary-600"
        style={{
          backgroundImage: template.thumbnail
            ? `url(${template.thumbnail})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{template.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {template.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onSelect(template.id)}
          className="btn btn-primary w-full mt-4"
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
