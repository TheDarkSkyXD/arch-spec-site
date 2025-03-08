import { useState } from "react";
import { PlusCircle, Trash2, AlertCircle } from "lucide-react";
import { Requirement } from "../../types/project";

interface RequirementsFormProps {
  initialData: {
    functional_requirements: Requirement[];
    non_functional_requirements: Requirement[];
  };
  onSubmit: (data: {
    functional_requirements: Requirement[];
    non_functional_requirements: Requirement[];
  }) => void;
  onBack: () => void;
}

export default function RequirementsForm({
  initialData,
  onSubmit,
  onBack,
}: RequirementsFormProps) {
  const [functionalReqs, setFunctionalReqs] = useState<Requirement[]>(
    initialData.functional_requirements || []
  );
  const [nonFunctionalReqs, setNonFunctionalReqs] = useState<Requirement[]>(
    initialData.non_functional_requirements || []
  );
  const [newFunctionalReq, setNewFunctionalReq] = useState("");
  const [newNonFunctionalReq, setNewNonFunctionalReq] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createRequirement = (description: string): Requirement => ({
    id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    description,
    priority: "medium",
    status: "proposed",
    tags: [],
    category: undefined,
  });

  const addFunctionalRequirement = () => {
    if (!newFunctionalReq.trim()) return;

    setFunctionalReqs([...functionalReqs, createRequirement(newFunctionalReq)]);
    setNewFunctionalReq("");
  };

  const addNonFunctionalRequirement = () => {
    if (!newNonFunctionalReq.trim()) return;

    setNonFunctionalReqs([
      ...nonFunctionalReqs,
      createRequirement(newNonFunctionalReq),
    ]);
    setNewNonFunctionalReq("");
  };

  const removeFunctionalRequirement = (id: string) => {
    setFunctionalReqs(functionalReqs.filter((req) => req.id !== id));
  };

  const removeNonFunctionalRequirement = (id: string) => {
    setNonFunctionalReqs(nonFunctionalReqs.filter((req) => req.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (functionalReqs.length === 0) {
      newErrors.functional = "At least one functional requirement is needed";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        functional_requirements: functionalReqs,
        non_functional_requirements: nonFunctionalReqs,
      });
    }
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Project Requirements
          </h2>
          <p className="text-slate-600 mb-6">
            Define the functional and non-functional requirements for your
            project.
          </p>
        </div>

        {/* Functional Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-800">
            Functional Requirements
          </h3>
          <p className="text-sm text-slate-600">
            What specific features and capabilities should your application
            have?
          </p>

          {errors.functional && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-red-700">
              <AlertCircle size={16} className="mt-0.5" />
              <span>{errors.functional}</span>
            </div>
          )}

          <div className="space-y-2">
            {functionalReqs.map((req) => (
              <div
                key={req.id}
                className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-md"
              >
                <div className="flex gap-2 items-center">
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full ${getPriorityColor(
                      req.priority
                    )}`}
                  >
                    {req.priority}
                  </span>
                  <p>{req.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFunctionalRequirement(req.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newFunctionalReq}
              onChange={(e) => setNewFunctionalReq(e.target.value)}
              placeholder="Enter a functional requirement"
              className="flex-1 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={addFunctionalRequirement}
              disabled={!newFunctionalReq.trim()}
              className={`p-2 rounded-md flex items-center ${
                !newFunctionalReq.trim()
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              }`}
            >
              <PlusCircle size={20} />
            </button>
          </div>
        </div>

        {/* Non-Functional Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-800">
            Non-Functional Requirements
          </h3>
          <p className="text-sm text-slate-600">
            What qualities should your application have (performance, security,
            usability, etc.)?
          </p>

          <div className="space-y-2">
            {nonFunctionalReqs.map((req) => (
              <div
                key={req.id}
                className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-md"
              >
                <div className="flex gap-2 items-center">
                  <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full ${getPriorityColor(
                      req.priority
                    )}`}
                  >
                    {req.priority}
                  </span>
                  <p>{req.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeNonFunctionalRequirement(req.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newNonFunctionalReq}
              onChange={(e) => setNewNonFunctionalReq(e.target.value)}
              placeholder="Enter a non-functional requirement"
              className="flex-1 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={addNonFunctionalRequirement}
              disabled={!newNonFunctionalReq.trim()}
              className={`p-2 rounded-md flex items-center ${
                !newNonFunctionalReq.trim()
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              }`}
            >
              <PlusCircle size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
