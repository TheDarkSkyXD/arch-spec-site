import { useEffect, useState } from 'react';
import { useToast } from '../../../../contexts/ToastContext';
import { apiEndpointsService } from '../../../../services/apiEndpointsService';
import { ApiEndpoint, ApiEndpointErrors, ApiEndpointFormData } from '../types';

export const useApiEndpoints = (projectId?: string, initialData?: { endpoints: ApiEndpoint[] }) => {
  const { showToast } = useToast();
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(initialData?.endpoints || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch endpoints if projectId is provided but no initialData
  useEffect(() => {
    const fetchApiEndpoints = async () => {
      if (projectId && !initialData) {
        setIsLoading(true);
        try {
          const apiEndpointsData = await apiEndpointsService.getApiEndpoints(projectId);
          if (apiEndpointsData) {
            setEndpoints(apiEndpointsData.endpoints || []);
          }
        } catch (error) {
          console.error('Error fetching API endpoints:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchApiEndpoints();
  }, [projectId, initialData]);

  const validateEndpoint = (endpoint: ApiEndpointFormData): ApiEndpointErrors => {
    const errors: ApiEndpointErrors = {};

    if (!endpoint.path.trim()) {
      errors.path = 'Endpoint path is required';
    }

    if (!endpoint.description.trim()) {
      errors.description = 'Endpoint description is required';
    }

    if (endpoint.methods.length === 0) {
      errors.methods = 'At least one HTTP method must be selected';
    }

    return errors;
  };

  const addEndpoint = (newEndpoint: ApiEndpointFormData) => {
    setEndpoints([...endpoints, { ...newEndpoint }]);
    showToast({
      title: 'Endpoint Added',
      description: 'New API endpoint added. Remember to click "Save API Endpoints" to persist your changes.',
      type: 'success',
    });
  };

  const updateEndpoint = (index: number, updatedEndpoint: ApiEndpointFormData) => {
    const updatedEndpoints = [...endpoints];
    updatedEndpoints[index] = { ...updatedEndpoint };
    setEndpoints(updatedEndpoints);
    showToast({
      title: 'Endpoint Updated',
      description: 'API endpoint updated. Remember to click "Save API Endpoints" to persist your changes.',
      type: 'success',
    });
  };

  const removeEndpoint = (index: number) => {
    setEndpoints(endpoints.filter((_, i) => i !== index));
    showToast({
      title: 'Endpoint Removed',
      description: 'API endpoint removed. Remember to click "Save API Endpoints" to persist your changes.',
      type: 'success',
    });
  };

  const saveEndpoints = async () => {
    if (!projectId) {
      const errorMessage = 'Project must be saved before API endpoints can be saved';
      showToast({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      });
      setError(errorMessage);
      return false;
    }

    setIsSubmitting(true);
    try {
      const data = { endpoints };
      const result = await apiEndpointsService.saveApiEndpoints(projectId, data);

      if (result) {
        showToast({
          title: 'Success',
          description: 'API endpoints saved successfully',
          type: 'success',
        });
        return result;
      } else {
        throw new Error('Failed to save API endpoints');
      }
    } catch (error) {
      console.error('Error saving API endpoints:', error);
      const errorMessage = 'An unexpected error occurred';
      showToast({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      });
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    endpoints,
    setEndpoints,
    isLoading,
    error,
    isSubmitting,
    validateEndpoint,
    addEndpoint,
    updateEndpoint,
    removeEndpoint,
    saveEndpoints,
  };
}; 