import { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import Button from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

interface MarkdownActionsProps {
  markdown: string;
  fileName?: string;
  className?: string;
}

const MarkdownActions = ({
  markdown,
  fileName = 'document.md',
  className = '',
}: MarkdownActionsProps) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  // Copy markdown to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);

      showToast({
        title: 'Copied!',
        description: 'Markdown copied to clipboard',
        type: 'success',
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);

      showToast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        type: 'error',
      });
    }
  };

  // Download markdown as a file
  const downloadMarkdown = () => {
    try {
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast({
        title: 'Downloaded!',
        description: `File saved as ${fileName}`,
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to download file: ', err);

      showToast({
        title: 'Error',
        description: 'Failed to download file',
        type: 'error',
      });
    }
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      <Button
        onClick={copyToClipboard}
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </Button>

      <Button
        onClick={downloadMarkdown}
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
      >
        <Download size={16} />
        <span>Download</span>
      </Button>
    </div>
  );
};

export default MarkdownActions;
