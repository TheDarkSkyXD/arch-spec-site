import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts";
import {
  Customer,
  SubscriptionPlan,
  Subscription,
  User,
} from "../services/paymentService";
import paymentService from "../services/paymentService";
import { userApi } from "../api/userApi";

// Mock DashboardLayout component until the real one is available
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="dashboard-layout">{children}</div>;

const SubscriptionPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [isPostCheckout, setIsPostCheckout] = useState(false);

  // Get auth context with proper typing
  const { currentUser, loading: authLoading } = useAuth();
  // Safely cast currentUser to User type
  const user = currentUser as User | null | undefined;

  const navigate = useNavigate();
  const location = useLocation();

  // Check if we need to refresh subscription data (coming back from checkout)
  const searchParams = new URLSearchParams(location.search);
  const shouldRefresh = searchParams.get("refresh") === "true";

  const getPricePerMonth = useCallback((plan: SubscriptionPlan): number => {
    let pricePerMonth = plan.price / plan.intervalCount;
    if (plan.interval === "year") {
      pricePerMonth /= 12;
    }
    return pricePerMonth;
  }, []);

  const getBestValuePlan = useCallback(
    (availablePlans: SubscriptionPlan[]): SubscriptionPlan => {
      // Find the best value plan (usually the annual plan)
      let bestPlan = availablePlans[0];
      let lowestPricePerMonth = getPricePerMonth(availablePlans[0]);

      for (const plan of availablePlans) {
        const pricePerMonth = getPricePerMonth(plan);
        if (pricePerMonth < lowestPricePerMonth) {
          lowestPricePerMonth = pricePerMonth;
          bestPlan = plan;
        }
      }

      return bestPlan;
    },
    [getPricePerMonth]
  );

  useEffect(() => {
    // Keep track of component mount state
    let isMounted = true;

    const loadData = async () => {
      // Don't do anything if auth is still loading
      if (authLoading) {
        return;
      }

      // Only redirect if auth is finished loading and user is definitely null
      if (!user && !authLoading) {
        console.log("User is not authenticated, redirecting to login");
        navigate("/login", {
          state: {
            from: "/subscription",
            message: "Please sign in to view subscription plans",
          },
        });
        return;
      }

      try {
        if (!isMounted) return;
        setIsLoading(true);
        setError(null);

        // Initialize LemonSqueezy if needed
        paymentService.initialize();

        // If returning from checkout, clear all caches to ensure fresh data
        if (shouldRefresh) {
          console.log(
            "🔄 Returning from checkout - clearing all caches and forcing refresh"
          );
          paymentService.clearCaches();
          setIsPostCheckout(true);
          // Clear URL parameter after using it
          navigate("/subscription", { replace: true });
        }

        // Check subscription status first
        // Only proceed with user-specific operations if we have a user
        if (user && user.email) {
          console.log(
            `🔍 First checking subscription status for ${user.email}`
          );

          // Get current subscription with bypassing cache if needed
          const subscription = await paymentService.getCurrentSubscription(
            user.email,
            shouldRefresh
          );

          if (!isMounted) return;
          console.log("📊 Subscription data:", subscription);

          if (subscription) {
            console.log("✅ Active subscription found:", subscription.status);
            setCurrentSubscription(subscription);

            // Update user profile with subscription information if needed
            try {
              console.log(
                "Updating user profile with subscription information"
              );
              const userProfile = await userApi.getCurrentUserProfile();

              // Only update if subscription ID doesn't match or plan is not premium
              if (
                userProfile.subscription_id !== subscription.id ||
                userProfile.plan !== "premium"
              ) {
                await userApi.updateUserSubscription({
                  subscription_id: subscription.id,
                  plan: "premium",
                  ai_credits: 500, // Default premium credits
                });
                console.log(
                  "User profile updated with subscription information"
                );
              } else {
                console.log(
                  "User profile already has correct subscription information"
                );
              }

              // Since user has an active subscription, we can skip loading plans
              // Just load customer data for manage subscription functionality
              if (user.uid) {
                const customerData = await paymentService.getOrCreateCustomer(
                  user,
                  false
                );
                if (!isMounted) return;
                setCustomer(customerData);
              }

              setIsLoading(false);
              return; // Early return to skip loading plans
            } catch (profileError) {
              console.error("Error updating user profile:", profileError);
              // Continue without failing - user will still have access to their subscription
            }
          } else {
            console.log("❌ No active subscription found, loading plans");
            setCurrentSubscription(null);

            // If we're coming back from checkout but still have no subscription,
            // we might need to wait for webhook processing
            if (shouldRefresh) {
              console.log(
                "⚠️ No subscription after checkout - webhooks might still be processing"
              );
            }
          }
        }

        // Only load plans if user doesn't have a subscription
        // Fetch subscription plans
        const availablePlans = await paymentService.getSubscriptionPlans(
          shouldRefresh
        );
        if (!isMounted) return;
        setPlans(availablePlans);

        if (availablePlans.length > 0) {
          setSelectedPlan(getBestValuePlan(availablePlans));
        }

        // Get or create customer only if user doesn't have a subscription
        if (user && user.uid) {
          const customerData = await paymentService.getOrCreateCustomer(
            user,
            shouldRefresh
          );
          if (!isMounted) return;
          setCustomer(customerData);
        }

        setIsLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error("Error loading subscription data:", error);
        setError("Unable to load subscription data. Please try again later.");
        setIsLoading(false);
      }
    };

    loadData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user, navigate, authLoading, getBestValuePlan, shouldRefresh]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !user || !user.email || !user.uid) {
      setError("Unable to process subscription. Please sign in again.");
      return;
    }

    try {
      setIsCreatingCheckout(true);
      setError(null);
      const { url } = await paymentService.createCheckout(
        selectedPlan.id,
        user.email,
        user.uid
      );

      // Use LemonSqueezy checkout if available
      await paymentService.checkoutWithLemonSqueezy(url);
    } catch (error) {
      console.error("Error creating checkout:", error);
      setError("Failed to create checkout session. Please try again.");
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!customer) {
      setError("Customer information not available. Please try again.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const { url } = await paymentService.createCustomerPortalUrl(customer.id);
      window.location.href = url;
    } catch (error) {
      console.error("Error creating customer portal URL:", error);
      setError("Failed to open subscription management. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render a loading state while authentication is in progress
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mt-12 flex justify-center flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-300">
              Verifying your account...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Render error message
  const renderError = () => {
    if (!error) return null;

    return (
      <div className="mt-6 max-w-3xl mx-auto bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render loading spinner
  const renderLoading = () => {
    return (
      <div className="mt-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  };

  // Render current subscription
  const renderCurrentSubscription = () => {
    if (!currentSubscription) return null;

    // Format the date safely, handling both Date objects and strings
    let formattedDate = "Unknown";
    try {
      if (currentSubscription.current_period_end instanceof Date) {
        formattedDate =
          currentSubscription.current_period_end.toLocaleDateString();
      } else if (typeof currentSubscription.current_period_end === "string") {
        formattedDate = new Date(
          currentSubscription.current_period_end
        ).toLocaleDateString();
      } else {
        console.warn(
          "Unexpected date format:",
          currentSubscription.current_period_end
        );
      }
    } catch (error) {
      console.error("Error formatting date:", error);
    }

    return (
      <div className="mt-12 max-w-3xl mx-auto bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg overflow-hidden">
        <div className="bg-green-500 p-6 text-white">
          <h2 className="text-2xl font-bold">Active Subscription</h2>
          <p className="mt-1">You already have an active subscription</p>
        </div>
        <div className="p-6">
          <p className="mb-4">
            Your subscription is active until {formattedDate}
          </p>
          <button
            onClick={handleManageSubscription}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Manage Subscription
          </button>
        </div>
      </div>
    );
  };

  // Render pending subscription message after checkout
  const renderPendingSubscription = () => {
    if (!isPostCheckout) return null;

    return (
      <div className="mt-12 max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg overflow-hidden">
        <div className="bg-blue-500 p-6 text-white">
          <h2 className="text-2xl font-bold">Processing Your Subscription</h2>
          <p className="mt-1">
            Your payment was successful! We're setting up your subscription.
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p>
              Our systems are currently processing your subscription. This may
              take a few moments.
            </p>
          </div>
          <p className="mb-4 text-sm">
            If your subscription doesn't appear within the next few minutes,
            please refresh the page or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  };

  // Render plan card
  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isSelected = selectedPlan && selectedPlan.id === plan.id;
    const cardClassName = `relative rounded-lg border ${
      isSelected
        ? "border-primary-500 ring-2 ring-primary-500"
        : "border-gray-300 dark:border-gray-700"
    } bg-white dark:bg-slate-800 shadow-sm flex flex-col overflow-hidden`;

    const buttonClassName = `w-full ${
      isSelected
        ? "bg-primary-600 text-white hover:bg-primary-700"
        : "bg-white text-primary-600 border border-primary-600 hover:bg-gray-50"
    } py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`;

    return (
      <div key={plan.id} className={cardClassName}>
        <div className="p-6 flex-grow">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {plan.name}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {plan.description}
          </p>
          <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            ${(plan.price / 100).toFixed(0)}
            <span className="text-base font-medium text-gray-500 dark:text-gray-400">
              /{plan.interval}
            </span>
          </p>
          {plan.hasFreeTrial && plan.trialDays > 0 && (
            <p className="mt-1 text-sm text-green-600 dark:text-green-400">
              Includes {plan.trialDays}-day free trial
            </p>
          )}
          <ul className="mt-6 space-y-4">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                  {feature}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-slate-700">
          <button
            onClick={() => handleSelectPlan(plan)}
            className={buttonClassName}
          >
            {isSelected ? "Selected" : "Select"}
          </button>
        </div>
      </div>
    );
  };

  // Render plan list
  const renderPlans = () => {
    if (plans.length === 0) {
      return (
        <div className="mt-12 max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
          <div className="bg-primary-500 p-6 text-white">
            <h2 className="text-2xl font-bold">No Plans Available</h2>
            <p className="mt-1">We couldn't find any subscription plans.</p>
          </div>
          <div className="p-6">
            <p>
              Please try again later or contact support if the issue persists.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-12 grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {plans.map(renderPlanCard)}
      </div>
    );
  };

  // Render subscribe button
  const renderSubscribeButton = () => {
    // Don't show the subscribe button if:
    // 1. The user already has a subscription
    // 2. The page is in loading state
    // 3. We're in post-checkout state
    if (currentSubscription || isLoading || isPostCheckout) return null;

    return (
      <div className="mt-8 text-center">
        <button
          onClick={handleSubscribe}
          disabled={isCreatingCheckout || !selectedPlan}
          className={`px-6 py-3 rounded-md text-white ${
            isCreatingCheckout
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          }`}
        >
          {isCreatingCheckout ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Subscribe Now"
          )}
        </button>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Dashboard button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-slate-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Conditional page header */}
        {isLoading ? (
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Checking Subscription
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Please wait while we verify your subscription status...
            </p>
          </div>
        ) : currentSubscription ? (
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Subscription Status
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Manage your active subscription below
            </p>
          </div>
        ) : isPostCheckout ? (
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Processing Subscription
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Your subscription is being processed
            </p>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Choose Your Plan
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Select the subscription plan that works best for you
            </p>
          </div>
        )}

        {renderError()}

        {isLoading
          ? renderLoading()
          : currentSubscription
          ? renderCurrentSubscription()
          : isPostCheckout
          ? renderPendingSubscription()
          : renderPlans()}

        {!isPostCheckout && renderSubscribeButton()}
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
