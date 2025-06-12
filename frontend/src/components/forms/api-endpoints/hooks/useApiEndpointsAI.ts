import { useEffect, useState } from 'react';
import { useToast } from '../../../../contexts/ToastContext';
import { aiService } from '../../../../services/aiService';
import { dataModelService } from '../../../../services/dataModelService';
import { featuresService } from '../../../../services/featuresService';
import { projectsService } from '../../../../services/projectsService';
import { requirementsService } from '../../../../services/requirementsService';
import { ApiEndpoint } from '../types';

export const useApiEndpointsAI = (projectId?: string) => {
  const { showToast } = useToast();
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isAddingEndpoints, setIsAddingEndpoints] = useState<boolean>(false);
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [features, setFeatures] = useState<any[]>([]);
  const [dataModels, setDataModels] = useState<any>({});
  const [requirements, setRequirements] = useState<string[]>([]);

  // Fetch project info for AI enhancement
  useEffect(() => {
    const fetchProjectInfo = async () => {
      if (!projectId) return;

      try {
        // Fetch project details including description
        const projectDetails = await projectsService.getProjectById(projectId);

        if (projectDetails) {
          setProjectDescription(projectDetails.description || '');

          // Fetch features
          const featuresData = await featuresService.getFeatures(projectId);
          if (featuresData?.coreModules) {
            setFeatures(featuresData.coreModules);
          }

          // Fetch data models
          const dataModelData = await dataModelService.getDataModel(projectId);
          if (dataModelData) {
            setDataModels(dataModelData);
          }

          // Fetch requirements
          const requirementsData = await requirementsService.getRequirements(projectId);
          if (requirementsData) {
            // Combine functional and non-functional requirements
            const allRequirements = [
              ...(requirementsData.functional || []),
              ...(requirementsData.non_functional || []),
            ];
            setRequirements(allRequirements);
          }
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectInfo();
  }, [projectId]);

  const enhanceEndpoints = async (
    currentEndpoints: ApiEndpoint[],
    additionalInstructions?: string
  ) => {
    setIsEnhancing(true);
    try {
      const enhancedEndpoints = await aiService.enhanceApiEndpoints(
        projectDescription,
        features,
        dataModels,
        requirements,
        currentEndpoints.length > 0 ? { endpoints: currentEndpoints } : undefined,
        additionalInstructions
      );

      if (enhancedEndpoints) {
        showToast({
          title: 'Success',
          description: 'API endpoints enhanced successfully',
          type: 'success',
        });
        return enhancedEndpoints.endpoints;
      } else {
        showToast({
          title: 'Warning',
          description: 'No enhanced endpoints returned',
          type: 'warning',
        });
        return null;
      }
    } catch (error) {
      console.error('Error enhancing endpoints:', error);
      showToast({
        title: 'Error',
        description: 'Failed to enhance endpoints',
        type: 'error',
      });
      return null;
    } finally {
      setIsEnhancing(false);
    }
  };

  const addAIEndpoints = async (additionalInstructions?: string) => {
    setIsAddingEndpoints(true);
    try {
      const enhancedEndpoints = await aiService.enhanceApiEndpoints(
        projectDescription,
        features,
        dataModels,
        requirements,
        undefined,
        additionalInstructions
      );

      if (enhancedEndpoints && enhancedEndpoints.endpoints.length > 0) {
        showToast({
          title: 'Success',
          description: `Generated ${enhancedEndpoints.endpoints.length} new endpoints`,
          type: 'success',
        });
        return enhancedEndpoints.endpoints;
      } else {
        showToast({
          title: 'Warning',
          description: 'No new endpoints generated',
          type: 'warning',
        });
        return null;
      }
    } catch (error) {
      console.error('Error adding AI endpoints:', error);
      showToast({
        title: 'Error',
        description: 'Failed to generate new endpoints',
        type: 'error',
      });
      return null;
    } finally {
      setIsAddingEndpoints(false);
    }
  };

  return {
    isEnhancing,
    isAddingEndpoints,
    projectDescription,
    enhanceEndpoints,
    addAIEndpoints,
  };
}; 