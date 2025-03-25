import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./index";
import { subscriptionService } from "../services/subscriptionService";
import { userApi } from "../api/userApi";

export type SubscriptionPlan = "free" | "premium" | "open_source";

interface SubscriptionContextType {
  // Plan information
  currentPlan: SubscriptionPlan;
  subscriptionId: string | null;
  isLoading: boolean;

  // AI credits
  aiCreditsAvailable: number;
  aiCreditsUsed: number;

  // Feature checks
  hasAIFeatures: boolean;
  hasPremiumTemplates: boolean;
  hasUnlimitedProjects: boolean;

  refreshSubscriptionData: () => Promise<void>;
}

const defaultContextValue: SubscriptionContextType = {
  currentPlan: "free",
  subscriptionId: null,
  isLoading: true,
  aiCreditsAvailable: 0,
  aiCreditsUsed: 0,
  hasAIFeatures: false,
  hasPremiumTemplates: false,
  hasUnlimitedProjects: false,
  refreshSubscriptionData: async () => {},
};

const SubscriptionContext =
  createContext<SubscriptionContextType>(defaultContextValue);

export const useSubscription = () => useContext(SubscriptionContext);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>("free");
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [aiCreditsAvailable, setAiCreditsAvailable] = useState(0);
  const [aiCreditsUsed, setAiCreditsUsed] = useState(0);
  const [hasAIFeatures, setHasAIFeatures] = useState(false);
  const [hasPremiumTemplates, setHasPremiumTemplates] = useState(false);
  const [hasUnlimitedProjects, setHasUnlimitedProjects] = useState(false);

  const fetchSubscriptionData = async () => {
    if (authLoading || !currentUser) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Get plan info from user object if available
      if (currentUser.profile?.plan) {
        const planType = currentUser.profile.plan as SubscriptionPlan;
        setCurrentPlan(planType);
        setSubscriptionId(currentUser.profile.subscription_id || null);
        setAiCreditsAvailable(currentUser.profile.ai_credits || 0);
        setAiCreditsUsed(currentUser.profile.ai_credits_used || 0);

        // Update feature flags based on plan type
        setHasAIFeatures(planType === "premium" || planType === "open_source");
        setHasPremiumTemplates(planType === "premium");
        setHasUnlimitedProjects(
          planType === "premium" || planType === "open_source"
        );
      } else {
        // Alternatively fetch from subscription endpoint if implemented
        const subscriptionData =
          await subscriptionService.getCurrentSubscription();
        if (subscriptionData) {
          const planType = subscriptionData.plan_type as SubscriptionPlan;
          setCurrentPlan(planType);
          setSubscriptionId(subscriptionData.id);
          setAiCreditsAvailable(subscriptionData.ai_credits_current);

          // Update feature flags based on plan type
          setHasAIFeatures(
            planType === "premium" || planType === "open_source"
          );
          setHasPremiumTemplates(planType === "premium");
          setHasUnlimitedProjects(
            planType === "premium" || planType === "open_source"
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch subscription data", error);
      // Fallback to free plan on error
      setCurrentPlan("free");
      // Reset feature flags
      setHasAIFeatures(false);
      setHasPremiumTemplates(false);
      setHasUnlimitedProjects(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subscription data on auth changes
  useEffect(() => {
    fetchSubscriptionData();
  }, [authLoading, currentUser]);

  // Update feature flags whenever the plan changes
  useEffect(() => {
    setHasAIFeatures(
      currentPlan === "premium" || currentPlan === "open_source"
    );
    setHasPremiumTemplates(currentPlan === "premium");
    setHasUnlimitedProjects(
      currentPlan === "premium" || currentPlan === "open_source"
    );
  }, [currentPlan]);

  // Function to refresh subscription data
  const refreshSubscriptionData = async (): Promise<void> => {
    const user = await userApi.getCurrentUserProfile();
    if (user) {
      setHasAIFeatures(user.plan === "premium" || user.plan === "open_source");
      setHasPremiumTemplates(user.plan === "premium");
      setHasUnlimitedProjects(
        user.plan === "premium" || user.plan === "open_source"
      );
    }
  };

  const value: SubscriptionContextType = {
    currentPlan,
    subscriptionId,
    isLoading,
    aiCreditsAvailable,
    aiCreditsUsed,
    hasAIFeatures,
    hasPremiumTemplates,
    hasUnlimitedProjects,
    refreshSubscriptionData,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
