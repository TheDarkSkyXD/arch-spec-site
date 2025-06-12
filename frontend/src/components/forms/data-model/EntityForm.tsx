import React from 'react';
import { Entity, EntityField } from '../../../types/templates';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import FieldForm from './FieldForm';
import FieldList from './FieldList';

interface EntityFormProps {
  entityForm: Entity;
  handleEntityFormChange: (field: string, value: string) => void;
  isEditingEntity: boolean;
  handleAddEntity: () => void;
  handleEditEntity: () => void;
  resetEntityForm: () => void;
  editingEntityIndex: number | null;
  // error: string | null; // Commented out unused parameter
  // Field related props
  isAddingField: boolean;
  setIsAddingField: React.Dispatch<React.SetStateAction<boolean>>;
  fieldForm: EntityField;
  handleFieldFormChange: (field: string, value: unknown) => void;
  handleAddField: () => void;
  handleEditField: () => void;
  resetFieldForm: () => void;
  handleStartEditField: (index: number) => void;
  handleDeleteField: (index: number) => void;
  editingFieldIndex: number | null;
  fieldTypes: string[];
}

const EntityForm: React.FC<EntityFormProps> = ({
  entityForm,
  handleEntityFormChange,
  isEditingEntity,
  handleAddEntity,
  handleEditEntity,
  resetEntityForm,
  editingEntityIndex,
  // error, // Commented out unused parameter
  isAddingField,
  setIsAddingField,
  fieldForm,
  handleFieldFormChange,
  handleAddField,
  handleEditField,
  resetFieldForm,
  handleStartEditField,
  handleDeleteField,
  editingFieldIndex,
  fieldTypes
}) => {
  if (!isEditingEntity) return null;

  return (
    <Card className="space-y-4 border border-slate-200 p-4 dark:border-slate-700">
      <div className="space-y-4">
        <div>
          <Label htmlFor="entityName">Entity Name</Label>
          <Input
            id="entityName"
            placeholder="User, Product, Order, etc."
            value={entityForm.name}
            onChange={(e) => handleEntityFormChange('name', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="entityDescription">Description</Label>
          <Textarea
            id="entityDescription"
            placeholder="Describe this entity's purpose"
            value={entityForm.description}
            onChange={(e) => handleEntityFormChange('description', e.target.value)}
            rows={2}
          />
        </div>

        {/* Fields Section within Entity Form */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Fields</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddingField(!isAddingField)}
            >
              {isAddingField ? 'Cancel' : 'Add Field'}
            </Button>
          </div>

          {/* Field Form */}
          {isAddingField && (
            <FieldForm
              fieldForm={fieldForm}
              handleFieldFormChange={handleFieldFormChange}
              handleAddField={handleAddField}
              handleEditField={handleEditField}
              resetFieldForm={resetFieldForm}
              editingFieldIndex={editingFieldIndex}
              fieldTypes={fieldTypes}
            />
          )}

          {/* List of Fields */}
          <FieldList
            fields={entityForm.fields || []}
            handleStartEditField={handleStartEditField}
            handleDeleteField={handleDeleteField}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={resetEntityForm}>
            Cancel
          </Button>
          {editingEntityIndex !== null ? (
            <Button type="button" onClick={handleEditEntity}>
              Update Entity
            </Button>
          ) : (
            <Button type="button" onClick={handleAddEntity}>
              Add Entity
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EntityForm; 