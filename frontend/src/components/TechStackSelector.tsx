import React, { useState, useEffect } from "react";
import { techRegistryApi, TechCategory } from "../api/techRegistryApi";

interface TechStackSelectorProps {
  templateId?: string;
  initialTechStack?: any;
  onChange?: (techStack: any) => void;
}

const TechStackSelector: React.FC<TechStackSelectorProps> = ({
  templateId,
  initialTechStack,
  onChange,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TechCategory | null>(
    null
  );
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [techStack, setTechStack] = useState<any>(initialTechStack || {});
  const [suggestions, setSuggestions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const response = await techRegistryApi.getTechCategories();
        setCategories(response.data || []);
      } catch (err) {
        setError("Failed to load technology categories");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      return;
    }

    const loadSubcategories = async () => {
      setIsLoading(true);
      try {
        const response = await techRegistryApi.getTechSubcategories(
          selectedCategory
        );
        setSubcategories(response.data || []);
        setSelectedSubcategory(null);
      } catch (err) {
        setError(`Failed to load subcategories for ${selectedCategory}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubcategories();
  }, [selectedCategory]);

  // Load technologies when subcategory changes
  useEffect(() => {
    if (!selectedCategory || !selectedSubcategory) {
      setTechnologies([]);
      return;
    }

    const loadTechnologies = async () => {
      setIsLoading(true);
      try {
        const response = await techRegistryApi.getTechnologies(
          selectedCategory,
          selectedSubcategory
        );
        setTechnologies(response.data || []);
        setSelectedTech(null);
      } catch (err) {
        setError(`Failed to load technologies for ${selectedSubcategory}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTechnologies();
  }, [selectedCategory, selectedSubcategory]);

  // Get tech suggestions when tech stack changes
  useEffect(() => {
    if (Object.keys(techStack).length === 0) {
      setSuggestions(null);
      return;
    }

    const loadSuggestions = async () => {
      try {
        const response = await techRegistryApi.getTechSuggestions(techStack);
        setSuggestions(response.suggestions || null);
      } catch (err) {
        console.error("Failed to load tech suggestions", err);
      }
    };

    loadSuggestions();
  }, [techStack]);

  // Add a technology to the tech stack
  const addTechToStack = () => {
    if (!selectedCategory || !selectedSubcategory || !selectedTech) return;

    const updatedTechStack = { ...techStack };

    // Initialize category if it doesn't exist
    if (!updatedTechStack[selectedCategory]) {
      updatedTechStack[selectedCategory] = {};
    }

    // Add the technology to the appropriate subcategory
    updatedTechStack[selectedCategory][selectedSubcategory] = selectedTech;

    setTechStack(updatedTechStack);

    // Notify parent component of change
    if (onChange) {
      onChange(updatedTechStack);
    }
  };

  // Validate the tech stack against a template if templateId is provided
  const validateAgainstTemplate = async () => {
    if (!templateId || Object.keys(techStack).length === 0) return;

    setIsLoading(true);
    try {
      // This is a simplified version - in reality, you would first fetch the template
      // from the API using the templateId, and then pass its tech stack to the validation
      const template = await fetch(`/api/templates/${templateId}`).then((res) =>
        res.json()
      );

      const validationResult = await techRegistryApi.validateTechStack(
        techStack,
        template.techStack
      );

      if (validationResult.template_compatibility?.is_compatible) {
        alert("Tech stack is compatible with the selected template!");
      } else {
        const issues =
          validationResult.template_compatibility?.incompatibilities || [];
        alert(
          `Tech stack has ${issues.length} compatibility issues with the template.`
        );
      }
    } catch (err) {
      setError("Failed to validate tech stack against template");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tech-stack-selector">
      <h2>Tech Stack Selector</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Category selection */}
      <div className="selection-group">
        <label>Category:</label>
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value as TechCategory)}
          disabled={isLoading || categories.length === 0}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory selection */}
      {selectedCategory && (
        <div className="selection-group">
          <label>Subcategory:</label>
          <select
            value={selectedSubcategory || ""}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            disabled={isLoading || subcategories.length === 0}
          >
            <option value="">Select a subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Technology selection */}
      {selectedCategory && selectedSubcategory && (
        <div className="selection-group">
          <label>Technology:</label>
          <select
            value={selectedTech || ""}
            onChange={(e) => setSelectedTech(e.target.value)}
            disabled={isLoading || technologies.length === 0}
          >
            <option value="">Select a technology</option>
            {technologies.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>

          <button onClick={addTechToStack} disabled={!selectedTech}>
            Add to Tech Stack
          </button>
        </div>
      )}

      {/* Current tech stack display */}
      <div className="tech-stack-display">
        <h3>Current Tech Stack:</h3>
        {Object.keys(techStack).length === 0 ? (
          <p>No technologies selected yet.</p>
        ) : (
          <div>
            {Object.entries(techStack).map(
              ([category, subcategories]: [string, any]) => (
                <div key={category} className="tech-stack-category">
                  <h4>{category}</h4>
                  <ul>
                    {Object.entries(subcategories).map(
                      ([subcategory, tech]: [string, any]) => (
                        <li key={subcategory}>
                          {subcategory}: <strong>{tech}</strong>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Suggestions based on current tech stack */}
      {suggestions && (
        <div className="tech-suggestions">
          <h3>Suggested Compatible Technologies:</h3>
          {Object.entries(suggestions).map(
            ([category, subcategories]: [string, any]) => (
              <div key={category} className="suggestion-category">
                <h4>{category}</h4>
                {Object.entries(subcategories).map(
                  ([subcategory, techs]: [string, any]) => (
                    <div key={subcategory} className="suggestion-subcategory">
                      <h5>{subcategory}</h5>
                      <ul>
                        {techs.map((tech: string) => (
                          <li key={tech}>{tech}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* Template validation button */}
      {templateId && (
        <button
          onClick={validateAgainstTemplate}
          disabled={isLoading || Object.keys(techStack).length === 0}
        >
          Validate Against Template
        </button>
      )}
    </div>
  );
};

export default TechStackSelector;
