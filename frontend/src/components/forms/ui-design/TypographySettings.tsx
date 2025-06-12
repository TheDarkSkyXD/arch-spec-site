import { UIDesign } from '../../../types/templates';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';

interface TypographySettingsProps {
  uiDesign: UIDesign;
  fontOptions: string[];
  handleTypographyChange: (typographyType: string, value: string | number) => void;
}

export default function TypographySettings({ 
  uiDesign, 
  fontOptions, 
  handleTypographyChange 
}: TypographySettingsProps) {
  // Render select component
  const renderSelect = (
    options: string[],
    value: string,
    onChange: (value: string) => void,
    label: string
  ) => {
    return (
      <div className="mb-4">
        <Label className="mb-1 block">{label}</Label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white p-2 dark:border-slate-600 dark:bg-slate-800"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Render number input component
  const renderNumberInput = (
    value: number,
    onChange: (value: number) => void,
    label: string,
    min: number,
    max: number,
    step: number = 1
  ) => {
    return (
      <div className="mb-4">
        <Label className="mb-1 block">{label}</Label>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          min={min}
          max={max}
          step={step}
        />
      </div>
    );
  };

  return (
    <>
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">Typography Settings</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {renderSelect(
            fontOptions,
            uiDesign.typography.fontFamily,
            (value) => handleTypographyChange('fontFamily', value),
            'Font Family'
          )}

          {renderSelect(
            fontOptions,
            uiDesign.typography.headingFont,
            (value) => handleTypographyChange('headingFont', value),
            'Heading Font'
          )}

          <div className="mb-4">
            <Label className="mb-1 block">Base Font Size</Label>
            <Input
              type="text"
              value={uiDesign.typography.fontSize}
              onChange={(e) => handleTypographyChange('fontSize', e.target.value)}
              placeholder="16px"
            />
          </div>

          {renderNumberInput(
            uiDesign.typography.lineHeight,
            (value) => handleTypographyChange('lineHeight', value),
            'Line Height',
            1,
            3,
            0.1
          )}

          {renderNumberInput(
            uiDesign.typography.fontWeight,
            (value) => handleTypographyChange('fontWeight', value),
            'Base Font Weight',
            300,
            900,
            100
          )}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">Heading Sizes</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="mb-4">
            <Label className="mb-1 block">H1 Size</Label>
            <Input
              type="text"
              value={uiDesign.typography.headingSizes.h1}
              onChange={(e) => handleTypographyChange('headingSizes.h1', e.target.value)}
              placeholder="2.5rem"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">H2 Size</Label>
            <Input
              type="text"
              value={uiDesign.typography.headingSizes.h2}
              onChange={(e) => handleTypographyChange('headingSizes.h2', e.target.value)}
              placeholder="2rem"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">H3 Size</Label>
            <Input
              type="text"
              value={uiDesign.typography.headingSizes.h3}
              onChange={(e) => handleTypographyChange('headingSizes.h3', e.target.value)}
              placeholder="1.75rem"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">H4 Size</Label>
            <Input
              type="text"
              value={uiDesign.typography.headingSizes.h4}
              onChange={(e) => handleTypographyChange('headingSizes.h4', e.target.value)}
              placeholder="1.5rem"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">H5 Size</Label>
            <Input
              type="text"
              value={uiDesign.typography.headingSizes.h5}
              onChange={(e) => handleTypographyChange('headingSizes.h5', e.target.value)}
              placeholder="1.25rem"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">H6 Size</Label>
            <Input
              type="text"
              value={uiDesign.typography.headingSizes.h6}
              onChange={(e) => handleTypographyChange('headingSizes.h6', e.target.value)}
              placeholder="1rem"
            />
          </div>
        </div>
      </Card>

      {/* Typography Preview */}
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">Typography Preview</h3>
        <div className="rounded-md border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          {/* Font Family Preview */}
          <div className="mb-6 space-y-3">
            <div 
              style={{ 
                fontFamily: uiDesign.typography.fontFamily,
                fontSize: uiDesign.typography.fontSize,
                lineHeight: uiDesign.typography.lineHeight,
                fontWeight: uiDesign.typography.fontWeight
              }}
            >
              <p className="text-slate-600 dark:text-slate-300">
                This text uses your selected font family, size, line height, and weight.
              </p>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>

          {/* Heading Styles Preview */}
          <div className="space-y-3">
            <h1 
              style={{ 
                fontFamily: uiDesign.typography.headingFont,
                fontSize: uiDesign.typography.headingSizes.h1 
              }}
            >
              Heading 1
            </h1>
            <h2 
              style={{ 
                fontFamily: uiDesign.typography.headingFont,
                fontSize: uiDesign.typography.headingSizes.h2 
              }}
            >
              Heading 2
            </h2>
            <h3 
              style={{ 
                fontFamily: uiDesign.typography.headingFont,
                fontSize: uiDesign.typography.headingSizes.h3 
              }}
            >
              Heading 3
            </h3>
            <h4 
              style={{ 
                fontFamily: uiDesign.typography.headingFont,
                fontSize: uiDesign.typography.headingSizes.h4 
              }}
            >
              Heading 4
            </h4>
            <h5 
              style={{ 
                fontFamily: uiDesign.typography.headingFont,
                fontSize: uiDesign.typography.headingSizes.h5 
              }}
            >
              Heading 5
            </h5>
            <h6 
              style={{ 
                fontFamily: uiDesign.typography.headingFont,
                fontSize: uiDesign.typography.headingSizes.h6 
              }}
            >
              Heading 6
            </h6>
          </div>
        </div>
      </Card>
    </>
  );
} 