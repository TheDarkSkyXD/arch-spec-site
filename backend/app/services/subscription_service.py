import logging
from typing import List, Optional, Dict, Any

from app.services.lemonsqueezy_service import lemonsqueezy_service
from app.schemas.subscription import (
    Customer, Subscription, SubscriptionPlan, 
    CheckoutResponse, CustomerPortalResponse
)

logger = logging.getLogger(__name__)


class SubscriptionService:
    """Service for handling subscriptions"""

    async def get_plans(self) -> List[SubscriptionPlan]:
        """Get all available subscription plans"""
        try:
            return await lemonsqueezy_service.get_subscription_plans()
        except Exception as e:
            logger.error(f"Error getting subscription plans: {e}")
            raise

    async def get_or_create_customer(self, email: str, name: str) -> Customer:
        """Get an existing customer or create a new one"""
        try:
            # Try to get existing customer
            customer = await lemonsqueezy_service.get_customer_by_email(email)
            
            # If customer doesn't exist, create a new one
            if not customer:
                customer = await lemonsqueezy_service.create_customer(email, name)
                
            return customer
        except Exception as e:
            logger.error(f"Error getting or creating customer: {e}")
            raise

    async def get_current_subscription(self, email: str) -> Optional[Subscription]:
        """Get the current active subscription for a user"""
        try:
            # Get customer
            customer = await lemonsqueezy_service.get_customer_by_email(email)
            
            if not customer:
                return None
                
            # Get subscriptions for customer
            subscriptions = await lemonsqueezy_service.get_customer_subscriptions(customer.id)
            
            # Find active subscription
            active_subscription = next(
                (sub for sub in subscriptions if sub.status in ['active', 'on_trial']), 
                None
            )
            
            return active_subscription
        except Exception as e:
            logger.error(f"Error getting current subscription: {e}")
            raise

    async def create_checkout(
        self, plan_id: str, email: str, user_id: str
    ) -> CheckoutResponse:
        """Create a checkout URL for a subscription"""
        try:
            checkout_url = await lemonsqueezy_service.create_checkout(plan_id, email, user_id)
            return CheckoutResponse(url=checkout_url)
        except Exception as e:
            logger.error(f"Error creating checkout: {e}")
            raise

    async def create_customer_portal(self, customer_id: str) -> CustomerPortalResponse:
        """Create a customer portal URL"""
        try:
            portal_url = await lemonsqueezy_service.create_customer_portal(customer_id)
            return CustomerPortalResponse(url=portal_url)
        except Exception as e:
            logger.error(f"Error creating customer portal: {e}")
            raise

    async def process_subscription_created(self, data: Dict[str, Any]) -> None:
        """Process a subscription_created webhook event"""
        try:
            logger.info(f"Processing subscription_created event: {data}")
            # Implement any business logic needed when a subscription is created
            # For example, you could store subscription information in your database
            # or grant access to premium features
        except Exception as e:
            logger.error(f"Error processing subscription_created event: {e}")
            raise

    async def process_subscription_updated(self, data: Dict[str, Any]) -> None:
        """Process a subscription_updated webhook event"""
        try:
            logger.info(f"Processing subscription_updated event: {data}")
            # Implement any business logic needed when a subscription is updated
            # For example, you could update subscription information in your database
        except Exception as e:
            logger.error(f"Error processing subscription_updated event: {e}")
            raise

    async def process_subscription_cancelled(self, data: Dict[str, Any]) -> None:
        """Process a subscription_cancelled webhook event"""
        try:
            logger.info(f"Processing subscription_cancelled event: {data}")
            # Implement any business logic needed when a subscription is cancelled
            # For example, you could revoke access to premium features
        except Exception as e:
            logger.error(f"Error processing subscription_cancelled event: {e}")
            raise

    async def process_order_created(self, data: Dict[str, Any]) -> None:
        """Process an order_created webhook event"""
        try:
            logger.info(f"Processing order_created event: {data}")
            # Implement any business logic needed when an order is created
            # For example, you could send a welcome email or trigger an onboarding process
        except Exception as e:
            logger.error(f"Error processing order_created event: {e}")
            raise


# Create a singleton instance
subscription_service = SubscriptionService() 