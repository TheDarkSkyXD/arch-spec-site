import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts";
import useSubscription from "../hooks/useSubscription";
import { User } from "../services/paymentService";

// Mock DashboardLayout component until the real one is available
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="dashboard-layout">{children}</div>;

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  // Access auth context and explicitly type the user
  const auth = useAuth();
  const user = auth?.currentUser as User | undefined;
  const navigate = useNavigate();
  const { refreshSubscription, isSubscriptionActive, isSubscriptionLoading } =
    useSubscription();

  // Get the reference from URL parameters (sent by LemonSqueezy)
  const reference = searchParams.get("reference");

  useEffect(() => {
    // If there's no user or reference, redirect to dashboard
    if (!user) {
      navigate("/login");
      return;
    }

    if (!reference) {
      navigate("/dashboard");
      return;
    }

    // Refresh subscription status
    const handleSubscriptionRefresh = async () => {
      await refreshSubscription();
    };

    handleSubscriptionRefresh();
  }, [user, reference, navigate, refreshSubscription]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6">
            <svg
              className="h-12 w-12 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl mb-4">
            Thank You For Your Subscription!
          </h1>

          {isSubscriptionLoading ? (
            <div className="mt-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Verifying your subscription...
              </p>
            </div>
          ) : isSubscriptionActive ? (
            <>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">
                Your subscription has been successfully activated. You now have
                full access to all features.
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                Order Reference:{" "}
                <span className="font-mono font-medium">{reference}</span>
              </p>
              <div className="mt-6 space-x-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/subscription"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Manage Subscription
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">
                We've received your payment, but there might be a slight delay
                in activating your subscription.
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                If your subscription doesn't activate within a few minutes,
                please contact our support team.
              </p>
              <div className="mt-6 space-x-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={refreshSubscription}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Refresh Status
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckoutSuccess;
