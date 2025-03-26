"""OpenRouter client implementation using OpenAI SDK.

This module provides a client for interacting with Claude models through OpenRouter
using the OpenAI SDK for compatibility.
"""

import json
import logging
from typing import List, Dict, Any, Optional, AsyncGenerator
from openai import OpenAI

from .base_llm_client import BaseLLMClient
from .usage_tracker_interface import UsageTracker
from ..utils.llm_logging import LLMLogger
from ..core.config import settings

# Set up logger at module level
logger = logging.getLogger(__name__)

# Constants for model mapping - map Anthropic model names to OpenRouter model names
MODEL_MAPPING = {
    "claude-3-7-sonnet-20250219": "anthropic/claude-3.7-sonnet:beta",
    "claude-3-5-sonnet-20241022": "anthropic/claude-3.5-sonnet:latest",
    "claude-3-5-haiku-20241022": "anthropic/claude-3.5-haiku:latest",
}

# Default headers for OpenRouter
DEFAULT_REFERER = "https://archspec.dev"
DEFAULT_TITLE = "ArchSpec"

class OpenRouterClient(BaseLLMClient):
    """Client for interacting with Claude via OpenRouter using OpenAI SDK.
    
    This client provides methods for generating responses from Claude via OpenRouter,
    streaming responses, and handling tool use while maintaining the same interface
    as the direct Anthropic client.
    
    Attributes:
        client: The OpenAI SDK client configured for OpenRouter.
        model: The model to use for generating responses.
        max_tokens: The maximum number of tokens to generate.
        temperature: The temperature to use for generating responses.
    """
    
    def __init__(
        self, 
        llm_logger: Optional[LLMLogger] = None,
        usage_tracker: Optional[UsageTracker] = None
    ) -> None:
        """Initialize the OpenRouter client with optional logger and usage tracker."""
        super().__init__(
            llm_logger=llm_logger,
            usage_tracker=usage_tracker,
            model=settings.anthropic.model,
            max_tokens=settings.anthropic.max_tokens,
            temperature=settings.anthropic.temperature,
            provider_name="openrouter"
        )
        
        try:
            self.client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=settings.openrouter.api_key,
            )
            self.referer = settings.openrouter.referer or DEFAULT_REFERER
            self.title = settings.openrouter.title or DEFAULT_TITLE
            logger.info("OpenRouter client initialized successfully")
        except Exception as e:
            # Log the error but don't crash
            logger.error(f"Error initializing OpenRouter client: {str(e)}")
            # Set client to None to indicate it's not available
            self.client = None
    
    def _get_openrouter_model(self, anthropic_model: str) -> str:
        """Map Anthropic model names to OpenRouter model names."""
        return MODEL_MAPPING.get(anthropic_model, "anthropic/claude-3.5-sonnet:latest")
    
    def _get_extra_headers(self) -> Dict[str, str]:
        """Get extra headers required for OpenRouter."""
        return {
            "HTTP-Referer": self.referer,
            "X-Title": self.title,
        }
        
    def count_tokens(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        model: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, int]:
        """
        Count tokens using the OpenAI tokenizer.
        
        Args:
            messages: A list of messages in the conversation history.
            system: Optional system prompt.
            model: Optional model to use for token counting.
            tools: Optional list of tools to include in token count.

        Returns:
            A dictionary containing the token count information.
        """
        if not self.client:
            return {"input_tokens": 0, "error": "OpenRouter client not available"}

        try:
            # Construct request body
            request_body = {
                "model": self._get_openrouter_model(model if model else self.model),
                "messages": messages
            }
            
            if system:
                # System prompt needs to be added as a system message at the start
                system_message = {"role": "system", "content": system}
                request_body["messages"] = [system_message] + messages
                
            if tools:
                request_body["tools"] = tools
                
            # Call the tokenizer endpoint
            response = self.client.chat.completions.create(**request_body, stream=False)
            
            # Extract token info from the usage field
            if hasattr(response, 'usage') and response.usage:
                return {
                    "input_tokens": response.usage.prompt_tokens,
                    "output_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            
            # If no usage info, make a rough estimate
            return {"input_tokens": self._estimate_tokens(messages, system, tools), "error": "No usage data returned"}
                
        except Exception as e:
            logger.error(f"Error counting tokens: {str(e)}")
            return {"input_tokens": 0, "error": str(e)}
    
    def _estimate_tokens(
        self,
        messages: List[Dict[str, str]],
        system: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None
    ) -> int:
        """Estimate token count (fallback method)."""
        estimated_tokens = 0
        
        # Estimate message tokens (approximately 4 chars per token)
        for msg in messages:
            content = msg.get("content", "")
            # Handle content as string or as a list of blocks
            if isinstance(content, str):
                estimated_tokens += len(content) // 4
            elif isinstance(content, list):
                # Handle content blocks (text, image, etc.)
                for block in content:
                    if isinstance(block, dict):
                        block_type = block.get("type", "")
                        if block_type == "text":
                            estimated_tokens += len(block.get("text", "")) // 4
                        elif block_type == "image":
                            # Images typically use more tokens
                            estimated_tokens += 1000  # Rough estimate for image
        
        # Add system prompt tokens
        if system:
            estimated_tokens += len(system) // 4
        
        # Add tokens for tools (rough estimate)
        if tools:
            tools_json = json.dumps(tools)
            estimated_tokens += len(tools_json) // 4
            # Add overhead for tool processing
            estimated_tokens += 200
        
        return estimated_tokens
    
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
        """Generate a response from Claude via OpenRouter.
        
        Args:
            messages: A list of messages in the conversation history.
                Each message should have a 'role' (either 'user' or 'assistant')
                and 'content' (the text of the message).
            system: Optional system prompt to provide context.
            model: Optional model to use for generating responses.
            
        Returns:
            The generated response text.
        
        Raises:
            Exception: If there is an error calling the OpenRouter API.
        """
        if not self.client:
            return "Error: OpenRouter client not available"
        
        # Prepare metadata with default values
        metadata = self._prepare_log_metadata(messages, system, model, log_metadata)
        model_to_use = model if model else self.model
        openrouter_model = self._get_openrouter_model(model_to_use)
        
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
            # Construct request parameters
            params: Dict[str, Any] = {
                "model": openrouter_model,
                "max_tokens": self.max_tokens,
                "temperature": self.temperature,
                "messages": []
            }
            
            # Add system message if provided
            if system:
                params["messages"].append({"role": "system", "content": system})
                
            # Add user messages
            params["messages"].extend(messages)
            
            # Add OpenRouter extra headers
            params["extra_headers"] = self._get_extra_headers()
                
            # Make the API call
            response = self.client.chat.completions.create(**params)
            result = ""
            
            # Extract text from response
            if response.choices and len(response.choices) > 0:
                result = response.choices[0].message.content or ""

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
            raise Exception(f"Error calling OpenRouter API: {str(e)}")
    
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
        """Stream a response from Claude via OpenRouter.
        
        Args:
            messages: A list of messages in the conversation history.
            system: Optional system prompt.
            model: Optional model to use for generating responses.
            log_metadata: Optional metadata to include in the logs.
            response_type: The type of response for logging purposes.
            
        Yields:
            Chunks of the generated response.
        
        Raises:
            Exception: If there is an error streaming from the OpenRouter API.
        """
        if not self.client:
            yield "Error: OpenRouter client not available"
            return
        
        # Prepare metadata with default values
        metadata = self._prepare_log_metadata(messages, system, model, log_metadata)
        model_to_use = model if model else self.model
        openrouter_model = self._get_openrouter_model(model_to_use)
        
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
            # Construct request parameters
            params: Dict[str, Any] = {
                "model": openrouter_model,
                "max_tokens": self.max_tokens,
                "temperature": self.temperature,
                "messages": [],
                "stream": True
            }
            
            # Add system message if provided
            if system:
                params["messages"].append({"role": "system", "content": system})
                
            # Add user messages
            params["messages"].extend(messages)
            
            # Add OpenRouter extra headers
            params["extra_headers"] = self._get_extra_headers()
            
            # For logging purposes, collect the full response
            full_response = ""
            usage_info = {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
            
            # Stream the response
            stream = await self.client.chat.completions.create(**params)
            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
                    chunk_text = chunk.choices[0].delta.content
                    full_response += chunk_text
                    yield chunk_text
                
                # Update usage info if provided in the chunk
                if hasattr(chunk, 'usage') and chunk.usage:
                    usage_info["prompt_tokens"] = chunk.usage.prompt_tokens
                    usage_info["completion_tokens"] = chunk.usage.completion_tokens
                    usage_info["total_tokens"] = chunk.usage.total_tokens
            
            # Create a complete response object for logging
            complete_response = {
                "choices": [{
                    "message": {"content": full_response}
                }],
                "usage": usage_info,
                "model": openrouter_model
            }
            
            # Process the complete response after streaming is done
            self._process_response(complete_response, response_type, metadata)
                
        except Exception as e:
            # Log the error
            self._log_error(e, response_type, metadata)
            raise Exception(f"Error streaming from OpenRouter API: {str(e)}")
            
    def _extract_json_from_response(self, text_content: str) -> Dict[str, Any]:
        """Helper to extract JSON from text response."""
        if not text_content:
            return {"error": "Empty response"}
            
        # Find JSON object in the response
        start_idx = text_content.find('{')
        end_idx = text_content.rfind('}') + 1
        if start_idx >= 0 and end_idx > start_idx:
            json_str = text_content[start_idx:end_idx]
            try:
                result = json.loads(json_str)
                return result
            except Exception as e:
                logger.error(f"Error parsing JSON from response: {str(e)}")
                return {"error": f"Could not parse JSON from response: {str(e)}"}
                
        return {"error": "Could not find JSON in response"}
    
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
        """Get a tool use response via OpenRouter.
        
        This method uses the OpenAI SDK to get tool calling responses from Claude
        via OpenRouter. It then extracts the tool call data or falls back to parsing
        JSON from text content.
        
        Args:
            system_prompt: The system prompt to provide context.
            tools: The tools to make available.
            messages: A list of messages in the conversation history.
            model: Optional model to use for generating responses.

        Returns:
            The tool use data if found, or a dictionary with an error message if not.
        """
        
        # Prepare metadata
        metadata = self._prepare_tool_log_metadata(messages, system_prompt, tools, model, log_metadata)
        model_to_use = model if model else self.model
        openrouter_model = self._get_openrouter_model(model_to_use)
        
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
            # Construct request parameters
            params = {
                "model": openrouter_model,
                "max_tokens": self.max_tokens,
                "temperature": self.temperature,
                "messages": [],
                "tools": tools
            }
            
            # Add system message if provided
            if system_prompt:
                params["messages"].append({"role": "system", "content": system_prompt})
                
            # Add user messages
            params["messages"].extend(messages)
            
            # Add OpenRouter extra headers
            params["extra_headers"] = self._get_extra_headers()
                
            # Make the API call
            response = self.client.chat.completions.create(**params)
            
            result = {}
            # Check for a tool call in the response
            if (response.choices and len(response.choices) > 0 and 
                response.choices[0].message and 
                response.choices[0].message.tool_calls and 
                len(response.choices[0].message.tool_calls) > 0):
                
                # Extract the first tool call
                tool_call = response.choices[0].message.tool_calls[0]
                if hasattr(tool_call, 'function') and tool_call.function:
                    try:
                        # Parse the function arguments JSON
                        result = json.loads(tool_call.function.arguments)
                    except Exception as e:
                        logger.error(f"Error parsing tool call arguments: {str(e)}")
                        result = {"error": f"Could not parse tool call arguments: {str(e)}"}
            else:
                # No tool call found, try to extract JSON from text response
                content = response.choices[0].message.content if response.choices and response.choices[0].message else ""
                result = self._extract_json_from_response(content)
            
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
            return {"error": f"Error with OpenRouter API: {str(e)}"}