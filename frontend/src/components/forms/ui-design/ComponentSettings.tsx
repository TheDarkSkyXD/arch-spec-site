import { UIDesign } from '../../../types/templates';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';

interface ComponentSettingsProps {
  uiDesign: UIDesign;
  buttonStyles: string[];
  inputStyles: string[];
  cardStyles: string[];
  tableStyles: string[];
  navStyles: string[];
  handleComponentStyleChange: (componentType: string, value: string) => void;
  handleAnimationsChange: (animationType: string, value: string | number | boolean) => void;
}

export default function ComponentSettings({
  uiDesign,
  buttonStyles,
  inputStyles,
  cardStyles,
  tableStyles,
  navStyles,
  handleComponentStyleChange,
  handleAnimationsChange,
}: ComponentSettingsProps) {
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
        <h3 className="mb-4 text-lg font-medium">Component Styles</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {renderSelect(
            buttonStyles,
            uiDesign.components.buttonStyle,
            (value) => handleComponentStyleChange('buttonStyle', value),
            'Button Style'
          )}

          {renderSelect(
            inputStyles,
            uiDesign.components.inputStyle,
            (value) => handleComponentStyleChange('inputStyle', value),
            'Input Style'
          )}

          {renderSelect(
            cardStyles,
            uiDesign.components.cardStyle,
            (value) => handleComponentStyleChange('cardStyle', value),
            'Card Style'
          )}

          {renderSelect(
            tableStyles,
            uiDesign.components.tableStyle,
            (value) => handleComponentStyleChange('tableStyle', value),
            'Table Style'
          )}

          {renderSelect(
            navStyles,
            uiDesign.components.navStyle,
            (value) => handleComponentStyleChange('navStyle', value),
            'Navigation Style'
          )}
        </div>
      </Card>

      {/* Component Preview */}
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">Component Previews</h3>
        <div className="space-y-6">
          {/* Button Preview */}
          <div>
            <h4 className="mb-2 font-medium text-slate-600 dark:text-slate-300">Button Style: {uiDesign.components.buttonStyle}</h4>
            <div className="flex flex-wrap gap-3">
              <div
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white"
                style={{
                  backgroundColor: uiDesign.colors.primary,
                  borderRadius:
                    uiDesign.components.buttonStyle === 'rounded'
                      ? uiDesign.borderRadius.medium
                      : uiDesign.components.buttonStyle === 'square'
                      ? uiDesign.borderRadius.small
                      : uiDesign.borderRadius.pill,
                }}
              >
                Primary Button
              </div>
              <div
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor: 'transparent',
                  color: uiDesign.colors.primary,
                  border: `1px solid ${uiDesign.colors.primary}`,
                  borderRadius:
                    uiDesign.components.buttonStyle === 'rounded'
                      ? uiDesign.borderRadius.medium
                      : uiDesign.components.buttonStyle === 'square'
                      ? uiDesign.borderRadius.small
                      : uiDesign.borderRadius.pill,
                }}
              >
                Secondary Button
              </div>
            </div>
          </div>

          {/* Input Preview */}
          <div>
            <h4 className="mb-2 font-medium text-slate-600 dark:text-slate-300">Input Style: {uiDesign.components.inputStyle}</h4>
            <div
              className="w-full px-3 py-2 text-sm"
              style={{
                backgroundColor:
                  uiDesign.components.inputStyle === 'filled'
                    ? `${uiDesign.colors.background}E6` // with transparency
                    : 'transparent',
                color: uiDesign.colors.textPrimary,
                border:
                  uiDesign.components.inputStyle === 'underline'
                    ? 'none'
                    : `1px solid ${uiDesign.colors.border}`,
                borderRadius:
                  uiDesign.components.inputStyle === 'underline'
                    ? '0'
                    : uiDesign.borderRadius.medium,
                borderBottom:
                  uiDesign.components.inputStyle === 'underline'
                    ? `2px solid ${uiDesign.colors.border}`
                    : undefined,
              }}
            >
              Input field example
            </div>
          </div>

          {/* Card Preview */}
          <div>
            <h4 className="mb-2 font-medium text-slate-600 dark:text-slate-300">Card Style: {uiDesign.components.cardStyle}</h4>
            <div
              className="p-4"
              style={{
                backgroundColor: uiDesign.colors.surface,
                color: uiDesign.colors.textPrimary,
                border:
                  uiDesign.components.cardStyle === 'outline' || uiDesign.components.cardStyle === 'flat'
                    ? `1px solid ${uiDesign.colors.border}`
                    : 'none',
                borderRadius: uiDesign.borderRadius.medium,
                boxShadow:
                  uiDesign.components.cardStyle === 'shadow'
                    ? uiDesign.shadows.medium
                    : uiDesign.components.cardStyle === 'flat'
                    ? 'none'
                    : undefined,
              }}
            >
              <h5 className="mb-2 text-base font-medium">Card Example</h5>
              <p className="text-sm" style={{ color: uiDesign.colors.textSecondary }}>
                This is how your cards will appear with the selected style.
              </p>
            </div>
          </div>

          {/* Navigation Style Preview */}
          <div>
            <h4 className="mb-2 font-medium text-slate-600 dark:text-slate-300">Navigation Style: {uiDesign.components.navStyle}</h4>
            <div className="flex">
              {uiDesign.components.navStyle === 'pills' && (
                <div className="flex space-x-2">
                  <div
                    className="px-4 py-2 text-sm font-medium"
                    style={{
                      backgroundColor: uiDesign.colors.primary,
                      color: '#fff',
                      borderRadius: uiDesign.borderRadius.pill,
                    }}
                  >
                    Active
                  </div>
                  <div
                    className="px-4 py-2 text-sm font-medium"
                    style={{
                      backgroundColor: 'transparent',
                      color: uiDesign.colors.textPrimary,
                    }}
                  >
                    Link
                  </div>
                  <div
                    className="px-4 py-2 text-sm font-medium"
                    style={{
                      backgroundColor: 'transparent',
                      color: uiDesign.colors.textPrimary,
                    }}
                  >
                    Link
                  </div>
                </div>
              )}

              {uiDesign.components.navStyle === 'tabs' && (
                <div className="flex space-x-2">
                  <div
                    className="border-b-2 px-4 py-2 text-sm font-medium"
                    style={{
                      borderColor: uiDesign.colors.primary,
                      color: uiDesign.colors.primary,
                    }}
                  >
                    Active
                  </div>
                  <div
                    className="px-4 py-2 text-sm font-medium"
                    style={{
                      color: uiDesign.colors.textPrimary,
                    }}
                  >
                    Link
                  </div>
                  <div
                    className="px-4 py-2 text-sm font-medium"
                    style={{
                      color: uiDesign.colors.textPrimary,
                    }}
                  >
                    Link
                  </div>
                </div>
              )}

              {uiDesign.components.navStyle === 'links' && (
                <div className="flex space-x-6">
                  <div
                    className="text-sm font-medium"
                    style={{
                      color: uiDesign.colors.primary,
                      textDecoration: 'underline',
                    }}
                  >
                    Active
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{
                      color: uiDesign.colors.textPrimary,
                    }}
                  >
                    Link
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{
                      color: uiDesign.colors.textPrimary,
                    }}
                  >
                    Link
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">Animations</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="mb-4">
            <Label className="mb-1 block">Transition Duration</Label>
            <Input
              type="text"
              value={uiDesign.animations.transitionDuration}
              onChange={(e) => handleAnimationsChange('transitionDuration', e.target.value)}
              placeholder="150ms"
            />
          </div>

          <div className="mb-4">
            <Label className="mb-1 block">Transition Timing</Label>
            <Input
              type="text"
              value={uiDesign.animations.transitionTiming}
              onChange={(e) => handleAnimationsChange('transitionTiming', e.target.value)}
              placeholder="ease-in-out"
            />
          </div>

          {renderNumberInput(
            uiDesign.animations.hoverScale,
            (value) => handleAnimationsChange('hoverScale', value),
            'Hover Scale',
            1,
            2,
            0.01
          )}

          <div className="mb-4 flex items-center space-x-2">
            <Switch
              id="animations-toggle"
              checked={uiDesign.animations.enableAnimations}
              onCheckedChange={(checked: boolean) =>
                handleAnimationsChange('enableAnimations', checked)
              }
            />
            <Label htmlFor="animations-toggle">Enable Animations</Label>
          </div>
        </div>

        {/* Animation Preview */}
        {uiDesign.animations.enableAnimations && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-slate-600 dark:text-slate-300">Animation Preview</h4>
            <div className="flex flex-wrap gap-6">
              <div className="space-y-2 text-center">
                <span className="text-sm text-slate-500">Hover Scale Effect</span>
                <div
                  className="mx-auto h-20 w-20 cursor-pointer rounded-md bg-gradient-to-r from-blue-400 to-violet-500 p-2 text-white transition-transform hover:scale-110"
                  style={{
                    transition: `transform ${uiDesign.animations.transitionDuration} ${uiDesign.animations.transitionTiming}`,
                  }}
                >
                  Hover me
                </div>
                <span className="block text-xs text-slate-500">Scale: {uiDesign.animations.hoverScale}</span>
              </div>

              <div className="space-y-2 text-center">
                <span className="text-sm text-slate-500">Transition Speed</span>
                <div className="relative mx-auto h-20 w-32 overflow-hidden rounded-md border bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                  <div
                    className="absolute left-0 top-0 h-full w-1/2 bg-primary-500 p-2 text-center text-xs text-white animate-slide"
                    style={{
                      backgroundColor: uiDesign.colors.primary,
                      transition: `transform ${uiDesign.animations.transitionDuration} ${uiDesign.animations.transitionTiming}`,
                      animationDuration: '2s',
                      animationTimingFunction: uiDesign.animations.transitionTiming,
                      animationIterationCount: 'infinite',
                      animationDirection: 'alternate',
                    }}
                  >
                    Sliding
                  </div>
                </div>
                <span className="block text-xs text-slate-500">
                  Duration: {uiDesign.animations.transitionDuration}
                </span>
              </div>

              <div className="space-y-2 text-center">
                <span className="text-sm text-slate-500">Timing Function</span>
                <div className="mx-auto flex h-20 w-auto items-center gap-2">
                  {['ease-in-out', 'ease-in', 'ease-out', 'linear'].map((timing) => (
                    <div
                      key={timing}
                      className="h-16 w-4 rounded bg-slate-300 hover:h-20 dark:bg-slate-700"
                      style={{
                        backgroundColor: timing === uiDesign.animations.transitionTiming
                          ? uiDesign.colors.primary
                          : undefined,
                        transition: `height ${uiDesign.animations.transitionDuration} ${timing}`,
                        border: timing === uiDesign.animations.transitionTiming
                          ? `2px solid ${uiDesign.colors.primary}`
                          : undefined,
                      }}
                    />
                  ))}
                </div>
                <span className="block text-xs text-slate-500">
                  Timing: {uiDesign.animations.transitionTiming}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </>
  );
} 