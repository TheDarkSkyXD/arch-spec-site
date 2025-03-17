import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts";
import { User } from "../services/paymentService";

// Mock DashboardLayout component until the real one is available
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="dashboard-layout">{children}</div>;

const SubscriptionPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get auth context with proper typing
  const { currentUser, loading: authLoading } = useAuth();
  // Safely cast currentUser to User type
  const user = currentUser as User | null | undefined;

  const navigate = useNavigate();

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

        // Since payment integration is not yet complete, we'll simulate loading and then
        // show a message instead of attempting to load real data that would result in errors
        setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }, 800); // Short delay to simulate loading for better UX

        // Comment out the actual data loading for now
        /*
        // Fetch subscription plans
        const availablePlans = await paymentService.getSubscriptionPlans();
        if (!isMounted) return;
        setPlans(availablePlans);

        if (availablePlans.length > 0) {
          setSelectedPlan(getBestValuePlan(availablePlans));
        }

        // Only proceed with user-specific operations if we have a user
        if (user && user.uid) {
          // Get or create customer
          const customerData = await paymentService.getOrCreateCustomer(user);
          if (!isMounted) return;
          setCustomer(customerData);

          // Get current subscription if any
          if (user.email) {
            const subscription = await paymentService.getCurrentSubscription(
              user.email
            );
            if (!isMounted) return;
            setCurrentSubscription(subscription);
          }
        }
        */
      } catch (error) {
        if (!isMounted) return;
        console.error("Error loading subscription data:", error);
        setIsLoading(false);
      }
    };

    loadData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user, navigate, authLoading]);

  // Unused functions - commented out to avoid linter errors
  /*
  const getBestValuePlan = (
    availablePlans: SubscriptionPlan[]
  ): SubscriptionPlan => {
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
  };

  const getPricePerMonth = (plan: SubscriptionPlan): number => {
    let pricePerMonth = plan.price / plan.intervalCount;
    if (plan.interval === "year") {
      pricePerMonth /= 12;
    }
    return pricePerMonth;
  };

  const formatPlanDescription = (plan: SubscriptionPlan): string => {
    const pricePerMonth = plan.price / 100 / plan.intervalCount;
    const formattedPrice = `$${pricePerMonth.toFixed(0)}/${plan.interval}`;
    const trialText =
      plan.hasFreeTrial && plan.trialDays > 0
        ? ` after ${plan.trialDays}-day trial`
        : "";
    return `${formattedPrice}${trialText}`;
  };

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

      // Redirect to checkout page
      window.location.href = url;
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
  */

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

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
            Select the plan that works best for you and your projects
          </p>
        </div>

        {isLoading ? (
          <div className="mt-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="mt-12 max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow rounded-lg overflow-hidden">
            <div className="bg-primary-500 p-6 text-white">
              <h2 className="text-2xl font-bold">
                Payment System in Development
              </h2>
            </div>
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    We're Almost There!
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Our automated payment system is currently under development.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900 p-5 rounded-lg border-l-4 border-blue-500">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      If you'd like to activate a premium subscription, please
                      contact our support team at{" "}
                      <a
                        href="mailto:mamerto@codefrost.com"
                        className="font-medium underline"
                      >
                        mamerto@codefrost.com
                      </a>
                      . We'll set up your subscription manually.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center">
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
                  <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                    AI-powered project architecture generation
                  </p>
                </div>
                <div className="flex items-center">
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
                  <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                    Advanced AI enhancements for your projects
                  </p>
                </div>
                <div className="flex items-center">
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
                  <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                    Priority support and unlimited projects
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <a
                  href="mailto:mamerto@codefrost.com?subject=Subscription%20Activation&body=Hi%20there%2C%0A%0AI'd%20like%20to%20activate%20a%20premium%20subscription.%0A%0AMy%20account%20email%20is%3A%20"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Contact Support to Subscribe
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
