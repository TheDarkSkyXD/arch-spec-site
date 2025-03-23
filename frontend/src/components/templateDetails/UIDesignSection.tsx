import React from "react";
import { UIDesign } from "../../types/templates";
import { Palette } from "lucide-react";
import { CollapsibleSection } from ".";

interface UIDesignSectionProps {
  uiDesign: UIDesign;
  isOpen: boolean;
  onToggle: () => void;
}

const UIDesignSection: React.FC<UIDesignSectionProps> = ({
  uiDesign,
  isOpen,
  onToggle,
}) => {
  return (
    <CollapsibleSection
      title="UI Design"
      icon={<Palette className="h-5 w-5 text-primary-500" />}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="p-5">
        {/* Color palette preview */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Color Palette
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {Object.entries(uiDesign.colors).map(([name, color]) => (
              <div key={name} className="text-center">
                <div
                  className="h-8 w-full rounded border border-slate-200 dark:border-slate-700 mb-1"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Typography preview */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Typography
          </h4>
          <div
            className="mb-2"
            style={{ fontFamily: uiDesign.typography.fontFamily }}
          >
            <div
              style={{
                fontSize: uiDesign.typography.headingSizes.h1,
                fontFamily: uiDesign.typography.headingFont,
              }}
              className="text-slate-800 dark:text-slate-200 font-semibold"
            >
              Heading 1
            </div>
            <div
              style={{
                fontSize: uiDesign.typography.headingSizes.h2,
                fontFamily: uiDesign.typography.headingFont,
              }}
              className="text-slate-800 dark:text-slate-200 font-semibold"
            >
              Heading 2
            </div>
            <div
              className="mt-2 text-slate-700 dark:text-slate-300"
              style={{
                fontSize: uiDesign.typography.fontSize,
                lineHeight: uiDesign.typography.lineHeight,
              }}
            >
              Body text sample with the selected font family, size, and line
              height. This demonstrates how the typography settings will look in
              your application.
            </div>
          </div>
        </div>

        {/* Component styles preview */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Component Styles
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Button Style</div>
              <div
                className={`inline-block px-4 py-2 bg-primary-600 text-white text-sm font-medium
                ${
                  uiDesign.components.buttonStyle === "rounded"
                    ? "rounded"
                    : uiDesign.components.buttonStyle === "pill"
                    ? "rounded-full"
                    : "rounded-none"
                }`}
              >
                Button
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-1">Card Style</div>
              <div
                className={`p-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                ${
                  uiDesign.components.cardStyle === "shadow"
                    ? "shadow-md"
                    : uiDesign.components.cardStyle === "outline"
                    ? "border-2"
                    : ""
                } 
                ${uiDesign.borderRadius.medium}`}
              >
                Card Component
              </div>
            </div>
          </div>
        </div>

        {/* Additional details as a table */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Additional Details
          </h4>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td className="py-2 text-slate-600 dark:text-slate-400">
                  Dark Mode
                </td>
                <td className="py-2 text-slate-900 dark:text-slate-100 text-right">
                  {uiDesign.darkMode.enabled ? "Enabled" : "Disabled"}
                </td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td className="py-2 text-slate-600 dark:text-slate-400">
                  Animations
                </td>
                <td className="py-2 text-slate-900 dark:text-slate-100 text-right">
                  {uiDesign.animations.enableAnimations
                    ? "Enabled"
                    : "Disabled"}
                </td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td className="py-2 text-slate-600 dark:text-slate-400">
                  Layout
                </td>
                <td className="py-2 text-slate-900 dark:text-slate-100 text-right">
                  {uiDesign.layout.containerWidth} /{" "}
                  {uiDesign.layout.gridColumns} columns
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-600 dark:text-slate-400">
                  Border Radius
                </td>
                <td className="py-2 text-slate-900 dark:text-slate-100 text-right">
                  {uiDesign.borderRadius.medium} (medium)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default UIDesignSection;
