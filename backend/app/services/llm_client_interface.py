"""Interface definition for LLM clients.

This module provides the interface that all LLM clients must implement.
"""

import abc
from typing import List, Dict, Any, Optional, Generator, AsyncGenerator


class LLMClientInterface(abc.ABC):
    """Interface for LLM clients.

    This interface defines the methods that all LLM clients must implement.
    """

    @abc.abstractmethod
    def count_tokens(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, int]:
        """Count tokens for a message."""
        pass

    @abc.abstractmethod
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        log_metadata: Optional[Dict[str, Any]] = None,
        response_type: Optional[str] = None,
        check_credits: bool = True,
        use_token_api_for_estimation: bool = True,
    ) -> str:
        """Generate a response from the LLM."""
        pass

    @abc.abstractmethod
    async def stream_response(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        log_metadata: Optional[Dict[str, Any]] = None,
        response_type: str = "stream_response",
        check_credits: bool = True,
        use_token_api_for_estimation: bool = True,
    ) -> AsyncGenerator[str, None]:
        """Stream a response from the LLM."""
        pass

    @abc.abstractmethod
    async def get_tool_use_response(
        self,
        system_prompt: str,
        tools: List[Dict[str, Any]],
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        log_metadata: Optional[Dict[str, Any]] = None,
        response_type: Optional[str] = "tool_use_response",
        check_credits: bool = True,
        use_token_api_for_estimation: bool = True,
    ) -> Dict[str, Any]:
        """Get a tool use response from the LLM."""
        pass

    @abc.abstractmethod
    async def process_specification(self, spec_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process the specification data using the LLM."""
        pass
