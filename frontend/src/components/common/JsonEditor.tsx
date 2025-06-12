import { useState } from 'react';
import ReactJson from '@microlink/react-json-view';

interface JsonEditorProps<T extends Record<string, unknown>> {
  data: T;
  onEdit?: (edit: { updated_src: T }) => void;
  readOnly?: boolean;
  title?: string;
  className?: string;
}

/**
 * A reusable component for displaying and editing JSON data with both raw and visual views
 */
const JsonEditor = <T extends Record<string, unknown>>({
  data,
  onEdit,
  readOnly = false,
  title,
  className = '',
}: JsonEditorProps<T>) => {
  const [activeView, setActiveView] = useState<'visual' | 'raw'>('visual');

  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      {title && (
        <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <h3 className="font-medium text-slate-800 dark:text-slate-200">{title}</h3>
        </div>
      )}

      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeView === 'visual'
                ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            onClick={() => setActiveView('visual')}
          >
            Visual Editor
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeView === 'raw'
                ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            onClick={() => setActiveView('raw')}
          >
            Raw JSON
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeView === 'visual' ? (
          <div
            className="overflow-auto text-left dark:bg-slate-800"
            style={{ maxHeight: 'calc(100vh - 16rem)' }}
          >
            <ReactJson
              src={data}
              name={null}
              theme={
                document.documentElement.classList.contains('dark') ? 'twilight' : 'rjv-default'
              }
              iconStyle="circle"
              indentWidth={2}
              collapsed={false}
              collapseStringsAfterLength={50}
              enableClipboard={true}
              displayDataTypes={false}
              onEdit={
                !readOnly ? (edit) => onEdit?.(edit as unknown as { updated_src: T }) : undefined
              }
              onAdd={
                !readOnly ? (edit) => onEdit?.(edit as unknown as { updated_src: T }) : undefined
              }
              onDelete={
                !readOnly ? (edit) => onEdit?.(edit as unknown as { updated_src: T }) : undefined
              }
              style={{
                backgroundColor: 'transparent',
                textAlign: 'left',
                fontFamily: 'monospace',
              }}
            />
          </div>
        ) : (
          <div
            className="overflow-auto rounded-lg bg-slate-900 p-4 dark:bg-slate-950"
            style={{ maxHeight: 'calc(100vh - 16rem)' }}
          >
            <pre className="whitespace-pre-wrap text-left text-sm text-green-400">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonEditor;
