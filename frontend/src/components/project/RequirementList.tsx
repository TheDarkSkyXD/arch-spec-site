import { useState } from "react";
import { PlusCircle, Edit2, Trash2, Check, X, Tag } from "lucide-react";
import { Requirement } from "../../types/project";

interface RequirementListProps {
  title: string;
  requirements: Requirement[];
  type: "functional" | "non-functional";
  projectId: string;
  onAdd: (
    projectId: string,
    type: "functional" | "non-functional",
    requirement: Omit<Requirement, "id">
  ) => Promise<void>;
  onUpdate: (
    projectId: string,
    type: "functional" | "non-functional",
    requirementId: string,
    data: Partial<Requirement>
  ) => Promise<void>;
  onDelete: (
    projectId: string,
    type: "functional" | "non-functional",
    requirementId: string
  ) => Promise<void>;
}

export default function RequirementList({
  title,
  requirements,
  type,
  projectId,
  onAdd,
  onUpdate,
  onDelete,
}: RequirementListProps) {
  const [newRequirement, setNewRequirement] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newRequirement.trim()) return;

    await onAdd(projectId, type, {
      description: newRequirement,
      priority: "medium",
      status: "proposed",
      tags: [],
    });

    setNewRequirement("");
    setIsAdding(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editText.trim()) return;

    await onUpdate(projectId, type, id, {
      description: editText,
    });

    setEditingId(null);
    setEditText("");
  };

  const startEdit = (requirement: Requirement) => {
    setEditingId(requirement.id);
    setEditText(requirement.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "proposed":
        return "bg-slate-100 text-slate-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "implemented":
        return "bg-green-100 text-green-800";
      case "verified":
        return "bg-purple-100 text-purple-800";
      case "deferred":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm"
        >
          <PlusCircle size={16} />
          <span>Add</span>
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-3 border border-slate-200 rounded-lg bg-slate-50">
          <textarea
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder="Enter new requirement..."
            className="w-full p-2 border border-slate-200 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 text-sm flex items-center gap-1"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex items-center gap-1"
            >
              <Check size={14} />
              Add
            </button>
          </div>
        </div>
      )}

      {requirements.length === 0 ? (
        <p className="text-slate-500 text-center py-6">
          No requirements added yet
        </p>
      ) : (
        <ul className="space-y-3">
          {requirements.map((req) => (
            <li
              key={req.id}
              className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors"
            >
              {editingId === req.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50 text-sm flex items-center gap-1"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(req.id)}
                      className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm flex items-center gap-1"
                    >
                      <Check size={14} />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-slate-700">{req.description}</p>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => startEdit(req)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(projectId, type, req.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        req.priority
                      )}`}
                    >
                      {req.priority}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                    {req.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                      >
                        <Tag size={10} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
