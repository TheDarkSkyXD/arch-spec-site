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
        self.api_key = settings.lemonsqueezy.api_key
        self.store_id = settings.lemonsqueezy.store_id
        self.base_url = "https://api.lemonsqueezy.com/v1"
        self.headers = {
            "Accept": "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
            "Authorization": f"Bearer {self.api_key}",
        }

    async def _make_request(
        self, method: str, endpoint: str, data: Optional[Dict[str, Any]] = None
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
            response = await self._make_request(
                "get", f"products?filter[store_id]={self.store_id}&include=variants"
            )

            # Log simplified version of response instead of the entire object
            logger.info(
                f"Received subscription plans. Products count: {len(response.get('data', []))}, Included items: {len(response.get('included', []))}"
            )

            plans = []

            # Process products and their variants
            if "data" in response:
                for product in response["data"]:
                    product_id = product["id"]
                    product_attrs = product["attributes"]
                    logger.debug(f"Processing product: {product_id} - {product_attrs['name']}")

                    # Extract variant IDs from product relationships
                    variant_ids = []
                    if (
                        "relationships" in product
                        and "variants" in product["relationships"]
                        and "data" in product["relationships"]["variants"]
                    ):
                        variant_ids = [
                            v["id"] for v in product["relationships"]["variants"]["data"]
                        ]
                        logger.debug(f"Product {product_id} has variant IDs: {variant_ids}")

                    # Find product variants in included data
                    variants = []
                    for item in response.get("included", []):
                        if item["type"] == "variants" and item["id"] in variant_ids:
                            variants.append(item)

                    logger.debug(f"Found {len(variants)} variants for product {product_id}")

                    for variant in variants:
                        variant_attrs = variant["attributes"]
                        logger.debug(
                            f"Processing variant: {variant['id']} - is_subscription: {variant_attrs.get('is_subscription', False)}"
                        )

                        # Check if this is a subscription variant
                        if variant_attrs.get("is_subscription", False):
                            # Extract features (default to empty list)
                            features = []

                            # Create a subscription plan object
                            plan = SubscriptionPlan(
                                id=variant["id"],
                                name=product_attrs["name"],
                                description=variant_attrs.get("description", "")
                                or product_attrs.get("description", ""),
                                price=variant_attrs["price"],
                                interval=variant_attrs["interval"],
                                interval_count=variant_attrs["interval_count"],
                                features=features,
                                has_free_trial=variant_attrs.get("has_free_trial", False),
                                trial_days=variant_attrs.get("trial_interval_count", 0),
                                plan_type="premium",
                                ai_credits=300,
                            )
                            plans.append(plan)
                            logger.debug(
                                f"Added subscription plan: {plan.name} - ${plan.price/100} {plan.interval}"
                            )

            logger.info(f"Returning {len(plans)} subscription plans")
            return plans
        except Exception as e:
            logger.error(f"Error getting subscription plans: {e}")
            raise

    async def create_customer(self, email: str, name: str, user_id: str) -> Customer:
        """Create a new customer in LemonSqueezy"""
        try:
            data = {
                "data": {
                    "type": "customers",
                    "attributes": {"name": name, "email": email},
                    "relationships": {"store": {"data": {"type": "stores", "id": self.store_id}}},
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
                    created_at=datetime.fromisoformat(
                        attributes["created_at"].replace("Z", "+00:00")
                    ),
                )

            raise Exception("Invalid response from LemonSqueezy API")
        except Exception as e:
            logger.error(f"Error creating customer: {e}")
            raise

    async def get_customer_by_email(self, email: str) -> Optional[Customer]:
        """Get a customer by email"""
        try:
            # LemonSqueezy API doesn't support filtering by email, so we need to get all customers
            # and filter in our code
            response = await self._make_request(
                "get", f"customers?filter[store_id]={self.store_id}"
            )

            if "data" in response:
                for customer in response["data"]:
                    if customer["attributes"]["email"].lower() == email.lower():
                        attributes = customer["attributes"]

                        return Customer(
                            id=customer["id"],
                            name=attributes["name"],
                            email=attributes["email"],
                            created_at=datetime.fromisoformat(
                                attributes["created_at"].replace("Z", "+00:00")
                            ),
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
                            # Redirect to subscription page which exists in the router
                            "redirect_url": f"{settings.frontend_url}/subscription?refresh=true"
                        },
                        "checkout_data": {"email": customer_email, "custom": {"user_id": user_id}},
                        "checkout_options": {
                            "embed": True,
                            "media": True,
                            "logo": True,
                            "desc": True,
                            "discount": True,
                        },
                        "expires_at": None,  # Doesn't expire
                    },
                    "relationships": {
                        "store": {"data": {"type": "stores", "id": self.store_id}},
                        "variant": {"data": {"type": "variants", "id": variant_id}},
                    },
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
            logger.info(
                f"Getting subscriptions for customer {customer_id} using relationship endpoint"
            )

            # Use the relationship endpoint to get customer's subscriptions
            # According to the LemonSqueezy API docs, this is the proper way to get subscriptions for a customer
            response = await self._make_request("get", f"customers/{customer_id}/subscriptions")

            # Log full response for debugging
            logger.debug(f"Customer subscriptions response: {response}")

            subscriptions = []

            # Check if response contains data key and it's not empty
            if isinstance(response, dict) and "data" in response:
                # Handle both array and object response formats
                data_items = []
                if isinstance(response["data"], list):
                    data_items = response["data"]
                elif isinstance(response["data"], dict):
                    # If it's a single object, wrap it in a list
                    data_items = [response["data"]]

                # Process each subscription
                for sub_data in data_items:
                    try:
                        if "attributes" not in sub_data:
                            logger.warning(f"Missing attributes in subscription data: {sub_data}")
                            continue

                        attributes = sub_data["attributes"]

                        # Safely extract required fields
                        status = attributes.get("status", "unknown")
                        renews_at = attributes.get("renews_at")

                        # Safely get variant ID from relationships
                        variant_id = ""
                        if "relationships" in sub_data and "variant" in sub_data["relationships"]:
                            variant_rel = sub_data["relationships"]["variant"]
                            if "data" in variant_rel and "id" in variant_rel["data"]:
                                variant_id = variant_rel["data"]["id"]

                        subscription = Subscription(
                            id=sub_data["id"],
                            status=status,
                            current_period_end=(
                                datetime.fromisoformat(renews_at.replace("Z", "+00:00"))
                                if renews_at
                                else datetime.now()
                            ),
                            plan_id=variant_id,
                            customer_id=customer_id,
                        )
                        subscriptions.append(subscription)
                    except Exception as sub_error:
                        logger.error(f"Error processing subscription: {sub_error}")
                        # Continue processing other subscriptions

                logger.info(f"Found {len(subscriptions)} subscriptions for customer {customer_id}")
                for index, sub in enumerate(subscriptions):
                    logger.info(f"Subscription {index+1}: ID={sub.id}, Status={sub.status}")

                if subscriptions:
                    return subscriptions
                else:
                    logger.warning(
                        f"Empty subscriptions list for customer {customer_id} after processing"
                    )
            else:
                # It looks like response format is not as expected or data is empty
                logger.warning(
                    f"No data found in response or empty data array for customer {customer_id}"
                )

            # If we reach here, we need to fall back
            logger.info("Proceeding to fallback method")
        except Exception as e:
            logger.error(f"Error getting customer subscriptions: {e}")
            # Just fall through to fallback

        # Fallback to getting all subscriptions and filtering client-side
        try:
            logger.info("Fallback: Getting all subscriptions and filtering by customer_id")
            response = await self._make_request("get", "subscriptions")

            # Log the response for debugging
            logger.debug(f"Fallback response: {response}")

            subscriptions = []

            if isinstance(response, dict) and "data" in response:
                data_items = response["data"] if isinstance(response["data"], list) else []
                logger.info(f"Found {len(data_items)} total subscriptions in system")

                for sub_data in data_items:
                    try:
                        # First check if this subscription belongs to our customer
                        belongs_to_customer = False

                        # Check relationships structure
                        if "relationships" in sub_data and "customer" in sub_data["relationships"]:
                            customer_rel = sub_data["relationships"]["customer"]
                            if "data" in customer_rel and "id" in customer_rel["data"]:
                                sub_customer_id = customer_rel["data"]["id"]
                                logger.debug(
                                    f"Subscription {sub_data['id']} belongs to customer: {sub_customer_id}"
                                )

                                if sub_customer_id == customer_id:
                                    belongs_to_customer = True

                        # Also check attributes directly (some API versions might include it there)
                        if "attributes" in sub_data and "customer_id" in sub_data["attributes"]:
                            attr_customer_id = str(sub_data["attributes"]["customer_id"])
                            if attr_customer_id == customer_id:
                                belongs_to_customer = True

                        if belongs_to_customer:
                            logger.info(
                                f"Found matching subscription {sub_data['id']} for customer {customer_id}"
                            )

                            if "attributes" not in sub_data:
                                logger.warning(
                                    f"Missing attributes in matching subscription: {sub_data}"
                                )
                                continue

                            attributes = sub_data["attributes"]

                            # Safely extract required fields
                            status = attributes.get("status", "unknown")
                            renews_at = attributes.get("renews_at")

                            # Safely get variant ID
                            variant_id = ""
                            if (
                                "relationships" in sub_data
                                and "variant" in sub_data["relationships"]
                            ):
                                variant_rel = sub_data["relationships"]["variant"]
                                if "data" in variant_rel and "id" in variant_rel["data"]:
                                    variant_id = variant_rel["data"]["id"]

                            subscription = Subscription(
                                id=sub_data["id"],
                                status=status,
                                current_period_end=(
                                    datetime.fromisoformat(renews_at.replace("Z", "+00:00"))
                                    if renews_at
                                    else datetime.now()
                                ),
                                plan_id=variant_id,
                                customer_id=customer_id,
                            )
                            subscriptions.append(subscription)
                    except Exception as item_error:
                        logger.error(f"Error processing subscription in fallback: {item_error}")
                        # Continue with other subscriptions

                if not subscriptions:
                    # Special case: Try looking for the specific customer_id in the response directly
                    logger.debug(
                        f"Special case: Searching for customer_id={customer_id} in full response text"
                    )
                    response_str = str(response)
                    if (
                        f"customer_id': {customer_id}" in response_str
                        or f'"customer_id":{customer_id}' in response_str
                    ):
                        logger.warning(
                            f"Customer ID {customer_id} found in response but couldn't extract subscription properly"
                        )

            logger.info(
                f"Fallback found {len(subscriptions)} subscriptions for customer {customer_id}"
            )
            return subscriptions
        except Exception as inner_e:
            logger.error(f"Error in fallback attempt to get customer subscriptions: {inner_e}")
            # Return empty list rather than raising an exception
            return []

    async def create_customer_portal(self, customer_id: str) -> str:
        """Get the customer portal URL for a customer

        Instead of creating a new portal URL (which 404s), we'll get the
        customer details and use the pre-signed URL they provide
        """
        try:
            logger.info(f"Getting customer portal URL for customer {customer_id}")

            # First check if we already have a subscription for this customer
            # as subscriptions contain a customer portal URL
            try:
                response = await self._make_request("get", f"customers/{customer_id}/subscriptions")
                if isinstance(response, dict) and "data" in response and response["data"]:
                    # Get the first subscription
                    subscription = response["data"][0]
                    if "attributes" in subscription and "urls" in subscription["attributes"]:
                        portal_url = subscription["attributes"]["urls"]["customer_portal"]
                        if portal_url:
                            logger.info(
                                f"Using customer portal URL from subscription: {portal_url}"
                            )
                            return portal_url
            except Exception as sub_error:
                logger.warning(f"Error getting subscriptions for portal URL: {sub_error}")

            # If no subscription or no URL in subscription, try getting the customer
            try:
                response = await self._make_request("get", f"customers/{customer_id}")
                if isinstance(response, dict) and "data" in response:
                    customer = response["data"]
                    if "attributes" in customer and "urls" in customer["attributes"]:
                        portal_url = customer["attributes"]["urls"]["customer_portal"]
                        if portal_url:
                            logger.info(f"Using customer portal URL from customer: {portal_url}")
                            return portal_url
            except Exception as cust_error:
                logger.warning(f"Error getting customer for portal URL: {cust_error}")

            # Fallback to a static URL if API calls fail
            logger.info(f"Using fallback customer portal URL for customer {customer_id}")
            return f"https://store.archspec.dev/billing?user={customer_id}"

        except Exception as e:
            logger.error(f"Error creating customer portal: {e}")
            # Return the fallback URL even if there's an error
            return "https://store.archspec.dev/billing"

    async def get_subscription_by_id(self, subscription_id: str) -> Optional[Subscription]:
        """Get a subscription directly by its ID"""
        try:
            logger.info(f"Getting subscription directly by ID: {subscription_id}")
            response = await self._make_request("get", f"subscriptions/{subscription_id}")

            # Log the full response for debugging
            logger.debug(f"Subscription response: {response}")

            if isinstance(response, dict) and "data" in response:
                sub_data = response["data"]

                # Safely access nested attributes
                if "attributes" in sub_data:
                    attributes = sub_data["attributes"]

                    # Extract required fields with safe defaults
                    status = attributes.get("status", "unknown")
                    renews_at = attributes.get("renews_at")
                    customer_id = str(attributes.get("customer_id", ""))

                    # Safely access the variant ID from relationships
                    variant_id = ""
                    if "relationships" in sub_data and "variant" in sub_data["relationships"]:
                        variant_rel = sub_data["relationships"]["variant"]
                        if "data" in variant_rel and "id" in variant_rel["data"]:
                            variant_id = variant_rel["data"]["id"]

                    # Create subscription object
                    subscription = Subscription(
                        id=sub_data["id"],
                        status=status,
                        current_period_end=(
                            datetime.fromisoformat(renews_at.replace("Z", "+00:00"))
                            if renews_at
                            else datetime.now()
                        ),
                        plan_id=variant_id,
                        customer_id=customer_id,
                    )

                    logger.info(
                        f"Found subscription {subscription_id} with status {subscription.status}"
                    )
                    return subscription
                else:
                    logger.warning(f"Missing 'attributes' in subscription data: {sub_data}")

            logger.warning(f"No subscription found with ID {subscription_id} or invalid format")
            return None
        except Exception as e:
            logger.error(f"Error getting subscription by ID: {e}")
            # Log more details about the error and response
            logger.error(f"Error details: {str(e)}")
            if "response" in locals():
                logger.error(f"Response received: {response}")
            return None


# Create a singleton instance
lemonsqueezy_service = LemonSqueezyService()
