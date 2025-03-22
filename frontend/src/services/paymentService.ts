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
  current_period_end: Date;
  plan_id: string;
  customer_id: string;
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

// Cache interfaces
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Service for handling payments and subscriptions via LemonSqueezy
 */
class PaymentService {
  private apiUrl = "/api/payments";
  private planCache: CacheItem<SubscriptionPlan[]> | null = null;
  private customerCache: Map<string, CacheItem<Customer>> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

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
  async getSubscriptionPlans(
    forceRefresh = false
  ): Promise<SubscriptionPlan[]> {
    try {
      // Return from cache if available and not forcing refresh
      const now = Date.now();
      if (!forceRefresh && this.planCache && now < this.planCache.expiresAt) {
        console.log("Using cached subscription plans");
        return this.planCache.data;
      }

      console.log("Fetching subscription plans from API");
      const response = await axios.get(`${this.apiUrl}/plans`);

      // Cache the response
      this.planCache = {
        data: response.data,
        timestamp: now,
        expiresAt: now + this.CACHE_TTL,
      };

      return response.data;
    } catch (error) {
      console.error("Failed to fetch subscription plans:", error);
      // If cache exists but is expired, still return it as fallback
      if (this.planCache) {
        console.log("Using expired cached plans as fallback");
        return this.planCache.data;
      }
      throw error;
    }
  }

  /**
   * Get or create customer for the current user
   */
  async getOrCreateCustomer(
    user: User,
    forceRefresh = false
  ): Promise<Customer> {
    try {
      const cacheKey = user.email;
      const now = Date.now();

      // Return from cache if available and not forcing refresh
      if (
        !forceRefresh &&
        this.customerCache.has(cacheKey) &&
        now < this.customerCache.get(cacheKey)!.expiresAt
      ) {
        console.log("Using cached customer data");
        return this.customerCache.get(cacheKey)!.data;
      }

      console.log("Fetching or creating customer from API");
      const response = await axios.post(`${this.apiUrl}/customers`, {
        email: user.email,
        name: user.displayName || user.email,
        user_id: user.uid,
      });

      // Cache the response
      this.customerCache.set(cacheKey, {
        data: response.data,
        timestamp: now,
        expiresAt: now + this.CACHE_TTL,
      });

      return response.data;
    } catch (error) {
      console.error("Failed to get or create customer:", error);
      // If cache exists, still return it as fallback
      if (this.customerCache.has(user.email)) {
        console.log("Using expired cached customer data as fallback");
        return this.customerCache.get(user.email)!.data;
      }
      throw error;
    }
  }

  /**
   * Get user's active subscription if any
   */
  async getCurrentSubscription(
    email: string,
    shouldRefresh = false
  ): Promise<Subscription | null> {
    try {
      // Add a cache-busting parameter if we need a fresh fetch
      const cacheBuster = shouldRefresh ? `&_=${Date.now()}` : "";
      console.log(
        `Fetching current subscription for ${email}, refresh=${shouldRefresh}`
      );
      const response = await axios.get(
        `${this.apiUrl}/subscriptions/current?email=${encodeURIComponent(
          email
        )}${cacheBuster}`
      );

      // Log the response data to help diagnose issues
      console.log("Subscription response:", response.data);

      if (response.data) {
        // Convert ISO string dates to Date objects
        if (
          response.data.currentPeriodEnd &&
          typeof response.data.currentPeriodEnd === "string"
        ) {
          response.data.currentPeriodEnd = new Date(
            response.data.currentPeriodEnd
          );
        }
      }

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
        plan_id: planId,
        email: userEmail,
        user_id: userId,
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
   * Clear all caches, useful when needing fresh data
   */
  clearCaches(): void {
    console.log("Clearing all payment service caches");
    this.planCache = null;
    this.customerCache.clear();
  }

  /**
   * Create a customer portal URL for managing subscriptions
   */
  async createCustomerPortalUrl(customerId: string): Promise<{ url: string }> {
    try {
      const response = await axios.post(`${this.apiUrl}/customer-portal`, {
        customer_id: customerId,
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
