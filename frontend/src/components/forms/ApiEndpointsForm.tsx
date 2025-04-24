import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useToast } from '../../contexts/ToastContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { ProcessingOverlay } from '../ui';
import AIInstructionsModal from '../ui/AIInstructionsModal';
import Button from '../ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ApiEndpointAIActions } from './api-endpoints/components/ApiEndpointAIActions';
import { ApiEndpointCard } from './api-endpoints/components/ApiEndpointCard';
import { ApiEndpointForm } from './api-endpoints/components/ApiEndpointForm';
import { ApiEndpointHeader } from './api-endpoints/components/ApiEndpointHeader';
import { useApiEndpointCategories } from './api-endpoints/hooks/useApiEndpointCategories';
import { useApiEndpoints } from './api-endpoints/hooks/useApiEndpoints';
import { useApiEndpointsAI } from './api-endpoints/hooks/useApiEndpointsAI';
import { ApiEndpoint, ApiEndpointsFormProps } from './api-endpoints/types';

export default function ApiEndpointsForm({ initialData, projectId, onSuccess }: ApiEndpointsFormProps) {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [showAuthOnly, setShowAuthOnly] = useState(false);
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(null);
  const [showNewEndpointForm, setShowNewEndpointForm] = useState(false);
  const [editingEndpointIndex, setEditingEndpointIndex] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // AI modal state
  const [isEnhanceModalOpen, setIsEnhanceModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Hooks
  const { showToast } = useToast();
  const { hasAIFeatures } = useSubscription();
  const { aiCreditsRemaining } = useUserProfile();
  const {
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
  } = useApiEndpoints(projectId, initialData);

  const {
    isEnhancing,
    isAddingEndpoints,
    projectDescription,
    enhanceEndpoints,
    addAIEndpoints,
  } = useApiEndpointsAI(projectId);

  const { categories, filterEndpoints } = useApiEndpointCategories(endpoints);

  // Track unsaved changes
  useEffect(() => {
    // Only set hasUnsavedChanges to true if we have initial data to compare against
    if (initialData && initialData.endpoints) {
      // Compare current endpoints with initial data
      const initialEndpoints = initialData.endpoints;
      
      // Check if the number of endpoints has changed
      if (initialEndpoints.length !== endpoints.length) {
        setHasUnsavedChanges(true);
        return;
      }
      
      // Check if any endpoint has been modified
      // This is a simple check - for a more thorough check you'd need a deep comparison
      const hasChanges = endpoints.some((endpoint, index) => {
        const initialEndpoint = initialEndpoints[index];
        return (
          initialEndpoint.path !== endpoint.path ||
          initialEndpoint.description !== endpoint.description ||
          initialEndpoint.auth !== endpoint.auth ||
          JSON.stringify(initialEndpoint.methods) !== JSON.stringify(endpoint.methods) ||
          JSON.stringify(initialEndpoint.roles) !== JSON.stringify(endpoint.roles)
        );
      });
      
      setHasUnsavedChanges(hasChanges);
    } else if (endpoints.length > 0) {
      // If we don't have initial data but have endpoints, there are unsaved changes
      setHasUnsavedChanges(true);
    }
  }, [endpoints, initialData]);

  // Filter endpoints based on search and filters
  const filteredCategories = filterEndpoints(categories, searchTerm, selectedMethods, showAuthOnly);

  // Handlers
  const handleMethodFilterToggle = (method: string) => {
    setSelectedMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleSubmit = async () => {
    const result = await saveEndpoints();
    if (result && onSuccess) {
      onSuccess(result);
      setHasUnsavedChanges(false);
    }
  };

  const handleEnhanceEndpoints = async (additionalInstructions?: string) => {
    const enhancedEndpoints = await enhanceEndpoints(endpoints, additionalInstructions);
    if (enhancedEndpoints) {
      setEndpoints(enhancedEndpoints);
    }
    setIsEnhanceModalOpen(false);
  };

  const handleAddAIEndpoints = async (additionalInstructions?: string) => {
    const newEndpoints = await addAIEndpoints(additionalInstructions);
    if (newEndpoints) {
      setEndpoints([...endpoints, ...newEndpoints]);
    }
    setIsAddModalOpen(false);
  };

  const openEnhanceModal = () => {
    if (aiCreditsRemaining <= 0) {
      showToast({
        title: 'Insufficient AI Credits',
        description: "You've used all your AI credits for this billing period",
        type: 'warning',
      });
      return;
    }

    if (!projectId) {
      showToast({
        title: 'Error',
        description: 'Project must be saved before endpoints can be enhanced',
        type: 'error',
      });
      return;
    }

    if (!hasAIFeatures) {
      showToast({
        title: 'Premium Feature',
        description: 'Upgrade to Premium to use AI-powered features',
        type: 'info',
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: 'Warning',
        description: 'Project description is missing. Endpoints may not be properly enhanced.',
        type: 'warning',
      });
    }

    setIsEnhanceModalOpen(true);
  };

  const openAddModal = () => {
    if (aiCreditsRemaining <= 0) {
      showToast({
        title: 'Insufficient AI Credits',
        description: "You've used all your AI credits for this billing period",
        type: 'warning',
      });
      return;
    }

    if (!projectId) {
      showToast({
        title: 'Error',
        description: 'Project must be saved before endpoints can be enhanced',
        type: 'error',
      });
      return;
    }

    if (!hasAIFeatures) {
      showToast({
        title: 'Premium Feature',
        description: 'Upgrade to Premium to use AI-powered features',
        type: 'info',
      });
      return;
    }

    if (!projectDescription) {
      showToast({
        title: 'Warning',
        description: 'Project description is missing. Endpoints may not be properly generated.',
        type: 'warning',
      });
    }

    setIsAddModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary-600" />
        <span className="text-slate-600 dark:text-slate-300">Loading API endpoints...</span>
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      {/* Processing Overlay */}
      <ProcessingOverlay
        isVisible={isEnhancing || isAddingEndpoints}
        message={
          isEnhancing
            ? 'AI is analyzing your project to create optimal API endpoints. Please wait...'
            : 'AI is generating additional API endpoints based on your project requirements. Please wait...'
        }
        opacity={0.6}
      />

      {/* AI Instructions Modals */}
      <AIInstructionsModal
        isOpen={isEnhanceModalOpen}
        onClose={() => setIsEnhanceModalOpen(false)}
        onConfirm={handleEnhanceEndpoints}
        title="Enhance All Endpoints"
        description="The AI will replace your current API endpoints with an optimized structure based on your project requirements and features."
        confirmText="Replace Endpoints"
      />

      <AIInstructionsModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddAIEndpoints}
        title="Generate Additional Endpoints"
        description="The AI will generate new API endpoints to complement your existing ones based on your project data models, requirements and features."
        confirmText="Add Endpoints"
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
          <span>You have unsaved changes. Click "Save API Endpoints" to persist your changes.</span>
        </div>
      )}

      {/* Header with Search and Filters */}
      <ApiEndpointHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedMethods={selectedMethods}
        onMethodFilterChange={handleMethodFilterToggle}
        showAuthOnly={showAuthOnly}
        onAuthFilterChange={setShowAuthOnly}
        onAddNewClick={() => setShowNewEndpointForm(true)}
      />

      {/* AI Actions */}
      <ApiEndpointAIActions
        hasAIFeatures={hasAIFeatures}
        isAddingEndpoints={isAddingEndpoints}
        isEnhancing={isEnhancing}
        endpointsCount={endpoints.length}
        projectId={projectId}
        onOpenAddModal={openAddModal}
        onOpenEnhanceModal={openEnhanceModal}
      />

      {/* Add/Edit Form */}
      {(showNewEndpointForm || editingEndpointIndex !== null) && (
        <ApiEndpointForm
          endpoint={editingEndpointIndex !== null ? endpoints[editingEndpointIndex] : undefined}
          onSubmit={(formData) => {
            if (editingEndpointIndex !== null) {
              updateEndpoint(editingEndpointIndex, formData);
              setEditingEndpointIndex(null);
            } else {
              addEndpoint(formData);
              setShowNewEndpointForm(false);
            }
          }}
          onCancel={() => {
            setShowNewEndpointForm(false);
            setEditingEndpointIndex(null);
          }}
          validateEndpoint={validateEndpoint}
        />
      )}

      {/* Endpoints List */}
      {filteredCategories.length > 0 ? (
        <Tabs defaultValue={filteredCategories[0].name} className="w-full">
          <TabsList className="mb-4">
            {filteredCategories.map((category) => (
              <TabsTrigger
                key={category.name}
                value={category.name}
                className="capitalize"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredCategories.map((category) => (
            <TabsContent key={category.name} value={category.name} className="space-y-4">
              {category.endpoints.map((endpoint: ApiEndpoint) => {
                // Find the actual index in the main endpoints array
                const mainEndpointIndex = endpoints.findIndex(
                  (e) => e.path === endpoint.path && e.description === endpoint.description
                );
                
                return (
                  <ApiEndpointCard
                    key={`${endpoint.path}-${mainEndpointIndex}`}
                    endpoint={endpoint}
                    isExpanded={expandedEndpoint === mainEndpointIndex}
                    onToggleExpand={() => setExpandedEndpoint(expandedEndpoint === mainEndpointIndex ? null : mainEndpointIndex)}
                    onEdit={() => setEditingEndpointIndex(mainEndpointIndex)}
                    onRemove={() => removeEndpoint(mainEndpointIndex)}
                  />
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-600">
          <p className="text-slate-600 dark:text-slate-400">
            {endpoints.length === 0
              ? 'No API endpoints defined yet'
              : 'No endpoints match your search criteria'}
          </p>
        </div>
      )}

      {/* Save Button */}
      <div className="sticky bottom-0 mt-6 flex justify-end bg-white p-4 dark:bg-slate-900">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !projectId || editingEndpointIndex !== null || !hasUnsavedChanges}
          variant={!projectId || isSubmitting || editingEndpointIndex !== null || !hasUnsavedChanges ? 'outline' : 'default'}
          className={
            !projectId || isSubmitting || editingEndpointIndex !== null || !hasUnsavedChanges
              ? 'cursor-not-allowed opacity-50'
              : 'animate-pulse'
          }
        >
          {isSubmitting ? 'Saving...' : hasUnsavedChanges ? 'Save API Endpoints*' : 'Save API Endpoints'}
        </Button>
      </div>
    </div>
  );
} 