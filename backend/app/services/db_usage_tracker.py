from datetime import datetime, timedelta
import json
import logging
from typing import Dict, Any, Optional

from .usage_tracker_interface import UsageTracker

# Set up logger
logger = logging.getLogger(__name__)

class DatabaseUsageTracker(UsageTracker):
    def __init__(self, db_client):
        self.db = db_client
        # Define token costs per model (these would come from configuration)
        self.model_pricing = {
            "claude-3-7-sonnet-20250219": {
                "input_per_1M": 3.0,   # $3.00 per 1M input tokens
                "output_per_1M": 15.0  # $15.00 per 1M output tokens
            },
            "claude-3-5-sonnet-20241022": {
                "input_per_1M": 3.0,
                "output_per_1M": 15.0
            },
            "claude-3-5-haiku-20241022": {
                "input_per_1M": 0.8,
                "output_per_1M": 4.0
            }
        }
    
    def track_usage(
        self,
        user_id: str,
        model: str,
        input_tokens: int,
        output_tokens: int,
        operation_type: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Track token usage and deduct credits."""
        try:
            timestamp = datetime.now()
            
            # Calculate costs
            model_rates = self._get_model_rates(model)
            input_cost = (input_tokens / 1000000) * model_rates["input_per_1M"]
            output_cost = (output_tokens / 1000000) * model_rates["output_per_1M"]
            total_cost = input_cost + output_cost
            
            # Create usage record
            usage_record = {
                "user_id": user_id,
                "timestamp": timestamp,
                "model": model,
                "operation_type": operation_type,
                "input_tokens": input_tokens,
                "output_tokens": output_tokens,
                "total_tokens": input_tokens + output_tokens,
                "input_cost": input_cost,
                "output_cost": output_cost,
                "total_cost": total_cost,
                "year": timestamp.year,
                "month": timestamp.month,
                "day": timestamp.day,
                "metadata": metadata or {}
            }
            
            # Insert usage record
            self.db.llm_usage.insert_one(usage_record)
            
            # Increment user's credit usage by 1
            self.db.users.update_one(
                {"firebase_uid": user_id},
                {"$inc": {"ai_credits_used": 1}}
            )
            
            # Update aggregated usage stats
            self._update_aggregated_stats(user_id, model, input_tokens, output_tokens, total_cost)
            
            logger.info(f"Tracked {input_tokens}+{output_tokens} tokens for user {user_id}, cost: {total_cost}")
        except Exception as e:
            logger.error(f"Error tracking usage for user {user_id}: {str(e)}")
    
    def get_user_usage(
        self, 
        user_id: str, 
        period: str = "month"
    ) -> Dict[str, Any]:
        """Get detailed usage statistics for a user."""
        try:
            # Determine period start date
            start_date = self._get_period_start_date(period)
            
            # Query database for usage in this period
            pipeline = [
                {
                    "$match": {
                        "user_id": user_id,
                        "timestamp": {"$gte": start_date}
                    }
                },
                {
                    "$group": {
                        "_id": None,
                        "total_input_tokens": {"$sum": "$input_tokens"},
                        "total_output_tokens": {"$sum": "$output_tokens"},
                        "total_tokens": {"$sum": "$total_tokens"},
                        "total_cost": {"$sum": "$total_cost"},
                        "request_count": {"$sum": 1},
                        "models_used": {"$addToSet": "$model"},
                        "operations": {"$addToSet": "$operation_type"}
                    }
                }
            ]
            
            result = list(self.db.llm_usage.aggregate(pipeline))
            
            if not result:
                return {
                    "total_input_tokens": 0,
                    "total_output_tokens": 0,
                    "total_tokens": 0,
                    "total_cost": 0,
                    "request_count": 0,
                    "models_used": [],
                    "operations": [],
                    "period": period
                }
            
            usage_data = result[0]
            usage_data.pop("_id", None)
            usage_data["period"] = period
            
            return usage_data
        except Exception as e:
            logger.error(f"Error getting usage for user {user_id}: {str(e)}")
            return {"error": str(e)}
    
    async def check_credits(
        self, 
        user_id: str,
        estimated_input_tokens: int = 0,
        estimated_output_tokens: int = 0,
        model: Optional[str] = None
    ) -> Dict[str, Any]:
        """Check if a user has sufficient credits for an operation."""
        try:
            # Get user's credit information using firebase_uid
            user = await self.db.users.find_one(
                {"firebase_uid": user_id},
                {"ai_credits": 1, "ai_credits_used": 1, "plan": 1}
            )

            logger.info(f"Checking credits for user {user_id}: {user}")
            
            if user is None:
                logger.warning(f"User {user_id} not found.")
                return {
                    "has_sufficient_credits": False,
                    "error": "User not found"
                }
            
            # Calculate estimated cost of operation
            estimated_cost = 0
            if estimated_input_tokens > 0 or estimated_output_tokens > 0:
                model_rates = self._get_model_rates(model)
                input_cost = (estimated_input_tokens / 1000000) * model_rates["input_per_1M"]
                output_cost = (estimated_output_tokens / 1000000) * model_rates["output_per_1M"]
                estimated_cost = input_cost + output_cost
            
            remaining_credits = user.get("ai_credits", 0) - user.get("ai_credits_used", 0)
            total_credits = user.get("ai_credits", 0)
            
            return {
                "has_sufficient_credits": remaining_credits >= estimated_cost,
                "remaining_credits": remaining_credits,
                "total_credits": total_credits,
                "estimated_cost": estimated_cost,
                "user_tier": user.get("plan", "free"),
                "estimated_input_tokens": estimated_input_tokens,
                "estimated_output_tokens": estimated_output_tokens
            }
        except Exception as e:
            logger.error(f"Error checking credits for user {user_id}: {str(e)}")
            return {
                "has_sufficient_credits": False,
                "error": str(e)
            }
    
    def add_credits(
        self,
        user_id: str,
        amount: float,
        source: str,
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """Add credits to a user's account and record the transaction."""
        try:
            timestamp = datetime.now()
            
            # Record the credit transaction
            transaction = {
                "user_id": user_id,
                "timestamp": timestamp,
                "amount": amount,
                "source": source,
                "notes": notes,
                "type": "credit_add",
                "year": timestamp.year,
                "month": timestamp.month,
                "day": timestamp.day
            }
            
            self.db.credit_transactions.insert_one(transaction)
            
            # Update user's credit balance
            result = self.db.users.update_one(
                {"firebase_uid": user_id},
                {"$inc": {"ai_credits": amount}}
            )
            
            if result.modified_count == 0:
                # User may not exist
                logger.warning(f"User {user_id} not found when adding credits")
                return {
                    "success": False,
                    "error": "User not found"
                }
            
            # Get updated credit information
            user = self.db.users.find_one(
                {"firebase_uid": user_id},
                {"ai_credits": 1, "ai_credits_used": 1}
            )
            
            if not user:
                return {
                    "success": False,
                    "error": "Could not retrieve updated user information"
                }
            
            current_credits = user.get("ai_credits", 0) - user.get("ai_credits_used", 0)
            
            return {
                "success": True,
                "user_id": user_id,
                "amount_added": amount,
                "current_credits": current_credits,
                "transaction_id": str(transaction.get("_id", ""))
            }
        except Exception as e:
            logger.error(f"Error adding credits for user {user_id}: {str(e)}")
            return {"success": False, "error": str(e)}
    
    def _get_model_rates(self, model: Optional[str]) -> Dict[str, float]:
        """Get the pricing rates for a specific model."""
        if not model or model not in self.model_pricing:
            # Default to sonnet if model not specified or not found
            return self.model_pricing["claude-3-sonnet-20240229"]
        return self.model_pricing[model]
    
    def _get_period_start_date(self, period: str) -> datetime:
        """Calculate the start date for the given period."""
        now = datetime.now()
        
        if period == "day":
            return datetime(now.year, now.month, now.day)
        elif period == "week":
            return now - timedelta(days=now.weekday())
        elif period == "month":
            return datetime(now.year, now.month, 1)
        elif period == "year":
            return datetime(now.year, 1, 1)
        elif period == "all":
            return datetime(2000, 1, 1)  # Far in the past
        else:
            # Default to month
            return datetime(now.year, now.month, 1)
    
    def _update_aggregated_stats(
        self, 
        user_id: str, 
        model: str, 
        input_tokens: int, 
        output_tokens: int, 
        cost: float
    ) -> None:
        """Update aggregated usage statistics for reporting."""
        timestamp = datetime.now()
        year_month = f"{timestamp.year}-{timestamp.month:02d}"
        
        # Update monthly aggregates
        self.db.monthly_usage.update_one(
            {
                "user_id": user_id,
                "year_month": year_month
            },
            {
                "$inc": {
                    "input_tokens": input_tokens,
                    "output_tokens": output_tokens,
                    "total_tokens": input_tokens + output_tokens,
                    "cost": cost,
                    "request_count": 1,
                    f"models.{model}.input_tokens": input_tokens,
                    f"models.{model}.output_tokens": output_tokens,
                    f"models.{model}.cost": cost,
                    f"models.{model}.request_count": 1
                },
                "$setOnInsert": {
                    "year": timestamp.year,
                    "month": timestamp.month,
                    "first_request": timestamp
                },
                "$set": {
                    "last_request": timestamp
                }
            },
            upsert=True
        )
