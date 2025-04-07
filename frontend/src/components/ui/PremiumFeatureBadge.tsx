import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface PremiumFeatureBadgeProps {
  className?: string;
  compact?: boolean;
  label?: string;
}

/**
 * A reusable badge that indicates a feature requires a premium subscription.
 * Clicking on it navigates to the subscription page.
 */
const PremiumFeatureBadge: React.FC<PremiumFeatureBadgeProps> = ({
  className = '',
  compact = false,
  label = 'AI features available with Premium plan',
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/subscription');
  };

  return (
    <div
      onClick={handleClick}
      className={`text-muted-foreground flex cursor-pointer items-center rounded border border-amber-200 bg-amber-50 px-2 py-1 text-sm transition-colors duration-200 hover:bg-amber-100 dark:border-amber-800/30 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 ${className} `}
      role="button"
      aria-label="View premium subscription plans"
      title="Click to view subscription plans"
    >
      <Sparkles className="mr-1 h-4 w-4 text-amber-500" />
      {!compact && <span>{label}</span>}
    </div>
  );
};
export default PremiumFeatureBadge;
