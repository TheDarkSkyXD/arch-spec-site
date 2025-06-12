import apiClient from '../api/apiClient';

interface Subscription {
  id: string;
  status: string;
  plan_type: 'free' | 'premium' | 'open_source';
  current_period_end: string;
  ai_credits_current: number;
  ai_credits_reset_value: number;
}

// Define a type for subscription plans
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  interval_count: number;
  has_free_trial: boolean;
  trial_days: number;
  description: string;
  features: string[];
  plan_type: 'free' | 'premium' | 'open_source';
  ai_credits: number;
}

export const subscriptionService = {
  /**
   * Get the current user's subscription details
   */
  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      const response = await apiClient.get('/subscription/current');
      return response.data;
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      return null;
    }
  },

  /**
   * Track usage of an AI credit will be implemented in the backend
   */

  /**
   * Generate a checkout URL for subscribing to a plan
   */
  async createCheckoutSession(planId: string): Promise<{ url: string } | null> {
    try {
      const response = await apiClient.post('/subscription/create-checkout', {
        plan_id: planId,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return null;
    }
  },

  /**
   * Generate a customer portal URL for managing subscription
   */
  async createCustomerPortalSession(): Promise<{ url: string } | null> {
    try {
      const response = await apiClient.post('/subscription/customer-portal');
      return response.data;
    } catch (error) {
      console.error('Error creating customer portal session:', error);
      return null;
    }
  },

  /**
   * Get all available subscription plans
   */
  async getPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await apiClient.get('/subscription/plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  },

  /**
   * Check if the user is eligible to use AI features (has active subscription with credits)
   */
  async checkAIEligibility(): Promise<{ eligible: boolean; reason?: string }> {
    try {
      const response = await apiClient.get('/subscription/ai-eligibility');
      return response.data;
    } catch (error) {
      console.error('Error checking AI eligibility:', error);
      return { eligible: false, reason: 'Failed to verify eligibility' };
    }
  },
};
