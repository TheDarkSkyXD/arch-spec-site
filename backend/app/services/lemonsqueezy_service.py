import httpx
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any, Union

from app.core.config import settings
from app.schemas.subscription import Customer, Subscription, SubscriptionPlan

logger = logging.getLogger(__name__)


class LemonSqueezyService:
    """Service for interacting with the LemonSqueezy API"""

    def __init__(self):
        self.api_key = settings.LEMONSQUEEZY_API_KEY
        self.store_id = settings.LEMONSQUEEZY_STORE_ID
        self.base_url = "https://api.lemonsqueezy.com/v1"
        self.headers = {
            "Accept": "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
            "Authorization": f"Bearer {self.api_key}"
        }

    async def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make a request to the LemonSqueezy API"""
        url = f"{self.base_url}/{endpoint}"
        
        async with httpx.AsyncClient() as client:
            try:
                if method.lower() == "get":
                    response = await client.get(url, headers=self.headers)
                elif method.lower() == "post":
                    response = await client.post(url, headers=self.headers, json=data)
                elif method.lower() == "delete":
                    response = await client.delete(url, headers=self.headers)
                else:
                    raise ValueError(f"Unsupported HTTP method: {method}")
                
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.error(f"HTTP error occurred: {e} for {method} {url}")
                raise
            except Exception as e:
                logger.error(f"Error occurred: {e} for {method} {url}")
                raise

    async def get_subscription_plans(self) -> List[SubscriptionPlan]:
        """Get all subscription plans"""
        try:
            response = await self._make_request("get", f"products?filter[store_id]={self.store_id}&include=variants")
            
            plans = []
            
            # Process products and their variants
            if "data" in response:
                for product in response["data"]:
                    # Find product variants in included data
                    variants = [item for item in response.get("included", []) if item["type"] == "variants"]
                    
                    for variant in variants:
                        if variant["relationships"]["product"]["data"]["id"] == product["id"]:
                            attr = variant["attributes"]
                            
                            # Create subscription plan object
                            plan = SubscriptionPlan(
                                id=variant["id"],
                                name=attr.get("name", ""),
                                price=int(float(attr.get("price", 0)) * 100),  # Convert to cents
                                interval=attr.get("subscription_interval", "month"),
                                interval_count=attr.get("subscription_interval_count", 1),
                                has_free_trial=attr.get("has_free_trial", False),
                                trial_days=attr.get("trial_interval_count", 0),
                                description=product["attributes"].get("description", ""),
                                features=[
                                    feature.strip() 
                                    for feature in product["attributes"].get("features", "").split("\n") 
                                    if feature.strip()
                                ]
                            )
                            plans.append(plan)
            
            return plans
        except Exception as e:
            logger.error(f"Error getting subscription plans: {e}")
            raise

    async def create_customer(self, email: str, name: str) -> Customer:
        """Create a new customer in LemonSqueezy"""
        try:
            data = {
                "data": {
                    "type": "customers",
                    "attributes": {
                        "name": name,
                        "email": email,
                        "status": "active"
                    },
                    "relationships": {
                        "store": {
                            "data": {
                                "type": "stores",
                                "id": self.store_id
                            }
                        }
                    }
                }
            }
            
            response = await self._make_request("post", "customers", data)
            
            if "data" in response:
                customer_data = response["data"]
                attributes = customer_data["attributes"]
                
                return Customer(
                    id=customer_data["id"],
                    name=attributes["name"],
                    email=attributes["email"],
                    created_at=datetime.fromisoformat(attributes["created_at"].replace("Z", "+00:00"))
                )
            else:
                raise ValueError("Invalid response from LemonSqueezy API")
        except Exception as e:
            logger.error(f"Error creating customer: {e}")
            raise

    async def get_customer_by_email(self, email: str) -> Optional[Customer]:
        """Get a customer by email"""
        try:
            # LemonSqueezy API doesn't support filtering by email, so we need to get all customers
            # and filter in our code
            response = await self._make_request("get", f"customers?filter[store_id]={self.store_id}")
            
            if "data" in response:
                for customer in response["data"]:
                    if customer["attributes"]["email"].lower() == email.lower():
                        attributes = customer["attributes"]
                        
                        return Customer(
                            id=customer["id"],
                            name=attributes["name"],
                            email=attributes["email"],
                            created_at=datetime.fromisoformat(attributes["created_at"].replace("Z", "+00:00"))
                        )
            
            return None
        except Exception as e:
            logger.error(f"Error getting customer by email: {e}")
            raise

    async def create_checkout(self, variant_id: str, customer_email: str, user_id: str) -> str:
        """Create a checkout URL for a subscription"""
        try:
            # Define checkout options
            data = {
                "data": {
                    "type": "checkouts",
                    "attributes": {
                        "custom_price": None,  # Use variant's price
                        "product_options": {
                            "name": "enabled",
                            "billing_address": "enabled",
                            "tax_id_collection": "disabled"
                        },
                        "checkout_data": {
                            "email": customer_email,
                            "custom": {
                                "user_id": user_id
                            }
                        },
                        "checkout_options": {
                            "embed": True,
                            "media": True,
                            "logo": True,
                            "dark": False,
                            "desc": True,
                            "discount": True
                        },
                        "expires_at": None,  # Doesn't expire
                        "success_url": f"{settings.FRONTEND_URL}/checkout/success?reference={{order_id}}",
                        "cancel_url": f"{settings.FRONTEND_URL}/subscription"
                    },
                    "relationships": {
                        "store": {
                            "data": {
                                "type": "stores",
                                "id": self.store_id
                            }
                        },
                        "variant": {
                            "data": {
                                "type": "variants",
                                "id": variant_id
                            }
                        }
                    }
                }
            }
            
            response = await self._make_request("post", "checkouts", data)
            
            if "data" in response and "attributes" in response["data"]:
                return response["data"]["attributes"]["url"]
            else:
                raise ValueError("Invalid response from LemonSqueezy API")
        except Exception as e:
            logger.error(f"Error creating checkout: {e}")
            raise

    async def get_customer_subscriptions(self, customer_id: str) -> List[Subscription]:
        """Get all subscriptions for a customer"""
        try:
            response = await self._make_request("get", f"subscriptions?filter[customer_id]={customer_id}")
            
            subscriptions = []
            
            if "data" in response:
                for sub in response["data"]:
                    attributes = sub["attributes"]
                    
                    subscription = Subscription(
                        id=sub["id"],
                        status=attributes["status"],
                        current_period_end=datetime.fromisoformat(attributes["renews_at"].replace("Z", "+00:00")) if attributes["renews_at"] else datetime.now(),
                        plan_id=sub["relationships"]["variant"]["data"]["id"],
                        customer_id=customer_id
                    )
                    subscriptions.append(subscription)
            
            return subscriptions
        except Exception as e:
            logger.error(f"Error getting customer subscriptions: {e}")
            raise

    async def create_customer_portal(self, customer_id: str) -> str:
        """Create a customer portal URL"""
        try:
            data = {
                "data": {
                    "type": "customer-portals",
                    "attributes": {
                        "return_url": f"{settings.FRONTEND_URL}/subscription"
                    },
                    "relationships": {
                        "store": {
                            "data": {
                                "type": "stores",
                                "id": self.store_id
                            }
                        },
                        "customer": {
                            "data": {
                                "type": "customers",
                                "id": customer_id
                            }
                        }
                    }
                }
            }
            
            response = await self._make_request("post", "customer-portals", data)
            
            if "data" in response and "attributes" in response["data"]:
                return response["data"]["attributes"]["url"]
            else:
                raise ValueError("Invalid response from LemonSqueezy API")
        except Exception as e:
            logger.error(f"Error creating customer portal: {e}")
            raise


# Create a singleton instance
lemonsqueezy_service = LemonSqueezyService() 