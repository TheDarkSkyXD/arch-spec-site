import {
  UseFormRegister,
  FormState,
  Control,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { BaaS, BackendFramework, Realtime, Serverless } from "../../../types/techStack";
import { TechStackFormData } from "../tech-stack/techStackSchema";
import { useEffect, useMemo, useRef } from "react";
import {
  ProjectTechStack,
  FrameworkBackend,
  BaaSBackend,
  ServerlessBackend,
} from "../../../types/templates";
import {
  filterBackendFrameworkOptions,
  filterBackendRealtimeOptions,
  filterBackendBaaSOptions,
  getBackendServiceOptions,
} from "../../../utils/backendTechStackFilterUtils";

// Import shadcn UI components
import { Label } from "../../ui/label";
import { Select } from "../../ui/select";

interface BackendSectionProps {
  register: UseFormRegister<TechStackFormData>;
  errors: FormState<TechStackFormData>["errors"];
  backendFrameworks: BackendFramework[];
  backendBaaS: BaaS[];
  backendRealtime: Realtime[];
  backendServerless: Serverless[];
  setValue: UseFormSetValue<TechStackFormData>;
  control: Control<TechStackFormData>;
  initialData?: ProjectTechStack;
}

const BackendSection = ({
  register,
  errors,
  backendFrameworks,
  backendBaaS,
  backendRealtime,
  backendServerless,
  control,
  setValue,
  initialData,
}: BackendSectionProps) => {
  // Create a ref to track whether we've applied initial data
  const initialDataAppliedRef = useRef<boolean>(false);

  // Watch for form value changes
  const watchedValues = useWatch({
    control,
    name: [
      "backend_type",
      "backend_framework",
      "backend_language",
      "backend_service",
      "backend_realtime",
      "backend_functions",
    ],
  });

  const [
    backendType,
    backendFramework,
    backendLanguage,
    backendService,
    backendRealtimeValue,
    backendFunctionsValue,
  ] = watchedValues;

  // Reset form values if templateId is null
  useEffect(() => {
    if (!initialData) {
      setValue("backend_type", "", { shouldDirty: false });
      setValue("backend_framework", "", { shouldDirty: false });
      setValue("backend_language", "", { shouldDirty: false });
      setValue("backend_service", "", { shouldDirty: false });
      setValue("backend_realtime", "", { shouldDirty: false });
      setValue("backend_functions", "", { shouldDirty: false });
    }
  }, [initialData, setValue]);

  // Filter options based on selections using memoized values for performance
  const filteredFrameworks = useMemo(
    () => filterBackendFrameworkOptions(backendLanguage, backendFrameworks),
    [backendLanguage, backendFrameworks]
  );

  const filteredRealtime = useMemo(
    () =>
      filterBackendRealtimeOptions(
        backendType,
        backendFramework,
        backendService,
        backendFrameworks,
        backendRealtime
      ),
    [
      backendType,
      backendFramework,
      backendService,
      backendFrameworks,
      backendRealtime,
    ]
  );

  const filteredBaaS = useMemo(
    () =>
      filterBackendBaaSOptions(
        backendRealtimeValue,
        backendFunctionsValue,
        backendBaaS
      ),
    [backendRealtimeValue, backendFunctionsValue, backendBaaS]
  );

  const serviceOptions = useMemo(
    () =>
      getBackendServiceOptions(backendType, filteredBaaS, backendServerless),
    [backendType, filteredBaaS, backendServerless]
  );

  // Set initial values from the project template
  useEffect(() => {
    if (!initialData || initialDataAppliedRef.current || !initialData.backend)
      return;

    console.log(
      "Checking initial data for backend section:",
      initialData.backend
    );

    // Track values that were successfully set
    let valuesWereSet = false;
    const backend = initialData.backend;

    // Set backend type
    setValue("backend_type", backend.type, { shouldDirty: true });
    console.log("Setting initial backend type:", backend.type);
    valuesWereSet = true;

    // Set values based on backend type
    if (backend.type === "framework") {
      const frameworkBackend = backend as FrameworkBackend;

      // Check if framework exists in options
      const frameworkExists = backendFrameworks.some(
        (fw) => fw.id === frameworkBackend.framework
      );

      if (frameworkExists) {
        setValue("backend_framework", frameworkBackend.framework, {
          shouldDirty: true,
        });
        console.log(
          "Setting initial backend framework:",
          frameworkBackend.framework
        );
      } else {
        console.log(
          "Initial backend framework not available in options:",
          frameworkBackend.framework
        );
      }

      // Set realtime if provided
      if (frameworkBackend.realtime) {
        const realtimeExists = backendRealtime.some(
          (rt) => rt.id === frameworkBackend.realtime
        );

        if (realtimeExists) {
          setValue("backend_realtime", frameworkBackend.realtime, {
            shouldDirty: true,
          });
          console.log(
            "Setting initial realtime support:",
            frameworkBackend.realtime
          );
        }
      }
    } else if (backend.type === "baas") {
      const baasBackend = backend as BaaSBackend;

      // Check if service exists in options
      const serviceExists = backendBaaS.some(
        (baas) => baas.id === baasBackend.service
      );

      if (serviceExists) {
        setValue("backend_service", baasBackend.service, { shouldDirty: true });
        console.log("Setting initial BaaS service:", baasBackend.service);
      } else {
        console.log(
          "Initial BaaS service not available in options:",
          baasBackend.service
        );
      }

      // Set functions if provided
      if (baasBackend.functions) {
        const functionsExists = backendServerless.some(
          (func) => func.id === baasBackend.functions
        );

        if (functionsExists) {
          setValue("backend_functions", baasBackend.functions, {
            shouldDirty: true,
          });
          console.log(
            "Setting initial serverless functions:",
            baasBackend.functions
          );
        }
      }

      // Set realtime if provided
      if (baasBackend.realtime) {
        const realtimeExists = backendRealtime.some(
          (rt) => rt.id === baasBackend.realtime
        );

        if (realtimeExists) {
          setValue("backend_realtime", baasBackend.realtime, {
            shouldDirty: true,
          });
          console.log(
            "Setting initial realtime support:",
            baasBackend.realtime
          );
        }
      }
    } else if (backend.type === "serverless") {
      const serverlessBackend = backend as ServerlessBackend;

      // Check if service exists in options
      const serviceExists = backendServerless.some(
        (service) => service.id === serverlessBackend.service
      );

      if (serviceExists) {
        setValue("backend_service", serverlessBackend.service, {
          shouldDirty: true,
        });
        console.log(
          "Setting initial serverless service:",
          serverlessBackend.service
        );
      } else {
        console.log(
          "Initial serverless service not available in options:",
          serverlessBackend.service
        );
      }
    }

    // Mark as applied
    if (valuesWereSet) {
      initialDataAppliedRef.current = true;
    }
  }, [
    initialData,
    backendFrameworks,
    backendBaaS,
    backendRealtime,
    backendServerless,
    setValue,
  ]);

  return (
    <div>
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">
        Backend
      </h3>

      {/* Backend Type Selection */}
      <div className="mb-4">
        <Label htmlFor="backend_type">Backend Type</Label>
        <Select
          id="backend_type"
          {...register("backend_type")}
          error={errors.backend_type?.message?.toString()}
        >
          <option value="">Select Backend Type</option>
          <option value="framework">Framework</option>
          <option value="baas">Backend as a Service (BaaS)</option>
          <option value="serverless">Serverless</option>
        </Select>
      </div>

      {/* Dynamic Fields Based on Backend Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fields for Framework Backend */}
        {backendType === "framework" && (
          <>
            <div>
              <Label htmlFor="backend_framework">Framework</Label>
              <Select id="backend_framework" {...register("backend_framework")}>
                <option value="">Select Framework</option>
                {filteredFrameworks.map((framework) => (
                  <option key={framework.id} value={framework.id}>
                    {framework.id}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="backend_realtime">
                Realtime Support (Optional)
              </Label>
              <Select id="backend_realtime" {...register("backend_realtime")}>
                <option value="">None</option>
                {filteredRealtime.map((realtime) => (
                  <option key={realtime.id} value={realtime.id}>
                    {realtime.id}
                  </option>
                ))}
              </Select>
            </div>
          </>
        )}

        {/* Fields for BaaS Backend */}
        {backendType === "baas" && (
          <>
            <div>
              <Label htmlFor="backend_service">BaaS Service</Label>
              <Select id="backend_service" {...register("backend_service")}>
                <option value="">Select BaaS Service</option>
                {serviceOptions.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.id}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="backend_functions">
                Serverless Functions (Optional)
              </Label>
              <Select id="backend_functions" {...register("backend_functions")}>
                <option value="">None</option>
                {serviceOptions.map((functions) => (
                  <option key={functions.id} value={functions.id}>
                    {functions.id}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="backend_realtime">
                Realtime Support (Optional)
              </Label>
              <Select id="backend_realtime" {...register("backend_realtime")}>
                <option value="">None</option>
                {filteredRealtime.map((realtime) => (
                  <option key={realtime.id} value={realtime.id}>
                    {realtime.id}
                  </option>
                ))}
              </Select>
            </div>
          </>
        )}

        {/* Fields for Serverless Backend */}
        {backendType === "serverless" && (
          <>
            <div>
              <Label htmlFor="backend_service">Serverless Service</Label>
              <Select id="backend_service" {...register("backend_service")}>
                <option value="">Select Serverless Service</option>
                {serviceOptions.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.id}
                  </option>
                ))}
              </Select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BackendSection;
