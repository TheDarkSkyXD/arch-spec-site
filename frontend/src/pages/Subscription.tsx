import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts";
import paymentService, {
  SubscriptionPlan,
  Customer,
  Subscription,
  User,
} from "../services/paymentService";

// Mock DashboardLayout component until the real one is available
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="dashboard-layout">{children}</div>;

const SubscriptionPage = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
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
      } catch (error) {
        if (!isMounted) return;
        console.error("Error loading subscription data:", error);
        setError("Failed to load subscription data. Please try again later.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user, navigate, authLoading]);

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

  // This function is now used in the JSX to display plan details
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

        {error && (
          <div className="mt-6 bg-red-50 border border-red-100 text-red-700 p-4 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="mt-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : currentSubscription &&
          ["active", "on_trial"].includes(currentSubscription.status) ? (
          <div className="mt-12 max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow rounded-lg p-8 text-center">
            <div className="inline-flex items-center justify-center p-2 rounded-full bg-green-100 text-green-600 mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {currentSubscription.status === "on_trial"
                ? "Trial Active"
                : "Subscription Active"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {currentSubscription.status === "on_trial"
                ? "You are currently on a free trial."
                : "Thank you for your subscription!"}
              <br />
              Your subscription is active until{" "}
              {new Date(
                currentSubscription.currentPeriodEnd
              ).toLocaleDateString()}
              .
            </p>
            <button
              onClick={handleManageSubscription}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Manage Subscription"}
            </button>
          </div>
        ) : (
          <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-8 bg-white dark:bg-slate-700 border-2 rounded-2xl shadow-sm flex flex-col ${
                  selectedPlan?.id === plan.id
                    ? "border-primary-500 ring-2 ring-primary-500"
                    : "border-gray-200 dark:border-gray-600"
                }`}
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                    <span className="text-5xl font-extrabold tracking-tight">
                      ${(plan.price / 100).toFixed(0)}
                    </span>
                    <span className="ml-1 text-xl font-semibold">
                      /{plan.interval}
                    </span>
                  </p>
                  <p className="mt-6 text-gray-500 dark:text-gray-300">
                    {plan.description}
                  </p>
                  {/* Now using the formatPlanDescription function to display additional info */}
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {formatPlanDescription(plan)}
                  </p>

                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-6 w-6 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700 dark:text-gray-300">
                          {feature}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                    selectedPlan?.id === plan.id
                      ? "bg-primary-600 text-white hover:bg-primary-700"
                      : "bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                  }`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {selectedPlan?.id === plan.id ? "Selected" : "Select Plan"}
                </button>
              </div>
            ))}
          </div>
        )}

        {!currentSubscription && selectedPlan && (
          <div className="mt-8 text-center">
            <button
              onClick={handleSubscribe}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isCreatingCheckout}
            >
              {isCreatingCheckout ? (
                <>
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
                </>
              ) : (
                "Subscribe Now"
              )}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
