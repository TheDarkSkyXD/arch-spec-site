import { UIDesign } from '../../../types/templates';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';

interface LayoutSettingsProps {
  uiDesign: UIDesign;
  handleLayoutChange: (layoutType: string, value: string | number | boolean) => void;
  handleSpacingChange: (spacingType: string, value: string | number[]) => void;
  handleBorderRadiusChange: (sizeType: string, value: string) => void;
  handleShadowsChange: (shadowType: string, value: string) => void;
}

export default function LayoutSettings({
  uiDesign,
  handleLayoutChange,
  handleSpacingChange,
  handleBorderRadiusChange,
  handleShadowsChange,
}: LayoutSettingsProps) {
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
        <h3 className="mb-4 text-lg font-medium">Layout Settings</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="mb-4">
            <Label className="mb-1 block">Container Width</Label>
            <Input
              type="text"
              value={uiDesign.layout.containerWidth}
              onChange={(e) => handleLayoutChange('containerWidth', e.target.value)}
              placeholder="1280px"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">Sidebar Width</Label>
            <Input
              type="text"
              value={uiDesign.layout.sidebarWidth}
              onChange={(e) => handleLayoutChange('sidebarWidth', e.target.value)}
              placeholder="240px"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">Topbar Height</Label>
            <Input
              type="text"
              value={uiDesign.layout.topbarHeight}
              onChange={(e) => handleLayoutChange('topbarHeight', e.target.value)}
              placeholder="64px"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">Gutter Width</Label>
            <Input
              type="text"
              value={uiDesign.layout.gutterWidth}
              onChange={(e) => handleLayoutChange('gutterWidth', e.target.value)}
              placeholder="16px"
            />
          </div>

          {renderNumberInput(
            uiDesign.layout.gridColumns,
            (value) => handleLayoutChange('gridColumns', value),
            'Grid Columns',
            1,
            24,
            1
          )}

          <div className="mb-4 flex items-center space-x-2">
            <Switch
              id="responsive-toggle"
              checked={uiDesign.layout.responsive}
              onCheckedChange={(checked: boolean) =>
                handleLayoutChange('responsive', checked)
              }
            />
            <Label htmlFor="responsive-toggle">Responsive Layout</Label>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">Spacing</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="mb-4">
            <Label className="mb-1 block">Base Unit</Label>
            <Input
              type="text"
              value={uiDesign.spacing.unit}
              onChange={(e) => handleSpacingChange('unit', e.target.value)}
              placeholder="4px"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">Spacing Scale</Label>
            <Input
              type="text"
              value={uiDesign.spacing.scale.join(', ')}
              onChange={(e) => {
                const scaleValues = e.target.value
                  .split(',')
                  .map((val) => parseInt(val.trim()))
                  .filter((val) => !isNaN(val));
                handleSpacingChange('scale', scaleValues);
              }}
              placeholder="0, 1, 2, 4, 8, 16, ..."
            />
            <span className="mt-1 block text-xs text-slate-500">Comma-separated values</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">Border Radius</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="mb-4">
            <Label className="mb-1 block">Small Radius</Label>
            <Input
              type="text"
              value={uiDesign.borderRadius.small}
              onChange={(e) => handleBorderRadiusChange('small', e.target.value)}
              placeholder="2px"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">Medium Radius</Label>
            <Input
              type="text"
              value={uiDesign.borderRadius.medium}
              onChange={(e) => handleBorderRadiusChange('medium', e.target.value)}
              placeholder="4px"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">Large Radius</Label>
            <Input
              type="text"
              value={uiDesign.borderRadius.large}
              onChange={(e) => handleBorderRadiusChange('large', e.target.value)}
              placeholder="8px"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">Extra Large Radius</Label>
            <Input
              type="text"
              value={uiDesign.borderRadius.xl}
              onChange={(e) => handleBorderRadiusChange('xl', e.target.value)}
              placeholder="12px"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">Pill Radius</Label>
            <Input
              type="text"
              value={uiDesign.borderRadius.pill}
              onChange={(e) => handleBorderRadiusChange('pill', e.target.value)}
              placeholder="9999px"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">Shadows</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="mb-4">
            <Label className="mb-1 block">Small Shadow</Label>
            <Input
              type="text"
              value={uiDesign.shadows.small}
              onChange={(e) => handleShadowsChange('small', e.target.value)}
              placeholder="0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">Medium Shadow</Label>
            <Input
              type="text"
              value={uiDesign.shadows.medium}
              onChange={(e) => handleShadowsChange('medium', e.target.value)}
              placeholder="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">Large Shadow</Label>
            <Input
              type="text"
              value={uiDesign.shadows.large}
              onChange={(e) => handleShadowsChange('large', e.target.value)}
              placeholder="0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">Extra Large Shadow</Label>
            <Input
              type="text"
              value={uiDesign.shadows.xl}
              onChange={(e) => handleShadowsChange('xl', e.target.value)}
              placeholder="0 20px 25px -5px rgba(0, 0, 0, 0.1)"
            />
          </div>
        </div>
      </Card>

      {/* Layout Preview */}
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">Layout Preview</h3>
        <div className="rounded-md border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-600 dark:text-slate-300">Border Radius Samples</h4>
            <div className="mt-2 flex flex-wrap gap-4">
              <div className="flex flex-col items-center">
                <div 
                  className="h-12 w-12 bg-primary-500" 
                  style={{ borderRadius: uiDesign.borderRadius.small, backgroundColor: uiDesign.colors.primary }}
                ></div>
                <span className="mt-1 text-xs text-slate-500">Small</span>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="h-12 w-12 bg-primary-500" 
                  style={{ borderRadius: uiDesign.borderRadius.medium, backgroundColor: uiDesign.colors.primary }}
                ></div>
                <span className="mt-1 text-xs text-slate-500">Medium</span>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="h-12 w-12 bg-primary-500" 
                  style={{ borderRadius: uiDesign.borderRadius.large, backgroundColor: uiDesign.colors.primary }}
                ></div>
                <span className="mt-1 text-xs text-slate-500">Large</span>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="h-12 w-12 bg-primary-500" 
                  style={{ borderRadius: uiDesign.borderRadius.xl, backgroundColor: uiDesign.colors.primary }}
                ></div>
                <span className="mt-1 text-xs text-slate-500">XL</span>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="h-12 w-20 bg-primary-500" 
                  style={{ borderRadius: uiDesign.borderRadius.pill, backgroundColor: uiDesign.colors.primary }}
                ></div>
                <span className="mt-1 text-xs text-slate-500">Pill</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-slate-600 dark:text-slate-300">Shadow Samples</h4>
            <div className="mt-2 flex flex-wrap gap-6">
              <div className="flex flex-col items-center">
                <div 
                  className="h-16 w-16 rounded-md bg-white" 
                  style={{ boxShadow: uiDesign.shadows.small }}
                ></div>
                <span className="mt-1 text-xs text-slate-500">Small</span>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="h-16 w-16 rounded-md bg-white" 
                  style={{ boxShadow: uiDesign.shadows.medium }}
                ></div>
                <span className="mt-1 text-xs text-slate-500">Medium</span>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="h-16 w-16 rounded-md bg-white" 
                  style={{ boxShadow: uiDesign.shadows.large }}
                ></div>
                <span className="mt-1 text-xs text-slate-500">Large</span>
              </div>
              <div className="flex flex-col items-center">
                <div 
                  className="h-16 w-16 rounded-md bg-white" 
                  style={{ boxShadow: uiDesign.shadows.xl }}
                ></div>
                <span className="mt-1 text-xs text-slate-500">Extra Large</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
} 