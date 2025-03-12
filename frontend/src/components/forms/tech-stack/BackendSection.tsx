import {
  UseFormRegister,
  FormState,
  FieldError,
  Control,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { Technology } from "../../../types/techStack";
import { TechStackFormData } from "../tech-stack/techStackSchema";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import {
  ProjectTechStack,
  FrameworkBackend,
  BaaSBackend,
  ServerlessBackend,
} from "../../../types/templates";
import {
  filterBackendFrameworkOptions,
  filterBackendRealtimeOptions,
  filterBackendFunctionsOptions,
  filterBackendBaaSOptions,
  getBackendServiceOptions,
} from "../../../utils/backendTechStackFilterUtils";

interface BackendSectionProps {
  register: UseFormRegister<TechStackFormData>;
  errors: FormState<TechStackFormData>["errors"];
  backendFrameworks: Technology[];
  backendBaaS: Technology[];
  backendRealtime: Technology[];
  backendFunctions: Technology[];
  backendServerless: Technology[];
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
  backendFunctions,
  backendServerless,
  control,
  setValue,
  initialData,
}: BackendSectionProps) => {
  // Create a ref to track whether we've applied initial data
  const initialDataAppliedRef = useRef<boolean>(false);

  // Helper function to safely get error message
  const getErrorMessage = (error: FieldError | undefined): ReactNode => {
    return error?.message as ReactNode;
  };

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

  // console.log("Selected Backend values:", {
  //   type: backendType,
  //   framework: backendFramework,
  //   language: backendLanguage,
  //   service: backendService,
  //   realtime: backendRealtimeValue,
  //   functions: backendFunctionsValue,
  // });

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

  const filteredFunctions = useMemo(
    () => filterBackendFunctionsOptions(backendService, backendFunctions),
    [backendService, backendFunctions]
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

  // Debug log for filtered options
  // useEffect(() => {
  //   console.log("Filtered backend options:", {
  //     frameworks: filteredFrameworks.map((f) => f.id),
  //     selectedFramework: backendFramework,
  //     realtime: filteredRealtime.map((r) => r.id),
  //     functions: filteredFunctions.map((f) => f.id),
  //     baas: filteredBaaS.map((b) => b.id),
  //     services: serviceOptions.map((s) => s.id),
  //   });
  // }, [
  //   filteredFrameworks,
  //   backendFramework,
  //   filteredRealtime,
  //   filteredFunctions,
  //   filteredBaaS,
  //   serviceOptions,
  //   backendFrameworks,
  // ]);

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
        const functionsExists = backendFunctions.some(
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
    backendFunctions,
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
        <label
          htmlFor="backend_type"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Backend Type
        </label>
        <select
          id="backend_type"
          {...register("backend_type")}
          className={`mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
            errors.backend_type ? "border-red-500 focus:ring-red-500" : ""
          }`}
        >
          <option value="">Select Backend Type</option>
          <option value="framework">Framework</option>
          <option value="baas">Backend as a Service (BaaS)</option>
          <option value="serverless">Serverless</option>
        </select>
        {errors.backend_type && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {getErrorMessage(errors.backend_type)}
          </p>
        )}
      </div>

      {/* Dynamic Fields Based on Backend Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fields for Framework Backend */}
        {backendType === "framework" && (
          <>
            <div>
              <label
                htmlFor="backend_framework"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Framework
              </label>
              <select
                id="backend_framework"
                {...register("backend_framework")}
                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="">Select Framework</option>
                {filteredFrameworks.map((framework) => (
                  <option key={framework.id} value={framework.id}>
                    {framework.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="backend_realtime"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Realtime Support (Optional)
              </label>
              <select
                id="backend_realtime"
                {...register("backend_realtime")}
                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="">None</option>
                {filteredRealtime.map((realtime) => (
                  <option key={realtime.id} value={realtime.id}>
                    {realtime.id}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Fields for BaaS Backend */}
        {backendType === "baas" && (
          <>
            <div>
              <label
                htmlFor="backend_service"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                BaaS Service
              </label>
              <select
                id="backend_service"
                {...register("backend_service")}
                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="">Select BaaS Service</option>
                {serviceOptions.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="backend_functions"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Serverless Functions (Optional)
              </label>
              <select
                id="backend_functions"
                {...register("backend_functions")}
                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="">None</option>
                {filteredFunctions.map((functions) => (
                  <option key={functions.id} value={functions.id}>
                    {functions.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="backend_realtime"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Realtime Support (Optional)
              </label>
              <select
                id="backend_realtime"
                {...register("backend_realtime")}
                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="">None</option>
                {filteredRealtime.map((realtime) => (
                  <option key={realtime.id} value={realtime.id}>
                    {realtime.id}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Fields for Serverless Backend */}
        {backendType === "serverless" && (
          <>
            <div>
              <label
                htmlFor="backend_service"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Serverless Service
              </label>
              <select
                id="backend_service"
                {...register("backend_service")}
                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="">Select Serverless Service</option>
                {serviceOptions.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.id}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BackendSection;
