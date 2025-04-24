import { Loader2, Lock, RefreshCw, Sparkles } from 'lucide-react';
import React from 'react';
import { PremiumFeatureBadge } from '../../ui';
import Button from '../../ui/Button';

interface AIEnhancementButtonsProps {
  openAddModal: () => void;
  openEnhanceModal: () => void;
  isAddingEntities: boolean;
  isEnhancing: boolean;
  projectId?: string;
  hasAIFeatures: boolean;
  entitiesExist: boolean;
}

const AIEnhancementButtons: React.FC<AIEnhancementButtonsProps> = ({
  openAddModal,
  openEnhanceModal,
  isAddingEntities,
  isEnhancing,
  projectId,
  hasAIFeatures,
  entitiesExist,
}) => {
  return (
    <div className="mb-4 flex items-center justify-end gap-3">
      {!hasAIFeatures && <PremiumFeatureBadge />}
      <Button
        type="button"
        onClick={openAddModal}
        disabled={isAddingEntities || isEnhancing || !projectId || !hasAIFeatures}
        variant={hasAIFeatures ? 'outline' : 'ghost'}
        className={`relative flex items-center gap-2 ${
          !hasAIFeatures ? 'cursor-not-allowed opacity-50' : ''
        }`}
        title={
          hasAIFeatures
            ? 'Generate new entities to complement existing ones'
            : 'Upgrade to Premium to use AI-powered features'
        }
      >
        {isAddingEntities ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Adding...</span>
          </>
        ) : (
          <>
            {hasAIFeatures ? (
              <Sparkles className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            <span>Add AI Entities</span>
          </>
        )}
      </Button>
      <Button
        type="button"
        onClick={openEnhanceModal}
        disabled={
          isEnhancing ||
          isAddingEntities ||
          !projectId ||
          !hasAIFeatures ||
          !entitiesExist
        }
        variant={hasAIFeatures ? 'outline' : 'ghost'}
        className={`relative flex items-center gap-2 ${
          !hasAIFeatures ? 'cursor-not-allowed opacity-50' : ''
        }`}
        title={
          hasAIFeatures
            ? 'Replace entire data model with AI-generated one'
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
            {hasAIFeatures ? (
              <RefreshCw className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            <span>Replace All</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default AIEnhancementButtons; 