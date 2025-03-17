import {
  lemonSqueezySetup,
  getAuthenticatedUser,
} from "@lemonsqueezy/lemonsqueezy.js";
import axios from "axios";

// User type definition since auth module is not available
export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

// Define types for subscription and payment data
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  intervalCount: number;
  hasFreeTrial: boolean;
  trialDays: number;
  description: string;
  features: string[];
}

export interface Subscription {
  id: string;
  status: "active" | "past_due" | "canceled" | "expired" | "on_trial";
  currentPeriodEnd: Date;
  planId: string;
  customerId: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Define interface for LemonSqueezy window object
declare global {
  interface Window {
    LemonSqueezy?: {
      Url: {
        Open: (url: string) => void;
      };
    };
    createLemonSqueezy?: () => void;
  }
}

/**
 * Service for handling payments and subscriptions via LemonSqueezy
 */
class PaymentService {
  private apiUrl = "/api/payments";

  /**
   * Initialize LemonSqueezy SDK
   * @param apiKey - LemonSqueezy API key (optional, can be configured in backend)
   */
  initialize(
    apiKey: string = import.meta.env.VITE_LEMON_SQUEEZY_API_KEY
  ): void {
    lemonSqueezySetup({
      apiKey,
      onError: (error) => {
        console.error("LemonSqueezy error:", error);
      },
    });
  }

  /**
   * Verify LemonSqueezy authentication
   */
  async verifyLemonSqueezyAuth(): Promise<boolean> {
    try {
      const { data, error } = await getAuthenticatedUser();

      if (error) {
        console.error("LemonSqueezy auth error:", error.message);
        return false;
      }

      console.log("LemonSqueezy authenticated user:", data);
      return true;
    } catch (error) {
      console.error("Failed to verify LemonSqueezy authentication:", error);
      return false;
    }
  }

  /**
   * Get available subscription plans
   */
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/plans`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch subscription plans:", error);
      throw error;
    }
  }

  /**
   * Get or create customer for the current user
   */
  async getOrCreateCustomer(user: User): Promise<Customer> {
    try {
      const response = await axios.post(`${this.apiUrl}/customers`, {
        email: user.email,
        name: user.displayName || user.email,
        userId: user.uid,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get or create customer:", error);
      throw error;
    }
  }

  /**
   * Get user's active subscription if any
   */
  async getCurrentSubscription(email: string): Promise<Subscription | null> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/subscriptions/current?email=${encodeURIComponent(
          email
        )}`
      );
      return response.data || null;
    } catch (error) {
      console.error("Failed to fetch current subscription:", error);
      return null;
    }
  }

  /**
   * Create a checkout session for a subscription
   */
  async createCheckout(
    planId: string,
    userEmail: string,
    userId: string
  ): Promise<{ url: string }> {
    try {
      const response = await axios.post(`${this.apiUrl}/checkout`, {
        planId,
        email: userEmail,
        userId,
      });
      return { url: response.data.url };
    } catch (error) {
      console.error("Failed to create checkout URL:", error);
      throw error;
    }
  }

  /**
   * Check if user has an active subscription
   */
  async hasActiveSubscription(email: string): Promise<boolean> {
    try {
      const subscription = await this.getCurrentSubscription(email);
      return (
        !!subscription && ["active", "on_trial"].includes(subscription.status)
      );
    } catch (error) {
      console.error("Failed to check subscription status:", error);
      return false;
    }
  }

  /**
   * Handle direct checkout with LemonSqueezy JS
   */
  async checkoutWithLemonSqueezy(checkoutUrl: string): Promise<void> {
    try {
      // Ensure LemonSqueezy checkout script is initialized
      if (window.createLemonSqueezy) {
        window.createLemonSqueezy();
      }

      // Open the checkout URL using LemonSqueezy's client-side library
      if (window.LemonSqueezy?.Url.Open) {
        window.LemonSqueezy.Url.Open(checkoutUrl);
      } else {
        // Fallback to regular window redirect if LemonSqueezy client not available
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("LemonSqueezy checkout error:", error);
      throw error;
    }
  }

  /**
   * Create a customer portal URL for managing subscriptions
   */
  async createCustomerPortalUrl(customerId: string): Promise<{ url: string }> {
    try {
      const response = await axios.post(`${this.apiUrl}/customer-portal`, {
        customerId,
      });
      return { url: response.data.url };
    } catch (error) {
      console.error("Failed to create customer portal URL:", error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
