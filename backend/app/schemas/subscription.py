from datetime import datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class CustomerCreate(BaseModel):
    email: str
    name: str
    user_id: str


class Customer(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime


class SubscriptionPlan(BaseModel):
    id: str
    name: str
    price: int  # Price in cents
    interval: str  # 'month' or 'year'
    interval_count: int
    has_free_trial: bool
    trial_days: int
    description: str
    features: List[str]
    plan_type: Literal["free", "premium", "open_source"] = "free"
    ai_credits: int = 0  # Number of AI credits included in this plan


class Subscription(BaseModel):
    id: str
    status: str  # 'active', 'past_due', 'canceled', 'expired', 'on_trial'
    current_period_end: datetime
    plan_id: str
    customer_id: str
    plan_type: Literal["free", "premium", "open_source"] = "free"
    ai_credits_reset_value: int = 0  # How many credits the user gets when subscription renews
    ai_credits_current: int = 0  # Current available credits
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class CheckoutCreate(BaseModel):
    plan_id: str
    email: str
    user_id: str


class CheckoutResponse(BaseModel):
    url: str


class CustomerPortalRequest(BaseModel):
    customer_id: str


class CustomerPortalResponse(BaseModel):
    url: str


class WebhookEvent(BaseModel):
    event_name: str = Field(..., alias="meta.event_name")
    data: dict


class LemonSqueezyWebhookSubscriptionCreated(BaseModel):
    id: str
    attributes: dict


class LemonSqueezyWebhookSubscriptionUpdated(BaseModel):
    id: str
    attributes: dict


class LemonSqueezyWebhookSubscriptionCancelled(BaseModel):
    id: str
    attributes: dict


class LemonSqueezyWebhookOrderCreated(BaseModel):
    id: str
    attributes: dict
