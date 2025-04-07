import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts';
import useSubscription from '../hooks/useSubscription';
import { User } from '../services/paymentService';

// Mock DashboardLayout component until the real one is available
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="dashboard-layout">{children}</div>
);

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  // Access auth context and explicitly type the user
  const auth = useAuth();
  const user = auth?.currentUser as User | undefined;
  const navigate = useNavigate();
  const { refreshSubscription, isSubscriptionActive, isSubscriptionLoading } = useSubscription();

  // Get the reference from URL parameters (sent by LemonSqueezy)
  const reference = searchParams.get('reference');

  useEffect(() => {
    // If there's no user or reference, redirect to dashboard
    if (!user) {
      navigate('/login');
      return;
    }

    if (!reference) {
      navigate('/dashboard');
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
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-green-100 p-4">
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
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Thank You For Your Subscription!
          </h1>

          {isSubscriptionLoading ? (
            <div className="mt-6">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Verifying your subscription...
              </p>
            </div>
          ) : isSubscriptionActive ? (
            <>
              <p className="mb-8 text-xl text-gray-500 dark:text-gray-400">
                Your subscription has been successfully activated. You now have full access to all
                features.
              </p>
              <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">
                Order Reference: <span className="font-mono font-medium">{reference}</span>
              </p>
              <div className="mt-6 space-x-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/subscription"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Manage Subscription
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="mb-8 text-xl text-gray-500 dark:text-gray-400">
                We've received your payment, but there might be a slight delay in activating your
                subscription.
              </p>
              <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">
                If your subscription doesn't activate within a few minutes, please contact our
                support team.
              </p>
              <div className="mt-6 space-x-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={refreshSubscription}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
