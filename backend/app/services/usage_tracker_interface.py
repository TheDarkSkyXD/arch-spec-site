from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime


class UsageTracker(ABC):
    @abstractmethod
    def track_usage(
        self,
        user_id: str,
        model: str,
        input_tokens: int,
        output_tokens: int,
        operation_type: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Track token usage for a user and update their remaining credits."""
        pass

    @abstractmethod
    def get_user_usage(self, user_id: str, period: str = "month") -> Dict[str, Any]:
        """Get usage statistics for a user for the specified time period."""
        pass

    @abstractmethod
    async def check_credits(
        self,
        user_id: str,
        estimated_input_tokens: int = 0,
        estimated_output_tokens: int = 0,
        model: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Check if a user has sufficient credits for the estimated operation."""
        pass

    @abstractmethod
    def add_credits(
        self, user_id: str, amount: float, source: str, notes: Optional[str] = None
    ) -> Dict[str, Any]:
        """Add credits to a user's account."""
        pass
