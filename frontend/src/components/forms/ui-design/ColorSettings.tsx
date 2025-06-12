import { UIDesign } from '../../../types/templates';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';

interface ColorSettingsProps {
  uiDesign: UIDesign;
  handleColorChange: (colorSection: 'colors' | 'darkMode.colors', colorName: string, value: string) => void;
  handleDarkModeToggle: (enabled: boolean) => void;
}

export default function ColorSettings({ uiDesign, handleColorChange, handleDarkModeToggle }: ColorSettingsProps) {
  // Render color picker component
  const renderColorPicker = (
    section: 'colors' | 'darkMode.colors',
    colorName: string,
    label: string
  ) => {
    const colorValue =
      section === 'colors'
        ? uiDesign.colors[colorName as keyof typeof uiDesign.colors]
        : uiDesign.darkMode.colors[colorName as keyof typeof uiDesign.darkMode.colors];

    return (
      <div className="mb-4">
        <Label className="mb-1 block">{label}</Label>
        <div className="flex space-x-2">
          <Input
            type="color"
            value={colorValue}
            onChange={(e) => handleColorChange(section, colorName, e.target.value)}
            className="h-10 w-12 p-1"
          />
          <Input
            type="text"
            value={colorValue}
            onChange={(e) => handleColorChange(section, colorName, e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">Color Palette</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {renderColorPicker('colors', 'primary', 'Primary')}
          {renderColorPicker('colors', 'secondary', 'Secondary')}
          {renderColorPicker('colors', 'accent', 'Accent')}
          {renderColorPicker('colors', 'background', 'Background')}
          {renderColorPicker('colors', 'textPrimary', 'Text Primary')}
          {renderColorPicker('colors', 'textSecondary', 'Text Secondary')}
          {renderColorPicker('colors', 'success', 'Success')}
          {renderColorPicker('colors', 'warning', 'Warning')}
          {renderColorPicker('colors', 'error', 'Error')}
          {renderColorPicker('colors', 'info', 'Info')}
          {renderColorPicker('colors', 'surface', 'Surface')}
          {renderColorPicker('colors', 'border', 'Border')}
        </div>
      </Card>

      {/* Color Preview Section */}
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">Color Preview</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div 
              className="flex h-20 w-20 items-center justify-center rounded-md shadow-md" 
              style={{ backgroundColor: uiDesign.colors.primary, color: '#fff' }}
            >
              Primary
            </div>
            <div 
              className="flex h-20 w-20 items-center justify-center rounded-md shadow-md" 
              style={{ backgroundColor: uiDesign.colors.secondary, color: '#fff' }}
            >
              Secondary
            </div>
            <div 
              className="flex h-20 w-20 items-center justify-center rounded-md shadow-md" 
              style={{ backgroundColor: uiDesign.colors.accent, color: '#fff' }}
            >
              Accent
            </div>
            <div 
              className="flex h-20 w-20 items-center justify-center rounded-md border shadow-md" 
              style={{ backgroundColor: uiDesign.colors.background, color: uiDesign.colors.textPrimary }}
            >
              Bg
            </div>
            <div 
              className="flex h-20 w-20 items-center justify-center rounded-md shadow-md" 
              style={{ backgroundColor: uiDesign.colors.surface, color: uiDesign.colors.textPrimary, borderColor: uiDesign.colors.border, borderWidth: '1px' }}
            >
              Surface
            </div>
          </div>

          <div className="rounded-md bg-white p-4 shadow-md" style={{ backgroundColor: uiDesign.colors.background }}>
            <h4 className="text-lg font-semibold" style={{ color: uiDesign.colors.textPrimary }}>Sample Text</h4>
            <p style={{ color: uiDesign.colors.textSecondary }}>This is how your text will appear with the selected colors.</p>
            <div className="mt-2 flex gap-2">
              <span className="inline-block rounded-full px-2 py-1 text-xs" style={{ backgroundColor: uiDesign.colors.success, color: '#fff' }}>Success</span>
              <span className="inline-block rounded-full px-2 py-1 text-xs" style={{ backgroundColor: uiDesign.colors.warning, color: '#fff' }}>Warning</span>
              <span className="inline-block rounded-full px-2 py-1 text-xs" style={{ backgroundColor: uiDesign.colors.error, color: '#fff' }}>Error</span>
              <span className="inline-block rounded-full px-2 py-1 text-xs" style={{ backgroundColor: uiDesign.colors.info, color: '#fff' }}>Info</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Dark Mode</h3>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode-toggle">Enable Dark Mode</Label>
            <Switch
              id="dark-mode-toggle"
              checked={uiDesign.darkMode.enabled}
              onCheckedChange={(checked: boolean) => handleDarkModeToggle(checked)}
            />
          </div>
        </div>

        {uiDesign.darkMode.enabled && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {renderColorPicker('darkMode.colors', 'background', 'Background')}
            {renderColorPicker('darkMode.colors', 'textPrimary', 'Text Primary')}
            {renderColorPicker('darkMode.colors', 'textSecondary', 'Text Secondary')}
            {renderColorPicker('darkMode.colors', 'surface', 'Surface')}
            {renderColorPicker('darkMode.colors', 'border', 'Border')}
          </div>
        )}

        {/* Dark Mode Preview */}
        {uiDesign.darkMode.enabled && (
          <div className="mt-4 rounded-md p-4 shadow-md" style={{ backgroundColor: uiDesign.darkMode.colors.background }}>
            <h4 className="text-lg font-semibold" style={{ color: uiDesign.darkMode.colors.textPrimary }}>Dark Mode Preview</h4>
            <p style={{ color: uiDesign.darkMode.colors.textSecondary }}>This is how your text will appear in dark mode.</p>
            <div 
              className="mt-2 rounded-md p-3" 
              style={{ 
                backgroundColor: uiDesign.darkMode.colors.surface,
                borderColor: uiDesign.darkMode.colors.border,
                borderWidth: '1px',
                color: uiDesign.darkMode.colors.textPrimary
              }}
            >
              Surface element with border
            </div>
          </div>
        )}
      </Card>
    </>
  );
} 