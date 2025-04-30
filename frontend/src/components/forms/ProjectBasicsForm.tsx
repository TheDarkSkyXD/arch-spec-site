import { zodResolver } from '@hookform/resolvers/zod';
import {
  Edit,
  Loader2,
  Lock,
  PlusCircle,
  Save,
  Sparkles,
  Trash2,
  Users,
  Wand2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useToast } from '../../contexts/ToastContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { aiService } from '../../services/aiService';
import { projectsService } from '../../services/projectsService';

// Import shadcn UI components
import AIInstructionsModal from '../ui/AIInstructionsModal';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import PremiumFeatureBadge from '../ui/PremiumFeatureBadge';
import { ProcessingOverlay } from '../ui/index';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const projectBasicsSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  business_goals: z.array(z.string()).optional(),
  target_users: z.string().optional(),
  domain: z.string().optional(),
});

type ProjectBasicsFormData = z.infer<typeof projectBasicsSchema>;

interface ProjectBasicsFormProps {
  initialData?: Partial<ProjectBasicsFormData> & { id?: string };
  onSuccess?: (projectId: string) => void;
}

// Define the type for active modal
type ActiveModal = 'description' | 'businessGoals' | 'targetUsers' | null;

const ProjectBasicsForm = ({ initialData, onSuccess }: ProjectBasicsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isEnhancingGoals, setIsEnhancingGoals] = useState(false);
  const [isEnhancingTargetUsers, setIsEnhancingTargetUsers] = useState(false);
  const { showToast } = useToast();
  const { aiCreditsRemaining } = useUserProfile();
  const { hasAIFeatures, isLoading: isSubscriptionLoading } = useSubscription();

  // Add local loading state with forced delay
  const [localLoading, setLocalLoading] = useState(true);

  // Track the project ID internally for subsequent updates
  const [projectId, setProjectId] = useState<string | undefined>(initialData?.id);
  // Add state for error and success messages
  const [error, setError] = useState<string>('');
  // State for business goals
  const [businessGoals, setBusinessGoals] = useState<string[]>(initialData?.business_goals || []);
  const [newBusinessGoal, setNewBusinessGoal] = useState<string>('');

  // Add state for tracking unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [initialFormValues, setInitialFormValues] = useState<
    Partial<ProjectBasicsFormData> & { id?: string }
  >(initialData || {});

  // State for AI instructions modal
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Add state for editing business goals
  const [editingGoalIndex, setEditingGoalIndex] = useState<number | null>(null);
  const [editingGoalValue, setEditingGoalValue] = useState<string>('');

  const isEditMode = Boolean(projectId);

  // Force a minimum loading time to prevent flickering
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 1000); // Force a 1-second minimum loading time

    return () => clearTimeout(timer);
  }, []);

  // Reset local loading if subscription loading state changes
  useEffect(() => {
    if (isSubscriptionLoading) {
      setLocalLoading(true);
    }
  }, [isSubscriptionLoading]);

  // Composite loading state - true if either local or subscription is loading
  const isLoading = localLoading || isSubscriptionLoading;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProjectBasicsFormData>({
    resolver: zodResolver(projectBasicsSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      business_goals: initialData?.business_goals || [],
      target_users: initialData?.target_users || '',
      domain: initialData?.domain || '',
    },
  });

  // Get current field values for enhance buttons and change detection
  const currentFormValues = watch();
  const currentDescription = currentFormValues.description;
  const currentTargetUsers = currentFormValues.target_users;

  // Update form values ONLY if initialData changes OR projectId changes
  useEffect(() => {
    // Only proceed if initialData is available
    if (!initialData) return;

    const isFirstLoad = !projectId;
    const projectIdChanged = initialData.id && initialData.id !== projectId;

    // If it's the first load or the project ID changed, reset the form and local state
    if (isFirstLoad || projectIdChanged) {
      reset({
        // Full reset for new/different project
        name: initialData.name || '',
        description: initialData.description || '',
        business_goals: initialData.business_goals || [], // Reset RHF state too
        target_users: initialData.target_users || '',
        domain: initialData.domain || '',
      });
      setBusinessGoals(initialData.business_goals || []); // Reset local state
      // Update baseline only when resetting
      setInitialFormValues({
        name: initialData.name || '',
        description: initialData.description || '',
        business_goals: initialData.business_goals || [],
        target_users: initialData.target_users || '',
        domain: initialData.domain || '',
        id: initialData.id,
      });

      // Only update projectId state if it's actually changing
      if (projectIdChanged || isFirstLoad) {
        setProjectId(initialData.id);
      }
      setHasUnsavedChanges(false); // Reset unsaved changes flag on full reset
    }
  }, [initialData, reset, projectId]); // Add projectId to dependencies

  // This separate effect ensures RHF's state for business_goals tracks the local state
  useEffect(() => {
    // Only update if the value in RHF is different from local state
    // This avoids potentially triggering unnecessary RHF state updates
    const currentRHFGoals = watch('business_goals');
    const goalsAreDifferent = JSON.stringify(currentRHFGoals) !== JSON.stringify(businessGoals);

    if (goalsAreDifferent) {
      // Mark the field as dirty when updating the value programmatically
      setValue('business_goals', businessGoals, { shouldDirty: true, shouldTouch: true });
    }
  }, [businessGoals, setValue, watch]);

  // Track unsaved changes by comparing form values with initial values
  useEffect(() => {
    if (!initialFormValues) return;

    // Check if business goals have changed
    const initialGoals = initialFormValues.business_goals || [];
    const goalsChanged =
      businessGoals.length !== initialGoals.length ||
      businessGoals.some((goal, index) => goal !== initialGoals[index]);

    // Check if form values have changed
    const nameChanged = currentFormValues.name !== initialFormValues.name;
    const descriptionChanged = currentFormValues.description !== initialFormValues.description;
    const targetUsersChanged = currentFormValues.target_users !== initialFormValues.target_users;
    const domainChanged = currentFormValues.domain !== initialFormValues.domain;

    setHasUnsavedChanges(
      nameChanged || descriptionChanged || targetUsersChanged || domainChanged || goalsChanged
    );
  }, [currentFormValues, businessGoals, initialFormValues]);

  const addBusinessGoal = () => {
    if (!newBusinessGoal.trim()) return;

    setBusinessGoals([...businessGoals, newBusinessGoal]);
    setNewBusinessGoal('');
  };

  const removeBusinessGoal = (index: number) => {
    setBusinessGoals(businessGoals.filter((_, i) => i !== index));
  };

  // Function to open AI instructions modal
  const openAIInstructionsModal = (modal: ActiveModal) => {
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

    setActiveModal(modal);
  };

  // Function to close the modal
  const closeAIInstructionsModal = () => {
    setActiveModal(null);
  };

  // Enhanced functions with AI instructions
  const enhanceDescription = async (additionalInstructions?: string) => {
    if (!currentDescription || currentDescription.length < 5) {
      showToast({
        title: 'Description too short',
        description: 'Please provide a longer description to enhance',
        type: 'warning',
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const enhancedDescription = await aiService.enhanceDescription(
        currentDescription,
        additionalInstructions
      );

      if (enhancedDescription) {
        setValue('description', enhancedDescription, { shouldValidate: true });
        showToast({
          title: 'Description Enhanced',
          description: 'The project description has been improved',
          type: 'success',
        });
      } else {
        showToast({
          title: 'Enhancement Failed',
          description: 'Unable to enhance the description. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error enhancing description:', error);
      showToast({
        title: 'Enhancement Failed',
        description: 'An error occurred while enhancing the description',
        type: 'error',
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const enhanceBusinessGoals = async (additionalInstructions?: string) => {
    // Only need a valid description to generate/enhance goals
    if (!currentDescription || currentDescription.length < 5) {
      showToast({
        title: 'Description too short',
        description: 'Please provide a project description first',
        type: 'warning',
      });
      return;
    }

    setIsEnhancingGoals(true);
    try {
      const enhancedGoals = await aiService.enhanceBusinessGoals(
        currentDescription,
        businessGoals,
        additionalInstructions
      );

      if (enhancedGoals && enhancedGoals.length > 0) {
        setBusinessGoals(enhancedGoals);

        // Show different messages based on whether we're enhancing or generating
        const hasExistingGoals = businessGoals.length > 0;
        showToast({
          title: hasExistingGoals ? 'Business Goals Enhanced' : 'Business Goals Generated',
          description: hasExistingGoals
            ? 'Your business goals have been improved'
            : 'New business goals have been generated based on your project description',
          type: 'success',
        });
      } else {
        showToast({
          title: 'Enhancement Failed',
          description: 'Unable to enhance business goals. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error enhancing business goals:', error);
      showToast({
        title: 'Enhancement Failed',
        description: 'An error occurred while enhancing business goals',
        type: 'error',
      });
    } finally {
      setIsEnhancingGoals(false);
    }
  };

  const enhanceTargetUsers = async (additionalInstructions?: string) => {
    // Need a valid description to generate/enhance target users
    if (!currentDescription || currentDescription.length < 5) {
      showToast({
        title: 'Description too short',
        description: 'Please provide a project description first',
        type: 'warning',
      });
      return;
    }

    setIsEnhancingTargetUsers(true);
    try {
      const enhancedTargetUsers = await aiService.enhanceTargetUsers(
        currentDescription,
        currentTargetUsers || '',
        additionalInstructions
      );

      if (enhancedTargetUsers) {
        setValue('target_users', enhancedTargetUsers, { shouldValidate: true });
        // Show different messages based on whether we're enhancing or generating
        const hasExistingTargetUsers = currentTargetUsers && currentTargetUsers.trim().length > 0;
        showToast({
          title: hasExistingTargetUsers ? 'Target Users Enhanced' : 'Target Users Generated',
          description: hasExistingTargetUsers
            ? 'Your target users description has been improved'
            : 'Target users have been generated based on your project description',
          type: 'success',
        });
      } else {
        showToast({
          title: 'Enhancement Failed',
          description: 'Unable to enhance target users. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error enhancing target users:', error);
      showToast({
        title: 'Enhancement Failed',
        description: 'An error occurred while enhancing target users',
        type: 'error',
      });
    } finally {
      setIsEnhancingTargetUsers(false);
    }
  };

  const onSubmit = async (data: ProjectBasicsFormData) => {
    setIsSubmitting(true);
    // Clear previous messages
    setError('');

    // Update business_goals in form data before submission
    data.business_goals = businessGoals;

    try {
      let project;

      if (isEditMode && projectId) {
        // Update existing project
        project = await projectsService.updateProject(projectId, data);
      } else {
        // Create new project
        project = await projectsService.createProject(data);
        // Store the new project ID for future updates
        if (project) {
          setProjectId(project.id);
        }
      }

      if (project) {
        const successMessage = isEditMode
          ? 'Project updated successfully'
          : 'Project created successfully';

        showToast({
          title: 'Success',
          description: successMessage,
          type: 'success',
        });

        // Update initial form values to match current values
        setInitialFormValues({
          ...data,
          id: project.id,
        });

        // Reset unsaved changes flag
        setHasUnsavedChanges(false);

        if (onSuccess) {
          onSuccess(project.id);
        }
      } else {
        const errorMessage = isEditMode ? 'Failed to update project' : 'Failed to create project';

        showToast({
          title: 'Error',
          description: errorMessage,
          type: 'error',
        });

        setError(errorMessage);
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} project:`, error);

      showToast({
        title: 'Error',
        description: 'An unexpected error occurred',
        type: 'error',
      });

      setError('An unexpected error occurred');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to check if any AI enhancement is in progress
  const isAnyEnhancementInProgress = () => {
    return isEnhancing || isEnhancingGoals || isEnhancingTargetUsers;
  };

  // Helper to get the appropriate message based on which enhancement is in progress
  const getEnhancementMessage = () => {
    if (isEnhancing) {
      return 'AI is enhancing your project description. Please wait...';
    }
    if (isEnhancingGoals) {
      return businessGoals.length > 0
        ? 'AI is improving your business goals. Please wait...'
        : 'AI is generating business goals based on your description. Please wait...';
    }
    if (isEnhancingTargetUsers) {
      return currentTargetUsers
        ? 'AI is enhancing your target users description. Please wait...'
        : 'AI is generating target users based on your description. Please wait...';
    }
    return 'AI enhancement in progress...';
  };

  // Add handlers for editing business goals
  const handleStartEditGoal = (index: number, goal: string) => {
    setEditingGoalIndex(index);
    setEditingGoalValue(goal);
  };

  const handleSaveEditGoal = () => {
    if (editingGoalIndex !== null && editingGoalValue.trim()) {
      const updatedGoals = [...businessGoals];
      updatedGoals[editingGoalIndex] = editingGoalValue.trim();
      setBusinessGoals(updatedGoals);
      setEditingGoalIndex(null);
      setEditingGoalValue('');
    }
  };

  const handleCancelEditGoal = () => {
    setEditingGoalIndex(null);
    setEditingGoalValue('');
  };

  return (
    <form id="project-basics-form" onSubmit={handleSubmit(onSubmit)} className="relative space-y-6">
      {/* Processing Overlay */}
      <ProcessingOverlay
        isVisible={isAnyEnhancementInProgress()}
        message={getEnhancementMessage()}
        opacity={0.6}
      />

      {/* AI Instructions Modal */}
      <AIInstructionsModal
        isOpen={activeModal === 'description'}
        onClose={closeAIInstructionsModal}
        onConfirm={(instructions) => enhanceDescription(instructions)}
        title="Enhance Project Description"
        description="The AI will improve your project description with better clarity, grammar, and technical precision."
        confirmText="Enhance Description"
      />

      <AIInstructionsModal
        isOpen={activeModal === 'businessGoals'}
        onClose={closeAIInstructionsModal}
        onConfirm={(instructions) => enhanceBusinessGoals(instructions)}
        title={businessGoals.length > 0 ? 'Enhance Business Goals' : 'Generate Business Goals'}
        description={
          businessGoals.length > 0
            ? 'The AI will improve your existing business goals to be more specific, measurable, and actionable.'
            : 'The AI will generate relevant business goals based on your project description.'
        }
        confirmText={businessGoals.length > 0 ? 'Enhance Goals' : 'Generate Goals'}
      />

      <AIInstructionsModal
        isOpen={activeModal === 'targetUsers'}
        onClose={closeAIInstructionsModal}
        onConfirm={(instructions) => enhanceTargetUsers(instructions)}
        title={currentTargetUsers ? 'Enhance Target Users' : 'Generate Target Users'}
        description={
          currentTargetUsers
            ? 'The AI will improve your target users description with more detail and precision.'
            : 'The AI will generate a relevant target users description based on your project.'
        }
        confirmText={currentTargetUsers ? 'Enhance Users' : 'Generate Users'}
      />

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && (
        <div className="mb-4 flex items-center justify-between rounded-md bg-amber-50 p-3 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          <span>You have unsaved changes. Don't forget to save your project.</span>
        </div>
      )}

      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input
          id="name"
          type="text"
          {...register('name')}
          error={errors.name?.message?.toString()}
          placeholder="Enter project name"
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <Label htmlFor="description">Description</Label>

          {!isLoading && (
            <div className="mb-1 flex items-center justify-end gap-3">
              {!hasAIFeatures && <PremiumFeatureBadge />}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openAIInstructionsModal('description')}
                disabled={isEnhancing || !currentDescription || !hasAIFeatures}
                className={`flex items-center gap-1 text-xs ${
                  !hasAIFeatures ? 'cursor-not-allowed opacity-50' : ''
                }`}
                title={
                  hasAIFeatures
                    ? 'Enhance description with AI'
                    : 'Upgrade to Premium to use AI-powered features'
                }
              >
                {isEnhancing ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {hasAIFeatures ? (
                      <Sparkles size={14} className="mr-1" />
                    ) : (
                      <Lock size={14} className="mr-1" />
                    )}
                  </>
                )}
                {isEnhancing ? 'Enhancing...' : 'Enhance Description'}
              </Button>
            </div>
          )}
        </div>
        <div className="relative">
          <Textarea
            id="description"
            rows={4}
            {...register('description')}
            error={errors.description?.message?.toString()}
            placeholder="Describe your project"
          />
        </div>
        {isEnhancing && (
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enhancing description...
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="business_goals">Business Goals</Label>

          {!isLoading && (
            <div className="flex items-center justify-end gap-3">
              {!hasAIFeatures && <PremiumFeatureBadge />}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openAIInstructionsModal('businessGoals')}
                disabled={isEnhancingGoals || !currentDescription || !hasAIFeatures}
                className={`flex items-center gap-1 text-xs ${
                  !hasAIFeatures ? 'cursor-not-allowed opacity-50' : ''
                }`}
                title={
                  hasAIFeatures
                    ? businessGoals.length > 0
                      ? 'Enhance business goals with AI'
                      : 'Generate business goals with AI'
                    : 'Upgrade to Premium to use AI-powered features'
                }
              >
                {isEnhancingGoals ? (
                  <Loader2 size={14} className="mr-1 animate-spin" />
                ) : (
                  <>
                    {hasAIFeatures ? (
                      <Wand2 size={14} className="mr-1" />
                    ) : (
                      <Lock size={14} className="mr-1" />
                    )}
                  </>
                )}
                {businessGoals.length > 0 ? 'Enhance Goals' : 'Generate Goals'}
              </Button>
            </div>
          )}
        </div>

        {isEnhancingGoals && (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {businessGoals.length > 0
              ? 'Enhancing business goals...'
              : 'Generating business goals...'}
          </div>
        )}

        {/* Display existing business goals */}
        <div className="space-y-2">
          {businessGoals.map((goal, index) => (
            <Card
              key={index}
              className="flex items-center justify-between border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
            >
              {editingGoalIndex === index ? (
                <div className="flex w-full gap-2">
                  <Input
                    type="text"
                    value={editingGoalValue}
                    onChange={(e) => setEditingGoalValue(e.target.value)}
                    className="flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEditGoal();
                      if (e.key === 'Escape') handleCancelEditGoal();
                    }}
                  />
                  <Button type="button" onClick={handleSaveEditGoal} variant="default" size="sm">
                    Save
                  </Button>
                  <Button type="button" onClick={handleCancelEditGoal} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <p className="dark:text-slate-300">{goal}</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartEditGoal(index, goal)}
                      className="text-slate-400 hover:text-blue-500 dark:text-slate-500 dark:hover:text-blue-400"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBusinessGoal(index)}
                      className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>

        {/* Input for new business goal */}
        <div className="flex w-full items-center gap-2">
          <div className="w-full flex-grow">
            <Input
              type="text"
              value={newBusinessGoal}
              onChange={(e) => setNewBusinessGoal(e.target.value)}
              placeholder="Add a business goal"
              className="w-full"
            />
          </div>
          <div className="flex-shrink-0">
            <Button
              type="button"
              onClick={addBusinessGoal}
              disabled={!newBusinessGoal.trim()}
              variant={!newBusinessGoal.trim() ? 'outline' : 'default'}
              className={!newBusinessGoal.trim() ? 'cursor-not-allowed' : ''}
            >
              <PlusCircle size={20} />
            </Button>
          </div>
        </div>

        {/* Hidden input to handle form submission */}
        <input type="hidden" {...register('business_goals')} />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <Label htmlFor="target_users">Target Users</Label>

          {!isLoading && (
            <div className="mb-1 flex items-center justify-end gap-3">
              {!hasAIFeatures && <PremiumFeatureBadge />}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => openAIInstructionsModal('targetUsers')}
                disabled={isEnhancingTargetUsers || !currentDescription || !hasAIFeatures}
                className={`flex items-center gap-1 text-xs ${
                  !hasAIFeatures ? 'cursor-not-allowed opacity-50' : ''
                }`}
                title={
                  hasAIFeatures
                    ? currentTargetUsers
                      ? 'Enhance target users with AI'
                      : 'Generate target users with AI'
                    : 'Upgrade to Premium to use AI-powered features'
                }
              >
                {isEnhancingTargetUsers ? (
                  <Loader2 size={14} className="mr-1 animate-spin" />
                ) : (
                  <>
                    {hasAIFeatures ? (
                      <Users size={14} className="mr-1" />
                    ) : (
                      <Lock size={14} className="mr-1" />
                    )}
                  </>
                )}
                {currentTargetUsers ? 'Enhance Users' : 'Generate Users'}
              </Button>
            </div>
          )}
        </div>

        {isEnhancingTargetUsers && (
          <div className="mb-1 text-sm text-slate-500 dark:text-slate-400">
            {currentTargetUsers ? 'Enhancing target users...' : 'Generating target users...'}
          </div>
        )}

        <Textarea
          id="target_users"
          rows={2}
          {...register('target_users')}
          placeholder="Describe your target user personas"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="domain">Domain</Label>
          <Input
            id="domain"
            type="text"
            {...register('domain')}
            placeholder="e.g. Healthcare, Finance, Education"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className={hasUnsavedChanges && !isSubmitting ? 'animate-pulse' : ''}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {hasUnsavedChanges && <Save className="mr-2 h-4 w-4" />}
              {isEditMode ? 'Update Project' : 'Save Project'}
              {hasUnsavedChanges && '*'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProjectBasicsForm;
