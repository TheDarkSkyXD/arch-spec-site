"""Factory for creating LLM clients.

This module provides a factory for creating instances of LLM clients
based on configuration settings and availability.
"""

import logging
from typing import Optional, Dict, Any, Type

from .llm_client_interface import LLMClientInterface
from .anthropic_client import AnthropicDirectClient
from .openrouter_client import OpenRouterClient
from .usage_tracker_interface import UsageTracker
from ..utils.llm_logging import LLMLogger
from ..core.config import settings

# Set up logger at module level
logger = logging.getLogger(__name__)


class LLMClientFactory:
    """Factory for creating LLM clients.

    This factory creates instances of LLM clients based on configuration settings
    and client availability. It supports failover between different providers.
    """

    @staticmethod
    def create_client(
        llm_logger: Optional[LLMLogger] = None, usage_tracker: Optional[UsageTracker] = None
    ) -> LLMClientInterface:
        """Create an instance of an LLM client.

        This method attempts to create the preferred LLM client based on configuration.
        If the preferred client fails to initialize, it falls back to alternative providers
        if configured to do so.

        Args:
            llm_logger: Optional logger for LLM interactions.
            usage_tracker: Optional usage tracker for LLM interactions.

        Returns:
            An instance of an LLM client.
        """
        # Default to Anthropic Direct client
        preferred_provider = (
            settings.llm.preferred_provider.lower()
            if hasattr(settings.llm, "preferred_provider")
            else "anthropic"
        )
        enable_failover = (
            settings.llm.enable_failover if hasattr(settings.llm, "enable_failover") else False
        )

        # Track initialization attempts
        client_attempts: Dict[str, bool] = {}

        # Try the preferred provider first
        client = LLMClientFactory._try_create_client(
            provider=preferred_provider, llm_logger=llm_logger, usage_tracker=usage_tracker
        )

        client_attempts[preferred_provider] = client is not None and client.client is not None

        # If the preferred client didn't initialize properly and failover is enabled, try alternatives
        if (client is None or client.client is None) and enable_failover:
            logger.warning(
                f"Preferred LLM provider '{preferred_provider}' failed to initialize, trying alternatives"
            )

            # Try other providers in a specific order
            failover_providers = []
            if preferred_provider != "anthropic":
                failover_providers.append("anthropic")
            if preferred_provider != "openrouter":
                failover_providers.append("openrouter")

            for provider in failover_providers:
                if provider in client_attempts:
                    continue  # Skip if we've already tried this provider

                client = LLMClientFactory._try_create_client(
                    provider=provider, llm_logger=llm_logger, usage_tracker=usage_tracker
                )

                client_attempts[provider] = client is not None and client.client is not None

                if client is not None and client.client is not None:
                    logger.info(f"Successfully failed over to '{provider}' LLM provider")
                    break

        # Log the results of our attempts
        succeeded = [p for p, success in client_attempts.items() if success]
        failed = [p for p, success in client_attempts.items() if not success]

        if succeeded:
            logger.info(f"LLM providers initialized successfully: {', '.join(succeeded)}")
        if failed:
            logger.warning(f"LLM providers that failed to initialize: {', '.join(failed)}")

        # Return the client, even if it's not properly initialized
        # The client methods will handle the case where client is None
        return client or AnthropicDirectClient(llm_logger, usage_tracker)

    @staticmethod
    def _try_create_client(
        provider: str,
        llm_logger: Optional[LLMLogger] = None,
        usage_tracker: Optional[UsageTracker] = None,
    ) -> Optional[LLMClientInterface]:
        """Try to create a client for the given provider.

        Args:
            provider: The provider to create a client for.
            llm_logger: Optional logger for LLM interactions.
            usage_tracker: Optional usage tracker for LLM interactions.

        Returns:
            An instance of an LLM client or None if initialization fails.
        """
        try:
            if provider == "anthropic":
                return AnthropicDirectClient(llm_logger, usage_tracker)
            elif provider == "openrouter":
                return OpenRouterClient(llm_logger, usage_tracker)
            else:
                logger.error(f"Unknown LLM provider: {provider}")
                return None
        except Exception as e:
            logger.error(f"Error initializing LLM client for provider '{provider}': {str(e)}")
            return None
