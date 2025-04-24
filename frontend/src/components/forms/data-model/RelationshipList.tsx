import { Edit, Trash2 } from 'lucide-react';
import React from 'react';
import { Relationship } from '../../../types/templates';
import Button from '../../ui/Button';

interface RelationshipListProps {
  relationships: Relationship[];
  handleStartEditRelationship: (index: number) => void;
  handleDeleteRelationship: (index: number) => void;
}

const RelationshipList: React.FC<RelationshipListProps> = ({
  relationships,
  handleStartEditRelationship,
  handleDeleteRelationship,
}) => {
  if (relationships.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-200 py-8 text-center dark:border-slate-700">
        <p className="text-slate-500 dark:text-slate-400">
          No relationships defined yet. Relationships help connect your entities.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 rounded-md border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
      {relationships.map((rel, idx) => (
        <div key={idx} className="flex items-center justify-between p-4">
          <div>
            <div className="flex items-center space-x-2 font-medium">
              <span>{rel.from_entity}</span>
              <span className="text-slate-500 dark:text-slate-400">
                {rel.type === 'oneToOne' && '1:1'}
                {rel.type === 'oneToMany' && '1:n'}
                {rel.type === 'manyToOne' && 'n:1'}
                {rel.type === 'manyToMany' && 'n:m'}
              </span>
              <span>{rel.to_entity}</span>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Field: {rel.field}
              {rel.throughTable && <span> (through {rel.throughTable})</span>}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleStartEditRelationship(idx)}
            >
              <Edit size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteRelationship(idx)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RelationshipList; 