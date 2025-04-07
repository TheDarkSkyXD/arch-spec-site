import { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import { userApi } from '../api/userApi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import ProfileLayout from '../layouts/ProfileLayout';
import { Crown, Sparkles, CreditCard, Info } from 'lucide-react';

type SubscriptionPlanType = 'free' | 'premium' | 'open_source';

const SubscriptionPlan = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<{
    plan: SubscriptionPlanType;
    subscription_id: string | null;
    ai_credits: number;
    ai_credits_used: number;
  }>({
    plan: 'free',
    subscription_id: null,
    ai_credits: 0,
    ai_credits_used: 0,
  });

  useEffect(() => {
    const loadSubscription = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        // Attempt to reload the profile from API
        const profile = await userApi.getCurrentUserProfile();

        // Update subscription data with fresh profile data
        setSubscriptionData({
          plan: profile.plan || 'free',
          subscription_id: profile.subscription_id || null,
          ai_credits: profile.ai_credits || 0,
          ai_credits_used: profile.ai_credits_used || 0,
        });
      } catch (err) {
        console.error('Error loading subscription data:', err);
        setError('Failed to load subscription data. Using cached data if available.');

        // Fallback to cached data in currentUser if available
        if (currentUser?.profile) {
          setSubscriptionData({
            plan: currentUser.profile.plan || 'free',
            subscription_id: currentUser.profile.subscription_id || null,
            ai_credits: currentUser.profile.ai_credits || 0,
            ai_credits_used: currentUser.profile.ai_credits_used || 0,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [currentUser]);

  if (loading) {
    return (
      <ProfileLayout title="Subscription Plan">
        <div className="flex h-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      </ProfileLayout>
    );
  }

  if (!currentUser) {
    return (
      <ProfileLayout title="Subscription Plan">
        <div className="flex h-full flex-col items-center justify-center p-8">
          <div className="mb-4 text-red-500">You must be signed in to view your subscription</div>
          <Button href="/login">Sign In</Button>
        </div>
      </ProfileLayout>
    );
  }

  const getPlanBadge = (plan: SubscriptionPlanType) => {
    switch (plan) {
      case 'premium':
        return (
          <div className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Crown size={14} className="mr-1" />
            Premium
          </div>
        );
      case 'open_source':
        return (
          <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            <Sparkles size={14} className="mr-1" />
            Open Source
          </div>
        );
      case 'free':
      default:
        return (
          <div className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            Free
          </div>
        );
    }
  };

  return (
    <ProfileLayout title="Subscription Plan">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Subscription Information</h1>

        {error && (
          <div className="mb-6 rounded-md border border-red-100 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Current Plan Card */}
          <Card>
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Current Plan</h2>
                <div>{getPlanBadge(subscriptionData.plan)}</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CreditCard className="mr-2 h-5 w-5 text-blue-500" />
                  <div>
                    <span className="font-medium">Subscription ID: </span>
                    <span className="text-gray-500">
                      {subscriptionData.subscription_id || 'Not subscribed'}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    AI Credits
                  </div>
                  <div className="flex items-center">
                    <div
                      className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={subscriptionData.ai_credits}
                      aria-valuenow={Math.max(
                        0,
                        subscriptionData.ai_credits - subscriptionData.ai_credits_used
                      )}
                      title={`${Math.max(
                        0,
                        subscriptionData.ai_credits - subscriptionData.ai_credits_used
                      )} credits remaining`}
                    >
                      {/* Progress bar background shading */}
                      <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 opacity-20"></div>

                      {/* Active progress bar */}
                      <div
                        className="relative h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 ease-out"
                        style={{
                          width: `${
                            subscriptionData.ai_credits > 0
                              ? Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    100 *
                                      (1 -
                                        subscriptionData.ai_credits_used /
                                          subscriptionData.ai_credits)
                                  )
                                ).toFixed(0)
                              : 0
                          }%`,
                        }}
                      >
                        {/* Pulse effect for low credits */}
                        {subscriptionData.ai_credits > 0 &&
                          (subscriptionData.ai_credits - subscriptionData.ai_credits_used) /
                            subscriptionData.ai_credits <
                            0.2 &&
                          subscriptionData.ai_credits - subscriptionData.ai_credits_used > 0 && (
                            <div className="absolute inset-0 animate-pulse rounded-full bg-red-500 opacity-30"></div>
                          )}
                      </div>
                    </div>
                    <div className="ml-3 min-w-[85px] whitespace-nowrap text-sm text-gray-500">
                      <span className="font-bold text-blue-600">
                        {Math.max(
                          0,
                          subscriptionData.ai_credits - subscriptionData.ai_credits_used
                        )}
                      </span>{' '}
                      remaining
                    </div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>{subscriptionData.ai_credits_used} credits used</span>
                    <span>{subscriptionData.ai_credits} total</span>
                  </div>

                  <div className="mt-3 rounded-md bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                    <h3 className="mb-1 flex items-center font-medium">
                      <Info size={14} className="mr-1" />
                      About AI Credits
                    </h3>
                    <p className="mb-2 text-xs">
                      AI credits are used when you generate or enhance content with AI features.
                    </p>
                    {subscriptionData.plan === 'premium' && (
                      <p className="mt-2 text-xs">
                        Credits reset on your billing renewal date each month.
                      </p>
                    )}
                    {subscriptionData.plan === 'free' && (
                      <p className="mt-2 text-xs">
                        Upgrade to Premium for monthly credit allowance.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 text-sm">
                  {subscriptionData.plan === 'free' && (
                    <div className="flex items-start rounded-md bg-blue-50 p-3 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Free Plan</p>
                        <p className="mt-1">
                          Upgrade to Premium to unlock AI-powered features and design tools. Premium
                          users get priority support and unlimited projects.
                        </p>
                        <div className="mt-3">
                          <Button href="/subscription" size="sm" variant="default">
                            Upgrade Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {subscriptionData.plan !== 'free' && (
                    <div className="flex items-start rounded-md bg-green-50 p-3 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Premium Plan</p>
                        <p className="mt-1">
                          You have access to all premium features including AI-powered tools and
                          unlimited projects.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Features Card */}
          <Card>
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Plan Features</h2>
              <ul className="mt-2 space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div>
                    <span className="text-sm font-medium">Generate project architecture</span>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Create comprehensive project structure
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  {subscriptionData.plan === 'premium' ||
                  subscriptionData.plan === 'open_source' ? (
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                  <div>
                    <span className="text-sm font-medium">AI-powered enhancements</span>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Generate descriptions, features, and requirements with AI
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  {subscriptionData.plan === 'premium' ||
                  subscriptionData.plan === 'open_source' ? (
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                  <div>
                    <span className="text-sm font-medium">Advanced tech stack recommendations</span>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Get customized technology recommendations
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  {subscriptionData.plan === 'premium' ? (
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                  <div>
                    <span className="text-sm font-medium">Priority support</span>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Get faster responses to your questions
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  {subscriptionData.plan === 'premium' ? (
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                  <div>
                    <span className="text-sm font-medium">Unlimited projects</span>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Create as many projects as you need
                    </p>
                  </div>
                </li>
              </ul>

              {subscriptionData.plan !== 'premium' && (
                <div className="mt-6 text-center">
                  <Button href="/subscription" variant="default">
                    Upgrade to Premium
                  </Button>
                </div>
              )}

              {subscriptionData.plan === 'premium' && (
                <div className="mt-6 text-center">
                  <Button href="/subscription" variant="outline">
                    Manage Subscription
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default SubscriptionPlan;
