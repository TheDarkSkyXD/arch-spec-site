import { TestCasesData } from '../../services/testCasesService';
import Card from '../ui/Card';
import { markdownService } from '../../services/markdown';
import PreviewFactory from './PreviewFactory';

interface TestCasesPreviewProps {
  data: Partial<TestCasesData> | null;
  projectName?: string;
  isLoading?: boolean;
}

const TestCasesPreview = ({ data, projectName, isLoading = false }: TestCasesPreviewProps) => {
  if (isLoading) {
    return <PreviewFactory markdown="" fileName="" isLoading={true} />;
  }

  if (!data || !data.testCases || data.testCases.length === 0) {
    return (
      <Card className="p-6 text-center italic text-slate-400 dark:text-slate-500">
        No test cases available to preview
      </Card>
    );
  }

  // Generate markdown using the service
  const markdown = markdownService.generateTestCasesMarkdown(data);
  const fileName = markdownService.generateFileName(projectName, 'test-cases');

  return <PreviewFactory markdown={markdown} fileName={fileName} />;
};

export default TestCasesPreview;
