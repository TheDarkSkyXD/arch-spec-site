import React, { useState, useEffect } from 'react';
import { TechStackData } from '../../../types/techStack';
import { createDefaultTechStackData, filterCompatibleTechnologies } from '../../../utils/techStackUtils';

interface TechSelectorProps {
  techStackData?: TechStackData;
  onSelectionChange?: (selections: Record<string, string>) => void;
}

const TechSelector: React.FC<TechSelectorProps> = ({ 
  techStackData = createDefaultTechStackData(),
  onSelectionChange 
}) => {
  // Current selections for each category
  const [selections, setSelections] = useState<Record<string, string>>({});
  
  // Available options for each category based on current selections
  const [availableOptions, setAvailableOptions] = useState<Record<string, string[]>>({});
  
  // Categories to display in the selector
  const categories = [
    { key: 'frameworks', label: 'Frameworks' },
    { key: 'stateManagement', label: 'State Management' },
    { key: 'databases', label: 'Databases' },
    { key: 'uiLibraries', label: 'UI Libraries' },
    { key: 'hosting', label: 'Hosting' }
  ];
  
  // Update available options whenever selections change
  useEffect(() => {
    const newAvailableOptions: Record<string, string[]> = {};
    
    categories.forEach(category => {
      newAvailableOptions[category.key] = filterCompatibleTechnologies(
        techStackData,
        Object.fromEntries(
          Object.entries(selections).filter(([key]) => key !== category.key)
        ),
        category.key
      );
    });
    
    setAvailableOptions(newAvailableOptions);
    
    // Notify parent component of selection changes
    if (onSelectionChange) {
      onSelectionChange(selections);
    }
  }, [selections, techStackData, categories, onSelectionChange]);
  
  // Handle selection change for a category
  const handleSelectionChange = (category: string, technology: string) => {
    setSelections(prev => ({
      ...prev,
      [category]: technology
    }));
  };
  
  // Clear selection for a category
  const handleClearSelection = (category: string) => {
    setSelections(prev => {
      const newSelections = { ...prev };
      delete newSelections[category];
      return newSelections;
    });
  };
  
  // Reset all selections
  const handleResetAll = () => {
    setSelections({});
  };
  
  return (
    <div className="tech-selector">
      <h2>Tech Stack Selector</h2>
      
      <div className="selector-controls">
        <button onClick={handleResetAll}>Reset All Selections</button>
      </div>
      
      <div className="selector-grid">
        {categories.map(category => (
          <div key={category.key} className="selector-category">
            <h3>{category.label}</h3>
            
            <select
              value={selections[category.key] || ''}
              onChange={(e) => handleSelectionChange(category.key, e.target.value)}
            >
              <option value="">Select {category.label}</option>
              {availableOptions[category.key]?.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            
            {selections[category.key] && (
              <button 
                className="clear-button"
                onClick={() => handleClearSelection(category.key)}
              >
                Clear
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="current-selections">
        <h3>Current Selections</h3>
        {Object.keys(selections).length > 0 ? (
          <ul>
            {Object.entries(selections).map(([category, technology]) => (
              <li key={category}>
                <strong>{category}:</strong> {technology}
              </li>
            ))}
          </ul>
        ) : (
          <p>No technologies selected yet.</p>
        )}
      </div>
      
      {Object.keys(selections).length > 0 && (
        <div className="tech-details">
          <h3>Technology Details</h3>
          {Object.entries(selections).map(([category, technology]) => {
            const techDetails = techStackData.technologies[category as keyof TechStackData['technologies']]?.[technology];
            return (
              <div key={`${category}-${technology}`} className="tech-detail-card">
                <h4>{technology}</h4>
                <p>{(techDetails as any)?.description || 'No description available'}</p>
                
                {(techDetails as any)?.compatibleWith && (
                  <div className="compatibility">
                    <h5>Compatible With:</h5>
                    <ul>
                      {Object.entries((techDetails as any).compatibleWith).map(([compCategory, compTechs]) => (
                        <li key={compCategory}>
                          <strong>{compCategory}:</strong> {Array.isArray(compTechs) ? compTechs.join(', ') : 'N/A'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TechSelector;
