"""Anthropic Claude client implementation.

This module provides a client for interacting with Anthropic Claude API directly.
"""

import json
import logging
from typing import List, Dict, Any, Optional, Generator, AsyncGenerator
from anthropic import Anthropic
from anthropic.types import ContentBlockDeltaEvent

from .base_llm_client import BaseLLMClient
from .usage_tracker_interface import UsageTracker
from ..utils.llm_logging import LLMLogger
from ..core.config import settings

# Set up logger at module level
logger = logging.getLogger(__name__)

# Constants for Anthropic models
INTELLIGENT_MODEL = "claude-3-7-sonnet-20250219"
BACKUP_MODEL = "claude-3-5-sonnet-20241022"
FAST_MODEL = "claude-3-5-haiku-20241022"

class AnthropicDirectClient(BaseLLMClient):
    """Client for interacting with Anthropic Claude API directly.
    
    This client provides methods for generating responses from Claude,
    streaming responses, and handling tool use with the native Anthropic API.
    
    Attributes:
        client: The Anthropic API client.
        model: The model to use for generating responses.
        max_tokens: The maximum number of tokens to generate.
        temperature: The temperature to use for generating responses.
    """
    
    def __init__(
        self, 
        llm_logger: Optional[LLMLogger] = None,
        usage_tracker: Optional[UsageTracker] = None
    ) -> None:
        """Initialize the Anthropic client with optional logger and usage tracker."""
        super().__init__(
            llm_logger=llm_logger,
            usage_tracker=usage_tracker,
            model=settings.anthropic.model,
            max_tokens=settings.anthropic.max_tokens,
            temperature=settings.anthropic.temperature,
            provider_name="anthropic_direct"
        )
        
        try:
            self.client = Anthropic(api_key=settings.anthropic.api_key)
            logger.info("Anthropic client initialized successfully")
        except Exception as e:
            # Log the error but don't crash
            logger.error(f"Error initializing Anthropic client: {str(e)}")
            # Set client to None to indicate it's not available
            self.client = None
    
    def count_tokens(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, int]:
        """
        Count tokens accurately using the Anthropic API's count_tokens endpoint.

        Args:
            messages: A list of messages in the conversation history.
            system: Optional system prompt.
            model: Optional model to use for token counting.
            tools: Optional list of tools to include in token count.

        Returns:
            A dictionary containing the token count information.
        """
        if not self.client:
            return {"input_tokens": 0, "error": "Anthropic client not available"}

        try:
            params: Dict[str, Any] = {
                "model": model if model else self.model,
                "messages": messages
            }
            
            if system:
                params["system"] = system
                
            if tools:
                params["tools"] = tools
                
            response = self.client.messages.count_tokens(**params)
            
            # Convert to dict if it's a structured object
            if hasattr(response, 'model_dump'):
                return response.model_dump()
            elif hasattr(response, 'dict'):
                return response.dict()
            else:
                # If it's already a dict or we can't convert it
                return dict(response)
                
        except Exception as e:
            logger.error(f"Error counting tokens: {str(e)}")
            return {"input_tokens": 0, "error": str(e)}
    
    async def generate_response(
        self, 
        messages: List[Dict[str, str]], 
        system: Optional[str] = None, 
        model: Optional[str] = None,
        log_metadata: Optional[Dict[str, Any]] = None,
        response_type: Optional[str] = None,
        check_credits: bool = True,
        use_token_api_for_estimation: bool = True
    ) -> str:
        """Generate a response from Claude given a conversation history.
        
        Args:
            messages: A list of messages in the conversation history.
                Each message should have a 'role' (either 'user' or 'assistant')
                and 'content' (the text of the message).
            system: Optional system prompt to provide context to Claude.
            model: Optional model to use for generating responses.
            
        Returns:
            The generated response from Claude.
        
        Raises:
            Exception: If there is an error calling the Anthropic API.
        """
        if not self.client:
            return "Error: Anthropic client not available"
        
        # Prepare metadata with default values
        metadata = self._prepare_log_metadata(messages, system, model, log_metadata)
        model_to_use = model if model else self.model
        
        # Check credits before making the call if requested
        if check_credits and self.usage_tracker and "user_id" in metadata and metadata["user_id"]:
            credit_check = await self._check_sufficient_credits(
                metadata["user_id"], 
                messages, 
                system, 
                model_to_use, 
                use_token_api=use_token_api_for_estimation
            )
            logger.info(f"Credit check result: {credit_check}")
            if not credit_check["has_sufficient_credits"]:
                remaining_credits = credit_check.get("remaining_credits", 0)
                error_msg = f"Insufficient credits. You have {remaining_credits} credits remaining."
                return error_msg
            
        try:
            params: Dict[str, Any] = {
                "model": model_to_use,
                "max_tokens": 8192 if model_to_use != INTELLIGENT_MODEL else self.max_tokens,
                "temperature": self.temperature,
                "messages": messages
            }
            
            if system:
                params["system"] = system
                
            response = self.client.messages.create(**params)
            result = ""
            # Extract text from response
            if response.content and len(response.content) > 0 and hasattr(response.content[0], 'text'):
                result = str(response.content[0].text)

            # Log the response and track usage
            self._process_response(response, response_type or "generate_response", metadata)

            return result
        except Exception as e:
            # Log the error
            self._log_error(
                error=e,
                response_type=response_type or "generate_response",
                metadata=metadata
            )
            raise Exception(f"Error calling Anthropic API: {str(e)}")
    
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
        """Stream a response from Claude given a conversation history.
        
        Args:
            messages: A list of messages in the conversation history.
                Each message should have a 'role' (either 'user' or 'assistant')
                and 'content' (the text of the message).
            system: Optional system prompt to provide context to Claude.
            model: Optional model to use for generating responses.
            log_metadata: Optional metadata to include in the logs.
            response_type: The type of response for logging purposes.
            
        Yields:
            Chunks of the generated response from Claude.
        
        Raises:
            Exception: If there is an error streaming from the Anthropic API.
        """
        if not self.client:
            yield "Error: Anthropic client not available"
            return
        
        # Prepare metadata with default values
        metadata = self._prepare_log_metadata(messages, system, model, log_metadata)
        model_to_use = model if model else self.model
        
        # Check credits before making the call if requested
        if check_credits and self.usage_tracker and "user_id" in metadata and metadata["user_id"]:
            credit_check = await self._check_sufficient_credits(
                metadata["user_id"], 
                messages, 
                system, 
                model_to_use, 
                use_token_api=use_token_api_for_estimation
            )
            if not credit_check["has_sufficient_credits"]:
                error_msg = f"Insufficient credits. You have {credit_check['remaining_credits']} credits remaining."
                yield error_msg
                return
            
        try:
            params: Dict[str, Any] = {
                "model": model_to_use,
                "max_tokens": 8192 if model_to_use != INTELLIGENT_MODEL else self.max_tokens,
                "temperature": self.temperature,
                "messages": messages,
                "stream": True
            }
            
            if system:
                params["system"] = system
            
            # Collect the full response for logging
            full_response = ""
            response_obj = None
            
            with self.client.messages.stream(**params) as stream:
                # Get the response object to extract metadata later
                response_obj = stream.response
                
                for chunk in stream:
                    if isinstance(chunk, ContentBlockDeltaEvent) and chunk.delta.text:
                        chunk_text = chunk.delta.text
                        full_response += chunk_text
                        yield chunk_text
            
            # Process the complete response after streaming is done
            if response_obj:
                # Create a complete response object for logging
                response_with_content = response_obj
                # Add the full content for logging
                if hasattr(response_with_content, 'content'):
                    response_with_content.content = [{"type": "text", "text": full_response}]
                self._process_response(response_with_content, response_type, metadata)
                
        except Exception as e:
            # Log the error
            self._log_error(e, response_type, metadata)
            raise Exception(f"Error streaming from Anthropic API: {str(e)}")
            
    def _extract_tool_use_or_json(self, response) -> Dict[str, Any]:
        """Helper to extract tool use from a response or fall back to JSON in text."""
        # Iterate through content blocks to find tool use
        for content_block in response.content:
            if content_block.type == "tool_use":
                # Convert the input to a dictionary to ensure correct return type
                if hasattr(content_block, 'input') and content_block.input is not None:
                    # Convert to dict if it's not already a dict
                    if isinstance(content_block.input, dict):
                        return dict(content_block.input)
                    else:
                        # If it's not a dict, create a dict with the input
                        return {"result": str(content_block.input)}
        
        # If we don't have tool use content, try to extract JSON from text response
        text_content = None
        for content_block in response.content:
            if content_block.type == "text":
                text_content = content_block.text
                break
                
        if text_content:
            # Find JSON object in the response
            start_idx = text_content.find('{')
            end_idx = text_content.rfind('}') + 1
            if start_idx >= 0 and end_idx > start_idx:
                json_str = text_content[start_idx:end_idx]
                result: Dict[str, Any] = {}
                try:
                    result = json.loads(json_str)
                    return result
                except Exception as e:
                    logger.error(f"Error parsing JSON from response: {str(e)}")
                    return {"error": f"Could not parse JSON from response: {str(e)}"}
                
        return {"error": "Could not parse JSON from response"}
    
    async def get_tool_use_response(
        self, 
        system_prompt: str, 
        tools: List[Dict[str, Any]], 
        messages: List[Dict[str, str]], 
        model: Optional[str] = None,
        log_metadata: Optional[Dict[str, Any]] = None,
        response_type: Optional[str] = "tool_use_response",
        check_credits: bool = True,
        use_token_api_for_estimation: bool = True
    ) -> Dict[str, Any]:
        """Process a response from the Anthropic API that may contain tool use.
        
        This method handles the asynchronous nature of tool use in the Anthropic API.
        It checks for tool use content blocks, implements retry logic if needed, and
        falls back to extracting JSON from text content if no tool use is found.
        
        Args:
            system_prompt: The system prompt to provide context to Claude.
            tools: The tools to make available to Claude.
            messages: A list of messages in the conversation history.
            model: Optional model to use for generating responses.

        Returns:
            The tool input if found, or a dictionary with an error message if not.
        """
        
        # Prepare metadata
        metadata = self._prepare_tool_log_metadata(messages, system_prompt, tools, model, log_metadata)
        model_to_use = model if model else self.model
        
        # Check credits before making the call if requested
        if check_credits and self.usage_tracker and "user_id" in metadata and metadata["user_id"]:
            credit_check = await self._check_sufficient_credits(
                metadata["user_id"], 
                messages, 
                system_prompt, 
                model_to_use, 
                tools,
                use_token_api=use_token_api_for_estimation
            )
            if not credit_check["has_sufficient_credits"]:
                return {
                    "error": f"Insufficient credits. You have {credit_check['remaining_credits']} credits remaining."
                }
        
        try:
            params = {
                "model": model_to_use,
                "max_tokens": 8192 if model_to_use != INTELLIGENT_MODEL else self.max_tokens,
                "temperature": self.temperature,
                "system": system_prompt,
                "tools": tools,
                "messages": messages,
            }
            
            if model_to_use == INTELLIGENT_MODEL:
                params["betas"] = ["token-efficient-tools-2025-02-19"]
                logger.info(f"Params using Claude 3.7 and token-efficient-tools-2025-02-19: {params}")
                
                response = self.client.beta.messages.create(**params)
            else:
                logger.info(f"Params: {params}")
                response = self.client.messages.create(**params)
                
            # Extract tool use or process text content
            result = self._extract_tool_use_or_json(response)
            
            # Log the response and track usage
            self._process_response(response, response_type or "tool_use_response", metadata)
            
            return result
                
        except Exception as e:
            # Log the error
            self._log_error(
                error=e,
                response_type=response_type or "tool_use_response",
                metadata=metadata
            )
            return {"error": f"Error with Anthropic API: {str(e)}"}