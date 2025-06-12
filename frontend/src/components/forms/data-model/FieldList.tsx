import { Edit, Trash2 } from 'lucide-react';
import React from 'react';
import { EntityField } from '../../../types/templates';
import Button from '../../ui/Button';
import { Badge } from '../../ui/badge';

interface FieldListProps {
  fields: EntityField[];
  handleStartEditField: (index: number) => void;
  handleDeleteField: (index: number) => void;
}

const FieldList: React.FC<FieldListProps> = ({ fields, handleStartEditField, handleDeleteField }) => {
  if (!fields || fields.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-200 py-4 text-center dark:border-slate-700">
        <p className="text-slate-500 dark:text-slate-400">
          No fields added yet. Add fields to define the entity structure.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 rounded-md border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
      {fields.map((field, idx) => (
        <div key={idx} className="flex items-center justify-between p-3">
          <div>
            <div className="font-medium">{field.name}</div>
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
              <Badge variant="outline">{field.type}</Badge>
              {field.required && (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Required
                </Badge>
              )}
              {field.unique && (
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Unique
                </Badge>
              )}
              {field.primaryKey && (
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  PK
                </Badge>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleStartEditField(idx)}
            >
              <Edit size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteField(idx)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FieldList; 