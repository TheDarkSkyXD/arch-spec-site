import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts';
import { userApi, UserProfile } from '../api/userApi';
import { toast } from 'react-hot-toast';

interface UseUserProfileResult {
  // User profile data
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // AI Credits specific
  aiCreditsRemaining: number;
  aiCreditsTotal: number;
  aiCreditsUsed: number;

  // Utility functions
  refreshProfile: () => Promise<void>;
  hasEnoughAICredits: (requiredCredits?: number) => boolean;
  updateAICreditsUsage: (creditsUsed: number) => Promise<boolean>;
}

/**
 * Custom hook to expose user profile data including AI credits
 * Can be used to check if the user has sufficient AI credits for AI operations
 */
export const useUserProfile = (): UseUserProfileResult => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(currentUser?.profile || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Derived state for AI credits
  const aiCreditsTotal = profile?.ai_credits || 0;
  const aiCreditsUsed = profile?.ai_credits_used || 0;
  const aiCreditsRemaining = profile
    ? Math.max(0, profile.ai_credits - profile.ai_credits_used)
    : 0;

  // Load profile data from API
  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const freshProfile = await userApi.getCurrentUserProfile();
      setProfile(freshProfile);
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError('Failed to load user profile data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial profile loading
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Function to check if user has enough AI credits
  const hasEnoughAICredits = useCallback(
    (requiredCredits: number = 1): boolean => {
      // If no profile or not a premium user, they don't have access to AI features
      if (!profile || (profile.plan !== 'premium' && profile.plan !== 'open_source')) {
        return false;
      }

      // Check if they have sufficient credits
      return aiCreditsRemaining >= requiredCredits;
    },
    [profile, aiCreditsRemaining]
  );

  // Function to update AI credits usage
  const updateAICreditsUsage = useCallback(
    async (creditsUsed: number): Promise<boolean> => {
      if (!profile || creditsUsed <= 0) {
        return false;
      }

      try {
        // Update the user's AI credits usage
        const updatedProfile = await userApi.updateUserSubscription({
          ai_credits_used: profile.ai_credits_used + creditsUsed,
        });

        setProfile(updatedProfile);
        return true;
      } catch (err) {
        console.error('Error updating AI credits usage:', err);
        toast.error('Failed to update AI credits usage');
        return false;
      }
    },
    [profile]
  );

  // Function to refresh profile data
  const refreshProfile = useCallback(async (): Promise<void> => {
    await loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    error,
    aiCreditsRemaining,
    aiCreditsTotal,
    aiCreditsUsed,
    refreshProfile,
    hasEnoughAICredits,
    updateAICreditsUsage,
  };
};

export default useUserProfile;
