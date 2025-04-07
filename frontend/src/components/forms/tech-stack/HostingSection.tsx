import { UseFormRegister, Control, UseFormSetValue } from 'react-hook-form';
import { TechStackFormData } from './techStackSchema';
import { useEffect, useRef } from 'react';
import { ProjectTechStack } from '../../../types/templates';
import { Technology } from '../../../types/techStack';

// Import shadcn UI components
import { Label } from '../../ui/label';
import { Select } from '../../ui/select';

interface HostingSectionProps {
  register: UseFormRegister<TechStackFormData>;
  hostingFrontendOptions: Technology[];
  hostingBackendOptions: Technology[];
  control: Control<TechStackFormData>;
  setValue: UseFormSetValue<TechStackFormData>;
  initialData?: ProjectTechStack;
}

const HostingSection = ({
  register,
  hostingFrontendOptions,
  hostingBackendOptions,
  setValue,
  initialData,
}: HostingSectionProps) => {
  // Create a ref to track whether we've applied initial data
  const initialDataAppliedRef = useRef<boolean>(false);

  // Reset form values if templateId is null
  useEffect(() => {
    if (!initialData) {
      setValue('hosting_frontend', '', { shouldDirty: false });
      setValue('hosting_backend', '', { shouldDirty: false });
    }
  }, [initialData, setValue]);

  // Set initial values if they exist
  useEffect(() => {
    if (!initialData) return;

    console.log('Checking initial data for hosting section:', initialData);

    // Track values that were successfully set
    let valuesWereSet = false;

    // Check and set frontend hosting
    if (initialData.hosting?.frontend) {
      setValue('hosting_frontend', initialData.hosting.frontend, {
        shouldDirty: true,
      });
      console.log('Setting initial frontend hosting:', initialData.hosting.frontend);
      valuesWereSet = true;
    }

    // Check and set backend hosting
    if (initialData.hosting?.backend) {
      setValue('hosting_backend', initialData.hosting.backend, {
        shouldDirty: true,
      });
      console.log('Setting initial backend hosting:', initialData.hosting.backend);
      valuesWereSet = true;
    }

    // Mark as applied if any values were set
    if (valuesWereSet) {
      initialDataAppliedRef.current = true;
    }
  }, [initialData, setValue]);

  return (
    <div>
      <h3 className="mb-4 text-lg font-medium text-slate-800 dark:text-slate-100">Hosting</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="hosting_frontend">Frontend Hosting</Label>
          <Select id="hosting_frontend" {...register('hosting_frontend')}>
            <option value="">Select Frontend Hosting</option>
            {hostingFrontendOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.id}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="hosting_backend">Backend Hosting</Label>
          <Select id="hosting_backend" {...register('hosting_backend')}>
            <option value="">Select Backend Hosting</option>
            {hostingBackendOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.id}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default HostingSection;
