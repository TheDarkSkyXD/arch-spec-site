import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

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
  className = "",
  compact = false,
  label = "AI features available with Premium plan",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/subscription");
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-center text-sm text-muted-foreground 
        bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded 
        border border-amber-200 dark:border-amber-800/30
        hover:bg-amber-100 dark:hover:bg-amber-900/30 
        cursor-pointer transition-colors duration-200
        ${className}
      `}
      role="button"
      aria-label="View premium subscription plans"
      title="Click to view subscription plans"
    >
      <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
      {!compact && <span>{label}</span>}
    </div>
  );
};
export default PremiumFeatureBadge;
