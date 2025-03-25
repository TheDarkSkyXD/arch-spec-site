"""Service for interacting with AI models.

This module provides a service for interacting with AI models, including
methods for generating responses, streaming responses, and processing
specifications.
"""

import logging
from typing import List, Dict, Any, Optional, AsyncGenerator

from .llm_client_factory import LLMClientFactory
from .usage_tracker_interface import UsageTracker
from ..utils.llm_logging import LLMLogger

# Set up logger at module level
logger = logging.getLogger(__name__)

# Constants for model types
INTELLIGENT_MODEL = "claude-3-7-sonnet-20250219"
BACKUP_MODEL = "claude-3-5-sonnet-20241022"
FAST_MODEL = "claude-3-5-haiku-20241022"


class AIService:
    """Service for interacting with AI models.
    
    This service provides a high-level interface for interacting with AI models,
    abstracting away the details of which provider (Anthropic direct or OpenRouter)
    is used.
    
    Attributes:
        llm_client: The LLM client to use for interacting with AI models.
    """
    
    def __init__(self, llm_logger: Optional[LLMLogger] = None, 
                 usage_tracker: Optional[UsageTracker] = None) -> None:
        """Initialize the AI service with optional logger and usage tracker."""
        self.llm_logger = llm_logger
        self.usage_tracker = usage_tracker
        
        # Get the appropriate LLM client from the factory
        self.llm_client = LLMClientFactory.create_client(llm_logger, usage_tracker)
    
    async def generate_response(self, messages: List[Dict[str, str]], system: Optional[str] = None, 
                          model: Optional[str] = None,
                          log_metadata: Optional[Dict[str, Any]] = None,
                          response_type: Optional[str] = None,
                          check_credits: bool = True,
                          use_token_api_for_estimation: bool = True) -> str:
        """Generate a response from the AI model given a conversation history.
        
        Args:
            messages: A list of messages in the conversation history.
                Each message should have a 'role' (either 'user' or 'assistant')
                and 'content' (the text of the message).
            system: Optional system prompt to provide context.
            model: Optional model to use for generating responses.
            log_metadata: Optional metadata to include in the logs.
            response_type: Optional type of response for logging purposes.
            check_credits: Whether to check if the user has sufficient credits.
            use_token_api_for_estimation: Whether to use the token API for credit estimation.
            
        Returns:
            The generated response from the AI model.
        """
        return await self.llm_client.generate_response(
            messages=messages,
            system=system,
            model=model,
            log_metadata=log_metadata,
            response_type=response_type,
            check_credits=check_credits,
            use_token_api_for_estimation=use_token_api_for_estimation
        )
    
    async def stream_response(
        self, 
        messages: List[Dict[str, str]], 
        system: Optional[str] = None, 
        model: Optional[str] = None,
        log_metadata: Optional[Dict[str, Any]] = None,
        response_type: str = "stream_response",
        check_credits: bool = True,
        use_token_api_for_estimation: bool = True
    ) -> AsyncGenerator[str, None]:
        """Stream a response from the AI model given a conversation history.
        
        Args:
            messages: A list of messages in the conversation history.
            system: Optional system prompt.
            model: Optional model to use for generating responses.
            log_metadata: Optional metadata to include in the logs.
            response_type: The type of response for logging purposes.
            check_credits: Whether to check if the user has sufficient credits.
            use_token_api_for_estimation: Whether to use the token API for credit estimation.
            
        Yields:
            Chunks of the generated response from the AI model.
        """
        async for chunk in self.llm_client.stream_response(
            messages=messages,
            system=system,
            model=model,
            log_metadata=log_metadata,
            response_type=response_type,
            check_credits=check_credits,
            use_token_api_for_estimation=use_token_api_for_estimation
        ):
            yield chunk
    
    async def get_tool_use_response(self, system_prompt: str, tools: List[Dict[str, Any]], 
                              messages: List[Dict[str, str]], model: Optional[str] = None,
                              log_metadata: Optional[Dict[str, Any]] = None,
                              response_type: Optional[str] = "tool_use_response",
                              check_credits: bool = True,
                              use_token_api_for_estimation: bool = True) -> Dict[str, Any]:
        """Process a response from the AI model that may contain tool use.
        
        This method handles tool use requests to various AI providers.
        
        Args:
            system_prompt: The system prompt to provide context.
            tools: The tools to make available.
            messages: A list of messages in the conversation history.
            model: Optional model to use for generating responses.
            log_metadata: Optional metadata to include in the logs.
            response_type: Optional type of response for logging purposes.
            check_credits: Whether to check if the user has sufficient credits.
            use_token_api_for_estimation: Whether to use the token API for credit estimation.

        Returns:
            The tool input if found, or a dictionary with an error message if not.
        """
        return await self.llm_client.get_tool_use_response(
            system_prompt=system_prompt,
            tools=tools,
            messages=messages,
            model=model,
            log_metadata=log_metadata,
            response_type=response_type,
            check_credits=check_credits,
            use_token_api_for_estimation=use_token_api_for_estimation
        )
    
    def count_tokens(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, int]:
        """
        Count tokens for a message.

        Args:
            messages: A list of messages in the conversation history.
            system: Optional system prompt.
            model: Optional model to use for token counting.
            tools: Optional list of tools to include in token count.

        Returns:
            A dictionary containing the token count information.
        """
        return self.llm_client.count_tokens(
            messages=messages,
            system=system,
            model=model,
            tools=tools
        )
    
    async def process_specification(self, spec_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process the specification data using the AI model to enhance and fill gaps.
        
        Args:
            spec_data: The specification data to process.
            
        Returns:
            The processed specification data with AI-generated enhancements.
        """
        return await self.llm_client.process_specification(spec_data)