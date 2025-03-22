import logging
import hmac
import hashlib
import json
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Header
from fastapi.responses import JSONResponse

from app.services.subscription_service import subscription_service
from app.schemas.subscription import (
    CustomerCreate, Customer, Subscription, SubscriptionPlan,
    CheckoutCreate, CheckoutResponse, CustomerPortalRequest, CustomerPortalResponse,
    WebhookEvent
)
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/plans", response_model=List[SubscriptionPlan])
async def get_subscription_plans():
    """Get all available subscription plans"""
    try:
        return await subscription_service.get_plans()
    except Exception as e:
        logger.error(f"Error getting subscription plans: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve subscription plans")


@router.post("/customers", response_model=Customer)
async def create_customer(customer: CustomerCreate):
    """Create a new customer or get an existing one"""
    try:
        return await subscription_service.get_or_create_customer(
            email=customer.email,
            name=customer.name,
            user_id=customer.user_id
        )
    except Exception as e:
        logger.error(f"Error creating customer: {e}")
        raise HTTPException(status_code=500, detail="Failed to create customer")


@router.get("/subscriptions/current", response_model=Optional[Subscription])
async def get_current_subscription(email: str):
    """Get the current active subscription for a user"""
    try:
        return await subscription_service.get_current_subscription(email)
    except Exception as e:
        logger.error(f"Error getting current subscription: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve subscription")


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(checkout: CheckoutCreate):
    """Create a checkout URL for a subscription"""
    try:
        return await subscription_service.create_checkout(
            plan_id=checkout.plan_id,
            email=checkout.email,
            user_id=checkout.user_id
        )
    except Exception as e:
        logger.error(f"Error creating checkout: {e}")
        raise HTTPException(status_code=500, detail="Failed to create checkout")


@router.post("/customer-portal", response_model=CustomerPortalResponse)
async def create_customer_portal(portal: CustomerPortalRequest):
    """Create a customer portal URL"""
    try:
        return await subscription_service.create_customer_portal(portal.customer_id)
    except Exception as e:
        logger.error(f"Error creating customer portal: {e}")
        raise HTTPException(status_code=500, detail="Failed to create customer portal")


@router.post("/webhooks/lemonsqueezy")
async def lemonsqueezy_webhook(
    request: Request,
    x_signature: str = Header(None)
):
    """Handle LemonSqueezy webhooks"""
    try:
        # Get raw request body
        body = await request.body()
        body_str = body.decode('utf-8')
        
        # Verify webhook signature
        if not verify_lemonsqueezy_signature(body_str, x_signature):
            raise HTTPException(status_code=401, detail="Invalid webhook signature")
        
        # Parse request body
        try:
            body_json = json.loads(body_str)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON body")
        
        # Get event name from meta
        event_name = body_json.get("meta", {}).get("event_name")
        if not event_name:
            raise HTTPException(status_code=400, detail="Missing event name")
        
        # Process webhook based on event type
        if event_name == "subscription_created":
            await subscription_service.process_subscription_created(body_json)
        elif event_name == "subscription_updated":
            await subscription_service.process_subscription_updated(body_json)
        elif event_name == "subscription_cancelled":
            await subscription_service.process_subscription_cancelled(body_json)
        elif event_name == "order_created":
            await subscription_service.process_order_created(body_json)
        elif event_name == "subscription_payment_success":
            await subscription_service.process_subscription_payment_success(body_json)
        else:
            # Log other event types but don't process them
            logger.info(f"Received unhandled webhook event: {event_name}")
        
        return JSONResponse(content={"status": "success"})
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing webhook: {e}")
        raise HTTPException(status_code=500, detail="Failed to process webhook")


def verify_lemonsqueezy_signature(payload: str, signature: Optional[str]) -> bool:
    """Verify the LemonSqueezy webhook signature"""
    if not signature or not settings.LEMONSQUEEZY_WEBHOOK_SECRET:
        return False
    
    # Create HMAC SHA256 signature using webhook secret
    expected_signature = hmac.new(
        settings.LEMONSQUEEZY_WEBHOOK_SECRET.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    # Compare signatures
    return hmac.compare_digest(expected_signature, signature) 