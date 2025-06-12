import React from 'react';
import { Entity, Relationship } from '../../../types/templates';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select-advanced';

interface RelationshipFormProps {
  relationshipForm: Relationship;
  handleRelationshipFormChange: (field: string, value: string) => void;
  isEditingRelationship: boolean;
  handleAddRelationship: () => void;
  handleEditRelationship: () => void;
  resetRelationshipForm: () => void;
  editingRelationshipIndex: number | null;
  entities: Entity[];
  relationshipTypes: string[];
  error: string | null; // eslint-disable-line @typescript-eslint/no-unused-vars
}

const RelationshipForm: React.FC<RelationshipFormProps> = ({
  relationshipForm,
  handleRelationshipFormChange,
  isEditingRelationship,
  handleAddRelationship,
  handleEditRelationship,
  resetRelationshipForm,
  editingRelationshipIndex,
  entities,
  relationshipTypes,
  error, // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  if (!isEditingRelationship) return null;

  return (
    <Card className="space-y-4 border border-slate-200 p-4 dark:border-slate-700">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="relationType">Relationship Type</Label>
          <Select
            value={relationshipForm.type}
            onValueChange={(value) => handleRelationshipFormChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {relationshipTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="field">Foreign Key Field</Label>
          <Input
            id="field"
            placeholder="e.g., user_id"
            value={relationshipForm.field}
            onChange={(e) => handleRelationshipFormChange('field', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="fromEntity">From Entity</Label>
          <Select
            value={relationshipForm.from_entity}
            onValueChange={(value) =>
              handleRelationshipFormChange('from_entity', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select entity" />
            </SelectTrigger>
            <SelectContent>
              {entities.map((entity) => (
                <SelectItem key={entity.name} value={entity.name}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="toEntity">To Entity</Label>
          <Select
            value={relationshipForm.to_entity}
            onValueChange={(value) =>
              handleRelationshipFormChange('to_entity', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select entity" />
            </SelectTrigger>
            <SelectContent>
              {entities.map((entity) => (
                <SelectItem key={entity.name} value={entity.name}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {relationshipForm.type === 'manyToMany' && (
          <div className="col-span-2">
            <Label htmlFor="throughTable">Through Table (for many-to-many)</Label>
            <Input
              id="throughTable"
              placeholder="e.g., user_roles"
              value={relationshipForm.throughTable || ''}
              onChange={(e) =>
                handleRelationshipFormChange('throughTable', e.target.value)
              }
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={resetRelationshipForm}>
          Cancel
        </Button>
        {editingRelationshipIndex !== null ? (
          <Button type="button" onClick={handleEditRelationship}>
            Update Relationship
          </Button>
        ) : (
          <Button type="button" onClick={handleAddRelationship}>
            Add Relationship
          </Button>
        )}
      </div>
    </Card>
  );
};

export default RelationshipForm; 