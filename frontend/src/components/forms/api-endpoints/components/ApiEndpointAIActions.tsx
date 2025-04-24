import { Loader2, Lock, RefreshCw, Sparkles } from 'lucide-react';
import Button from '../../../ui/Button';
import PremiumFeatureBadge from '../../../ui/PremiumFeatureBadge';

interface ApiEndpointAIActionsProps {
  hasAIFeatures: boolean;
  isAddingEndpoints: boolean;
  isEnhancing: boolean;
  endpointsCount: number;
  projectId?: string;
  onOpenAddModal: () => void;
  onOpenEnhanceModal: () => void;
}

export const ApiEndpointAIActions = ({
  hasAIFeatures,
  isAddingEndpoints,
  isEnhancing,
  endpointsCount,
  projectId,
  onOpenAddModal,
  onOpenEnhanceModal,
}: ApiEndpointAIActionsProps) => {
  return (
    <div className="mb-4 flex items-center justify-end gap-3">
      {!hasAIFeatures && <PremiumFeatureBadge />}
      <Button
        type="button"
        onClick={onOpenAddModal}
        disabled={isAddingEndpoints || isEnhancing || !projectId || !hasAIFeatures}
        variant={hasAIFeatures ? 'outline' : 'ghost'}
        className={`relative flex items-center gap-2 ${
          !hasAIFeatures ? 'cursor-not-allowed opacity-50' : ''
        }`}
        title={
          hasAIFeatures
            ? 'Generate new endpoints to complement existing ones'
            : 'Upgrade to Premium to use AI-powered features'
        }
      >
        {isAddingEndpoints ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Adding...</span>
          </>
        ) : (
          <>
            {hasAIFeatures ? <Sparkles className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            <span>Add AI Endpoints</span>
          </>
        )}
      </Button>
      <Button
        type="button"
        onClick={onOpenEnhanceModal}
        disabled={
          isEnhancing ||
          isAddingEndpoints ||
          !projectId ||
          !hasAIFeatures ||
          endpointsCount === 0
        }
        variant={hasAIFeatures ? 'outline' : 'ghost'}
        className={`relative flex items-center gap-2 ${
          !hasAIFeatures ? 'cursor-not-allowed opacity-50' : ''
        }`}
        title={
          hasAIFeatures
            ? 'Replace all endpoints with AI-generated ones'
            : 'Upgrade to Premium to use AI-powered features'
        }
      >
        {isEnhancing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Enhancing...</span>
          </>
        ) : (
          <>
            {hasAIFeatures ? <RefreshCw className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            <span>Replace All</span>
          </>
        )}
      </Button>
    </div>
  );
}; 