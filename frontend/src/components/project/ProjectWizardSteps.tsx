import { ReactNode } from "react";
import ProgressBar from "../common/ProgressBar";
import {
  LayoutTemplate,
  FileText,
  Code,
  List,
  Server,
  Globe,
  Database,
  CheckCircle,
} from "lucide-react";

export interface Step {
  id: string;
  name: string;
  icon: ReactNode;
}

export const projectWizardSteps: Step[] = [
  { id: "template", name: "Template", icon: <LayoutTemplate size={16} /> },
  { id: "basics", name: "Project Basics", icon: <FileText size={16} /> },
  { id: "tech-stack", name: "Tech Stack", icon: <Code size={16} /> },
  { id: "requirements", name: "Requirements", icon: <List size={16} /> },
  { id: "features", name: "Features", icon: <Server size={16} /> },
  { id: "pages", name: "Pages", icon: <Globe size={16} /> },
  { id: "api", name: "API Endpoints", icon: <Database size={16} /> },
  { id: "review", name: "Review", icon: <CheckCircle size={16} /> },
];

interface ProjectWizardStepsProps {
  currentStep: string;
  onStepClick: (stepId: string) => void;
}

const ProjectWizardSteps = ({ currentStep, onStepClick }: ProjectWizardStepsProps) => {
  return (
    <ProgressBar
      steps={projectWizardSteps}
      currentStep={currentStep}
      onStepClick={onStepClick}
    />
  );
};

export default ProjectWizardSteps;