import React from 'react';
import { EntityField } from '../../../types/templates';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select-advanced';

interface FieldFormProps {
  fieldForm: EntityField;
  handleFieldFormChange: (field: string, value: unknown) => void;
  handleAddField: () => void;
  handleEditField: () => void;
  resetFieldForm: () => void;
  editingFieldIndex: number | null;
  fieldTypes: string[];
}

// Field component to manage entity fields
const FieldForm: React.FC<FieldFormProps> = ({
  fieldForm,
  handleFieldFormChange,
  handleAddField,
  handleEditField,
  resetFieldForm,
  editingFieldIndex,
  fieldTypes,
}) => {
  return (
    <div className="space-y-3 rounded-md border border-slate-200 p-3 dark:border-slate-700">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="fieldName">Field Name</Label>
          <Input
            id="fieldName"
            placeholder="name, email, price, etc."
            value={fieldForm.name}
            onChange={(e) => handleFieldFormChange('name', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="fieldType">Field Type</Label>
          <Select
            value={fieldForm.type}
            onValueChange={(value) => handleFieldFormChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {fieldTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="required"
            checked={fieldForm.required || false}
            onCheckedChange={(checked) =>
              handleFieldFormChange('required', checked === true)
            }
          />
          <Label htmlFor="required">Required</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="unique"
            checked={fieldForm.unique || false}
            onCheckedChange={(checked) =>
              handleFieldFormChange('unique', checked === true)
            }
          />
          <Label htmlFor="unique">Unique</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="primaryKey"
            checked={fieldForm.primaryKey || false}
            onCheckedChange={(checked) =>
              handleFieldFormChange('primaryKey', checked === true)
            }
          />
          <Label htmlFor="primaryKey">Primary Key</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="generated"
            checked={fieldForm.generated || false}
            onCheckedChange={(checked) =>
              handleFieldFormChange('generated', checked === true)
            }
          />
          <Label htmlFor="generated">Generated</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="defaultValue">Default Value (optional)</Label>
        <Input
          id="defaultValue"
          placeholder="Default value"
          value={fieldForm.default?.toString() || ''}
          onChange={(e) => handleFieldFormChange('default', e.target.value)}
        />
      </div>

      {fieldForm.type === 'enum' && (
        <div>
          <Label htmlFor="enumValues">Enum Values (comma separated)</Label>
          <Input
            id="enumValues"
            placeholder="value1, value2, value3"
            value={fieldForm.enum?.join(', ') || ''}
            onChange={(e) => {
              const values = e.target.value
                .split(',')
                .map((v) => v.trim())
                .filter((v) => v);
              handleFieldFormChange('enum', values);
            }}
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetFieldForm}
        >
          Cancel
        </Button>
        {editingFieldIndex !== null ? (
          <Button type="button" size="sm" onClick={handleEditField}>
            Update Field
          </Button>
        ) : (
          <Button type="button" size="sm" onClick={handleAddField}>
            Add Field
          </Button>
        )}
      </div>
    </div>
  );
};

export default FieldForm; 