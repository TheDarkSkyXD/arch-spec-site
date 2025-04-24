import React, { useCallback, useEffect, useState } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useToast } from '../../contexts/ToastContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { aiService } from '../../services/aiService';
import { dataModelService } from '../../services/dataModelService';
import { FeatureModule, featuresService } from '../../services/featuresService';
import { projectsService } from '../../services/projectsService';
import { requirementsService } from '../../services/requirementsService';
import { DataModel, Entity, EntityField, Relationship } from '../../types/templates';
import AIInstructionsModal from '../ui/AIInstructionsModal';
import Button from '../ui/Button';
import { ProcessingOverlay } from '../ui/index';

// Import the separated components
import AIEnhancementButtons from './data-model/AIEnhancementButtons';
import EntityForm from './data-model/EntityForm';
import EntityList from './data-model/EntityList';
import RelationshipForm from './data-model/RelationshipForm';
import RelationshipList from './data-model/RelationshipList';

interface DataModelFormProps {
  initialData?: Partial<DataModel>;
  projectId?: string;
  onSuccess?: (dataModel: Partial<DataModel>) => void;
}

export default function DataModelForm({ initialData, projectId, onSuccess }: DataModelFormProps) {
  const { hasAIFeatures } = useSubscription();
  const { aiCreditsRemaining } = useUserProfile();
  const { showToast } = useToast();
  const [dataModel, setDataModel] = useState<DataModel>({
    entities: [],
    relationships: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Add a flag to track initialization
  const [isInitializing, setIsInitializing] = useState(true);

  // State for entity form
  const [entityForm, setEntityForm] = useState<Entity>({
    name: '',
    description: '',
    fields: [],
  });

  // State for tracking unsaved changes
  const [initialDataModel, setInitialDataModel] = useState<DataModel | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  
  // State for entity editing
  const [isEditingEntity, setIsEditingEntity] = useState(false);
  const [editingEntityIndex, setEditingEntityIndex] = useState<number | null>(null);

  // State for the field form
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);
  const [fieldForm, setFieldForm] = useState<EntityField>({
    name: '',
    type: 'string',
  });

  // State for the relationship form
  const [isEditingRelationship, setIsEditingRelationship] = useState(false);
  const [editingRelationshipIndex, setEditingRelationshipIndex] = useState<number | null>(null);
  const [relationshipForm, setRelationshipForm] = useState<Relationship>({
    type: 'oneToOne',
    from_entity: '',
    to_entity: '',
    field: '',
  });

  // State for the delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<number | null>(null);

  // Field types for dropdown selection
  const fieldTypes = [
    'string',
    'text',
    'integer',
    'float',
    'decimal',
    'boolean',
    'date',
    'timestamp',
    'uuid',
    'jsonb',
    'enum',
  ];

  // Relationship types for dropdown selection
  const relationshipTypes = ['oneToOne', 'oneToMany', 'manyToOne', 'manyToMany'];

  // Add state for AI enhancement
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isAddingEntities, setIsAddingEntities] = useState<boolean>(false);
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [businessGoals, setBusinessGoals] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [projectFeatures, setProjectFeatures] = useState<FeatureModule[]>([]);

  // Add state for AI instructions modals
  const [isEnhanceModalOpen, setIsEnhanceModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const fetchDataModel = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const dataModelData = await dataModelService.getDataModel(projectId);
      if (dataModelData) {
        setDataModel(dataModelData);
        // Save initial data for tracking changes
        setInitialDataModel(JSON.parse(JSON.stringify(dataModelData)));
        setHasBeenSaved(true);
      } else {
        setDataModel({
          entities: [],
          relationships: [],
        });
        // Initialize empty initial data
        setInitialDataModel({
          entities: [],
          relationships: [],
        });
      }
    } catch (err) {
      console.error('Error loading data model:', err);
      setError('Failed to load data model. Please try again.');
    } finally {
      setLoading(false);
      setIsInitializing(false); // Mark initialization as complete after fetch
    }
  }, [projectId]);

  useEffect(() => {
    if (initialData) {
      const dataModel = {
        entities: initialData.entities || [],
        relationships: initialData.relationships || [],
      };
      setDataModel(dataModel);
      // Save initial data for tracking changes
      setInitialDataModel(JSON.parse(JSON.stringify(dataModel)));
      setHasBeenSaved(true);
      setIsInitializing(false); // Mark initialization as complete
    } else if (projectId) {
      fetchDataModel();
    } else {
      setIsInitializing(false); // Mark initialization as complete even if no data to fetch
    }
  }, [initialData, projectId, fetchDataModel]);

  // Check for unsaved changes by comparing current state with initial state
  useEffect(() => {
    // Only check for changes after initialization is complete
    if (!isInitializing && initialDataModel && dataModel) {
      const currentJson = JSON.stringify(dataModel);
      const initialJson = JSON.stringify(initialDataModel);
      setHasUnsavedChanges(currentJson !== initialJson);
    }
  }, [dataModel, initialDataModel, isInitializing]);

  // Discard changes by resetting to initial state
  const discardChanges = () => {
    if (initialDataModel) {
      setDataModel(JSON.parse(JSON.stringify(initialDataModel)));
      setHasUnsavedChanges(false);
      showToast({
        title: 'Changes Discarded',
        description: 'Your changes have been discarded',
        type: 'info',
      });
    }
  };

  // New function to fetch project info for AI enhancement
  const fetchProjectInfo = async () => {
    if (!projectId) return;

    try {
      // Fetch project details including description and business goals
      const projectDetails = await projectsService.getProjectById(projectId);

      if (projectDetails) {
        setProjectDescription(projectDetails.description || '');
        setBusinessGoals(projectDetails.business_goals || []);

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

        // Fetch features
        const featuresData = await featuresService.getFeatures(projectId);
        if (featuresData) {
          setProjectFeatures(featuresData.coreModules || []);
        }
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  // Add effect to fetch project info
  useEffect(() => {
    if (projectId) {
      fetchProjectInfo();
    }
  }, [projectId]);

  // Entity form handlers
  const handleEntityFormChange = (field: string, value: string) => {
    setEntityForm({
      ...entityForm,
      [field]: value,
    });
  };

  const validateEntityForm = () => {
    if (!entityForm.name.trim()) {
      setError('Entity name is required');
      return false;
    }
    if (!entityForm.description.trim()) {
      setError('Entity description is required');
      return false;
    }
    return true;
  };

  const handleAddEntity = () => {
    if (!validateEntityForm()) return;

    setDataModel({
      ...dataModel,
      entities: [
        ...dataModel.entities,
        {
          ...entityForm,
          fields: entityForm.fields || [],
        },
      ],
    });

    resetEntityForm();
    // Change toast message to indicate unsaved state
    showToast({
      title: 'Entity Added',
      description: 'Entity added. Remember to save your changes.',
      type: 'success',
    });
    
    // Mark changes as unsaved
    setHasUnsavedChanges(true);
  };

  const handleEditEntity = () => {
    if (!validateEntityForm() || editingEntityIndex === null) return;

    const updatedEntities = [...dataModel.entities];
    updatedEntities[editingEntityIndex] = {
      ...entityForm,
    };

    setDataModel({
      ...dataModel,
      entities: updatedEntities,
    });

    resetEntityForm();
    setEditingEntityIndex(null);
    setIsEditingEntity(false);
    // Update toast message
    showToast({
      title: 'Entity Updated',
      description: 'Entity updated. Remember to save your changes.',
      type: 'success',
    });
    
    // Mark changes as unsaved
    setHasUnsavedChanges(true);
  };

  const handleStartEditEntity = (index: number) => {
    setEntityForm(dataModel.entities[index]);
    setEditingEntityIndex(index);
    setIsEditingEntity(true);
  };

  const handleDeleteEntity = (index: number) => {
    const updatedEntities = [...dataModel.entities];
    const deletedEntityName = updatedEntities[index].name;

    // Remove the entity
    updatedEntities.splice(index, 1);

    // Also remove any relationships that involve this entity
    const updatedRelationships = dataModel.relationships.filter(
      (rel) => rel.from_entity !== deletedEntityName && rel.to_entity !== deletedEntityName
    );

    setDataModel({
      ...dataModel,
      entities: updatedEntities,
      relationships: updatedRelationships,
    });

    showToast({
      title: 'Entity Deleted',
      description: 'Entity and related relationships deleted. Remember to save your changes.',
      type: 'success',
    });
    
    // Mark changes as unsaved
    setHasUnsavedChanges(true);
  };

  const resetEntityForm = () => {
    setEntityForm({
      name: '',
      description: '',
      fields: [],
    });
    setIsEditingEntity(false);
    setEditingEntityIndex(null);
    setError(null);
  };

  // Field form handlers
  const handleFieldFormChange = (field: string, value: unknown) => {
    // Convert numeric default value to string if needed
    if (field === 'default' && typeof value === 'number') {
      value = value.toString();
    }

    // Ensure all non-string default values are converted to strings
    if (field === 'default' && value !== null && value !== undefined && typeof value !== 'string') {
      value = String(value);
    }

    setFieldForm({
      ...fieldForm,
      [field]: value,
    });
  };

  const validateFieldForm = () => {
    if (!fieldForm.name.trim()) {
      setError('Field name is required');
      return false;
    }
    if (!fieldForm.type) {
      setError('Field type is required');
      return false;
    }
    return true;
  };

  const handleAddField = () => {
    if (!validateFieldForm()) return;

    const updatedEntityForm = {
      ...entityForm,
      fields: [...(entityForm.fields || []), { ...fieldForm }],
    };

    setEntityForm(updatedEntityForm);
    resetFieldForm();
  };

  const handleEditField = () => {
    if (!validateFieldForm() || editingFieldIndex === null) return;

    const updatedFields = [...entityForm.fields];
    updatedFields[editingFieldIndex] = { ...fieldForm };

    setEntityForm({
      ...entityForm,
      fields: updatedFields,
    });

    resetFieldForm();
  };

  const handleStartEditField = (index: number) => {
    setFieldForm(entityForm.fields[index]);
    setEditingFieldIndex(index);
    setIsAddingField(true);
  };

  const handleDeleteField = (index: number) => {
    const updatedFields = [...entityForm.fields];
    updatedFields.splice(index, 1);

    setEntityForm({
      ...entityForm,
      fields: updatedFields,
    });
  };

  const resetFieldForm = () => {
    setFieldForm({
      name: '',
      type: 'string',
    });
    setIsAddingField(false);
    setEditingFieldIndex(null);
  };

  // Relationship form handlers
  const handleRelationshipFormChange = (field: string, value: string) => {
    setRelationshipForm({
      ...relationshipForm,
      [field]: value,
    });
  };

  const validateRelationshipForm = () => {
    if (!relationshipForm.type) {
      setError('Relationship type is required');
      return false;
    }
    if (!relationshipForm.from_entity) {
      setError('Source entity is required');
      return false;
    }
    if (!relationshipForm.to_entity) {
      setError('Target entity is required');
      return false;
    }
    if (!relationshipForm.field) {
      setError('Relationship field is required');
      return false;
    }
    return true;
  };

  const handleAddRelationship = () => {
    if (!validateRelationshipForm()) return;

    setDataModel({
      ...dataModel,
      relationships: [
        ...dataModel.relationships,
        relationshipForm,
      ],
    });

    resetRelationshipForm();
    showToast({
      title: 'Relationship Added',
      description: 'Relationship added. Remember to save your changes.',
      type: 'success',
    });
    
    // Mark changes as unsaved
    setHasUnsavedChanges(true);
  };

  const handleEditRelationship = () => {
    if (!validateRelationshipForm() || editingRelationshipIndex === null) return;

    const updatedRelationships = [...dataModel.relationships];
    updatedRelationships[editingRelationshipIndex] = {
      ...relationshipForm,
    };

    setDataModel({
      ...dataModel,
      relationships: updatedRelationships,
    });

    resetRelationshipForm();
    showToast({
      title: 'Success',
      description: 'Relationship updated successfully',
      type: 'success',
    });
  };

  const handleStartEditRelationship = (index: number) => {
    setRelationshipForm(dataModel.relationships[index]);
    setEditingRelationshipIndex(index);
    setIsEditingRelationship(true);
  };

  const handleDeleteRelationship = (index: number) => {
    const updatedRelationships = [...dataModel.relationships];
    updatedRelationships.splice(index, 1);

    setDataModel({
      ...dataModel,
      relationships: updatedRelationships,
    });

    showToast({
      title: 'Success',
      description: 'Relationship deleted successfully',
      type: 'success',
    });
  };

  const resetRelationshipForm = () => {
    setRelationshipForm({
      type: 'oneToOne',
      from_entity: '',
      to_entity: '',
      field: '',
    });
    setIsEditingRelationship(false);
    setEditingRelationshipIndex(null);
    setError(null);
  };

  // Function to open the enhance data model modal
  const openEnhanceModal = () => {
    // Check if user has remaining AI credits
    if (aiCreditsRemaining <= 0) {
      showToast({
        title: 'Insufficient AI Credits',
        description: "You've used all your AI credits for this billing period",
        type: 'warning',
      });
      return;
    }

    // Check if user has access to AI features
    if (!hasAIFeatures) {
      showToast({
        title: 'Premium Feature',
        description: 'Upgrade to Premium to use AI-powered features',
        type: 'info',
      });
      return;
    }

    if (!projectId) {
      setError('Project must be saved before data model can be enhanced');
      return;
    }

    if (!projectDescription) {
      setError('Project description is missing. Data model may not be properly enhanced.');
      return;
    }

    if (projectFeatures.length === 0) {
      setError('No features found. Data model will be based only on requirements and description.');
      return;
    }

    setIsEnhanceModalOpen(true);
  };

  // Function to open the add entities modal
  const openAddModal = () => {
    // Check if user has remaining AI credits
    if (aiCreditsRemaining <= 0) {
      showToast({
        title: 'Insufficient AI Credits',
        description: "You've used all your AI credits for this billing period",
        type: 'warning',
      });
      return;
    }

    // Check if user has access to AI features
    if (!hasAIFeatures) {
      showToast({
        title: 'Premium Feature',
        description: 'Upgrade to Premium to use AI-powered features',
        type: 'info',
      });
      return;
    }

    if (!projectId) {
      setError('Project must be saved before data model can be enhanced');
      return;
    }

    if (!projectDescription) {
      setError('Project description is missing. Entities may not be properly generated.');
      return;
    }

    setIsAddModalOpen(true);
  };

  // Modified function to enhance the data model using AI (replace existing model)
  const enhanceDataModel = async (additionalInstructions?: string) => {
    setIsEnhancing(true);
    setError(null);

    try {
      console.log('Enhancing data model with AI...');
      const enhancedDataModel = await aiService.enhanceDataModel(
        projectDescription,
        businessGoals,
        projectFeatures,
        requirements,
        dataModel.entities.length > 0 ? dataModel : undefined,
        additionalInstructions
      );

      if (enhancedDataModel) {
        // Replace existing data model with enhanced one
        setDataModel(enhancedDataModel);
        showToast({
          title: 'Success',
          description: 'Data model enhanced successfully!',
          type: 'success',
        });
      } else {
        setError('No enhanced data model returned');
      }
    } catch (error) {
      console.error('Error enhancing data model:', error);
      setError('Failed to enhance data model');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Modified function to add AI-generated entities without replacing existing ones
  const addAIEntities = async (additionalInstructions?: string) => {
    setIsAddingEntities(true);
    setError(null);

    try {
      console.log('Adding AI entities...');

      // When adding new entities, we pass the existing data model to avoid duplication
      const enhancedDataModel = await aiService.enhanceDataModel(
        projectDescription,
        businessGoals,
        projectFeatures,
        requirements,
        dataModel,
        additionalInstructions
      );

      if (enhancedDataModel && enhancedDataModel.entities.length > 0) {
        // Get entity names we already have
        const existingEntityNames = dataModel.entities.map((e) => e.name);

        // Filter out any duplicates from the enhanced model
        const newEntities = enhancedDataModel.entities.filter(
          (entity) => !existingEntityNames.includes(entity.name)
        );

        // Add new entities to existing ones
        setDataModel({
          ...dataModel,
          entities: [...dataModel.entities, ...newEntities],
          // Merge relationships, filtering out any duplicates
          relationships: [
            ...dataModel.relationships,
            ...enhancedDataModel.relationships.filter(
              (newRel) =>
                !dataModel.relationships.some(
                  (existingRel) =>
                    existingRel.from_entity === newRel.from_entity &&
                    existingRel.to_entity === newRel.to_entity &&
                    existingRel.field === newRel.field
                )
            ),
          ],
        });

        showToast({
          title: 'Success',
          description: `Added ${newEntities.length} new entities`,
          type: 'success',
        });
      } else {
        setError('No new entities generated');
      }
    } catch (error) {
      console.error('Error adding AI entities:', error);
      setError('Failed to add AI entities. Please try again.');
    } finally {
      setIsAddingEntities(false);
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      setError('Project ID is required to save the data model');
      return;
    }

    // Skip saving if no changes were made
    if (!hasUnsavedChanges) {
      console.log('No changes to save, skipping submission');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updatedDataModel = await dataModelService.saveDataModel(projectId, dataModel);

      if (updatedDataModel) {
        showToast({
          title: 'Success',
          description: hasBeenSaved ? 'Data model updated successfully' : 'Data model saved successfully',
          type: 'success',
        });

        // Update the initial data model to match the current state
        setInitialDataModel(JSON.parse(JSON.stringify(dataModel)));
        setHasUnsavedChanges(false);
        setHasBeenSaved(true);

        if (onSuccess) {
          onSuccess(updatedDataModel);
        }
      } else {
        setError('Failed to save data model. Please try again.');
      }
    } catch (err) {
      console.error('Error saving data model:', err);
      setError('Failed to save data model. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Helper function to check if any AI operation is in progress
  const isAnyEnhancementInProgress = () => {
    return isEnhancing || isAddingEntities;
  };

  // Helper to get the appropriate message for the overlay
  const getEnhancementMessage = () => {
    if (isEnhancing) {
      return 'AI is analyzing your project to create an optimal data model. Please wait...';
    }
    if (isAddingEntities) {
      return 'AI is generating additional entities based on your project requirements. Please wait...';
    }
    return 'AI enhancement in progress...';
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <div className="mb-4 flex items-center justify-between rounded-md bg-amber-50 p-3 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
              <span>You have unsaved changes. Don't forget to save your data model.</span>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={discardChanges}
                >
                  Discard
                </Button>
                <Button 
                  type="button" 
                  variant="default" 
                  size="sm"
                  onClick={handleSubmit}
                  disabled={saving || !projectId}
                >
                  {saving ? 'Saving...' : 'Save Now'}
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            {/* Processing Overlay */}
            <ProcessingOverlay
              isVisible={isAnyEnhancementInProgress()}
              message={getEnhancementMessage()}
              opacity={0.6}
            />

            {/* AI Instructions Modals */}
            <AIInstructionsModal
              isOpen={isEnhanceModalOpen}
              onClose={() => setIsEnhanceModalOpen(false)}
              onConfirm={(instructions) => enhanceDataModel(instructions)}
              title="Enhance Data Model"
              description="The AI will replace your current data model with an optimized structure based on your project requirements and features."
              confirmText="Replace Data Model"
            />

            <AIInstructionsModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onConfirm={(instructions) => addAIEntities(instructions)}
              title="Generate Additional Entities"
              description="The AI will generate new entities to complement your existing ones based on your project requirements and features."
              confirmText="Add Entities"
            />

            <div className="grid grid-cols-1 gap-6">
              {/* AI Enhancement Buttons */}
              <AIEnhancementButtons
                openAddModal={openAddModal}
                openEnhanceModal={openEnhanceModal}
                isAddingEntities={isAddingEntities}
                isEnhancing={isEnhancing}
                projectId={projectId}
                hasAIFeatures={hasAIFeatures}
                entitiesExist={dataModel.entities.length > 0}
              />

              {/* Entities Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Entities</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingEntity(!isEditingEntity)}
                  >
                    {isEditingEntity ? 'Cancel' : 'Add Entity'}
                  </Button>
                </div>

                {/* Entity Form */}
                <EntityForm
                  entityForm={entityForm}
                  handleEntityFormChange={handleEntityFormChange}
                  isEditingEntity={isEditingEntity}
                  handleAddEntity={handleAddEntity}
                  handleEditEntity={handleEditEntity}
                  resetEntityForm={resetEntityForm}
                  editingEntityIndex={editingEntityIndex}
                  error={error}
                  isAddingField={isAddingField}
                  setIsAddingField={setIsAddingField}
                  fieldForm={fieldForm}
                  handleFieldFormChange={handleFieldFormChange}
                  handleAddField={handleAddField}
                  handleEditField={handleEditField}
                  resetFieldForm={resetFieldForm}
                  handleStartEditField={handleStartEditField}
                  handleDeleteField={handleDeleteField}
                  editingFieldIndex={editingFieldIndex}
                  fieldTypes={fieldTypes}
                />

                {/* List of Entities */}
                <EntityList
                  entities={dataModel.entities}
                  handleStartEditEntity={handleStartEditEntity}
                  handleDeleteEntity={handleDeleteEntity}
                  isDeleteDialogOpen={isDeleteDialogOpen}
                  setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                  entityToDelete={entityToDelete}
                  setEntityToDelete={setEntityToDelete}
                />
              </div>

              {/* Relationships Section */}
              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Relationships</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingRelationship(!isEditingRelationship)}
                    disabled={dataModel.entities.length < 2}
                  >
                    {isEditingRelationship ? 'Cancel' : 'Add Relationship'}
                  </Button>
                </div>

                {dataModel.entities.length < 2 && (
                  <div className="text-sm text-amber-600 dark:text-amber-400">
                    You need at least two entities to create relationships.
                  </div>
                )}

                {/* Relationship Form */}
                <RelationshipForm
                  relationshipForm={relationshipForm}
                  handleRelationshipFormChange={handleRelationshipFormChange}
                  isEditingRelationship={isEditingRelationship}
                  handleAddRelationship={handleAddRelationship}
                  handleEditRelationship={handleEditRelationship}
                  resetRelationshipForm={resetRelationshipForm}
                  editingRelationshipIndex={editingRelationshipIndex}
                  entities={dataModel.entities}
                  relationshipTypes={relationshipTypes}
                  error={error}
                />

                {/* List of Relationships */}
                <RelationshipList
                  relationships={dataModel.relationships}
                  handleStartEditRelationship={handleStartEditRelationship}
                  handleDeleteRelationship={handleDeleteRelationship}
                />
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
