import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import paymentService, { Subscription } from "../services/paymentService";

interface UseSubscriptionResult {
  isSubscriptionActive: boolean;
  isSubscriptionLoading: boolean;
  subscription: Subscription | null;
  refreshSubscription: () => Promise<void>;
}

// Define a simplified interface for auth context user
interface AuthUser {
  email?: string;
}

/**
 * Custom hook to check if a user has an active subscription
 */
export const useSubscription = (): UseSubscriptionResult => {
  // Access auth context and explicitly type the user
  const auth = useAuth();
  const user = auth?.currentUser as AuthUser | undefined;

  const [isSubscriptionActive, setIsSubscriptionActive] =
    useState<boolean>(false);
  const [isSubscriptionLoading, setIsSubscriptionLoading] =
    useState<boolean>(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const checkSubscription = async () => {
    if (!user?.email) {
      setIsSubscriptionActive(false);
      setIsSubscriptionLoading(false);
      return;
    }

    try {
      setIsSubscriptionLoading(true);
      const currentSubscription = await paymentService.getCurrentSubscription(
        user.email
      );

      if (
        currentSubscription &&
        ["active", "on_trial"].includes(currentSubscription.status)
      ) {
        setIsSubscriptionActive(true);
        setSubscription(currentSubscription);
      } else {
        setIsSubscriptionActive(false);
        setSubscription(currentSubscription);
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
      setIsSubscriptionActive(false);
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user]);

  const refreshSubscription = async (): Promise<void> => {
    await checkSubscription();
  };

  return {
    isSubscriptionActive,
    isSubscriptionLoading,
    subscription,
    refreshSubscription,
  };
};

export default useSubscription;
